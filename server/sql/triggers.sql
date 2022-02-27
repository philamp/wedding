CREATE OR REPLACE FUNCTION privateschema.tg_logs()
    RETURNS trigger
    LANGUAGE 'plpgsql'
AS 
$$
begin
    INSERT INTO privateschema.logs (logged_at, formStepLogged, family_id) VALUES (now(), NEW."formStep", OLD.family_id);
  -- NEW.created_at = (case when TG_OP = 'INSERT' then NOW() else OLD.created_at end);
  -- NEW.updated_at = (case when TG_OP = 'UPDATE' then NOW() end);
  return NEW;
end;
$$
;

ALTER FUNCTION privateschema.tg_update_timestamps()
    OWNER TO philippe;

create trigger logs_tg
  after update on privateschema.families
  for each row
  execute function privateschema.tg_logs();

