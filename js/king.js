/* ══ KING'S GAME ══════════════════════════════════════════════ */
function initKing(){
  S.kingDealt=false;S.kingMyCard=null;S.kingFlipped=false;S._kingDealId=null;
  const lbl=$('kingPhaseLabel');if(lbl)lbl.textContent='รอแจกไพ่';
  renderKingSetup();
}

function renderKingSetup(){
  const body=$('kingBody');if(!body)return;
  const players=getPlayers().filter(p=>!p.isHost);
  const n=players.length;
  if(!S.isHost){
    body.innerHTML=`<div style="text-align:center;padding:4rem 1rem">
      <div style="font-size:60px;margin-bottom:1rem">👑</div>
      <div style="font-size:17px;font-weight:800;color:var(--t0);margin-bottom:0.5rem">รอ Host แจกไพ่</div>
      <div style="font-size:14px;color:var(--t2);line-height:1.7">เมื่อ Host แจกแล้ว<br>กดดูไพ่ของคุณเลย</div>
    </div>`;return;
  }
  body.innerHTML=`
    <div style="text-align:center;padding:1.5rem 0 1rem">
      <div style="font-size:56px;margin-bottom:0.5rem">👑</div>
      <div style="font-size:17px;font-weight:800;color:var(--t0);margin-bottom:4px">King's Game</div>
      <div style="font-size:13px;color:var(--t2);line-height:1.7">ผู้เล่น <span style="color:var(--ac);font-weight:700">${n}</span> คน<br>ใครได้ 👑 คือราชา สั่งเลขได้เลย</div>
    </div>
    <div style="background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.2);border-radius:var(--r-s);padding:1rem 1.25rem;margin-bottom:1.5rem;font-size:13px;color:var(--warn);line-height:1.75">
      <b>วิธีเล่น</b><br>
      1. Host แจกไพ่ — ทุกคนได้คนละใบ<br>
      2. ราชา (👑) สั่ง "เลข X ทำ..."<br>
      3. ทุกคนเปิดไพ่พร้อมกัน — ใครได้เลขนั้นทำตาม<br>
      4. เล่นซ้ำรอบใหม่ได้เรื่อยๆ
    </div>
    <button class="btn btn-ac btn-full" onclick="dealKingCards()" style="height:58px;font-size:17px;font-weight:800" ${n<2?'disabled':''}>
      👑 แจกไพ่ (${n} คน)
    </button>
    ${n<2?'<p style="text-align:center;font-size:13px;color:var(--t2);margin-top:0.75rem">ต้องมีผู้เล่นอย่างน้อย 2 คน</p>':''}`;
}

function dealKingCards(){
  const players=getPlayers().filter(p=>!p.isHost);
  if(players.length<2){showToast('ต้องมีผู้เล่นอย่างน้อย 2 คน');return;}
  const n=players.length;
  // สร้างไพ่: 1 ราชา + เลข 1...(n-1)
  const shuffled=shuffle([...players]);
  const assigned={};
  shuffled.forEach((p,i)=>{assigned[p.id]=i===0?'👑':String(i);});
  const dealId=Date.now();
  S.kingDealt=true;S.kingMyCard=null;S.kingFlipped=false;S._kingDealId=dealId;S.kingListHidden=false;S._kingAssigned=assigned;
  if(firebaseReady&&S.roomCode){
    db.ref(`rooms/${S.roomCode}/king`).set({assigned,dealId,dealt:true});
  }
  const lbl=$('kingPhaseLabel');if(lbl)lbl.textContent='ดูไพ่ของคุณ';
  renderKingHost(assigned,dealId);
}

function toggleKingListHidden(){
  S.kingListHidden=!S.kingListHidden;
  if(S._kingAssigned)renderKingHost(S._kingAssigned,S._kingDealId);
}

function _kingPlayerRow(p,i,assigned){
  var card=assigned[p.id];
  var isKing=card==='👑';
  var bg=isKing?'rgba(255,209,102,0.08)':'var(--card)';
  var border=isKing?'rgba(255,209,102,0.3)':'var(--line)';
  var avatarBg=COLORS[i%COLORS.length]+'28';
  var avatarColor=COLORS[i%COLORS.length];
  var cardSize=isKing?'28':'22';
  var cardColor=isKing?'var(--warn)':'var(--t0)';
  return '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:'+bg+';border-radius:var(--r);border:1px solid '+border+'">'
    +'<div style="width:36px;height:36px;border-radius:50%;background:'+avatarBg+';color:'+avatarColor+';display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;flex-shrink:0">'+esc(p.name.charAt(0).toUpperCase())+'</div>'
    +'<div style="flex:1;font-size:16px;font-weight:700;color:var(--t0)">'+esc(p.name)+'</div>'
    +'<div style="font-size:'+cardSize+'px;font-weight:900;color:'+cardColor+'">'+card+'</div>'
    +'</div>';
}

