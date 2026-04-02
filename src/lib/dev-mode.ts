/**
 * Dev mode is active when Firebase env vars are not configured.
 * Hooks return mock data and auth is bypassed.
 * Once .env.local is filled in and the server restarted, real Firebase is used automatically.
 */
export const IS_DEV_MODE = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
