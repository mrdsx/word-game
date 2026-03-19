import { BACKEND_URL } from "./constants";

export function apiFetch(
  path: `/${string}`,
  init?: RequestInit,
): ReturnType<typeof fetch> {
  return fetch(`${BACKEND_URL}/api/v1${path}`, init);
}
