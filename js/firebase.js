const CONFIG={
  firebase:{
    apiKey:"AIzaSyC-VPN1bDT4_r-b9hNGpLxRAgayXuaHRTc",
    authDomain:"game-hb-teng.firebaseapp.com",
    databaseURL:"https://game-hb-teng-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId:"game-hb-teng",
    storageBucket:"game-hb-teng.firebasestorage.app",
    messagingSenderId:"243195546115",
    appId:"1:243195546115:web:ae2bfec98846ad0b04dc36",
  },
  workerURL:"https://gamehub-api.ou415201.workers.dev",
};

const WW={
  // ── 🔴 ฝ่ายหมาป่า ──
  werewolf:    {name:'มนุษย์หมาป่า',       en:'Werewolf',          e:'🐺', team:'evil', tl:'🔴 หมาป่า',    pts:-6, max:8,
    short:'ตื่นทุกคืนพร้อมพวก เลือกฆ่าชาวบ้าน 1 คน',
    desc:'ทุกคืน: หลับตาพร้อมหมาป่าตัวอื่น ชี้เหยื่อ 1 คน\nชนะเมื่อหมาป่า ≥ ชาวบ้านที่เหลือ\n(ปรับจำนวนได้ตามขนาดกลุ่ม)'},
  wolfcub:     {name:'ลูกมนุษย์หมาป่า',   en:'Wolf Cub',          e:'🐾', team:'evil', tl:'🔴 หมาป่า',    pts:-8, max:2,
    short:'หมาป่าปกติ แต่ถ้าโดนกำจัด → หมาป่าฆ่าได้ 2 คนคืนถัดไป',
    desc:'ทำหน้าที่เหมือนหมาป่าปกติ\nโบนัส: ถ้าถูกกำจัด หมาป่าทั้งทีมฆ่าได้ 2 คนคืนถัดไป\n(ปรับใช้กับกลุ่มที่ต้องการบาลานซ์เกม)'},
  lonewolf:    {name:'หมาป่าเดียวดาย',    en:'Lone Wolf',         e:'🐺🗡️',team:'evil', tl:'🔴 หมาป่า',    pts:-5, max:1,
    short:'ตื่นพร้อมหมาป่า แต่ชนะต้องเหลือคนสุดท้าย',
    desc:'ตื่นพร้อมหมาป่าทุกคืน ฆ่าได้เหมือนกัน\nชนะได้เฉพาะตัวเองเมื่อเหลือคนสุดท้าย\nหมาป่าอื่นไม่จำเป็นต้องกำจัดกัน\n(ดีสำหรับกลุ่มที่ต้องการความท้าทาย)'},
  minion:      {name:'สมุนรับใช้',        en:'Minion',            e:'🧟', team:'evil', tl:'🔴 หมาป่า',    pts:-6, max:1,
    short:'รู้ว่าใครเป็นหมาป่าตั้งแต่คืนแรก แต่ไม่ได้ตื่นมาฆ่าด้วย',
    desc:'คืนแรก: ลืมตาดูว่าใครเป็นหมาป่าบ้าง\nไม่ตื่นมาฆ่าทุกคืน แต่ชนะพร้อมทีมหมาป่า\n(ดีสำหรับเกมที่มีผู้เล่นมาก)'},
  sorcerer:    {name:'นางปีศาจ',          en:'Sorcerer',          e:'🔯', team:'evil', tl:'🔴 หมาป่า',    pts:-3, max:1,
    short:'ทุกคืนส่องหาว่าใครคือเทพพยากรณ์ ชนะพร้อมหมาป่า',
    desc:'ทุกคืน: ส่องผู้เล่น 1 คน รู้ว่าเป็นเทพพยากรณ์หรือไม่\nชนะพร้อมทีมหมาป่า ไม่ใช่หมาป่าเอง\n(ต้องมี Seer ในเกมด้วย)'},
  alphawolf:   {name:'หมาป่าจ่าฝูง',     en:'Alpha Wolf',        e:'🐺👑',team:'evil', tl:'🔴 หมาป่า',    pts:-9, max:1,
    short:'ถ้าหมาป่าตายกลางวัน → คืนนั้นแปลงเหยื่อให้เป็นหมาป่าได้ (1 ครั้ง)',
    desc:'ทำหน้าที่เหมือนหมาป่าปกติ\nโบนัส (1 ครั้ง): ถ้าหมาป่าตายกลางวัน คืนนั้นเลือกเปลี่ยนเหยื่อที่โดนกัดให้กลายเป็นหมาป่าได้\n(ใช้ได้ครั้งเดียวตลอดเกม)'},
  cursed:      {name:'ผู้ต้องคำสาป',     en:'Cursed',            e:'😰', team:'evil', tl:'🔴 หมาป่า',    pts:-3, max:1,
    short:'เริ่มเป็นชาวบ้าน แต่ถ้าหมาป่าเลือกกัด → ไม่ตาย กลายเป็นหมาป่าทันที',
    desc:'เริ่มเกมเป็นฝ่ายดี\nถ้าหมาป่าเลือกกัดคืนไหน: ไม่ตาย กลายเป็นหมาป่าตั้งแต่คืนถัดไป\nผู้คุมเกมต้องเรียก Cursed ทุกคืน\n(ปรับเงื่อนไขได้)'},
  // ── ✅ ฝ่ายดี (เรียงนิยม) ──
  villager:    {name:'ชาวบ้าน',           en:'Villager',          e:'👨‍🌾',team:'good', tl:'✅ ฝ่ายดี',   pts:+1, max:99,
    short:'ไม่มีพลังพิเศษ ช่วยกันโหวตกำจัดหมาป่า',
    desc:'งานของคุณ: สังเกต ถกเถียง และโหวตกำจัดหมาป่าทุกเช้า\nแม้ไม่มีพลัง แต่คุณกำหนดทิศทางเกมได้\n(เพิ่มได้ตามจำนวนผู้เล่น)'},
  seer:        {name:'เทพพยากรณ์',       en:'Seer',              e:'🔮', team:'good', tl:'✅ ฝ่ายดี',   pts:+7, max:1,
    short:'ทุกคืนส่องคน 1 คน รู้ว่าเป็นหมาป่าหรือไม่',
    desc:'ทุกคืน: ชี้ผู้เล่น 1 คน ผู้คุมเกมบอก "ใช่/ไม่ใช่หมาป่า"\nLycan จะเห็นเป็นหมาป่าแม้อยู่ทีมดี\n(ปรับให้บอกชื่อบทบาทได้ถ้าอยากง่ายขึ้น)'},
  bodyguard:   {name:'บอดี้การ์ด',       en:'Bodyguard',         e:'🛡️', team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:1,
    short:'ทุกคืนคุ้ม 1 คน ห้ามซ้ำคืนก่อน (คุ้มตัวเองได้)',
    desc:'ทุกคืน: เลือกคุ้มกัน 1 คน คนนั้นไม่ตายคืนนั้น\nคุ้มตัวเองได้ และห้ามคุ้มคนเดิม 2 คืนติด\n(ปรับกฎห้ามคุ้มตัวเองได้ถ้าต้องการ)'},
  hunter:      {name:'นายพราน',          en:'Hunter',            e:'🏹', team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:2,
    short:'ถ้าถูกกำจัด (กลางคืนหรือโหวต) ยิงคนอื่นตายตาม 1 คน',
    desc:'ถ้าถูกกำจัดด้วยวิธีใดก็ตาม: เลือกยิงผู้เล่นอีก 1 คนตายตามได้ทันที\nถ้ามี Hunter หลายคน ห้ามบอกว่าเหลือกี่คน\n(ปรับเงื่อนไขการยิงได้)'},
  witch:       {name:'แม่มด',            en:'Witch',             e:'🧙‍♀️',team:'good', tl:'✅ ฝ่ายดี',   pts:+4, max:1,
    short:'รู้ว่าใครจะตายคืนนั้น มียาช่วย+ยาพิษ อย่างละ 1 ครั้ง',
    desc:'ทุกคืน: รู้ว่าใครกำลังจะถูกฆ่า\nยาช่วย: ชุบชีวิตคนที่จะตายคืนนั้น (1 ครั้ง)\nยาพิษ: ฆ่าใครก็ได้ (1 ครั้ง)\n(ใช้ได้อย่างละ 1 ครั้งตลอดเกม)'},
  prince:      {name:'เจ้าชาย',          en:'Prince',            e:'👑', team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:1,
    short:'โดนโหวตออกครั้งแรก → รอด แต่ต้องเปิดบทบาท',
    desc:'ถ้าโดนโหวตประหาร: รอดครั้งแรก แต่ต้องเปิดบทบาทให้ทุกคนเห็น\nถ้าหมาป่าฆ่ากลางคืน: ตายปกติ\n(ปรับจำนวนครั้งที่รอดได้)'},
  cupid:       {name:'กามเทพ',           en:'Cupid',             e:'💘', team:'good', tl:'✅ ฝ่ายดี',   pts:-3, max:1,
    short:'คืนแรกจับคู่รัก 2 คน ถ้าคนใดตาย อีกคนตายตามทันที',
    desc:'คืนแรก: เลือก 2 คนเป็นคู่รัก (รวมตัวเองได้)\nถ้าคนหนึ่งตาย → อีกคนตายตาม\nถ้าคู่รักต่างทีม → ทั้งคู่เป็นทีมใหม่ ชนะต้องเหลือ 2 คนสุดท้าย\n(ปรับกฎได้ตามต้องการ)'},
  mason:       {name:'ภราดรภาพ',         en:'Mason',             e:'🤝', team:'good', tl:'✅ ฝ่ายดี',   pts:+2, max:4,
    short:'คืนแรก Mason ทุกคนเห็นหน้ากัน รู้ว่าใครเป็นพวก',
    desc:'คืนแรก: Mason ทุกคนลืมตามองหน้ากัน รู้จักพวกเดียวกัน\nกฎเหล็ก: ห้ามพูดถึง Mason ทั้งทางตรงและอ้อม ผิด → ตายทันทีคืนถัดไป\n(ต้องมีอย่างน้อย 2 คน ปรับกฎได้)'},
  spellcaster: {name:'จอมเวท',           en:'Spellcaster',       e:'✨', team:'good', tl:'✅ ฝ่ายดี',   pts:+1, max:1,
    short:'ทุกคืนสาปคน 1 คน วันรุ่งขึ้นคนนั้นพูด/โหวตไม่ได้',
    desc:'ทุกคืน: เลือกสาปผู้เล่น 1 คน\nวันรุ่งขึ้น: คนนั้นพูดไม่ได้และโหวตไม่ได้\nผู้คุมเกมต้องประกาศตอนเช้าว่าใครโดนสาป\n(ปรับระยะเวลาสาปได้)'},
  auraseer:    {name:'ญาณทิพย์',         en:'Aura Seer',         e:'👁️', team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:1,
    short:'ทุกคืนส่องคน 1 คน รู้ว่าเป็นบทบาทพิเศษหรือแค่ Villager/Werewolf ธรรมดา',
    desc:'ทุกคืน: ส่องผู้เล่น 1 คน\nถ้าเป็น Villager ธรรมดาหรือ Werewolf ธรรมดา → ผู้คุมเกมคว่ำนิ้วโป้ง\nถ้าเป็นบทบาทพิเศษอื่น → ผู้คุมเกมชูนิ้วโป้ง\n(ปรับได้)'},
  apprenticeseer:{name:'ศิษย์เทพพยากรณ์',en:'Apprentice Seer',  e:'🌟', team:'good', tl:'✅ ฝ่ายดี',   pts:+4, max:1,
    short:'ตื่นพร้อม Seer ทุกคืน พอ Seer ตาย → กลายเป็น Seer เอง',
    desc:'ตื่นพร้อม Seer ทุกคืน (แต่ไม่รู้ผลการส่อง)\nถ้า Seer ถูกกำจัด: คุณกลายเป็นเทพพยากรณ์ทันที\n(ต้องมี Seer ในเกมด้วย)'},
  priest:      {name:'บาทหลวง',          en:'Priest',            e:'⛪', team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:1,
    short:'อวยพรคน 1 คน ตลอดเกม คนนั้นรอดตายได้ 1 ครั้ง',
    desc:'ใช้ได้ 1 ครั้งต่อเกม: เลือกอวยพรผู้เล่น 1 คน\nคนนั้นรอดจากการกำจัดได้ 1 ครั้ง ไม่ว่าวิธีใด\nพรยังอยู่แม้ Priest จะตายแล้ว\n(ปรับจำนวนครั้งได้)'},
  troublemaker:{name:'ตัวป่วน',          en:'Troublemaker',      e:'😈', team:'good', tl:'✅ ฝ่ายดี',   pts:-3, max:1,
    short:'ใช้ได้ 1 ครั้ง: ทำให้วันรุ่งขึ้นต้องโหวตออก 2 คน',
    desc:'ใช้ได้ 1 ครั้งตลอดเกม: ป่วนหมู่บ้าน\nวันรุ่งขึ้น: ทุกคนต้องโหวตประหาร 2 คนแทน 1 คน\n(ปรับเงื่อนไขได้)'},
  pi:          {name:'นักสืบ',           en:'P.I.',              e:'🕵️', team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:1,
    short:'ใช้ได้ 1 ครั้ง: ส่องคน 1 คน รู้ว่าตัวเขา+คนข้างๆ มีหมาป่าไหม',
    desc:'ใช้ได้ 1 ครั้งตลอดเกม: ชี้ผู้เล่น 1 คน\nผู้คุมเกมบอกว่า คนนั้น+คนซ้าย+คนขวา มีหมาป่าปนอยู่ไหม\nไม่บอกจำนวนหรือตำแหน่ง\n(ปรับได้)'},
  oldhag:      {name:'แม่หมอ',           en:'Old Hag',           e:'👴', team:'good', tl:'✅ ฝ่ายดี',   pts:+1, max:1,
    short:'ทุกคืนไล่คน 1 คนออกหมู่บ้าน 1 วัน (พูด/โหวต/ถูกฆ่าไม่ได้)',
    desc:'ทุกคืน: ไล่ผู้เล่น 1 คนออกนอกหมู่บ้าน\nวันรุ่งขึ้น: คนนั้นพูดไม่ได้ โหวตไม่ได้ และถูกฆ่าไม่ได้\nกลับมาเช้าวันถัดไป\n(ห้ามเลือกตัวเองและห้ามซ้ำ)'},
  toughguy:    {name:'หนุ่มถึก',         en:'Tough Guy',         e:'💪', team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:1,
    short:'ถ้าหมาป่าฆ่ากลางคืน → ไม่ตายทันที ยังอยู่ได้ถึงเช้า แล้วค่อยตาย',
    desc:'ถ้าหมาป่าเลือกฆ่า: ไม่ตายทันที ยังเล่นได้ถึงเช้าวันถัดไป\nโหวตได้และพูดได้ แต่ตายในคืนถัดไป\nผู้คุมเกมห้ามบอกว่าจะตาย\n(ปรับเวลาได้)'},
  lycan:       {name:'ลูกครึ่งหมาป่า',  en:'Lycan',             e:'🧬', team:'good', tl:'🟡 พิเศษ',   pts:-1, max:1,
    short:'อยู่ฝ่ายดี แต่ Seer ส่องเห็นเป็นหมาป่า',
    desc:'อยู่ฝ่ายดี ชนะพร้อมชาวบ้าน\nถ้า Seer ส่อง: เห็นว่าเป็น "หมาป่า" แม้ไม่ใช่\nอาจโดนโหวตออกเพราะ Seer เข้าใจผิด\n(ปรับให้ Seer เห็นจริงได้ถ้าเกมง่ายเกิน)'},
  diseased:    {name:'ผู้ป่วยติดเชื้อ', en:'Diseased',          e:'🤒', team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:1,
    short:'ถ้าหมาป่าฆ่า → หมาป่าติดเชื้อ ฆ่าใครไม่ได้คืนถัดไป',
    desc:'อยู่ฝ่ายดี ชนะพร้อมชาวบ้าน\nถ้าถูกหมาป่าฆ่า: หมาป่าทั้งทีมฆ่าใครไม่ได้คืนถัดไป\nผู้คุมเกมประกาศเช้าว่า "หมาป่าป่วย"\n(ปรับระยะเวลาได้)'},
  mystic:      {name:'เทพผู้รู้แจ้ง',   en:'Mystic Seer',       e:'🌠', team:'good', tl:'✅ ฝ่ายดี',   pts:+9, max:1,
    short:'ทุกคืนส่องคน 1 คน รู้ชื่อบทบาทจริงๆ เลย (แรงกว่า Seer)',
    desc:'ทุกคืน: ส่องผู้เล่น 1 คน ผู้คุมเกมบอกชื่อบทบาทจริงๆ\nแรงกว่า Seer มาก — บาลานซ์ด้วยการใส่หมาป่าเพิ่ม\n(แนะนำสำหรับผู้เล่นขั้นสูง)'},
  mentalist:   {name:'นักสะกดจิต',      en:'Mentalist',         e:'🧠', team:'good', tl:'✅ ฝ่ายดี',   pts:+6, max:1,
    short:'ทุกคืนส่อง 2 คน รู้ว่าทั้งคู่อยู่ทีมเดียวกันไหม',
    desc:'ทุกคืน: ชี้ผู้เล่น 2 คน ผู้คุมเกมบอกว่าทั้งคู่อยู่ฝ่ายเดียวกันหรือไม่\nไม่บอกว่าฝ่ายอะไร แค่ "ใช่/ไม่ใช่"\n(เหมาะกับเกมที่มีผู้เล่นหลายคน)'},
  huntress:    {name:'พรานหญิง',        en:'Huntress',          e:'🏹🎀',team:'good', tl:'✅ ฝ่ายดี',   pts:+3, max:1,
    short:'ใช้ได้ 1 ครั้ง: เลือกฆ่าใครก็ได้กลางคืน',
    desc:'ใช้ได้ 1 ครั้งตลอดเกม: กลางคืนเลือกฆ่าผู้เล่น 1 คน\nผู้คุมเกมเรียกทุกคืนจนกว่าจะใช้พลัง\n(ปรับเงื่อนไขได้)'},
  // ── ⚡ โดดเดี่ยว ──
  tanner:      {name:'คนบ้า',           en:'Tanner',            e:'🤪', team:'solo', tl:'⚡ โดดเดี่ยว', pts:-2, max:1,
    short:'ชนะถ้าถูกโหวตประหาร! ต้องทำให้ตัวเองโดนโหวตออก',
    desc:'เกลียดงาน เกลียดชีวิต อยากออกจากเกม\nชนะทันทีถ้าถูกโหวตประหาร\nถ้าถูกฆ่ากลางคืน = แพ้\n(แนะนำให้ชนะเฉพาะโหวตเท่านั้น)'},
  vampire:     {name:'แวมไพร์',         en:'Vampire',           e:'🧛', team:'solo', tl:'⚡ โดดเดี่ยว', pts:-7, max:1,
    short:'ทุกคืนสาปคน 1 คน คนนั้นตายถ้าโดนเสนอชื่อโหวตเช้าถัดไป',
    desc:'ทุกคืน: สาปผู้เล่น 1 คน\nคนนั้นตายถ้าถูกเสนอชื่อโหวตในเช้าวันถัดมา\nหมาป่าฆ่าแวมไพร์ไม่ได้ แต่โดนโหวตตายได้\n(ปรับเงื่อนไขได้)'},
  cultleader:  {name:'เจ้าลัทธิ',       en:'Cult Leader',       e:'🕯️', team:'solo', tl:'⚡ โดดเดี่ยว', pts:+1, max:1,
    short:'ทุกคืนดึงคน 1 คนเข้าลัทธิ ชนะเมื่อทุกคนที่เหลืออยู่ในลัทธิ',
    desc:'ทุกคืน: บังคับผู้เล่น 1 คนเข้าลัทธิ\nชนะเมื่อผู้เล่นที่เหลือทุกคนอยู่ในลัทธิ\nถ้าเจ้าลัทธิตาย ลัทธิล่มทันที คนในลัทธิเปลี่ยนทีมไม่ได้\n(เหมาะกับผู้เล่นขั้นสูง)'},
  hoodlum:     {name:'อันธพาล',         en:'Hoodlum',           e:'🦹', team:'solo', tl:'⚡ โดดเดี่ยว', pts:0,  max:1,
    short:'คืนแรกเลือกเป้า 2 คน ชนะถ้าเป้าทั้งคู่ตายและตัวเองรอด',
    desc:'คืนแรก: เลือกเป้าหมาย 2 คน\nชนะเมื่อเป้าหมายทั้งสองตายและตัวเองยังอยู่ในเกม\n(ปรับจำนวนเป้าได้)'},
  revealer:    {name:'ผู้เผยตัวตน',     en:'Revealer',          e:'🔦', team:'solo', tl:'⚡ โดดเดี่ยว', pts:+4, max:1,
    short:'ทุกคืนชี้คน: ถ้าเป็นหมาป่า → หมาป่าตาย ถ้าไม่ใช่ → ตัวเองตาย',
    desc:'ทุกคืน: เลือกจะใช้หรือไม่ก็ได้\nชี้ผู้เล่น 1 คน: ถ้าเป็นหมาป่า/Lycan → คนนั้นตาย ถ้าไม่ใช่ → ตัวเองตาย\n(ถ้าชี้หมาป่าถูก สามารถชี้ต่อได้)'},
  madbomber:   {name:'มือระเบิด',        en:'Mad Bomber',        e:'💣', team:'solo', tl:'⚡ โดดเดี่ยว', pts:-2, max:1,
    short:'ถ้าถูกกำจัด → คนซ้ายและขวาตายตามด้วย',
    desc:'อยู่ฝ่ายชาวบ้าน ชนะพร้อมชาวบ้าน\nถ้าถูกกำจัดด้วยวิธีใด: คนที่นั่งซ้ายและขวาตายตามด้วยทันที\n(ระวัง: อาจทำให้เกมพลิกผัน)'},
};
const ROLE_ORDER=[
  'werewolf','wolfcub','lonewolf','minion','sorcerer','alphawolf','cursed',
  'villager','seer','bodyguard','hunter','witch','prince','cupid','mason','spellcaster',
  'auraseer','apprenticeseer','priest','troublemaker','pi','oldhag','toughguy',
  'lycan','diseased','mystic','mentalist','huntress',
  'tanner','vampire','cultleader','hoodlum','revealer','madbomber'
];

