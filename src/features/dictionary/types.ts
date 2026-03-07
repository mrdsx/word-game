import type { z } from "zod";
import type { dictionaryWordSchema } from "./schemas";

export type DictionaryWord = z.infer<typeof dictionaryWordSchema>;
