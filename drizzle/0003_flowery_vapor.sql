CREATE TABLE `service_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` varchar(100) NOT NULL,
	`imageUrl` varchar(1000) NOT NULL,
	`imageKey` varchar(500),
	`isPrimary` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_images_id` PRIMARY KEY(`id`)
);
