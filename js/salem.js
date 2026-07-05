/* ══ SALEM 1692 ══════════════════════════════════════════════ */
const SALEM_CARDS={
  acc1:{id:'acc1',name:'ข้อกล่าวหา',emoji:'⚖️',color:'red',type:'red',value:1,desc:'ใส่ความผู้เล่นคนอื่น +1 แต้ม'},
  acc3:{id:'acc3',name:'หลักฐาน',emoji:'📜',color:'red',type:'red',value:3,desc:'ใส่ความผู้เล่นคนอื่น +3 แต้ม'},
  acc7:{id:'acc7',name:'พยาน',emoji:'👁️',color:'red',type:'red',value:7,desc:'ใส่ความ +7 (ต้องเปิดไพ่ชีวิตทันที)'},
  scapegoat:{id:'scapegoat',name:'แพะรับบาป',emoji:'🐐',color:'green',type:'green',value:0,desc:'รีเซ็ตแต้มของเป้าหมายเป็น 0'},
  curse:{id:'curse',name:'คำสาป',emoji:'🔮',color:'green',type:'green',value:0,desc:'ลบ passive ล่าสุดของเป้าหมาย'},
  alibi:{id:'alibi',name:'ข้อแก้ต่าง',emoji:'🛡️',color:'green',type:'green',value:0,desc:'ลดแต้มตัวเองลง 3'},
  robbery:{id:'robbery',name:'ปล้น',emoji:'💰',color:'green',type:'green',value:0,desc:'ขโมยไพ่ทั้งหมดจากเป้าหมาย'},
  stocks:{id:'stocks',name:'ชื่อคาว',emoji:'⛓️',color:'green',type:'green',value:0,desc:'ข้ามเทิร์นของเป้าหมาย 1 รอบ'},
  arson:{id:'arson',name:'วางเพลิง',emoji:'🔥',color:'green',type:'green',value:0,desc:'บังคับเป้าหมายทิ้งไพ่ทั้งหมด'},
  asylum:{id:'asylum',name:'ที่หลบภัย',emoji:'🏠',color:'blue',type:'blue',value:0,desc:'ป้องกันไม่ให้ถูกฆ่าช่วงกลางคืน'},
  piety:{id:'piety',name:'พลังศรัทธา',emoji:'✝️',color:'blue',type:'blue',value:0,desc:'การ์ดแดงจะไม่มีผลกับผู้นี้'},
  matchmaker:{id:'matchmaker',name:'แม่สื่อ',emoji:'💞',color:'blue',type:'blue',value:0,desc:'เชื่อมคู่ — ถ้าคนใดตาย อีกคนตายตาม'},
  conspiracy:{id:'conspiracy',name:'เจตนาร้าย',emoji:'🕸️',color:'black',type:'black',value:0,desc:'เล่นทันที! ผู้ครอง🐱ต้องเปิดไพ่ชีวิต แล้วทุกคนส่งต่อไพ่ชีวิตซ้าย'},
  night:{id:'night',name:'รัตติกาล',emoji:'🌙',color:'black',type:'black',value:0,desc:'เล่นทันที! เข้าสู่ช่วงกลางคืน'},
  blackcat:{id:'blackcat',name:'แมวดำ',emoji:'🐱',color:'blue',type:'blue',value:0,desc:'ผู้ครองการ์ดนี้เล่นเป็นคนแรก'},
};
const SALEM_DECK_TPL=[
  ...[...Array(10)].map(()=>'acc1'),
  ...[...Array(5)].map(()=>'acc3'),
  ...[...Array(3)].map(()=>'acc7'),
  ...[...Array(3)].map(()=>'scapegoat'),
  ...[...Array(4)].map(()=>'curse'),
  ...[...Array(4)].map(()=>'alibi'),
  ...[...Array(3)].map(()=>'robbery'),
  ...[...Array(3)].map(()=>'stocks'),
  ...[...Array(2)].map(()=>'arson'),
  ...[...Array(3)].map(()=>'asylum'),
  ...[...Array(3)].map(()=>'piety'),
  ...[...Array(2)].map(()=>'matchmaker'),
  'conspiracy','night',
];
const SALEM_TRYAL_SETUP={
  4:{witch:1,constable:1,not:18},5:{witch:1,constable:1,not:23},
  6:{witch:2,constable:1,not:27},7:{witch:2,constable:1,not:32},
  8:{witch:2,constable:1,not:29},9:{witch:2,constable:1,not:33},
  10:{witch:2,constable:1,not:27},11:{witch:2,constable:1,not:30},12:{witch:2,constable:1,not:33},
};
let _salemRef=null,_salemState=null,_salemPendingCard=null,_salemConfessForced=false;

function initSalem(){
  _salemState=null;_salemPendingCard=null;
  // Host ไม่ได้เล่น — แสดงหน้า setup/control เท่านั้น
  if(S.isHost){renderSalemSetup();}
  else{$('salemBody').innerHTML=`<div style="text-align:center;padding:3rem 2rem;color:var(--t2)">⏳ รอ Host เริ่มเกม...</div>`;}
}

function renderSalemSetup(){
  const body=$('salemBody');if(!body)return;
  const nonHostPlayers=S.players.filter(p=>!p.isHost);
  const n=nonHostPlayers.length||4;
  if(!S.salemNumWitches)S.salemNumWitches=SALEM_TRYAL_SETUP[n]?.witch||2;
  const maxWitches=Math.max(1,Math.floor(n/2));
  const setup=SALEM_TRYAL_SETUP[n]||SALEM_TRYAL_SETUP[12];
  body.innerHTML=`
    <div style="padding:var(--pad);display:flex;flex-direction:column;gap:1rem;max-width:480px;margin:0 auto">
      <div style="background:var(--card);border-radius:var(--r);border:1px solid var(--line);padding:1.25rem">
        <div class="label">ผู้เล่น ${n} คน (Host เป็นผู้ดำเนินเกม ไม่ได้รับไพ่)</div>
        <div style="font-size:13px;color:var(--t2);line-height:1.7">
          แจกไพ่ชีวิต 5 ใบ/คน • ไพ่บนมือ 3 ใบ<br>
          จั่ว 2 ใบ/เทิร์น • ใส่ความ 7 แต้ม = เปิดไพ่ชีวิต
        </div>
      </div>
      ${S.isHost?`
      <div style="background:var(--card);border-radius:var(--r);border:1px solid var(--line);padding:1.25rem">
        <div class="label">จำนวนแม่มด (ค่าปกติ: ${setup?.witch||2})</div>
        <div style="display:flex;align-items:center;gap:16px;margin-top:8px">
          <button class="ww-c-btn2" style="width:44px;height:44px;font-size:22px" onclick="S.salemNumWitches=Math.max(1,S.salemNumWitches-1);renderSalemSetup()">−</button>
          <div style="font-size:36px;font-weight:900;color:#c39bd3;flex:1;text-align:center">${S.salemNumWitches} 🧙</div>
          <button class="ww-c-btn2" style="width:44px;height:44px;font-size:22px" onclick="S.salemNumWitches=Math.min(${maxWitches},S.salemNumWitches+1);renderSalemSetup()">+</button>
        </div>
        <div style="font-size:12px;color:var(--t2);text-align:center;margin-top:6px">สูงสุด ${maxWitches} คนสำหรับ ${n} ผู้เล่น</div>
      </div>
      <button class="btn btn-ac btn-full" onclick="salemStartGame()" style="height:56px;font-size:17px" ${n<4?'disabled':''}>🧙 เริ่มเกม Salem 1692</button>
      ${n<4?'<p style="text-align:center;font-size:13px;color:var(--t2)">ต้องมีผู้เล่นอย่างน้อย 4 คน</p>':''}`:''}
    </div>`;
}

