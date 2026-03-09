import { WORD_GAME_QUERY_KEY } from "$features/word-game/constants";

const WORD_GAME_QUERY_KEYS = [WORD_GAME_QUERY_KEY, "singlePlayer"] as const;

export const singlePlayerWordGameQueryKeys = {
  singlePlayer: WORD_GAME_QUERY_KEYS,
  wordGameMistakes: [...WORD_GAME_QUERY_KEYS, "mistakes"],
  startWordGame: [...WORD_GAME_QUERY_KEYS, "start"],
  updateWordGame: [...WORD_GAME_QUERY_KEYS, "update"],
  resetWords: [...WORD_GAME_QUERY_KEYS, "resetWords"],
  preferences: [...WORD_GAME_QUERY_KEYS, "preferences"],
} as const;
