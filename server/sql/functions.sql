-- SERIAL PASSWORD CREATOR

CREATE OR REPLACE FUNCTION privateschema.make_pass_word() RETURNS text AS $$
DECLARE
    new_uid text;
    done bool;
BEGIN
    done := false;
    WHILE NOT done LOOP
        new_uid := substr(replace(replace(md5(''||now()::text||random()::text), '0', 'G'),'1' ,'L' ), 1, 8);
        done := NOT exists(SELECT 1 FROM families WHERE pass_word=new_uid);
    END LOOP;
    RETURN new_uid;
END;
$$ LANGUAGE PLPGSQL VOLATILE;

-- AUTH FUNCTION FOR COOKIE

CREATE OR REPLACE FUNCTION public.get_auth(
    password_submitted text
) RETURNS privateschema.families AS $$
DECLARE 
    account privateschema.families;
BEGIN
    SELECT * into account FROM privateschema.families WHERE LOWER(pass_word) = LOWER(password_submitted);
    RETURN account
END
$$ LANGUAGE PLPGSQL VOLATILE;

-- CREATE BOOKING FUNC v2

CREATE OR REPLACE FUNCTION privateschema.make_tool_bookingv4(family_id_submitted INTEGER, tool_id_submitted INTEGER, booking_state_submitted TEXT)
RETURNS privateschema.tool_bookings
AS 
$$
DECLARE
    toolbooking privateschema.tool_bookings;
    absolute_count INTEGER;
    taken_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO taken_count FROM privateschema.tool_bookings WHERE tool_id = tool_id_submitted AND booking_state != 'open';
    SELECT quantity into absolute_count FROM privateschema.tools WHERE tool_id = tool_id_submitted LIMIT 1;
    IF (absolute_count - taken_count < 1) THEN
        RAISE NOTICE 'Not enough of this tool';
    ELSE
    -- SELECT * INTO tool FROM privateschema.tools WHERE (quantity - taken_count) > 0 AND tool_id = tool_id_submitted LIMIT 1;
    INSERT INTO privateschema.tool_bookings (tool_id, family_id, booking_state) VALUES (tool_id_submitted, family_id_submitted, booking_state_submitted) RETURNING * into toolbooking;
    END IF;
	RETURN toolbooking;
END
$$  LANGUAGE plpgsql;

--- VIEW tools with remaning count (remaining = total - 'every tool which is not open')
DROP VIEW privateschema.view_available_tools;
CREATE OR REPLACE VIEW privateschema.view_available_tools
 AS
 SELECT tools.tool_id,
    tools.tool_name,
    tools.quantity,
    COALESCE(toolbk.counter, 0::bigint)::integer AS taken,
    tools.quantity - COALESCE(toolbk.counter, 0::bigint)::integer AS remaining
   FROM privateschema.tools
     LEFT JOIN ( SELECT count(*) AS counter,
            tool_bookings.tool_id
           FROM privateschema.tool_bookings
          WHERE tool_bookings.booking_state::text <> 'open'::text
          GROUP BY tool_bookings.tool_id) toolbk ON toolbk.tool_id = tools.tool_id

----- VIEW FOR MAILING
DROP VIEW privateschema.view_mailings;
CREATE OR REPLACE VIEW privateschema.view_mailings
  AS
SELECT
  CONCAT('https://helenephilippe.ch/#/P/', privateschema.families.pass_word) as mailing_url,
   CONCAT(REGEXP_REPLACE(array_to_string(array_agg(privateschema.persons.first_name ORDER BY privateschema.persons.person_id), ', '),',(?=[^,]*$)',' &','gi'), ', ') as mailing_names, 
  array_to_string(array_agg(privateschema.persons.gender), ', ') as mailing_genders,
  COUNT(privateschema.persons.*) as mailing_people_count,
  COALESCE ( max(rmbk.counter), 0) as mailing_number_of_rooms,
  max(rmbk.total_capacity ) as mailing_room_total_capacity,
  CASE WHEN privateschema.families.guest_level = 2 THEN 'et dîner' ELSE '' END AS mailing_diner,
  COALESCE (  max(invt.invitedcounter), 0) as mailing_number_of_persons_coming,
        CASE
            WHEN max(rmbk.counter) > 0 THEN 'Vous pouvez disposer d’un logement sur place : voir le site'::text
            ELSE 'Merci de répondre de préférence via le site'::text
        END AS mailing_text_booking,
  	CASE WHEN 
		COUNT(privateschema.persons.*) > 1
	THEN 
		CASE WHEN 
			POSITION('M' in array_to_string(array_agg(privateschema.persons.gender), ', ')) != 0 
		THEN 'Chers'
		ELSE 'Chères'
		END 
	ELSE CASE WHEN 
			POSITION('F' in array_to_string(array_agg(privateschema.persons.gender), ', ')) != 0 
		THEN 'Chère' ELSE 'Cher' END END as mailing_cher,
  privateschema.families.*
  FROM 
  privateschema.families
  
  	LEFT JOIN ( SELECT count(*) AS invitedcounter, persons.family_id
           FROM privateschema.persons LEFT JOIN privateschema.families ON families.family_id = persons.family_id
          WHERE persons.attending = true AND families.cocktail_attending = true
          GROUP BY persons.family_id) invt 
		  ON invt.family_id = families.family_id
  
      LEFT JOIN ( SELECT count(*) AS counter,
            bookings.family_id,
				 sum(rooms.capacity) as total_capacity
           FROM privateschema.bookings LEFT JOIN privateschema.rooms ON rooms.room_id = bookings.room_id
          WHERE bookings.booking_state::text IN ('pending','accepted')
          GROUP BY bookings.family_id ) rmbk 
		  ON rmbk.family_id = families.family_id

  RIGHT JOIN 
  privateschema.persons 
  on 
  privateschema.persons.family_id = privateschema.families.family_id

  WHERE privateschema.families.guest_level > 0 -- switch en enveloppe / carton
  
  GROUP BY 
  privateschema.families.family_id