const CARDS={A:{r:'โดนคนเดียว',d:'คนจั่วรับ penalty คนเดียว'},2:{r:'หาเพื่อนโดนด้วย 1 คน',d:'เลือกคน 1 คนมาโดนด้วยกัน'},3:{r:'หาเพื่อนโดนด้วย 2 คน',d:'เลือกคน 2 คนมาโดนด้วยกัน'},4:{r:'เพื่อนฝั่งซ้ายโดน',d:'คนนั่งซ้ายมือของคนจั่วโดน'},5:{r:'ห้าเฮฮา — ทุกคนโดน! 🎉',d:'ทุกคนในวงโดนพร้อมกัน'},6:{r:'เพื่อนฝั่งขวาโดน',d:'คนนั่งขวามือของคนจั่วโดน'},7:{r:'ดวลปอด 🫁',d:'ลากเสียงยาวสุดลม ใครหยุดก่อน = โดน\nจั่ว 7 ซ้ำ → คนแพ้เป็นบัดดี้'},8:{r:'Relax — ปลอดภัย 😌',d:'คนจั่วไม่โดนอะไรรอบนี้'},9:{r:'คิดเกมเอง 🧠',d:'คนจั่วคิดมินิเกมให้วงเล่น — ใครแพ้โดน'},10:{r:'เลอะ 💥',d:'แป้งโปะหน้า'},J:{r:'จับหน้า 👋',d:'ทุกคนรีบจับหน้าตัวเอง — คนสุดท้ายโดน'},Q:{r:'แหม่มเพื่อนไม่คบ 👸',d:'ห้ามคุยหรือตอบแหม่ม (คนที่จั่ว Q)\nใครพลาดโดน'},K:{r:'กำหนดกฎ 👑',d:'ตั้งกฎใหม่ได้ 1 อย่าง และกำหนด K ต่อไป'}};

