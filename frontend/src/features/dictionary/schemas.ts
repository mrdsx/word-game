import { z } from "zod";

export const dictionaryWordSchema = z.array(
  z.object({
    word: z.string().min(1),
    meanings: z.array(
      z.object({
        partOfSpeech: z.string(),
        definitions: z.array(z.object({ definition: z.string() })),
      }),
    ),
  }),
);
