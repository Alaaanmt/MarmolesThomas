import { createPool, Pool } from "mysql2/promise";

let pool: Pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (connectionString) {
      pool = createPool({
        uri: connectionString,
        ssl: {
          rejectUnauthorized: false 
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    } else {

      pool = createPool({
        host: 'localhost',
        port: 3306,
        password: '',
        user: 'root',
        database: 'marmolesthomas',
        waitForConnections: true,
        connectionLimit: 10,
      });
    }
  }
  return pool;
}