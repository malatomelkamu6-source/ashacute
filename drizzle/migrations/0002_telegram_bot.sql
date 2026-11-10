CREATE TABLE public.telegram_users (
  chat_id bigint PRIMARY KEY,
  telegram_user_id bigint,
  username text,
  first_name text,
  last_name text,
  language_code text,
  entered_name text,
  student_code text,
  id_confirmed boolean NOT NULL DEFAULT false,
  state text NOT NULL DEFAULT 'await_name',
  state_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  pin_failures integer NOT NULL DEFAULT 0,
  pin_locked_until timestamptz,
  blocked boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  linked_at timestamptz,
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX telegram_users_student_code_idx ON public.telegram_users (student_code);
GRANT ALL ON public.telegram_users TO service_role;
ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.telegram_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id bigint UNIQUE,
  chat_id bigint NOT NULL,
  direction text NOT NULL CHECK (direction IN ('in','out')),
  kind text NOT NULL DEFAULT 'chat' CHECK (kind IN ('chat','help','broadcast','notice','reply')),
  text text,
  handled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX telegram_messages_chat_idx ON public.telegram_messages (chat_id, created_at DESC);
CREATE INDEX telegram_messages_kind_idx ON public.telegram_messages (kind, created_at DESC);
GRANT ALL ON public.telegram_messages TO service_role;
ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.telegram_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  bot_enabled boolean NOT NULL DEFAULT true,
  results_enabled boolean NOT NULL DEFAULT true,
  notify_exam_live boolean NOT NULL DEFAULT true,
  notify_results boolean NOT NULL DEFAULT true,
  notify_registration boolean NOT NULL DEFAULT true,
  welcome_message text NOT NULL DEFAULT 'Welcome to the Burka Harbu Special Secondary School Grade 12 Exam Portal bot!',
  help_message text NOT NULL DEFAULT 'For help, contact the IT Admin at https://t.me/bhsss_admin or type your question below.',
  portal_url text NOT NULL DEFAULT 'https://ashacute.lovable.app',
  last_exam_live boolean,
  last_results_published boolean,
  last_registration_open boolean,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.telegram_settings TO service_role;
ALTER TABLE public.telegram_settings ENABLE ROW LEVEL SECURITY;
INSERT INTO public.telegram_settings (id, last_exam_live, last_results_published, last_registration_open)
SELECT 1, s.exam_live, s.results_published, s.registration_open FROM public.exam_settings s WHERE s.id = 1
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.telegram_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE public.telegram_broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'manual' CHECK (kind IN ('manual','auto')),
  audience text NOT NULL,
  message text NOT NULL,
  sent integer NOT NULL DEFAULT 0,
  failed integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.telegram_broadcasts TO service_role;
ALTER TABLE public.telegram_broadcasts ENABLE ROW LEVEL SECURITY;