import { normalizeWord } from "$features/word-game/utils";
import { fetchDictionaryWord } from "./api";
import { dictionaryWordQueryKeys } from "./queryKeys";
import { dictionaryWordSchema } from "./schemas";

export function getDictionaryWordQueryOptions(word: string) {
  return {
    queryKey: dictionaryWordQueryKeys.dictionaryWord(word),
    queryFn: async () => {
      const normalized = normalizeWord(word);
      const wordData = await fetchDictionaryWord(normalized);
      const { data: dictionaryWord } =
        await dictionaryWordSchema.safeParseAsync(wordData);

      return dictionaryWord;
    },
    gcTime: 1000 * 60 * 60 * 5,
    staleTime: 1000 * 60 * 60,
  };
}
