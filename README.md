# WongPlay

ตั้งวง เล่นด้วยกัน — เว็บแอปสำหรับล้อมวงเล่นเกมปาร์ตี้กับเพื่อน จอมือถือในมือใครในมือมัน แชร์รหัสวง 6 หลักแล้วเล่นพร้อมกันได้แบบเรียลไทม์ ไม่ต้องติดตั้งแอป

## เกมที่มีให้เล่น

| เกม | ไฟล์ | รายละเอียด |
|---|---|---|
| 🐺 คืนสมิง | `js/kuensaming.js` | Social deduction สไตล์ Werewolf/Mafia มีบทบาทให้เลือกจำนวนมาก |
| 🕵️ สายลับกลางวง | `js/spygame.js` | Spyfall — ทุกคนรู้สถานที่ ยกเว้นสายลับ ต้องถามตอบเพื่อจับสายลับให้ได้ |
| 👑 King's Game | `js/king.js` | แจกไพ่ ใครได้ 👑 สั่งเลขได้ ใครได้เลขนั้นทำตาม |
| 🐈‍⬛ Salem 1692 | `js/salem.js` | เกม social deduction เชิงลึกแบบไต่สวน มีไพ่และกลไกเฉพาะตัว |
| 🎡 วงล้อ | `js/wheel.js` | วงล้อสุ่มตัวเลือก เล่นคนเดียวในเครื่อง ไม่ sync กับใคร |
| 🃏 ไพ่เฮฮา | `js/cardgame.js` | จั่วไพ่ทำชาเลนจ์ เล่นคนเดียวในเครื่อง ไม่ sync กับใคร |

## สถาปัตยกรรม

ไม่มีขั้นตอน build — เป็น static HTML/CSS/JS ล้วน เปิดผ่าน static server ได้เลย

- `index.html` — หน้าแอปหลัก (home, lobby, ทุกหน้าจอเกม)
- `admin.html` — แผงควบคุมสำหรับแอดมิน (จัดการห้อง/สมาชิก/ประกาศ/โหมดปิดปรับปรุง) แยกไฟล์ต่างหาก
- `css/base.css`, `css/home.css`, `css/games.css` — โหลดตามลำดับนี้ใน `index.html`; `base.css` มี design token (สี, easing, spacing) และธีม (`dark`/`cream`/`ocean`) ผ่าน CSS custom properties
- `js/state.js` → `js/firebase.js` → `js/lobby.js` → `js/home.js` → เกมแต่ละไฟล์ → `js/main.js` — โหลดตามลำดับนี้ใน `index.html` (global functions ไม่ใช้ module bundler)
- `manifest.json` — ทำให้ติดตั้งเป็น PWA ได้ (standalone display, ไอคอนแอป)
- `firebase-rules.json` — Firebase Realtime Database security rules (deploy แยกผ่าน Firebase console/CLI ไม่ได้ auto-deploy จาก repo นี้)

### Backend

- **Firebase Realtime Database** — ใช้ sync ห้อง/ผู้เล่น/สถานะเกมแบบเรียลไทม์ ตั้งค่าอยู่ใน `js/firebase.js` (`CONFIG.firebase`) — `apiKey` ที่เห็นเป็น public client key ตามปกติของ Firebase Web SDK ความปลอดภัยจริงมาจาก `firebase-rules.json` ไม่ใช่การซ่อนคีย์
- **Cloudflare Worker** (`gamehub-api.ou415201.workers.dev`) — ใช้สำหรับ endpoint `/tts` (text-to-speech ประกอบเกม) ซอร์สโค้ดของ worker นี้ไม่ได้อยู่ใน repo นี้

## รันเครื่อง local

ไม่ต้อง `npm install` เพราะไม่มี build step — เปิดผ่าน static file server ตัวไหนก็ได้ เช่น

```bash
python3 -m http.server 8000
# แล้วเปิด http://localhost:8000
```

การเชื่อมต่อ Firebase จะใช้ค่าใน `js/firebase.js` ตรงๆ (โปรเจกต์ `game-hb-teng`) — ถ้าจะรันกับ Firebase project ของตัวเอง ให้แก้ `CONFIG.firebase` และ deploy `firebase-rules.json` ไปที่โปรเจกต์นั้นเอง

## Admin panel

`admin.html` เป็นหน้าแยกต่างหาก ล็อกอินด้วย Google แล้วเช็คสิทธิ์จาก node `admins/$uid` ใน Realtime Database (ดู `firebase-rules.json`) ใช้จัดการห้องที่เปิดอยู่, ดู log, ตั้งประกาศ, เปิด/ปิดโหมดปิดปรับปรุงระบบ
