CREATE TABLE `interview_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`questionId` varchar(80) NOT NULL,
	`answer` text NOT NULL,
	`score` int NOT NULL,
	`feedback` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interview_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `interview_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(80) NOT NULL,
	`title` varchar(160) NOT NULL,
	`category` varchar(80) NOT NULL,
	`icon` varchar(40) NOT NULL,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interview_jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `interview_jobs_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `interview_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int,
	`interviewType` varchar(40) NOT NULL,
	`prompt` text NOT NULL,
	`referenceAnswer` text NOT NULL,
	`criteria` text NOT NULL,
	`difficulty` varchar(20) NOT NULL DEFAULT 'متوسط',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interview_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `interview_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`jobId` int NOT NULL,
	`interviewType` varchar(40) NOT NULL,
	`questionIds` text NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'active',
	`totalScore` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `interview_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
