import { db } from "../config/db";

export const syncDatabase = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Sync database...");

    await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
           id VARCHAR(255) NOT NULL PRIMARY KEY,
           fullname VARCHAR(255) NOT NULL,
           username VARCHAR(255) NOT NULL UNIQUE,
           email VARCHAR(255) NOT NULL, 
           password VARCHAR(255) NOT NULL,
           token VARCHAR(255) NOT NULL,
           verified BOOLEAN DEFAULT FALSE,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           deleted_at TIMESTAMP DEFAULT NULL
        )`);
    await connection.query(`
          CREATE TABLE IF NOT EXISTS courses (
              id INT AUTO_INCREMENT PRIMARY KEY,
              image VARCHAR(255),
              category VARCHAR(255),
              title VARCHAR(255) NOT NULL,
              subtitle VARCHAR(255),
              rating DECIMAL(2, 1),
              description TEXT,
              price DECIMAL(10, 2),
              discount DECIMAL(10, 2) DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              deleted_at DATETIME DEFAULT NULL
          )`);
    connection.release();
    console.log("Database synced");
  } catch (error) {
    throw error;
  }
};