const COLORS=['#a78bfa','#60a5fa','#34d399','#f87171','#fbbf24','#c084fc','#38bdf8','#fb923c','#4ade80','#e879f9'];

/* ══ FIREBASE ════════════════════════════ */
let db=null,firebaseReady=false,roomRef=null,gameRef=null,wwRef=null;
let auth=null,currentUser=null,hiddenGames={};
let _isAdminCached=false;
function _loadAdminStatus(uid){
  if(!db||!uid){_isAdminCached=false;return;}
  db.ref('admins/'+uid).once('value').then(snap=>{
    _isAdminCached=snap.exists()&&snap.val()===true;
    const ab=$('adminMenuBtn');
    if(ab)ab.style.display=_isAdminCached?'':'none';
    if(typeof window._reapplyMaintenance==='function')window._reapplyMaintenance();
  }).catch(()=>{_isAdminCached=false;});
}
function isAdmin(){return _isAdminCached;}
function initFirebase(){
  try{
    firebase.initializeApp(CONFIG.firebase);
    db=firebase.database();
    auth=firebase.auth();
    firebaseReady=true;
    db.ref('config/hiddenGames').on('value',snap=>{hiddenGames=snap.val()||{};renderHomeGames();if($('screen-lobby')?.classList.contains('active'))renderLobbyUI();if($('adminPanelSheet')?.style.display!=='none')renderAdminGames();});
    // ── Maintenance mode: ขึ้นก่อนเลย ไม่ว่าจะ login หรือไม่ — admin เท่านั้นที่เห็นเว็บ ──
    let _maintEnabled=false;
    function _applyMaintenance(){
      const ov=$('maintenanceOverlay');if(!ov)return;
      if(_maintEnabled&&!isAdmin()){
        ov.style.display='block';
        document.body.style.overflow='hidden';
        document.body.style.pointerEvents='none';
        ov.style.pointerEvents='all';
      } else {
        ov.style.display='none';
        document.body.style.overflow='';
        document.body.style.pointerEvents='';
      }
    }
    db.ref('maintenance').on('value',snap=>{
      const v=snap.val()||{};
      _maintEnabled=!!(v&&v.enabled);
      const msgEl=$('maintenanceMsg');
      if(msgEl)msgEl.textContent=(v&&v.msg)||'กำลังปรับปรุงระบบ กลับมาใหม่เร็วๆ นี้นะครับ';
      _applyMaintenance();
    });
    // หลัง checkAdmin เสร็จ ให้ re-apply ด้วย เผื่อ admin login ทีหลัง
    window._reapplyMaintenance=_applyMaintenance;
    // ── Global announcement: แจ้งเตือนล่าสุดจาก admin ──
    db.ref('announcements/latest').on('value',snap=>{
      const v=snap.val();
      if(!v||!v.msg)return;
      const seenKey='ann_seen_'+(v.id||v.ts||'');
      if(localStorage.getItem(seenKey))return;
      localStorage.setItem(seenKey,'1');
      const banner=$('announceBanner'),txt=$('announceText');
      if(banner&&txt){txt.textContent=v.msg;banner.style.display='block';}
      else showToast('📢 '+v.msg,5000);
    });
    // ตรวจแบนก่อนเข้าระบบ — ใช้ทั้งใน onAuthStateChanged และ getRedirectResult
    async function _checkBanThenLogin(user){
      if(!user)return;
      try{
        const bsnap=await db.ref('banned/'+user.uid).once('value');
        if(bsnap.exists()&&bsnap.val()&&bsnap.val().banned){
          showToast('🚫 บัญชีนี้ถูกระงับการใช้งาน');
          await auth.signOut();
          return; // หยุด — ไม่เข้าระบบ
        }
      }catch(e){/* network error — ให้เข้าได้ banRef listener จะคอย kick */}
      _onLoginReady(user);
    }
    function _onLoginReady(user){
      startSessionGuard(user.uid);
      ensurePlayerId(user.uid).then(()=>logEvent('login'));
      const av=$('homeUserAvatar'),nm=$('homeUserName');
      const dn=$('profileDropName'),de=$('profileDropEmail'),da=$('profileDropAvatar'),ab=$('adminMenuBtn');
      if(av&&user.photoURL){av.src=user.photoURL;av.style.display='';}
      if(da&&user.photoURL){da.src=user.photoURL;}
      if(nm)nm.textContent='สวัสดี, '+(user.displayName?.split(' ')[0]||'ผู้เล่น')+' 👋';
      if(dn)dn.textContent=user.displayName||user.email||'';
      if(de)de.textContent=user.email||'';
      if(ab)ab.style.display=isAdmin()?'':'none';
      _loadAdminStatus(user.uid);
      $('screen-login')?.classList.remove('active');
      const cur=document.querySelector('.screen.active');
      if(!cur||cur.id==='screen-login')showScreen('screen-home');
      checkDeepLink();
      // หลังล็อคอินใหม่ (เช่น เปิดเครื่องใหม่) ให้ตรวจว่าบัญชีนี้ยังอยู่ในห้องไหนอยู่ไหม
      if(firebaseReady&&!new URLSearchParams(location.search).get('room'))checkRejoinRoom(user.uid);
    }

    auth.onAuthStateChanged(user=>{
      currentUser=user;
      $('screen-splash')?.classList.remove('active');
      if(user){
        _checkBanThenLogin(user);
      } else {
        stopSessionGuard();
        document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
        $('screen-login')?.classList.add('active');
      }
    });
    // รับผลลัพธ์หลัง redirect กลับมา (เฉพาะ http/https เท่านั้น)
    if(location.protocol==='http:'||location.protocol==='https:'){
      auth.getRedirectResult().then(result=>{
        // getRedirectResult จะ trigger onAuthStateChanged อยู่แล้ว — ไม่ต้องทำอะไรเพิ่ม
      }).catch(err=>{
        console.warn('Redirect result:',err.code);
      });
    }
  }catch(e){console.warn('Firebase:',e.message);$('screen-splash')?.classList.remove('active');$('screen-login')?.classList.add('active');renderHomeGames();checkDeepLink();}
}
/* ══ SINGLE-DEVICE LOGIN GUARD ══════════════════════════════════
   เครื่อง/แท็บที่ login ล่าสุดของบัญชีเดียวกันจะ "ทับ" session เก่าเสมอ
   เครื่องเก่าที่เห็น sid เปลี่ยนจะถูกบังคับออกจากระบบอัตโนมัติ           */
