import { useEffect, useRef, useState } from "react";

import { translations } from "../i18n.js";
import "./Navbar.css";

export default function Navbar({
  page,
  language,
  onLanguageChange,
  onUnavailable,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef(null);

  const t = translations[language];

  useEffect(() => {
  function closeMenuOnNavigation() {
    setMenuOpen(false);
  }

  window.addEventListener("hashchange", closeMenuOnNavigation);

  return () => {
    window.removeEventListener(
      "hashchange",
      closeMenuOnNavigation,
    );
  };
}, []);

  useEffect(() => {
    function checkScroll() {
      setScrolled(window.scrollY > 60);
    }

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });

    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function placeholderAction() {
    closeMenu();
    onUnavailable();
  }

  const navigation = (
    <>
      <a
        href="#home"
        aria-current={page === "home" ? "page" : undefined}
        onClick={closeMenu}
      >
        {t.home}
      </a>

     <a
        href="#shelf"
        aria-current={page === "shelf" ? "page" : undefined}
        onClick={placeholderAction}
      >
        {t.shelf}
      </a>

      <a
        href="#explore"
        aria-current={page === "explore" ? "page" : undefined}
        onClick={placeholderAction}
      >
        {t.explore}
      </a>
    </>
  );

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a
          className="logo"
          href="#home"
          aria-label="Reamo Home"
          onClick={closeMenu}
        >
          REAMO
        </a>

        <nav className="desktop-nav" aria-label={t.menu}>
          {navigation}
        </nav>

        <div className="account-actions">
          <a className="nav-signup" href="#signup">
            {t.signUp}
          </a>

          <a className="nav-login" href="#login">
            {t.logIn}
          </a>
        </div>

        <div
          className="language-switch"
          aria-label="Language / ภาษา"
        >
          <button
            type="button"
            aria-pressed={language === "en"}
            onClick={() => onLanguageChange("en")}
          >
            EN
          </button>

          <span aria-hidden="true">/</span>

          <button
            type="button"
            aria-pressed={language === "th"}
            onClick={() => onLanguageChange("th")}
          >
            TH
          </button>
        </div>

        <button
          className="menu-button"
          type="button"
          ref={menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t.close : t.menu}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="mobile-menu"
          id="mobile-menu"
          aria-label={t.menu}
        >
          {navigation}

          <a href="#signup" onClick={closeMenu}>
            {t.signUp}
          </a>

          <a href="#login" onClick={closeMenu}>
            {t.logIn}
          </a>
        </nav>
      )}
    </header>
  );
}