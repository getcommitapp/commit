-- Reset database by dropping all application tables
-- This preserves system tables like sqlite_sequence and _cf_METADATA

-- Drop application tables in reverse dependency order
-- Using IF EXISTS to prevent errors when tables don't exist
DROP TABLE IF EXISTS "d1_migrations";
DROP TABLE IF EXISTS "verification";
DROP TABLE IF EXISTS "goal_verifications_log";
DROP TABLE IF EXISTS "goal_verifications_method";
DROP TABLE IF EXISTS "goal_occurrence_action";
DROP TABLE IF EXISTS "group_participants";
DROP TABLE IF EXISTS "goal_timer";
DROP TABLE IF EXISTS "goal";
DROP TABLE IF EXISTS "group";
DROP TABLE IF EXISTS "charity";
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "user";
