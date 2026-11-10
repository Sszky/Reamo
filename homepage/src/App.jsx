import { useEffect, useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import MyShelf from "./pages/shelf/MyShelf.jsx";
import Account from "./pages/account/Account.jsx";

import { translations } from "./i18n.js";
import { supabase, fetchProfile } from "./supabase.js";
import "./Styles/Global.css";

// Pages that only make sense for a signed-in reader.
const privatePages = ["shelf", "account"];

// Remembered across the Google redirect, so the reader lands where they were heading.
const returnKey = "reamo:returnTo";

function getPage() {
  const page = window.location.hash.slice(1);

  return ["login", "signup", ...privatePages].includes(page) ? page : "home";
}

function goTo(page) {
  // replace() keeps the guarded page out of history, so Back doesn't bounce to login again.
  window.location.replace(`${window.location.pathname}${window.location.search}#${page}`);
}

export default function App() {
  const [page, setPage] = useState(getPage);
  const [language, setLanguage] = useState("en");
  const [notice, setNotice] = useState("");
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState(null);

  const t = translations[language];

  // The page a signed-out reader tried to open; the login form explains why they're here.
  const returnTo = sessionStorage.getItem(returnKey);

  // Follow Supabase's sign-in state: page load, log in, Google redirect, log out.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setAuthReady(true);

      if (!next) {
        setProfile(null);
        return;
      }

      // Back from Google or the confirmation email: drop ?code=... from the address bar.
      const url = new URL(window.location.href);
      if (url.searchParams.has("code")) {
        url.searchParams.delete("code");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      }

      // Signed in while on the login or signup page: go where they were heading, or home.
      if (["login", "signup"].includes(getPage())) {
        const target = sessionStorage.getItem(returnKey) || "home";
        sessionStorage.removeItem(returnKey);
        goTo(target);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // Load the profile from our API once per sign-in (the first call creates it).
  const accessToken = session?.access_token;
  const userId = session?.user.id;

  useEffect(() => {
    if (!accessToken) return;

    fetchProfile(accessToken)
      .then(setProfile)
      .catch((error) => console.error(error.message));
    // Token refreshes keep the same user, so only a new user reloads the profile.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const metadata = session?.user.user_metadata || {};
  const account = session && {
    name:
      profile?.displayName ||
      metadata.display_name ||
      metadata.full_name ||
      session.user.email,
    avatarUrl: profile?.avatarUrl || metadata.avatar_url || null,
    onLogOut: async () => {
      await supabase.auth.signOut();
      goTo("home");
    },
  };

  // Signed out on My Shelf or Account: send them to log in, then back here afterwards.
  const blocked = privatePages.includes(page) && !session;

  useEffect(() => {
    if (!authReady || !blocked) return;

    sessionStorage.setItem(returnKey, page);
    goTo("login");
  }, [authReady, blocked, page]);

  // What the Account page shows about the signed-in reader.
  const user = session && {
    name: account.name,
    username: profile?.username,
    email: session.user.email,
    joined: session.user.created_at,
    avatarUrl: account.avatarUrl,
  };

  useEffect(() => {
    function handleRoute() {
      setPage(getPage());
      setNotice("");
      window.scrollTo(0, 0);
    }

    window.addEventListener("hashchange", handleRoute);

    return () => {
      window.removeEventListener("hashchange", handleRoute);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;

    const titles = {
      home: "Reamo — Read + Memory",
      login: "Log in — Reamo",
      signup: "Sign up — Reamo",
      shelf: "My Shelf — Reamo",
      account: "Account — Reamo",
    };

    document.title = titles[page];
  }, [language, page]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 4500);

    return () => clearTimeout(timer);
  }, [notice]);

  function showPlaceholder() {
    setNotice(t.unavailable);
  }

  function changeLanguage(value) {
    setLanguage(value);
    setNotice("");
  }

  return (
    <>
      <Navbar
        page={page}
        account={account}
        language={language}
        onLanguageChange={changeLanguage}
        onUnavailable={showPlaceholder}
      />

      {page === "home" && (
        <Home
          language={language}
          onUnavailable={showPlaceholder}
        />
      )}

      {page === "login" && <Login language={language} returnTo={returnTo} />}

      {page === "signup" && <SignUp language={language} returnTo={returnTo} />}

      {/* Private pages wait for the sign-in check instead of flashing a sign-in prompt. */}
      {blocked && <main />}

      {page === "shelf" && session && <MyShelf language={language} />}

      {page === "account" && session && (
        <Account
          language={language}
          user={user}
          onLogOut={account.onLogOut}
          onUnavailable={showPlaceholder}
        />
      )}

      <Footer compact={page !== "home"} />

      <div
        className={`notice ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </>
  );
}