function salemStartGame(){
  // Host ไม่นับเป็นผู้เล่น — กรอง host ออก
  const players=S.players.filter(p=>!p.isHost);
  const n=players.length;
  if(n<4){showToast('⚠️ ต้องมีผู้เล่นอย่างน้อย 4 คน (ไม่นับ Host)');return}
  if(n>12){showToast('⚠️ มากสุด 12 คน');return}

  // สร้างสำรับ: shuffle ทุกอย่างรวมกัน รวม night ด้วย (สุ่มตำแหน่งเหมือน Conspiracy)
  const deckTemplate=[...SALEM_DECK_TPL];
  const deck=shuffle(deckTemplate);// night และ conspiracy อยู่ในกองสุ่มปกติ

  const setup=SALEM_TRYAL_SETUP[n]||SALEM_TRYAL_SETUP[12];
  const numWitches=S.salemNumWitches||setup.witch;
  const numConstable=setup.constable;
  const numNot=n*5-numWitches-numConstable;
  const tryalPool=shuffle([
    ...[...Array(numWitches)].map(()=>'witch'),
    ...[...Array(numConstable)].map(()=>'constable'),
    ...[...Array(numNot)].map(()=>'not'),
  ]);
  const pmap={};
  players.forEach((p,i)=>{
    const tryal=[];
    for(let j=0;j<5;j++) tryal.push({type:tryalPool[i*5+j],revealed:false,pos:j});
    // จั่ว 3 ใบ — ห้ามเป็นสีดำ
    const hand=[];
    let attempts=0;
    while(hand.length<3&&deck.length>0&&attempts<deck.length+20){
      attempts++;
      const ci=deck.findIndex(c=>SALEM_CARDS[c]?.type!=='black');
      if(ci<0)break;
      hand.push(deck.splice(ci,1)[0]);
    }
    pmap[p.id]={id:p.id,nick:p.name,isAlive:true,accusePoints:0,hand,tryal,passives:[],skipTurn:false,hasDrawn:false,hasActed:false};
  });
  const firstId=players[0].id;
  // ไม่กำหนด blackcat อัตโนมัติ — Host จะวางเอง
  const salemData={
    started:true,startedAt:Date.now(),
    phase:'playing',currentTurn:null,// null = รอ Host วางแมวดำก่อน
    turnOrder:players.map(p=>p.id),// ลำดับเทิร์น Host ปรับได้
    nightPhase:false,deck,blackCatHolder:null,
    players:pmap,
  };
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem`).set(salemData);
  } else {
    syncSalemState(salemData);
  }
  S.salemArrangeReady={};// track who is done arranging
}

function syncSalemState(data){
  _salemState=data;

  // ตรวจว่าต้องเปิดไพ่ชีวิต (โดนกล่าวหาครบ)
  if(data&&data.forceConfess&&data.forceConfess.pid===S.myPlayerId&&!S.isHost){
    const fc=data.forceConfess;
    if(!S._lastForceConfessAt||fc.at>S._lastForceConfessAt){
      S._lastForceConfessAt=fc.at;
      // clear
      if(firebaseReady&&S.roomCode)db.ref(`rooms/${S.roomCode}/salem/forceConfess`).set(null);
      setTimeout(()=>salemOpenConfess(true),300);
    }
  }

  // ตรวจว่าต้องแจ้งเตือน (arson/robbery/etc)
  if(data&&data.alertMsg&&data.alertMsg.pid===S.myPlayerId&&!S.isHost){
    const am=data.alertMsg;
    if(!S._lastAlertAt||am.at>S._lastAlertAt){
      S._lastAlertAt=am.at;
      if(firebaseReady&&S.roomCode)db.ref(`rooms/${S.roomCode}/salem/alertMsg`).set(null);
      showToast(am.msg,4000);
    }
  }
  // Black Cat notification — แสดงเฉพาะตอน fromConspiracy=true เท่านั้น
  // ตอน Host วางแมวดำเริ่มเกม (fromConspiracy=false) ไม่ต้องขึ้น overlay
  if(data&&data.blackCatEvent&&!S.isHost){
    const bce=data.blackCatEvent;
    if(bce.fromConspiracy&&(!S._lastBCEventAt||bce.at>S._lastBCEventAt)){
      S._lastBCEventAt=bce.at;
      salemShowBlackCatNotification(bce,data);
    } else if(!bce.fromConspiracy){
      // ปิด overlay เก่าถ้าค้างอยู่
      const ev=$('salemEvOv');if(ev)ev.classList.remove('open');
    }
  }
  // blackCatEvent ถูกลบ (=null) → ปิด overlay ให้ทุกคน (กรณีรอผู้ถือเปิดไพ่)
  if(data&&!data.blackCatEvent&&S._lastBCEventAt&&!S.isHost){
    const ev=$('salemEvOv');
    if(ev&&ev.classList.contains('open')&&$('salemEvTitle')?.textContent==='แมวดำ!'){
      ev.classList.remove('open');
    }
  }
  // Conspiracy pick event — re-render ทุกครั้งที่ event หรือ picks เปลี่ยน
  if(data&&data.conspiracyEvent&&!S.isHost){
    const ce=data.conspiracyEvent;
    // แสดง UI ทุกครั้งที่มี event (ทั้งครั้งแรกและเมื่อ picks อัปเดต)
    const eventKey=ce.at+'_'+(Object.keys(data.conspiracyPicks||{}).length);
    if(S._lastConspiracyKey!==eventKey){
      S._lastConspiracyKey=eventKey;
      if(!S._lastConspiracyAt||ce.at>S._lastConspiracyAt) S._lastConspiracyAt=ce.at;
      salemShowConspiracyPickEvent(ce,data);
    }
  }
  // ถ้า conspiracyEvent หายไป → ปิด overlay
  if(data&&!data.conspiracyEvent&&S._lastConspiracyAt&&!S.isHost){
    S._lastConspiracyKey=null;
    const ev=$('salemEvOv');
    if(ev&&ev.classList.contains('open')&&$('salemEvTitle')?.textContent==='เจตนาร้าย!'){
      ev.classList.remove('open');
    }
  }
  // Host: ตรวจ auto-swap เมื่อทุกคน pick แล้ว
  if(S.isHost&&data&&data.conspiracyEvent&&data.conspiracyPicks){
    salemCheckConspiracyAutoSwap(data);
  }
  // Host: แสดง overlay รอ (update ทุกครั้งที่มี pick ใหม่)
  if(S.isHost&&data&&data.conspiracyEvent){
    const ce=data.conspiracyEvent;
    const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
    const alivePlayers=((data.turnOrder)||nonHostIds).map(id=>data.players?.[id]).filter(p=>p&&p.isAlive!==false);
    const picks=data.conspiracyPicks||{};
    const pickedCount=Object.keys(picks).length;
    if(!S._lastConspiracyAt||ce.at>S._lastConspiracyAt){
      S._lastConspiracyAt=ce.at;
    }
    $('salemEvIcon').textContent='🕸️';
    $('salemEvTitle').textContent='เจตนาร้าย!';
    $('salemEvDesc').innerHTML=`รอผู้เล่นทุกคนเลือกไพ่ชีวิต...<br><b style="color:var(--ok)">${pickedCount}/${alivePlayers.length} คน</b>เลือกแล้ว`;
    $('salemEvActions').innerHTML=`<div style="color:var(--t2);font-size:13px;text-align:center">จะ swap อัตโนมัติเมื่อทุกคนเลือกเสร็จ</div>`;
    $('salemEvOv').classList.add('open');
  }
  // Conspiracy done
  if(data&&data.conspiracyDone&&!S.isHost){
    const cd=data.conspiracyDone;
    if(!S._lastConspiracyDoneAt||cd.at>S._lastConspiracyDoneAt){
      S._lastConspiracyDoneAt=cd.at;
      $('salemEvOv').classList.remove('open');
      // แสดง label ว่าไพ่ใบไหนที่ได้รับ
      const myLabel=cd.swapLabels?.[S.myPlayerId];
      if(myLabel){
        showToast(`🔄 ได้รับไพ่จาก ${myLabel.fromNick} (ใบ ${myLabel.fromSlot}) → ตำแหน่งใบ ${myLabel.newSlot}`,5000);
      } else {
        showToast('🔄 ส่งต่อไพ่ชีวิตเสร็จแล้ว!',3000);
      }
    }
  }
  // Night card event broadcast
  if(data&&data.nightCardEvent&&!S.isHost){
    const nce=data.nightCardEvent;
    if(!S._lastNightCardAt||nce.at>S._lastNightCardAt){
      S._lastNightCardAt=nce.at;
      const drawer=data.players?.[nce.by];
      if(drawer&&drawer.id!==S.myPlayerId)salemShowNight();
    }
  }
  // ข้อ 5: Host รับ advanceTurnRequest จาก player แล้ว advance turn
  if(S.isHost&&data&&data.advanceTurnRequest&&data.advanceTurnRequest.at){
    const req=data.advanceTurnRequest;
    if(!S._lastAdvanceReqAt||req.at>S._lastAdvanceReqAt){
      S._lastAdvanceReqAt=req.at;
      // clear request แล้ว advance
      if(firebaseReady&&S.roomCode){
        db.ref(`rooms/${S.roomCode}/salem/advanceTurnRequest`).set(null);
      }
      if(req.triggerNight){
        setTimeout(()=>salemSave({nightPhase:true},'🌙 ไพ่หมด! เข้าสู่กลางคืน',false),50);
      } else {
        setTimeout(()=>salemAdvanceTurn(),50);
      }
      return;
    }
  }
  const onSalem=document.querySelector('.screen.active')?.id==='screen-salem';
  if(!onSalem)return;
  // ถ้า nightPhase จบแล้ว ให้ปิด popup สารภาพที่ค้างอยู่
  if(!data.nightPhase){
    const np=document.getElementById('nightConfessPopup');
    if(np)np.remove();
  }
  renderSalemGame(data);
}

function renderSalemGame(data){
  if(!data||!data.started){renderSalemSetup();return}
  // เรียงตาม turnOrder ถ้ามี ไม่งั้นใช้ S.players
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const turnOrder=data.turnOrder||nonHostIds;
  // ใช้ turnOrder เป็นลำดับแสดงผล
  const players=turnOrder.map(id=>data.players?.[id]).filter(Boolean);
  const myId_=S.myPlayerId;
  const isHost=S.isHost;
  const me=data.players?.[myId_];
  const isMyTurn=!isHost&&data.currentTurn===myId_;
  const turnPlayer=data.players?.[data.currentTurn];

  const sub=$('salemTopSub');
  if(sub)sub.textContent=turnPlayer?(data.currentTurn===myId_?'เทิร์นของคุณ!':'เทิร์นของ '+turnPlayer.nick):'รอเริ่มเทิร์น';
  const tag=$('salemTurnTag');if(tag)tag.style.display=isMyTurn?'':'none';

  renderSalemPboard(players,data,isHost,turnOrder);

  const body=$('salemBody');if(!body)return;

  // ════ HOST VIEW ════
  if(isHost){
    const nonHostPlayers=players;
    const allConfirmed=nonHostPlayers.length>0&&nonHostPlayers.every(p=>p.arrangeConfirmed);
    const confirmedCount=nonHostPlayers.filter(p=>p.arrangeConfirmed).length;
    const hasBCat=!!data.blackCatHolder;
    const turnOrder=data.turnOrder||nonHostPlayers.map(p=>p.id);
    const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
    body.innerHTML=`
      ${!allConfirmed?`<div style="background:rgba(240,192,96,0.1);border-bottom:1px solid rgba(240,192,96,0.25);padding:10px var(--pad);font-size:13px;font-weight:700;color:var(--warn);text-align:center">⏳ รอผู้เล่นดูไพ่ชีวิต: ${confirmedCount}/${nonHostPlayers.length} คนพร้อม</div>`:''}
      ${!hasBCat?`<div style="background:rgba(155,89,182,0.1);border-bottom:1px solid rgba(155,89,182,0.3);padding:10px var(--pad);font-size:13px;font-weight:700;color:#c39bd3;text-align:center">⚠️ ต้องวางแมวดำก่อนเริ่มเกม!</div>`:''}
      ${data.nightPhase?`<div style="background:rgba(30,20,60,0.8);border-bottom:1px solid rgba(155,89,182,0.3);padding:10px var(--pad);font-size:13px;font-weight:700;color:#c39bd3;text-align:center">🌙 ช่วงรัตติกาล</div>`:''}
      <div style="padding:var(--pad)">
        <div class="label">HOST — ไพ่ชีวิตทุกคน</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${players.map(p=>{
            const tryals=p.tryal||[];
            const passEmoji=(p.passives||[]).map(pid=>{const c=SALEM_CARDS[pid];return c?c.emoji:''}).join('');
            const slots=tryals.map((t,si)=>{
              let cls='salem-slot',lbl='🧙';
              if(t.type==='not'){cls+=' nw';lbl='✓'}
              else if(t.type==='constable'){cls+=' cop';lbl='🔍'}
              else cls+=' witch';
              return `<div style="display:flex;flex-direction:column;align-items:center;gap:1px">
                <div class="${cls}" style="opacity:${t.revealed?1:0.4}" title="ใบ ${si+1}">${lbl}</div>
                <div style="font-size:7px;color:var(--t3);font-weight:700">${si+1}</div>
              </div>`;
            }).join('');
            const col=COLORS[nonHostIds.indexOf(p.id)%COLORS.length];
            const turnPos=turnOrder.indexOf(p.id);
            return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--card);border-radius:var(--r-s);border:1px solid var(--line)">
              <div style="width:36px;height:36px;border-radius:50%;background:${col}22;color:${col};display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;flex-shrink:0">${esc(p.nick[0].toUpperCase())}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:14px;font-weight:700;color:var(--t0)">${esc(p.nick)}${p.id===data.currentTurn?' ⚡':''}${p.id===data.blackCatHolder?' 🐱':''}</div>
                ${p.accusePoints>0?`<div style="font-size:11px;color:var(--danger)">⚖️ โดนกล่าวหา ${p.accusePoints}/7</div>`:''}
                ${passEmoji?`<div style="display:flex;flex-wrap:wrap;gap:2px;margin-top:2px">${(p.passives||[]).map(pid=>{const c=SALEM_CARDS[pid];if(!c)return'';const borderColor=c.color==='red'?'rgba(192,57,43,0.6)':c.color==='green'?'rgba(39,174,96,0.5)':c.color==='blue'?'rgba(41,128,185,0.5)':'rgba(255,255,255,0.2)';const bgColor=c.color==='red'?'rgba(192,57,43,0.12)':c.color==='green'?'rgba(39,174,96,0.1)':c.color==='blue'?'rgba(41,128,185,0.1)':'rgba(255,255,255,0.05)';return`<span style="font-size:9px;font-weight:700;padding:2px 5px;border-radius:4px;border:1px solid ${borderColor};background:${bgColor};color:var(--t1)">${c.emoji} ${c.name}</span>`;}).join('')}</div>`:''}
              </div>
              <div style="font-size:11px;color:var(--t2);flex-shrink:0">${turnPos>=0?'เทิร์น '+(turnPos+1):''}</div>
              <div style="display:flex;gap:3px">${slots}</div>
            </div>`;
          }).join('')}
        </div>
        <div style="margin-top:0.75rem">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <div class="label" style="margin:0">ลำดับเทิร์น — <span style="color:var(--warn);font-weight:700">กดค้างแล้วลาก</span></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px" id="salemTurnOrderList">
            ${turnOrder.map((id,i)=>{
              const p=_salemState?.players?.[id];if(!p)return'';
              const col=COLORS[nonHostIds.indexOf(id)%COLORS.length];
              const alive=p.isAlive!==false;
              const isCurrent=id===data.currentTurn;
              const isBCat=id===data.blackCatHolder;
              return `<div data-turnidx="${i}" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:${isCurrent?'rgba(240,192,96,0.12)':'var(--card)'};border:1.5px solid ${isCurrent?'rgba(240,192,96,0.4)':'var(--line)'};border-radius:var(--r-s);opacity:${alive?1:0.4};cursor:grab;touch-action:none;transition:opacity 0.15s,transform 0.15s;user-select:none;">
                <div style="font-size:13px;font-weight:900;color:var(--t2);min-width:18px">${i+1}</div>
                <div style="width:30px;height:30px;border-radius:50%;background:${col}22;color:${col};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;flex-shrink:0">${esc(p.nick[0].toUpperCase())}</div>
                <div style="flex:1;font-size:13px;font-weight:700;color:var(--t0)">${esc(p.nick)}${isBCat?' 🐱':''}${isCurrent?' ⚡':''}</div>
                <div style="color:var(--t3);font-size:18px;padding:0 4px">⠿</div>
              </div>`;
            }).join('')}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:1rem">
          <button class="btn btn-sf" style="height:40px;font-size:13px;padding:0 14px;border-color:rgba(155,89,182,0.4);color:#c39bd3" onclick="salemHostAssignBlackCat()">🐱 วางแมวดำ</button>
          ${hasBCat&&!data.currentTurn?`<button class="btn btn-ac" style="height:40px;font-size:13px;padding:0 14px" onclick="salemStartTurns()">▶ เริ่มเทิร์น</button>`:''}
          <button class="btn btn-sf" style="height:40px;font-size:13px;padding:0 14px" onclick="salemHostNight()">🌙 Night Phase</button>
          <button class="btn btn-sf" style="height:40px;font-size:13px;padding:0 14px" onclick="salemHostSkipTurn()">⏭ ข้ามเทิร์น</button>
          <button class="btn btn-danger" style="height:40px;font-size:13px;padding:0 14px" onclick="salemHostKill()">💀 ตาย</button>
          <button class="btn btn-sf" style="height:40px;font-size:13px;padding:0 14px;border-color:rgba(255,77,109,0.3);color:var(--danger)" onclick="salemHostRemoveBlackCat()">🐱✕ ลบแมวดำ</button>
        </div>
        <div style="margin-top:0.75rem;font-size:12px;color:var(--t2)">เหลือไพ่ในสำรับ: ${data.deck?.length||0} ใบ</div>
      </div>`;
    // bind drag to turn order rows
    requestAnimationFrame(()=>{
      const list=document.getElementById('salemTurnOrderList');
      if(list)[...list.querySelectorAll('[data-turnidx]')].forEach((el,i)=>salemBindCardDrag(el,i,'turnorder'));
    });
    return;
  }

  // ════ PLAYER VIEW ════
  if(!me){body.innerHTML=`<div style="text-align:center;padding:3rem 2rem;color:var(--t2)">ไม่พบข้อมูลของคุณ</div>`;return;}

  // ข้อ 6: ถ้ายังไม่ได้จัดเรียงไพ่ชีวิต — แสดง phase จัดเรียงก่อน
  if(!me.arrangeConfirmed){
    renderSalemArrange(body, me, data);
    return;
  }

  // ── Night Phase / Confess Phase ──
  if(data.nightPhase){
    renderSalemNightPhase(body,me,data,players,turnOrder);
    return;
  }

  const tryals=me.tryal||[];
  const hand=me.hand||[];
  const deckCount=data.deck?.length||0;
  const passives=me.passives||[];
  const passiveCards=passives.map(pid=>SALEM_CARDS[pid]).filter(Boolean);

  // Activity log (แสดงการกระทำล่าสุด)
  const lastAct=data.lastAction;
  const actBanner=lastAct?`<div style="padding:8px var(--pad);background:rgba(124,156,255,0.08);border-bottom:1px solid rgba(124,156,255,0.15);font-size:12px;color:var(--ac);text-align:center;font-weight:700">📋 ${esc(lastAct)}</div>`:'';

  body.innerHTML=`
    ${actBanner}
    ${!data.currentTurn?`<div style="background:rgba(240,192,96,0.1);border-bottom:1px solid rgba(240,192,96,0.25);padding:10px var(--pad);font-size:13px;font-weight:700;color:var(--warn);text-align:center">⏳ รอ Host วางแมวดำและเริ่มเทิร์น...</div>`:''}

    <div style="padding:var(--pad) var(--pad) 0.75rem">
      <div class="label">ไพ่ชีวิตของคุณ — กดเพื่อดู (กดซ้ำเพื่อซ่อน)</div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:0.75rem">
        ${tryals.map((t,i)=>{
          const flipped=t.revealed;
          let bc='not-witch',be='✅',bl='บริสุทธิ์';
          if(t.type==='witch'){bc='witch';be='🧙';bl='แม่มด!'}
          if(t.type==='constable'){bc='constable';be='🔍';bl='สายตรวจ'}
          const revealedColor=bc==='witch'?'#d7bde2':bc==='constable'?'#7fb3d3':'#82e0aa';
          if(flipped){
            return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="font-size:10px;font-weight:800;color:var(--t3)">ใบ ${i+1}</div>
              <div class="salem-tcard flipped" style="width:100%;height:0;padding-bottom:155%">
                <div class="salem-tcard-inner" style="position:absolute;inset:0">
                  <div class="salem-tcard-front" style="font-size:clamp(18px,4vw,26px)">🂠</div>
                  <div class="salem-tcard-back ${bc}" style="gap:6px">
                    <div class="salem-tcard-emoji" style="font-size:clamp(22px,5vw,30px)">${be}</div>
                    <div class="salem-tcard-lbl" style="color:${revealedColor};font-size:clamp(8px,2.5vw,11px)">${bl}</div>
                  </div>
                </div>
              </div>
            </div>`;
          }
          return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="font-size:10px;font-weight:800;color:var(--t3)">ใบ ${i+1}</div>
            <div class="salem-tcard" id="tryalCard${i}" style="width:100%;height:0;padding-bottom:155%;position:relative"
              onclick="salemPeekStart(${i})">
              <div class="salem-tcard-inner" style="position:absolute;inset:0" id="tryalInner${i}">
                <div class="salem-tcard-front" style="font-size:clamp(18px,4vw,26px)">🂠</div>
                <div class="salem-tcard-back ${bc}" style="gap:6px">
                  <div class="salem-tcard-emoji" style="font-size:clamp(22px,5vw,30px)">${be}</div>
                  <div class="salem-tcard-lbl" style="color:${revealedColor};font-size:clamp(8px,2.5vw,11px)">${bl}</div>
                </div>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    ${passiveCards.length?`
    <div style="padding:0 var(--pad) 0.75rem">
      <div class="label">การ์ด Passive หน้าคุณ</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${passiveCards.map(c=>{
          const borderColor=c.color==='red'?'rgba(192,57,43,0.6)':c.color==='green'?'rgba(39,174,96,0.5)':'rgba(41,128,185,0.5)';
          const bgColor=c.color==='red'?'rgba(192,57,43,0.12)':c.color==='green'?'rgba(39,174,96,0.1)':'rgba(41,128,185,0.12)';
          const textColor=c.color==='red'?'#e74c3c':c.color==='green'?'#2ecc71':'#7fb3d3';
          return`<div style="display:flex;flex-direction:column;gap:3px;padding:7px 11px;background:${bgColor};border:1.5px solid ${borderColor};border-radius:var(--r-s);min-width:80px">
            <div style="font-size:16px">${c.emoji}</div>
            <div style="font-size:11px;font-weight:800;color:${textColor}">${c.name}</div>
            <div style="font-size:9px;color:var(--t2);line-height:1.4">${c.desc}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`:''}

    <div style="padding:0 var(--pad) 0.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;gap:8px;flex-wrap:wrap">
        <div class="label" style="margin:0">ไพ่บนมือ (${hand.length} ใบ) · สำรับ ${deckCount} ใบ</div>
        ${isMyTurn?`
          <div style="display:flex;gap:6px;align-items:center">
            ${!me.hasDrawn&&!me.hasActed?`<button class="btn btn-ac" style="height:40px;font-size:13px;padding:0 16px;font-weight:800" onclick="salemDraw()">🃏 จั่ว 2 ใบ</button>`:''}
            <button class="btn btn-sf" style="height:40px;font-size:13px;padding:0 16px;border-color:rgba(78,202,139,0.4);color:var(--ok);font-weight:800" onclick="salemEndTurn()">✅ จบเทิร์น</button>
          </div>`:''}
      </div>
      ${isMyTurn&&!me.hasDrawn&&!me.hasActed?`<div style="font-size:13px;color:var(--warn);padding:4px 0;font-weight:700">⚡ เทิร์นคุณ — จั่วไพ่ หรือ กดเล่นไพ่ได้เลย แล้วกด จบเทิร์น</div>`:''}
      ${isMyTurn&&me.hasDrawn?`<div style="font-size:13px;color:var(--ok);padding:4px 0;font-weight:700">✅ จั่วแล้ว — เล่นไพ่ไม่ได้แล้ว กด จบเทิร์น</div>`:''}
      ${isMyTurn&&me.hasActed&&!me.hasDrawn?`<div style="font-size:13px;color:var(--ac);padding:4px 0;font-weight:700">🃏 เล่นไพ่แล้ว — ตอนนี้จั่วไม่ได้แล้ว กด จบเทิร์น</div>`:''}
    </div>
    <div class="salem-hand-grid">
      ${hand.map((cid,idx)=>{
        const c=SALEM_CARDS[cid];if(!c)return'';
        const isNewlyDrawn=me.hasDrawn&&(me.newlyDrawnStart||0)>=0&&idx>=(me.newlyDrawnStart||0);
        const canPlay=isMyTurn&&c.type!=='black'&&!me.hasDrawn;// จั่วแล้วเล่นไพ่ไม่ได้
        const clickFn=canPlay?`salemPlayCard('${cid}',${idx})`:`salemShowCard('${cid}')`;
        const dimmed=!isMyTurn||c.type==='black'||me.hasDrawn;// จั่วแล้วทำให้ไพ่จาง
        return `<div class="salem-pcard ${c.color}${isNewlyDrawn?' newly-drawn':''}" style="${dimmed?'opacity:0.5;':''}" onclick="${clickFn}">
          <div class="salem-stripe ${c.color}"></div>
          <div class="salem-pcard-emoji">${c.emoji}</div>
          <div class="salem-pcard-name">${c.name}</div>
          ${c.value?`<div class="salem-pcard-val">+${c.value}</div>`:''}
          <div class="salem-pcard-tag ${c.color}">${c.color==='red'?'กล่าวหา':c.color==='green'?'Action':c.color==='blue'?'Passive':'เหตุการณ์'}</div>
          <div class="salem-pcard-desc">${c.desc}</div>
        </div>`;
      }).join('')}
      ${hand.length===0&&isMyTurn?`<div style="grid-column:1/-1;text-align:center;color:var(--t3);font-size:13px;padding:1rem">มือว่าง — กด จั่ว 2 ใบ ได้เลย</div>`:''}
      ${hand.length===0&&!isMyTurn?`<div style="grid-column:1/-1;text-align:center;color:var(--t3);font-size:13px;padding:1rem">ไม่มีไพ่บนมือ</div>`:''}
    </div>
  `;
}

/* ── Night Phase: สารภาพบาป เรียงทีละคนตาม turnOrder ── */
function renderSalemNightPhase(body,me,data,players,turnOrder){
  const alivePlayers=turnOrder.map(id=>data.players?.[id]).filter(p=>p&&p.isAlive!==false);
  const confessOrder=alivePlayers;
  const currentConfessIdx=confessOrder.findIndex(p=>p.nightConfessed===undefined||p.nightConfessed===null);
  const currentConfessor=currentConfessIdx>=0?confessOrder[currentConfessIdx]:null;
  const isMyTurnToConfess=currentConfessor&&currentConfessor.id===S.myPlayerId;
  const allDone=currentConfessIdx<0;
  const myTryals=me.tryal||[];

  // Host: ถ้า allDone → ไม่ auto-end แล้ว รอ Host กด ปุ่ม "จบกลางคืน" แทน
  // (auto-end เดิมทำให้หน้าค้างเพราะ render ซ้ำก่อน state sync)

  // Constable protect: Host ใส่ค้อนในรายชื่อ
  const constableProtectSection=S.isHost?`
    <div style="margin:0 var(--pad) var(--pad);background:rgba(41,128,185,0.1);border:1px solid rgba(41,128,185,0.3);border-radius:var(--r-s);padding:12px 14px">
      <div class="label" style="color:#7fb3d3;margin-bottom:8px">🔍 สายตรวจ — เลือกปกป้อง 1 คน</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${alivePlayers.map(p=>{
          const isProtected=data.constableProtect===p.id;
          return `<button onclick="salemHostConstableProtect('${p.id}')" style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:${isProtected?'rgba(41,128,185,0.25)':'var(--card)'};border:1.5px solid ${isProtected?'rgba(41,128,185,0.6)':'var(--line)'};border-radius:var(--r-s);cursor:pointer;font-family:Kanit,sans-serif;text-align:left;width:100%">
            <span style="font-size:16px">${isProtected?'🔍':'👤'}</span>
            <span style="font-size:14px;font-weight:700;color:var(--t0)">${esc(p.nick)}</span>
            ${isProtected?'<span style="font-size:11px;color:#7fb3d3;margin-left:auto">ปกป้องอยู่</span>':''}
          </button>`;
        }).join('')}
        ${data.constableProtect?`<button onclick="salemHostConstableProtect(null)" style="padding:6px 12px;background:transparent;border:1px solid var(--line);border-radius:var(--r-s);cursor:pointer;font-size:12px;color:var(--t2);font-family:Kanit,sans-serif">✕ ยกเลิกการปกป้อง</button>`:''}
      </div>
    </div>`:'';

  body.innerHTML=`
    <div style="background:rgba(30,20,60,0.85);border-bottom:1px solid rgba(155,89,182,0.3);padding:12px var(--pad);text-align:center">
      <div style="font-size:22px;margin-bottom:4px">🌙</div>
      <div style="font-size:15px;font-weight:900;color:#c39bd3">ช่วงรัตติกาล — สารภาพบาป</div>
      <div style="font-size:12px;color:rgba(195,155,211,0.7);margin-top:2px">${allDone?'✅ ทุกคนตัดสินใจแล้ว':'เรียงทีละคนตามลำดับเทิร์น'}</div>
    </div>
    ${constableProtectSection}
    <div style="padding:var(--pad);display:flex;flex-direction:column;gap:8px;max-width:480px;margin:0 auto">
      ${confessOrder.map(p=>{
        const done=p.nightConfessed!==undefined&&p.nightConfessed!==null;
        const isCurrent=currentConfessor&&p.id===currentConfessor.id;
        const isMe=p.id===S.myPlayerId;
        return `<div style="padding:12px 14px;border-radius:var(--r-s);border:1.5px solid ${isCurrent?'rgba(240,192,96,0.5)':done?'rgba(78,202,139,0.3)':'var(--line)'};background:${isCurrent?'rgba(240,192,96,0.08)':done?'rgba(78,202,139,0.05)':'var(--card)'};display:flex;align-items:center;gap:10px">
          <div style="font-size:18px">${done?(p.nightConfessed?'🙏':'🚫'):(isCurrent?'⚡':'⏳')}</div>
          <div style="flex:1;font-size:14px;font-weight:700;color:${isCurrent?'var(--warn)':done?'var(--ok)':'var(--t1)'}">${esc(p.nick)}${isMe?' (คุณ)':''}</div>
          <div style="font-size:12px;color:var(--t2)">${done?(p.nightConfessed?'สารภาพ':'ไม่สารภาพ'):isCurrent?'กำลังตัดสินใจ...':''}</div>
        </div>`;
      }).join('')}
      ${allDone&&!S.isHost?`
        <div style="margin-top:0.5rem;text-align:center;font-size:13px;color:rgba(195,155,211,0.7)">กำลังรอ Host จบกลางคืน...</div>
      `:''}
      ${allDone&&S.isHost?`
        <button class="btn btn-ac btn-full" style="height:52px;font-size:16px;font-weight:800;margin-top:0.5rem;background:linear-gradient(180deg,#c39bd3,#9b59b6)" onclick="salemHostEndNight()">☀️ จบกลางคืน — เริ่มกลางวัน</button>
      `:''}
    </div>
  `;

  // แสดง popup confess (เป็น popup ลอยขึ้น) สำหรับผู้เล่นที่ถึงคิว
  if(isMyTurnToConfess&&!document.getElementById('nightConfessPopup')){
    salemShowNightConfessPopup(myTryals);
  }
}

let _nightSelectedCard=-1;

function salemShowNightConfessPopup(myTryals){
  // สร้าง popup overlay
  let pop=document.getElementById('nightConfessPopup');
  if(!pop){
    pop=document.createElement('div');
    pop.id='nightConfessPopup';
    pop.style.cssText='position:fixed;inset:0;z-index:600;background:rgba(0,0,0,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:2rem;text-align:center;animation:fadeIn 0.2s both';
    document.body.appendChild(pop);
  }
  _nightSelectedCard=-1;
  pop.innerHTML=`
    <div style="font-size:44px">🌙</div>
    <div style="font-size:20px;font-weight:900;color:var(--warn)">ถึงคิวคุณแล้ว!</div>
    <div style="font-size:14px;color:var(--t2);line-height:1.7">จะสารภาพบาปไหม?<br>ถ้าสารภาพ → เลือกไพ่ชีวิตที่จะเปิด</div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;width:100%;max-width:340px;margin:0.5rem 0" id="nightPopGrid">
      ${myTryals.map((t,i)=>{
        if(t.revealed)return`<div style="display:flex;flex-direction:column;align-items:center;gap:3px"><div style="font-size:9px;color:var(--t3)">ใบ ${i+1}</div><div style="width:100%;aspect-ratio:0.65;background:var(--card2);border-radius:8px;opacity:0.3;display:flex;align-items:center;justify-content:center;font-size:14px">✓</div></div>`;
        return`<div style="display:flex;flex-direction:column;align-items:center;gap:3px">
          <div style="font-size:9px;color:var(--t3)">ใบ ${i+1}</div>
          <div id="npCard${i}" onclick="salemNightSelectCard(${i})" style="width:100%;aspect-ratio:0.65;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:8px;border:2px solid rgba(240,192,96,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;transition:all 0.15s">🂠</div>
        </div>`;
      }).join('')}
    </div>
    <div id="nightPopInfo" style="font-size:13px;color:var(--t2)">กดไพ่ที่จะเปิด (ถ้าจะสารภาพ)</div>
    <div style="display:flex;gap:10px;width:100%;max-width:320px">
      <button class="btn btn-sf" style="flex:1;height:50px;font-size:14px;border-color:rgba(240,96,96,0.3);color:var(--danger)" onclick="salemNightConfess(false)">🚫 ไม่สารภาพ</button>
      <button class="btn btn-ac" style="flex:1;height:50px;font-size:14px" id="btnNightConfess" disabled onclick="salemNightConfess(true)">🙏 สารภาพ</button>
    </div>
  `;
}

function salemNightSelectCard(idx){
  _nightSelectedCard=idx;
  document.querySelectorAll('[id^="npCard"]').forEach(el=>{
    el.style.border='2px solid rgba(240,192,96,0.3)';
  });
  const card=document.getElementById('npCard'+idx);
  if(card){card.style.border='3px solid var(--ok)';card.style.boxShadow='0 0 12px rgba(78,202,139,0.4)';}
  const info=document.getElementById('nightPopInfo');
  if(info)info.textContent='ใบ '+(idx+1)+' ถูกเลือก';
  const btn=document.getElementById('btnNightConfess');
  if(btn)btn.disabled=false;
}

function salemNightConfess(doConfess){
  if(!_salemState)return;
  const me=_salemState.players?.[S.myPlayerId];if(!me)return;
  const updates={[`players/${S.myPlayerId}/nightConfessed`]:doConfess};
  if(doConfess){
    if(_nightSelectedCard<0){showToast('⚠️ เลือกไพ่ก่อน');return;}
    const tryals=JSON.parse(JSON.stringify(me.tryal||[]));
    if(tryals[_nightSelectedCard]?.revealed){showToast('ใบนี้เปิดแล้ว');return;}
    tryals[_nightSelectedCard]={...tryals[_nightSelectedCard],revealed:true};
    updates[`players/${S.myPlayerId}/tryal`]=tryals;
    updates.lastAction=me.nick+' สารภาพบาป — เปิดไพ่ชีวิตใบ '+(_nightSelectedCard+1);
  } else {
    updates.lastAction=me.nick+' ไม่สารภาพบาป';
  }
  _nightSelectedCard=-1;
  // ปิด popup
  const pop=document.getElementById('nightConfessPopup');
  if(pop)pop.remove();

  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem`).update(updates).then(()=>{
      showToast(doConfess?'🙏 สารภาพแล้ว':'🚫 ไม่สารภาพ');
      if(doConfess)setTimeout(()=>{if(_salemState)salemCheckWitchDeath(_salemState,S.myPlayerId);},600);
    });
  } else {
    if(me)Object.assign(me,{nightConfessed:doConfess});
    syncSalemState(_salemState);
    showToast(doConfess?'🙏 สารภาพแล้ว':'🚫 ไม่สารภาพ');
  }
}

/* ── Host จบ Night Phase ── */
function salemHostEndNight(){
  if(!S.isHost||!_salemState)return;
  const updates={nightPhase:false,blackCatHolder:null,constableProtect:null};
  Object.values(_salemState.players||{}).forEach(p=>{
    updates[`players/${p.id}/nightConfessed`]=null;
    const newPassives=(p.passives||[]).filter(x=>x!=='blackcat');
    if((p.passives||[]).includes('blackcat'))updates[`players/${p.id}/passives`]=newPassives;
  });
  updates.currentTurn=null;
  salemSave(updates,'☀️ จบกลางคืน — Host วางแมวดำใหม่เพื่อเริ่มรอบต่อไป',false);
}

/* ── Constable protect ── */
function salemHostConstableProtect(pid){
  if(!S.isHost||!_salemState)return;
  const updates={constableProtect:pid||null};
  salemSave(updates,'',false);
}
function salemLogAction(msg){
  if(firebaseReady&&S.roomCode)db.ref(`rooms/${S.roomCode}/salem/lastAction`).set(msg);
  else if(_salemState)_salemState.lastAction=msg;
}

/* ── Arrangement Phase ── */
let _salemDragIdx=null,_salemDragTryals=null;

function renderSalemArrange(body,me,data){
  const tryals=me.tryal||[];
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const totalPlayers=nonHostIds.length;
  const confirmedCount=Object.values(data.players||{}).filter(p=>p.arrangeConfirmed).length;

  // ถ้า grid มีอยู่แล้ว (ผู้เล่นกำลังดูไพ่) → อัปเดตแค่ counter ไม่ re-render เพื่อกันไพ่ปิดเอง
  const existingGrid=document.getElementById('salemArrangeGrid');
  if(existingGrid){
    const ctr=document.getElementById('arrangeCounter');
    if(ctr)ctr.textContent=`${confirmedCount}/${totalPlayers} คนพร้อมแล้ว`;
    // ไม่ re-render body เลย — ไพ่ที่เปิดไว้จะยังคงเปิดอยู่
    return;
  }
  // ยังไม่มี grid → render ใหม่ได้ปกติ (แต่ต้องไม่ re-render body ถ้า body มีเนื้อหาอยู่แล้ว)
  const existingBody=document.getElementById('salemArrangeBody');
  if(existingBody){
    // body stub มีอยู่แล้ว (rare case) — skip
    return;
  }

  body.innerHTML=`
    <div style="padding:var(--pad);display:flex;flex-direction:column;align-items:center;gap:1rem;max-width:480px;margin:0 auto">
      <div style="font-size:44px;margin-bottom:0.25rem">🎴</div>
      <div style="font-size:18px;font-weight:900;color:var(--t0);text-align:center">จัดเรียงไพ่ชีวิต</div>
      <div style="font-size:13px;color:var(--t2);text-align:center;line-height:1.75">กดเพื่อดูไพ่ · <b style="color:var(--warn)">กดค้างแล้วลากสลับ</b><br>เมื่อจัดเรียงแล้ว กด <b style="color:var(--ok)">เสร็จสิ้น</b></div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;width:100%;margin:0.5rem 0" id="salemArrangeGrid"></div>
      <div style="font-size:13px;font-weight:700;color:var(--ac);text-align:center" id="arrangeCounter">${confirmedCount}/${totalPlayers} คนพร้อมแล้ว</div>
      <button class="btn btn-ac btn-full" style="height:56px;font-size:17px;font-weight:800" onclick="salemConfirmArrange()">✅ เสร็จสิ้น — พร้อมแล้ว!</button>
    </div>`;

  _salemDragTryals=JSON.parse(JSON.stringify(tryals));
  salemRenderArrangeCards(_salemDragTryals);
}

function salemRenderArrangeCards(tryals){
  const grid=document.getElementById('salemArrangeGrid');
  if(!grid)return;
  grid.innerHTML='';
  tryals.forEach((t,i)=>{
    let bc='not-witch',be='✅',bl='บริสุทธิ์',revColor='#82e0aa';
    if(t.type==='witch'){bc='witch';be='🧙';bl='แม่มด!';revColor='#d7bde2'}
    if(t.type==='constable'){bc='constable';be='🔍';bl='สายตรวจ';revColor='#7fb3d3'}
    const isOpen=!!t._open;

    const wrapper=document.createElement('div');
    wrapper.style.cssText='width:100%;aspect-ratio:0.65;position:relative;touch-action:none;cursor:grab;border-radius:12px;transition:opacity 0.15s,transform 0.15s;';
    wrapper.dataset.idx=String(i);
    wrapper.dataset.dragtype='arrange';

    const inner=document.createElement('div');
    inner.id='arrInner'+i;
    inner.style.cssText=`position:absolute;inset:0;transform-style:preserve-3d;transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);transform:${isOpen?'rotateY(180deg)':'rotateY(0deg)'};`;

    inner.innerHTML=`
      <div style="position:absolute;inset:0;border-radius:12px;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid rgba(124,156,255,0.3);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">
        <div style="font-size:clamp(18px,4vw,26px)">🂠</div>
        <div style="font-size:9px;color:rgba(232,234,240,0.35);text-align:center;line-height:1.4">แตะ=ดู<br>ค้าง=ลาก</div>
      </div>
      <div style="position:absolute;inset:0;border-radius:12px;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:rotateY(180deg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:6px;border:2px solid;
        ${bc==='witch'?'background:linear-gradient(135deg,#2d1b4e,#4a0e4e);border-color:rgba(155,89,182,0.6)':bc==='constable'?'background:linear-gradient(135deg,#0d1f3c,#1a3a6a);border-color:rgba(41,128,185,0.6)':'background:linear-gradient(135deg,#0d2e1a,#1a4a2a);border-color:rgba(39,174,96,0.6)'}">
        <div style="font-size:clamp(20px,5vw,28px)">${be}</div>
        <div style="font-size:clamp(8px,2.5vw,11px);font-weight:700;text-align:center;color:${revColor}">${bl}</div>
        <div style="font-size:clamp(7px,2vw,9px);color:rgba(255,255,255,0.35)">ใบ ${i+1}</div>
      </div>`;

    wrapper.appendChild(inner);
    grid.appendChild(wrapper);
    salemBindCardDrag(wrapper,i,'arrange');
  });
}

/* ══ Universal smooth drag system ══ */
let _uDrag={active:false,ghost:null,src:null,srcIdx:-1,type:'',insertIdx:-1};

function salemBindCardDrag(el,idx,type){
  let pressTimer=null,startX=0,startY=0,moved=false;

  el.addEventListener('pointerdown',e=>{
    startX=e.clientX;startY=e.clientY;moved=false;
    pressTimer=setTimeout(()=>{
      startDrag(e,el,idx,type);
    },200);
  },{passive:true});

  el.addEventListener('pointermove',e=>{
    if(Math.abs(e.clientX-startX)+Math.abs(e.clientY-startY)>6)moved=true;
    if(_uDrag.active&&_uDrag.srcIdx===idx)moveDrag(e);
  },{passive:true});

  el.addEventListener('pointerup',e=>{
    clearTimeout(pressTimer);
    if(_uDrag.active&&_uDrag.srcIdx===idx){endDrag(e);}
    else if(!moved){
      // tap = flip
      if(type==='arrange')salemArrangeFlipLocal(idx);
    }
  },{passive:true});

  el.addEventListener('pointercancel',()=>{clearTimeout(pressTimer);if(_uDrag.active)cancelDrag();},{passive:true});
}

function startDrag(e,el,idx,type){
  const rect=el.getBoundingClientRect();
  // create ghost
  const ghost=el.cloneNode(true);
  ghost.style.cssText=`position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;z-index:9999;pointer-events:none;opacity:0.88;transform:scale(1.08);box-shadow:0 16px 40px rgba(0,0,0,0.6);transition:none;border-radius:12px;`;
  document.body.appendChild(ghost);

  el.style.opacity='0.25';
  el.style.transform='scale(0.95)';

  _uDrag={active:true,ghost,src:el,srcIdx:idx,type,insertIdx:-1,offX:e.clientX-rect.left,offY:e.clientY-rect.top};
  _salemDragIdx=idx;

  // add global move/up
  document.addEventListener('pointermove',_dragGlobalMove,{passive:true});
  document.addEventListener('pointerup',_dragGlobalUp,{passive:true});
  if(navigator.vibrate)navigator.vibrate(30);
}

function _dragGlobalMove(e){if(_uDrag.active)moveDrag(e);}
function _dragGlobalUp(e){if(_uDrag.active)endDrag(e);}

function moveDrag(e){
  if(!_uDrag.ghost)return;
  const gx=e.clientX-_uDrag.offX;
  const gy=e.clientY-_uDrag.offY;
  _uDrag.ghost.style.left=gx+'px';
  _uDrag.ghost.style.top=gy+'px';

  if(_uDrag.type==='arrange')updateArrangeInsert(e.clientX,e.clientY);
  else if(_uDrag.type==='turnorder')updateTurnInsert(e.clientY);
}

function updateArrangeInsert(cx,cy){
  const grid=document.getElementById('salemArrangeGrid');
  if(!grid)return;
  clearInsertLines(grid);
  const items=[...grid.children];
  let best=-1,bestDist=Infinity;
  items.forEach((el,i)=>{
    if(i===_uDrag.srcIdx)return;
    const r=el.getBoundingClientRect();
    const ex=r.left+r.width/2,ey=r.top+r.height/2;
    const d=Math.hypot(cx-ex,cy-ey);
    if(d<bestDist){bestDist=d;best=i;}
  });
  _uDrag.insertIdx=best;
  if(best>=0){
    items[best].style.outline='3px solid var(--warn)';
    items[best].style.outlineOffset='3px';
  }
}

function updateTurnInsert(cy){
  const list=document.getElementById('salemTurnOrderList');
  if(!list)return;
  clearInsertLines(list);
  const items=[...list.querySelectorAll('[data-turnidx]')];
  let insertBefore=-1;
  for(let i=0;i<items.length;i++){
    if(i===_uDrag.srcIdx)continue;
    const r=items[i].getBoundingClientRect();
    const mid=r.top+r.height/2;
    if(cy<mid){insertBefore=i;break;}
  }
  if(insertBefore===-1)insertBefore=items.length;
  _uDrag.insertIdx=insertBefore;
  // draw insert line
  if(insertBefore<items.length){
    items[insertBefore].style.borderTop='3px solid var(--warn)';
  } else if(items.length>0){
    items[items.length-1].style.borderBottom='3px solid var(--warn)';
  }
}

function clearInsertLines(container){
  container.querySelectorAll('[data-turnidx],[data-idx]').forEach(el=>{
    el.style.outline='';el.style.outlineOffset='';
    el.style.borderTop='';el.style.borderBottom='';
  });
}

function endDrag(e){
  document.removeEventListener('pointermove',_dragGlobalMove);
  document.removeEventListener('pointerup',_dragGlobalUp);

  if(_uDrag.ghost){_uDrag.ghost.remove();_uDrag.ghost=null;}
  if(_uDrag.src){_uDrag.src.style.opacity='';_uDrag.src.style.transform='';}

  const insertIdx=_uDrag.insertIdx;
  const srcIdx=_uDrag.srcIdx;
  const type=_uDrag.type;
  _uDrag={active:false,ghost:null,src:null,srcIdx:-1,type:'',insertIdx:-1};
  _salemDragIdx=null;

  if(insertIdx>=0&&insertIdx!==srcIdx){
    if(type==='arrange'&&_salemDragTryals){
      // swap
      const arr=_salemDragTryals;
      const tmp=arr[srcIdx];arr[srcIdx]=arr[insertIdx];arr[insertIdx]=tmp;
      salemRenderArrangeCards(arr);
    } else if(type==='turnorder'&&_salemState){
      const to=[...(_salemState.turnOrder||S.players.filter(p=>!p.isHost).map(p=>p.id))];
      const [moved]=to.splice(srcIdx,1);
      const dest=insertIdx>srcIdx?insertIdx-1:insertIdx;
      to.splice(dest,0,moved);
      salemSave({turnOrder:to},'',false);
    }
  } else {
    // no move, re-render to clear highlights
    if(type==='arrange'&&_salemDragTryals)salemRenderArrangeCards(_salemDragTryals);
    else{const list=document.getElementById('salemTurnOrderList');if(list)clearInsertLines(list);}
  }
}

function cancelDrag(){
  document.removeEventListener('pointermove',_dragGlobalMove);
  document.removeEventListener('pointerup',_dragGlobalUp);
  if(_uDrag.ghost){_uDrag.ghost.remove();_uDrag.ghost=null;}
  if(_uDrag.src){_uDrag.src.style.opacity='';_uDrag.src.style.transform='';}
  _uDrag={active:false,ghost:null,src:null,srcIdx:-1,type:'',insertIdx:-1};
  _salemDragIdx=null;
}

function salemArrangeFlipLocal(i){
  if(!_salemDragTryals)return;
  _salemDragTryals[i]._open=!_salemDragTryals[i]._open;
  const inner=document.getElementById('arrInner'+i);
  if(inner)inner.style.transform=_salemDragTryals[i]._open?'rotateY(180deg)':'rotateY(0deg)';
}

function salemArrangeFlip(i){
  // legacy — use local version
  salemArrangeFlipLocal(i);
}

function salemConfirmArrange(){
  if(!_salemState)return;
  // บันทึก tryal ที่เรียงใหม่แล้ว (ลบ _open field ออก)
  const tryalsToSave=(_salemDragTryals||_salemState.players?.[S.myPlayerId]?.tryal||[]).map((t,idx)=>{
    const {_open,...rest}=t;
    return {...rest,pos:idx};
  });
  const updates={
    [`players/${S.myPlayerId}/tryal`]:tryalsToSave,
    [`players/${S.myPlayerId}/arrangeConfirmed`]:true
  };
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem`).update(updates).then(()=>{
      showToast('✅ พร้อมแล้ว! รอเพื่อนๆ...');
    });
  } else {
    const me=_salemState.players?.[S.myPlayerId];
    if(me){me.tryal=tryalsToSave;me.arrangeConfirmed=true;}
    syncSalemState(_salemState);
    showToast('✅ พร้อมแล้ว!');
  }
}

