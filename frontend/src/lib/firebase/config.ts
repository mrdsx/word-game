import { FRONTEND_URL } from "$lib/constants";
import { type FirebaseOptions } from "firebase/app";
import type { ActionCodeSettings } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDxEuhh_usXK0HH5j2sclSLmIUt4z13hj0",
  authDomain: "classic-word-game.firebaseapp.com",
  projectId: "classic-word-game",
  storageBucket: "classic-word-game.firebasestorage.app",
  messagingSenderId: "1000546096889",
  appId: "1:1000546096889:web:b12d90268ee0c6209d7428",
} satisfies FirebaseOptions;

export const actionCodeSettings = {
  url: FRONTEND_URL,
  handleCodeInApp: true,
} satisfies ActionCodeSettings;
