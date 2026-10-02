// Base URL for API requests. In development with Vite proxy, this defaults to empty string ('').
// In production, set VITE_API_URL in client/.env (e.g., https://your-backend.onrender.com)
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Returns the fully qualified API endpoint URL.
 * @param {string} endpoint Path starting with /api
 * @returns {string} Complete URL or relative path
 */
export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};
