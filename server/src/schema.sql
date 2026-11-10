-- ตาราง profiles (PostgreSQL)
-- บัญชีผู้ใช้ อีเมล และรหัสผ่าน (เก็บเป็น hash) อยู่ในตาราง auth.users ของ Supabase Auth
-- ตารางนี้เก็บเฉพาะข้อมูลที่แอปเราใช้ และใช้ id เดียวกับ auth.users
-- รันซ้ำได้ ถ้ามีตารางอยู่แล้วจะไม่สร้างใหม่

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Supabase เปิด API อัตโนมัติให้ทุกตารางใน schema public
-- เปิด RLS แบบไม่มี policy เพื่อปิดทางนั้น ให้เข้าถึงได้ผ่าน server ของเราเท่านั้น
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
