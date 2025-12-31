
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testUpload() {
    try {
        const form = new FormData();
        form.append('name', 'Test Product manual');
        form.append('description', 'Desc');
        form.append('price', '10.99');
        form.append('category', 'Fruits');
        form.append('storeId', '1766678455470'); // Valid store ID
        // We need a valid store ID in DB. Let's assume one exists or we might get DB error, not crash.

        // Mock image
        const imagePath = path.join(__dirname, '../uploads/test_poster.jpg');
        if (fs.existsSync(imagePath)) {
            form.append('image', fs.createReadStream(imagePath));
        }

        const res = await fetch('http://localhost:5050/api/products', {
            method: 'POST',
            body: form
        });

        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', data);

    } catch (e) {
        console.error('Test Error:', e);
    }
}

testUpload();
