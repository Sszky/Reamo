import { books } from "./books.js";

// Sample data for the My Shelf and Account pages until the shelf API exists.
// Shapes follow the database design: user_books hold status and memories,
// shelves only list which of the reader's books sit on them.

const byId = Object.fromEntries(books.map((book) => [book.id, book]));

export const sampleUserBooks = [
  {
    id: 1,
    book: byId.prince,
    status: "finished",
    memories: [
      {
        id: 1,
        body: byId.prince.memory,
        moment: byId.prince.moment,
        isPublic: true,
      },
      {
        id: 2,
        body: {
          en: "First read at twelve. I only liked the drawings.",
          th: "อ่านครั้งแรกตอนสิบสองขวบ ตอนนั้นชอบแค่รูปวาด",
        },
        moment: { en: "School library", th: "ห้องสมุดโรงเรียน" },
        isPublic: false,
      },
    ],
  },
  ...["painting", "kati", "potter", "norwegian", "charlotte"].map((key, index) => ({
    id: index + 2,
    book: byId[key],
    status: key === "potter" ? "reading" : "finished",
    memories: [
      {
        id: index + 3,
        body: byId[key].memory,
        moment: byId[key].moment,
        isPublic: key !== "norwegian",
      },
    ],
  })),
  { id: 7, book: byId.alchemist, status: "want_to_read", memories: [] },
];

export const sampleShelves = [
  {
    id: 1,
    name: { en: "Everything I've read", th: "ทุกเล่มที่เคยอ่าน" },
    description: {
      en: "The whole pile, in the order they found me.",
      th: "ทั้งหมดที่อ่านมา เรียงตามลำดับที่ได้เจอกัน",
    },
    isPublic: false,
    items: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: 2,
    name: { en: "Favourites forever", th: "เล่มโปรดตลอดกาล" },
    description: {
      en: "If the house were on fire, these come with me.",
      th: "ถ้าบ้านไฟไหม้ เล่มพวกนี้ต้องคว้าออกมาก่อน",
    },
    isPublic: true,
    items: [2, 1, 3],
  },
  {
    id: 3,
    name: { en: "Read with my son", th: "อ่านกับลูก" },
    description: {
      en: "One chapter a night, sometimes two.",
      th: "คืนละบท บางคืนก็สองบท",
    },
    isPublic: true,
    items: [6, 4],
  },
  {
    id: 4,
    name: { en: "For sad days", th: "เล่มสำหรับวันเศร้า" },
    description: { en: "", th: "" },
    isPublic: false,
    items: [5, 3],
  },
];

// Pastel covers for books a reader adds by hand.
export const coverColors = ["#f2b8c6", "#b9cde3", "#f3d98b", "#c9d9b0", "#d7c3e6", "#e8a87c"];
