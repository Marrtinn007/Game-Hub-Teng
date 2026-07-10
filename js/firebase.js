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
  // ── 🐯 ฝ่ายสมิง ──
  werewolf:    {name:'เสือสมิง',           en:'Suea Sming',        e:'🐯', team:'evil', tl:'🐯 ฝ่ายสมิง',    pts:-6, max:8,
    short:'ทุกคืนตื่นพร้อมพวกสมิง เลือกสังหารผู้เล่น 1 คน',
    desc:'ทุกคืนตื่นพร้อมพวกสมิง เลือกสังหารผู้เล่น 1 คน'},
  wolfcub:     {name:'ลูกสมิง',            en:'Sming Cub',         e:'🐾', team:'evil', tl:'🐯 ฝ่ายสมิง',    pts:-8, max:2,
    short:'สมิงปกติ หากถูกกำจัด คืนถัดไปฝ่ายสมิงสังหารได้ 2 คน',
    desc:'สมิงปกติ หากถูกกำจัด คืนถัดไปฝ่ายสมิงสังหารได้ 2 คน'},
  lonewolf:    {name:'สมิงเดียวดาย',      en:'Lone Sming',        e:'🐯🗡️',team:'evil', tl:'🐯 ฝ่ายสมิง',    pts:-5, max:1,
    short:'ร่วมเล่นกับฝ่ายสมิง แต่ชนะได้ต่อเมื่อเป็นผู้รอดชีวิตคนสุดท้าย',
    desc:'ร่วมเล่นกับฝ่ายสมิง แต่ชนะได้ต่อเมื่อเป็นผู้รอดชีวิตคนสุดท้าย'},
  minion:      {name:'สาวกสมิง',          en:'Sming Disciple',    e:'🧟', team:'evil', tl:'🐯 ฝ่ายสมิง',    pts:-6, max:1,
    short:'รู้ตัวสมิงทั้งหมดตั้งแต่คืนแรก แต่ไม่มีส่วนร่วมในการสังหาร',
    desc:'รู้ตัวสมิงทั้งหมดตั้งแต่คืนแรก แต่ไม่มีส่วนร่วมในการสังหาร'},
  sorcerer:    {name:'หมอคุณไสย',         en:'Black Magic Doctor',e:'🔯', team:'evil', tl:'🐯 ฝ่ายสมิง',    pts:-3, max:1,
    short:'ทุกคืนตรวจสอบผู้เล่น 1 คนว่าคือหมอธรรมหรือไม่',
    desc:'ทุกคืนตรวจสอบผู้เล่น 1 คนว่าคือหมอธรรมหรือไม่'},
  alphawolf:   {name:'จ้าวสมิง',          en:'Sming Lord',        e:'🐯👑',team:'evil', tl:'🐯 ฝ่ายสมิง',    pts:-9, max:1,
    short:'หากสมิงถูกกำจัดกลางวัน ใช้พลัง 1 ครั้ง เปลี่ยนเหยื่อให้กลายเป็นสมิงแทนการตาย',
    desc:'หากสมิงถูกกำจัดกลางวัน ใช้พลัง 1 ครั้ง เปลี่ยนเหยื่อให้กลายเป็นสมิงแทนการตาย'},
  cursed:      {name:'ผู้ต้องอาถรรพ์',    en:'The Cursed One',    e:'😰', team:'evil', tl:'🐯 ฝ่ายสมิง',    pts:-3, max:1,
    short:'เริ่มเป็นชาวบ้าน หากถูกสมิงเลือกสังหาร จะไม่ตายและกลายเป็นสมิงแทน',
    desc:'เริ่มเป็นชาวบ้าน หากถูกสมิงเลือกสังหาร จะไม่ตายและกลายเป็นสมิงแทน'},
  // ── 🏡 ฝ่ายชาวบ้าน (เรียงนิยม) ──
  villager:    {name:'ชาวบ้าน',           en:'Villager',          e:'👨‍🌾',team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+1, max:99,
    short:'ไม่มีพลังพิเศษ ใช้การวิเคราะห์และโหวตช่วยฝ่ายตน',
    desc:'ไม่มีพลังพิเศษ ใช้การวิเคราะห์และโหวตช่วยฝ่ายตน'},
  seer:        {name:'หมอธรรม',           en:'Ghost Doctor',      e:'🔮', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+7, max:1,
    short:'ทุกคืนตรวจสอบผู้เล่น 1 คนว่าเป็นสมิงหรือไม่',
    desc:'ทุกคืนตรวจสอบผู้เล่น 1 คนว่าเป็นสมิงหรือไม่'},
  bodyguard:   {name:'ผู้พิทักษ์',        en:'Guardian',          e:'🛡️', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:1,
    short:'ทุกคืนเลือกคุ้มครองผู้เล่น 1 คน ไม่ให้ถูกสังหารคืนนั้น',
    desc:'ทุกคืนเลือกคุ้มครองผู้เล่น 1 คน ไม่ให้ถูกสังหารคืนนั้น'},
  hunter:      {name:'นายพราน',          en:'Hunter',            e:'🏹', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:2,
    short:'หากถูกกำจัด เลือกผู้เล่น 1 คนตายตามได้ทันที',
    desc:'หากถูกกำจัด เลือกผู้เล่น 1 คนตายตามได้ทันที'},
  witch:       {name:'หมอยา',             en:'Herbal Healer',     e:'🧙‍♀️',team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+4, max:1,
    short:'มียาช่วยชีวิต 1 ครั้ง และยาพิษ 1 ครั้ง ใช้ได้อย่างละหนึ่งครั้งตลอดเกม',
    desc:'มียาช่วยชีวิต 1 ครั้ง และยาพิษ 1 ครั้ง ใช้ได้อย่างละหนึ่งครั้งตลอดเกม'},
  prince:      {name:'ผู้ใหญ่บ้าน',      en:'Village Elder',     e:'👑', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:1,
    short:'หากถูกโหวตกำจัดครั้งแรก รอดชีวิตแต่ต้องเปิดเผยบทบาท',
    desc:'หากถูกโหวตกำจัดครั้งแรก รอดชีวิตแต่ต้องเปิดเผยบทบาท'},
  cupid:       {name:'หมอเสน่ห์',        en:'Charm Doctor',      e:'💘', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:-3, max:1,
    short:'คืนแรกเลือกผู้เล่น 2 คนเป็นคู่ผูกดวง หากคนหนึ่งตาย อีกคนตายตาม',
    desc:'คืนแรกเลือกผู้เล่น 2 คนเป็นคู่ผูกดวง หากคนหนึ่งตาย อีกคนตายตาม'},
  mason:       {name:'สหายร่วมสาบาน',    en:'Sworn Brethren',    e:'🤝', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+2, max:4,
    short:'รู้จักกันเองตั้งแต่คืนแรก รู้ว่าใครอยู่ฝ่ายเดียวกัน',
    desc:'รู้จักกันเองตั้งแต่คืนแรก รู้ว่าใครอยู่ฝ่ายเดียวกัน'},
  spellcaster: {name:'หมอสะกด',          en:'Hypnotist Doctor',  e:'✨', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+1, max:1,
    short:'ทุกคืนเลือกผู้เล่น 1 คน วันรุ่งขึ้นพูดไม่ได้และโหวตไม่ได้',
    desc:'ทุกคืนเลือกผู้เล่น 1 คน วันรุ่งขึ้นพูดไม่ได้และโหวตไม่ได้'},
  auraseer:    {name:'ผู้เห็นเงา',        en:'Shadow Watcher',    e:'👁️', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:1,
    short:'ทุกคืนตรวจสอบผู้เล่น 1 คน รู้ว่าเป็นบทบาทพิเศษหรือธรรมดา',
    desc:'ทุกคืนตรวจสอบผู้เล่น 1 คน รู้ว่าเป็นบทบาทพิเศษหรือธรรมดา'},
  apprenticeseer:{name:'ศิษย์หมอธรรม',   en:"Ghost Doctor's Apprentice",e:'🌟', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+4, max:1,
    short:'หากหมอธรรมตาย จะกลายเป็นหมอธรรมทันที',
    desc:'หากหมอธรรมตาย จะกลายเป็นหมอธรรมทันที'},
  priest:      {name:'พระธุดงค์',        en:'Wandering Monk',    e:'⛪', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:1,
    short:'ใช้พลังได้ 1 ครั้งตลอดเกม เลือกคืนคุ้มครองทั้งหมู่บ้าน สมิงสังหารไม่สำเร็จ',
    desc:'ใช้พลังได้ 1 ครั้งตลอดเกม เลือกคืนคุ้มครองทั้งหมู่บ้าน สมิงสังหารไม่สำเร็จ'},
  troublemaker:{name:'นักยุ',             en:'Instigator',        e:'😈', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:-3, max:1,
    short:'ใช้พลังได้ 1 ครั้ง ทำให้วันรุ่งขึ้นต้องโหวตกำจัด 2 คน',
    desc:'ใช้พลังได้ 1 ครั้ง ทำให้วันรุ่งขึ้นต้องโหวตกำจัด 2 คน'},
  pi:          {name:'นักสืบ',           en:'P.I.',              e:'🕵️', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:1,
    short:'ใช้พลังได้ 1 ครั้ง ตรวจสอบผู้เล่น 1 คนและข้างเคียงว่ามีสมิงหรือไม่',
    desc:'ใช้พลังได้ 1 ครั้ง ตรวจสอบผู้เล่น 1 คนและข้างเคียงว่ามีสมิงหรือไม่'},
  oldhag:      {name:'หมอเฒ่า',          en:'Old Healer',        e:'👴', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+1, max:1,
    short:'ทุกคืนไล่ผู้เล่น 1 คนออกชั่วคราว วันรุ่งขึ้นพูด/โหวต/ถูกสังหารไม่ได้',
    desc:'ทุกคืนไล่ผู้เล่น 1 คนออกชั่วคราว วันรุ่งขึ้นพูด/โหวต/ถูกสังหารไม่ได้'},
  toughguy:    {name:'คนอึด',            en:'The Resilient',     e:'💪', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:1,
    short:'หากถูกสมิงสังหาร ไม่ตายทันที อยู่ได้ถึงเช้าวันถัดไป',
    desc:'หากถูกสมิงสังหาร ไม่ตายทันที อยู่ได้ถึงเช้าวันถัดไป'},
  lycan:       {name:'ลูกครึ่งสมิง',    en:'Half-Sming',        e:'🧬', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:-1, max:1,
    short:'อยู่ฝ่ายชาวบ้าน แต่หมอธรรมจะมองเห็นเป็นสมิง',
    desc:'อยู่ฝ่ายชาวบ้าน แต่หมอธรรมจะมองเห็นเป็นสมิง'},
  diseased:    {name:'ผู้มีเลือดพิษ',    en:'Tainted Blood',     e:'🤒', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:1,
    short:'หากถูกสมิงสังหาร คืนถัดไปฝ่ายสมิงสังหารใครไม่ได้เลย',
    desc:'หากถูกสมิงสังหาร คืนถัดไปฝ่ายสมิงสังหารใครไม่ได้เลย'},
  mystic:      {name:'ผู้รู้แจ้ง',       en:'The Enlightened',   e:'🌠', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+9, max:1,
    short:'ทุกคืนตรวจสอบผู้เล่น 1 คน รู้บทบาทที่แท้จริง',
    desc:'ทุกคืนตรวจสอบผู้เล่น 1 คน รู้บทบาทที่แท้จริง'},
  mentalist:   {name:'นักสะกดจิต',      en:'Mentalist',         e:'🧠', team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+6, max:1,
    short:'ทุกคืนเลือกผู้เล่น 2 คน ตรวจสอบว่าอยู่ฝ่ายเดียวกันหรือไม่',
    desc:'ทุกคืนเลือกผู้เล่น 2 คน ตรวจสอบว่าอยู่ฝ่ายเดียวกันหรือไม่'},
  huntress:    {name:'พรานหญิง',        en:'Huntress',          e:'🏹🎀',team:'good', tl:'🏡 ฝ่ายชาวบ้าน',   pts:+3, max:1,
    short:'ใช้พลังได้ 1 ครั้ง สังหารผู้เล่น 1 คนในเวลากลางคืน',
    desc:'ใช้พลังได้ 1 ครั้ง สังหารผู้เล่น 1 คนในเวลากลางคืน'},
  // ── ⚖️ ฝ่ายอิสระ ──
  tanner:      {name:'คนบ้า',           en:'Tanner',            e:'🤪', team:'solo', tl:'⚖️ ฝ่ายอิสระ', pts:-2, max:1,
    short:'ชนะทันทีหากถูกโหวตกำจัดกลางวัน',
    desc:'ชนะทันทีหากถูกโหวตกำจัดกลางวัน'},
  vampire:     {name:'กระสือ',           en:'Krasue',            e:'🔥', team:'solo', tl:'⚖️ ฝ่ายอิสระ', pts:-7, max:1,
    short:'ทุกคืนเลือกผู้เล่น 1 คนเป็นเหยื่อคำสาป ถ้าถูกเสนอชื่อโหวตวันถัดไปจะตาย',
    desc:'ทุกคืนเลือกผู้เล่น 1 คนเป็นเหยื่อคำสาป ถ้าถูกเสนอชื่อโหวตวันถัดไปจะตาย'},
  cultleader:  {name:'เจ้าลัทธิ',       en:'Cult Leader',       e:'🕯️', team:'solo', tl:'⚖️ ฝ่ายอิสระ', pts:+1, max:1,
    short:'ทุกคืนชักชวนผู้เล่นเข้าลัทธิ ชนะเมื่อผู้เล่นที่เหลือทั้งหมดอยู่ในลัทธิ',
    desc:'ทุกคืนชักชวนผู้เล่นเข้าลัทธิ ชนะเมื่อผู้เล่นที่เหลือทั้งหมดอยู่ในลัทธิ'},
  hoodlum:     {name:'อันธพาล',         en:'Hoodlum',           e:'🦹', team:'solo', tl:'⚖️ ฝ่ายอิสระ', pts:0,  max:1,
    short:'คืนแรกเลือกเป้าหมาย 2 คน ชนะเมื่อเป้าหมายทั้งคู่ตายและตัวเองยังรอด',
    desc:'คืนแรกเลือกเป้าหมาย 2 คน ชนะเมื่อเป้าหมายทั้งคู่ตายและตัวเองยังรอด'},
  revealer:    {name:'ผู้เผยตัวตน',     en:'Revealer',          e:'🔦', team:'solo', tl:'⚖️ ฝ่ายอิสระ', pts:+4, max:1,
    short:'ทุกคืนเลือกผู้เล่น 1 คน ถ้าเป็นสมิงตายทันที ถ้าไม่ใช่ผู้เปิดโปงตายแทน',
    desc:'ทุกคืนเลือกผู้เล่น 1 คน ถ้าเป็นสมิงตายทันที ถ้าไม่ใช่ผู้เปิดโปงตายแทน'},
  madbomber:   {name:'มือระเบิด',        en:'Mad Bomber',        e:'💣', team:'solo', tl:'⚖️ ฝ่ายอิสระ', pts:-2, max:1,
    short:'หากถูกกำจัด ผู้เล่นซ้ายและขวาตายตามทันที',
    desc:'หากถูกกำจัด ผู้เล่นซ้ายและขวาตายตามทันที'},
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
  }).catch(e=>{_isAdminCached=false;logError('load_admin_status',e);});
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
      const av=$('homeUserAvatar'),nm=$('homeUserName'),hb=$('homeHeroBadge');
      const dn=$('profileDropName'),de=$('profileDropEmail'),da=$('profileDropAvatar'),ab=$('adminMenuBtn');
      if(av&&user.photoURL){av.src=user.photoURL;av.style.display='';}
      if(da&&user.photoURL){da.src=user.photoURL;}
      const greet=randomGreeting();
      if(nm)nm.textContent=greet.text+', '+(user.displayName?.split(' ')[0]||'ผู้เล่น');
      if(hb)hb.textContent=greet.e;
      if(dn)dn.textContent=user.displayName||user.email||'';
      if(de)de.textContent=user.email||'';
      if(ab)ab.style.display=isAdmin()?'':'none';
      _loadAdminStatus(user.uid);
      $('screen-login')?.classList.remove('active');
      const cur=document.querySelector('.screen.active');
      if(!cur||cur.id==='screen-login')showScreen('screen-home');
      checkDeepLink();
      // หลังล็อคอินใหม่ (เช่น เปิดเครื่องใหม่) ให้ตรวจว่าบัญชีนี้ยังอยู่ในห้องไหนอยู่ไหม
      if(firebaseReady&&!new URLSearchParams(location.search).get('room'))restoreSessionRoom(user.uid);
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
    ref.update({sid:S.sessionId,ts:Date.now(),displayName:_u?.displayName||null,email:_u?.email||null,photo:_u?.photoURL||null}).catch(e=>logError('session_guard_update',e));
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
  }).catch(e=>{
    logError('session_guard_read',e);
    // fallback: ถ้าอ่าน once ไม่ได้ ก็ listen ตรงๆ เลย
    const _u=firebase.auth().currentUser;
    ref.update({sid:S.sessionId,ts:Date.now(),displayName:_u?.displayName||null,email:_u?.email||null,photo:_u?.photoURL||null}).catch(e=>logError('session_guard_update',e));
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
    db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}`).remove().catch(e=>logError('force_kick_remove_player',e));
    if(currentUser?.uid)db.ref('userSessions/'+currentUser.uid+'/activeRoom').remove().catch(e=>logError('force_kick_clear_session',e));
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
    db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}`).remove().catch(e=>logError('force_logout_remove_player',e));
    if(currentUser?.uid)db.ref('userSessions/'+currentUser.uid+'/activeRoom').remove().catch(e=>logError('force_logout_clear_session',e));
  }
  [roomRef,gameRef,wwRef].forEach(r=>r?.off());
  roomRef=gameRef=wwRef=null;
  db.ref('.info/connected').off();
  Object.assign(S,{roomCode:null,myPlayerId:null,selectedGame:null,players:[],roomName:null,isHost:false,nickname:null});
  showToast('🔒 ผู้ดูแลระบบบังคับออกจากระบบ');
  setTimeout(()=>auth&&auth.signOut(),600);
}
/* ══ AUTO-REJOIN ข้ามเครื่อง/อุปกรณ์: ปิดไว้ ══════════════════
   เครื่องใหม่ที่ login เข้ามาจะต้องกรอก room code เองถ้าจะเข้าห้อง
   เครื่องเก่าจะถูก signOut และลบออกจากห้องอัตโนมัติ              */
