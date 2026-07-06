/* ══ ROOM ════════════════════════════════ */
function showCreateRoom(){S.pendingRoomCode=genCode();S.isHost=true;const i=$('roomNameInput');if(i)i.value='';showScreen('screen-room')}

const _JOIN_MODAL_META={
  ww:{icon:'🐯',title:'คืนสมิง',desc:'เล่นกับเพื่อน 4–18 คน'},
  spyfall:{icon:'🕵️',title:'สายลับกลางวง',desc:'หาสายลับในกลุ่ม · 2+ คน'},
  king:{icon:'👑',title:"King's Game",desc:'3+ คน · ราชาสั่ง ใครจะโดน?'},
  salem:{icon:'🧙',title:'Salem 1692',desc:'4–12 คน · เกมไพ่ชีวิต หาแม่มด'},
};
let _joinModalGame=null;
function openJoinModal(type){
  _joinModalGame=type;
  const meta=_JOIN_MODAL_META[type]||{icon:'🔑',title:'เข้าร่วมวง',desc:'ใส่รหัสวงที่เพื่อนส่งมา'};
  const icon=$('modalJoinIcon'),title=$('modalJoinTitle'),desc=$('modalJoinDesc');
  if(icon)icon.textContent=meta.icon;
  if(title)title.textContent=meta.title;
  if(desc)desc.textContent=meta.desc;
  const inp=$('joinCodeInput');if(inp)inp.value='';
  openModal('modal-join');
  setTimeout(()=>$('joinCodeInput')?.focus(),300);
}
function joinRoomFromModal(){
  S.pendingRoomCode=null;S.isHost=false;
  joinRoom();
}
function showCreateRoomFromModal(){
  closeModal('modal-join');
  S.pendingRoomCode=genCode();S.isHost=true;S.selectedGame=_joinModalGame||null;
  const i=$('roomNameInput');if(i)i.value='';
  const ni=$('hostNickInput');if(ni)ni.value=S.nickname||'';
  showScreen('screen-room');
  logEvent('create_room_start',{code:S.pendingRoomCode,roomName:S.roomName||''});
}
function exitSoloGame(){
  // reset state แล้วกลับ home
  S.roomCode=null;S.myPlayerId=null;S.selectedGame=null;S.players=[];
  showScreen('screen-home');
}
function launchSolo(type){
  S.roomCode=null;S.myPlayerId='solo_'+Date.now();S.nickname=S.nickname||'ผู้เล่น';
  S.isHost=true;S.players=[{id:S.myPlayerId,name:S.nickname,isHost:true}];
  S.selectedGame=type;
  initGame(type);
  const map={wheel:'screen-wheel',cards:'screen-cards'};
  if(map[type])showScreen(map[type]);
}
/* ══ รอ Firebase พร้อมแล้วค่อยรัน callback (ใช้ร่วมกันตอนสร้าง/เข้าวง) ══ */
let _fbWaitTimer=null;
function waitForFirebaseThenRun(callback){
  clearTimeout(_fbWaitTimer);
  $('fbRetryBanner')?.classList.remove('show');
  if(firebaseReady){callback();return}
  let attempts=0,dots=1;
  const tick=()=>{
    if(firebaseReady){showToast('เชื่อมต่อสำเร็จ!',1200);callback();return}
    attempts++;
    if(attempts>=15){
      showFirebaseRetryPrompt(callback);
      return;
    }
    dots=dots%3+1;
    const slow=attempts>=6;// ผ่านไปแล้วประมาณ 3 วิ
    showToast((slow?'เน็ตช้ากว่าปกติ กำลังลองใหม่':'กำลังเชื่อมต่อ')+'.'.repeat(dots),900);
    _fbWaitTimer=setTimeout(tick,500);
  };
  showToast('กำลังเชื่อมต่อ.',900);
  _fbWaitTimer=setTimeout(tick,400);
}
function showFirebaseRetryPrompt(callback){
  const banner=$('fbRetryBanner'),btn=$('fbRetryBtn');
  if(!banner||!btn){showToast('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง');return}
  banner.classList.add('show');
  btn.onclick=()=>{banner.classList.remove('show');waitForFirebaseThenRun(callback);};
}
function confirmCreateRoom(){
  const i=$('roomNameInput'),name=i?i.value.trim():'';
  if(!name){showToast('ตั้งชื่อวงด้วยนะ');return}
  const ni=$('hostNickInput'),nick=ni?ni.value.trim():'';
  if(!nick){showToast('ใส่ชื่อของคุณด้วยนะ');return}
  if(nick.length>12){showToast('ชื่อยาวเกินไป');return}
  S.roomName=name;S.nickname=nick;S.roomCode=S.pendingRoomCode;
  waitForFirebaseThenRun(enterLobby);
}
function joinRoom(){
  const i=$('joinCodeInput');
  // sanitize: เอาเฉพาะ A-Z 0-9, ตัดช่องว่างทุกทิศ, uppercase
  const raw=i?i.value:'';
  const code=raw.replace(/[^A-Za-z0-9]/g,'').toUpperCase().slice(0,6);
  if(i)i.value=code;// อัปเดต input ให้ตรงกับค่าจริง
  if(code.length<4){showToast('ใส่รหัสวงด้วยนะ');return}
  if(!firebaseReady){showToast('กำลังเชื่อมต่อ...');return}
  showToast('กำลังค้นหาวง...',3000);
  // เช็คที่ rooms/${code} โดยตรง (ไม่ใช่ /players) เพื่อรองรับห้องที่ Host เพิ่งสร้างและยังไม่มี player
  db.ref('rooms/'+code).once('value').then(snap=>{
    if(!snap.exists()){
      showToast('❌ ไม่พบวง "'+code+'"');
      return;
    }
    S.pendingRoomCode=code;S.isHost=false;
    closeModal('modal-join');
    logEvent('join_room',{code,nick:S.nickname||''});
    const lb=$('nickRoomLabel');if(lb)lb.textContent='วง: '+code;
    const bb=$('nickBackBtn');if(bb)bb.setAttribute('onclick','openJoinModal(_joinModalGame||"ww")');
    const ni=$('nickInput');if(ni){ni.value='';setTimeout(()=>ni.focus(),300);}
    showScreen('screen-nick');
  }).catch(err=>{
    console.error('joinRoom error',err);
    showToast('เชื่อมต่อไม่ได้ ลองใหม่');
  });
}
function confirmNick(){
  const i=$('nickInput'),nick=i?i.value.trim():'';
  if(!nick){showToast('ใส่ชื่อด้วยนะ');return}
  if(nick.length>12){showToast('ชื่อยาวเกินไป');return}
  S.nickname=nick;S.roomCode=S.pendingRoomCode;
  waitForFirebaseThenRun(enterLobby);
}
function enterLobby(){
  if(!firebaseReady){
    // ใช้ offline mode — ไม่มี Firebase แต่เล่นคนเดียวได้
    showScreen('screen-lobby');
    const ce=$('lobbyCode'),se=$('shareCode'),rn=$('lobbyRoomName');
    if(ce)ce.textContent='วง · LOCAL';
    if(se)se.textContent='LOCAL';
    if(rn)rn.textContent=S.roomName||'WongPlay';
    renderLobbyUI();
    return;
  }
  const ce=$('lobbyCode'),se=$('shareCode');
  if(ce)ce.textContent=`วง · ${S.roomCode}`;if(se)se.textContent=S.roomCode;
  if(roomRef){roomRef.off();roomRef=null}if(gameRef){gameRef.off();gameRef=null}
  if(wwRef){wwRef.off();wwRef=null}
  // ลบ node เก่าของตัวเองที่ค้างอยู่ (online:false หรือถูกเตะ) ก่อน join ใหม่
  // ใช้ uid จาก Google Auth เพื่อ track ว่าเป็นคนเดิม
  const myUid=currentUser?.uid||null;
  const doJoin=(playerKey)=>{
    S.myPlayerId=playerKey;
    const playerRef=db.ref(`rooms/${S.roomCode}/players/${playerKey}`);
    db.ref(`rooms/${S.roomCode}/kicked/${playerKey}`).remove();
    if(currentUser?.uid){
      db.ref('userSessions/'+currentUser.uid).update({
        activeRoom:S.roomCode,
        activeNick:S.nickname,
        activeIsHost:S.isHost||false,
        activePlayerId:playerKey
      }).catch(()=>{});
    }
    setupLobbyListeners(playerRef);
    saveSessionRoom();
  };
  // ถ้ามี uid ให้ลบ node เก่า + เพิ่ม node ใหม่แบบ atomic ในคำสั่งเดียว
  // ป้องกัน race condition ที่ทำให้มี isHost:true 2 node พร้อมกัน
  // ใช้ auth.uid เป็น playerKey โดยตรง — Rules เช็คได้ว่าใครแก้ node ของตัวเองเท่านั้น
  if(myUid){
    const playerKey=myUid;
    // อ่าน node เก่าของตัวเองก่อน เพื่อ inherit isHost
    db.ref(`rooms/${S.roomCode}/players/${playerKey}`).once('value').then(snap=>{
      const old=snap.val();
      if(old&&old.isHost)S.isHost=true;
      const playerData={name:S.nickname,isHost:S.isHost,joinedAt:old?.joinedAt||Date.now(),online:true,photo:currentUser?.photoURL||'',uid:myUid,pid:myPid||''};
      // ใช้ set() แทน update() เพื่อให้สร้าง node ได้แม้ไม่มี parent (host สร้างห้องใหม่)
      db.ref(`rooms/${S.roomCode}/players/${playerKey}`).set(playerData)
        .then(()=>doJoin(playerKey))
        .catch(()=>doJoin(playerKey));
    }).catch(()=>{
      const playerData={name:S.nickname,isHost:S.isHost,joinedAt:Date.now(),online:true,photo:currentUser?.photoURL||'',uid:myUid,pid:myPid||''};
      db.ref(`rooms/${S.roomCode}/players/${playerKey}`).set(playerData)
        .then(()=>doJoin(playerKey))
        .catch(()=>doJoin(playerKey));
    });
  } else {
    // ไม่มี Google Auth — ไม่ควรเกิดขึ้น แต่ fallback ไว้ก่อน
    const playerKey='guest_'+Date.now();
    const playerData={name:S.nickname,isHost:S.isHost,joinedAt:Date.now(),online:true,photo:'',uid:''};
    db.ref(`rooms/${S.roomCode}/players/${playerKey}`).set(playerData);
    doJoin(playerKey);
  }
  function setupLobbyListeners(playerRef){

  // ── Presence: onDisconnect เก็บ lastSeen แต่ไม่ซ่อน player ──
  // ใช้ lastSeen แทน online:false เพื่อให้รายชื่อไม่หายตอนมือถือ background
  function _setOnDisconnect(){
    playerRef.onDisconnect().update({online:false,lastSeen:Date.now()});
  }
  _setOnDisconnect();

  // ── Re-register presence เมื่อกลับมา foreground ──
  function _reRegisterPresence(){
    if(!S.myPlayerId||!S.roomCode||!firebaseReady)return;
    const ref=db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}`);
    ref.update({online:true,lastSeen:Date.now()});
    ref.onDisconnect().update({online:false,lastSeen:Date.now()});
    // ตรวจ game state — เผื่อหัวห้องเริ่มเกมระหว่างที่เรา background
    if(gameRef)gameRef.once('value').then(gs=>{
      const g=gs.val();
      if(g&&g.started&&g.type){
        const cur=document.querySelector('.screen.active');
        if(cur&&cur.id==='screen-lobby'){selectGame(g.type,false);launchGame(g.type);}
      }
    });
  }

  // visibilitychange: กลับมา foreground
  const _visHandler=()=>{
    if(document.visibilityState==='visible')_reRegisterPresence();
  };
  document.removeEventListener('visibilitychange',_visHandler);
  document.addEventListener('visibilitychange',_visHandler);

  // focus: desktop
  window.addEventListener('focus',_reRegisterPresence,{once:false});

  // Firebase reconnect หลัง offline
  db.ref('.info/connected').on('value',snap=>{
    if(snap.val()===true&&S.myPlayerId&&S.roomCode){
      _reRegisterPresence();
    }
  });
  if(S.isHost&&S.roomName){
    db.ref(`rooms/${S.roomCode}/roomName`).set(S.roomName);
    const rn=$('lobbyRoomName');if(rn)rn.textContent=S.roomName;
  }
  db.ref(`rooms/${S.roomCode}/roomName`).on('value',snap=>{const name=snap.val();if(name){S.roomName=name;const rn=$('lobbyRoomName');if(rn)rn.textContent=name;}});
  // ฟัง kicked list — ใช้ Firebase isHost แทน S.isHost เพื่อความถูกต้องหลังโอนหัวห้อง
  db.ref(`rooms/${S.roomCode}/kicked/${S.myPlayerId}`).on('value',snap=>{
    if(snap.val()===true){
      // ตรวจสอบ isHost ปัจจุบันจาก Firebase ก่อนเตะ
      db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}/isHost`).once('value').then(h=>{
        if(h.val()===true)return; // host จริงๆ ไม่โดนเตะ
        if(location.search)history.replaceState(null,'',location.pathname);
        [roomRef,gameRef,wwRef].forEach(r=>r?.off());
        roomRef=gameRef=wwRef=null;
        Object.assign(S,{roomCode:null,roomName:null,nickname:null,players:[],selectedGame:null,myPlayerId:null,isHost:false});
        clearSessionRoom();
        if(currentUser?.uid)db.ref('userSessions/'+currentUser.uid+'/activeRoom').remove().catch(()=>{});
        showToast('คุณถูกเตะออกจากวง',3500);
        showScreen('screen-home');
      });
    }
  });
  let _lobbyShown=false;
  // grace period: รอ 3.5s หลัง join ก่อนที่จะ treat null snap ว่าห้องถูกปิด
  // ป้องกัน race condition ที่ listener fire ก่อนที่ host จะ write node เสร็จ
  const _lobbyJoinedAt=Date.now();
  roomRef=db.ref(`rooms/${S.roomCode}/players`);
  roomRef.on('value',snap=>{
    if(!snap.exists()&&S.roomCode){
      if(Date.now()-_lobbyJoinedAt < 3500) return; // still in grace period — ignore
      [roomRef,gameRef,wwRef].forEach(r=>r?.off());
      roomRef=gameRef=wwRef=null;
      Object.assign(S,{roomCode:null,roomName:null,nickname:null,players:[],selectedGame:null,myPlayerId:null,isHost:false});
      clearSessionRoom();
      showToast('วงถูกปิดแล้ว',3000);
      showScreen('screen-home');
      return;
    }
    S.players=[];
    snap.forEach(c=>{
      const d=c.val();
      // กรองเฉพาะ node ที่มีข้อมูลครบ (มี name) ป้องกัน undefined error
      if(d&&d.name)S.players.push({id:c.key,...d});
    });
    // sync S.isHost จาก Firebase เสมอ เผื่อมีการโอนหัวห้อง
    const me=S.players.find(p=>p.id===S.myPlayerId);
    if(me&&me.isHost!==S.isHost){
      S.isHost=!!me.isHost;
      if(S.isHost)showToast('คุณเป็นเจ้าของวงแล้ว 👑',3000);
    }
    // ── Auto-promote: ถ้าไม่มี Host เลยในห้อง ให้คนที่ joinedAt เก่าสุดรับตำแหน่ง ──
    // delay 2.5s ก่อน promote — ให้เครื่องใหม่ที่ rejoin มีเวลาเข้ามาแทนที่ก่อน
    const hasHost=S.players.some(p=>p.isHost);
    if(!hasHost&&S.players.length>0&&firebaseReady&&S.roomCode){
      const _snapCode=S.roomCode;
      clearTimeout(window._promoteTimer);
      window._promoteTimer=setTimeout(()=>{
        if(!S.roomCode||S.roomCode!==_snapCode||!firebaseReady)return;
        // อ่านใหม่จาก Firebase โดยตรง ไม่ใช้ S.players ที่อาจ stale
        db.ref(`rooms/${S.roomCode}/players`).once('value').then(fSnap=>{
          const fresh=[];
          fSnap.forEach(c=>{const d=c.val();if(d&&d.name)fresh.push({id:c.key,...d});});
          if(fresh.some(p=>p.isHost))return; // มีคนรับ host แล้ว
          const online=fresh.filter(p=>p.online!==false);
          if(!online.length)return;
          const oldest=online.slice().sort((a,b)=>(a.joinedAt||0)-(b.joinedAt||0))[0];
          if(oldest.id===S.myPlayerId){
            S.isHost=true;
            db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}/isHost`).set(true)
              .then(()=>showToast('คุณเป็นเจ้าของวงแล้ว 👑',3000))
              .catch(()=>{});
          }
        }).catch(()=>{});
      },2500);
    } else {
      clearTimeout(window._promoteTimer);
    }
    // แสดงหน้า lobby ครั้งแรกหลังได้ข้อมูลจริงจาก Firebase
    if(!_lobbyShown){
      _lobbyShown=true;
      showScreen('screen-lobby');
    }
    renderPlayers();renderLobbyUI();saveSessionRoom();
  });
  gameRef=db.ref(`rooms/${S.roomCode}/game`);
  gameRef.on('value',snap=>{
    const g=snap.val();
    if(g&&g.started&&g.type){
      const cur=document.querySelector('.screen.active');const onLobby=cur&&cur.id==='screen-lobby';
      if(onLobby||g.type!==S.selectedGame){selectGame(g.type,false);launchGame(g.type);}
    } else if(!g){
      const cur=document.querySelector('.screen.active');
      if(cur&&!['screen-lobby','screen-home','screen-nick','screen-room'].includes(cur.id)){
        $('confirmOverlay')?.classList.remove('show');$('pauseOverlay')?.classList.remove('show');
        document.querySelectorAll('.game-select-card').forEach(c=>c.classList.remove('selected'));
        const b=$('btnStartGame');if(b)b.disabled=true;S.selectedGame=null;
        renderLobbyUI();showScreen('screen-lobby');
      }
    }
  });
  wwRef=db.ref(`rooms/${S.roomCode}/ww`);
  wwRef.on('value',snap=>{const d=snap.val();if(d)syncWWState(d);});
  db.ref(`rooms/${S.roomCode}/wwTimer`).on('value',snap=>{
    const d=snap.val();
    if(d){S._lastWWTimer=d;const onWW=document.querySelector('.screen.active')?.id==='screen-ww';if(onWW)syncWWTimerState(d);}
  });
  db.ref(`rooms/${S.roomCode}/spy`).on('value',snap=>{
    const d=snap.val();
    if(d&&d.dealt){S._lastSpyData=d;syncSpyState(d);}
    else if(!d){
      // host reset — all clients go back to setup
      if(_spyInterval){clearInterval(_spyInterval);_spyInterval=null;}
      S.spyDealt=false;S.spyFlipped=false;S._lastSpyData=null;
      const onSpy=document.querySelector('.screen.active')?.id==='screen-spyfall';
      if(onSpy){
        const lbl=$('spyPhaseLabel');if(lbl)lbl.textContent='ตั้งค่าเกม';
        renderSpySetup();
      }
    }
  });
  db.ref(`rooms/${S.roomCode}/king`).on('value',snap=>{
    const d=snap.val();
    if(d&&d.dealt)syncKingState(d);
    else if(!d){
      S.kingDealt=false;S.kingFlipped=false;S._kingAssigned=null;
      const onKing=document.querySelector('.screen.active')?.id==='screen-king';
      if(onKing)renderKingSetup();
    }
  });
  db.ref(`rooms/${S.roomCode}/salem`).on('value',snap=>{
    const d=snap.val();
    if(d)syncSalemState(d);
    else{
      const onSalem=document.querySelector('.screen.active')?.id==='screen-salem';
      if(onSalem)renderSalemSetup();
    }
  });
  // หมายเหตุ: showScreen('screen-lobby') ถูกย้ายไปรันใน roomRef.on('value') ครั้งแรก
  // เพื่อให้แน่ใจว่ามีข้อมูลผู้เล่นก่อนแสดงหน้า lobby
  } // end setupLobbyListeners
}
function renderPlayers(){
  const list=$('playersList'),cnt=$('playerCount');if(!list)return;
  let players=S.players.filter(p=>p&&p.name);
  // Host อยู่บนสุดเสมอ
  players.sort((a,b)=>(b.isHost?1:0)-(a.isHost?1:0));
  if(cnt)cnt.textContent=players.length;

  const newIds=new Set(players.map(p=>p.id));

  // คนที่ออกจากวง — เล่น animation ออกก่อนค่อยลบ node จริง
  [...list.children].forEach(row=>{
    if(!newIds.has(row.dataset.pid)&&!row.classList.contains('row-leaving')){
      row.classList.add('row-leaving');
      row.addEventListener('animationend',()=>row.remove(),{once:true});
    }
  });

  let prevEl=null;
  players.forEach((p,i)=>{
    const isMe=p.id===S.myPlayerId;
    const canKick=S.isHost&&!p.isHost&&!isMe;
    const isOffline=p.online===false;
    const avatarHTML=p.photo
      ?`<img src="${esc(p.photo)}" style="width:36px;height:36px;border-radius:50%;flex-shrink:0;object-fit:cover;border:2px solid ${COLORS[i%COLORS.length]}44" />`
      :`<div class="p-avatar" style="background:${COLORS[i%COLORS.length]}28;color:${COLORS[i%COLORS.length]}">${esc(p.name.charAt(0).toUpperCase())}</div>`;
    // badge แถวเดียวกัน: ผู้ดำเนินการเกม | คุณ
    const hostBadge=p.isHost?'<div class="p-badge">ผู้ดำเนินการเกม</div>':'';
    const meBadge=isMe?'<div class="p-badge" style="background:rgba(124,156,255,0.15);color:var(--ac)">คุณ</div>':'';
    const rowHTML=`${avatarHTML}
      <div class="p-name" style="flex:1;min-width:0">${esc(p.name)}${isOffline?' <span style="font-size:11px;color:var(--t2)">(ออกไปชั่วคราว)</span>':''}</div>
      ${hostBadge}${meBadge}
      ${canKick?`<button class="kick-btn" onclick="openKickConfirm('${esc(p.id)}','${esc(p.name)}')" title="เตะออก">✕</button>`:''}`;

    let row=list.querySelector(`.player-row[data-pid="${CSS.escape(p.id)}"]`);
    if(row){
      // คนเดิม — อัปเดตเนื้อหาในที่เดิม ไม่ re-render ใหม่ (กัน animation กระตุก)
      row.style.opacity=isOffline?'0.45':'';
      if(row.innerHTML!==rowHTML)row.innerHTML=rowHTML;
    }else{
      // คนใหม่ — สร้าง node ใหม่พร้อม animation เข้า
      row=document.createElement('div');
      row.className='player-row row-entering';
      row.dataset.pid=p.id;
      row.style.opacity=isOffline?'0.45':'';
      row.innerHTML=rowHTML;
      row.addEventListener('animationend',()=>row.classList.remove('row-entering'),{once:true});
    }
    // จัดเรียงตำแหน่งให้ตรงลำดับ (host บนสุด) โดยไม่รบกวน node ที่มีอยู่แล้ว
    if(prevEl){if(prevEl.nextSibling!==row)list.insertBefore(row,prevEl.nextSibling);}
    else if(list.firstChild!==row)list.insertBefore(row,list.firstChild);
    prevEl=row;
  });
}
function renderLobbyUI(){
  const grid=$('gameSelectGrid'),startBtn=$('btnStartGame'),hint=$('hostHint'),txBtn=$('transferHostBtn');
  // นับทุกคนในห้อง (ไม่ filter online เพราะมือถือ background ทำให้ online:false ชั่วคราว)
  const onlinePlayers=S.players.filter(p=>p&&p.name);
  const nonHostOnline=onlinePlayers.filter(p=>!p.isHost);

  // render game cards กรอง hiddenGames
  if(grid){
    const visibleGames=HOME_GAMES_CONFIG.filter(g=>!g.solo&&!hiddenGames[g.id]);
    const prevSelected=S.selectedGame;
    grid.innerHTML=visibleGames.map(g=>`
      <div class="game-select-card${prevSelected===g.id?' selected':''}" data-game="${g.id}" onclick="selectGame('${g.id}')">
        <div class="gs-icon">${g.icon}</div>
        <div class="gs-name">${g.name}</div>
      </div>`).join('');
    // ถ้าเกมที่เลือกอยู่ถูกซ่อน → ล้าง selection
    if(prevSelected&&hiddenGames[prevSelected]){
      S.selectedGame=null;
      if(startBtn)startBtn.disabled=true;
    }
  }

  if(S.isHost){
    if(grid){grid.style.pointerEvents='auto';grid.style.opacity='1';}
    if(startBtn){
      const wasDisabled=startBtn.disabled;
      startBtn.style.display='';
      startBtn.disabled=!S.selectedGame;
      startBtn.title='';
      // เพิ่ง enabled ขึ้นมา (เลือกเกมเสร็จ) — pulse/glow ให้รู้ว่ากดได้แล้ว
      if(wasDisabled&&!startBtn.disabled){
        startBtn.classList.remove('btn-pulse');
        void startBtn.offsetWidth;// force reflow เพื่อรีสตาร์ท animation
        startBtn.classList.add('btn-pulse');
      }else if(startBtn.disabled){
        startBtn.classList.remove('btn-pulse');
      }
    }
    if(hint)hint.style.display='none';
    if(txBtn)txBtn.style.display=nonHostOnline.length>0?'':'none';
  } else {
    if(grid){grid.style.pointerEvents='none';grid.style.opacity='0.38';}
    if(startBtn)startBtn.style.display='none';
    if(hint)hint.style.display='block';
    if(txBtn)txBtn.style.display='none';
  }
}
let _copyLinkTimer=null;
function copyRoomLink(){
  const url=`${location.origin}${location.pathname}?room=${S.roomCode}`;
  navigator.clipboard?.writeText(url).then(()=>{
    showToast('📋 คัดลอกลิงก์แล้ว!');
    const btn=$('copyLinkBtn'),txt=btn?.querySelector('.copy-link-text');
    if(!btn||!txt)return;
    clearTimeout(_copyLinkTimer);
    btn.classList.add('copied');
    txt.textContent='คัดลอกแล้ว';
    _copyLinkTimer=setTimeout(()=>{
      btn.classList.remove('copied');
      txt.textContent='คัดลอกลิงก์';
    },1500);
  }).catch(()=>showToast('คัดลอกไม่สำเร็จ'));
}
function updateLeaveTransferBtn(){
  const others=S.players.filter(p=>!p.isHost&&p.name);
  const btn=$('leaveTransferBtn');
  if(btn)btn.style.display=others.length?'':'none';
}
function confirmLeaveRoom(){
  // ตรวจ isHost จริงๆ จาก Firebase ก่อนแสดง popup
  if(S.isHost){
    updateLeaveTransferBtn();
    $('leaveConfirmOverlay')?.classList.add('show');
  } else {
    // double-check จาก Firebase เผื่อโอนแล้ว S.isHost ยังไม่อัป
    db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}/isHost`).once('value').then(snap=>{
      if(snap.val()===true){updateLeaveTransferBtn();$('leaveConfirmOverlay')?.classList.add('show');}
      else{leaveRoom();}
    }).catch(()=>leaveRoom());
  }
}
function leaveRoom(){
  $('leaveConfirmOverlay')?.classList.remove('show');
  // ล้าง URL params ไม่ให้ checkDeepLink พาเข้าห้องเดิมอีก
  if(location.search)history.replaceState(null,'',location.pathname);
  // ตรวจ isHost จริงๆ จาก Firebase ก่อนตัดสินใจยุบหรือออก
  const doLeave=(amHost)=>{
    logEvent(amHost?'dissolve_room':'leave_room',{code:S.roomCode,roomName:S.roomName||''});
    if(amHost&&firebaseReady&&S.roomCode){
      // ลบ players ทุกคนก่อน → ทุก client detect ห้องว่างแล้ว redirect home
      // จากนั้นลบ sub-node อื่น (Rules ไม่ให้ set(null) ที่ root room โดยตรง)
      const rc=S.roomCode;
      const wipe={};
      S.players.forEach(p=>{wipe[`players/${p.id}`]=null;});
      wipe['game']=null;
      wipe['ww']=null;
      wipe['wwTimer']=null;
      wipe['spy']=null;
      wipe['king']=null;
      wipe['salem']=null;
      wipe['kicked']=null;
      wipe['roomName']=null;
      db.ref(`rooms/${rc}`).update(wipe).catch(e=>console.error('dissolve:',e.message));
    } else if(firebaseReady&&S.myPlayerId&&S.roomCode){
      const _rc=S.roomCode,_pid=S.myPlayerId;
      db.ref(`rooms/${_rc}/players/${_pid}`).remove().then(()=>{
        // ถ้าหลังออกแล้วไม่มีใคร online เลย ให้ลบห้องทิ้ง
        db.ref(`rooms/${_rc}/players`).once('value').then(ps=>{
          const remaining=ps.exists()?Object.values(ps.val()).filter(p=>p&&p.online!==false):[];
          if(remaining.length===0)db.ref(`rooms/${_rc}`).remove().catch(()=>{});
        }).catch(()=>{});
      }).catch(()=>{});
    }
    [roomRef,gameRef,wwRef].forEach(r=>r?.off());
    roomRef=gameRef=wwRef=null;
    if(currentUser?.uid)db.ref('userSessions/'+currentUser.uid+'/activeRoom').remove().catch(()=>{});
    Object.assign(S,{roomCode:null,roomName:null,nickname:null,players:[],selectedGame:null,myPlayerId:null,isHost:false});
    clearSessionRoom();
    showScreen('screen-home');
  };
  if(firebaseReady&&S.myPlayerId&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}/isHost`).once('value')
      .then(snap=>doLeave(snap.val()===true))
      .catch(()=>doLeave(S.isHost));
  } else {
    doLeave(S.isHost);
  }
}
/* ══ TRANSFER HOST ═══════════════════════ */
const _transferMap=new Map();
function openTransferHost(){
  const others=S.players.filter(p=>!p.isHost&&p.name);
  if(!others.length){showToast('ไม่มีผู้เล่นอื่นในวง');return;}
  _transferMap.clear();
  const list=$('transferPlayerList');
  if(list){
    list.innerHTML=others.map((p,i)=>{
      _transferMap.set('t'+i,{id:p.id,name:p.name});
      return `<button onclick="confirmTransferHost('t${i}')"
        style="display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;background:var(--card2);border:1px solid var(--line);border-radius:var(--r);cursor:pointer;font-family:'Kanit',sans-serif;color:var(--t0)">
        ${p.photo?`<img src="${esc(p.photo)}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0"/>`:`<div style="width:32px;height:32px;border-radius:50%;background:var(--ac-dim);display:flex;align-items:center;justify-content:center;font-weight:900;color:var(--ac);flex-shrink:0">${esc(p.name.charAt(0).toUpperCase())}</div>`}
        <span style="font-size:14px;font-weight:700">${esc(p.name)}</span>
      </button>`;
    }).join('');
  }
  $('transferHostOverlay')?.classList.add('show');
}
function confirmTransferHost(key){
  const target=_transferMap.get(key);
  if(!target){showToast('ไม่พบผู้เล่น');return;}
  if(!firebaseReady||!S.roomCode){showToast('เชื่อมต่อไม่ได้');return;}
  // verify สิทธิ์จาก Firebase ก่อนโอน
  db.ref(`rooms/${S.roomCode}/players/${S.myPlayerId}/isHost`).once('value').then(snap=>{
    if(snap.val()!==true){showToast('คุณไม่ใช่เจ้าของวงแล้ว');return;}
    const updates={};
    updates[`${target.id}/isHost`]=true;
    updates[`${S.myPlayerId}/isHost`]=false;
    db.ref(`rooms/${S.roomCode}/players`).update(updates).then(()=>{
      S.isHost=false;
      $('transferHostOverlay')?.classList.remove('show');
      $('leaveConfirmOverlay')?.classList.remove('show');
      showToast('โอนเจ้าของวงให้ '+target.name+' แล้ว ✅');
      renderPlayers();renderLobbyUI();
    }).catch(err=>showToast('โอนไม่ได้: '+err.message));
  }).catch(()=>showToast('เชื่อมต่อไม่ได้ ลองใหม่'));
}


let _kickTargetId=null;
function openKickConfirm(pid,name){
  _kickTargetId=pid;
  const el=$('kickConfirmName');
  if(el)el.textContent='เตะ "'+name+'" ออก?';
  $('kickConfirmOverlay')?.classList.add('show');
}
function cancelKick(){_kickTargetId=null;$('kickConfirmOverlay')?.classList.remove('show');}
function doKick(){
  if(!_kickTargetId||!S.isHost){cancelKick();return;}
  if(firebaseReady&&S.roomCode){
    const _kickTarget=S.players.find(p=>p.id===_kickTargetId);logEvent('kick_player',{code:S.roomCode,targetId:_kickTargetId,targetNick:_kickTarget?.name||_kickTarget?.nick||_kickTargetId});
    db.ref(`rooms/${S.roomCode}/players/${_kickTargetId}`).remove();
    db.ref(`rooms/${S.roomCode}/kicked/${_kickTargetId}`).set(true);
  }
  cancelKick();
  showToast('เตะผู้เล่นออกแล้ว');
}

/* ══ GAME ════════════════════════════════ */
function selectGame(g,ui=true){
  if(ui&&!S.isHost){showToast('เฉพาะ Host เลือกเกมได้');return}
  S.selectedGame=g;if(!ui)return;
  document.querySelectorAll('.game-select-card').forEach(c=>c.classList.remove('selected'));
  document.querySelector(`[data-game="${g}"]`)?.classList.add('selected');
  const b=$('btnStartGame');if(b)b.disabled=false;
}
function startGame(){
  if(!S.isHost){showToast('เฉพาะ Host เริ่มเกมได้');return}
  if(!S.selectedGame){showToast('เลือกเกมก่อนนะ');return}
  logEvent('start_game',{code:S.roomCode,roomName:S.roomName||'',game:S.selectedGame,playerCount:S.players.length});
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/game`).set({type:S.selectedGame,started:true,startedAt:Date.now()});
  else launchGame(S.selectedGame);
}
function launchGame(type){
  const map={ww:'screen-ww',wheel:'screen-wheel',cards:'screen-cards',spyfall:'screen-spyfall',king:'screen-king',salem:'screen-salem'};
  if(!map[type])return;initGame(type);showScreen(map[type]);
  // solo games: ให้แน่ใจว่าปุ่ม ← แสดงอยู่เสมอ
  if(type==='wheel'||type==='cards'){
    document.querySelectorAll('#screen-'+type+' .btn-icon').forEach(b=>b.style.display='');
    return;
  }
  // board games: ซ่อน back, แสดง menu ให้ host
  document.querySelectorAll('#screen-'+type+' .game-top .btn-icon:first-child').forEach(b=>b.style.display='none');
  document.querySelectorAll('#screen-'+type+' .game-top .btn-icon:last-child').forEach(b=>{b.style.display=S.isHost?'':'none';});
}
function backToLobby(){$('gameoverOverlay')?.classList.remove('show');showScreen('screen-lobby')}
function initGame(type){({ww:initWW,wheel:initWheel,cards:initCards,spyfall:initSpyfall,king:initKing,salem:initSalem})[type]?.()}
function previewGame(type){
  const info={ww:'<p><b>คืนสมิง</b></p><p>Host แจกไพ่บทบาท แต่ละคนกดดูบทบาทตัวเองในมือถือ</p>',wheel:'<p><b>วงล้อ</b></p><p>ใส่ชื่อหรือตัวเลือกได้เอง แล้วปั่น</p>',cards:'<p><b>ไพ่เฮฮา</b></p><p>จั่วไพ่ทีละใบ แต่ละหน้ามีกฎ</p>',spyfall:'<p><b>สายลับกลางวง</b></p><p>ทุกคนรู้สถานที่ ยกเว้นสายลับ — ถามตอบเพื่อหาสายลับ</p>'};
  const b=$('modalInfoBody');if(b)b.innerHTML=info[type]||'';openModal('modal-info');
}
function toggleMenu(){if(!S.isHost)return;$('menuOverlay')?.classList.toggle('show')}
function closeMenu(){$('menuOverlay')?.classList.remove('show')}
function pauseGame(){closeMenu();S.paused=true;stopSpeakSequence();$('pauseOverlay')?.classList.add('show')}
function resumeGame(){S.paused=false;$('pauseOverlay')?.classList.remove('show')}
function confirmEndGame(){closeMenu();$('confirmOverlay')?.classList.add('show')}
function cancelEnd(){$('confirmOverlay')?.classList.remove('show')}
function doEndGame(){
  $('confirmOverlay')?.classList.remove('show');$('pauseOverlay')?.classList.remove('show');
  if(firebaseReady&&S.roomCode){db.ref(`rooms/${S.roomCode}/game`).set(null);db.ref(`rooms/${S.roomCode}/ww`).set(null);db.ref(`rooms/${S.roomCode}/spy`).set(null);db.ref(`rooms/${S.roomCode}/king`).set(null);db.ref(`rooms/${S.roomCode}/salem`).set(null);}
  document.querySelectorAll('.game-select-card').forEach(c=>c.classList.remove('selected'));
  const b=$('btnStartGame');if(b)b.disabled=true;S.selectedGame=null;renderLobbyUI();showScreen('screen-lobby');
}

