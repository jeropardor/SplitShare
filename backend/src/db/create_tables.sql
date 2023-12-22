
DROP TABLE Payment    CASCADE;
DROP TABLE Bill       CASCADE;
DROP TABLE Tag        CASCADE;
DROP TABLE Category   CASCADE;
DROP TABLE User       CASCADE;


-- Table for User Authentication
CREATE TABLE User (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    creationDate DATE NOT NULL,
    CONSTRAINT pk_User PRIMARY KEY (id)
);

-- Categories Table
CREATE TABLE Category (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_Category PRIMARY KEY (id)
);

-- Tags Table
CREATE TABLE Tag (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_Category PRIMARY KEY (id)
);

-- Bills Table
CREATE TABLE Bill (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    currency VARCHAR(20) NOT NULL,
    categoryId INT,
    user_id INT NOT NULL,
    creationDate DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (category_id) REFERENCES Category(id),
    CONSTRAINT pk_Bill PRIMARY KEY (id)
);

-- Entries in Payments Table
CREATE TABLE Payment (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    photo VARCHAR(255),
    tag_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    paid_by_User_id INT NOT NULL,
    createdBy INT,
    bill_id INT NOT NULL,
    FOREIGN KEY (tag_id) REFERENCES Tag(id),
    FOREIGN KEY (paid_by_User_id) REFERENCES User(id),
    FOREIGN KEY (paid_to_User_id) REFERENCES User(id),
    FOREIGN KEY (bill_id) REFERENCES Bill(id),
    CONSTRAINT pk_Payment PRIMARY KEY (id)
);