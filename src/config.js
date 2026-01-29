const isProduction = import.meta.env.MODE === "production";

// In production, we use relative paths thanks to Vercel rewrites.
// In development, we use relative paths thanks to Vite proxy.
export const API_BASE_URL = "";
export const API_URL = "/api";

export default {
  API_BASE_URL,
  API_URL,
};
