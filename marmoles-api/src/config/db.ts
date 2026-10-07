import { createPool, Pool } from "mysql2/promise";

let pool: Pool;

export function getPool(){
    if(!pool){
        pool = createPool({
            host: 'localhost',
            port: 3306,
            password: '',
            user: 'root',
            database: 'marmolesthomas',
            waitForConnections: true,
            connectionLimit: 10,
        })
    }
    return pool
}
