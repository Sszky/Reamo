-- 03_seed_feelings.sql
-- ข้อมูลตั้งต้นของตาราง feelings (รายการ tag ความรู้สึกที่ผู้ใช้เลือก)
-- รายการเลือกโดยทีม backend/ดีไซน์
--
-- รันซ้ำได้: on conflict (slug) do nothing
-- slug คือรหัสที่โค้ดอ้างอิง พยายามไม่เปลี่ยนหลังเริ่มใช้งาน

INSERT INTO public.feelings (slug, name_en, name_th) VALUES
  -- Comfort / อุ่นใจ
  ('need-comfort',    'I need something cozy',       'อยากได้อะไรอุ่น ๆ ใจ'),
  ('miss-home',       'I miss home',                 'คิดถึงบ้าน'),
  ('feeling-lonely',  'I feel lonely',               'รู้สึกเหงา'),
  ('rainy-day',       'It''s a rainy day',           'วันฝนตก'),
  -- Let it out / ปล่อยออกมา
  ('need-a-cry',      'I need a good cry',           'อยากร้องไห้ให้สุด'),
  ('heartbroken',     'My heart is broken',          'อกหัก'),
  ('missing-someone', 'I miss someone',              'คิดถึงใครบางคน'),
  -- Lift me up / เติมพลัง
  ('starting-over',   'I''m starting over',          'กำลังเริ่มต้นใหม่'),
  ('need-courage',    'I need courage',              'อยากได้กำลังใจ'),
  ('burnt-out',       'I''m burnt out',              'หมดไฟ'),
  ('want-to-laugh',   'I want to laugh',             'อยากหัวเราะ'),
  -- Take me away / พาไปที่อื่น
  ('want-to-escape',  'I want to escape',            'อยากหนีไปที่อื่นสักพัก'),
  ('want-adventure',  'I want an adventure',         'อยากผจญภัย'),
  ('cant-sleep',      'I can''t sleep',              'นอนไม่หลับ'),
  -- Think it through / ใช้ความคิด
  ('feeling-lost',    'I feel lost',                 'รู้สึกหลงทาง'),
  ('growing-up',      'I''m growing up',             'กำลังโตเป็นผู้ใหญ่'),
  ('want-to-think',   'I want to think deeply',      'อยากคิดอะไรลึก ๆ'),
  -- Love / ความรัก
  ('rainbow-romance', 'I want a rainbow love story', 'อยากอินรักสีรุ้ง')
ON CONFLICT (slug) DO NOTHING;
