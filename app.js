/* ══ CONFIG ══════════════════════════════ */
const CONFIG={
  firebase:{apiKey:"YOUR_FIREBASE_API_KEY",authDomain:"YOUR_PROJECT_ID.firebaseapp.com",databaseURL:"https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"YOUR_PROJECT_ID",storageBucket:"YOUR_PROJECT_ID.appspot.com",messagingSenderId:"YOUR_SENDER_ID",appId:"YOUR_APP_ID"},
  workerURL:"https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev",
};

/* ══ FIREBASE ════════════════════════════ */
let db=null,firebaseReady=false,roomRef=null,gameRef=null,wwRef=null,settingsRef=null;
function initFirebase(){
  try{if(!CONFIG.firebase.apiKey.includes('YOUR_')){firebase.initializeApp(CONFIG.firebase);db=firebase.database();firebaseReady=true;}}
  catch(e){console.warn('Firebase:',e.message)}
}

/* ══ DEFAULT SETTINGS ════════════════════ */
const DEFAULT_SETTINGS={
  voiceEnabled:true,
  voiceVolume:1.0,
  nightActionTime:20,
  discussTime:120,
  voteTime:60,
  voicePauseTime:3,
  bodyguardSelfProtect:true,
  cupidLoverDie:true,
  silencerEveryNight:true,
};
let SETTINGS={...DEFAULT_SETTINGS};

/* ══ STATE ═══════════════════════════════ */
const S={
  roomCode:null,nickname:null,isHost:false,myPlayerId:null,
  players:[],selectedGame:null,pendingRoomCode:null,paused:false,
  todDiff:'easy',todIdx:0,todRound:1,todLoading:false,
  wheelItems:[],wheelSpinning:false,wheelAngle:0,
  cardDeck:[],cardIdx:0,
  wwPlayerCount:5,
  wwRoleCounts:{werewolf:1,seer:1,bodyguard:1,silencer:0,cupid:0,tanner:0,hunter:0,prince:0,halfwolf:0,juniorwolf:0},
  wwPhase:'setup',
  wwAssigned:{},wwAlive:{},wwNightNum:0,
  wwCupidCouple:[],wwLastProtected:null,wwPrinceUsed:false,
  wwHunterDead:null,wwJuniorBonus:false,
  wwSilenced:null,wwLastSilencedBy:null,
  wwVotes:{},wwNightActions:{},wwEventLog:[],
  wwMyRole:null,wwFlipped:{},
  myWord:null,myWordVisible:false,
};

/* ══ DATA ════════════════════════════════ */
const WW={
  werewolf:  {name:'หมาป่า',         e:'🐺',team:'evil',tl:'หมาป่า 🔴',  max:8, desc:'กลางคืน: เลือกฆ่าชาวบ้าน 1 คน อย่าให้ใครรู้ตัว'},
  seer:      {name:'เทพพยากรณ์',    e:'🔮',team:'good',tl:'ฝ่ายดี ✅',  max:1, desc:'คืนละ 1 คน — ส่องว่าเป็นฝ่ายดีหรือเลว'},
  bodyguard: {name:'บอดี้การ์ด',    e:'🛡️',team:'good',tl:'ฝ่ายดี ✅',  max:1, desc:'คืนละ 1 คน — ปกป้องจากหมาป่า ปกป้องคนเดิมซ้ำ 2 คืนติดไม่ได้'},
  silencer:  {name:'ผู้ต้องสาป',    e:'🤫',team:'good',tl:'ฝ่ายดี ✅',  max:1, desc:'กลางคืน: สาปคน 1 คน — รุ่งเช้าคนนั้นพูดไม่ได้ทั้งวัน'},
  cupid:     {name:'กามเทพ',         e:'💘',team:'good',tl:'ฝ่ายดี ✅',  max:1, desc:'คืนแรก: เลือกคู่รัก 2 คน — ถ้าคนหนึ่งตายอีกคนตายตาม'},
  tanner:    {name:'คนบ้า',          e:'🤪',team:'solo',tl:'โดดเดี่ยว ⚡',max:1,desc:'อยากถูกโหวตประหาร — ถ้าโดนโหวตออก ชนะทันที!'},
  hunter:    {name:'นายพราน',       e:'🏹',team:'good',tl:'ฝ่ายดี ✅',  max:1, desc:'ถ้าถูกฆ่าตาย กดเลือกยิงคนอื่นตายตามได้ 1 คน'},
  prince:    {name:'เจ้าชาย',       e:'👑',team:'good',tl:'ฝ่ายดี ✅',  max:1, desc:'โดนโหวตประหารครั้งแรก — รอดและเปิดเผยตัว'},
  halfwolf:  {name:'ลูกครึ่งหมาป่า',e:'🧬',team:'good',tl:'ฝ่ายดี ✅',  max:1, desc:'ฝ่ายชาวบ้าน แต่ Seer ส่องเห็นเป็นคนเลว'},
  juniorwolf:{name:'ลูกหมาป่า',     e:'🐾',team:'evil',tl:'หมาป่า 🔴', max:2, desc:'ถูกโหวตออก → หมาป่าฆ่าเพิ่มได้อีก 1 คืนถัดไป'},
  villager:  {name:'ชาวบ้าน',       e:'👨‍🌾',team:'good',tl:'ฝ่ายดี ✅', max:99,desc:'ช่วยกันโหวตหาหมาป่า'},
};
const ROLE_ORDER=['werewolf','juniorwolf','halfwolf','seer','bodyguard','silencer','cupid','hunter','prince','tanner'];
// Night action order
const NIGHT_ORDER=['cupid','werewolf','juniorwolf','seer','bodyguard','silencer','hunter'];

const CARDS={A:{r:'โดนคนเดียว',d:'คนจั่วรับ penalty คนเดียว'},2:{r:'หาเพื่อนโดนด้วย 1 คน',d:'เลือกคน 1 คนมาโดนด้วยกัน'},3:{r:'หาเพื่อนโดนด้วย 2 คน',d:'เลือกคน 2 คนมาโดนด้วยกัน'},4:{r:'เพื่อนฝั่งซ้ายโดน',d:'คนนั่งซ้ายมือของคนจั่วโดน'},5:{r:'ห้าเฮฮา — ทุกคนโดน! 🎉',d:'ทุกคนในวงโดนพร้อมกัน'},6:{r:'เพื่อนฝั่งขวาโดน',d:'คนนั่งขวามือของคนจั่วโดน'},7:{r:'ดวลปอด 🫁',d:'ลากเสียงยาวสุดลม ใครหยุดก่อน = โดน\nจั่ว 7 ซ้ำ → คนแพ้เป็นบัดดี้'},8:{r:'Relax — ปลอดภัย 😌',d:'คนจั่วไม่โดนอะไรรอบนี้'},9:{r:'คิดเกมเอง 🧠',d:'คนจั่วคิดมินิเกมให้วงเล่น — ใครแพ้โดน'},10:{r:'เลอะ 💥',d:'แป้งโปะหน้า'},J:{r:'จับหน้า 👋',d:'ทุกคนรีบจับหน้าตัวเอง — คนสุดท้ายโดน'},Q:{r:'แหม่มเพื่อนไม่คบ 👸',d:'ห้ามคุยหรือตอบแหม่ม (คนที่จั่ว Q)\nใครพลาดโดน'},K:{r:'กำหนดกฎ 👑',d:'ตั้งกฎใหม่ได้ 1 อย่าง และกำหนด K ต่อไป'}};

const COLORS=['#7c9cff','#5ecfb0','#c084fc','#e05c5c','#d4a857','#4da6ff','#52b788','#b06ef3'];
const FALLBACK_WORDS=[['สิงโต','เสือ','หมี','กวาง','หมาป่า'],['ข้าว','ก๋วยเตี๋ยว','ส้มตำ','ต้มยำ','แกงเขียวหวาน'],['ดำ','แดง','เขียว','เหลือง','ฟ้า'],['กรุงเทพ','เชียงใหม่','ภูเก็ต','ขอนแก่น','หาดใหญ่']];

/* ══ UTILS ═══════════════════════════════ */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));const el=$(id);if(el){el.classList.add('active');el.scrollTop=0;}}
function getPlayers(){return S.players.length?S.players:[{id:'demo',name:S.nickname||'ผู้เล่น 1',isHost:true}]}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=0|Math.random()*(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function genCode(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=c[0|Math.random()*c.length];return s}
function totalRoles(){return Object.values(S.wwRoleCounts).reduce((a,b)=>a+b,0)}
function myId(){return S.myPlayerId||'demo'}
function isAlive(pid){return S.wwAlive[pid]!==false}
function getAlivePlayers(){return getPlayers().filter(p=>isAlive(p.id))}
function playerName(pid){return getPlayers().find(p=>p.id===pid)?.name||'?'}
function playerIndex(pid){return getPlayers().findIndex(p=>p.id===pid)}

let _t;
function showToast(msg,dur=2600){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(_t);_t=setTimeout(()=>t.classList.remove('show'),dur)}
function openModal(id){$(id)?.classList.add('open')}
function closeModal(id){$(id)?.classList.remove('open')}
function closeModalOutside(e,id){if(e.target.id===id)closeModal(id)}

/* ══ WEB SPEECH TTS ══════════════════════ */
let ttsQueue=[];let ttsSpeaking=false;
function speak(text,onDone){
  if(!SETTINGS.voiceEnabled){onDone?.();return}
  const u=new SpeechSynthesisUtterance(text);
  u.lang='th-TH';u.volume=SETTINGS.voiceVolume;u.rate=0.92;
  u.onend=()=>{onDone?.()};
  u.onerror=()=>{onDone?.()};
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
function speakSequence(lines,onAllDone){
  // lines = [{text, pauseAfter}]
  let i=0;
  function next(){
    if(i>=lines.length){onAllDone?.();return}
    const line=lines[i++];
    speak(line.text,()=>{
      const pause=(line.pauseAfter??SETTINGS.voicePauseTime)*1000;
      setTimeout(next,pause);
    });
  }
  next();
}

/* ══ COUNTDOWN TIMER ═════════════════════ */
let countdownInterval=null;
function startCountdown(elId,seconds,onDone){
  clearInterval(countdownInterval);
  const el=$(elId);if(!el)return;
  let t=seconds;el.textContent=t;
  countdownInterval=setInterval(()=>{
    t--;el.textContent=t;
    if(t<=0){clearInterval(countdownInterval);onDone?.();}
  },1000);
}
function stopCountdown(){clearInterval(countdownInterval)}

/* ══ ROOM ════════════════════════════════ */
function showCreateRoom(){S.pendingRoomCode=genCode();S.isHost=true;const e=$('nickRoomLabel');if(e)e.textContent=`ห้องใหม่: ${S.pendingRoomCode}`;const i=$('nickInput');if(i)i.value='';showScreen('screen-nick')}
function joinRoom(){const i=$('joinCodeInput'),code=i?i.value.trim().toUpperCase():'';if(code.length<4){showToast('ใส่รหัสห้องด้วยนะ');return}S.pendingRoomCode=code;S.isHost=false;const lb=$('nickRoomLabel');if(lb)lb.textContent=`ห้อง: ${code}`;const ni=$('nickInput');if(ni)ni.value='';showScreen('screen-nick')}
function confirmNick(){const i=$('nickInput'),nick=i?i.value.trim():'';if(!nick){showToast('ใส่ชื่อด้วยนะ');return}if(nick.length>12){showToast('ชื่อยาวเกินไป');return}S.nickname=nick;S.roomCode=S.pendingRoomCode;enterLobby()}
function enterLobby(){
  const ce=$('lobbyCode'),se=$('shareCode');
  if(ce)ce.textContent=`ห้อง: ${S.roomCode}`;if(se)se.textContent=S.roomCode;
  if(firebaseReady){
    if(roomRef)roomRef.off();if(gameRef)gameRef.off();if(wwRef)wwRef.off();if(settingsRef)settingsRef.off();
    roomRef=db.ref(`rooms/${S.roomCode}/players`);
    const pushed=roomRef.push({name:S.nickname,isHost:S.isHost,joinedAt:Date.now()});
    S.myPlayerId=pushed.key;
    roomRef.on('value',snap=>{S.players=[];snap.forEach(c=>S.players.push({id:c.key,...c.val()}));renderPlayers()});
    gameRef=db.ref(`rooms/${S.roomCode}/game`);
    gameRef.on('value',snap=>{const g=snap.val();if(g&&g.started&&g.type){selectGame(g.type,false);launchGame(g.type);}});
    wwRef=db.ref(`rooms/${S.roomCode}/ww`);
    wwRef.on('value',snap=>{const d=snap.val();if(d)syncWWState(d);});
    settingsRef=db.ref(`rooms/${S.roomCode}/settings`);
    settingsRef.on('value',snap=>{const d=snap.val();if(d)SETTINGS={...DEFAULT_SETTINGS,...d};});
  }else{S.players=[{id:'demo',name:S.nickname,isHost:true}];renderPlayers();showToast('⚠ Demo mode')}
  showScreen('screen-lobby');
}
function renderPlayers(){
  const list=$('playersList'),cnt=$('playerCount');if(!list)return;
  if(cnt)cnt.textContent=S.players.length;
  list.innerHTML=S.players.map((p,i)=>`<div class="player-row card"><div class="player-avatar" style="background:${COLORS[i%COLORS.length]}22;color:${COLORS[i%COLORS.length]}">${esc(p.name.charAt(0).toUpperCase())}</div><div class="player-name">${esc(p.name)}</div>${p.isHost?'<div class="player-badge">Host</div>':''}</div>`).join('');
}
function copyRoomLink(){const url=`${location.origin}${location.pathname}?room=${S.roomCode}`;navigator.clipboard?.writeText(url).then(()=>showToast('📋 คัดลอกลิงก์แล้ว!'))}
function leaveRoom(){
  if(firebaseReady&&S.myPlayerId&&S.roomCode)db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}`).remove();
  if(roomRef){roomRef.off();roomRef=null}if(gameRef){gameRef.off();gameRef=null}if(wwRef){wwRef.off();wwRef=null}if(settingsRef){settingsRef.off();settingsRef=null}
  Object.assign(S,{roomCode:null,nickname:null,players:[],selectedGame:null});showScreen('screen-home');
}

/* ══ SETTINGS ════════════════════════════ */
function openSettings(){
  const body=$('settingsBody');if(!body)return;
  const isHost=S.isHost;
  body.innerHTML=`
    <div class="settings-section">
      <div class="settings-label">🔊 เสียง</div>
      <div class="settings-row">
        <span>เสียง AI พูด</span>
        <label class="toggle"><input type="checkbox" id="sv-voice" ${SETTINGS.voiceEnabled?'checked':''} ${!isHost?'disabled':''}><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <span>ระดับเสียง</span>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="range" id="sv-vol" min="0" max="1" step="0.1" value="${SETTINGS.voiceVolume}" style="width:100px" ${!isHost?'disabled':''}>
          <span id="sv-vol-label" style="font-size:12px;color:var(--t2)">${Math.round(SETTINGS.voiceVolume*100)}%</span>
        </div>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-label">⏱ เวลา (วินาที)</div>
      ${[['nightActionTime','Night Action',5,60],['discussTime','ถกกลางวัน',30,300],['voteTime','โหวต',30,120],['voicePauseTime','เว้นระหว่างพูด',1,8]].map(([k,label,min,max])=>`
      <div class="settings-row">
        <span>${label}</span>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="settings-step-btn" onclick="stepSetting('${k}',-5)" ${!isHost?'disabled':''}>−</button>
          <span id="sv-${k}" style="min-width:32px;text-align:center;font-weight:700">${SETTINGS[k]}</span>
          <button class="settings-step-btn" onclick="stepSetting('${k}',5)" ${!isHost?'disabled':''}>+</button>
        </div>
      </div>`).join('')}
    </div>
    <div class="settings-section">
      <div class="settings-label">🎮 กฎเกม</div>
      <div class="settings-row">
        <span>บอดี้การ์ดปกป้องตัวเองได้</span>
        <label class="toggle"><input type="checkbox" id="sv-bg" ${SETTINGS.bodyguardSelfProtect?'checked':''} ${!isHost?'disabled':''}><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <span>คู่รัก Cupid ตายตามกัน</span>
        <label class="toggle"><input type="checkbox" id="sv-cupid" ${SETTINGS.cupidLoverDie?'checked':''} ${!isHost?'disabled':''}><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <span>ผู้ต้องสาปใช้ได้ทุกคืน</span>
        <label class="toggle"><input type="checkbox" id="sv-sil" ${SETTINGS.silencerEveryNight?'checked':''} ${!isHost?'disabled':''}><span class="toggle-slider"></span></label>
      </div>
    </div>
    ${isHost?`<button class="btn-next btn-accent" style="border-radius:10px;margin-top:0.5rem" onclick="saveSettings()">บันทึก</button>`:'<p style="text-align:center;font-size:12px;color:var(--t2);margin-top:0.5rem">เฉพาะ Host ปรับได้</p>'}`;

  // vol slider live
  const volSlider=$('sv-vol');const volLabel=$('sv-vol-label');
  if(volSlider&&volLabel)volSlider.addEventListener('input',()=>{volLabel.textContent=Math.round(volSlider.value*100)+'%'});

  openModal('modal-settings');
}
function stepSetting(key,delta){
  const limits={nightActionTime:[5,60],discussTime:[30,300],voteTime:[30,120],voicePauseTime:[1,8]};
  const [mn,mx]=limits[key]||[0,999];
  SETTINGS[key]=Math.max(mn,Math.min(mx,SETTINGS[key]+delta));
  const el=$(`sv-${key}`);if(el)el.textContent=SETTINGS[key];
}
function saveSettings(){
  SETTINGS.voiceEnabled=$('sv-voice')?.checked??true;
  SETTINGS.voiceVolume=parseFloat($('sv-vol')?.value||'1');
  SETTINGS.bodyguardSelfProtect=$('sv-bg')?.checked??true;
  SETTINGS.cupidLoverDie=$('sv-cupid')?.checked??true;
  SETTINGS.silencerEveryNight=$('sv-sil')?.checked??true;
  if(firebaseReady&&S.roomCode)db.ref(`rooms/${S.roomCode}/settings`).set(SETTINGS);
  closeModal('modal-settings');
  showToast('บันทึกแล้ว ✓');
}

/* ══ GAME ════════════════════════════════ */
function selectGame(g,ui=true){S.selectedGame=g;if(!ui)return;document.querySelectorAll('.game-select-card').forEach(c=>c.classList.remove('selected'));document.querySelector(`[data-game="${g}"]`)?.classList.add('selected');const b=$('btnStartGame');if(b)b.disabled=false}
function startGame(){if(!S.selectedGame){showToast('เลือกเกมก่อนนะ');return}if(firebaseReady)db.ref(`rooms/${S.roomCode}/game`).set({type:S.selectedGame,started:true,startedAt:Date.now()});else launchGame(S.selectedGame)}
function launchGame(type){const map={tod:'screen-tod',ww:'screen-ww',forbidden:'screen-forbidden',wheel:'screen-wheel',cards:'screen-cards'};if(!map[type])return;initGame(type);showScreen(map[type])}
function backToLobby(){closeNightScreens();stopCountdown();showScreen('screen-lobby')}
function initGame(type){({tod:initTOD,ww:initWW,forbidden:initForbidden,wheel:initWheel,cards:initCards})[type]?.()}
function previewGame(type){
  const info={tod:'<p><b>Truth or Dare</b></p><p>Truth = ตอบคำถามจริงๆ / Dare = ทำภารกิจที่ AI สร้าง</p><p>3 ระดับ: ชิว / กลาง / แซ่บ</p>',ww:'<p><b>Werewolf</b></p><p>เว็บพูดคำสั่งกลางคืน ทุกคนหลับตา แต่ละบทบาทกด action ในมือถือตัวเอง</p><p>ไม่มีผู้คุมเกม — เว็บ resolve ผลให้</p>',forbidden:'<p><b>คำต้องห้าม</b></p><p>กดดูคำบนหัวของตัวเอง — ห้ามพูดคำนั้น</p>',wheel:'<p><b>Spin the Wheel</b></p><p>ใส่ชื่อหรือตัวเลือกได้เอง แล้วปั่น</p>',cards:'<p><b>ไพ่ปาร์ตี้</b></p><p>จั่วไพ่ทีละใบ แต่ละหน้ามีกฎ</p>'};
  const b=$('modalInfoBody');if(b)b.innerHTML=info[type]||'';openModal('modal-info');
}

/* ══ MENU ════════════════════════════════ */
function toggleMenu(){$('menuOverlay')?.classList.toggle('show')}
function closeMenu(){$('menuOverlay')?.classList.remove('show')}
function pauseGame(){closeMenu();S.paused=true;stopCountdown();$('pauseOverlay')?.classList.add('show')}
function resumeGame(){S.paused=false;$('pauseOverlay')?.classList.remove('show')}
function confirmEndGame(){closeMenu();$('confirmOverlay')?.classList.add('show')}
function cancelEnd(){$('confirmOverlay')?.classList.remove('show')}
function doEndGame(){
  $('confirmOverlay')?.classList.remove('show');$('pauseOverlay')?.classList.remove('show');closeNightScreens();stopCountdown();
  if(firebaseReady&&S.roomCode){db.ref(`rooms/${S.roomCode}/game`).remove();db.ref(`rooms/${S.roomCode}/ww`).remove();}
  document.querySelectorAll('.game-select-card').forEach(c=>c.classList.remove('selected'));
  const b=$('btnStartGame');if(b)b.disabled=true;S.selectedGame=null;showScreen('screen-lobby');
}

/* ══ TOD ═════════════════════════════════ */
function initTOD(){S.todIdx=0;S.todRound=1;S.todLoading=false;renderTODPlayer()}
function renderTODPlayer(){const players=getPlayers(),p=players[S.todIdx%players.length];const pn=$('todPlayerName'),rn=$('todRound'),ct=$('todContent'),cb=$('todChoiceBtns'),nb=$('todNextBtn');if(pn)pn.textContent=p.name;if(rn)rn.textContent=S.todRound;if(ct){ct.className='card-content';ct.textContent='เลือก Truth หรือ Dare'}if(cb)cb.style.display='flex';if(nb)nb.style.display='none'}
function setDiff(d,btn){S.todDiff=d;document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));btn?.classList.add('active')}
async function pickTOD(type){
  if(S.todLoading)return;S.todLoading=true;
  const cb=$('todChoiceBtns'),ct=$('todContent'),nb=$('todNextBtn');
  if(cb)cb.style.display='none';if(ct){ct.className='card-content loading';ct.textContent='กำลังคิด...'}
  const dm={easy:'ชิวๆ',mid:'กลางๆ กวนนิดหน่อย',hot:'แซ่บมาก วงสนิท'};
  const result=await callAI(type==='truth'?`สร้างคำถาม Truth or Dare ภาษาไทย ระดับ${dm[S.todDiff]} ตอบแค่คำถามเดียวสั้นๆ`:`สร้างภารกิจ Dare ภาษาไทย ระดับ${dm[S.todDiff]} ตอบแค่ภารกิจเดียวสั้นๆ`);
  if(ct){ct.className='card-content anim-pop';ct.textContent=result}if(nb)nb.style.display='block';S.todLoading=false;
}
function nextTOD(){const players=getPlayers();S.todIdx++;if(S.todIdx%players.length===0)S.todRound++;renderTODPlayer()}

/* ══ WEREWOLF ════════════════════════════ */
function initWW(){
  S.wwPhase='setup';S.wwAssigned={};S.wwAlive={};S.wwNightNum=0;S.wwEventLog=[];
  S.wwCupidCouple=[];S.wwLastProtected=null;S.wwPrinceUsed=false;
  S.wwHunterDead=null;S.wwJuniorBonus=false;S.wwSilenced=null;S.wwLastSilencedBy=null;
  S.wwVotes={};S.wwNightActions={};S.wwMyRole=null;S.wwFlipped={};
  renderWWSetup();
}

/* ── Setup ── */
function renderWWSetup(){
  const pl=$('wwPhaseLabel');if(pl)pl.textContent='ตั้งค่าเกม';
  const body=$('wwBody');if(!body)return;
  const total=totalRoles(),over=total>S.wwPlayerCount;
  body.innerHTML=`
    <div class="section-label">จำนวนผู้เล่น</div>
    <div class="ww-player-count"><button class="ww-count-btn card" onclick="changeWWCount(-1)">−</button><div class="ww-count-num">${S.wwPlayerCount}</div><button class="ww-count-btn card" onclick="changeWWCount(1)">+</button></div>
    <div class="section-label">บทบาท <span style="color:${over?'var(--danger)':'var(--ok)'};">${total}/${S.wwPlayerCount}</span></div>
    <div class="ww-roles-list">${ROLE_ORDER.map(r=>renderRoleChip(r)).join('')}</div>
    ${over?'<p style="font-size:12px;color:var(--danger);text-align:center;margin-bottom:10px">⚠ บทบาทเกินจำนวนผู้เล่น</p>':''}
    <button class="btn-next btn-accent" style="border-radius:10px" onclick="startWWDeal()" ${over?'disabled style="opacity:0.3;cursor:not-allowed"':''}>แจกบทบาท →</button>`;
}
function renderRoleChip(r){
  const role=WW[r],count=S.wwRoleCounts[r]||0;
  return`<div class="ww-role-chip card${count>0?' has':''}"><div class="ww-role-chip-icon">${role.e}</div><div class="ww-role-chip-info"><div class="ww-role-chip-name">${role.name}</div><div class="ww-role-chip-sub">${role.team==='good'?'ฝ่ายดี':role.team==='evil'?'หมาป่า':'โดดเดี่ยว'}</div></div><div class="ww-role-counter"><button class="ww-c-btn" onclick="changeRoleCount('${r}',-1)">−</button><div class="ww-c-num" id="rc-${r}">${count}</div><button class="ww-c-btn" onclick="changeRoleCount('${r}',1)">+</button></div></div>`;
}
function changeWWCount(d){S.wwPlayerCount=Math.max(3,Math.min(20,S.wwPlayerCount+d));renderWWSetup()}
function changeRoleCount(r,d){
  const cur=S.wwRoleCounts[r]||0,next=Math.max(0,Math.min(WW[r].max||10,cur+d));
  if(totalRoles()-cur+next>S.wwPlayerCount){showToast('บทบาทเกินจำนวนผู้เล่น!');return}
  S.wwRoleCounts[r]=next;
  const el=$(`rc-${r}`);if(el){el.textContent=next;const chip=el.closest('.ww-role-chip');if(chip){next>0?chip.classList.add('has'):chip.classList.remove('has')}}
  const sls=document.querySelectorAll('#wwBody .section-label');
  if(sls[1]){const sp=sls[1].querySelector('span');const total=totalRoles();if(sp){sp.textContent=`${total}/${S.wwPlayerCount}`;sp.style.color=total>S.wwPlayerCount?'var(--danger)':'var(--ok)'}}
  const btn=document.querySelector('#wwBody .btn-next');if(btn){const ov=totalRoles()>S.wwPlayerCount;btn.disabled=ov;btn.style.opacity=ov?'0.3':'1'}
}

/* ── Deal Roles ── */
function startWWDeal(){
  const players=getPlayers();const n=S.wwPlayerCount;
  let roles=[];
  ROLE_ORDER.forEach(r=>{for(let i=0;i<(S.wwRoleCounts[r]||0);i++)roles.push(r)});
  while(roles.length<n)roles.push('villager');
  roles=shuffle(roles).slice(0,n);
  const assigned={};const alive={};
  players.slice(0,n).forEach((p,i)=>{assigned[p.id]=roles[i];alive[p.id]=true});
  S.wwAssigned=assigned;S.wwAlive=alive;S.wwFlipped={};
  S.wwMyRole=assigned[myId()];
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).set({assigned,alive,phase:'roleReveal',nightNum:0,log:[],votes:{},nightActions:{},silenced:null});
  renderWWRoleReveal();
}

/* ── Role Reveal (playing card flip) ── */
function renderWWRoleReveal(){
  S.wwPhase='roleReveal';
  const pl=$('wwPhaseLabel');if(pl)pl.textContent='ดูบทบาทของคุณ';
  const body=$('wwBody');if(!body)return;
  const players=getPlayers().filter(p=>S.wwAssigned[p.id]);
  body.innerHTML=`
    <p style="font-size:12px;color:var(--t2);text-align:center;margin-bottom:1rem">กดไพ่เพื่อพลิกดูบทบาทของคุณ — สามารถเปิดดูได้ตลอดเกม</p>
    <div class="ww-card-grid" id="roleCardGrid">${players.map((p)=>roleCardHTML(p)).join('')}</div>
    <button class="btn-next btn-accent" style="margin-top:0.75rem;border-radius:10px" onclick="startWWNight()">ทุกคนพร้อมแล้ว → เริ่มกลางคืน 🌙</button>`;
}

function roleCardHTML(p){
  const flipped=!!S.wwFlipped[p.id];
  const role=WW[S.wwAssigned[p.id]||'villager'];
  const teamColor={good:'var(--ok)',evil:'var(--wolf)',solo:'var(--solo)'}[role.team];
  const teamBg={good:'rgba(82,183,136,0.15)',evil:'rgba(224,92,92,0.15)',solo:'rgba(212,168,87,0.15)'}[role.team];
  return`<div class="role-playing-card${flipped?' flipped':''}" id="rpc-${esc(p.id)}" onclick="toggleRoleCard('${esc(p.id)}')">
    <div class="rpc-inner">
      <div class="rpc-front">
        <div class="rpc-corner tl">🂠<br>🃏</div>
        <div class="rpc-center-art">🂠</div>
        <div class="rpc-player-name">${esc(p.name)}</div>
        <div class="rpc-hint">กดเพื่อดูบทบาท</div>
        <div class="rpc-corner br">🂠<br>🃏</div>
      </div>
      <div class="rpc-back">
        <div class="rpc-back-team-bar" style="background:${teamBg};color:${teamColor}">${role.tl}</div>
        <div class="rpc-back-emoji">${role.e}</div>
        <div class="rpc-back-name">${role.name}</div>
        <div class="rpc-back-desc">${role.desc}</div>
        <div class="rpc-back-player">${esc(p.name)}</div>
      </div>
    </div>
  </div>`;
}

function toggleRoleCard(pid){
  S.wwFlipped[pid]=!S.wwFlipped[pid];
  const card=$(`rpc-${pid}`);if(!card)return;
  S.wwFlipped[pid]?card.classList.add('flipped'):card.classList.remove('flipped');
}

/* ── Night TTS Narration (Host only) ── */
let nightRoleQueue=[];let nightRoleIndex=0;
function startWWNight(){
  S.wwNightNum++;S.wwPhase='night';S.wwNightActions={};S.wwVotes={};S.wwSilenced=null;
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).update({phase:'night',nightNum:S.wwNightNum,nightActions:{},votes:{},silenced:null});
  // build role queue for this night
  nightRoleQueue=NIGHT_ORDER.filter(r=>{
    if(r==='cupid'&&S.wwNightNum>1)return false;
    if(!SETTINGS.silencerEveryNight&&r==='silencer'&&S.wwNightNum>1)return false;
    return getPlayers().some(p=>S.wwAssigned[p.id]===r&&isAlive(p.id));
  });
  nightRoleIndex=0;
  // Show night lock to all
  showNightLock('ทุกคนหลับตา...');
  // Host runs TTS sequence
  if(S.isHost){
    const lines=[
      {text:'กลางคืนมาถึงแล้ว',pauseAfter:1},
      {text:'ทุกคนหลับตา',pauseAfter:SETTINGS.voicePauseTime},
    ];
    speakSequence(lines,()=>runNextNightRole());
  }
}

function runNextNightRole(){
  if(nightRoleIndex>=nightRoleQueue.length){
    // All done
    if(S.isHost){
      const lines=[
        {text:'ทุกคนหลับตาให้ครบ',pauseAfter:SETTINGS.voicePauseTime},
        {text:'รุ่งเช้าแล้ว',pauseAfter:1},
        {text:'ทุกคนลืมตา',pauseAfter:SETTINGS.voicePauseTime},
      ];
      speakSequence(lines,()=>{
        if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).update({phase:'dayReveal'});
        else showDayReveal();
      });
    }
    return;
  }
  const role=nightRoleQueue[nightRoleIndex];
  const rData=WW[role];
  const actionLines={
    werewolf:[{text:'หมาป่าลืมตา',pauseAfter:1},{text:'เลือกคนที่จะฆ่าคืนนี้',pauseAfter:SETTINGS.nightActionTime+2},{text:'หมาป่าหลับตา',pauseAfter:SETTINGS.voicePauseTime}],
    juniorwolf:[],// handled together with werewolf
    seer:[{text:'เทพพยากรณ์ลืมตา',pauseAfter:1},{text:'ส่องคนที่ต้องการรู้บทบาท',pauseAfter:SETTINGS.nightActionTime+2},{text:'เทพพยากรณ์หลับตา',pauseAfter:SETTINGS.voicePauseTime}],
    bodyguard:[{text:'บอดี้การ์ดลืมตา',pauseAfter:1},{text:'เลือกคนที่จะปกป้องคืนนี้',pauseAfter:SETTINGS.nightActionTime+2},{text:'บอดี้การ์ดหลับตา',pauseAfter:SETTINGS.voicePauseTime}],
    silencer:[{text:'ผู้ต้องสาปลืมตา',pauseAfter:1},{text:'เลือกคนที่จะสาป',pauseAfter:SETTINGS.nightActionTime+2},{text:'ผู้ต้องสาปหลับตา',pauseAfter:SETTINGS.voicePauseTime}],
    cupid:[{text:'กามเทพลืมตา',pauseAfter:1},{text:'เลือกคู่รัก 2 คน',pauseAfter:SETTINGS.nightActionTime+4},{text:'กามเทพหลับตา',pauseAfter:SETTINGS.voicePauseTime}],
    hunter:[{text:'นายพรานลืมตา',pauseAfter:1},{text:'เลือกคนที่จะยิง',pauseAfter:SETTINGS.nightActionTime+2},{text:'นายพรานหลับตา',pauseAfter:SETTINGS.voicePauseTime}],
  };
  const lines=actionLines[role];
  if(!lines||!lines.length){nightRoleIndex++;runNextNightRole();return}
  // Signal via Firebase that this role's action starts
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww/currentNightRole`).set(role);
  else showNightActionForRole(role);
  speakSequence(lines,()=>{nightRoleIndex++;runNextNightRole()});
}

