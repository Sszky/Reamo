import { createClient } from "@supabase/supabase-js";

// Only Supabase Auth is used from the browser. All app data goes through our Express API.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      // PKCE returns to the site with ?code=... instead of tokens in the #hash,
      // which keeps our #home / #login routing intact.
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
    },
  },
);

// Where Supabase sends people back after Google sign-in or the confirmation email.
export const siteUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Loads (and on first sign-in creates) the user's profile from our API.
export async function fetchProfile(accessToken) {
  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Profile request failed (${res.status})`);

  return (await res.json()).user;
}
