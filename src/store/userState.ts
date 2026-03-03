import type { User } from "firebase/auth";
import { atom } from "nanostores";

type UserState = {
  currentUser: User | null;
};

export const userState = atom<UserState>({
  currentUser: null,
});

export function setUser(user: UserState["currentUser"]): void {
  userState.set({ ...userState.get(), currentUser: user });
}
