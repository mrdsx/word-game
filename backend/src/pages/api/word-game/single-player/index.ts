import { FRONTEND_HOST } from "@/lib/constants";
import { auth, db } from "@/lib/firebase";
import { deleteWordsSchema } from "@/lib/schemas";
import type { APIRoute } from "astro";

const headers: HeadersInit = {
  "Access-Control-Allow-Origin": `https://${FRONTEND_HOST}`,
  "Access-Control-Allow-Methods": "DELETE",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const DELETE: APIRoute = async (context) => {
  const json = await context.request.json();

  const authHeader = context.request.headers.get("Authorization");
  if (authHeader === null) {
    return new Response(JSON.stringify({ data: "Invalid credentials" }), {
      status: 401,
      headers,
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
      headers,
    });
  }

  const { data, success } = deleteWordsSchema.safeParse(json);
  if (!success) {
    return new Response(JSON.stringify({ data: "Invalid request data." }), {
      status: 400,
      headers,
    });
  }

  // authorization
  if (decodedToken.uid !== data.userUID) {
    return new Response(JSON.stringify({ data: "Unauthorized." }), {
      status: 403,
      headers,
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
      headers,
    });
  }

  return new Response(JSON.stringify({ data: "Hi" }), { headers });
};

export const OPTIONS = () => {
  return new Response(null, {
    headers,
  });
};
