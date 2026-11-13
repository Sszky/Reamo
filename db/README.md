# ฐานข้อมูล Reamo (Supabase / PostgreSQL)

ไฟล์ SQL ในโฟลเดอร์นี้คือประวัติว่าฐานข้อมูลสร้างมาจากอะไร ใช้สร้างซ้ำหรือตรวจสอบได้

## ลำดับการรัน

รันใน SQL Editor ของ Supabase ตามลำดับ:

| ไฟล์ | ทำอะไร |
|---|---|
| `01_schema.sql` | สร้าง enum ตาราง index เปิด RLS (ต้องมี `profiles` อยู่ก่อน) |
| `02_revoke_exposure.sql` | ถอนสิทธิ์ `anon`/`authenticated` ออกจากตารางข้อมูล |
| `03_seed_feelings.sql` | ใส่รายการ tag ความรู้สึกตั้งต้น (รันซ้ำได้) |
| `04_default_privileges.sql` | ตารางใหม่ในอนาคตไม่ได้สิทธิ์ของ frontend โดยปริยาย |
| `check_security.sql` | ตรวจสถานะความปลอดภัย (อ่านอย่างเดียว) |

## ตาราง

- `profiles` : ผู้ใช้ (id เดียวกับ `auth.users`) สร้างและดูแลโดย backend
- `books` : หนังสือกลาง ผู้ใช้เพิ่มเอง `created_by` = ผู้สร้าง
- `user_books` : หนังสือของผู้ใช้แต่ละคน + สถานะการอ่าน (`reading_status`)
- `shelves`, `shelf_items` : ชั้นหนังสือและหนังสือบนชั้น
- `memories` : ความทรงจำที่ผูกกับหนังสือของผู้ใช้
- `feelings` : รายการ tag ความรู้สึกให้ผู้ใช้เลือก
- `recommendations` : (ผู้ใช้, หนังสือ, ความรู้สึก) + เหตุผล (`reason` บังคับ)

## Security model (สำคัญ ก่อนแก้อะไร)

**แผนการเข้าถึงข้อมูล**

```
ผู้ใช้ -> frontend -> Express (backend) -> database
         (login ผ่าน    (ตรวจ token แล้วต่อ DB ตรงด้วย DATABASE_URL)
          Supabase Auth)
```

- frontend ใช้ Supabase เฉพาะเรื่อง **login (Auth)** ไม่อ่านหรือเขียนตารางข้อมูลตรง
- backend ตรวจ token (JWT) ของ Supabase Auth แล้วเชื่อมต่อ PostgreSQL ตรงด้วย `DATABASE_URL`
  ไม่ผ่าน Data API ของ Supabase จึง **ไม่จำเป็นต้องเปิด Data API**
- ตารางข้อมูลของแอป: เปิด RLS, **ไม่มี policy**, และถอนสิทธิ์ของ `anon`/`authenticated`
  เพื่อกันกรณีที่ใครเปิด Data API ในอนาคต key ฝั่ง frontend จะยังเข้าตารางตรงไม่ได้ (ตั้งใจ)

**กฎสิทธิ์ต้องตรวจในโค้ด Express ทุกครั้ง** เพราะ role ที่ใช้ใน `DATABASE_URL` ปกติข้าม RLS ได้
ฐานข้อมูลจึงไม่ช่วยกันสิทธิ์ให้ เช่น

- เพิ่มเข้าลิสต์/ชั้นหนังสือได้เฉพาะของตัวเอง
- แก้/ลบหนังสือได้เฉพาะเมื่อ `books.created_by` ตรงกับผู้ใช้ที่ login
  (ถ้า `created_by` เป็น `null` ต้องถือว่าแก้ไม่ได้)
- ตรวจ token ของ Supabase Auth ก่อนทุกคำขอ แล้วใช้ id จาก token ไม่ใช่จาก body ที่ client ส่งมา

**ความลับ**

- `DATABASE_URL` มีรหัสผ่านฐานข้อมูล เป็นความลับสูงสุด ใช้เฉพาะฝั่ง backend เก็บใน `.env`
  ห้ามใส่ใน repo นี้ (เป็น public) ห้ามอยู่ในโค้ด frontend และห้ามส่งในแชต
- ถ้าหลุด ให้เปลี่ยนรหัสผ่านฐานข้อมูลที่ Supabase (Project Settings > Database) ทันที
  แล้วอัปเดตค่าใน `.env` ของ backend
- ชื่อตัวแปรที่ต้องตั้งดูใน `server/.env.example`

**ตารางใหม่ต้องทำเสมอ:** `alter table ... enable row level security;`
(สิทธิ์เริ่มต้นตาม `04_default_privileges.sql` ปิดไว้ให้แล้ว แต่ RLS ต้องเปิดเอง)

**ถ้าจะให้ frontend เข้าตารางใดตรงๆ** (ต้องเปิด Data API ก่อน) ต้องทำคู่กัน: `grant` สิทธิ์ที่จำเป็นให้ `authenticated`
และเขียน RLS policy ให้ถูกต้อง ขาดอย่างใดอย่างหนึ่งจะใช้ไม่ได้ และอย่าเขียน policy หลวมๆ เผื่อไว้

## ข้อตกลงที่ควรรู้

- `profiles` สร้างโดย backend แบบ upsert (ไม่มี trigger บน `auth.users`)
  ผู้ใช้ที่ไม่มีแถวใน `profiles` จะเพิ่มหนังสือไม่ได้ จึงต้องสร้างแถวก่อนใช้งานครั้งแรก
  ถ้าจะเพิ่ม trigger ในอนาคต: การสมัครสมาชิกจะล้มถ้า trigger พลาด และห้ามเพิ่มคอลัมน์
  `not null` ใน `profiles` โดยไม่มี default
- ลบบัญชีผู้ใช้: ข้อมูลส่วนตัวถูกลบตาม (cascade) แต่หนังสือที่เขาสร้างอยู่ต่อ (`created_by` เป็น null)
- ลบหนังสือที่มีคนอื่นอ้างอิงอยู่ไม่ได้ ฐานข้อมูลจะปฏิเสธ backend ควรจับ error นี้และแจ้งผู้ใช้
- `feelings.slug` คือรหัสที่โค้ดอ้างอิง อย่าเปลี่ยนหลังเริ่มใช้งาน
