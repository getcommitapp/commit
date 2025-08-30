CREATE TABLE `account` (
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
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `charity` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `goal` (
	`id` text PRIMARY KEY NOT NULL,
	`ownerId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`startDate` integer NOT NULL,
	`endDate` integer,
	`dueStartTime` integer NOT NULL,
	`dueEndTime` integer,
	`localDueStart` text,
	`localDueEnd` text,
	`recurrence` text,
	`stakeCents` integer NOT NULL,
	`currency` text NOT NULL,
	`destinationType` text NOT NULL,
	`destinationUserId` text,
	`destinationCharityId` text,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`destinationUserId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`destinationCharityId`) REFERENCES `charity`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `goal_timer` (
	`id` text PRIMARY KEY NOT NULL,
	`goalId` text NOT NULL,
	`userId` text NOT NULL,
	`startedAt` integer,
	`createdAt` integer DEFAULT (current_timestamp),
	FOREIGN KEY (`goalId`) REFERENCES `goal`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `goal_verifications_log` (
	`id` text PRIMARY KEY NOT NULL,
	`goalId` text NOT NULL,
	`userId` text NOT NULL,
	`verifiedAt` integer,
	`approvalStatus` text NOT NULL,
	`approvedBy` text,
	`startTime` integer,
	`photoDescription` text,
	`photoUrl` text,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`goalId`) REFERENCES `goal`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`approvedBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
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
	`graceTimeSeconds` integer DEFAULT 60,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`goalId`) REFERENCES `goal`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `group` (
	`id` text PRIMARY KEY NOT NULL,
	`creatorId` text NOT NULL,
	`goalId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`inviteCode` text NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`goalId`) REFERENCES `goal`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_inviteCode_unique` ON `group` (`inviteCode`);--> statement-breakpoint
CREATE TABLE `group_participants` (
	`groupId` text NOT NULL,
	`userId` text NOT NULL,
	`joinedAt` integer NOT NULL,
	`status` text,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	PRIMARY KEY(`groupId`, `userId`),
	FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`stripeCustomerId` text,
	`timezone` text DEFAULT 'UTC',
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL
);