/* ── Night screens ── */
function showNightLock(msg='ทุกคนหลับตา'){
  const nl=$('nightLock');if(!nl)return;
  nl.innerHTML=`<div class="night-lock-icon">🌙</div><div class="night-lock-title">${msg}</div><div class="night-lock-sub">รอรับคำสั่ง...</div>`;
  nl.classList.add('show');
  $('nightAction')?.classList.remove('show');
}
function closeNightScreens(){$('nightLock')?.classList.remove('show');$('nightAction')?.classList.remove('show')}

function showNightActionForRole(role){
  const myR=S.wwMyRole;
  // Only show if my role matches
  const roleMatch={
    werewolf:['werewolf','juniorwolf'],
    juniorwolf:['werewolf','juniorwolf'],
    seer:['seer'],bodyguard:['bodyguard'],silencer:['silencer'],
    cupid:['cupid'],hunter:['hunter'],
  };
  const myGroup=Object.entries(roleMatch).find(([,v])=>v.includes(myR))?.[0];
  if(myGroup!==role){$('nightLock')?.classList.add('show');return}
  if(!isAlive(myId())){return}
  buildNightActionUI(role);
}

let cupidPick=[];
function buildNightActionUI(role){
  const na=$('nightAction');if(!na)return;
  const alive=getAlivePlayers();
  let title='',sub='',playerList='',actionKey='';
  if(role==='werewolf'||role==='juniorwolf'){
    title='🐺 หมาป่า';sub=`เลือกเหยื่อ (${SETTINGS.nightActionTime} วิ)`;actionKey='wolfKill';
    const targets=alive.filter(p=>S.wwAssigned[p.id]!=='werewolf'&&S.wwAssigned[p.id]!=='juniorwolf');
    playerList=targets.map(p=>`<button class="na-player-btn" id="nap-${esc(p.id)}" onclick="submitNightAction('wolfKill','${esc(p.id)}')">${naAvatarHTML(p)}${esc(p.name)}</button>`).join('');
  }else if(role==='seer'){
    title='🔮 เทพพยากรณ์';sub=`ส่องบทบาท (${SETTINGS.nightActionTime} วิ)`;
    playerList=alive.filter(p=>p.id!==myId()).map(p=>`<button class="na-player-btn" id="nap-${esc(p.id)}" onclick="submitNightAction('seer','${esc(p.id)}')">${naAvatarHTML(p)}${esc(p.name)}</button>`).join('');
  }else if(role==='bodyguard'){
    title='🛡️ บอดี้การ์ด';sub=`เลือกปกป้อง (${SETTINGS.nightActionTime} วิ)`;
    const cannotProtect=S.wwLastProtected;
    playerList=alive.map(p=>{
      const disabled=p.id===cannotProtect&&!(p.id===myId()&&!SETTINGS.bodyguardSelfProtect);
      return`<button class="na-player-btn${disabled?' dead':''}" id="nap-${esc(p.id)}" onclick="${!disabled?`submitNightAction('protect','${esc(p.id)}')`:''}">${naAvatarHTML(p)}${esc(p.name)}${disabled?'<span style="font-size:10px;color:var(--t2);margin-left:auto">(ซ้ำ)</span>':''}</button>`;
    }).join('');
  }else if(role==='silencer'){
    title='🤫 ผู้ต้องสาป';sub=`เลือกสาปคน (${SETTINGS.nightActionTime} วิ)`;
    playerList=alive.filter(p=>p.id!==myId()).map(p=>`<button class="na-player-btn" id="nap-${esc(p.id)}" onclick="submitNightAction('silence','${esc(p.id)}')">${naAvatarHTML(p)}${esc(p.name)}</button>`).join('');
  }else if(role==='cupid'){
    title='💘 กามเทพ';sub='เลือกคู่รัก 2 คน';cupidPick=[];
    playerList=alive.map(p=>`<button class="na-player-btn" id="nap-${esc(p.id)}" onclick="submitNightAction('cupid','${esc(p.id)}')">${naAvatarHTML(p)}${esc(p.name)}</button>`).join('');
  }else if(role==='hunter'){
    title='🏹 นายพราน';sub='เลือกยิงคนตามตาย';
    playerList=alive.filter(p=>p.id!==myId()).map(p=>`<button class="na-player-btn" id="nap-${esc(p.id)}" onclick="submitNightAction('hunt','${esc(p.id)}')">${naAvatarHTML(p)}${esc(p.name)}</button>`).join('');
  }
  na.innerHTML=`
    <div class="na-header">
      <div class="na-title">${title}</div>
      <div class="na-sub">${sub}</div>
      <div class="na-timer-row"><div class="na-timer" id="naTimer">${SETTINGS.nightActionTime}</div></div>
    </div>
    <div class="na-body"><div class="na-players" id="naPlayers">${playerList}</div><div id="naResult"></div></div>`;
  na.classList.add('show');$('nightLock')?.classList.remove('show');
  // Countdown
  startCountdown('naTimer',SETTINGS.nightActionTime,()=>{});
}
function naAvatarHTML(p){const i=playerIndex(p.id);return`<div class="na-avatar" style="background:${COLORS[i%COLORS.length]}22;color:${COLORS[i%COLORS.length]}">${esc(p.name.charAt(0).toUpperCase())}</div>`}

