# ธรรมชาติในเมืองใหญ่ — Protect & Plant the KONGKANG

เว็บกิจกรรมหน้าบูธกลุ่ม **C12-01** (Gen Week 12 — ความงามในธรรมชาติ) พื้นที่ศึกษา **สะพานรักษ์ทะเลบางขุนเทียน**
ให้ผู้ร่วมงานได้ทดลองฟื้นฟูชายฝั่งด้วยตัวเองผ่าน 4 ขั้นตอนบนหน้าจอโดย **ไม่ต้องเข้าสู่ระบบ (No Login)**:

1. **เลือกพื้นที่ชายฝั่ง** — สังเกตความแรงของคลื่นและการกัดเซาะ พร้อมดูจำนวนต้นโกงกางที่ทุกคนปลูกไว้แยกตามแต่ละโซน
2. **จำลองแนวป้องกันคลื่น** — กดสลับวางแนวไม้ไผ่หรือแนวคันหินทั้ง 5 จุดพร้อมกันในคลิกเดียว และทดลองดูผลหากไม่มีแนวกำบัง (ไม่กระทบต้นไม้จริงของคนอื่น)
3. **ปลูกต้นโกงกาง (1 คนต่อ 1 ต้น)** — แตะปักตำแหน่งต้นไม้ของคุณในพื้นที่จริงที่มีแนวคันหินถาวรคุ้มครองอยู่แล้ว ดูรากเติบโต ดินงอกคืน และต้นไม้เดิมของเพื่อนร่วมบูธในโซนนั้น
4. **ลงชื่อร่วมกิจกรรม** — กรอกรหัสนักศึกษาและความรู้สึกสั้นๆ หลังเล่น 1 ประโยค เพื่อบันทึกตำแหน่งต้นไม้และร่องรอยผู้เข้าร่วมลงฐานข้อมูล `kongkang`

---

## สิ่งที่ต้องมีในเครื่อง (สำหรับเพื่อนที่ Clone จาก GitHub)

- **Docker Desktop** (ต้องเปิดโปรแกรม Docker Desktop ให้พร้อมทำงานก่อนรัน)
- **Git**
- *(ไม่บังคับ)* **Node.js 20+** — ใช้เฉพาะกรณีต้องการรันโหมดพัฒนา (`npm run dev`) หรือสั่ง `npm run db:reset` จากนอก Docker

---

## วิธีติดตั้งและรัน (หลัง `git clone`)

### วิธีที่ 1: รันผ่าน Docker Desktop ทั้งเว็บและฐานข้อมูล (แนะนำ — จบในคำสั่งเดียว)

1. Clone โปรเจกต์และเข้าไปในโฟลเดอร์:
   ```bash
   git clone https://github.com/ILoveSiesta/protect-and-plant-the-KONGKANG.git
   cd protect-and-plant-the-KONGKANG
   ```
2. เปิดโปรแกรม **Docker Desktop** แล้วรันคำสั่ง:
   ```bash
   docker compose up -d --build
   ```
3. เปิดเบราว์เซอร์ไปที่:
   - **http://localhost:3000**

> ระบบจะสร้าง container ฐานข้อมูล PostgreSQL (`kongkang-db`) ชื่อฐานข้อมูล `kongkang` พร้อมสร้างตารางและข้อมูลโซนชายฝั่งเริ่มต้นให้อัตโนมัติ (เพื่อนทุกคนที่ clone ไปจะได้ฐานข้อมูลและโครงสร้างชุดเดียวกันทันที)

---

### วิธีที่ 2: รันโหมดพัฒนา (Local Dev Hot Reload + Docker Database)

ใช้กรณีต้องการแก้โค้ดแล้วเห็นผลทันที:

```bash
docker compose up -d db
npm install
npm run dev
```

จากนั้นเปิดเบราว์เซอร์ที่ **http://localhost:3000**

---

## วิธีการปิดและเปิด `localhost` ใหม่ (แนะนำ)

1. เปิด Terminal ในโฟลเดอร์โปรเจกต์ (`protect-and-plant-the-KONGKANG`)
2. เลือกพิมพ์คำสั่งตามวิธีที่เปิดรันไว้:

