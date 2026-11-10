import { useEffect, useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";

import { translations } from "./i18n.js";
import { supabase, fetchProfile } from "./supabase.js";
import "./Styles/Global.css";

function getPage() {
  const page = window.location.hash.slice(1);

  return ["login", "signup"].includes(page) ? page : "home";
}

export default function App() {
  const [page, setPage] = useState(getPage);
  const [language, setLanguage] = useState("en");
  const [notice, setNotice] = useState("");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const t = translations[language];

  // Follow Supabase's sign-in state: page load, log in, Google redirect, log out.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);

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

      // Signed in while on the login or signup page: go home.
      if (["login", "signup"].includes(getPage())) {
        window.location.hash = "#home";
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
    onLogOut: () => supabase.auth.signOut(),
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

      {page === "login" && <Login language={language} />}

      {page === "signup" && <SignUp language={language} />}

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
