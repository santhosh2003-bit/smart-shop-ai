
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'smart_shop'
};

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to DB.');

        // Add columns to stores
        try {
            await connection.query(`ALTER TABLE stores ADD COLUMN latitude DECIMAL(10, 8), ADD COLUMN longitude DECIMAL(11, 8)`);
            console.log('Added lat/lng to stores.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('Columns already exist in stores.');
            else console.error('Error modifying stores:', e);
        }

        // Add columns to products
        try {
            await connection.query(`ALTER TABLE products ADD COLUMN latitude DECIMAL(10, 8), ADD COLUMN longitude DECIMAL(11, 8)`);
            console.log('Added lat/lng to products.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('Columns already exist in products.');
            else console.error('Error modifying products:', e);
        }

    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
