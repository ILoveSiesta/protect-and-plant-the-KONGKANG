CREATE TABLE IF NOT EXISTS coastal_zones (
  code VARCHAR(32) PRIMARY KEY,
  name_th VARCHAR(120) NOT NULL,
  subtitle_th VARCHAR(200) NOT NULL,
  wave_intensity SMALLINT NOT NULL CHECK (wave_intensity BETWEEN 1 AND 5),
  erosion_level_th VARCHAR(80) NOT NULL,
  description_th TEXT NOT NULL,
  real_context_th TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS participations (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(32) NOT NULL,
  reflection TEXT NOT NULL,
  coastal_zone_code VARCHAR(32) NOT NULL REFERENCES coastal_zones(code),
  barrier_type VARCHAR(16) NOT NULL CHECK (barrier_type IN ('bamboo', 'rock', 'mixed')),
  barrier_segments SMALLINT NOT NULL DEFAULT 5 CHECK (barrier_segments BETWEEN 1 AND 20),
  tried_without_barrier BOOLEAN NOT NULL DEFAULT FALSE,
  mangroves_planted SMALLINT NOT NULL DEFAULT 1 CHECK (mangroves_planted BETWEEN 1 AND 50),
  land_recovered_sqm NUMERIC(6, 1) NOT NULL DEFAULT 0.0,
  tree_x NUMERIC(5, 4) NOT NULL DEFAULT 0.3200,
  tree_y NUMERIC(5, 4) NOT NULL DEFAULT 0.6600,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE participations
  ADD COLUMN IF NOT EXISTS tree_x NUMERIC(5, 4) NOT NULL DEFAULT 0.3200,
  ADD COLUMN IF NOT EXISTS tree_y NUMERIC(5, 4) NOT NULL DEFAULT 0.6600;

CREATE INDEX IF NOT EXISTS idx_participations_created_at
  ON participations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_participations_student_id
  ON participations (student_id);

CREATE INDEX IF NOT EXISTS idx_participations_zone_code
  ON participations (coastal_zone_code);

INSERT INTO coastal_zones (
  code,
  name_th,
  subtitle_th,
  wave_intensity,
  erosion_level_th,
  description_th,
  real_context_th
)
VALUES
  (
    'estuary_strong',
    'โซนปากอ่าวคลื่นแรง (จุดชมวิวสามเหลี่ยม)',
    'พื้นที่ติดทะเลเปิดรับลมมรสุมเต็มแรง',
    5,
    'กัดเซาะรุนแรงมาก',
    'คลื่นทะเลพัดปะทะฝั่งตลอดเวลา หากปลูกต้นกล้าโกงกางลงไปตรงๆ รากเล็กๆ จะถูกซัดหลุดและพังทลายในเวลาไม่นาน',
    'จากการสัมภาษณ์วิศวกรหน้างานบางขุนเทียน แนวไม้ไผ่เดิมต้านแรงมรสุมและแรงกระแทกไม่ไหว จึงต้องสร้างแนวคันหินป้องกันการกัดเซาะถาวรเพื่อชะลอคลื่นและกักเก็บตะกอนดินเลน'
  ),
  (
    'boardwalk_mid',
    'โซนแนวสะพานรักษ์ทะเล (ช่วงกลางป่าชายเลน)',
    'เส้นทางสำรวจระยะทาง 4 กม. สู่ทะเลเปิด',
    3,
    'กัดเซาะปานกลาง',
    'พื้นที่ดินเลนที่กำลังถูกคลื่นเซาะขอบตลิ่งทีละน้อย ต้องการแนวกำบังช่วยลดแรงน้ำเพื่อให้ต้นกล้าโกงกางได้หยั่งรากและเติบโตต่อเนื่อง',
    'สองข้างทางสะพานรักษ์ทะเลมีทั้งแนวปลูกป่าใหม่และรากโกงกางหนาแน่น เป็นพื้นที่ให้จิตอาสาและนักท่องเที่ยวได้เห็นการฟื้นตัวของผืนป่าและนกชายเลน'
  ),
  (
    'community_canal',
    'โซนปากคลองวังกุ้งชุมชน',
    'พื้นที่น้ำกร่อยวิถีชีวิตชาวประมงชายฝั่ง',
    2,
    'กัดเซาะอ่อน–ปานกลาง',
    'พื้นที่เชื่อมต่อลำคลองและวังเลี้ยงกุ้งหอยของชาวบ้าน มีจังหวะน้ำขึ้น-น้ำลงตามธรรมชาติ ต้องรักษาแนวป้องกันไม่ให้คลื่นทำลายตลิ่งบ้านเรือน',
    'ชาวบ้านและเกษตรกรเพาะเลี้ยงสัตว์น้ำชายฝั่งปรับตัวอยู่ร่วมกับจังหวะน้ำขึ้น-น้ำลง เปิดรับพันธุ์สัตว์น้ำธรรมชาติและอาศัยแนวกันคลื่นเป็นกำแพงธรรมชาติช่วยพยุงพื้นที่ทำกิน'
  )
ON CONFLICT (code) DO NOTHING;
