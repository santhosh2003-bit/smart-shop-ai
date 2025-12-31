
import pool from '../config/db.js';

async function getStoreId() {
    try {
        const [stores] = await pool.query('SELECT id FROM stores LIMIT 1');
        if (stores.length > 0) {
            console.log(stores[0].id);
        } else {
            console.log('NO_STORE');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

getStoreId();
