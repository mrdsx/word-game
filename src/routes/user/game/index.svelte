<script lang="ts">
  import { authState } from "$features/auth/stores";
  import {
    SinglePlayerAddWordForm,
    SinglePlayerWordGameActions,
    SinglePlayerWordsArea,
  } from "$features/single-player-word-game/components";
  import { resetSinglePlayerMistakes } from "$features/single-player-word-game/services";
  import {
    setSinglePlayerWordGame,
    setSinglePlayerWordGameError,
  } from "$features/single-player-word-game/stores";
  import type { SinglePlayerWordGame } from "$features/single-player-word-game/types";
  import { db } from "$lib/firebase";
  import { declineWord } from "$lib/utils";
  import type { Unsubscribe } from "firebase/auth";
  import { doc, onSnapshot, setDoc } from "firebase/firestore";
  import { onDestroy } from "svelte";

  let unsubscribe: Unsubscribe | null = $state(null);

  const userUID = $derived($authState.currentUser?.uid);

  $effect(() => {
    if (userUID === undefined) return;

    unsubscribe = onSnapshot(
      doc(db, "singlePlayerWordGames", userUID),
      async (doc) => {
        const wordGameData = doc.data() as SinglePlayerWordGame | undefined;
        const isGameLost =
          wordGameData !== undefined &&
          wordGameData.mistakes >= wordGameData.maxMistakes &&
          wordGameData.words.length > 0;

        if (isGameLost) {
          await handleGameOver(wordGameData.words.length, userUID);
        } else {
          if (wordGameData?.words.length === 0) {
            await resetSinglePlayerMistakes(userUID);
          }
          setSinglePlayerWordGame(wordGameData ?? null);
        }
      },
      () => {
        setSinglePlayerWordGame(null);
      },
    );

    return () => {
      unsubscribe?.();
    };
  });

  onDestroy(() => {
    unsubscribe?.();
  });

  async function handleGameOver(
    userScore: number,
    userUID: string,
  ): Promise<void> {
    const declinedWord = declineWord(userScore, ["word", "words"]);
    setSinglePlayerWordGameError(
      `Game over! Your result is ${userScore} ${declinedWord}.`,
    );

    await setDoc(
      doc(db, "singlePlayerWordGames", userUID),
      { mistakes: 0, words: [] },
      { merge: true },
    );
  }
</script>

<h1 class="pt-10 text-2xl font-semibold">Word Game</h1>
<SinglePlayerAddWordForm />
<SinglePlayerWordsArea />
<SinglePlayerWordGameActions />