function submitNightAction(type,targetId){
  if(type==='cupid'){
    if(cupidPick.includes(targetId)){showToast('เลือกไปแล้ว');return}
    cupidPick.push(targetId);$(`nap-${targetId}`)?.classList.add('selected');
    if(cupidPick.length===2){
      S.wwCupidCouple=cupidPick;cupidPick=[];
      if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww/nightActions/cupid`).set(S.wwCupidCouple);
      const r=$('naResult');if(r)r.innerHTML=`<div class="na-done">✓ จับคู่รักเรียบร้อย!</div>`;
      stopCountdown();setTimeout(()=>{$('nightAction')?.classList.remove('show');$('nightLock')?.classList.add('show')},1500);
    }
    return;
  }
  if(type==='seer'){
    const role=S.wwAssigned[targetId];
    const isEvil=role==='halfwolf'?true:WW[role]?.team==='evil';
    const pill=isEvil?'evil':'good';
    const r=$('naResult');if(r)r.innerHTML=`<div class="na-seer-result ${pill}">${WW[role]?.e||'?'} ${WW[role]?.name||'?'} — ${isEvil?'ฝ่ายเลว ⚠':'ฝ่ายดี ✅'}</div>`;
    if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww/nightActions/seerTarget`).set(targetId);
    stopCountdown();
    return;// Don't auto close — let them see result
  }
  // All other actions
  document.querySelectorAll('.na-player-btn').forEach(b=>b.classList.remove('selected','selected-kill'));
  if(type==='wolfKill')$(`nap-${targetId}`)?.classList.add('selected-kill');
  else $(`nap-${targetId}`)?.classList.add('selected');
  const keyMap={wolfKill:'wolfKill',protect:'bodyguardProtect',silence:'silenceTarget',hunt:'hunterShot'};
  if(firebaseReady&&keyMap[type])db.ref(`rooms/${S.roomCode}/ww/nightActions/${keyMap[type]}`).set(targetId);
  const r=$('naResult');if(r)r.innerHTML=`<div class="na-done">✓ ส่งแล้ว!</div>`;
  stopCountdown();
  setTimeout(()=>{$('nightAction')?.classList.remove('show');$('nightLock')?.classList.add('show')},1500);
}

