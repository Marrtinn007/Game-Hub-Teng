# 🎮 Game Hub Teng

เกมปาร์ตี้สำหรับเล่นกับเพื่อน — ไม่ต้องโหลดแอป กดลิงก์เข้าได้เลย

## โครงสร้างไฟล์

```
Game Hub Teng/
├── index.html   — หน้าเว็บหลัก
├── style.css    — ดีไซน์ทั้งหมด
├── app.js       — Logic ทั้งหมด
└── worker.js    — Cloudflare Worker (AI + TTS)
```

---

## การตั้งค่า

### 1. Firebase Realtime Database

1. ไปที่ [console.firebase.google.com](https://console.firebase.google.com)
2. สร้าง project ใหม่
3. เปิด **Realtime Database** → สร้าง database (asia-southeast1)
4. ไปที่ **Project Settings** → copy config
5. แก้ใน `app.js` บรรทัดแรก:

```js
const CONFIG = {
  firebase: {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "...",
    ...
  },
  workerURL: "https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev",
};
```

**Firebase Rules** (ตั้งใน Realtime Database → Rules):
```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

---

### 2. Cloudflare Worker

1. สมัคร [Cloudflare](https://cloudflare.com) (ฟรี)
2. ไปที่ **Workers & Pages** → Create Worker
3. วาง code จาก `worker.js` ลงไป
4. ไปที่ **Settings → Variables** → เพิ่ม:

| Variable | ค่า |
|---|---|
| `GROQ_API_KEY` | จาก [console.groq.com](https://console.groq.com) |
| `ELEVENLABS_API_KEY` | จาก [elevenlabs.io](https://elevenlabs.io) |
| `ELEVENLABS_VOICE_ID` | Voice ID ที่เลือก (ดูด้านล่าง) |

5. Deploy → copy URL → ใส่ใน `app.js` ที่ `workerURL`

---

### 3. ElevenLabs Voice ID

1. สมัคร [elevenlabs.io](https://elevenlabs.io) (ฟรี 10,000 chars/เดือน)
2. ไปที่ **Voice Library**
3. กรอง: Language = Thai หรือ Multilingual, Gender = Female
4. ฟังจนถูกใจ → กด **Add to My Voices**
5. ไปที่ **My Voices** → copy Voice ID
6. ใส่ใน Cloudflare Worker environment variable `ELEVENLABS_VOICE_ID`

**Voice แนะนำสำหรับภาษาไทย:**
- ค้นหา "multilingual" + female ในไลบรารี
- Model ที่ใช้: `eleven_multilingual_v2` (รองรับไทยอัตโนมัติ)

---

### 4. Deploy เว็บ

#### วิธีง่ายสุด: Cloudflare Pages
1. ไปที่ **Workers & Pages** → Create → Pages
2. Connect GitHub repo หรือ upload folder
3. เปิด URL ที่ได้เลย

#### หรือ drag & drop
1. ไปที่ cloudflare.com → Pages → Upload assets
2. ลาก `index.html`, `style.css`, `app.js` ขึ้นไป

---

## เกมที่มี

| เกม | รายละเอียด |
|---|---|
| 🔥 Truth or Dare | 3 ระดับ · AI generate คำถาม |
| 🌙 Werewolf | เสียง AI พูดกลางคืน · ไม่มีผู้คุมเกม · 11 บทบาท |
| 🚫 คำต้องห้าม | AI สุ่มคำ · คนสุดท้ายชนะ |
| 🎰 Spin the Wheel | กำหนดตัวเลือกเองได้ |
| 🃏 ไพ่ปาร์ตี้ | Custom rules · คิดมินิเกมเอง |
