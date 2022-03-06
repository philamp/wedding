CREATE DATABASE philippe OWNER philippe;

\c philippe

SET timezone = 'Europe/Paris';

CREATE schema privateschema;

CREATE TABLE privateschema.families (
    family_id SERIAL PRIMARY KEY,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    pass_word text NOT NULL DEFAULT privateschema.make_pass_word(),
    family_name text NOT NULL,
    road_address text,
    road_address_complement text, 
    postal_code text,
    city text,
    country text,
    guest_level INTEGER NOT NULL DEFAULT 1 CHECK (guest_level IN (0, 1, 2)),
    cocktail_attending boolean,
    diner_attending boolean,
    email_address text check(length(email_address) <= 255),
    signing_img_url varchar(255),
    phone character varying(32) COLLATE pg_catalog."default",
    signing text,
    booking_priority INTEGER DEFAULT 0 CHECK (booking_priority IN (0, 1, 2)),
    free_booking boolean, 
    formStep integer DEFAULT 0,
    day_of_arrival varchar(8)
)
;

CREATE TABLE privateschema.logs (
    log_id SERIAL PRIMARY KEY,
    logged_at timestamp not null default now(),
    family_id INTEGER REFERENCES privateschema.families (family_id) ON DELETE CASCADE,
    formStepLogged integer DEFAULT 0
)
;

CREATE TABLE privateschema.persons (
    person_id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL REFERENCES privateschema.families (family_id) ON DELETE CASCADE,
    last_name text,
    first_name text,
    attending boolean DEFAULT true,
    reverse_cocktail_attending boolean,
    reverse_diner_attending boolean,
    age_range varchar(32) NOT NULL DEFAULT 'adulte' CHECK (age_range IN ('bébé', 'enfant', 'adulte')),
    gender varchar(1) NOT NULL DEFAULT 'M' CHECK (gender IN ('M', 'F')),
    food_remarks text
)
;
CREATE TABLE privateschema.tools (
    tool_id SERIAL PRIMARY KEY,
    tool_name varchar(128) NOT NULL,
    quantity INTEGER DEFAULT 1,
    price INTEGER DEFAULT 0,
    tool_type varchar(4)
)
;
CREATE TABLE privateschema.tool_bookings (
    tool_booking_id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES privateschema.tools (tool_id),
    family_id INTEGER REFERENCES privateschema.families (family_id) ON DELETE CASCADE,
    booking_state varchar(32) NOT NULL DEFAULT 'reserved' CHECK (booking_state IN ('open', 'locked', 'reserved')),
    updated_at timestamp not null default now()
)
;
CREATE TABLE privateschema.rooms (
    room_id SERIAL PRIMARY KEY,
    building_name varchar(128) NOT NULL,
    etage INTEGER,
    room_number varchar(24) NOT NULL,
    category_description text,
    capacity INTEGER NOT NULL,
    bedsizes text,
    equipement text,
    one_night_price INTEGER,
    two_night_price INTEGER, 
    max_days integer NOT NULL DEFAULT 1,
    geoloc point
)
;
CREATE TABLE privateschema.bookings (
    booking_id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES privateschema.rooms (room_id),
    family_id INTEGER REFERENCES privateschema.families (family_id),
    booking_state varchar(32) NOT NULL DEFAULT 'pending' CHECK (booking_state IN ('pending', 'option', 'accepted', 'refused')),
    updated_at timestamp not null default now()
);


-- ALTER TABLE
-- ADD COLUMN

--TRUNCATE TABLE privateschema.rooms RESTART IDENTITY CASCADE;
--TRUNCATE TABLE privateschema.families RESTART IDENTITY CASCADE;