function checkRejoinRoom(uid){
  // ล้าง activeRoom ที่ค้างอยู่ออก เผื่อเครื่องเก่า crash ไม่ได้ลบ
  if(db&&uid)db.ref('userSessions/'+uid+'/activeRoom').remove().catch(e=>logError('check_rejoin_clear_session',e));
}
/* ══ RESTORE SESSION ROOM: เฉพาะกดรีเฟรชแท็บเดิม ═══════════════
   ใช้ sessionStorage (หายเมื่อปิดแท็บจริงๆ แต่รอดตอนกด refresh)
   เพื่อพากลับเข้าห้อง/หน้าเดิมโดยไม่กระทบกับ auto-rejoin ข้ามเครื่องที่ปิดไว้ */
function restoreSessionRoom(uid){
  let saved=null;
  try{saved=JSON.parse(sessionStorage.getItem('wp_session_room')||'null');}catch(e){}
  if(!saved||!saved.code){checkRejoinRoom(uid);return;}
  const ov=$('connectingOverlay'),rn=$('connectingRoomName');
  _rejoinInProgress=true;
  if(rn)rn.textContent='วง · '+saved.code;
  if(ov)ov.style.display='flex';
  db.ref('rooms/'+saved.code).once('value').then(snap=>{
    if(!snap.exists()){
      clearSessionRoom();_rejoinInProgress=false;if(ov)ov.style.display='none';
      checkRejoinRoom(uid);
      return;
    }
    // ไม่ใช้ saved.isHost ตรงๆ — ปล่อยให้ enterLobby() อ่านค่าจริงจาก Firebase (old.isHost)
    // กันไม่ให้เกิด isHost:true ซ้ำ 2 node ถ้าห้องโอน host ไปแล้วระหว่างที่แท็บนี้หลุด
    S.roomCode=saved.code;S.nickname=saved.nick||S.nickname||currentUser?.displayName||'ผู้เล่น';S.isHost=false;
    enterLobby();
  }).catch(()=>{_rejoinInProgress=false;if(ov)ov.style.display='none';});
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
    if(!snap.exists()){showToast('❌ วง "'+code+'" ไม่มีแล้ว');return;}
    S.pendingRoomCode=code;S.isHost=false;
    const lb=$('nickRoomLabel');if(lb)lb.textContent='วง: '+code;
    const bb=$('nickBackBtn');if(bb)bb.setAttribute('onclick','showScreen("screen-home")');
    const ni=$('nickInput');if(ni)ni.value='';
    showScreen('screen-nick');
  }).catch(()=>showToast('เชื่อมต่อไม่ได้ ลองใหม่'));
}

