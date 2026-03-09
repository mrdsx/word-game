export const envServiceAccount = {
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
  privateKey: import.meta.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Important for private key
};
