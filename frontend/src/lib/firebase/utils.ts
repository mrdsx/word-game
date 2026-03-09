export function mapFirebaseErrorCode(str: string): string | undefined {
  switch (str) {
    case "auth/email-already-in-use":
      return "Email is already used.";
    case "auth/invalid-argument":
      return "Invalid request.";
    case "auth/unauthenticated":
      return "Unauthenticated.";
    case "auth/permission-denied":
      return "Unauthorized.";
    default:
      return undefined;
  }
}
