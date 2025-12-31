
import { parsePoster } from '../services/ocrService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testOCR() {
    try {
        const imagePath = path.join(__dirname, '../uploads/test_poster.jpg');
        console.log('Testing OCR on:', imagePath);

        const result = await parsePoster(imagePath);
        console.log('OCR Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testOCR();
