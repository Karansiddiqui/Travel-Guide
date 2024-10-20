import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
const connectionDB = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: Number(process.env.DBPORT)
});

const createSchema = async () => {
  try {
    // Connect to the database
    await connectionDB.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`);
    await connectionDB.query(`USE ${process.env.DATABASE}`);
    
    // Create Users table
    await connectionDB.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("Users table created successfully");

  } catch (error) {
    console.error("Error creating schema: ", error);
  }
};

// Call the function to create the schema
createSchema();

export default connectionDB;