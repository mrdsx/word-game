import z from "zod";

export const emailSchema = z.email();

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
