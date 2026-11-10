import { useEffect, useRef, useState } from "react";

import { translations } from "../../i18n.js";
import "./Home.css";

const scenes = [
  "/images/pic1.jpg",
  "/images/pic2.jpg",
  "/images/pic3.jpg",
];

export default function Home({ language, onUnavailable }) {
  const [current, setCurrent] = useState(1);
  const gallery = useRef(null);

  const t = translations[language];

  useEffect(() => {
    const node = gallery.current;

    function center() {
      const card = node?.children[1];

      if (node && card && window.innerWidth < 768) {
        node.scrollLeft =
          card.offsetLeft -
          node.offsetLeft -
          (node.clientWidth - card.clientWidth) / 2;
      }
    }

    center();
    window.addEventListener("resize", center);

    return () => window.removeEventListener("resize", center);
  }, []);

  function moveCard(direction) {
    const node = gallery.current;
    if (!node) return;

    const next = Math.max(
      0,
      Math.min(scenes.length - 1, current + direction),
    );

    const card = node.children[next];

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    node.scrollTo({
      left:
        card.offsetLeft -
        node.offsetLeft -
        (node.clientWidth - card.clientWidth) / 2,
      behavior: reducedMotion ? "instant" : "smooth",
    });

    setCurrent(next);
  }

  function trackCard() {
    const node = gallery.current;
    if (!node) return;

    const middle = node.scrollLeft + node.clientWidth / 2;

    let closest = 0;
    let distance = Infinity;

    [...node.children].forEach((card, index) => {
      const value = Math.abs(
        card.offsetLeft -
          node.offsetLeft +
          card.clientWidth / 2 -
          middle,
      );

      if (value < distance) {
        closest = index;
        distance = value;
      }
    });

    setCurrent(closest);
  }

  return (
    <main id="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-art" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-content">
          <h1 id="hero-title">REAMO</h1>

          <p className="tagline">{t.tagline}</p>

          <div className="hero-actions">
            <a className="pill sand" href="#signup">
              {t.start}
            </a>

            <button
              className="pill green"
              type="button"
              onClick={onUnavailable}
            >
              <span>{t.about}</span>

              <svg
                className="button-arrow"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 12h15m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <svg
          className="wave"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 30 C120 0 200 65 340 35
               S550 5 700 36 S920 65 1060 30
               S1320 8 1440 32 V70H0Z"
          />
        </svg>
      </section>

      <section
        className="collection"
        aria-labelledby="collection-title"
      >
        <div className="section-heading">
          <h2 id="collection-title">{t.collect}</h2>

          <button
            className="explore-link desktop-more"
            type="button"
            onClick={onUnavailable}
          >
            {t.more}
          </button>
        </div>

        <div
          className="carousel"
          role="region"
          aria-label={t.gallery}
        >
          <div
            className="card-track"
            ref={gallery}
            onScroll={trackCard}
          >
            {scenes.map((src, index) => (
              <figure className="image-card" key={src}>
                <img
                  src={src}
                  alt={t.alt[index]}
                  loading="lazy"
                  width="640"
                  height="460"
                />
              </figure>
            ))}
          </div>

          <button
            className="carousel-arrow previous"
            type="button"
            aria-label={t.previous}
            disabled={current === 0}
            onClick={() => moveCard(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>

          <button
            className="carousel-arrow next"
            type="button"
            aria-label={t.next}
            disabled={current === scenes.length - 1}
            onClick={() => moveCard(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          className="explore-link mobile-more"
          type="button"
          onClick={onUnavailable}
        >
          {t.more}
        </button>
      </section>
    </main>
  );
}