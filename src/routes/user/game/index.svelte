<script lang="ts">
  import { authState } from "$features/auth/stores/authState";
  import { fetchDictionaryWord } from "$features/dictionary/api";
  import { validateDictionaryWord } from "$features/dictionary/utils";
  import { wordGameQueryKeys } from "$features/single-player-word-game/queryKeys";
  import type { SinglePlayerWordGame } from "$features/single-player-word-game/types";
  import { WordsList } from "$features/word-game/components";
  import {
    MAX_WORD_LENGTH,
    MIN_WORD_LENGTH,
  } from "$features/word-game/constants";
  import { addWordUseCase } from "$features/word-game/useCases";
  import { normalizeWord, validateWord } from "$features/word-game/utils";
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "$lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { Spinner } from "$lib/components/ui/spinner";
  import { db } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { declineWord } from "$lib/utils";
  import { createMutation } from "@tanstack/svelte-query";
  import type { Unsubscribe } from "firebase/auth";
  import { doc, onSnapshot, setDoc } from "firebase/firestore";
  import { onDestroy } from "svelte";

  let unsubscribe: Unsubscribe | null = $state(null);
  let wordGame: SinglePlayerWordGame | null | undefined = $state(undefined);
  let newWord: string = $state("");
  let submitError: string | null = $state(null);

  const userUID = $derived($authState.currentUser?.uid);
  const words = $derived((wordGame ?? { words: [] }).words as string[]);
  const reversedWords = $derived([...words].reverse());

  const updateWordGame = createMutation(() => ({
    mutationKey: wordGameQueryKeys.updateWordGame,
    mutationFn: async ({
      newWord,
      userUID,
      wordGame,
    }: {
      newWord: string;
      userUID: string;
      wordGame: SinglePlayerWordGame;
    }) => {
      await addWordUseCase({
        newWord,
        words: wordGame.words,
        normalizeWord,
        validateWord,
        fetchDictionaryWord,
        validateDictionaryWord,
        addWord: async (newWord, prevWords) => {
          const newWordGame: Partial<SinglePlayerWordGame> = {
            mistakes: 0,
            words: [...prevWords, newWord],
          };
          await setDoc(doc(db, "singlePlayerWordGames", userUID), newWordGame, {
            merge: true,
          });
        },
      });
    },
  }));

  const incrementMistakes = createMutation(() => ({
    mutationKey: wordGameQueryKeys.wordGameMistakes,
    mutationFn: async ({
      userUID,
      wordGame,
    }: {
      userUID: string;
      wordGame: SinglePlayerWordGame;
    }) => {
      await setDoc(
        doc(db, "singlePlayerWordGames", userUID),
        { mistakes: wordGame.mistakes + 1 },
        { merge: true },
      );
    },
  }));

  $effect(() => {
    if (userUID === undefined) return;

    unsubscribe = onSnapshot(
      doc(db, "singlePlayerWordGames", userUID),
      async (doc) => {
        const wordGameData = doc.data() as SinglePlayerWordGame | undefined;
        if (
          wordGameData !== undefined &&
          wordGameData.mistakes >= wordGameData.maxMistakes
        ) {
          await handleGameOver(wordGameData.words.length, userUID);
        } else {
          wordGame = wordGameData ?? null;
        }
      },
      () => {
        wordGame = null;
      },
    );

    return () => {
      unsubscribe?.();
    };
  });

  onDestroy(() => {
    unsubscribe?.();
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitError = null;
    if (userUID === undefined || wordGame === undefined || wordGame === null)
      return;

    const wordGameSnapshot = $state.snapshot(wordGame);
    try {
      await updateWordGame.mutateAsync({
        newWord,
        userUID,
        wordGame: wordGameSnapshot,
      });
      newWord = "";
    } catch (error) {
      incrementMistakes.mutate({
        userUID,
        wordGame: wordGameSnapshot,
      });
      if (error instanceof Error) {
        submitError = error.message;
        return;
      }
      throw error;
    }
  }

  async function handleGameOver(
    userScore: number,
    userUID: string,
  ): Promise<void> {
    submitError = `Game over. Your result is ${userScore} ${declineWord(userScore, ["word", "words"])}.`;
    await setDoc(
      doc(db, "singlePlayerWordGames", userUID),
      { mistakes: 0, words: [] },
      { merge: true },
    );
  }

  async function handleWordsReset(userUID: string | undefined): Promise<void> {
    if (userUID === undefined) return;

    await setDoc(
      doc(db, "singlePlayerWordGames", userUID),
      { mistakes: 0, words: [] },
      { merge: true },
    );
  }
</script>

<h1 class="pt-10 text-2xl font-semibold">Word Game</h1>
<form class="flex w-full gap-2" onsubmit={handleSubmit}>
  <div class="w-full space-y-0.5">
    <Input
      placeholder="Enter the word"
      minlength={MIN_WORD_LENGTH}
      maxlength={MAX_WORD_LENGTH}
      disabled={wordGame === undefined}
      aria-invalid={submitError !== null}
      bind:value={newWord}
    />
    {#if submitError !== null}
      <p class="text-destructive text-sm">{submitError}</p>
    {/if}
  </div>

  <Button
    class="w-25"
    type="submit"
    disabled={wordGame === undefined || updateWordGame.isPending}
  >
    <LoadingSwap isLoading={updateWordGame.isPending} fallback="Adding">
      Add
    </LoadingSwap>
  </Button>
</form>
<div class="flex w-full flex-col items-center gap-2">
  {#if wordGame === undefined}
    <Spinner class="size-5" />
  {:else if wordGame === null}
    <p class="text-destructive">Failed to load words.</p>
  {:else if wordGame.words.length > 0}
    <div class="flex w-full justify-between text-sm font-semibold">
      <p>
        Words: {wordGame.words.length}
      </p>
      <p class="text-destructive">
        Mistakes: {wordGame?.mistakes}/{wordGame?.maxMistakes}
      </p>
    </div>
    <WordsList words={reversedWords} />
  {/if}
  <div class="space-x-1">
    {#if wordGame !== undefined && wordGame !== null && wordGame.words.length > 0}
      <AlertDialog>
        <AlertDialogTrigger class={buttonVariants({ variant: "outline" })}>
          Reset
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              All entered words will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onclick={() => handleWordsReset(userUID)}
              >Yes</AlertDialogAction
            >
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {/if}

    <Button onclick={() => navigate("/")}>Finish</Button>
  </div>
</div>
