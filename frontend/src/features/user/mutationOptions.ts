import type { MutationOptions } from "@tanstack/svelte-query";
import { updateProfile, type User } from "firebase/auth";
import { MAX_NICKNAME_LENGTH, MIN_NICKNAME_LENGTH } from "./constants";
import { userQueryKeys } from "./queryKeys";
import { normalizeNickname } from "./utils";

type UserProfileMutationOptions = MutationOptions<
  void,
  Error,
  { user: User; nickname: string },
  unknown
>;

export const userProfileMutationOptions = {
  mutationKey: userQueryKeys.profile,
  mutationFn: async ({ user, nickname }: { user: User; nickname: string }) => {
    const normalized = normalizeNickname(nickname);
    if (
      normalized.length < MIN_NICKNAME_LENGTH ||
      normalized.length > MAX_NICKNAME_LENGTH
    ) {
      throw new Error("Nickname must be between 3 and 20 characters.");
    }

    await updateProfile(user, { displayName: normalized });
  },
} satisfies UserProfileMutationOptions;