/* ── Day Reveal ── */
function showDayReveal(){
  closeNightScreens();
  const actions=S.wwNightActions;
  const killTarget=actions.wolfKill;const protect=actions.bodyguardProtect;
  const silenced=actions.silenceTarget;
  S.wwLastProtected=protect||null;
  S.wwSilenced=silenced||null;
  let killed=null;
  if(killTarget&&killTarget!==protect){killed=killTarget;S.wwAlive[killTarget]=false;}
  // Log
  if(killed){
    const role=S.wwAssigned[killed];
    addLog(`🌙 ${playerName(killed)} ถูกหมาป่าฆ่าตาย (${WW[role]?.name||'?'})`,'kill');
    // Hunter
    if(role==='hunter'&&killed===myId())setTimeout(()=>buildNightActionUI('hunter'),500);
    // Cupid
    if(SETTINGS.cupidLoverDie&&S.wwCupidCouple.includes(killed)){
      const partner=S.wwCupidCouple.find(id=>id!==killed);
      if(partner&&isAlive(partner)){S.wwAlive[partner]=false;addLog(`💔 ${playerName(partner)} ตายตามคู่รัก`,'kill');}
    }
    // Junior
    if(S.wwAssigned[killed]==='juniorwolf')S.wwJuniorBonus=true;
  }else if(killTarget&&killTarget===protect){
    addLog(`🛡️ ${playerName(killTarget)} รอดจากหมาป่าเพราะบอดี้การ์ด!`,'save');
  }else{addLog('🌙 คืนนี้ผ่านไปอย่างสงบ ไม่มีใครตาย','')}
  if(silenced)addLog(`🤫 ${playerName(silenced)} ถูกสาป — พูดไม่ได้วันนี้`,'reveal');
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).update({alive:S.wwAlive,log:S.wwEventLog,phase:'dayDiscuss',silenced:S.wwSilenced,nightActions:{}});
  else renderWWDay();
  checkWinCondition();
}

