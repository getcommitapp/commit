-- Reset database by dropping all application tables
-- This preserves system tables like sqlite_sequence and _cf_METADATA

-- Drop application tables in reverse dependency order
-- Using IF EXISTS to prevent errors when tables don't exist
PRAGMA foreign_keys=OFF;
DROP TABLE IF EXISTS "d1_migrations";
DROP TABLE IF EXISTS "verification";
DROP TABLE IF EXISTS "goal_occurrence";
DROP TABLE IF EXISTS "group_member";
DROP TABLE IF EXISTS "group";
DROP TABLE IF EXISTS "goal";
DROP TABLE IF EXISTS "charity";
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "user";
PRAGMA foreign_keys=ON;