/* ── Peek tryal card (tap once to toggle reveal privately) ── */
let _peekTimer=null;
let _peekStates={};// track which cards are peeked open
function salemPeekStart(i){
  // toggle: if already open, close; else open
  if(_peekStates[i]){
    _peekStates[i]=false;
    const inner=document.getElementById('tryalInner'+i);
    if(inner)inner.style.transform='';
  } else {
    _peekStates[i]=true;
    const inner=document.getElementById('tryalInner'+i);
    if(inner)inner.style.transform='rotateY(180deg)';
  }
}
function salemPeekEnd(i){
  // no-op: handled by salemPeekStart toggle
}

function renderSalemPboard(players,data,isHost,turnOrder){
  const board=$('salemPboard');if(!board)return;
  // เรียงตาม turnOrder ถ้ามี
  const ordered=turnOrder?turnOrder.map(id=>players.find(p=>p.id===id)).filter(Boolean):players;
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  board.innerHTML=ordered.map((p,orderedIdx)=>{
    const isMe=p.id===S.myPlayerId;
    const isTurn=p.id===data.currentTurn;
    const tryals=p.tryal||[];
    const turnPos=turnOrder?turnOrder.indexOf(p.id):orderedIdx;
    const col=COLORS[nonHostIds.indexOf(p.id)%COLORS.length];
    const passEmoji=(p.passives||[]).map(pid=>{const c=SALEM_CARDS[pid];return c?c.emoji:''}).join('');
    const slots=tryals.map((t,si)=>{
      let cls='salem-slot hidden';let lbl='';
      if(t.revealed){
        if(t.type==='witch'){cls='salem-slot witch';lbl='🧙'}
        else if(t.type==='constable'){cls='salem-slot cop';lbl='🔍'}
        else{cls='salem-slot nw';lbl='✓'}
      } else {
        lbl=`<span style="font-size:8px;opacity:0.5">${si+1}</span>`;
      }
      return `<div class="${cls}" title="ใบ ${si+1}">${lbl}</div>`;
    }).join('');
    return `<div style="padding:8px 10px;background:${isTurn?'rgba(240,192,96,0.10)':'var(--card)'};border-radius:var(--r-s);border:1.5px solid ${isTurn?'rgba(240,192,96,0.5)':'var(--line)'};${p.isAlive===false?'opacity:0.3':''}">
      <div style="display:flex;align-items:center;gap:6px">
        <div style="font-size:11px;font-weight:900;color:var(--t3);min-width:14px">${turnPos+1}</div>
        <div style="width:30px;height:30px;border-radius:50%;background:${col}22;color:${col};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;flex-shrink:0">${esc(p.nick[0].toUpperCase())}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:800;color:${isTurn?'var(--warn)':'var(--t0)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${isTurn?'⚡ ':''}${esc(p.nick)}${isMe?' <span style="font-size:11px;color:var(--ac);font-weight:700">(คุณ)</span>':''}${p.isAlive===false?' 💀':''}</div>
          ${p.accusePoints>0?`<div style="font-size:10px;color:var(--danger);font-weight:700">⚖️ โดนกล่าวหา ${p.accusePoints}/7</div>`:''}
          ${(p.passives||[]).length>0?`<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:2px">${(p.passives||[]).map(pid=>{const c=SALEM_CARDS[pid];if(!c)return'';const borderColor=c.color==='red'?'rgba(192,57,43,0.6)':c.color==='green'?'rgba(39,174,96,0.5)':c.color==='blue'?'rgba(41,128,185,0.5)':'rgba(255,255,255,0.2)';const bgColor=c.color==='red'?'rgba(192,57,43,0.12)':c.color==='green'?'rgba(39,174,96,0.1)':c.color==='blue'?'rgba(41,128,185,0.1)':'rgba(255,255,255,0.05)';return`<span style="font-size:9px;font-weight:700;padding:2px 5px;border-radius:4px;border:1px solid ${borderColor};background:${bgColor};color:var(--t1)">${c.emoji} ${c.name}</span>`;}).join('')}</div>`:''}
        </div>
        <div style="display:flex;gap:2px;flex-shrink:0">${slots}</div>
      </div>
    </div>`;
  }).join('');
}

/* ── Draw ── */
function salemDraw(){
  if(!_salemState)return;
  const myId_=S.myPlayerId;
  if(_salemState.currentTurn!==myId_){showToast('⚠️ ยังไม่ใช่เทิร์นคุณ');return}
  const me=_salemState.players?.[myId_];if(!me)return;
  if(me.hasActed){showToast('⚠️ เล่นไพ่ไปแล้ว จั่วไม่ได้แล้วในเทิร์นนี้');return}
  const deck=[..._salemState.deck||[]];
  if(!deck.length){
    // ไพ่หมด → เข้ากลางคืนอัตโนมัติ
    showToast('🌙 ไพ่หมด! เข้าสู่กลางคืน...',3000);
    if(S.isHost)salemSave({nightPhase:true},'🌙 เข้าสู่กลางคืน',false);
    else if(firebaseReady&&S.roomCode)db.ref(`rooms/${S.roomCode}/salem/advanceTurnRequest`).set({by:myId_,at:Date.now(),triggerNight:true});
    return;
  }
  const drawn=[];const blackCards=[];
  for(let i=0;i<2&&deck.length;i++){
    const c=deck.shift();
    const def=SALEM_CARDS[c];
    if(def&&def.type==='black')blackCards.push(c);
    else drawn.push(c);
  }
  // ไพ่สีดำ (night/conspiracy) → ไม่เข้ามือ trigger ทันที แต่ drawn (ไม่ดำ) เข้ามือได้ปกติ
  const newHand=[...(me.hand||[]),...drawn];
  const newlyDrawnStart=(me.hand||[]).length;
  const actLog=me.nick+' จั่วไพ่'+(drawn.length?` ${drawn.length} ใบ`:'')+(blackCards.length?' + ไพ่พิเศษ':'');
  const updates={deck,[`players/${myId_}/hand`]:newHand,[`players/${myId_}/hasDrawn`]:true,[`players/${myId_}/newlyDrawnStart`]:newlyDrawnStart,lastAction:actLog};
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem`).update(updates).then(()=>{
      if(blackCards.includes('night')){
        // night card → แจ้งทุกคนแล้วเข้ากลางคืน
        showToast('🌙 จั่วได้รัตติกาล! เข้าสู่กลางคืน',3000);
        salemSave({nightPhase:true},'🌙 เข้าสู่กลางคืน',false);
        setTimeout(()=>salemAdvanceTurn(),500);
      } else if(blackCards.length){
        blackCards.forEach(bc=>salemTriggerBlack(bc));
      } else if(!drawn.length){
        // ไพ่หมด
        showToast('🌙 ไพ่หมด! เข้าสู่กลางคืน...',3000);
        salemSave({nightPhase:true},'',false);
      } else {
        showToast('🃏 จั่ว '+drawn.length+' ใบ — กด "จบเทิร์น" เมื่อพร้อม');
      }
    });
  } else {
    Object.assign(_salemState,{deck});
    if(!_salemState.players[myId_])_salemState.players[myId_]={};
    Object.assign(_salemState.players[myId_],{hand:newHand,hasDrawn:true,newlyDrawnStart});
    syncSalemState(_salemState);
    if(blackCards.includes('night')){
      showToast('🌙 จั่วได้รัตติกาล!',3000);
      salemSave({nightPhase:true},'🌙 เข้าสู่กลางคืน',false);
      setTimeout(()=>salemAdvanceTurn(),500);
    } else if(blackCards.length){
      blackCards.forEach(bc=>salemTriggerBlack(bc));
    } else {
      showToast('🃏 จั่ว '+drawn.length+' ใบ — กด "จบเทิร์น" เมื่อพร้อม');
    }
  }
}

