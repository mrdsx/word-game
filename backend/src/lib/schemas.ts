import { z } from "zod";

export const deleteWordsSchema = z.object({
  userUID: z.string(),
});
