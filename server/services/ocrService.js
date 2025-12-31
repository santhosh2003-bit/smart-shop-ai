import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parsePoster = (imagePath) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../scripts/process_poster.py');
        console.log(`Executing Python OCR script: ${scriptPath} on ${imagePath}`);

        // Use the Python 3.10 executable where dependencies were installed
        const pythonPath = 'C:\\Users\\santh\\AppData\\Local\\Programs\\Python\\Python310\\python.exe';

        execFile(pythonPath, [scriptPath, imagePath], (error, stdout, stderr) => {
            if (error) {
                console.error('Python execution error:', error);
                console.error('Stderr:', stderr); // Capture python errors
                return reject(error);
            }

            try {
                // Find the first valid JSON object in output (ignore EasyOCR init logs if any leak)
                // We configured python to print JSON last.
                // However, EasyOCR might print "CUDA not available" to stderr, which is fine.
                // stdout should contain our JSON.

                console.log('Python Output (Raw):', stdout);
                const result = JSON.parse(stdout.trim());

                if (result.error) {
                    return reject(new Error(result.error));
                }

                resolve(result);
            } catch (parseError) {
                console.error('Failed to parse Python output:', stdout);
                reject(parseError);
            }
        });
    });
};
