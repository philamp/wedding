create function privateschema.tg_update_timestamps() returns trigger as $$
begin
  NEW.created_at = (case when TG_OP = 'INSERT' then NOW() else OLD.created_at end);
  NEW.updated_at = (case when TG_OP = 'UPDATE' and OLD.updated_at <= NOW() then OLD.updated_at + interval '1 millisecond' else NOW() end);
  return NEW;
end;
$$ language plpgsql volatile set search_path from current;

create trigger privateschema.timestamps_tg
  after insert or update on privateschema.families
  for each row
  execute procedure privateschema.tg_update_timestamps();