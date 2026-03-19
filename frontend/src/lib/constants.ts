export const FRONTEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : import.meta.env.VITE_FRONTEND_URL;

export const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://127.0.0.1:8000"
    : import.meta.env.VITE_BACKEND_URL;