### กรณีรันผ่าน Docker Desktop (`docker compose up -d --build`)
- **ปิดทั้งเว็บ (`http://localhost:3000`) และฐานข้อมูล (Container ยังเห็นใน Docker Desktop สถานะ `Exited` และข้อมูลอยู่ครบ):**
  ```bash
  docker compose stop
  ```
- **เปิดกลับมาใช้งานอีกครั้ง (หลังสั่ง `stop` ไว้):**
  ```bash
  docker compose start
  ```
- **ปิดเฉพาะตัวเว็บ (ปล่อยฐานข้อมูลเปิดไว้):**
  ```bash
  docker compose stop web
  ```
- **ตรวจสอบสถานะ:**
  ```bash
  docker compose ps -a
  ```

### กรณีรันโหมดพัฒนา (`npm run dev`)
1. กด **`Ctrl + C`** ในหน้าต่าง Terminal ที่รัน `npm run dev` (และพิมพ์ `y` หากถามยืนยันการหยุด)
2. จากนั้นหยุดฐานข้อมูล Docker ต่อด้วยคำสั่ง:
   ```bash
   docker compose stop
   ```

> **หมายเหตุ:** ใช้ `docker compose stop` แทน `down` เพื่อไม่ให้ชื่อ Container (`kongkang-web`, `kongkang-db`) หายไปจากหน้า Docker Desktop ครับ (หากเผลอรัน `down` ไปแล้ว ให้รัน `docker compose up -d` เพื่อเรียกกลับมาพร้อมข้อมูลเดิม)

---

## ข้อมูลฐานข้อมูล PostgreSQL ใน Docker

| รายการ | ค่าเริ่มต้น |
| :--- | :--- |
| Container Name | `kongkang-db` |
| Database Name | `kongkang` |
| Username | `kongkang` |
| Password | `kongkang_pass` |
| Host Port | `5434` (mapping `5434 -> 5432`) |

> หมายเหตุ: Docker Volume ของแต่ละเครื่องจะเก็บข้อมูลแยกกันในเครื่องนั้นๆ หากต้องการรวมข้อมูลผู้เข้าร่วมจากหลายเครื่อง สามารถกดปุ่ม **ดาวน์โหลด CSV** บนหน้า **ร่องรอยผู้เข้าร่วม** (หรือเข้า `http://localhost:3000/api/participations/export.csv`) ได้ทันที

---

## วิธีการ Reset ฐานข้อมูล

### แบบที่ 1: ล้างเฉพาะข้อมูลผู้เข้าร่วม (เก็บโครงสร้างตารางและข้อมูลพื้นที่ชายฝั่งไว้)

ใช้สำหรับล้างข้อมูลทดสอบก่อนเปิดบูธจริง:

**กรณีมี Node.js ในเครื่อง:**
```bash
npm run db:reset
```

**กรณีรันผ่าน Docker โดยตรง (ไม่ต้องใช้ Node.js):**
```bash
docker exec -i kongkang-db psql -U kongkang -d kongkang -c "TRUNCATE TABLE participations RESTART IDENTITY;"
```

### แบบที่ 2: ล้างฐานข้อมูลและ Volume สร้างใหม่ทั้งหมดตั้งแต่ต้น

ใช้กรณีต้องการลบข้อมูลและรีสตาร์ทฐานข้อมูลใหม่หมดจด:

```bash
docker compose down -v
docker compose up -d --build
```

---

## คำสั่งที่ใช้บ่อยอื่นๆ

- **ดูสถานะ container:** `docker compose ps -a`
- **ดู log ของเว็บและฐานข้อมูล:** `docker compose logs -f`
- **หยุดการทำงานชั่วคราว (ข้อมูลและ container ยังอยู่ครบ):** `docker compose stop`
- **เปิดกลับมาทำงานต่อ:** `docker compose start`
- **ดาวน์โหลดข้อมูลผู้เข้าร่วมเป็นไฟล์ Excel/CSV:** เปิด `http://localhost:3000/api/participations/export.csv`
