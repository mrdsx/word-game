import { z } from "zod";
import { MAX_NICKNAME_LENGTH, MIN_NICKNAME_LENGTH } from "./constants";

export const nicknameSchema = z
  .string()
  .min(MIN_NICKNAME_LENGTH)
  .max(MAX_NICKNAME_LENGTH);