function salemEndTurn(){
  if(!_salemState)return;
  const myId_=S.myPlayerId;
  if(_salemState.currentTurn!==myId_){showToast('⚠️ ไม่ใช่เทิร์นคุณ');return}
  // clear newly drawn highlight
  const updates={[`players/${myId_}/newlyDrawnStart`]:-1};
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem`).update(updates).then(()=>salemAdvanceTurn());
  } else {
    if(_salemState.players[myId_])_salemState.players[myId_].newlyDrawnStart=-1;
    salemAdvanceTurn();
  }
}

/* ── Play Card ── */
function salemPlayCard(cid,idx){
  _salemPendingCard={cid,idx};
  salemShowCard(cid,true);
}
function salemShowCard(cid,withPlay=false){
  const c=SALEM_CARDS[cid];if(!c)return;
  $('cardDetailContent').innerHTML=`
    <div style="text-align:center;margin-bottom:1rem">
      <div style="font-size:52px;margin-bottom:6px">${c.emoji}</div>
      <div style="font-size:20px;font-weight:800;color:var(--t0)">${c.name}</div>
      <div style="display:inline-block;margin:6px auto;padding:3px 12px;border-radius:var(--r-pill);font-size:12px;font-weight:700;background:var(--card2)">${c.color==='red'?'กล่าวหา':c.color==='green'?'Action':c.color==='blue'?'Passive':'เหตุการณ์'}</div>
      ${c.value?`<div style="font-size:20px;font-weight:800;color:var(--warn)">+${c.value} แต้ม</div>`:''}
    </div>
    <div style="background:var(--card2);border-radius:var(--r-s);padding:1rem;font-size:14px;color:var(--t1);line-height:1.7">${c.desc}</div>`;
  const acts=$('cardDetailActions');
  if(withPlay){
    acts.innerHTML=`<button class="btn btn-ghost" style="flex:1;height:46px" onclick="closeModal('cardDetailModal')">ยกเลิก</button>
      <button class="btn btn-ac" style="flex:2;height:46px" onclick="closeModal('cardDetailModal');salemExecCard('${cid}')">▶ เล่น</button>`;
  } else {
    acts.innerHTML=`<button class="btn btn-sf btn-full" onclick="closeModal('cardDetailModal')">ปิด</button>`;
  }
  openModal('cardDetailModal');
}
function salemExecCard(cid){
  const c=SALEM_CARDS[cid];if(!c)return;
  const idx=_salemPendingCard?.idx;
  if(c.type==='red') salemOpenTarget(cid,idx,'red');
  else if(c.type==='blue') salemOpenTarget(cid,idx,'blue');
  else if(c.type==='green'){
    if(cid==='robbery') salemOpenRobberyStep1(idx);
    else salemOpenTarget(cid,idx,'green');// alibi and all others now target other players
  }
}

/* ── Target picker ── */
function salemOpenTarget(cid,idx,type){
  if(!_salemState)return;
  const c=SALEM_CARDS[cid];
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const players=nonHostIds.map(id=>_salemState.players?.[id]).filter(p=>p&&p.id!==S.myPlayerId&&p.isAlive!==false);
  $('salemTargetTitle').textContent='เลือกเป้าหมาย';
  $('salemTargetPreview').innerHTML=c.emoji+' <b>'+c.name+'</b> — '+c.desc;
  $('salemTargetList').innerHTML=players.map(p=>{
    const col=COLORS[nonHostIds.indexOf(p.id)%COLORS.length];
    const passEmoji=(p.passives||[]).map(pid=>{const pc=SALEM_CARDS[pid];return pc?pc.emoji:''}).join('');
    return `<button class="salem-tbtn" onclick="salemApplyToTarget('${cid}',${idx},'${p.id}')">
      <div style="width:32px;height:32px;border-radius:50%;background:${col}22;color:${col};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0">${esc(p.nick[0].toUpperCase())}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:700;color:var(--t0)">${esc(p.nick)}</div>
        <div style="font-size:11px;color:var(--t2)">${p.accusePoints>0?'⚖️ '+p.accusePoints+'/7':''} ${passEmoji}</div>
      </div>
    </button>`;
  }).join('');
  $('salemTargetOv').classList.add('open');
}
function salemCloseTarget(){$('salemTargetOv').classList.remove('open')}

/* ── Apply Card ── */
function salemSave(updates,msg,advance=true){
  if(msg)updates.lastAction=msg;
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem`).update(updates).then(()=>{
      if(msg)showToast(msg);
      if(advance)salemAdvanceTurn();
    });
  } else {
    Object.entries(updates).forEach(([k,v])=>{
      const parts=k.split('/');
      let obj=_salemState;
      for(let i=0;i<parts.length-1;i++){if(!obj[parts[i]])obj[parts[i]]={};obj=obj[parts[i]];}
      obj[parts[parts.length-1]]=v;
    });
    syncSalemState(_salemState);
    if(msg)showToast(msg);
    if(advance)salemAdvanceTurn();
  }
}

