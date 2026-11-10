# Reamo

(Personal Project) - Reamo : keep your memories from your reading

เว็บสำหรับเก็บความทรงจำจากหนังสือที่อ่าน

## โครงสร้าง

```
.
├── homepage/   เว็บฝั่งผู้ใช้ (React + Vite) — port 5173
└── server/     API (Node.js + Express + SQLite) — port 3000
```

ทั้งสองส่วนเป็นคนละโปรเจกต์ มี `package.json` ของตัวเอง และต้องรันพร้อมกันตอนพัฒนา

## เริ่มต้นครั้งแรก

### 1. ติดตั้ง dependencies ทั้งหมด

```bash
npm run setup
```

ติดตั้งให้ทั้ง root, `server/` และ `homepage/` ในคำสั่งเดียว

### 2. ตั้งค่า environment

ทั้งสองส่วนต้องมีไฟล์ `.env` ของตัวเอง (ไม่อยู่ใน repository ต้องสร้างเอง)

**`server/.env`**

```bash
cp server/.env.example server/.env
```

| ตัวแปร | คำอธิบาย |
| --- | --- |
| `PORT` | port ที่ API รัน (3000) |
| `GOOGLE_CLIENT_ID` | Client ID จาก Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Client Secret จาก Google Cloud Console |
| `JWT_SECRET` | ข้อความสุ่มยาว ๆ ใช้เซ็น token ของระบบ |
| `CLIENT_ORIGIN` | URL ของ frontend (`http://localhost:5173`) |

**`homepage/.env`**

```bash
cp homepage/.env.example homepage/.env
```

| ตัวแปร | คำอธิบาย |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Client ID ตัวเดียวกับฝั่ง server |
| `VITE_API_URL` | URL ของ API (`http://localhost:3000`) |

ขอ Client ID ได้จากคนที่ดูแล Google Cloud Console ของโปรเจกต์ และต้องแจ้งอีเมล Google ของตัวเองเพื่อเพิ่มใน Test users ก่อน ไม่งั้นจะล็อกอินไม่ผ่าน

> ตัวแปรฝั่ง frontend ต้องขึ้นต้นด้วย `VITE_` เท่านั้นถึงจะใช้งานได้ และทุกค่าในไฟล์นั้นจะถูกรวมเข้าไปในไฟล์ที่ผู้ใช้โหลดได้ — ห้ามใส่ `GOOGLE_CLIENT_SECRET` หรือ `JWT_SECRET` เด็ดขาด

## รัน

### รันทั้งสองส่วนพร้อมกัน

```bash
npm run dev
```

เปิด http://localhost:5173/Reamo/ ได้เลย

log ของทั้งสองฝั่งจะแสดงในหน้าต่างเดียว โดยมี `[api]` และ `[web]` นำหน้าแต่ละบรรทัด กด `Ctrl+C` หนึ่งครั้งเพื่อหยุดทั้งคู่

### รันแยกทีละส่วน

ใช้เมื่อต้องการดู log ของฝั่งใดฝั่งหนึ่งชัด ๆ หรือรีสตาร์ทแค่ฝั่งเดียว — เปิด terminal คนละหน้าต่าง

```bash
npm run dev:api     # หรือ cd server && npm run dev
```

```bash
npm run dev:web     # หรือ cd homepage && npm run dev
```

### ตรวจว่าทำงานปกติ

| ที่อยู่ | ควรเห็น |
| --- | --- |
| http://localhost:3000/health | `{"ok":true,...}` |
| http://localhost:3000/test.html | หน้าทดสอบล็อกอินของฝั่ง API |
| http://localhost:5173/Reamo/ | หน้าแรกของเว็บ |

## การล็อกอิน

ใช้ Google Sign-In ผู้ใช้ใหม่จะถูกสร้างอัตโนมัติเมื่อล็อกอินครั้งแรก

รายละเอียด endpoint ทั้งหมดอยู่ใน [`server/README.md`](server/README.md)

## ปัญหาที่พบบ่อย

| อาการ | สาเหตุ |
| --- | --- |
| `Google sign-in failed: Failed to fetch` | API ไม่ได้รัน — เปิด http://localhost:3000/health เพื่อตรวจ |
| ปุ่ม Google ไม่ขึ้น | ยังไม่ได้ตั้ง `VITE_GOOGLE_CLIENT_ID` ใน `homepage/.env` หรือยังไม่ได้ restart Vite หลังแก้ไฟล์ |
| `blocked by CORS policy` | `CLIENT_ORIGIN` ใน `server/.env` ไม่ตรงกับ URL ที่เปิดเว็บอยู่ |
| ล็อกอินแล้วขึ้น error 403 | อีเมลที่ใช้ยังไม่อยู่ใน Test users ของ Google Cloud Console |
| `git status` ขึ้นว่าไฟล์เปลี่ยนทั้งโปรเจกต์ทั้งที่ไม่ได้แก้ | ปัญหา line ending ระหว่าง Windows กับ Mac — รัน `git config core.autocrlf true` (Windows) |

> แก้ `.env` แล้วต้องรีสตาร์ททั้งสองฝั่ง เพราะทั้ง Vite และ Express อ่านค่าตอนเริ่มทำงานเท่านั้น