function renderKingHost(assigned,dealId){
  var body=$('kingBody');if(!body)return;
  var players=getPlayers().filter(function(p){return !p.isHost;});
  var hidden=!!S.kingListHidden;
  var toggleLabel=hidden?'👁 แสดงรายชื่อ':'🙈 ซ่อนรายชื่อ';
  var listHtml;
  if(hidden){
    listHtml='<div style="background:rgba(255,209,102,0.07);border:1px solid rgba(255,209,102,0.2);border-radius:var(--r);padding:1.5rem;text-align:center">'
      +'<div style="font-size:36px;margin-bottom:0.5rem">🙈</div>'
      +'<div style="font-size:15px;font-weight:700;color:var(--warn)">รายชื่อถูกซ่อนอยู่</div>'
      +'<div style="font-size:13px;color:var(--t2);margin-top:4px;line-height:1.6">Host เห็นไพ่ แต่คนอื่นไม่เห็นหน้าจอนี้<br>กดปุ่มด้านบนเพื่อแสดง</div>'
      +'</div>';
  } else {
    var rows=players.map(function(p,i){return _kingPlayerRow(p,i,assigned);}).join('');
    listHtml='<div style="display:flex;flex-direction:column;gap:8px;text-align:left">'+rows+'</div>';
  }
  body.innerHTML=''
    +'<div style="padding:1rem 0 1.5rem">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem">'
        +'<div style="font-size:13px;color:var(--t2)">Host มองเห็นไพ่ทุกคน</div>'
        +'<button class="btn btn-sf" style="height:36px;padding:0 14px;font-size:13px;font-weight:700;gap:5px;display:flex;align-items:center" onclick="toggleKingListHidden()">'+toggleLabel+'</button>'
      +'</div>'
      +listHtml
    +'</div>'
    +'<button class="btn btn-sf btn-full" onclick="dealKingCards()" style="height:50px;font-size:15px;margin-top:0.5rem">🔄 แจกใหม่</button>';
}

function renderKingPlayer(assigned,dealId){
  const body=$('kingBody');if(!body)return;
  const myId2=myId();
  const card=assigned&&assigned[myId2];
  if(!card){
    body.innerHTML=`<div style="text-align:center;padding:4rem 1rem"><div style="font-size:56px;margin-bottom:1rem">⏳</div><div style="font-size:16px;color:var(--t2)">รอ Host แจกไพ่...</div></div>`;
    return;
  }
  const isKing=card==='👑';
  const flipped=S.kingFlipped;
  body.innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center;padding:1.5rem 0">
      <p style="font-size:13px;color:var(--t2);text-align:center;margin-bottom:1.5rem;line-height:1.65">กดไพ่เพื่อดู ⚠️ ห้ามให้คนอื่นเห็น!</p>
      <div class="role-playing-card${flipped?' flipped':''}" id="king-card-flip" onclick="toggleKingCard()">
        <div class="rpc-inner">
          <div class="rpc-front" style="background:var(--card2)">
            <div style="font-size:64px;line-height:1;margin-bottom:0.5rem;opacity:0.15">👑</div>
            <div style="font-size:15px;color:var(--t2);font-weight:500">กดเพื่อดูไพ่</div>
          </div>
          <div class="rpc-back" style="justify-content:center;align-items:center;padding:2rem;text-align:center">
            <div style="font-size:${isKing?'88':'100'}px;line-height:1;margin-bottom:0.75rem">${card}</div>
            <div style="font-size:${isKing?'24':'20'}px;font-weight:900;color:${isKing?'var(--warn)':'var(--t0)'}">${isKing?'ราชา':'เลข '+card}</div>
            <div style="font-size:13px;color:${isKing?'rgba(255,209,102,0.65)':'var(--t2)'};margin-top:8px;line-height:1.6">
              ${isKing?'สั่งเลขที่คุณต้องการได้เลย':'ทำตามถ้าราชาเรียกเลขนี้'}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function toggleKingCard(){
  S.kingFlipped=!S.kingFlipped;
  const el=$('king-card-flip');
  if(el)S.kingFlipped?el.classList.add('flipped'):el.classList.remove('flipped');
}

function syncKingState(data){
  if(!data||!data.dealt)return;
  if(data.dealId&&data.dealId!==S._kingDealId){
    S.kingFlipped=false;S._kingDealId=data.dealId;
    if(!S.isHost)_haptic([30,20,30,20,50]);
  }
  S._kingAssigned=data.assigned;
  const onKing=document.querySelector('.screen.active')?.id==='screen-king';if(!onKing)return;
  const lbl=$('kingPhaseLabel');if(lbl)lbl.textContent='ดูไพ่ของคุณ';
  if(S.isHost)renderKingHost(data.assigned,data.dealId);
  else renderKingPlayer(data.assigned,data.dealId);
}

