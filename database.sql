DROP DATABASE IF EXISTS `timesheet`;
CREATE DATABASE `timesheet` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
use `timesheet`;
CREATE TABLE `employees` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `sex` BIT NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `role_id` INT NOT NULL,
    `notes` VARCHAR(255),
    `token` VARCHAR(50)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE `roles` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `notes` VARCHAR(255)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE `approvers` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `approver_id` INT NOT NULL,
    `employee_id` INT NOT NULL,
    `project_id` INT NOT NULL,
    `notes` VARCHAR(255)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE `projects` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `leader_id` INT NOT NULL,
    `notes` VARCHAR(255)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE `employees_projects` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `employee_id` INT NOT NULL,
    `project_id` INT NOT NULL,
    `notes` VARCHAR(255)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE `timesheets` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `employee_id` INT NOT NULL,
    `project_id` INT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `working_date` DATE NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `working_hours` FLOAT NOT NULL,
    `efficiency` INT NOT NULL,
    `notes` VARCHAR(255)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;


CREATE TABLE `approves` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `approver_id` INT NOT NULL,
    `timesheet_id` INT NOT NULL,
    `working_hours` FLOAT NOT NULL,
    `efficiency` INT NOT NULL,
    `notes` VARCHAR(255)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;


ALTER TABLE employees
ADD FOREIGN KEY (role_id)
REFERENCES roles(id);

ALTER TABLE employees
ADD UNIQUE (email);

ALTER TABLE approves
ADD FOREIGN KEY (approver_id)
REFERENCES employees(id);

ALTER TABLE employees_projects
ADD FOREIGN KEY (employee_id)
REFERENCES employees(id);

ALTER TABLE employees_projects
ADD FOREIGN KEY (project_id)
REFERENCES projects(id);

ALTER TABLE approves
ADD FOREIGN KEY (timesheet_id)
REFERENCES timesheets(id);

ALTER TABLE approvers
ADD FOREIGN KEY (approver_id)
REFERENCES employees(id);

ALTER TABLE approvers
ADD FOREIGN KEY (employee_id)
REFERENCES employees(id);

ALTER TABLE approvers
ADD FOREIGN KEY (project_id)
REFERENCES projects(id);

ALTER TABLE projects
ADD FOREIGN KEY (leader_id)
REFERENCES employees(id);

ALTER TABLE timesheets
ADD FOREIGN KEY (employee_id)
REFERENCES employees(id);

ALTER TABLE timesheets
ADD FOREIGN KEY (project_id)
REFERENCES projects(id);

ALTER TABLE employees_projects
ADD UNIQUE (employee_id, project_id);

ALTER TABLE approves
ADD UNIQUE (approver_id, timesheet_id);
