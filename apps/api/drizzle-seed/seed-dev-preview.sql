-- Preview/dev-only seed for test user and mock session
-- Idempotent: safe to run multiple times

-- Constants
-- Using fixed IDs and token for easy client testing
-- user: user@commit.local / name: Test User
-- session token: 11111111-1111-4111-8111-111111111111

-- Insert user if not exists
INSERT OR IGNORE INTO "user" (id, name, email, emailVerified, image, stripeCustomerId, timezone, createdAt, updatedAt)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Test User',
  'user@commit.local',
  1,
  NULL,
  NULL,
  'Europe/Zurich',
  strftime('%s','now'),
  strftime('%s','now')
);

-- Ensure user data is up to date
INSERT INTO "user" (id, name, email, emailVerified, image, stripeCustomerId, timezone, createdAt, updatedAt)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Test User',
  'user@commit.local',
  1,
  NULL,
  NULL,
  'Europe/Zurich',
  strftime('%s','now'),
  strftime('%s','now')
)
ON CONFLICT(id) DO UPDATE SET
  name=excluded.name,
  email=excluded.email,
  emailVerified=excluded.emailVerified,
  image=excluded.image,
  stripeCustomerId=excluded.stripeCustomerId,
  timezone=excluded.timezone,
  updatedAt=excluded.updatedAt;

