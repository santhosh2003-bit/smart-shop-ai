import Tesseract from 'tesseract.js';
import fs from 'fs';

export const parsePoster = async (imagePath) => {
    try {
        console.log(`Processing image: ${imagePath}`);
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
            logger: m => console.log(m)
        });

        console.log('Extracted Text:', text);

        // Heuristic parsing: Look for lines with prices
        const lines = text.split('\n');
        const products = [];

        // Regex for price: $10.99, 10.99, $10, 10/-
        const priceRegex = /(\$?\d+\.?\d{0,2})\/?-?/;

        lines.forEach((line) => {
            const match = line.match(priceRegex);
            if (match) {
                // Assume the text before or after the price is the product name
                // This is a naive heuristic but works for simple lists
                const cleanLine = line.replace(match[0], '').trim();
                const price = parseFloat(match[1].replace('$', ''));

                if (cleanLine.length > 3 && price > 0) {
                    products.push({
                        name: cleanLine, // Simple extraction
                        price: price,
                        description: 'Extracted from poster offer',
                        category: 'Offers'
                    });
                }
            }
        });

        // Cleanup file after processing
        // fs.unlinkSync(imagePath); 
        // Keep it for now to serve it

        return products;
    } catch (error) {
        console.error('OCR Error:', error);
        throw error;
    }
};