/* ── Day Discuss ── */
function renderWWDay(){
  S.wwPhase='dayDiscuss';closeNightScreens();
  const pl=$('wwPhaseLabel');if(pl)pl.textContent='☀️ กลางวัน';
  const body=$('wwBody');if(!body)return;
  const log=S.wwEventLog.slice(-4);
  body.innerHTML=`
    ${log.length?`<div class="event-log">${log.map(l=>`<div class="log-item ${l.type||''}">${l.msg}</div>`).join('')}</div>`:''}
    <div class="section-label">ผู้เล่น</div>
    <div class="ww-player-status-list">${renderPlayerStatusList()}</div>
    <div class="phase-banner day"><span class="phase-emoji">☀️</span><div class="phase-title">กลางวัน — ถกกันก่อน</div><div class="phase-desc">ถกกัน ${SETTINGS.discussTime} วิ แล้วค่อยโหวต</div></div>
    <div class="day-timer-row"><div class="day-timer-label">เวลาถก</div><div class="day-timer" id="dayTimer">${SETTINGS.discussTime}</div></div>
    <button class="btn-next btn-accent" style="border-radius:10px" id="btnStartVote" onclick="startDayVote()">เริ่มโหวต →</button>
    <div style="margin-top:0.75rem">${renderRoleCards()}</div>`;
  startCountdown('dayTimer',SETTINGS.discussTime,()=>startDayVote());
}
function renderPlayerStatusList(){
  return getPlayers().filter(p=>S.wwAssigned[p.id]).map((p,i)=>{
    const alive=isAlive(p.id);const silenced=S.wwSilenced===p.id;
    return`<div class="ww-status-row${!alive?' dead':''}">
      <div class="player-avatar" style="width:28px;height:28px;border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${COLORS[i%COLORS.length]}22;color:${COLORS[i%COLORS.length]}">${esc(p.name.charAt(0).toUpperCase())}</div>
      <div class="ww-status-name">${esc(p.name)}</div>
      ${alive?'':`<span class="ww-status-badge dead">💀 ตาย</span>`}
      ${silenced?`<span class="ww-status-badge silenced">🔇 พูดไม่ได้</span>`:''}
    </div>`;
  }).join('');
}
function renderRoleCards(){
  const players=getPlayers().filter(p=>S.wwAssigned[p.id]);
  if(!players.length)return'';
  return`<div class="section-label" style="margin:0 0 0.5rem">การ์ดบทบาท (กดดูได้)</div><div class="ww-card-grid small">${players.map(p=>roleCardHTML(p)).join('')}</div>`;
}