function salemApplyToTarget(cid,idx,targetId){
  salemCloseTarget();
  if(!_salemState)return;
  const c=SALEM_CARDS[cid];
  const me=_salemState.players?.[S.myPlayerId];
  const target=_salemState.players?.[targetId];
  if(!me||!target)return;
  const newHand=[...(me.hand||[])];newHand.splice(idx,1);
  // adjust newlyDrawnStart after removing card
  const nds=(me.newlyDrawnStart||0);
  const newNds=idx<nds?Math.max(0,nds-1):nds;
  const updates={[`players/${S.myPlayerId}/hand`]:newHand,[`players/${S.myPlayerId}/hasActed`]:true,[`players/${S.myPlayerId}/newlyDrawnStart`]:newNds};

  if(c.type==='red'){
    if((target.passives||[]).includes('piety')){
      showToast('🛡️ '+target.nick+' มีพลังศรัทธา — ไม่มีผล!');
      salemSave(updates,'',false);return;
    }
    const pts=(target.accusePoints||0)+c.value;
    updates[`players/${targetId}/accusePoints`]=pts;
    if(pts>=7){
      // เหลือ accusePoints = pts - 7
      const leftover=pts-7;
      updates[`players/${targetId}/accusePoints`]=leftover;
      salemSave(updates,'⚖️ '+target.nick+' โดนกล่าวหาครบ! ต้องเปิดไพ่ชีวิต',false);
      // เปิด confess overlay ให้เป้าหมาย (ถ้าเป็นตัวเอง)
      if(targetId===S.myPlayerId){
        salemOpenConfess(true);
      } else {
        // แจ้งผ่าน firebase ให้เป้าหมายรู้ว่าต้องเปิดไพ่
        if(firebaseReady&&S.roomCode){
          db.ref(`rooms/${S.roomCode}/salem/forceConfess`).set({pid:targetId,at:Date.now()});
        }
        showToast('⚠️ '+target.nick+' ต้องเปิดไพ่ชีวิต!',3500);
      }
      setTimeout(()=>{if(_salemState)salemCheckWitchDeath(_salemState,targetId);},1200);
    } else {
      salemSave(updates,'⚖️ '+target.nick+' โดนกล่าวหา '+pts+'/7',false);
    }
  } else if(c.type==='blue'){
    const passives=[...(target.passives||[]),cid];
    updates[`players/${targetId}/passives`]=passives;
    salemSave(updates,c.emoji+' วาง '+c.name+' หน้า '+target.nick,false);
  } else if(c.type==='green'){
    if(cid==='scapegoat'){
      updates[`players/${targetId}/accusePoints`]=0;
      salemSave(updates,'🐐 ล้างข้อกล่าวหา '+target.nick,false);
    } else if(cid==='alibi'){
      const reduced=Math.max(0,(target.accusePoints||0)-3);
      updates[`players/${targetId}/accusePoints`]=reduced;
      salemSave(updates,'🛡️ ลดข้อกล่าวหา '+target.nick+' ลง 3 แต้ม',false);
    } else if(cid==='curse'){
      const passives=[...(target.passives||[])];
      if(!passives.length){showToast('🔮 '+target.nick+' ไม่มี Passive');return;}
      // แสดง picker เลือก passive ใบไหนจะลบ
      salemOpenCursePicker(targetId,idx);
      return;
    } else if(cid==='stocks'){
      updates[`players/${targetId}/skipTurn`]=true;
      salemSave(updates,'⛓️ '+target.nick+' จะข้ามเทิร์นหน้า',false);
    } else if(cid==='arson'){
      updates[`players/${targetId}/hand`]=[];
      if(targetId!==S.myPlayerId&&firebaseReady&&S.roomCode){
        db.ref(`rooms/${S.roomCode}/salem/alertMsg`).set({pid:targetId,msg:'🔥 ไพ่ทั้งหมดของคุณถูกเผาทิ้ง!',at:Date.now()});
      }
      salemSave(updates,'🔥 เผาไพ่ '+target.nick+' ทิ้งหมด!',false);
    }
  }
}

