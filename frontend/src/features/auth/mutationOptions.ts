import { actionCodeSettings, auth } from "$lib/firebase";
import type { MutationOptions } from "@tanstack/svelte-query";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  type AuthError,
  type User,
  type UserCredential,
} from "firebase/auth";
import { authQueryKeys } from "./queryKeys";

type LoginMutationOptions = MutationOptions<
  void,
  Error,
  { email: string; password: string },
  unknown
>;

type RegisterMutationOptions = MutationOptions<
  UserCredential,
  AuthError,
  { email: string; password: string },
  unknown
>;

type VerifyEmailMutationOptions = MutationOptions<void, Error, User, unknown>;

export const loginMutationOptions = {
  mutationKey: authQueryKeys.login,
  mutationFn: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await signInWithEmailAndPassword(auth, email, password);
  },
} satisfies LoginMutationOptions;

export const registerMutationOptions = {
  mutationKey: authQueryKeys.register,
  mutationFn: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  },
} satisfies RegisterMutationOptions;

export const verifyEmailMutationOptions = {
  mutationKey: authQueryKeys.verifyEmail,
  mutationFn: async (user: User) => {
    await sendEmailVerification(user, actionCodeSettings);
  },
} satisfies VerifyEmailMutationOptions;
