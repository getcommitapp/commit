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
	`recDaysMask` integer,
	`stakeCents` integer NOT NULL,
	`currency` text NOT NULL,
	`destinationType` text NOT NULL,
	`destinationUserId` text,
	`destinationCharityId` text,
	`method` text NOT NULL,
	`graceTimeSeconds` integer,
	`durationSeconds` integer,
	`geoLat` real,
	`geoLng` real,
	`geoRadiusM` integer,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`destinationUserId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`destinationCharityId`) REFERENCES `charity`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `goal_occurrence` (
	`goalId` text NOT NULL,
	`userId` text NOT NULL,
	`occurrenceDate` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`verifiedAt` integer,
	`photoUrl` text,
	`photoDescription` text,
	`timerStartedAt` integer,
	`timerEndedAt` integer,
	`violated` integer,
	`approvedBy` text,
	`createdAt` integer DEFAULT (current_timestamp),
	`updatedAt` integer NOT NULL,
	PRIMARY KEY(`goalId`, `userId`, `occurrenceDate`),
	FOREIGN KEY (`goalId`) REFERENCES `goal`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`approvedBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
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
