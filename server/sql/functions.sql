-- SERIAL PASSWORD CREATOR

CREATE FUNCTION privateschema.make_pass_word() RETURNS text AS $$
DECLARE
    new_uid text;
    done bool;
BEGIN
    done := false;
    WHILE NOT done LOOP
        new_uid := substr(replace(replace(md5(''||now()::text||random()::text), '0', 'G'),'1' ,'L' ), 1, 10);
        done := NOT exists(SELECT 1 FROM families WHERE pass_word=new_uid);
    END LOOP;
    RETURN new_uid;
END;
$$ LANGUAGE PLPGSQL VOLATILE;

-- AUTH FUNCTION FOR COOKIE

CREATE FUNCTION public.get_auth(
    password_submitted text
) RETURNS privateschema.families AS $$
DECLARE 
    account privateschema.families;
BEGIN
    SELECT * into account FROM privateschema.families WHERE LOWER(pass_word) = LOWER(password_submitted);
    RETURN account
END
$$ LANGUAGE PLPGSQL VOLATILE;