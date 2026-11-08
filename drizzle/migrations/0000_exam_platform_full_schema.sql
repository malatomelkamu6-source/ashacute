-- lovable-cron-fallback-reviewed: Time-based exam opening/closing must work without viewers; the minute-level job is armed only while Auto has a future closing time and unschedules itself after closing, completion or disabling.
CREATE TABLE public.school_roster (
 id text PRIMARY KEY, full_name text NOT NULL,
 kind text NOT NULL CHECK (kind IN ('student','teacher')),
 grade text NOT NULL DEFAULT '12', section text NOT NULL DEFAULT '',
 stream text NOT NULL, gender text NOT NULL DEFAULT '', subjects text[] NOT NULL DEFAULT '{}',
 batch text NOT NULL DEFAULT 'Batch 1'
);
COMMENT ON COLUMN public.school_roster.batch IS 'Upload batch label; new Excel uploads get a new batch so previous batches stay stored.';
GRANT ALL ON public.school_roster TO service_role;
ALTER TABLE public.school_roster ENABLE ROW LEVEL SECURITY;
INSERT INTO public.school_roster (id,full_name,kind,grade,section,stream,gender,subjects) VALUES
('BH-12A-01','Abdi Alemu Merga','student','12','A','Natural Science','M','{}'),
('BH-12A-02','Abel Minda Delelegn','student','12','A','Natural Science','M','{}'),
('BH-12A-03','Abreham Worku Asfaw','student','12','A','Natural Science','M','{}'),
('BH-12A-04','Amen Menbere Sheferaw','student','12','A','Natural Science','F','{}'),
('BH-12A-05','Arsema Simeneh Gudeta','student','12','A','Natural Science','F','{}'),
('BH-12A-06','Ashenafi Teklu Girma','student','12','A','Natural Science','M','{}'),
('BH-12A-07','Ashenafi Ayele Gurmu','student','12','A','Natural Science','M','{}'),
('BH-12A-08','Barnabas Tilahun Negeho','student','12','A','Natural Science','M','{}'),
('BH-12A-09','Biruk Getachew Tsegaye','student','12','A','Natural Science','M','{}'),
('BH-12A-10','Degaga Dereje Teshome','student','12','A','Natural Science','M','{}'),
('BH-12A-11','Dejene Gebisa Mirkena','student','12','A','Natural Science','M','{}'),
('BH-12A-12','Etsegenet Meles Asefa','student','12','A','Natural Science','F','{}'),
('BH-12A-13','Eyob Zinaye Abe','student','12','A','Natural Science','M','{}'),
('BH-12A-14','Fenet Bekele Dida','student','12','A','Natural Science','F','{}'),
('BH-12A-15','Fenet Merga Gutu','student','12','A','Natural Science','F','{}'),
('BH-12A-16','Gemechis Abdeta Daba','student','12','A','Natural Science','M','{}'),
('BH-12A-17','Habtamu Shifera Dida','student','12','A','Natural Science','M','{}'),
('BH-12A-18','Hana Mersha Zemene','student','12','A','Natural Science','F','{}'),
('BH-12A-19','Hana Worku Wolde','student','12','A','Natural Science','F','{}'),
('BH-12A-20','Hasena Seid Mohamed','student','12','A','Natural Science','F','{}'),
('BH-12A-21','Hiwot Alemayehu Belay','student','12','A','Natural Science','F','{}'),
('BH-12A-22','Hundaol Teshome Megersa','student','12','A','Natural Science','M','{}'),
('BH-12A-23','Hunduma Shifera Dida','student','12','A','Natural Science','M','{}'),
('BH-12A-24','Kenean Addisu Diba','student','12','A','Natural Science','F','{}'),
('BH-12A-25','Lemi Lelisa Megnata','student','12','A','Natural Science','M','{}'),
('BH-12A-26','Letu Keba File','student','12','A','Natural Science','F','{}'),
('BH-12A-27','Mekidelawit Tilahun Dinku','student','12','A','Natural Science','F','{}'),
('BH-12A-28','Melkam Amberbir Tamire','student','12','A','Natural Science','F','{}'),
('BH-12A-29','Melkamu Abera Debelo','student','12','A','Natural Science','M','{}'),
('BH-12A-30','Monet Cherinet Mamo','student','12','A','Natural Science','F','{}'),
('BH-12A-31','Nanati Muleta Asefa','student','12','A','Natural Science','F','{}'),
('BH-12A-32','Peniel Amsalu Gila','student','12','A','Natural Science','F','{}'),
('BH-12A-33','Rebira Fufa Dorsis','student','12','A','Natural Science','M','{}'),
('BH-12A-34','Rediet Teshome Muzo','student','12','A','Natural Science','M','{}'),
('BH-12A-35','Sena Zewdu Ararso','student','12','A','Natural Science','F','{}'),
('BH-12A-36','Sifan Garedew Tafesse','student','12','A','Natural Science','F','{}'),
('BH-12A-37','Sifan Getahun H/Mikael','student','12','A','Natural Science','F','{}'),
('BH-12A-38','Simale Dejene Tiki','student','12','A','Natural Science','F','{}'),
('BH-12A-39','Simbone Tadese Teklemariyam','student','12','A','Natural Science','F','{}'),
('BH-12A-40','Sophonias Zewdie Wendatir','student','12','A','Natural Science','M','{}'),
('BH-12A-41','Yigermal Aimero Mose','student','12','A','Natural Science','M','{}'),
('BH-12A-42','Yohanis Yimam Hasen','student','12','A','Natural Science','M','{}'),
('BH-12A-43','Yohanis kefiyalewu Beyene','student','12','A','Natural Science','M','{}'),
('BH-12B-01','Abdi Bekele Geremew','student','12','B','Natural Science','M','{}'),
('BH-12B-02','Abdi Ejeta Gedefa','student','12','B','Natural Science','M','{}'),
('BH-12B-03','Abdi Morka Bacha','student','12','B','Natural Science','M','{}'),
('BH-12B-04','Abdisa Dibaba Seglen','student','12','B','Natural Science','M','{}'),
('BH-12B-05','Abenezer Tamene Tekile','student','12','B','Natural Science','M','{}'),
('BH-12B-06','Abreham Fufa Debu','student','12','B','Natural Science','M','{}'),
('BH-12B-07','Amayu Kassaye Deti','student','12','B','Natural Science','M','{}'),
('BH-12B-08','Amen Mekonnen Hurisa','student','12','B','Natural Science','M','{}'),
('BH-12B-09','Ayantu Dereje Fanta','student','12','B','Natural Science','F','{}'),
('BH-12B-10','Ayantu Tolesa Tufa','student','12','B','Natural Science','F','{}'),
('BH-12B-11','Bikiltu Girma Muleta','student','12','B','Natural Science','F','{}'),
('BH-12B-12','Biniyam Tadese Hailu','student','12','B','Natural Science','M','{}'),
('BH-12B-13','Bontu Deressa Amose','student','12','B','Natural Science','F','{}'),
('BH-12B-14','Dawit Fikiru Hajilu','student','12','B','Natural Science','M','{}'),
('BH-12B-15','Diriba Alemu Ashetu','student','12','B','Natural Science','M','{}'),
('BH-12B-16','Elsabet Gedefa Chuko','student','12','B','Natural Science','F','{}'),
('BH-12B-17','Fenet Dereje Inki','student','12','B','Natural Science','F','{}'),
('BH-12B-18','Firaol Teshome Gutema','student','12','B','Natural Science','F','{}'),
('BH-12B-19','Gemechu Tiku Birhanu','student','12','B','Natural Science','M','{}'),
('BH-12B-20','Getu Gelasa Angos','student','12','B','Natural Science','M','{}'),
('BH-12B-21','Habtamu workineh Merga','student','12','B','Natural Science','M','{}'),
('BH-12B-22','Hawi Chala Tujuba','student','12','B','Natural Science','F','{}'),
('BH-12B-23','Hawinet Temam Imam','student','12','B','Natural Science','F','{}'),
('BH-12B-24','Hundaol Mokonnin Gudisa','student','12','B','Natural Science','M','{}'),
('BH-12B-25','Ifa Berecha Negasa','student','12','B','Natural Science','M','{}'),
('BH-12B-26','Kirubel Mekonnen Dinsa','student','12','B','Natural Science','M','{}'),
('BH-12B-27','Malato Melkamu Deksa','student','12','B','Natural Science','M','{}'),
('BH-12B-28','Nafirom Tadesse Zewude','student','12','B','Natural Science','M','{}'),
('BH-12B-29','Naol Desta Adaba','student','12','B','Natural Science','M','{}'),
('BH-12B-30','Nimona Asmera Gari','student','12','B','Natural Science','M','{}'),
('BH-12B-31','Olira Ibsa Fite','student','12','B','Natural Science','M','{}'),
('BH-12B-32','Rabira Demelash Dechasa','student','12','B','Natural Science','M','{}'),
('BH-12B-33','Rebira Tsegaye Tadese','student','12','B','Natural Science','M','{}'),
('BH-12B-34','Roba Getachew Gutu','student','12','B','Natural Science','M','{}'),
('BH-12B-35','Roman Deme Dekeba','student','12','B','Natural Science','F','{}'),
('BH-12B-36','Sagni Gudina Mosisa','student','12','B','Natural Science','M','{}'),
('BH-12B-37','Simbone Regasa Tafese','student','12','B','Natural Science','F','{}'),
('BH-12B-38','Tamirat Adugna Angessa','student','12','B','Natural Science','M','{}'),
('BH-12B-39','Tsiyon Asfawu Negash','student','12','B','Natural Science','F','{}'),
('BH-12B-40','Wondimu Mengistu Negash','student','12','B','Natural Science','M','{}'),
('BH-12B-41','Yoseph Adugna Seboka','student','12','B','Natural Science','M','{}'),
('BH-12C-01','Ananiya Chanyalew Mulugeta','student','12','C','Social Science','F','{}'),
('BH-12C-02','Aynalem Kebede Magarsa','student','12','C','Social Science','F','{}'),
('BH-12C-03','Fenan Tadesse Letera','student','12','C','Social Science','F','{}'),
('BH-12C-04','Feven Damtew Birhanu','student','12','C','Social Science','F','{}'),
('BH-12C-05','Firomse Daro Feyisa','student','12','C','Social Science','F','{}'),
('BH-12C-06','Habtamu Tolesa Keneni','student','12','C','Social Science','M','{}'),
('BH-12C-07','Hana Diriba Dida','student','12','C','Social Science','F','{}'),
('BH-12C-08','Hawi Girma Dadi','student','12','C','Social Science','F','{}'),
('BH-12C-09','koriche Guta Regane','student','12','C','Social Science','F','{}'),
('BH-12C-10','Mehiretab Fikadu Kebede','student','12','C','Social Science','M','{}'),
('BH-12C-11','Meti Regasa Tafese','student','12','C','Social Science','F','{}'),
('BH-12C-12','Naja Shamsu Teshome','student','12','C','Social Science','M','{}'),
('BH-12C-13','Nightlight Fikadu Hirko','student','12','C','Social Science','F','{}'),
('BH-12C-14','Rediet Fikadu Kebede','student','12','C','Social Science','F','{}'),
('BH-12C-15','Selom Lemma Regasa','student','12','C','Social Science','F','{}'),
('BH-12C-16','Sena Hailu Jifar','student','12','C','Social Science','F','{}'),
('BH-12C-17','Sinan Arega Sufa','student','12','C','Social Science','F','{}'),
('BH-12C-18','Situnaf Chala Keneni','student','12','C','Social Science','F','{}'),
('BH-12C-19','Tsion Fikadu Bedada','student','12','C','Social Science','F','{}'),
('BH-12C-20','Yeabsira Mesfin Tena','student','12','C','Social Science','F','{}'),
('BH-12C-21','Yerosen Abiyot Kumsa','student','12','C','Social Science','F','{}'),
('T-NAT-01','Taarraqany Abdisaa Guutaa','teacher','12','','Natural Science','','{Physics}'),
('T-NAT-02','Isheetuu Dirribaa Bayyanaa','teacher','12','','Natural Science','','{Chemistry}'),
('T-NAT-03','Toomaas Tsaggaa Sirnaa','teacher','12','','Natural Science','','{Biology}'),
('T-NAT-04','Ermiyaas Zagayyee Bayechaa','teacher','12','','Natural Science','','{Mathematics}'),
('T-NAT-05','Galataaw Tashooma H/masqal','teacher','12','','Both','','{English}'),
('T-SOC-01','Xi’umalissan Dinbaru Birhaan','teacher','12','','Social Science','','{Geography}'),
('T-SOC-02','Masfin Tarrafa Daggafaa','teacher','12','','Social Science','','{History}'),
('T-SOC-03','Guutaa Lataa Kafanii','teacher','12','','Social Science','','{Economics}'),
('T-SOC-04','Lammaa Rggaasaa Damee','teacher','12','','Both','','{English}'),
('T-SOC-05','Girmaa Gaaddisaa Korsaa','teacher','12','','Social Science','','{Mathematics}')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE public.registered_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_code text NOT NULL UNIQUE,
  full_name text NOT NULL, grade text NOT NULL DEFAULT '12',
  section text NOT NULL, stream text NOT NULL, gender text NOT NULL,
  photo_path text NOT NULL, face_verified boolean NOT NULL DEFAULT false,
  roster_id text REFERENCES public.school_roster(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  session_token text, session_seen_at timestamptz,
  results_pin_hash text
);
CREATE UNIQUE INDEX registered_students_roster_unique ON public.registered_students(roster_id);
GRANT ALL ON public.registered_students TO service_role;
ALTER TABLE public.registered_students ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.question_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL, title text NOT NULL,
  teacher_id text REFERENCES public.school_roster(id),
  status text NOT NULL DEFAULT 'draft' CONSTRAINT question_banks_status_check CHECK (status IN ('draft','queued','archived')),
  questions jsonb NOT NULL DEFAULT '[]',
  target_stream text CONSTRAINT bank_target_stream CHECK (target_stream IN ('Natural Science','Social Science')),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.question_banks TO service_role;
