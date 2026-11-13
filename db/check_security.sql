-- check_security.sql
-- คำสั่งตรวจสถานะความปลอดภัยของตารางใน public (อ่านอย่างเดียว ไม่แก้อะไร)
-- รันทีละคำสั่งใน SQL Editor ของ Supabase

-- 1) แต่ละตาราง: เปิด RLS ไหม และ role ไหนมีสิทธิ์ (อย่างใดอย่างหนึ่งใน select/insert/update/delete)
--    ตารางข้อมูลของแอปควรได้: rls_on = true, anon_any = false, auth_any = false, service_any = true
select c.relname as tbl,
  c.relrowsecurity as rls_on,
  has_table_privilege('anon', c.oid, 'select,insert,update,delete') as anon_any,
  has_table_privilege('authenticated', c.oid, 'select,insert,update,delete') as auth_any,
  has_table_privilege('service_role', c.oid, 'select,insert,update,delete') as service_any
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by 1;

-- 2) policy ทั้งหมดใน public (ว่าง = ยังไม่มี policy)
--    ตารางที่เปิด RLS และไม่มี policy จะปฏิเสธทุกแถวสำหรับ anon/authenticated
select tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public';

-- 3) สิทธิ์ละเอียดบน profiles ของ anon / authenticated / service_role
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'profiles'
  and grantee in ('anon', 'authenticated', 'service_role')
order by 1, 2;

-- 4) trigger บน auth.users และ profiles
--    ตอนนี้ไม่มี trigger: backend สร้างแถว profiles เองแบบ upsert
select tgname, tgrelid::regclass as on_table
from pg_trigger
where not tgisinternal
  and tgrelid in ('auth.users'::regclass, 'public.profiles'::regclass);