/* ── Day Vote ── */
function startDayVote(){
  stopCountdown();S.wwPhase='dayVote';S.wwVotes={};
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).update({phase:'dayVote',votes:{}});
  else renderWWDayVote();
}
function renderWWDayVote(){
  S.wwPhase='dayVote';
  const pl=$('wwPhaseLabel');if(pl)pl.textContent='☀️ โหวตประหาร';
  const body=$('wwBody');if(!body)return;
  const alive=getAlivePlayers();
  const myVote=S.wwVotes[myId()];const imAlive=isAlive(myId());
  const isSilenced=S.wwSilenced===myId();
  const voteCounts={};alive.forEach(p=>{voteCounts[p.id]=0});
  Object.entries(S.wwVotes).forEach(([voter,target])=>{if(voteCounts[target]!==undefined)voteCounts[target]++});
  const totalVotes=Object.keys(S.wwVotes).length;
  body.innerHTML=`
    <div class="vote-timer-row"><div class="vote-timer-label">⏱ เวลาโหวต</div><div class="vote-timer" id="voteTimer">${SETTINGS.voteTime}</div></div>
    <div class="section-label">โหวต ${totalVotes}/${alive.length} คน</div>
    <div class="vote-list" id="voteList">
      ${alive.map(p=>{
        const cnt=voteCounts[p.id]||0;
        const pct=alive.length>0?cnt/alive.length*100:0;
        const voters=Object.entries(S.wwVotes).filter(([,t])=>t===p.id).map(([vid])=>playerName(vid));
        const isMe=p.id===myId();const voted=myVote===p.id;
        const canVote=imAlive&&!myVote&&!isMe&&!isSilenced;
        return`<div class="vote-row${voted?' voted':''}${!isAlive(p.id)?' dead':''}" onclick="${canVote?`castVote('${esc(p.id)}')`:''}" id="vr-${esc(p.id)}">
          <div class="vote-bar" style="width:${pct}%"></div>
          <div class="vote-name">${esc(p.name)}${isMe?' (คุณ)':''}</div>
          <div class="vote-detail">
            <span class="vote-count">${cnt} โหวต</span>
            ${voters.length?`<span class="vote-voters">${voters.map(n=>esc(n)).join(', ')}</span>`:''}
          </div>
          ${voted?'<span class="vote-you">✓</span>':''}
        </div>`;
      }).join('')}
    </div>
    ${isSilenced?'<p style="text-align:center;font-size:12px;color:var(--danger);margin-bottom:0.5rem">🔇 คุณถูกสาป — โหวตไม่ได้วันนี้</p>':''}
    ${!imAlive?'<p style="text-align:center;font-size:12px;color:var(--t2);margin-bottom:0.5rem">คุณตายแล้ว ดูได้แต่โหวตไม่ได้</p>':''}
    ${S.isHost?`<button class="btn-next btn-surface" style="border-radius:10px;margin-top:0.5rem" onclick="resolveVote()">ปิดโหวตและประกาศผล →</button>`:''}`;
  startCountdown('voteTimer',SETTINGS.voteTime,()=>{if(S.isHost)resolveVote()});
}

