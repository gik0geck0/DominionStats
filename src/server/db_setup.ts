import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';

console.log("DB configured to pull from env vars: ", JSON.stringify(process.env));
// Single global pool to be used for all queries
const pool = new Pool();

async function init(): Promise<void> {
    // wait until the database is available, give it a 10s head-start
    console.log("Waiting for DB to start, beginning at " + new Date());
    let retries = 0;
    while (retries < 10) {
        retries++;
        // Validate connection
        try {
            await pool.query('SELECT NOW()');
            break;
        } catch (e) {
            console.log("Failed to connect to DB on attempt " + retries + " time: " + new Date());
            await new Promise((res) => setTimeout(res, 1000));
        }
    }

    // Migrate the database schema
    // Referenc: https://www.npmjs.com/package/postgres-migrations
    const client = await pool.connect();
    try {
        await migrate({client}, "db-migrations");
    } finally {
        // release the client back to the pool when we're done
        await client.release();
    }
}

// Verify connection and run migrations on startup
init();

interface TestObject {
    id: number;
    name: string;
    score: number;
}

export async function testQueryAll(): Promise<TestObject[]> {
    const res = await pool.query("SELECT id, name, score FROM test_table");
    return res.rows as TestObject[];
}