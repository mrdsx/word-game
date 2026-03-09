const AUTH_QUERY_KEY = "auth";

export const authQueryKeys = {
  login: [AUTH_QUERY_KEY, "login"],
  register: [AUTH_QUERY_KEY, "register"],
  verifyEmail: [AUTH_QUERY_KEY, "verifyEmail"],
} as const;
