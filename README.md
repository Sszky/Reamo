# Reamo

(Personal Project) - Reamo : keep your memories from your reading

เว็บสำหรับเก็บหนังสือที่ชอบ ส่วนนี้คือ **API ฝั่ง backend** — รับผิดชอบการล็อกอินผ่าน Google และจัดการข้อมูลผู้ใช้

## Tech stack

| ส่วน | ใช้อะไร |
| --- | --- |
| Runtime | Node.js 20+ |
| Web framework | Express 5 |
| Database | SQLite (better-sqlite3) |
| Auth | Google Identity Services + JWT |

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
| `GOOGLE_CLIENT_ID` | Client ID จาก Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Client Secret จาก Google Cloud Console |
| `JWT_SECRET` | ข้อความสุ่มยาว ๆ ใช้เซ็น token ของระบบ |
| `CLIENT_ORIGIN` | URL ของ frontend ที่อนุญาตให้เรียก API |

### 3. ขอ OAuth credentials จาก Google

1. เข้า [Google Cloud Console](https://console.cloud.google.com) สร้างโปรเจกต์ใหม่
2. **APIs & Services → OAuth consent screen** → เลือก External → กรอกชื่อแอปและอีเมล
3. Scope ที่ใช้: `openid`, `email`, `profile`
4. เพิ่มอีเมลของทีมใน **Test users** (ตอนแอปยังอยู่สถานะ Testing จะล็อกอินได้เฉพาะอีเมลในรายการนี้)
5. **Credentials → Create Credentials → OAuth client ID** → เลือก Web application
6. ใส่ **Authorized JavaScript origins**

   ```
   http://localhost:3000
   http://localhost:5173
   ```

7. นำ Client ID และ Client Secret ที่ได้ไปใส่ใน `.env`

### 4. รัน

```bash
npm run dev
```

เปิด http://localhost:3000/health เพื่อตรวจว่าเซิร์ฟเวอร์ทำงาน

ทดสอบการล็อกอินได้ที่ http://localhost:3000/test.html (ใส่ Client ID ในไฟล์ `public/test.html` ก่อน)

## API

### `POST /auth/google`

แลก ID token จาก Google เป็น access token ของระบบ ใช้ทั้งตอนสมัครครั้งแรกและล็อกอินซ้ำ — ผู้ใช้ใหม่จะถูกสร้างอัตโนมัติ

**Request**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response 200**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://lh3.googleusercontent.com/a/..."
  }
}
```

### `GET /auth/me`

คืนข้อมูลผู้ใช้จาก access token ใช้เช็คว่า token ที่เก็บไว้ยังใช้ได้อยู่หรือไม่

**Headers**

```
Authorization: Bearer <accessToken>
```

**Response 200**

```json
{
  "user": {
    "sub": "1",
    "email": "user@example.com",
    "name": "User Name",
    "iat": 1791653009,
    "exp": 1792257809
  }
}
```

### `GET /health`

ตรวจสถานะเซิร์ฟเวอร์ ไม่ต้องยืนยันตัวตน

## Error responses

ทุก error ตอบกลับในรูปแบบ `{ "error": "message" }`

| Status | Error | สาเหตุ |
| --- | --- | --- |
| 400 | `idToken is required` | ไม่ได้ส่ง `idToken` มาใน body |
| 401 | `Invalid Google token` | ID token ไม่ถูกต้อง หมดอายุ หรือ Client ID ไม่ตรง |
| 401 | `Missing token` | ไม่ได้แนบ `Authorization` header |
| 401 | `Invalid or expired token` | access token หมดอายุหรือถูกแก้ไข |
| 403 | `Email not verified by Google` | บัญชี Google ยังไม่ได้ยืนยันอีเมล |

## โครงสร้างโปรเจกต์

```
.
├── public/
│   └── test.html      หน้าทดสอบการล็อกอิน
├── src/
│   ├── db.js          เชื่อมต่อ SQLite และจัดการตาราง users
│   ├── jwt.js         สร้างและตรวจสอบ access token
│   ├── auth.js        route การล็อกอินและ middleware ตรวจสิทธิ์
│   └── server.js      ตั้งค่า Express และรวม route
├── .env               ค่าลับ (ไม่อยู่ใน repository)
└── package.json
```

## หมายเหตุ

- Access token มีอายุ 7 วัน เมื่อหมดอายุต้องล็อกอินใหม่
- ผู้ใช้ถูกระบุด้วย Google account ID (`sub`) ไม่ใช่อีเมล จึงเปลี่ยนอีเมลใน Google ได้โดยข้อมูลไม่หาย
- ไฟล์ `.env` และ `*.db` ถูกกำหนดไว้ใน `.gitignore` แล้ว ห้าม commit ขึ้น repository

## ยังไม่ได้ทำ

- [ ] `POST /auth/logout` — ปัจจุบัน logout ทำฝั่ง frontend โดยลบ token
- [ ] Refresh token
- [ ] API จัดการหนังสือ (`GET /books`, `POST /books`, `DELETE /books/:id`)
