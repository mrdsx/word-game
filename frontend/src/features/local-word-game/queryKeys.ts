import { WORD_GAME_QUERY_KEY } from "../word-game/constants";

export const localWordGameQueryKeys = {
  addWord: [WORD_GAME_QUERY_KEY, "local", "addWord"],
} as const;
