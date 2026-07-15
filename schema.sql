-- ============================================================
-- GP ESSAY MARKER — DATABASE SCHEMA
-- Run this once in Supabase's SQL Editor to create every table.
-- ============================================================

-- Enables the pgvector extension, which lets PostgreSQL store and
-- search "embeddings" (numerical representations of meaning) for
-- our RAG retrieval system.
create extension if not exists vector;

-- ============================================================
-- USERS
-- Stores every account: students, tutors, and admins.
-- ============================================================
create table users (
  -- This id is NOT auto-generated. It must match the id Supabase
  -- Auth already assigned this person when they signed up, which
  -- is why it references auth.users directly. The trigger below
  -- fills this in automatically the moment someone signs up.
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  role text not null default 'student' check (role in ('student', 'tutor', 'admin')),
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'premium')),
  created_at timestamptz not null default now()
);

-- Note: we do NOT store a password_hash column here. Password
-- security is handled entirely by Supabase's built-in auth system
-- (a separate, already-secured table Supabase manages for us),
-- not something we build ourselves. This "users" table holds only
-- the extra profile information our app needs beyond login
-- credentials.

-- Automatically creates a row in our "users" table the instant
-- someone signs up through Supabase Auth, using the SAME id, so
-- our RLS policies (which compare against auth.uid()) always match.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- QUESTIONS
-- The bank of GP essay questions students can answer.
-- ============================================================
create table questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  topic_category text not null check (
    topic_category in (
      'Society & Culture',
      'Economics',
      'Politics',
      'Arts & Humanities',
      'Science & Technology',
      'Environment'
    )
  ),
  year integer,
  source text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- MODEL ESSAYS
-- Your curated reference essays, used for RAG retrieval.
-- Separate from student-submitted essays.
-- ============================================================
create table model_essays (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  topic_category text not null check (
    topic_category in (
      'Society & Culture',
      'Economics',
      'Politics',
      'Arts & Humanities',
      'Science & Technology',
      'Environment'
    )
  ),
  grade_score numeric,              -- nullable: real grade, if one exists
  quality_label text not null check (
    quality_label in ('graded', 'expected_high_band')
  ),
  essay_text text not null,
  embedding vector(1024),           -- populated by our seed script (voyage-3-large produces 1024-dim vectors)
  created_at timestamptz not null default now()
);

-- ============================================================
-- ESSAYS
-- Every essay a student submits for marking.
-- ============================================================
create table essays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  question_id uuid not null references questions(id),
  essay_text text not null,
  word_count integer not null,
  status text not null default 'pending' check (
    status in ('pending', 'marked', 'failed')
  ),
  submitted_at timestamptz not null default now()
);

-- ============================================================
-- FEEDBACK
-- The AI's full marking output for one essay (one-to-one with essays).
-- ============================================================
create table feedback (
  id uuid primary key default gen_random_uuid(),
  essay_id uuid not null unique references essays(id) on delete cascade,
  content_band integer not null check (content_band between 1 and 5),
  content_mark numeric not null check (content_mark between 0 and 30),
  language_band integer not null check (language_band between 1 and 5),
  language_mark numeric not null check (language_mark between 0 and 20),
  overall_grade_estimate text not null,
  next_boundary_content text,
  next_boundary_language text,
  student_facing_overall_summary text not null,
  student_facing_content_feedback text not null,
  student_facing_language_feedback text not null,
  weakest_paragraph_original text,
  weakest_paragraph_rewrite text,
  suggested_stronger_argument text,
  raw_ai_response jsonb not null,   -- full structured output, stored for debugging/audit
  created_at timestamptz not null default now()
);

-- ============================================================
-- INLINE COMMENTS
-- Paragraph/sentence-level annotations tied to a feedback report.
-- Covers content evidence, language evidence, fallacies, and
-- unsupported assertions in one flexible table.
-- ============================================================
create table inline_comments (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references feedback(id) on delete cascade,
  quoted_text text not null,
  comment_text text not null,
  comment_type text not null check (
    comment_type in (
      'content_evidence',
      'language_evidence',
      'logical_fallacy',
      'unsupported_assertion',
      'example_quality'
    )
  ),
  created_at timestamptz not null default now()
);

