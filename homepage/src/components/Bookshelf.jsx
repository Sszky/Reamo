import { shelfFiller } from "../books.js";
import "./Bookshelf.css";

// Enough unnamed books to fill the shelf on either side of the named ones.
const leftFiller = Array(2).fill(shelfFiller).flat();
const rightFiller = [...leftFiller].reverse();

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

function Plant() {
  return (
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
  );
}

// The hand-drawn wall shelf. Each book is a button; the chosen one lifts and drops a ribbon.
export default function Bookshelf({
  books,
  selectedId,
  onSelect,
  language,
  label,
  filler = true,
}) {
  return (
    <div className={`bookcase ${filler ? "" : "bookcase-plain"}`}>
      <div className="shelf" role="group" aria-label={label}>
        {filler && (
          <span className="shelf-end" aria-hidden="true">
            <FillerBooks items={leftFiller} />
          </span>
        )}

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
            onClick={() => onSelect(book.id)}
          >
            <span className="spine-title">{book.title[language]}</span>
          </button>
        ))}

        <Plant />

        {filler && (
          <span className="shelf-end" aria-hidden="true">
            <FillerBooks items={rightFiller} />
          </span>
        )}
      </div>

      <div className="plank" aria-hidden="true" />
    </div>
  );
}