/* ── Curse passive picker ── */
function salemOpenCursePicker(targetId,cardIdx){
  if(!_salemState)return;
  const target=_salemState.players?.[targetId];if(!target)return;
  const passives=target.passives||[];
  $('salemTargetTitle').textContent='เลือก Passive ที่จะลบ';
  $('salemTargetPreview').innerHTML='🔮 <b>คำสาป</b> — เลือก Passive ของ '+esc(target.nick)+' ที่จะถูกลบ';
  $('salemTargetList').innerHTML=passives.map((pid,i)=>{
    const c=SALEM_CARDS[pid];
    return `<button class="salem-tbtn" onclick="salemApplyCurse('${targetId}',${cardIdx},${i})">
      <div style="font-size:22px">${c?.emoji||'❓'}</div>
      <div style="flex:1;font-size:14px;font-weight:700;color:var(--t0)">${c?.name||pid}</div>
    </button>`;
  }).join('');
  $('salemTargetOv').classList.add('open');
}
function salemApplyCurse(targetId,cardIdx,passiveIdx){
  salemCloseTarget();
  if(!_salemState)return;
  const me=_salemState.players?.[S.myPlayerId];
  const target=_salemState.players?.[targetId];
  if(!me||!target)return;
  const newHand=[...(me.hand||[])];newHand.splice(cardIdx,1);
  const nds=(me.newlyDrawnStart||0);
  const newNds=cardIdx<nds?Math.max(0,nds-1):nds;
  const passives=[...(target.passives||[])];
  passives.splice(passiveIdx,1);
  salemSave({[`players/${S.myPlayerId}/hand`]:newHand,[`players/${S.myPlayerId}/hasActed`]:true,[`players/${S.myPlayerId}/newlyDrawnStart`]:newNds,[`players/${targetId}/passives`]:passives},'🔮 ลบ Passive จาก '+target.nick,false);
}

/* ── Robbery 2-step picker: step1=who to rob, step2=who to give ── */
let _robberyState={fromId:null,cardIdx:null};
function salemOpenRobberyStep1(cardIdx){
  if(!_salemState)return;
  _robberyState={fromId:null,cardIdx};
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const players=nonHostIds.map(id=>_salemState.players?.[id]).filter(p=>p&&p.id!==S.myPlayerId&&p.isAlive!==false&&(p.hand||[]).length>0);
  $('salemTargetTitle').textContent='ปล้นไพ่จากใคร? 💰';
  $('salemTargetPreview').innerHTML='💰 <b>ปล้น</b> — เลือกผู้เล่นที่จะปล้นไพ่ทั้งหมด';
  $('salemTargetList').innerHTML=players.length?players.map(p=>{
    const col=COLORS[nonHostIds.indexOf(p.id)%COLORS.length];
    return `<button class="salem-tbtn" onclick="salemOpenRobberyStep2('${p.id}')">
      <div style="width:32px;height:32px;border-radius:50%;background:${col}22;color:${col};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0">${esc(p.nick[0].toUpperCase())}</div>
      <div style="flex:1;font-size:14px;font-weight:700;color:var(--t0)">${esc(p.nick)}</div>
      <div style="font-size:12px;color:var(--t2)">${(p.hand||[]).length} ใบ</div>
    </button>`;
  }).join(''):`<div style="text-align:center;padding:1rem;color:var(--t2);font-size:13px">ไม่มีผู้เล่นที่มีไพ่ในมือ</div>`;
  $('salemTargetOv').classList.add('open');
}
function salemOpenRobberyStep2(fromId){
  if(!_salemState)return;
  _robberyState.fromId=fromId;
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const fromPlayer=_salemState.players?.[fromId];
  // เลือกได้ทุกคนที่มีชีวิต (รวมตัวเอง) ยกเว้นคนที่โดนปล้น
  const players=nonHostIds.map(id=>_salemState.players?.[id]).filter(p=>p&&p.id!==fromId&&p.isAlive!==false);
  $('salemTargetTitle').textContent='ให้ไพ่แก่ใคร? 🎁';
  $('salemTargetPreview').innerHTML='💰 ปล้นจาก <b>'+esc(fromPlayer?.nick||fromId)+'</b> → ส่งให้ใคร?';
  $('salemTargetList').innerHTML=players.map(p=>{
    const col=COLORS[nonHostIds.indexOf(p.id)%COLORS.length];
    return `<button class="salem-tbtn" onclick="salemDoRobbery('${p.id}')">
      <div style="width:32px;height:32px;border-radius:50%;background:${col}22;color:${col};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0">${esc(p.nick[0].toUpperCase())}</div>
      <div style="flex:1;font-size:14px;font-weight:700;color:var(--t0)">${esc(p.nick)}${p.id===S.myPlayerId?' (คุณ)':''}</div>
    </button>`;
  }).join('');
  // ไม่ปิด overlay — เปลี่ยน content แทน
}
function salemDoRobbery(toId){
  salemCloseTarget();
  if(!_salemState)return;
  const {fromId,cardIdx}=_robberyState;
  const me=_salemState.players?.[S.myPlayerId];
  const fromPlayer=_salemState.players?.[fromId];
  const toPlayer=_salemState.players?.[toId];
  if(!me||!fromPlayer||!toPlayer)return;
  const myHand=[...(me.hand||[])];myHand.splice(cardIdx,1);
  const nds=(me.newlyDrawnStart||0);
  const newNds=cardIdx<nds?Math.max(0,nds-1):nds;
  const stolen=[...(fromPlayer.hand||[])];
  const updates={
    [`players/${S.myPlayerId}/hand`]:myHand,
    [`players/${S.myPlayerId}/hasActed`]:true,
    [`players/${S.myPlayerId}/newlyDrawnStart`]:newNds,
    [`players/${fromId}/hand`]:[],
    [`players/${toId}/hand`]:[...(toPlayer.hand||[]),...stolen],
  };
  if(fromId!==S.myPlayerId&&firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem/alertMsg`).set({pid:fromId,msg:'💰 ไพ่ของคุณถูกปล้น!',at:Date.now()});
  }
  if(toId!==S.myPlayerId&&toId!==fromId&&firebaseReady&&S.roomCode){
    setTimeout(()=>db.ref(`rooms/${S.roomCode}/salem/alertMsg`).set({pid:toId,msg:'🎁 ได้รับไพ่ที่ถูกปล้นมา!',at:Date.now()}),1500);
  }
  salemSave(updates,'💰 ปล้นไพ่จาก '+fromPlayer.nick+' → '+toPlayer.nick,false);
}

/* ── Confess (เปิดได้แค่ครั้งละ 1 ใบ) ── */
function salemOpenConfess(forced=false){
  _salemConfessForced=forced;
  if(!_salemState)return;
  const me=_salemState.players?.[S.myPlayerId];
  const tryals=me?.tryal||[];
  $('salemConfessGrid').innerHTML=tryals.map((t,i)=>{
    if(t.revealed){
      return `<div class="salem-conf-card revealed">
        <span style="font-size:22px">${t.type==='witch'?'🧙':t.type==='constable'?'🔍':'✅'}</span>
        <div class="salem-conf-lbl">ใบ ${i+1} เปิดแล้ว</div>
      </div>`;
    }
    return `<div class="salem-conf-card" onclick="salemDoConfess(${i})">
      🂠
      <div class="salem-conf-lbl">ใบ ${i+1} — กดเพื่อเปิด</div>
    </div>`;
  }).join('');
  $('salemConfessOv').classList.add('open');
}
function salemDoConfess(idx){
  // เปิดได้แค่ 1 ใบต่อครั้ง แล้วปิด overlay ทันที
  if(!_salemState)return;
  const me=_salemState.players?.[S.myPlayerId];
  const tryals=JSON.parse(JSON.stringify(me?.tryal||[]));
  if(tryals[idx]?.revealed){showToast('ใบนี้เปิดแล้ว');return}
  tryals[idx]={...tryals[idx],revealed:true};
  $('salemConfessOv').classList.remove('open');
  salemSave({[`players/${S.myPlayerId}/tryal`]:tryals},'🙏 เปิดไพ่ชีวิตใบ '+(idx+1),false);
  setTimeout(()=>{
    if(_salemState){
      salemCheckWitchDeath(_salemState,S.myPlayerId);
      salemCheckWin(_salemState);
    }
  },600);
}
function salemCancelConfess(){
  if(_salemConfessForced){showToast('⚠️ ต้องเปิดไพ่ชีวิต 1 ใบก่อน!');return}
  $('salemConfessOv').classList.remove('open');
}

/* ── Black cards ── */
function salemTriggerBlack(cid){
  if(cid==='conspiracy')salemTriggerConspiracy();
  else if(cid==='night')salemTriggerNightCard();
}

/* ── Night card trigger ── */
function salemTriggerNightCard(){
  // broadcast night event ให้ทุกคนเห็น
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem/nightCardEvent`).set({by:S.myPlayerId,at:Date.now()});
  }
  salemShowNight();
}
function salemShowNight(){
  $('salemEvIcon').textContent='🌙';
  $('salemEvTitle').textContent='รัตติกาล!';
  $('salemEvDesc').innerHTML='ไพ่รัตติกาลถูกจั่ว!<br><br>เข้าสู่ช่วงกลางคืน<br>ทุกคนหลับตา — แม่มดเลือกเป้าหมาย';
  $('salemEvActions').innerHTML=`<button class="btn btn-sf btn-full" onclick="$('salemEvOv').classList.remove('open')">รับทราบ</button>`;
  $('salemEvOv').classList.add('open');
}

