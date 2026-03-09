import { API_URL } from "./constants";

export function apiFetch(
  path: `/${string}`,
  init?: RequestInit,
): ReturnType<typeof fetch> {
  return fetch(`${API_URL}${path}`, init);
}
