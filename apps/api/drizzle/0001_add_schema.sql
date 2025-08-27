CREATE TABLE `charity` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `goal` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`startDate` integer,
	`endDate` integer,
	`dueStartTime` integer,
	`dueEndTime` integer,
	`recurrence` text,
	`stakeCents` integer,
	`currency` text,
	`destinationType` text,
	`destinationUserId` text,
	`destinationCharityId` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`destinationUserId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`destinationCharityId`) REFERENCES `charity`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `goal_verifications_log` (
	`id` text PRIMARY KEY NOT NULL,
	`goalId` text NOT NULL,
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`verifiedAt` integer,
	`approvalStatus` text,
	`approvedBy` text,
	`startTime` integer,
	`photoDescription` text,
	`photoUrl` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`goalId`) REFERENCES `goal`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`approvedBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `goal_verifications_method` (
	`id` text PRIMARY KEY NOT NULL,
	`goalId` text NOT NULL,
	`method` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`radiusM` integer,
	`durationSeconds` integer,
	`graceTime` integer,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`goalId`) REFERENCES `goal`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `group` (
	`id` text PRIMARY KEY NOT NULL,
	`creatorId` text NOT NULL,
	`goalId` text,
	`name` text NOT NULL,
	`description` text,
	`inviteCode` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`goalId`) REFERENCES `goal`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_inviteCode_unique` ON `group` (`inviteCode`);--> statement-breakpoint
CREATE TABLE `group_participants` (
	`groupId` text NOT NULL,
	`userId` text NOT NULL,
	`joinedAt` integer NOT NULL,
	`status` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL,
	PRIMARY KEY(`groupId`, `userId`),
	FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "createdAt", "updatedAt") SELECT "id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "createdAt", "updatedAt" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "expiresAt", "token", "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") SELECT "id", "expiresAt", "token", "createdAt", "updatedAt", "ipAddress", "userAgent", "userId" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt") SELECT "id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `__new_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()),
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_verification`("id", "identifier", "value", "expiresAt", "createdAt", "updatedAt") SELECT "id", "identifier", "value", "expiresAt", "createdAt", "updatedAt" FROM `verification`;--> statement-breakpoint
DROP TABLE `verification`;--> statement-breakpoint
ALTER TABLE `__new_verification` RENAME TO `verification`;