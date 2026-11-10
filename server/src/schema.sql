-- ตาราง users (PostgreSQL)
-- ระบุ public. ไว้ชัด ๆ เพราะ Supabase มีตาราง auth.users ของระบบ Auth อยู่แล้ว
-- รันซ้ำได้ ถ้ามีตารางอยู่แล้วจะไม่สร้างใหม่

CREATE TABLE IF NOT EXISTS public.users (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  google_sub  TEXT        UNIQUE NOT NULL,
  email       TEXT        NOT NULL,
  name        TEXT,
  picture     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Supabase เปิด API อัตโนมัติให้ทุกตารางใน schema public
-- เปิด RLS แบบไม่มี policy เพื่อปิดทางนั้น ให้เข้าถึงได้ผ่าน server ของเราเท่านั้น
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
