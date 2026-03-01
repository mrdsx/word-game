import { API_URL } from "$lib/constants";

export async function assertWordExists(word: string): Promise<unknown> {
  const response = await fetch(`${API_URL}/${word}`);
  if (response.status === 404) {
    throw new Error("Word does not exist");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch word");
  }

  return await response.json();
}
