CREATE TABLE `service_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`image` varchar(1000),
	`category` enum('construction','plowing') NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_categories_serviceId_unique` UNIQUE(`serviceId`)
);
