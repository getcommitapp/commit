-- Preview/dev-only seed for test user and mock session
-- Idempotent: safe to run multiple times

-- Constants
-- Using fixed IDs and token for easy client testing
-- user: test@commit.local / name: Test User
-- session token: 11111111-1111-4111-8111-111111111111

-- Insert user if not exists
INSERT OR IGNORE INTO "user" (id, name, email, emailVerified, image, stripeCustomerId, createdAt, updatedAt)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Test User',
  'test@commit.local',
  1,
  NULL,
  NULL,
  strftime('%s','now'),
  strftime('%s','now')
);

-- Ensure user data is up to date
INSERT INTO "user" (id, name, email, emailVerified, image, stripeCustomerId, createdAt, updatedAt)
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Test User',
  'test@commit.local',
  1,
  NULL,
  NULL,
  strftime('%s','now'),
  strftime('%s','now')
)
ON CONFLICT(id) DO UPDATE SET
  name=excluded.name,
  email=excluded.email,
  emailVerified=excluded.emailVerified,
  image=excluded.image,
  stripeCustomerId=excluded.stripeCustomerId,
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

-- Additional test users (no sessions needed)
INSERT OR IGNORE INTO "user" (id, name, email, emailVerified, image, stripeCustomerId, createdAt, updatedAt)
VALUES 
  ('00000000-0000-4000-8000-000000000002', 'Alice Johnson', 'alice@commit.local', 1, NULL, NULL, strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-000000000003', 'Bob Smith', 'bob@commit.local', 1, NULL, NULL, strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-000000000004', 'Carol Davis', 'carol@commit.local', 1, NULL, NULL, strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-000000000005', 'David Wilson', 'david@commit.local', 1, NULL, NULL, strftime('%s','now'), strftime('%s','now'));

-- Insert charities for goal destinations
INSERT OR IGNORE INTO charity (id, name, url, createdAt, updatedAt)
VALUES 
  ('00000000-0000-4000-8000-0000000000c1', 'Red Cross', 'https://www.redcross.org', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000c2', 'UNICEF', 'https://www.unicef.org', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000c3', 'Doctors Without Borders', 'https://www.msf.org', strftime('%s','now'), strftime('%s','now'));

-- Insert test goals
INSERT OR IGNORE INTO goal (id, ownerId, name, description, startDate, endDate, dueStartTime, dueEndTime, recurrence, stakeCents, currency, destinationType, destinationCharityId, createdAt, updatedAt)
VALUES 
  -- Test User's goals
  ('00000000-0000-4000-8000-0000000000g1', '00000000-0000-4000-8000-000000000001', 'Daily Exercise', 'Work out for 30 minutes every day', strftime('%s','now'), strftime('%s','now', '+30 days'), strftime('%s','now', '+6 hours'), strftime('%s','now', '+8 hours'), 'daily', 5000, 'CHF', 'charity', '00000000-0000-4000-8000-0000000000c1', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000g2', '00000000-0000-4000-8000-000000000001', 'Read Books', 'Read 20 pages daily', strftime('%s','now'), strftime('%s','now', '+60 days'), strftime('%s','now', '+20 hours'), strftime('%s','now', '+22 hours'), 'daily', 3000, 'CHF', 'charity', '00000000-0000-4000-8000-0000000000c2', strftime('%s','now'), strftime('%s','now')),
  
  -- Alice's goals
  ('00000000-0000-4000-8000-0000000000g3', '00000000-0000-4000-8000-000000000002', 'Learn Guitar', 'Practice guitar for 1 hour daily', strftime('%s','now'), strftime('%s','now', '+90 days'), strftime('%s','now', '+18 hours'), strftime('%s','now', '+19 hours'), 'daily', 2000, 'CHF', 'charity', '00000000-0000-4000-8000-0000000000c3', strftime('%s','now'), strftime('%s','now')),
  
  -- Bob's goals
  ('00000000-0000-4000-8000-0000000000g4', '00000000-0000-4000-8000-000000000003', 'Meditation', 'Meditate for 15 minutes every morning', strftime('%s','now'), strftime('%s','now', '+45 days'), strftime('%s','now', '+7 hours'), strftime('%s','now', '+7.25 hours'), 'daily', 1500, 'CHF', 'charity', '00000000-0000-4000-8000-0000000000c1', strftime('%s','now'), strftime('%s','now'));

-- Insert goal verification methods
INSERT OR IGNORE INTO goal_verifications_method (id, goalId, method, latitude, longitude, radiusM, durationSeconds, graceTime, createdAt, updatedAt)
VALUES 
  ('00000000-0000-4000-8000-0000000000m1', '00000000-0000-4000-8000-0000000000g1', 'location', 46.5197, 6.6323, 100, 1800, strftime('%s','now', '+5 minutes'), strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000m2', '00000000-0000-4000-8000-0000000000g2', 'photo', NULL, NULL, NULL, NULL, strftime('%s','now', '+5 minutes'), strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000m3', '00000000-0000-4000-8000-0000000000g3', 'duration', NULL, NULL, NULL, 3600, strftime('%s','now', '+5 minutes'), strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000m4', '00000000-0000-4000-8000-0000000000g4', 'photo', NULL, NULL, NULL, NULL, strftime('%s','now', '+5 minutes'), strftime('%s','now'), strftime('%s','now'));

-- Insert some verification logs (completed verifications)
INSERT OR IGNORE INTO goal_verifications_log (id, goalId, userId, type, verifiedAt, approvalStatus, startTime, photoDescription, photoUrl, createdAt, updatedAt)
VALUES 
  ('00000000-0000-4000-8000-0000000000v1', '00000000-0000-4000-8000-0000000000g1', '00000000-0000-4000-8000-000000000001', 'location', strftime('%s','now', '-1 day'), 'approved', strftime('%s','now', '-1 day', '-30 minutes'), NULL, NULL, strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000v2', '00000000-0000-4000-8000-0000000000g1', '00000000-0000-4000-8000-000000000001', 'location', strftime('%s','now', '-2 days'), 'approved', strftime('%s','now', '-2 days', '-30 minutes'), NULL, NULL, strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000v3', '00000000-0000-4000-8000-0000000000g2', '00000000-0000-4000-8000-000000000001', 'photo', strftime('%s','now', '-1 day'), 'approved', strftime('%s','now', '-1 day', '-1 hour'), 'Reading page 15 of my book', 'https://example.com/photo1.jpg', strftime('%s','now'), strftime('%s','now'));

-- Insert test groups
INSERT OR IGNORE INTO "group" (id, creatorId, goalId, name, description, inviteCode, createdAt, updatedAt)
VALUES 
  ('00000000-0000-4000-8000-0000000000gr1', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-0000000000g1', 'Fitness Buddies', 'Group for daily exercise motivation', 'FITNESS123', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr2', '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-0000000000g3', 'Music Learners', 'Group for learning musical instruments', 'MUSIC456', strftime('%s','now'), strftime('%s','now')),
  ('00000000-0000-4000-8000-0000000000gr3', '00000000-0000-4000-8000-000000000003', NULL, 'Study Group', 'General study and productivity group', 'STUDY789', strftime('%s','now'), strftime('%s','now'));

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


