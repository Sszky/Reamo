# Reamo

(Personal Project) - Reamo : keep your memories from your reading

เว็บสำหรับเก็บหนังสือที่ชอบ ส่วนนี้คือ **API ฝั่ง backend** — ตรวจสิทธิ์ผู้ใช้ที่ล็อกอินผ่าน Supabase Auth และจัดการข้อมูลของแอป

## Tech stack

| ส่วน | ใช้อะไร |
| --- | --- |
| Runtime | Node.js 20+ |
| Web framework | Express 5 |
| Database | PostgreSQL บน Supabase (`pg`) |
| Auth | Supabase Auth (อีเมล/รหัสผ่าน และ Google) ตรวจ token ด้วย `jose` |

## การล็อกอินทำงานยังไง

1. ผู้ใช้สมัครหรือล็อกอินที่หน้าเว็บ ทั้งแบบอีเมล/รหัสผ่าน และ Google ผ่าน **Supabase Auth** โดยตรง
2. รหัสผ่านไม่ผ่าน server นี้เลย Supabase เก็บเป็น hash (bcrypt) ในตาราง `auth.users`
3. หน้าเว็บได้ access token จาก Supabase แล้วแนบมากับทุก request เป็น `Authorization: Bearer <token>`
4. server นี้ตรวจลายเซ็นของ token ด้วย public key ของ Supabase (`/auth/v1/.well-known/jwks.json`) ไม่ต้องเก็บ secret เอง

## เริ่มต้นใช้งาน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. ตั้งค่า environment

คัดลอก `.env.example` เป็น `.env` แล้วเติมค่าให้ครบ

```bash
cp .env.example .env
```

| ตัวแปร | คำอธิบาย |
| --- | --- |
| `PORT` | port ที่ API รัน (ค่าเริ่มต้น 3000) |
| `CLIENT_ORIGIN` | URL ของ frontend ที่อนุญาตให้เรียก API |
| `SUPABASE_URL` | URL ของโปรเจกต์ Supabase เช่น `https://xxxx.supabase.co` |
| `DATABASE_URL` | connection string ของ Supabase แบบ Session pooler |
| `DATABASE_CA_CERT` | (ไม่บังคับ) path ไปยังไฟล์ CA ของ Supabase เพื่อตรวจใบรับรอง SSL |

### 3. ตั้งค่าฐานข้อมูล Supabase

1. สร้างโปรเจกต์ที่ [supabase.com](https://supabase.com) แล้วจดรหัสผ่านฐานข้อมูลไว้
2. กด **Connect** แล้วคัดลอก connection string แบบ **Session pooler** (แบบ Direct ใช้ IPv6 ซึ่งเน็ตบ้านหลายที่ต่อไม่ได้)
3. ใส่ใน `.env` เป็น `DATABASE_URL` โดยแทน `[YOUR-PASSWORD]` ด้วยรหัสผ่านจริง
4. สร้างตาราง

   ```bash
   npm run db:init
   ```

   หรือคัดลอก `src/schema.sql` ไปรันใน SQL Editor ของ Supabase ก็ได้

### 4. ตั้งค่า Supabase Auth

ใน Supabase ไปที่ **Authentication**

- **Sign In / Providers → Email:** เปิดใช้งาน และเปิด Confirm email
- **Sign In / Providers → Google:** ใส่ Client ID และ Client Secret จาก Google Cloud Console
- **URL Configuration:** Site URL เป็น `http://localhost:5173/Reamo/` และเพิ่มที่อยู่เดียวกันใน Redirect URLs

ใน Google Cloud Console ที่ OAuth client เดียวกัน เพิ่ม `https://<project>.supabase.co/auth/v1/callback` ใน **Authorized redirect URIs**

### 5. รัน

```bash
npm run dev
```

เปิด http://localhost:3000/health เพื่อตรวจว่าเซิร์ฟเวอร์ทำงาน

## API

### `GET /auth/me`

คืนข้อมูลผู้ใช้ที่ล็อกอินอยู่ ครั้งแรกที่เรียกจะสร้าง profile ให้อัตโนมัติ โดยใช้ชื่อที่กรอกตอนสมัคร หรือชื่อจากบัญชี Google

**Headers**

```
Authorization: Bearer <Supabase access token>
```

**Response 200**

```json
{
  "user": {
    "id": "9f0c8a1e-...",
    "email": "user@example.com",
    "displayName": "User Name",
    "avatarUrl": "https://lh3.googleusercontent.com/a/..."
  }
}
```

### `GET /health`

ตรวจสถานะเซิร์ฟเวอร์ ไม่ต้องยืนยันตัวตน

## Error responses

ทุก error ตอบกลับในรูปแบบ `{ "error": "message" }`

| Status | Error | สาเหตุ |
| --- | --- | --- |
| 401 | `Missing token` | ไม่ได้แนบ `Authorization` header |
| 401 | `Invalid or expired token` | token หมดอายุ ถูกแก้ไข หรือไม่ได้มาจาก Supabase โปรเจกต์นี้ |
| 500 | `Could not load profile` | อ่านหรือสร้าง profile ในฐานข้อมูลไม่สำเร็จ |

## โครงสร้างโปรเจกต์

```
.
├── src/
│   ├── auth.js        middleware ตรวจ token ของ Supabase และ route /auth/me
│   ├── db.js          เชื่อมต่อ PostgreSQL และ query ตาราง profiles
│   ├── schema.sql     คำสั่งสร้างตาราง
│   ├── init-db.js     รัน schema.sql (npm run db:init)
│   └── server.js      ตั้งค่า Express และรวม route
├── .env               ค่าลับ (ไม่อยู่ใน repository)
└── package.json
```

## หมายเหตุ

- บัญชีผู้ใช้ อีเมล และรหัสผ่านอยู่ใน `auth.users` ของ Supabase ส่วนตาราง `public.profiles` เก็บเฉพาะข้อมูลที่แอปใช้ และใช้ id เดียวกัน ลบบัญชีใน Supabase แล้ว profile จะถูกลบตาม
- ไฟล์ `.env` ถูกกำหนดไว้ใน `.gitignore` แล้ว ห้าม commit ขึ้น repository เพราะมีรหัสผ่านฐานข้อมูล
- ตาราง `profiles` เปิด Row Level Security ไว้โดยไม่มี policy เพื่อปิด API อัตโนมัติของ Supabase ข้อมูลจึงเข้าถึงได้ผ่าน server นี้เท่านั้น
- ออกจากระบบทำที่หน้าเว็บผ่าน Supabase (`supabase.auth.signOut()`)

## ยังไม่ได้ทำ

- [ ] **ล็อกอินด้วย Google ยังใช้ไม่ได้ (รอ Google Cloud Console):** OAuth client อยู่ในโปรเจกต์ Google Cloud ของเพื่อน ต้องให้เพื่อนเชิญเข้า IAM เป็น Editor หรือทำ 2 อย่างแทน
  1. เพิ่ม `https://sebnhurzudtgudpcgyjt.supabase.co/auth/v1/callback` ใน Authorized redirect URIs ของ OAuth client
  2. ใส่ Client ID และ Client secret ใน Supabase → Authentication → Sign In / Providers → Google

  ระหว่างนี้สมัครและล็อกอินด้วยอีเมล/รหัสผ่านได้ตามปกติ
- [ ] หน้าตั้งรหัสผ่านใหม่ (ลืมรหัสผ่าน)
- [ ] API จัดการชั้นหนังสือและความทรงจำ
