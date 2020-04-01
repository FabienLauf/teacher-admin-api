import mysql from "mysql";
import * as dotenv from "dotenv";

/**
 Helper module to request the Database.
 */
dotenv.config();

// Create a pool of connections to the database
const pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

/**
 * Format and escape a SQL query an return the result as a Promise
 */
function querySql(query: string, params: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        pool.getConnection(function(errC, connection) {
            if(errC) reject(errC);
            else {
                const sqlFormatted = mysql.format(query, params);
                connection.query(sqlFormatted, function (errQ, results) {
                    if (errQ) {
                        console.error("querySql errQ: ", errQ);
                        reject(errQ);
                    }
                    else {
                        resolve(results);
                    }
                    connection.release();
                });
            }
        });
    });
}

export default querySql;