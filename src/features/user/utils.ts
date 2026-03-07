import { MAX_NICKNAME_LENGTH, MIN_NICKNAME_LENGTH } from "./constants";

export function normalizeNickname(nickname: string): string {
  return nickname.trim();
}

export function validateNickname(nickname: string): void {
  if (nickname.length < MIN_NICKNAME_LENGTH) {
    throw new Error("Nickname must be at least 3 characters long.");
  }
  if (nickname.length > MAX_NICKNAME_LENGTH) {
    throw new Error("Nickname must be at most 20 characters long.");
  }

  if (!/^[a-zA-Z]+$/.test(nickname)) {
    throw new Error("Invalid nickname.");
  }
}
