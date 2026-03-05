import z from "zod";
import { MIN_PASSWORD_LENGTH } from "./constants";

export const emailSchema = z.email();
export const signUpPasswordSchema = z.string().min(MIN_PASSWORD_LENGTH);
export const loginPasswordSchema = z.string().min(1);

export const wordResponseSchema = z.array(
  z.object({
    word: z.string().min(1),
    meanings: z.array(
      z.object({
        partOfSpeech: z.string(),
      }),
    ),
  }),
);
