-- Auto schedule: the closing time stops NEW starts only. Students still writing (extra time or paused)
-- keep the session open until they submit or their own time runs out; then the session closes by itself.
CREATE OR REPLACE FUNCTION public.apply_exam_schedule() RETURNS void LANGUAGE plpgsql SET search_path=public AS $$
DECLARE s public.exam_settings; a public.exam_attempts; live boolean; done boolean; window_open boolean; still_writing boolean;
BEGIN
 SELECT * INTO s FROM public.exam_settings WHERE id=1 FOR UPDATE;
 -- Freeze silent devices first, then submit only attempts whose own time has run out (paused ones wait for the Director).
 PERFORM public.pause_disconnected_attempts(6);
 FOR a IN SELECT * FROM public.exam_attempts WHERE status='in_progress' AND paused_at IS NULL AND deadline_at<=now() LOOP
  PERFORM public.save_exam_submission(a.id,a.answers,'submitted',a.violations);
 END LOOP;
 done := s.auto_close AND public.exam_everyone_finished(s);
 IF NOT s.auto_schedule THEN
  -- Manual mode: the Director opens the session; it closes by itself once every admitted student has submitted.
  IF s.exam_live AND done THEN UPDATE public.exam_settings SET exam_live=false, auto_completed=true, updated_at=now() WHERE id=1; END IF;
  RETURN;
 END IF;
 window_open := (s.active_bank_id IS NOT NULL OR s.social_bank_id IS NOT NULL) AND s.scheduled_start IS NOT NULL AND s.scheduled_close IS NOT NULL AND now()>=s.scheduled_start AND now()<s.scheduled_close;
 still_writing := s.exam_live AND s.scheduled_start IS NOT NULL AND EXISTS(
  SELECT 1 FROM public.exam_attempts WHERE round=s.current_round AND bank_id IN(s.active_bank_id,s.social_bank_id) AND status='in_progress' AND started_at>=s.scheduled_start);
 live := NOT(s.auto_completed OR done) AND (window_open OR still_writing);
 IF live IS DISTINCT FROM s.exam_live OR (done AND NOT s.auto_completed) THEN UPDATE public.exam_settings SET exam_live=live,auto_completed=auto_completed OR done,updated_at=now() WHERE id=1; END IF;
 IF NOT live AND (done OR s.auto_completed OR (s.scheduled_close IS NOT NULL AND now()>=s.scheduled_close)) THEN
  BEGIN PERFORM cron.unschedule('burka-harbu-auto-exams'); EXCEPTION WHEN OTHERS THEN NULL; END;
 END IF;
END; $$;
REVOKE ALL ON FUNCTION public.apply_exam_schedule() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.apply_exam_schedule() TO service_role;