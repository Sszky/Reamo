// Sample content for the home page until real shelves come from the API.
// Spine width and height are in pixels so the shelf looks hand-arranged.
export const books = [
  {
    id: "prince",
    title: { en: "The Little Prince", th: "เจ้าชายน้อย" },
    author: { en: "Antoine de Saint-Exupéry", th: "อองตวน เดอ แซงเต็กซูเปรี" },
    color: "#fbe0c8",
    ink: "#4a3222",
    width: 58,
    height: 248,
    memory: {
      en: "I read it again at 27. This time I cried at the fox.",
      th: "กลับมาอ่านอีกทีตอนอายุ 27 รอบนี้ร้องไห้ตรงสุนัขจิ้งจอก",
    },
    moment: {
      en: "On the last train home",
      th: "บนรถไฟเที่ยวสุดท้ายกลับบ้าน",
    },
  },
  {
    id: "painting",
    title: { en: "Behind the Painting", th: "ข้างหลังภาพ" },
    author: { en: "Sriburapha", th: "ศรีบูรพา" },
    color: "#f2b8c6",
    ink: "#4a3222",
    width: 52,
    height: 282,
    memory: {
      en: "Mum lent me her copy. Her pencil notes are still in the margins, so I read it with her.",
      th: "แม่ให้ยืมเล่มของแม่ รอยดินสอยังอยู่ริมหน้ากระดาษ เหมือนได้อ่านไปพร้อมแม่",
    },
    moment: {
      en: "At home, the summer after graduation",
      th: "ที่บ้าน หน้าร้อนหลังเรียนจบ",
    },
  },
  {
    id: "kati",
    title: { en: "The Happiness of Kati", th: "ความสุขของกะทิ" },
    author: { en: "Ngarmpun Vejjajiva", th: "งามพรรณ เวชชาชีวะ" },
    color: "#f3d98b",
    ink: "#4a3222",
    width: 64,
    height: 226,
    memory: {
      en: "So short, and I still had to stop twice. I called my grandmother the same evening.",
      th: "เล่มบางนิดเดียว แต่ต้องหยุดพักถึงสองรอบ เย็นนั้นโทรหายายเลย",
    },
    moment: {
      en: "One rainy Sunday",
      th: "วันอาทิตย์ที่ฝนตกทั้งวัน",
    },
  },
  {
    id: "potter",
    title: {
      en: "Harry Potter and the Philosopher's Stone",
      th: "แฮร์รี่ พอตเตอร์กับศิลาอาถรรพ์",
    },
    author: { en: "J.K. Rowling", th: "เจ.เค. โรว์ลิ่ง" },
    color: "#d7c3e6",
    ink: "#4a3222",
    width: 76,
    height: 290,
    memory: {
      en: "I read under the blanket with a torch until my sister told on me.",
      th: "แอบอ่านใต้ผ้าห่มกับไฟฉาย จนน้องไปฟ้องแม่",
    },
    moment: {
      en: "Primary school, grade 5",
      th: "ตอนเรียน ป.5",
    },
  },
  {
    id: "alchemist",
    title: { en: "The Alchemist", th: "ขุมทรัพย์สุดปลายฝัน" },
    author: { en: "Paulo Coelho", th: "เปาโล คอเอลโย" },
    color: "#e8a87c",
    ink: "#4a3222",
    width: 54,
    height: 256,
    memory: {
      en: "A friend gave me this the week I quit my job. Her note is still on the first page.",
      th: "เพื่อนให้มาในสัปดาห์ที่ลาออกจากงาน ข้อความของเพื่อนยังอยู่ที่หน้าแรก",
    },
    moment: {
      en: "In a café near my old office",
      th: "ในร้านกาแฟแถวออฟฟิศเก่า",
    },
  },
  {
    id: "norwegian",
    title: { en: "Norwegian Wood", th: "ด้วยรัก ความตาย และหัวใจสลาย" },
    author: { en: "Haruki Murakami", th: "ฮารูกิ มูราคามิ" },
    color: "#a8c6b4",
    ink: "#4a3222",
    width: 68,
    height: 270,
    memory: {
      en: "I was nineteen and sure it was written about me. I'm not sure now, and I love it anyway.",
      th: "ตอนนั้นอายุสิบเก้า มั่นใจว่าเขาเขียนถึงเรา ตอนนี้ไม่แน่ใจแล้ว แต่ก็ยังรักอยู่ดี",
    },
    moment: {
      en: "My first year away from home",
      th: "ปีแรกที่ย้ายออกจากบ้าน",
    },
  },
  {
    id: "charlotte",
    title: { en: "Charlotte's Web", th: "แมงมุมเพื่อนรัก" },
    author: { en: "E. B. White", th: "อี. บี. ไวต์" },
    color: "#c9d9b0",
    ink: "#4a3222",
    width: 60,
    height: 238,
    memory: {
      en: "I read this aloud to my son, one chapter a night. Neither of us wanted the last one.",
      th: "อ่านให้ลูกฟังคืนละบท ไม่มีใครอยากให้ถึงบทสุดท้ายเลย",
    },
    moment: {
      en: "At bedtime, for two weeks",
      th: "ก่อนนอน ตลอดสองสัปดาห์",
    },
  },
];

// Unnamed books that fill the shelf out to the edges of wide screens.
export const shelfFiller = [
  { color: "#f0c9a8", width: 44, height: 236 },
  { color: "#b9cde3", width: 58, height: 268 },
  { color: "#e9dcc0", width: 48, height: 218 },
  { color: "#f2b8c6", width: 66, height: 284 },
  { color: "#d9c08d", width: 42, height: 250 },
  { color: "#c7d6c2", width: 56, height: 228 },
];

export const feelings = [
  {
    id: "cry",
    label: { en: "I need a good cry", th: "อยากร้องไห้ให้สุด" },
    picks: [
      {
        book: "kati",
        reason: {
          en: "Gentle and very sad. Keep tissues close.",
          th: "อ่อนโยนและเศร้ามาก เตรียมทิชชูไว้ใกล้ ๆ",
        },
      },
      {
        book: "charlotte",
        reason: {
          en: "You think it's for children, until the last chapter.",
          th: "นึกว่าเป็นหนังสือเด็ก จนกว่าจะถึงบทสุดท้าย",
        },
      },
    ],
  },
  {
    id: "home",
    label: { en: "I miss home", th: "คิดถึงบ้าน" },
    picks: [
      {
        book: "painting",
        reason: {
          en: "Love and longing from far away. It stays with you.",
          th: "ความรักและความคิดถึงจากแดนไกล อ่านจบแล้วยังติดอยู่ในใจ",
        },
      },
      {
        book: "prince",
        reason: {
          en: "About the small place that is yours, and why it matters.",
          th: "ว่าด้วยที่เล็ก ๆ ที่เป็นของเรา และเหตุผลที่มันสำคัญ",
        },
      },
    ],
  },
  {
    id: "start",
    label: { en: "I'm starting over", th: "กำลังเริ่มต้นใหม่" },
    picks: [
      {
        book: "alchemist",
        reason: {
          en: "A short, kind push when you're afraid to leave.",
          th: "แรงผลักสั้น ๆ ใจดี ๆ ในวันที่กลัวจะก้าวออกไป",
        },
      },
      {
        book: "potter",
        reason: {
          en: "Because everyone deserves a letter that changes things.",
          th: "เพราะทุกคนควรได้รับจดหมายที่เปลี่ยนชีวิตสักฉบับ",
        },
      },
    ],
  },
];