-- Insert reviewer test user (role: reviewer)
INSERT OR IGNORE INTO "user" (id, name, email, emailVerified, image, role, stripeCustomerId, timezone, createdAt, updatedAt)
VALUES (
  '00000000-0000-4000-8000-000000000006',
  'Reviewer User',
  'reviewer@commit.local',
  1,
  NULL,
  'reviewer',
  NULL,
  'Europe/Zurich',
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT INTO "user" (id, name, email, emailVerified, image, role, stripeCustomerId, timezone, createdAt, updatedAt)
VALUES (
  '00000000-0000-4000-8000-000000000006',
  'Reviewer User',
  'reviewer@commit.local',
  1,
  NULL,
  'reviewer',
  NULL,
  'Europe/Zurich',
  strftime('%s','now'),
  strftime('%s','now')
)
ON CONFLICT(id) DO UPDATE SET
  name=excluded.name,
  email=excluded.email,
  emailVerified=excluded.emailVerified,
  image=excluded.image,
  role=excluded.role,
  stripeCustomerId=excluded.stripeCustomerId,
  timezone=excluded.timezone,
  updatedAt=excluded.updatedAt;

-- Insert/update a fixed mock session for the test user
INSERT OR IGNORE INTO session (id, token, userId, userAgent, ipAddress, expiresAt, createdAt, updatedAt)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  '00000000-0000-4000-8000-000000000001',
  'seed-mock',
  NULL,
  strftime('%s','now', '+30 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT INTO session (id, token, userId, userAgent, ipAddress, expiresAt, createdAt, updatedAt)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  '11111111-1111-4111-8111-111111111111',
  '00000000-0000-4000-8000-000000000001',
  'seed-mock',
  NULL,
  strftime('%s','now', '+30 days'),
  strftime('%s','now'),
  strftime('%s','now')
)
ON CONFLICT(id) DO UPDATE SET
  token=excluded.token,
  userId=excluded.userId,
  userAgent=excluded.userAgent,
  ipAddress=excluded.ipAddress,
  expiresAt=excluded.expiresAt,
  updatedAt=excluded.updatedAt;

-- Insert/update a fixed mock session for the reviewer test user
INSERT OR IGNORE INTO session (id, token, userId, userAgent, ipAddress, expiresAt, createdAt, updatedAt)
VALUES (
  '22222222-2222-4222-8222-222222222222',
  '22222222-2222-4222-8222-222222222222',
  '00000000-0000-4000-8000-000000000006',
  'seed-mock',
  NULL,
  strftime('%s','now', '+30 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT INTO session (id, token, userId, userAgent, ipAddress, expiresAt, createdAt, updatedAt)
VALUES (
  '22222222-2222-4222-8222-222222222222',
  '22222222-2222-4222-8222-222222222222',
  '00000000-0000-4000-8000-000000000006',
  'seed-mock',
  NULL,
  strftime('%s','now', '+30 days'),
  strftime('%s','now'),
  strftime('%s','now')
)
ON CONFLICT(id) DO UPDATE SET
  token=excluded.token,
  userId=excluded.userId,
  userAgent=excluded.userAgent,
  ipAddress=excluded.ipAddress,
  expiresAt=excluded.expiresAt,
  updatedAt=excluded.updatedAt;

-- Additional test users (no sessions needed)
INSERT OR IGNORE INTO "user" (id, name, email, emailVerified, image, stripeCustomerId, timezone, createdAt, updatedAt)
VALUES 
  ('00000000-0000-4000-8000-000000000002', 'Alice Johnson', 'alice@commit.local', 1, NULL, NULL, 'Europe/Zurich', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-000000000003', 'Bob Smith', 'bob@commit.local', 1, NULL, NULL, 'Europe/Zurich', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-000000000004', 'Carol Davis', 'carol@commit.local', 1, NULL, NULL, 'Europe/Zurich', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-000000000005', 'David Wilson', 'david@commit.local', 1, NULL, NULL, 'Europe/Zurich', strftime('%s','now'), strftime('%s','now'));

-- Insert charities for goal destinations
INSERT OR IGNORE INTO charity (id, name, url, createdAt, updatedAt)
VALUES 
  ('00000000-0000-4000-8000-0000000000c1', 'Red Cross', 'https://www.redcross.org', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000c2', 'UNICEF', 'https://www.unicef.org', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000c3', 'Doctors Without Borders', 'https://www.msf.org', strftime('%s','now'), strftime('%s','now'));

-- Insert/Update test goals (upsert) - new flattened schema
INSERT INTO goal (
  id,
  ownerId,
  name,
  description,
  startDate,
  endDate,
  dueStartTime,
  dueEndTime,
  localDueStart,
  localDueEnd,
  recDaysMask,
  stakeCents,
  currency,
  destinationType,
  destinationCharityId,
  method,
  graceTimeSeconds,
  durationSeconds,
  geoLat,
  geoLng,
  geoRadiusM,
  createdAt,
  updatedAt
)
VALUES 
  -- Test User's goals
  (
    '00000000-0000-4000-8000-0000000000g1',
    '00000000-0000-4000-8000-000000000001',
    'Daily Exercise',
    'Work out for 30 minutes every day',
    strftime('%s','now'),
    strftime('%s','now', '+30 days'),
    strftime('%s','now', '+6 hours'),
    NULL,
    '07:00',
    '08:00',
    127,
    5000,
    'CHF',
    'charity',
    '00000000-0000-4000-8000-0000000000c1',
    'movement',
    NULL,
    1800,
    NULL,
    NULL,
    NULL,
    strftime('%s','now'),
    strftime('%s','now')
  ),
  (
    '00000000-0000-4000-8000-0000000000g2',
    '00000000-0000-4000-8000-000000000001',
    'Read Books',
    'Read 20 pages daily',
    strftime('%s','now'),
    strftime('%s','now', '+60 days'),
    strftime('%s','now', '+20 hours'),
    NULL,
    '20:00',
    '22:00',
    127,
    3000,
    'CHF',
    'charity',
    '00000000-0000-4000-8000-0000000000c2',
    'photo',
    300,
    NULL,
    NULL,
    NULL,
    NULL,
    strftime('%s','now'),
    strftime('%s','now')
  ),
  
  -- Alice's goal (weekly checkin)
  (
    '00000000-0000-4000-8000-0000000000g3',
    '00000000-0000-4000-8000-000000000002',
    'Learn Guitar',
    'Practice guitar daily',
    strftime('%s','now'),
    strftime('%s','now', '+90 days'),
    strftime('%s','now', '+18 hours'),
    NULL,
    '18:00',
    '19:00',
    127,
    2000,
    'CHF',
    'charity',
    '00000000-0000-4000-8000-0000000000c3',
    'checkin',
    60,
    NULL,
    NULL,
    NULL,
    NULL,
    strftime('%s','now'),
    strftime('%s','now')
  ),
  
  -- Bob's goal (single location window today)
  (
    '00000000-0000-4000-8000-0000000000g4',
    '00000000-0000-4000-8000-000000000003',
    'Meditation',
    'Meditate for 15 minutes this morning',
    strftime('%s','now'),
    strftime('%s','now', '+45 days'),
    strftime('%s','now', '+7 hours'),
    strftime('%s','now', '+7.25 hours'),
    NULL,
    NULL,
    NULL,
    1500,
    'CHF',
    'charity',
    '00000000-0000-4000-8000-0000000000c1',
    'location',
    NULL,
    NULL,
    46.5197,
    6.6323,
    100,
    strftime('%s','now'),
    strftime('%s','now')
  )
ON CONFLICT(id) DO UPDATE SET
  ownerId=excluded.ownerId,
  name=excluded.name,
  description=excluded.description,
  startDate=excluded.startDate,
  endDate=excluded.endDate,
  dueStartTime=excluded.dueStartTime,
  dueEndTime=excluded.dueEndTime,
  localDueStart=excluded.localDueStart,
  localDueEnd=excluded.localDueEnd,
  recDaysMask=excluded.recDaysMask,
  stakeCents=excluded.stakeCents,
  currency=excluded.currency,
  destinationType=excluded.destinationType,
  destinationUserId=excluded.destinationUserId,
  destinationCharityId=excluded.destinationCharityId,
  method=excluded.method,
  graceTimeSeconds=excluded.graceTimeSeconds,
  durationSeconds=excluded.durationSeconds,
  geoLat=excluded.geoLat,
  geoLng=excluded.geoLng,
  geoRadiusM=excluded.geoRadiusM,
  updatedAt=excluded.updatedAt;

-- Insert some occurrences with statuses
INSERT OR IGNORE INTO goal_occurrence (
  goalId, userId, occurrenceDate, status, verifiedAt, photoDescription, photoUrl, timerStartedAt, timerEndedAt, violated, approvedBy, createdAt, updatedAt
) VALUES
  -- Yesterday approved for movement goal g1
  ('00000000-0000-4000-8000-0000000000g1', '00000000-0000-4000-8000-000000000001', strftime('%Y-%m-%d','now','-1 day','localtime'), 'approved', strftime('%s','now','-1 day'), NULL, NULL, NULL, NULL, 0, NULL, strftime('%s','now'), strftime('%s','now')),
  -- Today pending photo for g2
  ('00000000-0000-4000-8000-0000000000g2', '00000000-0000-4000-8000-000000000001', strftime('%Y-%m-%d','now','localtime'), 'pending', NULL, 'Reading chapter 3 - daily pages', 'https://picsum.photos/seed/pending1/800/600', NULL, NULL, NULL, NULL, strftime('%s','now'), strftime('%s','now')),
  -- Bob pending photo yesterday
  ('00000000-0000-4000-8000-0000000000g4', '00000000-0000-4000-8000-000000000003', strftime('%Y-%m-%d','now','-1 day','localtime'), 'pending', NULL, 'Morning meditation spot', 'https://picsum.photos/seed/pending2/800/600', NULL, NULL, NULL, NULL, strftime('%s','now'), strftime('%s','now'));

-- Sanity cleanup: remove orphan groups referencing non-existent goals
DELETE FROM "group"
WHERE goalId NOT IN (SELECT id FROM goal);

-- Insert/Update test groups (upsert)
INSERT INTO "group" (id, creatorId, goalId, name, description, inviteCode, createdAt, updatedAt)
VALUES 
  ('00000000-0000-4000-8000-0000000000gr1', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-0000000000g1', 'Fitness Buddies', 'Group for daily exercise motivation', 'FITNESS123', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr2', '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-0000000000g3', 'Music Learners', 'Group for learning musical instruments', 'MUSIC456', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr3', '00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-0000000000g4', 'Study Group', 'General study and productivity group', 'STUDY789', strftime('%s','now'), strftime('%s','now'))
ON CONFLICT(id) DO UPDATE SET
  creatorId=excluded.creatorId,
  goalId=excluded.goalId,
  name=excluded.name,
  description=excluded.description,
  inviteCode=excluded.inviteCode,
  updatedAt=excluded.updatedAt;

-- Insert group participants
INSERT OR IGNORE INTO group_participants (groupId, userId, joinedAt, status, createdAt, updatedAt)
VALUES 
  -- Fitness Buddies group
  ('00000000-0000-4000-8000-0000000000gr1', '00000000-0000-4000-8000-000000000001', strftime('%s','now', '-7 days'), 'active', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr1', '00000000-0000-4000-8000-000000000002', strftime('%s','now', '-6 days'), 'active', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr1', '00000000-0000-4000-8000-000000000003', strftime('%s','now', '-5 days'), 'active', strftime('%s','now'), strftime('%s','now')),
  
  -- Music Learners group
  ('00000000-0000-4000-8000-0000000000gr2', '00000000-0000-4000-8000-000000000002', strftime('%s','now', '-10 days'), 'active', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr2', '00000000-0000-4000-8000-000000000004', strftime('%s','now', '-9 days'), 'active', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr2', '00000000-0000-4000-8000-000000000005', strftime('%s','now', '-8 days'), 'active', strftime('%s','now'), strftime('%s','now')),
  
  -- Study Group
  ('00000000-0000-4000-8000-0000000000gr3', '00000000-0000-4000-8000-000000000003', strftime('%s','now', '-14 days'), 'active', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr3', '00000000-0000-4000-8000-000000000001', strftime('%s','now', '-13 days'), 'active', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr3', '00000000-0000-4000-8000-000000000004', strftime('%s','now', '-12 days'), 'active', strftime('%s','now'), strftime('%s','now'));

