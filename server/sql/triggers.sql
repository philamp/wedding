create function privateschema.tg_update_timestamps() returns trigger as $$
begin
  NEW.created_at = (case when TG_OP = 'INSERT' then NOW() else OLD.created_at end);
  NEW.updated_at = (case when TG_OP = 'UPDATE' then NOW() end);
  return NEW;
end;
$$ language plpgsql volatile set search_path from current;

create trigger timestamps_tg
  after insert or update on privateschema.families
  for each row
  execute function privateschema.tg_update_timestamps();

create trigger privateschema.timestamps_tg
  after insert or update on privateschema.bookings
  for each row
  execute function privateschema.tg_update_timestamps();