let _sessionRef=null;
let _banRef=null;
let _sessionGuardActive=false;
function startSessionGuard(uid){
  if(!db||!uid)return;
  stopSessionGuard();
  _sessionGuardActive=true;
  const ref=db.ref('userSessions/'+uid);
  _sessionRef=ref;
  _banRef=db.ref('banned/'+uid);
  _banRef.on('value',bsnap=>{
    if(bsnap.exists()&&bsnap.val()){
      showToast('🚫 บัญชีนี้ถูกระงับการใช้งาน');
      stopSessionGuard();
      setTimeout(()=>auth&&auth.signOut(),400);
    }
  });
  // อ่านค่า forceLogout ที่ค้างอยู่ก่อน แล้วค่อย seed _lastForceLogoutSeen
  // เพื่อป้องกัน forceLogout เก่าที่ยังอยู่ใน DB trigger โดยไม่ตั้งใจ
  ref.once('value').then(initSnap=>{
    if(!_sessionGuardActive)return;
    const initVal=initSnap.val()||{};
    // seed ค่า forceLogout เก่าออกไปก่อน — ไม่งั้นจะ trigger ทันทีที่ listen
    if(initVal.forceLogout)S._lastForceLogoutSeen=initVal.forceLogout;
    // เขียนทับ sid — ใช้ update ไม่ใช่ set เพื่อรักษา activeRoom ไว้
    const _u=firebase.auth().currentUser;
    ref.update({sid:S.sessionId,ts:Date.now(),displayName:_u?.displayName||null,email:_u?.email||null,photo:_u?.photoURL||null}).catch(()=>{});
    // เริ่ม listen หลังจาก seed แล้ว + หลัง update sid แล้ว
    // ข้าม snapshot แรก (เป็นผลของ update ข้างบน — ของตัวเอง)
    let _firstSnap=true;
    ref.on('value',snap=>{
      if(_firstSnap){_firstSnap=false;return;}
      if(!_sessionGuardActive)return;
      const v=snap.val();
      if(v&&v.sid&&v.sid!==S.sessionId)forceKickedBySameAccount();
      if(v&&v.forceLogout&&v.forceLogout!==S._lastForceLogoutSeen){
        S._lastForceLogoutSeen=v.forceLogout;
        forceLogoutByAdmin();
      }
    });
  }).catch(()=>{
    // fallback: ถ้าอ่าน once ไม่ได้ ก็ listen ตรงๆ เลย
    const _u=firebase.auth().currentUser;
    ref.update({sid:S.sessionId,ts:Date.now(),displayName:_u?.displayName||null,email:_u?.email||null,photo:_u?.photoURL||null}).catch(()=>{});
    let _firstSnap=true;
    ref.on('value',snap=>{
      if(_firstSnap){_firstSnap=false;return;}
      if(!_sessionGuardActive)return;
      const v=snap.val();
      if(v&&v.sid&&v.sid!==S.sessionId)forceKickedBySameAccount();
      if(v&&v.forceLogout&&v.forceLogout!==S._lastForceLogoutSeen){
        S._lastForceLogoutSeen=v.forceLogout;
        forceLogoutByAdmin();
      }
    });
  });
}
function stopSessionGuard(){
  _sessionGuardActive=false;
  if(_sessionRef){_sessionRef.off();_sessionRef=null;}
  if(_banRef){_banRef.off();_banRef=null;}
}
function forceKickedBySameAccount(){
  stopSessionGuard();
  // ลบ node ตัวเองออกจากห้องทันที — เครื่องใหม่ไม่ต้อง rejoin เข้ามาแทนอีกต่อไป
  // ถ้าเป็น host → auto-promote timer ของเครื่องอื่นจะทำงานเองใน 2.5s
  if(firebaseReady&&S.roomCode&&S.myPlayerId){
    db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}`).remove().catch(()=>{});
    if(currentUser?.uid)db.ref('userSessions/'+currentUser.uid+'/activeRoom').remove().catch(()=>{});
  }
  // ปิด listeners ทั้งหมด
  [roomRef,gameRef,wwRef].forEach(r=>r?.off());
  roomRef=gameRef=wwRef=null;
  db.ref('.info/connected').off();
  Object.assign(S,{roomCode:null,myPlayerId:null,selectedGame:null,players:[],roomName:null,isHost:false,nickname:null});
  // แสดง popup แจ้งเตือนก่อน แล้วค่อย signOut เมื่อกด ตกลง
  $('sessionKickedOverlay')?.classList.add('show');
}
function confirmSessionKicked(){
  $('sessionKickedOverlay')?.classList.remove('show');
  auth&&auth.signOut();
}
function forceLogoutByAdmin(){
  stopSessionGuard();
  if(firebaseReady&&S.roomCode&&S.myPlayerId){
    db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}`).remove().catch(()=>{});
    if(currentUser?.uid)db.ref('userSessions/'+currentUser.uid+'/activeRoom').remove().catch(()=>{});
  }
  [roomRef,gameRef,wwRef].forEach(r=>r?.off());
  roomRef=gameRef=wwRef=null;
  db.ref('.info/connected').off();
  Object.assign(S,{roomCode:null,myPlayerId:null,selectedGame:null,players:[],roomName:null,isHost:false,nickname:null});
  showToast('🔒 ผู้ดูแลระบบบังคับออกจากระบบ');
  setTimeout(()=>auth&&auth.signOut(),600);
}
/* ══ AUTO-REJOIN: ปิดการ rejoin อัตโนมัติแล้ว ══════════════════
   เครื่องใหม่ที่ login เข้ามาจะต้องกรอก room code เองถ้าจะเข้าห้อง
   เครื่องเก่าจะถูก signOut และลบออกจากห้องอัตโนมัติ              */