/* ── Black Cat notification: เมื่อมีคนจั่วได้แมวดำ แจ้งทุกคน บล็อก UI ─── */
function salemShowBlackCatNotification(bce,data){
  const holder=data.players?.[bce.holderId];
  if(!holder)return;
  const isHolder=bce.holderId===S.myPlayerId;
  $('salemEvIcon').textContent='🐱';
  $('salemEvTitle').textContent='แมวดำ!';
  $('salemEvDesc').innerHTML=`<b>${esc(holder.nick)}</b> ได้รับการ์ดแมวดำ!<br><br>${isHolder?'คุณต้องเปิดไพ่ชีวิต 1 ใบ':'รอ '+esc(holder.nick)+' เปิดไพ่ชีวิต...'}`;
  let html='';
  if(isHolder){
    const tryals=holder.tryal||[];
    html=`<div style="font-size:13px;color:var(--warn);font-weight:700;margin-bottom:8px;text-align:center">เลือกไพ่ชีวิตที่จะเปิด:</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:6px">
        ${tryals.map((t,i)=>{
          if(t.revealed)return`<div style="width:52px;height:72px;border-radius:8px;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:16px;opacity:0.4">✓</div>`;
          return`<button onclick="salemBCReveal(${i})" style="width:52px;height:72px;border-radius:8px;background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid rgba(240,192,96,0.5);color:var(--t0);cursor:pointer;font-size:11px;font-weight:700">ใบ<br>${i+1}</button>`;
        }).join('')}
      </div>`;
  }
  // ถ้าไม่ใช่ holder → ไม่มีปุ่ม (บล็อก) จนกว่า holder จะกดเปิด
  $('salemEvActions').innerHTML=html;
  $('salemEvOv').classList.add('open');
}
function salemBCReveal(idx){
  if(!_salemState)return;
  const me=_salemState.players?.[S.myPlayerId];if(!me)return;
  const tryals=JSON.parse(JSON.stringify(me.tryal||[]));
  if(tryals[idx]?.revealed){showToast('ใบนี้เปิดแล้ว');return;}
  tryals[idx]={...tryals[idx],revealed:true};
  // clear blackCatEvent ด้วยเพื่อให้ overlay ของทุกคนปิด
  const updates={[`players/${S.myPlayerId}/tryal`]:tryals,blackCatEvent:null};
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem`).update(updates).then(()=>{
      $('salemEvOv').classList.remove('open');
      showToast('🐱 เปิดไพ่ชีวิตใบ '+(idx+1)+' แล้ว',3000);
      setTimeout(()=>{if(_salemState)salemCheckWitchDeath(_salemState,S.myPlayerId);},600);
    });
  } else {
    me.tryal=tryals;_salemState.blackCatEvent=null;
    syncSalemState(_salemState);
    $('salemEvOv').classList.remove('open');
    showToast('🐱 เปิดไพ่ชีวิตใบ '+(idx+1)+' แล้ว',3000);
  }
}

/* ── Conspiracy: ผู้จั่วได้ → broadcast event → ทุกคนเลือกไพ่จากคนซ้าย → auto swap ── */
function salemTriggerConspiracy(){
  if(!_salemState)return;
  const bcHolder=Object.values(_salemState.players||{}).find(p=>(p.passives||[]).includes('blackcat'));
  const at=Date.now();
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const alivePlayers=((_salemState.turnOrder)||nonHostIds).map(id=>_salemState.players?.[id]).filter(p=>p&&p.isAlive!==false);
  const eventData={by:S.myPlayerId,at,bcHolderId:bcHolder?.id||null,totalPlayers:alivePlayers.length};
  if(firebaseReady&&S.roomCode){
    // reset picks ก่อน แล้วค่อย set event (ต้องทำ atomic เพื่อไม่ให้ host trigger swap ก่อนกำหนด)
    const batch={
      'conspiracyPicks':null,
      'conspiracyEvent':eventData,
      'conspiracyDone':null,
    };
    db.ref(`rooms/${S.roomCode}/salem`).update(batch);
    if(bcHolder&&bcHolder.id!==S.myPlayerId){
      db.ref(`rooms/${S.roomCode}/salem/blackCatEvent`).set({holderId:bcHolder.id,at,fromConspiracy:true});
    }
    // ไม่เรียก salemShowConspiracyPickEvent ที่นี่ — รอ Firebase sync มาแทน
    // เพื่อให้มั่นใจว่า data.players ครบก่อน render UI
  } else {
    // offline mode
    if(!_salemState.conspiracyEvent) {
      _salemState.conspiracyEvent=eventData;
      _salemState.conspiracyPicks=null;
      syncSalemState(_salemState);
    }
  }
}

function salemShowConspiracyPickEvent(ce,data){
  if(!data||S.isHost)return;
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const turnOrder=data.turnOrder||nonHostIds;
  const players=turnOrder.map(id=>data.players?.[id]).filter(p=>p&&p.isAlive!==false);
  const n=players.length;if(!n)return;

  // คนจั่วได้ไพ่ = ce.by → ไม่ต้องเลือกไพ่ (ให้แสดงแค่รอ)
  const isDrawer=ce.by===S.myPlayerId;

  // คนซ้ายของเรา = คนก่อนหน้าใน turnOrder (วนลูป)
  const myIdx=players.findIndex(p=>p.id===S.myPlayerId);
  const leftIdx=myIdx>=0?(myIdx-1+n)%n:-1;
  const leftPlayer=leftIdx>=0?players[leftIdx]:null;

  const bcHolder=ce.bcHolderId?data.players?.[ce.bcHolderId]:null;
  const drawer=data.players?.[ce.by];

  $('salemEvIcon').textContent='🕸️';
  $('salemEvTitle').textContent='เจตนาร้าย!';
  $('salemEvDesc').innerHTML=`<b>${esc(drawer?.nick||'?')}</b> จั่วได้การ์ดเจตนาร้าย!${bcHolder?`<br><br>⚠️ <b>${esc(bcHolder.nick)}</b> (ผู้ครอง 🐱) ต้องเปิดไพ่ชีวิต 1 ใบ`:''}${(!isDrawer&&leftPlayer)?`<br><br>🔄 เลือกไพ่จาก <b>${esc(leftPlayer.nick)}</b> (คนซ้าย) 1 ใบ`:''}`;

  // ตรวจว่าตัวเองเลือกไปแล้วหรือยัง
  const myPick=data.conspiracyPicks?.[S.myPlayerId];
  let html='';
  if(myPick){
    html=`<div style="text-align:center;padding:1rem;color:var(--ok);font-size:14px;font-weight:700">✅ เลือกแล้ว — รอผู้เล่นคนอื่น...</div>`;
  } else if(isDrawer){
    // คนจั่วได้ไม่ต้องเลือกไพ่ — auto submit none
    html=`<div style="text-align:center;padding:1rem;color:var(--warn);font-size:14px;font-weight:700">⚡ คุณจั่วได้ไพ่นี้!</div>
      <div style="text-align:center;font-size:13px;color:var(--t2);margin-bottom:8px">รอผู้เล่นทุกคนส่งต่อไพ่ชีวิต...</div>`;
    // auto-submit pick = none สำหรับคนจั่ว
    if(firebaseReady&&S.roomCode&&!data.conspiracyPicks?.[S.myPlayerId]){
      setTimeout(()=>{
        db.ref(`rooms/${S.roomCode}/salem/conspiracyPicks/${S.myPlayerId}`).set({fromId:null,tryalIdx:-1,at:Date.now()});
      },300);
    }
  } else if(leftPlayer){
    const leftTryal=leftPlayer.tryal||[];
    const hasUnopenedCard=leftTryal.some(t=>!t.revealed);
    if(!hasUnopenedCard){
      html=`<div style="font-size:13px;color:var(--t2);text-align:center;margin-bottom:8px">${esc(leftPlayer.nick)} ไม่มีไพ่ที่ยังไม่เปิด</div>
        <button class="btn btn-sf btn-full" onclick="salemConspiracyPickNone()">✅ รับทราบ (ไม่มีให้หยิบ)</button>`;
    } else {
      html=`<div style="font-size:13px;color:var(--warn);font-weight:700;margin-bottom:8px;text-align:center">เลือกไพ่จาก ${esc(leftPlayer.nick)} 1 ใบ:</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:6px">
          ${leftTryal.map((t,i)=>{
            if(t.revealed)return`<div style="width:52px;height:72px;border-radius:8px;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:12px;opacity:0.3;flex-direction:column;gap:2px"><span>✓</span><span style="font-size:8px">ใบ${i+1}</span></div>`;
            return`<button id="conspPick${i}" onclick="salemConspiracyPickCard('${leftPlayer.id}',${i})" style="width:52px;height:72px;border-radius:8px;background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid rgba(124,156,255,0.5);color:var(--t0);cursor:pointer;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:3px;transition:all 0.15s"><span style="font-size:18px">🂠</span><span>ใบ ${i+1}</span></button>`;
          }).join('')}
        </div>`;
    }
  }
  $('salemEvActions').innerHTML=html;
  $('salemEvOv').classList.add('open');
}

function salemConspiracyPickCard(fromId,tryalIdx){
  // ไฮไลท์
  document.querySelectorAll('[id^="conspPick"]').forEach(b=>{
    b.style.border='2px solid rgba(124,156,255,0.3)';b.style.opacity='0.5';
  });
  const btn=document.getElementById('conspPick'+tryalIdx);
  if(btn){btn.style.border='3px solid var(--ok)';btn.style.opacity='1';}

  // แสดงปุ่มยืนยันทันที
  const actEl=$('salemEvActions');
  if(actEl){
    // เพิ่มปุ่มยืนยันหลังจาก grid ไพ่
    const existingConfirm=document.getElementById('conspConfirmBtn');
    if(!existingConfirm){
      const confirmBtn=document.createElement('button');
      confirmBtn.id='conspConfirmBtn';
      confirmBtn.className='btn btn-ac btn-full';
      confirmBtn.style.cssText='height:48px;font-size:15px;font-weight:800;margin-top:8px';
      confirmBtn.textContent='✅ ยืนยันเลือกใบ '+(tryalIdx+1);
      confirmBtn.onclick=()=>salemConspiracyConfirmPick(fromId,tryalIdx);
      actEl.appendChild(confirmBtn);
    } else {
      existingConfirm.textContent='✅ ยืนยันเลือกใบ '+(tryalIdx+1);
      existingConfirm.onclick=()=>salemConspiracyConfirmPick(fromId,tryalIdx);
    }
  }
}

function salemConspiracyConfirmPick(fromId,tryalIdx){
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem/conspiracyPicks/${S.myPlayerId}`).set({fromId,tryalIdx,at:Date.now()}).then(()=>{
      $('salemEvActions').innerHTML=`<div style="text-align:center;padding:1rem;color:var(--ok);font-size:14px;font-weight:700">✅ เลือกใบ ${tryalIdx+1} แล้ว — รอผู้เล่นคนอื่น...</div>`;
    });
  }
}

