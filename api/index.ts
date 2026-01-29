// Serverless entry for Vercel: re-export the Express app from src/app
// Vercel will compile TypeScript files in the `api/` directory automatically.
import app from '../src/app';

export default app;
