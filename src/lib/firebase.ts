import {
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  type ActionCodeSettings,
  type Auth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import { FRONTEND_URL } from "./constants";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} satisfies FirebaseOptions;

export const actionCodeSettings = {
  url: FRONTEND_URL,
  handleCodeInApp: true,
} satisfies ActionCodeSettings;

export const firebase: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(firebase);
export const db: Firestore = getFirestore(firebase);

if (import.meta.env.MODE === "development") {
  console.info("Connecting to firebase emulators");
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
