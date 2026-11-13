-- 02_revoke_exposure.sql
-- ถอนสิทธิ์ของ anon และ authenticated (key ฝั่ง frontend) ออกจากตารางข้อมูล
--
-- เหตุผล: โปรเจกต์ Supabase ให้สิทธิ์ตารางใหม่แก่ anon/authenticated อัตโนมัติ
-- แต่เว็บนี้ให้ frontend ใช้ Supabase แค่ทำ login ส่วนข้อมูลทั้งหมดผ่าน backend (Express)
-- ซึ่งใช้ service_role จึงไม่จำเป็นต้องให้ frontend เข้าตารางเหล่านี้ตรงๆ
--
-- ถ้าวันหนึ่งต้องให้ frontend เข้าตารางไหนตรงๆ ต้องทำคู่กัน 2 อย่าง:
--   1) grant สิทธิ์ที่จำเป็นให้ authenticated
--   2) เขียน RLS policy ให้ถูกต้อง

begin;

revoke all on
  public.books,
  public.feelings,
  public.user_books,
  public.memories,
  public.shelves,
  public.shelf_items,
  public.recommendations
from anon, authenticated;

commit;

-- profiles: ทีม backend ยืนยันแล้วว่า frontend ไม่ได้อ่าน/เขียนตารางนี้ตรงจาก Supabase
-- จึงถอนสิทธิ์ออกเช่นเดียวกับตารางอื่น (รันแล้วบน reamo)
begin;

revoke all on public.profiles from anon, authenticated;

commit;
