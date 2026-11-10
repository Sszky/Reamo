import { useState } from "react";

import { books, feelings, shelfFiller } from "../../books.js";
import { translations } from "../../i18n.js";
import "./Home.css";

const imageUrl = (name) => `${import.meta.env.BASE_URL}images/${name}`;

const heroImage = imageUrl("pic1.jpg");
const galleryImages = ["pic1.jpg", "pic3.jpg", "pic2.jpg"].map(imageUrl);

// Enough unnamed books to fill the shelf on either side of the named ones.
const leftFiller = Array(2).fill(shelfFiller).flat();
const rightFiller = [...leftFiller].reverse();

// A loose, hand-drawn arrow so links don't end in a typed "→".
function DoodleArrow() {
  return (
    <svg
      className="doodle-arrow"
      viewBox="0 0 48 24"
      aria-hidden="true"
    >
      <path d="M3 15c8-6 17-9 27-6 4 1 8 3 13 2" />
      <path d="M36 4c3 2 6 4 8 7-3 2-6 4-9 7" />
    </svg>
  );
}

function FillerBooks({ items }) {
  return items.map((book, index) => (
    <span
      className="spine spine-filler"
      key={index}
      style={{
        "--spine-color": book.color,
        "--spine-width": `${book.width}px`,
        "--spine-h": book.height,
      }}
    />
  ));
}

function ShelfPanel({ language, t }) {
  const [selectedId, setSelectedId] = useState("painting");

  return (
    <>
      <div className="bookcase">
        <div className="shelf" role="group" aria-label={t.shelfLabel}>
          <span className="shelf-end" aria-hidden="true">
            <FillerBooks items={leftFiller} />
          </span>

          {books.map((book) => (
            <button
              className="spine"
              type="button"
              key={book.id}
              aria-pressed={book.id === selectedId}
              style={{
                "--spine-color": book.color,
                "--spine-ink": book.ink,
                "--spine-width": `${book.width}px`,
                "--spine-h": book.height,
              }}
              onClick={() => setSelectedId(book.id)}
            >
              <span className="spine-title">{book.title[language]}</span>
            </button>
          ))}

          <span className="shelf-plant" aria-hidden="true">
            <svg viewBox="0 0 74 120">
              <path d="M37 70C30 52 16 46 6 50c6 12 18 18 31 20Z" fill="#c9d9b0" />
              <path d="M37 70c6-20 20-27 31-24-5 13-17 21-31 24Z" fill="#a8c6b4" />
              <path d="M37 70C33 46 38 26 46 16c7 16 3 38-9 54Z" fill="#c9d9b0" />
              <path d="M37 70V42" fill="none" />
              <path d="M14 72h46l-6 46H20Z" fill="#e8a87c" />
              <path d="M10 66h54v10H10Z" fill="#f0c9a8" />
            </svg>
          </span>

          <span className="shelf-end" aria-hidden="true">
            <FillerBooks items={rightFiller} />
          </span>
        </div>

        <div className="plank" aria-hidden="true" />
      </div>

      <div className="memory-row">
        <p className="shelf-hint">{t.shelfHint}</p>

        {/* Every note sits in the same spot and only the chosen one shows,
            so the area is always as tall as the longest note and the shelf never moves. */}
        <div className="layer-stack" aria-live="polite">
          {books.map((book) => (
            <article
              className={`memory-slip ${book.id === selectedId ? "" : "layer-hidden"}`}
              key={book.id}
              aria-hidden={book.id === selectedId ? undefined : true}
            >
              <h3>{book.title[language]}</h3>
              <p className="slip-author">{book.author[language]}</p>
              <p className="reader-voice">{book.memory[language]}</p>
              <p className="slip-moment">
                {book.moment[language]}
                <span>{t.sampleMemory}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function LibraryPanel({ language, t, onUnavailable }) {
  const [feelingId, setFeelingId] = useState("home");

  return (
    <div className="library-panel">
      <div>
        <p className="library-intro">{t.libraryIntro}</p>

        <div className="feelings" role="group" aria-label={t.feelingLabel}>
          {feelings.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={item.id === feelingId}
              onClick={() => setFeelingId(item.id)}
            >
              {item.label[language]}
            </button>
          ))}
        </div>
      </div>

      <div>
        {/* Same idea as the memory notes: all card sets share one spot. */}
        <div className="layer-stack" aria-live="polite">
          {feelings.map((item) => (
            <div
              className={`catalog-cards ${item.id === feelingId ? "" : "layer-hidden"}`}
              key={item.id}
              aria-hidden={item.id === feelingId ? undefined : true}
            >
              {item.picks.map((pick) => {
                const book = books.find((entry) => entry.id === pick.book);

                return (
                  <article className="library-card" key={pick.book}>
                    <h3>{book.title[language]}</h3>
                    <p className="card-author">{book.author[language]}</p>
                    <p className="reader-voice">{pick.reason[language]}</p>
                  </article>
                );
              })}
            </div>
          ))}
        </div>

        <div className="catalog-footer">
          <span>{t.samplePicks}</span>

          <button
            className="text-link"
            type="button"
            onClick={onUnavailable}
          >
            {t.browse}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home({ language, onUnavailable }) {
  const [panel, setPanel] = useState("shelf");

  const t = translations[language];

  return (
    <main id="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker">Read + Memory</p>
          <h1 id="hero-title">{t.heroTitle}</h1>
          <p className="tagline">{t.tagline}</p>

          <a className="button-primary" href="#signup">
            {t.start}
          </a>

          <button
            className="others-link"
            type="button"
            onClick={onUnavailable}
          >
            {t.others}
            <DoodleArrow />
          </button>
        </div>

        <div className="hero-art">
          <figure className="hero-circle">
            <img
              src={heroImage}
              alt={t.alt[0]}
              width="736"
              height="920"
            />
          </figure>

          <span className="tape hero-tape" aria-hidden="true" />

          <p className="sticky-note">{t.heroNote}</p>
        </div>
      </section>

      <div className="gingham-band" aria-hidden="true" />

      <section className="more" aria-labelledby="more-title">
        <div className="more-inner">
          <h2 id="more-title">{t.moreTitle}</h2>

          <div className="panel-switch" role="group" aria-label={t.moreTitle}>
            <button
              type="button"
              aria-pressed={panel === "shelf"}
              onClick={() => setPanel("shelf")}
            >
              {t.yourShelf}
            </button>

            <button
              type="button"
              aria-pressed={panel === "library"}
              onClick={() => setPanel("library")}
            >
              {t.sharedLibrary}
            </button>
          </div>

          {panel === "shelf" ? (
            <ShelfPanel language={language} t={t} />
          ) : (
            <LibraryPanel
              language={language}
              t={t}
              onUnavailable={onUnavailable}
            />
          )}
        </div>
      </section>

      <section className="collection" aria-labelledby="collection-title">
        <div className="section-heading">
          <h2 id="collection-title">{t.collect}</h2>

          <button
            className="explore-link"
            type="button"
            onClick={onUnavailable}
          >
            {t.more}
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="gallery">
          {galleryImages.map((src, index) => (
            <figure className="photo" key={src}>
              <span className="tape" aria-hidden="true" />

              <div className="photo-frame">
                <img
                  src={src}
                  alt={t.alt[index]}
                  loading="lazy"
                  width="640"
                  height="400"
                />
              </div>

              <figcaption>{t.captions[index]}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
