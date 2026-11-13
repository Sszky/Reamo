-- 04_default_privileges.sql
-- ตั้งสิทธิ์เริ่มต้นของ "ตารางใหม่ในอนาคต" ในสคีมา public
-- ตารางใหม่ที่สร้างโดย role postgres (เช่น ผ่าน SQL Editor) จะไม่ได้สิทธิ์สำหรับ
-- anon และ authenticated โดยปริยาย (service_role ไม่ถูกแตะ)
--
-- ไม่กระทบตารางที่มีอยู่แล้ว (ใช้ 02_revoke_exposure.sql สำหรับตารางเดิม)
-- ไม่ครอบคลุมฟังก์ชัน และไม่ครอบคลุมตารางที่สร้างด้วย role อื่น
--
-- ผลที่ต้องรู้: ถ้า frontend ต้องอ่านตารางใหม่ตรงๆ ต้อง grant และเขียน RLS policy เอง
-- ตารางใหม่ทุกตารางควร: enable row level security ตั้งแต่สร้าง
--
-- ทดสอบแล้วบน reamo: ตารางใหม่ได้ anon=false, authenticated=false, service_role=true

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
