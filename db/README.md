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
                       ใช้ service_role key
```

- frontend ใช้ Supabase เฉพาะเรื่อง **login (Auth)** ไม่อ่านหรือเขียนตารางข้อมูลตรง
- backend ใช้ **service_role key** ซึ่งข้าม RLS ได้ทั้งหมด
- ตารางข้อมูลของแอป: เปิด RLS, **ไม่มี policy**, และถอนสิทธิ์ของ `anon`/`authenticated`
  จึงเข้าผ่าน Data API ด้วย key ฝั่ง frontend ไม่ได้ (ตั้งใจ)

**กฎสิทธิ์ต้องตรวจในโค้ด Express ทุกครั้ง** เพราะ service_role ทำได้ทุกอย่าง ฐานข้อมูลไม่ได้ช่วยกัน เช่น

- เพิ่มเข้าลิสต์/ชั้นหนังสือได้เฉพาะของตัวเอง
- แก้/ลบหนังสือได้เฉพาะเมื่อ `books.created_by` ตรงกับผู้ใช้ที่ login
  (ถ้า `created_by` เป็น `null` ต้องถือว่าแก้ไม่ได้)
- ตรวจ token ของ Supabase Auth ก่อนทุกคำขอ แล้วใช้ id จาก token ไม่ใช่จาก body ที่ client ส่งมา

**Key**

- `service_role` key ใช้เฉพาะฝั่ง backend เก็บใน environment variable
  ห้ามใส่ใน repo นี้ (เป็น public) และห้ามอยู่ในโค้ด frontend
- ถ้า key หลุด ให้เปลี่ยน (rotate) ที่หน้า API Keys ของ Supabase ทันที
- ดูชื่อตัวแปรที่ต้องตั้งใน `.env.example`

**ตารางใหม่ต้องทำเสมอ:** `alter table ... enable row level security;`
(สิทธิ์เริ่มต้นตาม `04_default_privileges.sql` ปิดไว้ให้แล้ว แต่ RLS ต้องเปิดเอง)

**ถ้าจะให้ frontend เข้าตารางใดตรงๆ** ต้องทำคู่กัน: `grant` สิทธิ์ที่จำเป็นให้ `authenticated`
และเขียน RLS policy ให้ถูกต้อง ขาดอย่างใดอย่างหนึ่งจะใช้ไม่ได้ และอย่าเขียน policy หลวมๆ เผื่อไว้

## ข้อตกลงที่ควรรู้

- `profiles` สร้างโดย backend แบบ upsert (ไม่มี trigger บน `auth.users`)
  ผู้ใช้ที่ไม่มีแถวใน `profiles` จะเพิ่มหนังสือไม่ได้ จึงต้องสร้างแถวก่อนใช้งานครั้งแรก
  ถ้าจะเพิ่ม trigger ในอนาคต: การสมัครสมาชิกจะล้มถ้า trigger พลาด และห้ามเพิ่มคอลัมน์
  `not null` ใน `profiles` โดยไม่มี default
- ลบบัญชีผู้ใช้: ข้อมูลส่วนตัวถูกลบตาม (cascade) แต่หนังสือที่เขาสร้างอยู่ต่อ (`created_by` เป็น null)
- ลบหนังสือที่มีคนอื่นอ้างอิงอยู่ไม่ได้ ฐานข้อมูลจะปฏิเสธ backend ควรจับ error นี้และแจ้งผู้ใช้
- `feelings.slug` คือรหัสที่โค้ดอ้างอิง อย่าเปลี่ยนหลังเริ่มใช้งาน