ALTER TABLE public.question_banks ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.exam_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  exam_live boolean NOT NULL DEFAULT false,
  results_published boolean NOT NULL DEFAULT false,
  registration_open boolean NOT NULL DEFAULT true,
  sat_enabled boolean NOT NULL DEFAULT false,
  current_round int NOT NULL DEFAULT 1,
  active_bank_id uuid,
  duration_sec int NOT NULL DEFAULT 3600,
  ends_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  scheduled_start timestamptz, scheduled_close timestamptz,
  extension_sec integer NOT NULL DEFAULT 0,
  auto_schedule boolean NOT NULL DEFAULT false,
  social_bank_id uuid REFERENCES public.question_banks(id),
  selected_student_codes text[],
  auto_completed boolean NOT NULL DEFAULT false,
  hidden_staff_roles text[] NOT NULL DEFAULT '{}',
  auto_close boolean NOT NULL DEFAULT true
);
COMMENT ON COLUMN public.exam_settings.ends_at IS 'DEPRECATED: individual deadlines are stored on exam_attempts';
GRANT ALL ON public.exam_settings TO service_role;
ALTER TABLE public.exam_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.exam_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE public.exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  round int NOT NULL, bank_id uuid NOT NULL REFERENCES public.question_banks(id),
  student_code text NOT NULL REFERENCES public.registered_students(student_code) ON UPDATE CASCADE,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','submitted','blocked')),
  answers jsonb NOT NULL DEFAULT '{}', violations int NOT NULL DEFAULT 0,
  score int, total int, started_at timestamptz NOT NULL DEFAULT now(), submitted_at timestamptz,
  deadline_at timestamptz, paused_at timestamptz,
  last_seen_at timestamptz, current_question integer NOT NULL DEFAULT 0,
  pause_reason text, bonus_questions text[] NOT NULL DEFAULT '{}',
  results_reset_at timestamptz,
  UNIQUE (round, bank_id, student_code)
);
GRANT ALL ON public.exam_attempts TO service_role;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.exam_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL, student_code text NOT NULL, message text NOT NULL,
  round int, teacher_id text, bank_id uuid, question_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  dismissed_at timestamptz, teacher_dismissed_at timestamptz
);
GRANT ALL ON public.exam_events TO service_role;
ALTER TABLE public.exam_events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.round_results (
  round int NOT NULL, student_code text NOT NULL, subject text NOT NULL,
  score_pct int NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (round, student_code, subject)
);
GRANT ALL ON public.round_results TO service_role;
ALTER TABLE public.round_results ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.staff_credentials (
  role TEXT PRIMARY KEY CONSTRAINT staff_credentials_role_check CHECK (role IN ('director','teacher') OR role LIKE 'teacher:%'),
  passcode TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.staff_credentials TO service_role;
ALTER TABLE public.staff_credentials ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.exam_rounds (round integer PRIMARY KEY, archived_at timestamptz);
GRANT ALL ON public.exam_rounds TO service_role;
ALTER TABLE public.exam_rounds ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.admin_edit_identity_name(person_id text, person_target text, new_name text) RETURNS void LANGUAGE plpgsql SET search_path = public AS $$
DECLARE linked_id text;
BEGIN
 IF length(trim(new_name)) < 3 OR length(new_name) > 100 THEN RAISE EXCEPTION 'Invalid name'; END IF;
 IF person_target = 'roster' THEN
  UPDATE public.school_roster SET full_name = new_name WHERE id = person_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Not found'; END IF;
  UPDATE public.registered_students SET full_name = new_name WHERE roster_id = person_id;
 ELSIF person_target = 'registered' THEN
  UPDATE public.registered_students SET full_name = new_name WHERE student_code = person_id RETURNING roster_id INTO linked_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Not found'; END IF;
  IF linked_id IS NOT NULL THEN UPDATE public.school_roster SET full_name = new_name WHERE id = linked_id; END IF;
 ELSE RAISE EXCEPTION 'Invalid target'; END IF;
END; $$;
REVOKE ALL ON FUNCTION public.admin_edit_identity_name(text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_edit_identity_name(text,text,text) TO service_role;

CREATE OR REPLACE FUNCTION public.save_exam_submission(p_attempt uuid, p_answers jsonb, p_status text, p_violations integer) RETURNS void LANGUAGE plpgsql SET search_path=public AS $$
DECLARE a public.exam_attempts; qs jsonb; earned integer; possible integer; subj text;
BEGIN
 SELECT * INTO a FROM public.exam_attempts WHERE id=p_attempt FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Attempt not found'; END IF;
 SELECT questions,subject INTO qs,subj FROM public.question_banks WHERE id=a.bank_id;
 IF a.status <> 'in_progress' THEN RETURN; END IF;
 SELECT COALESCE(sum(CASE WHEN (p_answers->>(q->>'id'))::integer = (q->>'answer')::integer OR (q->>'id') = ANY(a.bonus_questions) THEN (q->>'marks')::integer ELSE 0 END),0), COALESCE(sum((q->>'marks')::integer),0) INTO earned,possible FROM jsonb_array_elements(qs) q;
 UPDATE public.exam_attempts SET answers=p_answers,status=p_status,violations=p_violations,score=earned,total=possible,submitted_at=now(),paused_at=NULL,pause_reason=NULL WHERE id=p_attempt;
 INSERT INTO public.round_results(round,student_code,subject,score_pct) VALUES(a.round,a.student_code,subj,CASE WHEN possible>0 THEN round(earned*100.0/possible) ELSE 0 END) ON CONFLICT(round,student_code,subject) DO UPDATE SET score_pct=EXCLUDED.score_pct,updated_at=now();
END; $$;
REVOKE ALL ON FUNCTION public.save_exam_submission(uuid,jsonb,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_exam_submission(uuid,jsonb,text,integer) TO service_role;

CREATE OR REPLACE FUNCTION public.extend_exam_minutes(p_minutes integer) RETURNS void LANGUAGE plpgsql SET search_path=public AS $$
DECLARE s public.exam_settings;
BEGIN
 IF p_minutes<1 OR p_minutes>180 THEN RAISE EXCEPTION 'Invalid minutes'; END IF;
 SELECT * INTO s FROM public.exam_settings WHERE id=1 FOR UPDATE;
 UPDATE public.exam_settings SET extension_sec=extension_sec+p_minutes*60,scheduled_close=CASE WHEN auto_schedule THEN scheduled_close+make_interval(mins=>p_minutes) ELSE scheduled_close END,updated_at=now() WHERE id=1;
 UPDATE public.exam_attempts SET deadline_at=deadline_at+make_interval(mins=>p_minutes) WHERE round=s.current_round AND bank_id IN(s.active_bank_id,s.social_bank_id) AND status='in_progress';
END; $$;
REVOKE ALL ON FUNCTION public.extend_exam_minutes(integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.extend_exam_minutes(integer) TO service_role;

-- Freezes the timer of a student whose device stopped reporting (power or internet loss) at the moment it was last seen.
CREATE OR REPLACE FUNCTION public.pause_disconnected_attempts(p_grace_sec integer) RETURNS integer LANGUAGE plpgsql SET search_path=public AS $$
DECLARE n integer;
BEGIN
 UPDATE public.exam_attempts SET paused_at=last_seen_at, pause_reason='connection'
 WHERE status='in_progress' AND paused_at IS NULL AND last_seen_at IS NOT NULL
   AND last_seen_at < now()-make_interval(secs=>p_grace_sec) AND deadline_at > last_seen_at;
 GET DIAGNOSTICS n = ROW_COUNT;
 RETURN n;
END; $$;
REVOKE ALL ON FUNCTION public.pause_disconnected_attempts(integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.pause_disconnected_attempts(integer) TO service_role;

CREATE OR REPLACE FUNCTION public.director_attempt_time(p_attempt uuid, p_action text, p_minutes integer) RETURNS void LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF p_action='extend' THEN
  IF p_minutes IS NULL OR p_minutes<1 OR p_minutes>180 THEN RAISE EXCEPTION 'Invalid minutes'; END IF;
  UPDATE public.exam_attempts SET deadline_at=deadline_at+make_interval(mins=>p_minutes) WHERE id=p_attempt AND status='in_progress';
 ELSIF p_action='pause' THEN
  UPDATE public.exam_attempts SET paused_at=now(), pause_reason='director' WHERE id=p_attempt AND status='in_progress' AND paused_at IS NULL AND deadline_at>now();
 ELSIF p_action='resume' THEN
  UPDATE public.exam_attempts SET deadline_at=deadline_at+(now()-paused_at), paused_at=NULL, pause_reason=NULL, last_seen_at=now() WHERE id=p_attempt AND status='in_progress' AND paused_at IS NOT NULL;
 ELSE RAISE EXCEPTION 'Invalid action'; END IF;
 IF NOT FOUND THEN RAISE EXCEPTION 'Attempt is not active'; END IF;
END; $$;
REVOKE ALL ON FUNCTION public.director_attempt_time(uuid,text,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.director_attempt_time(uuid,text,integer) TO service_role;

-- Gives the full marks of one question to chosen attempts (NULL codes = everyone who sat it), once per question per attempt. Reset results stay reset.
CREATE OR REPLACE FUNCTION public.award_question_marks(p_bank uuid, p_round integer, p_question text, p_codes text[]) RETURNS integer LANGUAGE plpgsql SET search_path=public AS $$
DECLARE qs jsonb; subj text; qmarks integer; a public.exam_attempts; bonus text[]; earned integer; possible integer; gained integer := 0; was_right boolean;
BEGIN
 SELECT questions,subject INTO qs,subj FROM public.question_banks WHERE id=p_bank;
 IF NOT FOUND THEN RAISE EXCEPTION 'Exam not found'; END IF;
 SELECT (q->>'marks')::integer INTO qmarks FROM jsonb_array_elements(qs) q WHERE q->>'id'=p_question;
 IF qmarks IS NULL THEN RAISE EXCEPTION 'Question not found'; END IF;
 FOR a IN SELECT * FROM public.exam_attempts WHERE bank_id=p_bank AND round=p_round AND results_reset_at IS NULL AND NOT (p_question = ANY(bonus_questions)) AND (p_codes IS NULL OR student_code = ANY(p_codes)) FOR UPDATE LOOP
  bonus := array_append(a.bonus_questions, p_question);
  SELECT (a.answers->>p_question)::integer IS NOT DISTINCT FROM (q->>'answer')::integer INTO was_right FROM jsonb_array_elements(qs) q WHERE q->>'id'=p_question;
  IF NOT COALESCE(was_right,false) THEN gained := gained+1; END IF;
  UPDATE public.exam_attempts SET bonus_questions=bonus WHERE id=a.id;
  IF a.status <> 'in_progress' THEN
   SELECT COALESCE(sum(CASE WHEN (a.answers->>(q->>'id'))::integer = (q->>'answer')::integer OR (q->>'id') = ANY(bonus) THEN (q->>'marks')::integer ELSE 0 END),0), COALESCE(sum((q->>'marks')::integer),0) INTO earned,possible FROM jsonb_array_elements(qs) q;
   UPDATE public.exam_attempts SET score=earned,total=possible WHERE id=a.id;
   INSERT INTO public.round_results(round,student_code,subject,score_pct) VALUES(a.round,a.student_code,subj,CASE WHEN possible>0 THEN round(earned*100.0/possible) ELSE 0 END) ON CONFLICT(round,student_code,subject) DO UPDATE SET score_pct=EXCLUDED.score_pct,updated_at=now();
  END IF;
 END LOOP;
 RETURN gained;
END; $$;
REVOKE ALL ON FUNCTION public.award_question_marks(uuid,integer,text,text[]) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.award_question_marks(uuid,integer,text,text[]) TO service_role;

CREATE OR REPLACE FUNCTION public.reset_visible_results(p_round integer,p_stream text) RETURNS integer LANGUAGE plpgsql SET search_path=public AS $$ DECLARE n integer; BEGIN
 PERFORM id FROM public.exam_settings WHERE id=1 FOR UPDATE;
 IF EXISTS(SELECT 1 FROM public.exam_attempts a JOIN public.registered_students st USING(student_code) WHERE a.round=p_round AND st.stream=p_stream AND a.status='in_progress') THEN RAISE EXCEPTION 'Wait for active students to finish before resetting results'; END IF;
 UPDATE public.exam_attempts a SET results_reset_at=now() FROM public.registered_students st WHERE a.student_code=st.student_code AND a.round=p_round AND st.stream=p_stream AND a.results_reset_at IS NULL;
 DELETE FROM public.round_results r USING public.registered_students st WHERE r.student_code=st.student_code AND r.round=p_round AND st.stream=p_stream;
 GET DIAGNOSTICS n=ROW_COUNT; RETURN n; END; $$;
REVOKE ALL ON FUNCTION public.reset_visible_results(integer,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.reset_visible_results(integer,text) TO service_role;

-- True when every admitted, verified student of each active stream has finished (submitted or blocked) this session's paper.
CREATE OR REPLACE FUNCTION public.exam_everyone_finished(s public.exam_settings) RETURNS boolean LANGUAGE sql STABLE SET search_path=public AS $$
 SELECT (s.active_bank_id IS NOT NULL OR s.social_bank_id IS NOT NULL) AND s.scheduled_start IS NOT NULL
  AND EXISTS(SELECT 1 FROM public.exam_attempts WHERE round=s.current_round AND bank_id IN(s.active_bank_id,s.social_bank_id) AND started_at>=s.scheduled_start)
  AND NOT EXISTS(SELECT 1 FROM public.registered_students st JOIN public.question_banks b ON b.id IN(s.active_bank_id,s.social_bank_id) AND b.target_stream=st.stream
   WHERE st.face_verified AND (s.selected_student_codes IS NULL OR st.student_code=ANY(s.selected_student_codes))
   AND NOT EXISTS(SELECT 1 FROM public.exam_attempts a WHERE a.student_code=st.student_code AND a.round=s.current_round AND a.bank_id=b.id AND a.status<>'in_progress'))
$$;
REVOKE ALL ON FUNCTION public.exam_everyone_finished(public.exam_settings) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.exam_everyone_finished(public.exam_settings) TO service_role;

CREATE OR REPLACE FUNCTION public.apply_exam_schedule() RETURNS void LANGUAGE plpgsql SET search_path=public AS $$
DECLARE s public.exam_settings; a public.exam_attempts; live boolean; done boolean;
BEGIN
 SELECT * INTO s FROM public.exam_settings WHERE id=1 FOR UPDATE;
 done := s.auto_close AND public.exam_everyone_finished(s);
 IF NOT s.auto_schedule THEN
  -- Manual mode: close the session by itself once every admitted student has submitted.
  IF s.exam_live AND done THEN UPDATE public.exam_settings SET exam_live=false, auto_completed=true, updated_at=now() WHERE id=1; END IF;
  RETURN;
 END IF;
 live := NOT(s.auto_completed OR done) AND (s.active_bank_id IS NOT NULL OR s.social_bank_id IS NOT NULL) AND s.scheduled_start IS NOT NULL AND s.scheduled_close IS NOT NULL AND now()>=s.scheduled_start AND now()<s.scheduled_close;
 IF live IS DISTINCT FROM s.exam_live OR (done AND NOT s.auto_completed) THEN UPDATE public.exam_settings SET exam_live=live,auto_completed=auto_completed OR done,updated_at=now() WHERE id=1; END IF;
 IF NOT live AND s.scheduled_close IS NOT NULL AND now()>=s.scheduled_close THEN
  FOR a IN SELECT * FROM public.exam_attempts WHERE round=s.current_round AND bank_id IN(s.active_bank_id,s.social_bank_id) AND status='in_progress' AND paused_at IS NULL LOOP
   PERFORM public.save_exam_submission(a.id,a.answers,'submitted',a.violations);
  END LOOP;
 END IF;
 IF done OR s.auto_completed OR now()>=s.scheduled_close THEN BEGIN PERFORM cron.unschedule('burka-harbu-auto-exams'); EXCEPTION WHEN OTHERS THEN NULL; END; END IF;
END; $$;
REVOKE ALL ON FUNCTION public.apply_exam_schedule() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.apply_exam_schedule() TO service_role;

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE OR REPLACE FUNCTION public.arm_exam_schedule() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NEW.auto_schedule AND NOT NEW.auto_completed AND (NEW.active_bank_id IS NOT NULL OR NEW.social_bank_id IS NOT NULL) AND NEW.scheduled_close>now() THEN
  PERFORM cron.schedule('burka-harbu-auto-exams','* * * * *','SELECT public.apply_exam_schedule()');
 ELSE
  BEGIN PERFORM cron.unschedule('burka-harbu-auto-exams'); EXCEPTION WHEN OTHERS THEN NULL; END;
 END IF;
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.arm_exam_schedule() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER arm_exam_schedule AFTER UPDATE OF auto_schedule,active_bank_id,scheduled_start,scheduled_close ON public.exam_settings FOR EACH ROW EXECUTE FUNCTION public.arm_exam_schedule();
CREATE TRIGGER arm_room_schedule AFTER UPDATE OF social_bank_id,selected_student_codes,auto_completed ON public.exam_settings FOR EACH ROW EXECUTE FUNCTION public.arm_exam_schedule();