import { initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
  type Functions,
} from "firebase/functions";
import { firebaseConfig } from "./config";

export const firebase: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(firebase);
export const db: Firestore = getFirestore(firebase);
export const functions: Functions = getFunctions(firebase);

if (import.meta.env.MODE === "development") {
  console.info("Connecting to firebase emulators");
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export { REQUIRES_RECENT_LOGIN } from "./constants";
export { actionCodeSettings } from "./config";
export { mapFirebaseErrorCode } from "./utils";
