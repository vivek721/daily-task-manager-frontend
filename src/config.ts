/**
 * Backend origin, e.g. `https://api.example.com` (no trailing `/api`).
 * Set `VITE_API_URL` in `.env.local` or the build environment; Vite inlines it at build time.
 */
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

/** Base URL for all REST calls. */
export const API_BASE_URL = `${API_URL}/api`;
