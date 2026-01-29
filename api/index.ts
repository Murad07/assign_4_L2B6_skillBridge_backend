// Serverless entry for Vercel: re-export the Express app from src/app
// Vercel will compile TypeScript files in the `api/` directory automatically.
// Use ESM-safe resolution: derive __dirname from import.meta.url and use dynamic
// import() so this module works as an ES module on Vercel. Top-level await is
// used to synchronously export the app after loading the correct target.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distAppPathAbs = path.join(__dirname, '..', 'dist', 'app.js');

let app;
if (fs.existsSync(distAppPathAbs)) {
    // Import the compiled app from dist as an absolute file URL
    const mod = await import(pathToFileURL(distAppPathAbs).href);
    app = mod.default;
} else {
    // During local dev (when running src directly), import the source app.
    const mod = await import('../src/app');
    app = mod.default;
}

export default app;
