import { useState } from "react";

import Bookshelf from "../../components/Bookshelf.jsx";
import {
  coverColors,
  sampleShelves,
  sampleUserBooks,
} from "../../sampleLibrary.js";
import "./MyShelf.css";

const translations = {
  en: {
    title: "My shelves",
    sample:
      "These are sample shelves. Changes stay on this page until saving is connected.",
    books: (n) => (n === 1 ? "1 book" : `${n} books`),
    private: "Private",
    public: "Public",
    privateHelp: "Only you can see this shelf.",
    publicHelp: "Anyone can see this shelf and its books.",
    visibility: "Show this shelf to other readers",
    newShelf: "New shelf",
    shelfName: "Shelf name",
    shelfNamePlaceholder: "Books for rainy days",
    createShelf: "Create shelf",
    cancel: "Cancel",
    addBook: "Add a book",
    bookTitle: "Title",
    author: "Author",
    saveBook: "Add to shelf",
    shelfLabel: "Books on this shelf. Choose one to see its memories.",
    empty: "This shelf is empty. Add a book to start it.",
    status: "Reading status",
    statuses: {
      want_to_read: "Want to read",
      reading: "Reading",
      finished: "Finished",
    },
    memories: "Memories",
    noMemories: "No memories yet. What do you remember about this book?",
    addMemory: "Add a memory",
    memory: "What do you remember?",
    moment: "When or where",
    momentPlaceholder: "On the train home",
    shareMemory: "Show this memory in the shared library",
    saveMemory: "Save memory",
  },
  th: {
    title: "ชั้นหนังสือของฉัน",
    sample:
      "นี่คือชั้นหนังสือตัวอย่าง สิ่งที่แก้จะอยู่แค่ในหน้านี้จนกว่าจะเชื่อมระบบบันทึกข้อมูล",
    books: (n) => `${n} เล่ม`,
    private: "ส่วนตัว",
    public: "สาธารณะ",
    privateHelp: "เห็นได้เฉพาะคุณ",
    publicHelp: "นักอ่านคนอื่นเห็นชั้นนี้และหนังสือบนชั้นได้",
    visibility: "ให้นักอ่านคนอื่นเห็นชั้นนี้",
    newShelf: "สร้างชั้นใหม่",
    shelfName: "ชื่อชั้น",
    shelfNamePlaceholder: "หนังสือสำหรับวันฝนตก",
    createShelf: "สร้างชั้น",
    cancel: "ยกเลิก",
    addBook: "เพิ่มหนังสือ",
    bookTitle: "ชื่อหนังสือ",
    author: "ผู้แต่ง",
    saveBook: "วางบนชั้น",
    shelfLabel: "หนังสือบนชั้นนี้ เลือกเล่มเพื่อดูความทรงจำ",
    empty: "ชั้นนี้ยังว่างอยู่ เพิ่มหนังสือเล่มแรกได้เลย",
    status: "สถานะการอ่าน",
    statuses: {
      want_to_read: "อยากอ่าน",
      reading: "กำลังอ่าน",
      finished: "อ่านจบแล้ว",
    },
    memories: "ความทรงจำ",
    noMemories: "ยังไม่มีความทรงจำ เล่มนี้ทำให้คุณนึกถึงอะไร",
    addMemory: "เพิ่มความทรงจำ",
    memory: "จำอะไรได้บ้าง",
    moment: "ตอนไหน หรือที่ไหน",
    momentPlaceholder: "บนรถไฟขากลับบ้าน",
    shareMemory: "แสดงความทรงจำนี้ในห้องสมุดส่วนกลาง",
    saveMemory: "บันทึกความทรงจำ",
  },
};

// Text a reader types is the same in both languages.
const typed = (text) => ({ en: text, th: text });

// Spine sizes for books added by hand, picked in turn so the shelf looks uneven.
const spineSizes = [
  [56, 250],
  [64, 230],
  [52, 272],
  [70, 240],
];

function LockIcon() {
  return (
    <svg className="visibility-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="visibility-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </svg>
  );
}

