import { FirebaseError } from "firebase/app";

const messages: Record<string, string> = {
  "auth/email-already-in-use": "Email is already used",
  "auth/invalid-argument": "Invalid request",
  "auth/unauthenticated": "Not authenticated",
  "auth/permission-denied": "Permission denied",
  "permission-denied": "Permission denied",
};

export function mapFirebaseErrorCode(code: string): string | undefined {
  return messages[code];
}

export function handleHttpStatusCode(statusCode: number): void {
  let code = null;

  if (statusCode === 401) {
    code = "auth/unauthenticated";
  } else if (statusCode === 403) {
    code = "auth/permission-denied";
  } else if (statusCode === 400) {
    code = "auth/invalid-argument";
  }

  if (code !== null) {
    throw new FirebaseError(
      code,
      mapFirebaseErrorCode(code) ?? "Something went wrong",
    );
  }
}
