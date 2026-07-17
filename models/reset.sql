-- ============================================================
-- RESET SCRIPT — DEVELOPMENT USE ONLY
-- Deletes every table this project created, so schema.sql can be
-- re-run cleanly from scratch.
--
-- WARNING: This permanently destroys all data in these tables.
-- Never run this once real user data exists. This file exists
-- purely to fix the "relation already exists" error during setup.
-- ============================================================

-- Drop the trigger and function first, since they depend on
-- auth.users and reference our users table.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Drop tables in an order that respects foreign key dependencies
-- (tables that reference others are dropped before the tables
-- they depend on). "cascade" also removes any policies or indexes
-- attached to each table automatically.
drop table if exists usage_logs cascade;
drop table if exists inline_comments cascade;
drop table if exists feedback cascade;
drop table if exists essays cascade;
drop table if exists student_pattern_summaries cascade;
drop table if exists model_essays cascade;
drop table if exists questions cascade;
drop table if exists users cascade;
