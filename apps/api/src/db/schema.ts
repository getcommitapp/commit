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

  recurrence: text("recurrence"),

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

  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
});

export const GoalVerificationsMethod = sqliteTable(
  "goal_verifications_method",
  {
    id: text("id").primaryKey(),
    goalId: text("goalId")
      .notNull()
      .references(() => Goal.id, { onDelete: "cascade" }),

    method: text("method").notNull(),

    latitude: real("latitude"),
    longitude: real("longitude"),
    radiusM: integer("radiusM"),
    durationSeconds: integer("durationSeconds"),
    graceTime: integer("graceTime", { mode: "timestamp" }),

    createdAt: createCreatedAt(),
    updatedAt: createUpdatedAt(),
  }
);

export const GoalVerificationsLog = sqliteTable("goal_verifications_log", {
  id: text("id").primaryKey(), // uuid stored as text
  goalId: text("goalId")
    .notNull()
    .references(() => Goal.id, { onDelete: "cascade" }),

  userId: text("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),

  type: text("type").notNull(),
  verifiedAt: integer("verifiedAt", { mode: "timestamp" }),
  approvalStatus: text("approvalStatus", {
    enum: ["pending", "approved", "rejected"],
  }).notNull(),
  approvedBy: text("approvedBy").references(() => User.id, {
    onDelete: "cascade",
  }),

  startTime: integer("startTime", { mode: "timestamp" }),
  photoDescription: text("photoDescription"),
  photoUrl: text("photoUrl"),

  createdAt: createCreatedAt(),
  updatedAt: createUpdatedAt(),
});

export const GoalTimer = sqliteTable("goal_timer", {
  id: text("id").primaryKey(),
  goalId: text("goalId")
    .notNull()
    .references(() => Goal.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  startedAt: integer("startedAt", { mode: "timestamp" }),
  createdAt: createCreatedAt(),
});

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
  participants: many(GroupParticipants),
}));

export const GoalRelations = relations(Goal, ({ many }) => ({
  verificationMethods: many(GoalVerificationsMethod),
}));

export const GoalVerificationsMethodRelations = relations(
  GoalVerificationsMethod,
  ({ one }) => ({
    goal: one(Goal, {
      fields: [GoalVerificationsMethod.goalId],
      references: [Goal.id],
    }),
  })
);

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

export type GoalVerificationsMethodSelect =
  typeof GoalVerificationsMethod.$inferSelect;
export type GoalVerificationsMethodInsert =
  typeof GoalVerificationsMethod.$inferInsert;

export type GoalVerificationsLogSelect =
  typeof GoalVerificationsLog.$inferSelect;
export type GoalVerificationsLogInsert =
  typeof GoalVerificationsLog.$inferInsert;

export type GroupSelect = typeof Group.$inferSelect;
export type GroupInsert = typeof Group.$inferInsert;

export type GroupParticipantsSelect = typeof GroupParticipants.$inferSelect;
export type GroupParticipantsInsert = typeof GroupParticipants.$inferInsert;

export type GoalTimerSelect = typeof GoalTimer.$inferSelect;
export type GoalTimerInsert = typeof GoalTimer.$inferInsert;