function salemConspiracyPickNone(){
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/salem/conspiracyPicks/${S.myPlayerId}`).set({fromId:null,tryalIdx:-1,at:Date.now()}).then(()=>{
      $('salemEvActions').innerHTML=`<div style="text-align:center;padding:0.5rem;color:var(--ok);font-size:14px;font-weight:700">✅ รับทราบแล้ว — รอผู้เล่นคนอื่น...</div>`;
    });
  }
}

// Host ตรวจว่าทุกคน pick แล้วหรือยัง → auto swap
function salemCheckConspiracyAutoSwap(data){
  if(!S.isHost||!data.conspiracyEvent)return;
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const turnOrder=data.turnOrder||nonHostIds;
  const alivePlayers=turnOrder.map(id=>data.players?.[id]).filter(p=>p&&p.isAlive!==false);
  const picks=data.conspiracyPicks||{};
  const pickedCount=Object.keys(picks).length;
  if(pickedCount>=alivePlayers.length){
    // ทุกคน pick แล้ว → swap อัตโนมัติ
    setTimeout(()=>salemDoConspiracySwap(data,picks,alivePlayers),500);
  }
}

function salemDoConspiracySwap(data,picks,alivePlayers){
  if(!_salemState||!S.isHost)return;
  const n=alivePlayers.length;if(!n)return;
  // ── snapshot ณ เริ่มต้น (immutable) ──
  const origSnap={};
  alivePlayers.forEach(p=>{origSnap[p.id]=JSON.parse(JSON.stringify(p.tryal||[]));});
  // result arrays ที่จะแก้ไข — เริ่มจาก snapshot
  const result={};
  alivePlayers.forEach(p=>{result[p.id]=JSON.parse(JSON.stringify(p.tryal||[]));});
  const updates={};
  const swapLabels={};

  // 1. สร้าง map: ใครโดนหยิบไพ่ใบไหน (คนขวาของเราหยิบจากเรา)
  const removedFromPlayer={};// pid → tryalIdx ที่โดนหยิบออก
  alivePlayers.forEach((p,i)=>{
    const rightIdx=(i+1)%n;
    const rightPlayer=alivePlayers[rightIdx];
    const rightPick=picks[rightPlayer.id];
    // คนขวา pick fromId===p.id หมายความว่าหยิบจากเรา
    if(rightPick&&rightPick.tryalIdx>=0&&rightPick.fromId===p.id){
      removedFromPlayer[p.id]=rightPick.tryalIdx;
    }
  });

  // 2. แต่ละคนรับไพ่ใหม่จากคนซ้าย → วางทับช่องที่คนขวาเอาออก
  alivePlayers.forEach((p,i)=>{
    const leftIdx=(i-1+n)%n;
    const leftPlayer=alivePlayers[leftIdx];
    const pick=picks[p.id];
    // ถ้าไม่ได้ pick หรือ pick = none → ไม่รับไพ่ใหม่
    if(!pick||pick.tryalIdx<0||!pick.fromId)return;
    const takeIdx=pick.tryalIdx;
    const srcCard=origSnap[leftPlayer.id]?.[takeIdx];
    if(!srcCard||srcCard.revealed)return;
    // ช่องที่จะวาง = ช่องที่คนขวาเอาออกจากเรา (ถ้ามี) ไม่งั้นต่อท้าย
    const placeIdx=removedFromPlayer[p.id]!==undefined?removedFromPlayer[p.id]:result[p.id].length;
    const newCard={...srcCard,pos:placeIdx};
    if(placeIdx<result[p.id].length){
      result[p.id][placeIdx]=newCard;
    } else {
      result[p.id].push(newCard);
    }
    swapLabels[p.id]={fromNick:leftPlayer.nick,fromSlot:takeIdx+1,newSlot:placeIdx+1};
  });

  // 3. ลบไพ่ที่โดนหยิบออกจากเจ้าของเดิม
  // (ถ้าคนขวา pick จากเรา และ step2 ยังไม่ได้ replace ช่องนั้น → ต้องลบออก)
  alivePlayers.forEach((p,i)=>{
    const removedIdx=removedFromPlayer[p.id];
    if(removedIdx===undefined)return;
    const rightIdx=(i+1)%n;
    const rightPlayer=alivePlayers[rightIdx];
    const rightPick=picks[rightPlayer.id];
    // step2 ของเจ้าตัว (p) ได้ replace ช่อง removedIdx แล้วหรือไม่?
    // p ได้รับไพ่จากคนซ้าย → swapLabels[p.id] มีค่า
    const pGotNew=!!swapLabels[p.id];
    if(!pGotNew){
      // เราไม่ได้รับไพ่ใหม่ → ช่องที่โดนเอาออกต้องว่าง → ลบออกแล้ว splice
      if(removedIdx<result[p.id].length){
        result[p.id].splice(removedIdx,1);
        // ปรับ pos
        result[p.id].forEach((t,idx)=>{t.pos=idx;});
      }
    }
    // ถ้า pGotNew → step2 ได้ใส่ไพ่ใหม่ทับช่อง removedIdx แล้ว ไม่ต้องทำอะไร
  });

  alivePlayers.forEach(p=>{
    updates[`players/${p.id}/tryal`]=result[p.id];
  });
  updates.conspiracyEvent=null;
  updates.conspiracyPicks=null;
  updates.conspiracyDone={at:Date.now(),swapLabels};

  salemSave(updates,'🔄 ส่งต่อไพ่ชีวิตเสร็จแล้ว!',false);
  setTimeout(()=>{
    if(_salemState)Object.keys(_salemState.players||{}).forEach(pid=>salemCheckWitchDeath(_salemState,pid));
    setTimeout(()=>{if(firebaseReady&&S.roomCode)db.ref(`rooms/${S.roomCode}/salem/conspiracyDone`).set(null);},12000);
  },800);
}

function salemHostAssignBlackCat(){
  if(!_salemState)return;
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const players=nonHostIds.map(id=>_salemState.players?.[id]).filter(p=>p&&p.isAlive!==false);
  $('salemTargetTitle').textContent='วางแมวดำ 🐱 ให้ใคร?';
  $('salemTargetPreview').innerHTML='แม่มดเลือกแล้ว — Host กดเพื่อวาง 🐱 ให้คนนั้น';
  $('salemTargetList').innerHTML=players.map(p=>{
    const col=COLORS[nonHostIds.indexOf(p.id)%COLORS.length];
    const hasCat=(p.passives||[]).includes('blackcat');
    return `<button class="salem-tbtn" onclick="salemDoAssignBlackCat('${p.id}')">
      <div style="width:32px;height:32px;border-radius:50%;background:${col}22;color:${col};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0">${esc(p.nick[0].toUpperCase())}</div>
      <div style="flex:1;font-size:14px;font-weight:700;color:var(--t0)">${esc(p.nick)}</div>
      ${hasCat?'<div style="font-size:18px">🐱</div>':''}
    </button>`;
  }).join('');
  $('salemTargetOv').classList.add('open');
}
function salemDoAssignBlackCat(pid){
  salemCloseTarget();
  if(!_salemState)return;
  // ลบ blackcat จากทุกคนก่อน
  const updates={};
  Object.values(_salemState.players||{}).forEach(p=>{
    const newPassives=(p.passives||[]).filter(x=>x!=='blackcat');
    if((p.passives||[]).includes('blackcat'))updates[`players/${p.id}/passives`]=newPassives;
  });
  // วาง blackcat ให้คนใหม่
  const target=_salemState.players?.[pid];
  const newPassives=[...(target?.passives||[]).filter(x=>x!=='blackcat'),'blackcat'];
  updates[`players/${pid}/passives`]=newPassives;
  updates['blackCatHolder']=pid;
  // ถ้ายังไม่ได้เริ่มเทิร์น (currentTurn=null) → เริ่มจากผู้ครองแมวดำ
  if(!_salemState.currentTurn){
    updates['currentTurn']=pid;
    updates[`players/${pid}/hasDrawn`]=false;
    updates[`players/${pid}/hasActed`]=false;
    // ปรับ turnOrder ให้เริ่มจาก pid วนซ้ายไป
    const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
    const bcIdx=nonHostIds.indexOf(pid);
    const reordered=[...nonHostIds.slice(bcIdx),...nonHostIds.slice(0,bcIdx)];
    updates['turnOrder']=reordered;
  }
  salemSave(updates,'🐱 วางแมวดำให้ '+(target?.nick||pid),false);
  // blackCatEvent broadcast เฉพาะกรณีเกมดำเนินอยู่แล้ว (currentTurn มีค่า = เกมเริ่มแล้ว)
  // ตอนเริ่มเกมครั้งแรก (currentTurn=null) ไม่ต้อง broadcast
  const alreadyStarted=!!(_salemState?.currentTurn);
  if(alreadyStarted){
    setTimeout(()=>{
      if(firebaseReady&&S.roomCode){
        db.ref(`rooms/${S.roomCode}/salem/blackCatEvent`).set({holderId:pid,at:Date.now(),fromConspiracy:false});
      }
    },600);
  }
}
function salemHostRemoveBlackCat(){
  if(!_salemState)return;
  const updates={blackCatHolder:null};
  Object.values(_salemState.players||{}).forEach(p=>{
    if((p.passives||[]).includes('blackcat')){
      updates[`players/${p.id}/passives`]=(p.passives||[]).filter(x=>x!=='blackcat');
    }
  });
  salemSave(updates,'🐱✕ ลบแมวดำแล้ว',false);
}

function salemShiftTurnOrder(idx,dir){
  if(!_salemState||!S.isHost)return;
  const turnOrder=[...(_salemState.turnOrder||S.players.filter(p=>!p.isHost).map(p=>p.id))];
  const newIdx=idx+dir;
  if(newIdx<0||newIdx>=turnOrder.length)return;
  [turnOrder[idx],turnOrder[newIdx]]=[turnOrder[newIdx],turnOrder[idx]];
  salemSave({turnOrder},'',false);
}

function salemStartTurns(){
  if(!_salemState||!S.isHost)return;
  const bcHolder=_salemState.blackCatHolder;
  if(!bcHolder){showToast('⚠️ วางแมวดำก่อน!');return;}
  const turnOrder=_salemState.turnOrder||S.players.filter(p=>!p.isHost).map(p=>p.id);
  const aliveTurnOrder=turnOrder.filter(id=>_salemState.players?.[id]?.isAlive!==false);
  // เรียงใหม่ให้ bcHolder อยู่หัว
  const bcIdx=aliveTurnOrder.indexOf(bcHolder);
  const reordered=bcIdx>=0?[...aliveTurnOrder.slice(bcIdx),...aliveTurnOrder.slice(0,bcIdx)]:aliveTurnOrder;
  const updates={currentTurn:reordered[0],turnOrder:reordered};
  updates[`players/${reordered[0]}/hasDrawn`]=false;
  updates[`players/${reordered[0]}/hasActed`]=false;
  salemSave(updates,'▶ เริ่มเทิร์นแล้ว!',false);
}

/* ── Host controls ── */
function salemHostNight(){
  const v=!(_salemState?.nightPhase);
  const updates={nightPhase:v};
  if(!v){
    // ออกจาก night phase → reset nightConfessed ทุกคนสำหรับรอบถัดไป
    Object.values(_salemState?.players||{}).forEach(p=>{
      updates[`players/${p.id}/nightConfessed`]=null;
    });
  }
  salemSave(updates,v?'🌙 เข้าสู่ Night Phase':'☀️ จบ Night Phase',false);
}
function salemHostSkipTurn(){salemAdvanceTurn();showToast('⏭ ข้ามเทิร์น')}
function salemHostKill(){
  if(!_salemState)return;
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const players=nonHostIds.map(id=>_salemState.players?.[id]).filter(p=>p&&p.isAlive!==false);
  $('salemTargetTitle').textContent='เลือกผู้ที่ตาย 💀';
  $('salemTargetPreview').innerHTML='Host ประกาศว่าใครถูกกำจัด';
  $('salemTargetList').innerHTML=players.map(p=>{
    const col=COLORS[nonHostIds.indexOf(p.id)%COLORS.length];
    return `<button class="salem-tbtn" onclick="salemKill('${p.id}')">
      <div style="width:32px;height:32px;border-radius:50%;background:${col}22;color:${col};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0">${esc(p.nick[0].toUpperCase())}</div>
      <div style="font-size:14px;font-weight:700;color:var(--t0);flex:1">${esc(p.nick)}</div>
      <div style="font-size:12px;color:var(--danger)">⚖️ ${p.accusePoints||0}/7</div>
    </button>`;
  }).join('');
  $('salemTargetOv').classList.add('open');
}
function salemKill(pid){
  salemCloseTarget();
  if(!_salemState)return;
  const p=_salemState.players?.[pid];
  const updates={[`players/${pid}/isAlive`]:false};
  const killed_has_mm=(p?.passives||[]).includes('matchmaker');
  const partner=Object.values(_salemState.players||{}).find(p2=>p2.id!==pid&&(p2.passives||[]).includes('matchmaker')&&p2.isAlive!==false);
  if(killed_has_mm&&partner){
    updates[`players/${partner.id}/isAlive`]=false;
    setTimeout(()=>showToast('💞 '+partner.nick+' เสียชีวิตตาม (Matchmaker)',3000),1200);
  }
  salemSave(updates,'💀 '+esc(p?.nick||pid)+' ออกจากเกม',true);
  setTimeout(()=>{if(_salemState)salemCheckWin(_salemState);},800);
}

/* ── Turn advance ── */
function salemAdvanceTurn(){
  if(!_salemState)return;
  if(!S.isHost){
    // Non-host: signal host to advance by writing to firebase
    if(firebaseReady&&S.roomCode){
      db.ref(`rooms/${S.roomCode}/salem/advanceTurnRequest`).set({by:S.myPlayerId,at:Date.now()});
    }
    return;
  }
  // ใช้ turnOrder ที่ Host กำหนด หรือถ้าไม่มีก็ใช้ nonHostIds ตามลำดับ
  const nonHostIds=S.players.filter(p=>!p.isHost).map(p=>p.id);
  const turnOrder=_salemState.turnOrder||nonHostIds;
  const aliveTurnOrder=turnOrder.filter(id=>{
    const p=_salemState.players?.[id];
    return p&&p.isAlive!==false;
  });
  if(!aliveTurnOrder.length)return;

  // ถ้า currentTurn เป็น null → เริ่มจากคนที่ถือแมวดำ
  if(!_salemState.currentTurn){
    const bcHolder=_salemState.blackCatHolder;
    const startId=bcHolder&&aliveTurnOrder.includes(bcHolder)?bcHolder:aliveTurnOrder[0];
    const updates={currentTurn:startId,advanceTurnRequest:null};
    // reset hasDrawn/hasActed ของคนแรก
    updates[`players/${startId}/hasDrawn`]=false;
    updates[`players/${startId}/hasActed`]=false;
    salemSave(updates,'',false);
    return;
  }

  const ci=aliveTurnOrder.indexOf(_salemState.currentTurn);
  // คนถัดไป = index+1 (วนลูป)
  let nextIdx=(ci+1)%aliveTurnOrder.length;
  // ถ้าคนถัดไปมี skipTurn → ข้ามไปทีละคน (guard: ข้ามได้ไม่เกิน length-1 ครั้ง เพื่อป้องกัน infinite loop)
  let skippedId=null;
  let skipGuard=0;
  while(
    _salemState.players?.[aliveTurnOrder[nextIdx]]?.skipTurn &&
    skipGuard < aliveTurnOrder.length - 1
  ){
    if(!skippedId) skippedId=aliveTurnOrder[nextIdx]; // เก็บคนแรกที่ถูกข้ามเพื่อแสดง toast
    // clear skipTurn ของคนที่ถูกข้ามไว้ใน updates ด้านล่าง
    nextIdx=(nextIdx+1)%aliveTurnOrder.length;
    skipGuard++;
  }
  const nextId=aliveTurnOrder[nextIdx];
  const updates={currentTurn:nextId,advanceTurnRequest:null};
  // clear skipTurn ของทุกคนที่ถูกข้ามในรอบนี้
  aliveTurnOrder.forEach(id=>{
    if(id!==nextId&&_salemState.players?.[id]?.skipTurn) updates[`players/${id}/skipTurn`]=false;
  });
  // reset hasDrawn/hasActed สำหรับเทิร์นใหม่
  updates[`players/${nextId}/hasDrawn`]=false;
  updates[`players/${nextId}/hasActed`]=false;
  salemSave(updates,skippedId?'⛓️ '+(_salemState.players?.[skippedId]?.nick||skippedId)+' โดนข้ามเทิร์น':'',false);
}

/* ── Win/Death check ── */
function salemCheckWitchDeath(data,pid){
  if(!S.isHost)return;// only host executes kills
  const p=data.players?.[pid];
  if(!p||p.isAlive===false)return;
  const tryals=p.tryal||[];
  const witchCards=tryals.filter(t=>t.type==='witch');
  if(witchCards.length>0&&witchCards.every(t=>t.revealed)){
    // ไพ่แม่มดครบ → เปิดการ์ดทั้งหมดแล้วตาย
    const allRevealedTryal=tryals.map(t=>({...t,revealed:true}));
    const updates={[`players/${pid}/isAlive`]:false,[`players/${pid}/tryal`]:allRevealedTryal};
    if(firebaseReady&&S.roomCode){
      db.ref(`rooms/${S.roomCode}/salem`).update(updates).then(()=>{
        showToast('🧙 '+esc(p.nick)+' ถูกจับแล้ว! เปิดไพ่ชีวิตทั้งหมด',4000);
        setTimeout(()=>{if(_salemState)salemCheckWin(_salemState);},800);
      });
    } else {
      p.isAlive=false;p.tryal=allRevealedTryal;
      syncSalemState(data);
      showToast('🧙 '+esc(p.nick)+' ถูกจับแล้ว!',4000);
      setTimeout(()=>salemCheckWin(data),800);
    }
  }
}

function salemCheckWin(data){
  const players=Object.values(data.players||{});
  // ตรวจ witch cards ที่ถูก reveal ครบแล้ว (เจ้าของตายแล้ว)
  const allTryal=players.flatMap(p=>p.tryal||[]);
  const witches=allTryal.filter(t=>t.type==='witch');
  const revealed=witches.filter(t=>t.revealed);
  // ตรวจว่าทุกคนที่มี witch card ตายแล้วทั้งหมด (ป้องกัน edge case)
  const witchHolders=players.filter(p=>(p.tryal||[]).some(t=>t.type==='witch'));
  const allWitchHoldersDead=witchHolders.length>0&&witchHolders.every(p=>p.isAlive===false);
  if(witches.length>0&&revealed.length===witches.length&&allWitchHoldersDead){
    showToast('🎉 ชาวบ้านชนะ! แม่มดถูกจับหมดแล้ว!',6000);
    if(S.isHost)salemSave({phase:'ended',winner:'village'},'',false);
  }
}
/* ══ END SALEM ══ */