function checkRejoinRoom(uid){
  // ล้าง activeRoom ที่ค้างอยู่ออก เผื่อเครื่องเก่า crash ไม่ได้ลบ
  if(db&&uid)db.ref('userSessions/'+uid+'/activeRoom').remove().catch(()=>{});
}

let _signingIn=false;
function signInWithGoogle(){
  if(!auth){showToast('กำลังเชื่อมต่อ...');return;}
  if(_signingIn){showToast('กำลังเข้าสู่ระบบ...');return;}
  _signingIn=true;
  setTimeout(()=>{_signingIn=false;},10000);
  const provider=new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account'});
  auth.signInWithPopup(provider).then(result=>{
    _signingIn=false;
    // onAuthStateChanged จะเรียก _checkBanThenLogin อัตโนมัติ
  }).catch(err=>{
    _signingIn=false;
    console.warn('Popup failed, trying redirect:',err.code);
    const useRedirect=['auth/popup-blocked','auth/popup-closed-by-user','auth/cancelled-popup-request','auth/operation-not-supported-in-this-environment'];
    if(useRedirect.includes(err.code)){
      auth.signInWithRedirect(provider).catch(e=>showToast('เข้าสู่ระบบไม่ได้: '+e.message));
    } else {
      showToast('เข้าสู่ระบบไม่ได้: '+err.message);
    }
  });
}
function signOut(){
  logEvent('logout');
  auth?.signOut().then(()=>{
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    $('screen-login')?.classList.add('active');
  });
}
function checkDeepLink(){
  const r=new URLSearchParams(location.search).get('room');
  if(!r)return;
  const code=r.toUpperCase().slice(0,6);
  // ล้าง URL ออกก่อนเลย ไม่ให้ค้างไว้
  history.replaceState(null,'',location.pathname);
  if(!firebaseReady){
    // รอ Firebase พร้อมก่อน
    const wait=setInterval(()=>{
      if(firebaseReady){clearInterval(wait);_deepLinkJoin(code);}
    },300);
    setTimeout(()=>clearInterval(wait),8000);
    return;
  }
  _deepLinkJoin(code);
}
function _deepLinkJoin(code){
  // เช็คก่อนว่าห้องยังมีอยู่
  db.ref('rooms/'+code).once('value').then(snap=>{
    if(!snap.exists()){showToast('❌ ห้อง "'+code+'" ไม่มีแล้ว');return;}
    S.pendingRoomCode=code;S.isHost=false;
    const lb=$('nickRoomLabel');if(lb)lb.textContent='ห้อง: '+code;
    const bb=$('nickBackBtn');if(bb)bb.setAttribute('onclick','showScreen("screen-home")');
    const ni=$('nickInput');if(ni)ni.value='';
    showScreen('screen-nick');
  }).catch(()=>showToast('เชื่อมต่อไม่ได้ ลองใหม่'));
}

