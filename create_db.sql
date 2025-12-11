-- Create database and tables for Health app

CREATE DATABASE IF NOT EXISTS health;
USE health;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    hashedPassword VARCHAR(255),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT,
    user_id INT,
    activity_type VARCHAR(50),
    duration_minutes INT,
    distance_km DECIMAL(5,2),
    activity_date DATE,
    notes TEXT,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the application user
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';
