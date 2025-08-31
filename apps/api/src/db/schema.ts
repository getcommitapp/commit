import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";

const createCreatedAt = () =>
  integer("createdAt", { mode: "timestamp" }).default(sql`(current_timestamp)`);
const createUpdatedAt = () =>
  integer("updatedAt", { mode: "timestamp" }).notNull();

export const User = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  role: text("role", { enum: ["user", "reviewer", "admin"] })
    .notNull()
    .default("user"),
  stripeCustomerId: text("stripeCustomerId"),
  timezone: text("timezone").default("UTC"),

  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
});

export const Session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),

  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
  ipAddress: text("ipAddress"),

  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
});

export const Account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),

  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
});

export const Verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),

  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
});

export const Charity = sqliteTable("charity", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
});

export const Goal = sqliteTable("goal", {
  id: text("id").primaryKey(),

  ownerId: text("ownerId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  description: text("description"),

  startDate: integer("startDate", { mode: "timestamp" }).notNull(),
  endDate: integer("endDate", { mode: "timestamp" }),
  dueStartTime: integer("dueStartTime", { mode: "timestamp" }).notNull(),
  dueEndTime: integer("dueEndTime", { mode: "timestamp" }),
  // For recurring weekly goals: local time-of-day strings + weekday mask
  localDueStart: text("localDueStart"), // HH:mm
  localDueEnd: text("localDueEnd"), // HH:mm
  recDaysMask: integer("recDaysMask"), // bitmask Mon=1<<0 ... Sun=1<<6

  stakeCents: integer("stakeCents").notNull(),
  currency: text("currency").notNull(),

  destinationType: text("destinationType").notNull(),
  destinationUserId: text("destinationUserId").references(() => User.id, {
    onDelete: "cascade",
  }),
  destinationCharityId: text("destinationCharityId").references(
    () => Charity.id,
    { onDelete: "cascade" }
  ),

  // Flattened verification method configuration (one method per goal)
  method: text("method", {
    enum: ["location", "photo", "checkin", "movement"],
  }).notNull(),
  graceTimeSeconds: integer("graceTimeSeconds"), // photo/checkin without end
  durationSeconds: integer("durationSeconds"), // movement
  geoLat: real("geoLat"),
  geoLng: real("geoLng"),
  geoRadiusM: integer("geoRadiusM"),

  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
});

// One row per user per local occurrence (YYYY-MM-DD in user's timezone)
export const GoalOccurrence = sqliteTable(
  "goal_occurrence",
  {
    goalId: text("goalId")
      .notNull()
      .references(() => Goal.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    occurrenceDate: text("occurrenceDate").notNull(), // YYYY-MM-DD local

    // Verification lifecycle
    status: text("status", { enum: ["pending", "approved", "rejected"] })
      .notNull()
      .default("pending"),
    verifiedAt: integer("verifiedAt", { mode: "timestamp" }),

    // Optional fields for photo/checkin
    photoUrl: text("photoUrl"),
    photoDescription: text("photoDescription"),

    // Movement timing
    timerStartedAt: integer("timerStartedAt", { mode: "timestamp" }),
    timerEndedAt: integer("timerEndedAt", { mode: "timestamp" }),
    violated: integer("violated", { mode: "boolean" }),

    // Reviewer
    approvedBy: text("approvedBy").references(() => User.id, {
      onDelete: "cascade",
    }),

    createdAt: createCreatedAt(),
    updatedAt: createUpdatedAt(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.goalId, t.userId, t.occurrenceDate] }),
  })
);

export const Group = sqliteTable("group", {
  id: text("id").primaryKey(),

  creatorId: text("creatorId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),

  goalId: text("goalId")
    .notNull()
    .references(() => Goal.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  description: text("description"),
  inviteCode: text("inviteCode").notNull().unique(),

  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
});

export const GroupParticipants = sqliteTable(
  "group_participants",
  {
    groupId: text("groupId")
      .notNull()
      .references(() => Group.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),

    joinedAt: integer("joinedAt", { mode: "timestamp" }).notNull(),
    status: text("status"),

    createdAt: createCreatedAt(),
    updatedAt: createUpdatedAt(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupId, t.userId] }),
  })
);

// ---------- Relations ----------
export const GroupRelations = relations(Group, ({ one, many }) => ({
  goal: one(Goal, {
    fields: [Group.goalId],
    references: [Goal.id],
  }),
  creator: one(User, {
    fields: [Group.creatorId],
    references: [User.id],
  }),
  participants: many(GroupParticipants),
}));

export const GoalRelations = relations(Goal, ({ one, many }) => ({
  group: one(Group, {
    fields: [Goal.id],
    references: [Group.goalId],
  }),
  occurrences: many(GoalOccurrence),
}));

export const GroupParticipantsRelations = relations(
  GroupParticipants,
  ({ one }) => ({
    group: one(Group, {
      fields: [GroupParticipants.groupId],
      references: [Group.id],
    }),
    user: one(User, {
      fields: [GroupParticipants.userId],
      references: [User.id],
    }),
  })
);

export type UserSelect = typeof User.$inferSelect;
export type UserInsert = typeof User.$inferInsert;

export type SessionSelect = typeof Session.$inferSelect;
export type SessionInsert = typeof Session.$inferInsert;

export type AccountSelect = typeof Account.$inferSelect;
export type AccountInsert = typeof Account.$inferInsert;

export type VerificationSelect = typeof Verification.$inferSelect;
export type VerificationInsert = typeof Verification.$inferInsert;

export type CharitySelect = typeof Charity.$inferSelect;
export type CharityInsert = typeof Charity.$inferInsert;

export type GoalSelect = typeof Goal.$inferSelect;
export type GoalInsert = typeof Goal.$inferInsert;

export type GoalOccurrenceSelect = typeof GoalOccurrence.$inferSelect;
export type GoalOccurrenceInsert = typeof GoalOccurrence.$inferInsert;

export type GroupSelect = typeof Group.$inferSelect;
export type GroupInsert = typeof Group.$inferInsert;

export type GroupParticipantsSelect = typeof GroupParticipants.$inferSelect;
export type GroupParticipantsInsert = typeof GroupParticipants.$inferInsert;
