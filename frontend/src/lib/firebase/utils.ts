const messages: Record<string, string> = {
  "auth/email-already-in-use": "Email is already used.",
  "auth/invalid-argument": "Invalid request.",
  "auth/unauthenticated": "Unauthenticated.",
  "auth/permission-denied": "Permission denied.",
  "permission-denied": "Permission denied.",
};

export function mapFirebaseErrorCode(code: string): string | undefined {
  return messages[code];
}
