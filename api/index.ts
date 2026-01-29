// Serverless entry for Vercel: re-export the Express app from src/app
// Vercel will compile TypeScript files in the `api/` directory automatically.
// Import the compiled JS from `dist` so the runtime can resolve a concrete file
// When deploying, Vercel runs the `vercel-build` (tsc) which outputs to `dist/`.
// Fallback to `src` during local dev if `dist/app.js` does not exist.
import fs from 'fs';
import path from 'path';

const distAppPath = path.join(__dirname, '..', 'dist', 'app.js');

let app;
if (fs.existsSync(distAppPath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    app = require(distAppPath).default;
} else {
    // Local/dev path: import from source (ensure TS runner supports it)
    // Use dynamic import to avoid static ESM resolution issues during build
    // Note: This branch is only for local dev where tsx/ts-node runs src directly.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    app = require('../src/app').default;
}

export default app;
