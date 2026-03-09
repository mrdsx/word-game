const DICTIONARY_WORD_QUERY_KEY = "dictionaryWord";

export const dictionaryWordQueryKeys = {
  dictionaryWord: (word: string) => [DICTIONARY_WORD_QUERY_KEY, word],
} as const;
