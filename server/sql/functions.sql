CREATE FUNCTION privateschema.make_pass_word() RETURNS text AS $$
DECLARE
    new_uid text;
    done bool;
BEGIN
    done := false;
    WHILE NOT done LOOP
        new_uid := upper(substr(replace(replace(md5(''||now()::text||random()::text), '0', 'G'),'1' ,'L' ), 1, 10));
        done := NOT exists(SELECT 1 FROM families WHERE pass_word=new_uid);
    END LOOP;
    RETURN new_uid;
END;
$$ LANGUAGE PLPGSQL VOLATILE;