import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { envServiceAccount } from "./config";

if (import.meta.env.MODE === "development") {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
}

const firebase = initializeApp({
  credential: cert(envServiceAccount),
  projectId: envServiceAccount.projectId,
});
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
