import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "mt_access_token";
const REFRESH_TOKEN_KEY = "mt_refresh_token";

// Cookie options: expire 7 days, SameSite strict, not accessible via JS for HttpOnly in prod
// For development we use client-readable cookies
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: "strict",
  path: "/",
};

export const tokenStorage = {
  getAccessToken: (): string | undefined => {
    return Cookies.get(ACCESS_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS);
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS);
  },

  clear: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
  },

  hasToken: (): boolean => {
    return !!Cookies.get(ACCESS_TOKEN_KEY);
  },
};
