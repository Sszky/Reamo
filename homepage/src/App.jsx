import { useEffect, useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";

import { translations } from "./i18n.js";
import "./styles/global.css";

function getPage() {
  const page = window.location.hash.slice(1);

  return ["login", "signup"].includes(page) ? page : "home";
}

export default function App() {
  const [page, setPage] = useState(getPage);
  const [language, setLanguage] = useState("en");
  const [notice, setNotice] = useState("");

  const t = translations[language];

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

      <Footer />

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