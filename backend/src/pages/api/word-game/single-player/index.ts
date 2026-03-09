import { auth, db } from "@/lib/firebase";
import { deleteWordsSchema } from "@/lib/schemas";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async (context) => {
  const json = await context.request.json();

  const authHeader = context.request.headers.get("Authorization");
  if (authHeader === null) {
    return new Response(JSON.stringify({ data: "Invalid credentials" }), {
      status: 401,
    });
  }

  const idToken = authHeader.split(" ")[1];
  const decodedToken = await auth
    .verifyIdToken(idToken)
    .then((value) => value)
    .catch(() => null);
  if (decodedToken === null) {
    return new Response(JSON.stringify({ data: "Invalid token" }), {
      status: 401,
    });
  }

  const { data, success } = deleteWordsSchema.safeParse(json);
  if (!success) {
    return new Response(JSON.stringify({ data: "Invalid request data." }), {
      status: 400,
    });
  }

  // authorization
  if (decodedToken.uid !== data.userUID) {
    return new Response(JSON.stringify({ data: "Unauthorized." }), {
      status: 403,
    });
  }

  try {
    const collectionRef = db.collection(
      `/singlePlayerWordGames/${data.userUID}/words`,
    );
    await db.recursiveDelete(collectionRef);
  } catch {
    return new Response(JSON.stringify({ data: "Internal server error" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ data: "Hi" }));
};
