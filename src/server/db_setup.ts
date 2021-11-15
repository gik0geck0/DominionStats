import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';

/**
 * Single global pool to be used for all queries
 * Grabs connection info out of environment variables:
 * PGUSER       default=??
 * PGHOST       default=localhost
 * PGPASSWORD   default=??
 * PGDATABASE   default=postgres
 * PGPORT       default=5432
 */
const pool = new Pool();

//for importing from csv file
const fs = require("fs");
const fastcsv = require("fast-csv");

async function init(): Promise<void> {
    // startup delay to ensure cloudsql-proxy comes up
    await new Promise((res) => setTimeout(res, 5000));

    // Validate connection
    try {
        await pool.query('SELECT NOW()');
    } catch (e) {
        console.log("Failed to connect to DB: ", e);
        throw e;
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

   

    //for importing game logs from csv file
    const stream = fs.createReadStream("/app/db-migrations/GameLogs.csv");
    const csvData: any[] = [];

    //to ensure that data is only inserted once
    const gameResults = await pool.query("SELECT game_label FROM game_results");
    const fillTable = gameResults.rows;

    //if the rows are empty, fill with raw data
    if (fillTable.length < 1) {
        const csvStream = fastcsv
        .parse()
        .on("data", function(data: any) {
            csvData.push(data);
        })
        .on("end", function() {
            // remove the first line: header
            csvData.shift();

            const query = "INSERT INTO game_results (game_label, player_num, player_name, victory_points) VALUES ($1, $2, $3, $4)";

            pool.connect((err, c, done) => {
                if (err) throw err;
                try {
                csvData.forEach(row => {
                    client.query(query, row, (error) => {
                    if (error) {
                        console.log(error.stack);
                    }
                    });
                });
                } finally {
                done();
                }
            });
        });
        stream.pipe(csvStream);
    }
}

// Verify connection and run migrations on startup
init().catch((e) => {
    console.error("Failed to init db_setup: ", e);
    process.exit(1);
});

interface TestObject {
    id: number;
    name: string;
    score: number;
}

interface GameResults {
    id: number;
    game_label: string;
    player_num: number;
    player_name: string;
    victory_points: number;
}

interface DataUpload {
    id: number;
    game_label: string;
    player_num: number;
    player_name: string;
    victory_points: number;
}

export async function testQueryAll(): Promise<TestObject[]> {
    const res = await pool.query("SELECT id, name, score FROM test_table") 
    return res.rows as TestObject[];
}

export async function testQueryAll2(): Promise<GameResults[]> {
    const res = await pool.query("SELECT id, game_label, player_num, player_name, victory_points FROM game_results");
    return res.rows as GameResults[];
}

//to test data upload
export async function testQueryAll3(req: any): Promise<DataUpload[]> {
    const query = "INSERT INTO data_upload (player_name, victory_points) VALUES ($3, $4)";
    const Game_Results = req.body;

    Game_Results.forEach((result: any) => {
        pool.query(query, result, (error) => {
        if (error) {
            console.log(error.stack);
        }
        });
    });

    const res = await pool.query("SELECT id, game_label, player_num, player_name, victory_points FROM data_upload");

    return res.rows as DataUpload[];
}

//to test that data has been uploaded
export async function testQueryAll4(): Promise<DataUpload[]> {
    const res = await pool.query("SELECT id, game_label, player_num, player_name, victory_points FROM data_upload");
    return res.rows as DataUpload[];
}
