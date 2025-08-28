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