<script lang="ts">
  import { authState } from "$features/auth/stores";
  import {
    SinglePlayerAddWordForm,
    SinglePlayerWordGameActions,
    SinglePlayerWordsArea,
  } from "$features/single-player-word-game/components";
  import { singlePlayerWordsCollection } from "$features/single-player-word-game/database/collections";
  import { singlePlayerWordGameDoc } from "$features/single-player-word-game/database/documents";
  import { resetSinglePlayerWords } from "$features/single-player-word-game/services";
  import {
    setSinglePlayerWordGame,
    setSinglePlayerWordGameError,
    setSinglePlayerWords,
    singlePlayerWordGameState,
  } from "$features/single-player-word-game/stores";
  import type {
    SinglePlayerWord,
    SinglePlayerWordGame,
  } from "$features/single-player-word-game/types";
  import { declineWord } from "$lib/utils";
  import { onSnapshot, orderBy, query, setDoc } from "firebase/firestore";

  const singlePlayerWords = $derived($singlePlayerWordGameState.words);
  const userUID = $derived($authState.currentUser?.uid);

  $effect(() => {
    if (userUID === undefined) return;

    const unsubscribe = onSnapshot(
      singlePlayerWordGameDoc(userUID),
      async (doc) => {
        const wordGameData = doc.data() as SinglePlayerWordGame | undefined;
        const isGameLost =
          wordGameData !== undefined &&
          wordGameData.mistakes >= wordGameData.maxMistakes &&
          singlePlayerWords.length > 0;

        if (isGameLost) {
          await handleGameOver(singlePlayerWords.length, userUID);
        } else {
          setSinglePlayerWordGame(wordGameData ?? null);
        }
      },
      () => {
        setSinglePlayerWordGame(null);
      },
    );

    return () => {
      unsubscribe();
    };
  });

  $effect(() => {
    if (userUID === undefined) return;

    const wordsRef = singlePlayerWordsCollection(userUID);
    const recentWords = query(wordsRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      recentWords,
      async (snapshot) => {
        const words = snapshot.docs.map(
          (word) => (word.data() as SinglePlayerWord).value,
        );
        setSinglePlayerWords(words);
      },
      () => {
        setSinglePlayerWordGame(null);
      },
    );

    return () => {
      unsubscribe();
    };
  });

  async function handleGameOver(
    userScore: number,
    userUID: string,
  ): Promise<void> {
    const declinedWord = declineWord(userScore, ["word", "words"]);
    setSinglePlayerWordGameError(
      `Game over! Your result is ${userScore} ${declinedWord}.`,
    );

    await Promise.all([
      setDoc(
        singlePlayerWordGameDoc(userUID),
        { mistakes: 0 },
        { merge: true },
      ),
      resetSinglePlayerWords({ userUID }),
    ]);
  }
</script>

<h1 class="pt-10 text-2xl font-semibold">Word Game</h1>
<SinglePlayerAddWordForm />
<SinglePlayerWordsArea />
<SinglePlayerWordGameActions />
