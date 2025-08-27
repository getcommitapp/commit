import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const User = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const Session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => User.id),
});

export const Account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => User.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const Verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

export const Charity = sqliteTable("charity", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// Base goal
export const Goal = sqliteTable("goal", {
  id: text("id").primaryKey(),

  ownerId: text("ownerId")
    .notNull()
    .references(() => User.id),

  name: text("name").notNull(),
  description: text("description"),

  startDate: integer("startDate", { mode: "timestamp" }),
  endDate: integer("endDate", { mode: "timestamp" }),
  dueStartTime: integer("dueStartTime", { mode: "timestamp" }),
  dueEndTime: integer("dueEndTime", { mode: "timestamp" }),

  recurrence: text("recurrence"),

  stakeCents: integer("stakeCents"),
  currency: text("currency"),

  destinationType: text("destinationType"),
  destinationUserId: text("destinationUserId").references(() => User.id),
  destinationCharityId: text("destinationCharityId").references(
    () => Charity.id
  ),

  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const GoalVerificationsMethod = sqliteTable(
  "goal_verifications_method",
  {
    id: text("id").primaryKey(),
    goalId: text("goalId")
      .notNull()
      .references(() => Goal.id),

    method: text("method").notNull(),

    latitude: real("latitude"),
    longitude: real("longitude"),
    radiusM: integer("radiusM"),
    durationSeconds: integer("durationSeconds"),
    graceTime: integer("graceTime", { mode: "timestamp" }),

    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  }
);

export const GoalVerificationsLog = sqliteTable("goal_verifications_log", {
  id: text("id").primaryKey(), // uuid stored as text
  goalId: text("goalId")
    .notNull()
    .references(() => Goal.id),

  userId: text("userId")
    .notNull()
    .references(() => User.id),

  type: text("type").notNull(),
  verifiedAt: integer("verifiedAt", { mode: "timestamp" }),
  approvalStatus: text("approvalStatus"),
  approvedBy: text("approvedBy").references(() => User.id),

  startTime: integer("startTime", { mode: "timestamp" }),
  photoDescription: text("photoDescription"),
  photoUrl: text("photoUrl"),

  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const Group = sqliteTable("group", {
  id: text("id").primaryKey(),

  creatorId: text("creatorId")
    .notNull()
    .references(() => User.id),

  goalId: text("goalId").references(() => Goal.id),

  name: text("name").notNull(),
  description: text("description"),
  inviteCode: text("inviteCode").notNull().unique(),

  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const GroupParticipants = sqliteTable(
  "group_participants",
  {
    groupId: text("groupId")
      .notNull()
      .references(() => Group.id),
    userId: text("userId")
      .notNull()
      .references(() => User.id),

    joinedAt: integer("joinedAt", { mode: "timestamp" }).notNull(),
    status: text("status"),

    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.userId] }),
  })
);
