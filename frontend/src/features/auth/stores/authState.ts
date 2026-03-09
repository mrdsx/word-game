import type { User } from "firebase/auth";
import { atom } from "nanostores";

type AuthState = {
  currentUser: User | null;
};

export const authState = atom<AuthState>({
  currentUser: null,
});

export function setUser(user: AuthState["currentUser"]): void {
  authState.set({ ...authState.get(), currentUser: user });
}
