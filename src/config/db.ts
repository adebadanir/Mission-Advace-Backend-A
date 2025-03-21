import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.on("connection", (connection) => {
  logger.info("Database connection established");

  connection.on("enqueue", (query) => {
    logger.info(`Query enqueued: ${query.sql}`);
  });

  connection.on("error", (err) => {
    logger.error(`Database error: ${err.message}`);
  });
});

export const query = (sql: string, values?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    logger.info(`Executing query: ${sql} with values: ${JSON.stringify(values)}`);

    db.query(sql, values)
      .then(([results]) => {
        logger.info(`Query successful: ${JSON.stringify(results)}`);
        resolve(results);
      })
      .catch((error) => {
        logger.error(`Query error: ${error.message}`);
        reject(error);
      });
  });
};