export default function MyShelf({ language }) {
  const t = translations[language] || translations.en;
  const text = (value) => value?.[language] ?? value?.en ?? "";

  const [userBooks, setUserBooks] = useState(sampleUserBooks);
  const [shelves, setShelves] = useState(sampleShelves);
  const [shelfId, setShelfId] = useState(2);
  const [bookId, setBookId] = useState(sampleShelves[1].items[0]);
  const [form, setForm] = useState(null);

  const shelf = shelves.find((item) => item.id === shelfId);
  const shelfBooks = shelf.items.map((id) => userBooks.find((item) => item.id === id));
  const book = shelfBooks.find((item) => item.id === bookId) || shelfBooks[0];

  function chooseShelf(id) {
    setShelfId(id);
    setBookId(shelves.find((item) => item.id === id).items[0]);
    setForm(null);
  }

  function chooseBook(id) {
    setBookId(id);
    if (form === "memory") setForm(null);
  }

  function toggleVisibility() {
    setShelves((list) =>
      list.map((item) =>
        item.id === shelfId ? { ...item, isPublic: !item.isPublic } : item,
      ),
    );
  }

  function createShelf(event) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name")).trim();
    if (!name) return;

    const id = Math.max(...shelves.map((item) => item.id)) + 1;
    // New shelves always start private; the reader opens them up with the switch.
    setShelves((list) => [
      ...list,
      { id, name: typed(name), description: typed(""), isPublic: false, items: [] },
    ]);
    setShelfId(id);
    setBookId(null);
    setForm(null);
  }

  function addBook(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title")).trim();
    if (!title) return;

    const id = Math.max(...userBooks.map((item) => item.id)) + 1;
    const [width, height] = spineSizes[id % spineSizes.length];

    setUserBooks((list) => [
      ...list,
      {
        id,
        book: {
          id: `added-${id}`,
          title: typed(title),
          author: typed(String(data.get("author")).trim()),
          color: coverColors[id % coverColors.length],
          ink: "#4a3222",
          width,
          height,
        },
        status: String(data.get("status")),
        memories: [],
      },
    ]);
    // Every book also lands on "Everything I've read", the first shelf.
    setShelves((list) =>
      list.map((item) =>
        item.id === shelfId || item.id === 1
          ? { ...item, items: [...item.items, id] }
          : item,
      ),
    );
    setBookId(id);
    setForm(null);
  }

  function changeStatus(status) {
    setUserBooks((list) =>
      list.map((item) => (item.id === book.id ? { ...item, status } : item)),
    );
  }

  function addMemory(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = String(data.get("body")).trim();
    if (!body) return;

    setUserBooks((list) =>
      list.map((item) =>
        item.id === book.id
          ? {
              ...item,
              memories: [
                ...item.memories,
                {
                  id: Date.now(),
                  body: typed(body),
                  moment: typed(String(data.get("moment")).trim()),
                  isPublic: data.get("isPublic") === "on",
                },
              ],
            }
          : item,
      ),
    );
    setForm(null);
  }

  return (
    <main className="myshelf">
      <aside className="shelf-list" aria-labelledby="shelves-title">
        <h1 id="shelves-title">{t.title}</h1>

        <ul>
          {shelves.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-current={item.id === shelfId ? "true" : undefined}
                onClick={() => chooseShelf(item.id)}
              >
                <span className="shelf-list-name">{text(item.name)}</span>
                <span className="shelf-list-meta">
                  {item.isPublic ? <GlobeIcon /> : <LockIcon />}
                  {item.isPublic ? t.public : t.private}
                  <span aria-hidden="true">/</span>
                  {t.books(item.items.length)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {form === "shelf" ? (
          <form className="inline-form" onSubmit={createShelf}>
            <label htmlFor="new-shelf-name">{t.shelfName}</label>
            <input
              id="new-shelf-name"
              name="name"
              required
              maxLength={60}
              placeholder={t.shelfNamePlaceholder}
              autoFocus
            />
            <p className="field-hint">
              <LockIcon /> {t.privateHelp}
            </p>
            <div className="form-actions">
              <button className="button-primary" type="submit">
                {t.createShelf}
              </button>
              <button className="text-link" type="button" onClick={() => setForm(null)}>
                {t.cancel}
              </button>
            </div>
          </form>
        ) : (
          <button className="new-shelf" type="button" onClick={() => setForm("shelf")}>
            + {t.newShelf}
          </button>
        )}
      </aside>

      <section className="shelf-wall" aria-labelledby="shelf-title">
        <p className="sample-note">{t.sample}</p>

        <header className="shelf-header">
          <div>
            <h2 id="shelf-title">{text(shelf.name)}</h2>
            {text(shelf.description) && (
              <p className="shelf-description">{text(shelf.description)}</p>
            )}
          </div>

          <div className="shelf-controls">
            <button
              className="visibility-switch"
              type="button"
              role="switch"
              aria-checked={shelf.isPublic}
              aria-label={t.visibility}
              onClick={toggleVisibility}
            >
              <span className="switch-track" aria-hidden="true">
                <span className="switch-knob" />
              </span>
              <span className="switch-text">
                <strong>
                  {shelf.isPublic ? <GlobeIcon /> : <LockIcon />}
                  {shelf.isPublic ? t.public : t.private}
                </strong>
                <span>{shelf.isPublic ? t.publicHelp : t.privateHelp}</span>
              </span>
            </button>

            <button
              className="button-primary"
              type="button"
              aria-expanded={form === "book"}
              onClick={() => setForm(form === "book" ? null : "book")}
            >
              + {t.addBook}
            </button>
          </div>
        </header>

        {form === "book" && (
          <form className="inline-form add-book-form" onSubmit={addBook}>
            <div>
              <label htmlFor="book-title">{t.bookTitle}</label>
              <input id="book-title" name="title" required maxLength={200} autoFocus />
            </div>
            <div>
              <label htmlFor="book-author">{t.author}</label>
              <input id="book-author" name="author" maxLength={120} />
            </div>
            <div>
              <label htmlFor="book-status">{t.status}</label>
              <select id="book-status" name="status" defaultValue="finished">
                {Object.entries(t.statuses).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button className="button-primary" type="submit">
                {t.saveBook}
              </button>
              <button className="text-link" type="button" onClick={() => setForm(null)}>
                {t.cancel}
              </button>
            </div>
          </form>
        )}

        <Bookshelf
          books={shelfBooks.map((item) => ({ ...item.book, id: item.id }))}
          selectedId={book?.id}
          onSelect={chooseBook}
          language={language}
          label={t.shelfLabel}
          filler={false}
        />

        {book ? (
          <article className="book-card" aria-live="polite">
            <header className="book-card-header">
              <div>
                <h3>{text(book.book.title)}</h3>
                {text(book.book.author) && (
                  <p className="book-author">{text(book.book.author)}</p>
                )}
              </div>

              <label className="status-field">
                <span>{t.status}</span>
                <select value={book.status} onChange={(event) => changeStatus(event.target.value)}>
                  {Object.entries(t.statuses).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </header>

            <h4>{t.memories}</h4>

            {book.memories.length ? (
              <ul className="memory-list">
                {book.memories.map((memory) => (
                  <li key={memory.id}>
                    <p className="reader-voice">{text(memory.body)}</p>
                    <p className="memory-meta">
                      {text(memory.moment)}
                      <span>
                        {memory.isPublic ? <GlobeIcon /> : <LockIcon />}
                        {memory.isPublic ? t.public : t.private}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-text">{t.noMemories}</p>
            )}

            {form === "memory" ? (
              <form className="inline-form" onSubmit={addMemory}>
                <label htmlFor="memory-body">{t.memory}</label>
                <textarea id="memory-body" name="body" rows={3} required maxLength={1000} autoFocus />
                <label htmlFor="memory-moment">{t.moment}</label>
                <input
                  id="memory-moment"
                  name="moment"
                  maxLength={120}
                  placeholder={t.momentPlaceholder}
                />
                <label className="check-field">
                  <input type="checkbox" name="isPublic" />
                  {t.shareMemory}
                </label>
                <div className="form-actions">
                  <button className="button-primary" type="submit">
                    {t.saveMemory}
                  </button>
                  <button className="text-link" type="button" onClick={() => setForm(null)}>
                    {t.cancel}
                  </button>
                </div>
              </form>
            ) : (
              <button className="text-link" type="button" onClick={() => setForm("memory")}>
                + {t.addMemory}
              </button>
            )}
          </article>
        ) : (
          <p className="book-card empty-text">{t.empty}</p>
        )}
      </section>
    </main>
  );
}
