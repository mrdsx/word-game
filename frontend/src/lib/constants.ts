export const FRONTEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : import.meta.env.VITE_FRONTEND_URL;

export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4321/api"
    : import.meta.env.VITE_API_URL;
