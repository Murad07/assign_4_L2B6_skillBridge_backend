import app from '../src/app';

// Vercel's Node runtime expects a default export function (req, res).
// An Express `app` is itself a request handler, so we can export it directly.
export default app;