function castVote(targetId){
  if(S.wwVotes[myId()]){showToast('โหวตไปแล้ว!');return}
  if(!isAlive(myId())){showToast('คุณตายแล้ว');return}
  if(S.wwSilenced===myId()){showToast('คุณถูกสาป โหวตไม่ได้!');return}
  S.wwVotes[myId()]=targetId;
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww/votes/${myId()}`).set(targetId);
  renderWWDayVote();
}

function resolveVote(){
  stopCountdown();
  const alive=getAlivePlayers();
  const voteCounts={};alive.forEach(p=>{voteCounts[p.id]=0});
  Object.values(S.wwVotes).forEach(pid=>{if(voteCounts[pid]!==undefined)voteCounts[pid]++});
  let maxV=0,maxPid=null,tie=false;
  Object.entries(voteCounts).forEach(([pid,cnt])=>{if(cnt>maxV){maxV=cnt;maxPid=pid;tie=false}else if(cnt===maxV&&maxV>0)tie=true});
  if(tie||!maxPid||maxV===0){addLog('🗳️ คะแนนเสมอ — ไม่มีใครถูกประหาร','vote');checkWinAfterVote(null);return}
  const role=S.wwAssigned[maxPid];
  // Prince
  if(role==='prince'&&!S.wwPrinceUsed){
    S.wwPrinceUsed=true;addLog(`👑 ${playerName(maxPid)} เปิดเผยว่าเป็น เจ้าชาย — รอดจากการประหาร!`,'reveal');
    if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).update({alive:S.wwAlive,log:S.wwEventLog,phase:'night'});
    else startWWNight();return;
  }
  // Tanner
  if(role==='tanner'){
    S.wwAlive[maxPid]=false;addLog(`🤪 ${playerName(maxPid)} (คนบ้า) ถูกโหวตออก — ชนะทันที!`,'vote');
    endGame('tanner',maxPid);return;
  }
  // Normal kill
  addLog(`🗳️ ${playerName(maxPid)} ถูกโหวตประหาร (${WW[role]?.name||'?'})`,'vote');
  S.wwAlive[maxPid]=false;
  // Junior wolf
  if(role==='juniorwolf'){S.wwJuniorBonus=true;addLog('🐾 ลูกหมาป่าถูกประหาร — หมาป่าฆ่าเพิ่มได้อีก 1 คืน','reveal')}
  // Cupid
  if(SETTINGS.cupidLoverDie&&S.wwCupidCouple.includes(maxPid)){
    const partner=S.wwCupidCouple.find(id=>id!==maxPid);
    if(partner&&isAlive(partner)){S.wwAlive[partner]=false;addLog(`💔 ${playerName(partner)} ตายตามคู่รัก`,'kill');}
  }
  checkWinAfterVote(maxPid);
}

function checkWinAfterVote(killedPid){
  if(checkWinCondition())return;
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).update({alive:S.wwAlive,log:S.wwEventLog,phase:'night'});
  else startWWNight();
}

function checkWinCondition(){
  const alive=getAlivePlayers();
  const wolves=alive.filter(p=>['werewolf','juniorwolf'].includes(S.wwAssigned[p.id]));
  const others=alive.filter(p=>!['werewolf','juniorwolf'].includes(S.wwAssigned[p.id]));
  if(wolves.length===0){endGame('villagers');return true}
  if(wolves.length>=others.length){endGame('wolves');return true}
  return false;
}

function addLog(msg,type){S.wwEventLog.push({msg,type});if(S.wwEventLog.length>30)S.wwEventLog=S.wwEventLog.slice(-30)}

function endGame(winner,winnerId=null){
  S.wwPhase='result';stopCountdown();closeNightScreens();
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).update({alive:S.wwAlive,log:S.wwEventLog,phase:'result',winner});
  else renderWWResult(winner);
}
function renderWWResult(winner){
  const pl=$('wwPhaseLabel');if(pl)pl.textContent='🏁 จบเกม';
  const body=$('wwBody');if(!body)return;
  const wc={villagers:{cls:'villagers-win',icon:'🎉',title:'ชาวบ้านชนะ!',sub:'หมาป่าทุกตัวถูกกำจัดแล้ว'},wolves:{cls:'wolves-win',icon:'🐺',title:'หมาป่าชนะ!',sub:'หมาป่าครองหมู่บ้านเรียบร้อย'},tanner:{cls:'tanner-win',icon:'🤪',title:'คนบ้าชนะ!',sub:'คนบ้าถูกโหวตออกสำเร็จ'}}[winner]||{cls:'villagers-win',icon:'🏁',title:'จบเกม',sub:''};
  const players=getPlayers().filter(p=>S.wwAssigned[p.id]);
  body.innerHTML=`
    <div class="result-banner ${wc.cls}"><span class="result-icon">${wc.icon}</span><div class="result-title">${wc.title}</div><div class="result-sub">${wc.sub}</div></div>
    <div class="section-label">บทบาทและผล</div>
    <div class="result-players">${players.map((p,i)=>{const role=WW[S.wwAssigned[p.id]||'villager'];const alive=S.wwAlive[p.id]!==false;return`<div class="result-row"><div class="player-avatar" style="width:28px;height:28px;border-radius:50%;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${COLORS[i%COLORS.length]}22;color:${COLORS[i%COLORS.length]}">${esc(p.name.charAt(0).toUpperCase())}</div><div class="result-row-name">${esc(p.name)}</div><div class="result-row-role">${role.e} ${role.name}</div><div class="result-row-status ${alive?'alive':'dead'}">${alive?'รอด':'ตาย'}</div></div>`}).join('')}</div>
    <div class="section-label">เหตุการณ์</div>
    <div class="event-log">${S.wwEventLog.slice(-10).map(l=>`<div class="log-item ${l.type||''}">${l.msg}</div>`).join('')}</div>
    <button class="btn-next btn-accent" style="border-radius:10px" onclick="initWW()">เล่นอีกรอบ</button>
    <button class="btn-next btn-surface" style="border-radius:10px" onclick="backToLobby()">กลับล็อบบี้</button>`;
}

/* ── Firebase sync ── */
function syncWWState(data){
  if(data.assigned)S.wwAssigned=data.assigned;
  if(data.alive)S.wwAlive=data.alive;
  if(data.log)S.wwEventLog=data.log;
  if(data.votes){S.wwVotes=data.votes;if(S.wwPhase==='dayVote')renderWWDayVote();}
  if(data.nightActions)S.wwNightActions=data.nightActions;
  if(data.silenced!==undefined)S.wwSilenced=data.silenced;
  if(data.currentNightRole&&data.currentNightRole!==S.wwPhase)showNightActionForRole(data.currentNightRole);
  if(data.phase&&data.phase!==S.wwPhase){
    S.wwPhase=data.phase;
    if(data.phase==='roleReveal'){S.wwMyRole=data.assigned?.[myId()];renderWWRoleReveal()}
    else if(data.phase==='dayReveal')showDayReveal();
    else if(data.phase==='dayDiscuss'){closeNightScreens();renderWWDay()}
    else if(data.phase==='dayVote')renderWWDayVote();
    else if(data.phase==='result'){closeNightScreens();renderWWResult(data.winner)}
    else if(data.phase==='night')startWWNight();
  }
}

/* ══ FORBIDDEN ═══════════════════════════ */
function initForbidden(){
  S.myWord=null;S.myWordVisible=false;
  const we=$('myForbiddenWord'),al=$('forbiddenAlive'),st=$('forbiddenStatus');
  if(we){we.textContent='· · ·';we.className='forbidden-word hidden'}
  const players=getPlayers();if(al)al.textContent=players.length;
  const set=FALLBACK_WORDS[0|Math.random()*FALLBACK_WORDS.length];
  const words=[...set];while(words.length<players.length)words.push(set[0|Math.random()*set.length]);
  const myIdx=players.findIndex(p=>p.name===S.nickname);S.myWord=words[myIdx>=0?myIdx:0];
  if(st)st.innerHTML=players.map((p,i)=>`<div class="player-status-row card" id="fpr-${i}"><div class="ps-avatar" style="background:${COLORS[i%COLORS.length]}22;color:${COLORS[i%COLORS.length]}">${esc(p.name.charAt(0).toUpperCase())}</div><div class="ps-name">${esc(p.name)}</div><div class="ps-word" id="psw-${i}">${p.name===S.nickname?'(ตัวเอง)':'???'}</div></div>`).join('');
}
function toggleForbiddenWord(){
  if(!S.myWord){showToast('กำลังโหลด...');return}
  S.myWordVisible=!S.myWordVisible;
  const we=$('myForbiddenWord'),hint=$('forbiddenHint'),tap=$('forbiddenTap');
  if(S.myWordVisible){if(we){we.textContent=S.myWord;we.className='forbidden-word anim-pop'}if(hint)hint.textContent='⚠️ ห้ามพูดคำนี้ออกมา!';if(tap)tap.textContent='กดอีกครั้งเพื่อซ่อน';}
  else{if(we){we.textContent='· · ·';we.className='forbidden-word hidden'}if(hint)hint.textContent='';if(tap)tap.textContent='กดเพื่อดูคำ';}
}
function eliminateSelf(){
  const players=getPlayers();const myIdx=players.findIndex(p=>p.name===S.nickname);
  if(myIdx>=0){const row=$(`fpr-${myIdx}`);if(row){row.classList.add('out');const wEl=$(`psw-${myIdx}`);if(wEl)wEl.textContent=S.myWord||'???';const b=document.createElement('div');b.className='ps-out-badge';b.textContent='OUT 💀';row.appendChild(b);}}
  const alive=document.querySelectorAll('.player-status-row:not(.out)').length;const al=$('forbiddenAlive');if(al)al.textContent=alive;
  if(alive===1){const w=document.querySelector('.player-status-row:not(.out) .ps-name');showToast(`🎉 ${w?.textContent||'ผู้เล่น'} ชนะ!`,4000);}
}

/* ══ WHEEL ═══════════════════════════════ */
function initWheel(){S.wheelItems=getPlayers().map(p=>p.name);S.wheelSpinning=false;S.wheelAngle=0;renderWheelItems();drawWheel(0)}
function renderWheelItems(){const list=$('wheelItemsList');if(!list)return;list.innerHTML=S.wheelItems.length?S.wheelItems.map((item,i)=>`<div class="wheel-item-row"><div class="wheel-dot" style="background:${COLORS[i%COLORS.length]}"></div><div class="wheel-item-text">${esc(item)}</div><button class="btn-del" onclick="delWheelItem(${i})">✕</button></div>`).join(''):'<div style="text-align:center;color:var(--t2);padding:0.75rem;font-size:13px">ยังไม่มีตัวเลือก</div>';drawWheel(S.wheelAngle)}
function addWheelItem(){const inp=$('wheelAddInput');if(!inp)return;const v=inp.value.trim();if(!v){showToast('ใส่ชื่อด้วย');return}if(S.wheelItems.includes(v)){showToast('มีชื่อนี้แล้ว!');return}S.wheelItems.push(v);inp.value='';renderWheelItems()}
function delWheelItem(i){S.wheelItems.splice(i,1);renderWheelItems()}
function drawWheel(rot){const canvas=$('wheelCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');const items=S.wheelItems,W=canvas.width,cx=W/2,cy=W/2,r=W/2-4;ctx.clearRect(0,0,W,W);if(!items.length){ctx.fillStyle='rgba(255,255,255,0.04)';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();return}const slice=Math.PI*2/items.length;items.forEach((item,i)=>{const s=rot+i*slice-Math.PI/2,e=s+slice;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,s,e);ctx.closePath();ctx.fillStyle=COLORS[i%COLORS.length]+'28';ctx.fill();ctx.strokeStyle=COLORS[i%COLORS.length];ctx.lineWidth=1.5;ctx.stroke();const mid=s+slice/2,tx=cx+(r-26)*Math.cos(mid),ty=cy+(r-26)*Math.sin(mid);ctx.save();ctx.translate(tx,ty);ctx.rotate(mid+Math.PI/2);ctx.textAlign='center';ctx.fillStyle='rgba(255,255,255,0.85)';ctx.font=`500 ${Math.max(10,Math.min(13,180/items.length))}px Kanit,sans-serif`;ctx.fillText(item.length>8?item.slice(0,8)+'…':item,0,0);ctx.restore()});ctx.beginPath();ctx.arc(cx,cy,18,0,Math.PI*2);ctx.fillStyle='#0d0d10';ctx.fill();ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;ctx.stroke()}
function spinWheel(){if(S.wheelSpinning)return;if(S.wheelItems.length<2){showToast('ต้องมีอย่างน้อย 2 ตัวเลือก');return}S.wheelSpinning=true;const spinBtn=$('btnSpin'),resultEl=$('wheelResult');if(spinBtn)spinBtn.disabled=true;if(resultEl)resultEl.innerHTML='';const target=0|Math.random()*S.wheelItems.length,sliceAng=Math.PI*2/S.wheelItems.length;const totalAng=(5+0|Math.random()*4)*Math.PI*2+(Math.PI*2-(target*sliceAng+sliceAng/2));const dur=4200,t0=performance.now(),a0=S.wheelAngle;function tick(now){const p=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-p,4);drawWheel(a0+totalAng*ease);if(p<1){requestAnimationFrame(tick);return}S.wheelAngle=(a0+totalAng)%(Math.PI*2);S.wheelSpinning=false;if(spinBtn)spinBtn.disabled=false;const winner=S.wheelItems[target];if(resultEl)resultEl.innerHTML=`<div class="wheel-result-text anim-pop">🎯 ${esc(winner)}</div>`;showToast(`${winner} โดนแล้ว! 🎯`,3000)}requestAnimationFrame(tick)}

/* ══ CARDS ═══════════════════════════════ */
function initCards(){const vals=['A','2','3','4','5','6','7','8','9','10','J','Q','K'],suits=['♠','♥','♦','♣'];S.cardDeck=shuffle(vals.flatMap(v=>suits.map(s=>({v,s}))));S.cardIdx=0;const cl=$('cardsLeft'),cc=$('cardContent');if(cl)cl.textContent=S.cardDeck.length;if(cc)cc.innerHTML='<span style="font-size:13px;color:var(--t2)">กดปุ่มด้านล่างเพื่อจั่วไพ่</span>'}
function drawCard(){if(S.cardIdx>=S.cardDeck.length){showToast('หมดสำรับแล้ว! เริ่มใหม่');initCards();return}const card=S.cardDeck[S.cardIdx++];const cl=$('cardsLeft'),cc=$('cardContent');if(cl)cl.textContent=S.cardDeck.length-S.cardIdx;const rule=CARDS[card.v]||{r:card.v,d:''};const isRed=card.s==='♥'||card.s==='♦';const sc=isRed?'#e05c5c':'var(--t0)';if(cc)cc.innerHTML=`<div class="playing-card-top anim-pop" style="color:${sc}">${card.v}${card.s}</div><div class="playing-card-rule">${rule.r}</div><div class="playing-card-desc">${rule.d}</div>`}

/* ══ AI ══════════════════════════════════ */
async function callAI(prompt){if(CONFIG.workerURL.includes('YOUR_'))return callFallback(prompt);try{const res=await fetch(`${CONFIG.workerURL}/ai`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});if(!res.ok)throw 0;const data=await res.json();return data.result||data.text||callFallback(prompt)}catch{return callFallback(prompt)}}
function callFallback(p){const pl=p.toLowerCase();if(pl.includes('truth')){const b={easy:['คุณเคยโกหกพ่อแม่เรื่องอะไร?','สิ่งที่อายที่สุดในชีวิตคืออะไร?','เคยแกล้งป่วยเพื่อหนีเรียนไหม?'],mid:['ใครในวงที่คุณคิดว่าขี้โกหกที่สุด?','เคยชอบคนที่ไม่ควรชอบไหม?'],hot:['เคยแอบดูประวัติมือถือแฟนไหม?','คนที่ Attractive ที่สุดในวงคือใคร?']};const arr=b[S.todDiff]||b.easy;return arr[0|Math.random()*arr.length]}if(pl.includes('dare')){const b={easy:['ร้องเพลงท่อนหนึ่งให้ทุกคนฟัง','ทำหน้าตลกสุดๆ 10 วินาที','บอกสิ่งที่ชอบในคนที่นั่งซ้ายมือ'],mid:['กอดคนที่นั่งขวามือแน่นๆ 5 วินาที'],hot:['พูดว่า "ฉันรักคุณ" กับทุกคนในวงทีละคน']};const arr=b[S.todDiff]||b.easy;return arr[0|Math.random()*arr.length]}return JSON.stringify(FALLBACK_WORDS[0|Math.random()*FALLBACK_WORDS.length])}

/* ══ DEEP LINK ═══════════════════════════ */
function checkDeepLink(){const r=new URLSearchParams(location.search).get('room');if(!r)return;S.pendingRoomCode=r.toUpperCase().slice(0,6);S.isHost=false;const lb=$('nickRoomLabel');if(lb)lb.textContent=`ห้อง: ${S.pendingRoomCode}`;const ni=$('nickInput');if(ni)ni.value='';showScreen('screen-nick')}

/* ══ INIT ════════════════════════════════ */
document.addEventListener('DOMContentLoaded',()=>{
  checkDeepLink();
  $('joinCodeInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')joinRoom()});
  $('nickInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')confirmNick()});
  $('wheelAddInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')addWheelItem()});
  $('menuOverlay')?.addEventListener('click',e=>{if(e.target.id==='menuOverlay')closeMenu()});
});