-- ============================================================
-- STUDENT PATTERN SUMMARY
-- A running, incrementally-updated summary of each student's
-- recurring strengths/weaknesses, used as context for future
-- marking requests. One row per student.
-- ============================================================
create table student_pattern_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  summary_text text not null default '',
  essays_analyzed_count integer not null default 0,
  last_updated_at timestamptz not null default now()
);

-- ============================================================
-- USAGE LOG
-- Tracks AI cost per request, for admin cost monitoring.
-- ============================================================
create table usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  essay_id uuid references essays(id) on delete set null,
  ai_input_tokens integer not null,
  ai_output_tokens integer not null,
  ai_cost_usd numeric not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- Speed up the lookups our app will do most often.
-- ============================================================
create index idx_essays_user_id on essays(user_id);
create index idx_inline_comments_feedback_id on inline_comments(feedback_id);
create index idx_usage_logs_user_id on usage_logs(user_id);

-- A special index for fast similarity search on embeddings —
-- this is what makes RAG retrieval actually fast rather than
-- scanning every single model essay on every request.
create index idx_model_essays_embedding on model_essays
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Enforces data access rules at the database level itself, so
-- a user can never see another user's private data, even if a
-- request bypasses our own application code.
-- ============================================================

alter table users enable row level security;
alter table essays enable row level security;
alter table feedback enable row level security;
alter table inline_comments enable row level security;
alter table student_pattern_summaries enable row level security;
alter table usage_logs enable row level security;
alter table questions enable row level security;
alter table model_essays enable row level security;

-- USERS: a person can view and update only their own profile row.
create policy "users can view own profile"
  on users for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on users for update
  using (auth.uid() = id);

-- ESSAYS: a student can view, insert, and delete only their own essays.
create policy "users can view own essays"
  on essays for select
  using (auth.uid() = user_id);

create policy "users can insert own essays"
  on essays for insert
  with check (auth.uid() = user_id);

create policy "users can delete own essays"
  on essays for delete
  using (auth.uid() = user_id);

-- FEEDBACK: viewable only if the user owns the essay it belongs to.
-- This uses a subquery to check ownership through the essays table,
-- since feedback itself has no user_id column directly.
create policy "users can view feedback for own essays"
  on feedback for select
  using (
    exists (
      select 1 from essays
      where essays.id = feedback.essay_id
      and essays.user_id = auth.uid()
    )
  );

-- INLINE COMMENTS: same ownership chain, one level deeper
-- (inline_comments -> feedback -> essays -> user).
create policy "users can view own inline comments"
  on inline_comments for select
  using (
    exists (
      select 1 from feedback
      join essays on essays.id = feedback.essay_id
      where feedback.id = inline_comments.feedback_id
      and essays.user_id = auth.uid()
    )
  );

-- STUDENT PATTERN SUMMARIES: a user can view only their own summary.
create policy "users can view own pattern summary"
  on student_pattern_summaries for select
  using (auth.uid() = user_id);

-- USAGE LOGS: intentionally has NO select policy for regular users.
-- This data is for admin cost-monitoring only, and our backend
-- reads it using the service role key, which bypasses RLS entirely.
-- Leaving no policy here means: nobody can read this via the
-- public API, full stop, unless we deliberately add a policy later.

-- QUESTIONS and MODEL_ESSAYS: reference/library data, not owned by
-- any individual user. Any logged-in user may read them, but only
-- our trusted backend (service role key) can write to them.
create policy "any authenticated user can view questions"
  on questions for select
  using (auth.role() = 'authenticated');

create policy "any authenticated user can view model essays"
  on model_essays for select
  using (auth.role() = 'authenticated');
