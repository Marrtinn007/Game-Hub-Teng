/* ══ WHEEL ═══════════════════════════════ */
function initWheel(){
  // Sync canvas buffer size to actual rendered size (CSS may scale it)
  const cv=$('wheelCanvas');
  if(cv){
    const rect=cv.getBoundingClientRect();
    const size=Math.round(Math.min(rect.width||420, rect.height||420));
    if(size>0){cv.width=size;cv.height=size;}
  }
  S.wheelItems=getPlayers().filter(p=>!p.isHost).map(p=>p.name);
  if(!S.wheelItems.length)S.wheelItems=['ตัวเลือก 1','ตัวเลือก 2','ตัวเลือก 3'];
  S.wheelSpinning=false;S.wheelAngle=0;
  renderWheelItems();drawWheel(0);
  setTimeout(_wheelSwipeInit,100);
}

// ── Swipe-to-spin ──
let _swipeActive=false,_swipePrevX=0,_swipePrevY=0,_swipePrevT=0,_swipeVelX=0,_swipeVelY=0;
function _wheelSwipeInit(){
  const cv=$('wheelCanvas');if(!cv)return;
  cv.onpointerdown=null;cv.onpointermove=null;cv.onpointerup=null;cv.onpointercancel=null;

  let _prevAngle=0,_angVel=0,_prevT=0,_rafId=null;

  function fingerAngle(e){
    const rect=cv.getBoundingClientRect();
    return Math.atan2(e.clientY-(rect.top+rect.height/2), e.clientX-(rect.left+rect.width/2));
  }
  function angleDiff(a,b){
    let d=a-b;
    while(d>Math.PI)d-=Math.PI*2;
    while(d<-Math.PI)d+=Math.PI*2;
    return d;
  }

  cv.addEventListener('pointerdown',function(e){
    if(_wheelHoldActive)return;
    e.preventDefault();
    _resumeAC();_wheelResetCross();
    // ไม่หยุด inertia — แค่จด angle เริ่มต้น
    if(_rafId){cancelAnimationFrame(_rafId);_rafId=null;}
    _swipeActive=true;
    _prevAngle=fingerAngle(e);
    _prevT=performance.now();
    // รับ velocity เดิมที่วงล้อกำลังหมุนอยู่ต่อ (ถ้ามี)
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor='grabbing';
  },{passive:false});

  cv.addEventListener('pointermove',function(e){
    if(!_swipeActive)return;
    e.preventDefault();
    const now=performance.now();
    const dt=Math.max(4,now-_prevT);
    const cur=fingerAngle(e);
    const delta=angleDiff(cur,_prevAngle);
    S.wheelAngle=((S.wheelAngle+delta)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
    _wheelCheckCross(S.wheelAngle,Math.abs(delta/dt)*200);
    drawWheel(S.wheelAngle);
    // EMA velocity — นิ้วเร็ว = velocity สูง
    _angVel=_angVel*0.5+(delta/dt)*0.5;
    _prevAngle=cur;
    _prevT=now;
  },{passive:false});

  function onUp(e){
    if(!_swipeActive)return;
    _swipeActive=false;
    cv.style.cursor='grab';
    const velRadPerSec=_angVel*1000;
    const speed=Math.abs(velRadPerSec);
    if(speed<0.2)return;
    // เพิ่ม velocity เข้าไปในการหมุน (สะสมกับ inertia เดิมถ้ามี)
    const dir=velRadPerSec>=0?1:-1;
    const decelDur=Math.max(800,speed*240);
    const a0=S.wheelAngle;
    const extraAngle=dir*speed*(decelDur/1000)*0.5;
    const t0=performance.now();
    if(_rafId){cancelAnimationFrame(_rafId);_rafId=null;}
    function inertia(now){
      const p=Math.min((now-t0)/decelDur,1);
      const ease=1-Math.pow(1-p,3);
      const ang=((a0+extraAngle*ease)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      _wheelCheckCross(ang,speed*(1-p));
      drawWheel(ang);
      if(p<1){_rafId=requestAnimationFrame(inertia);return;}
      _rafId=null;
      S.wheelAngle=ang;
      const n=S.wheelItems.length,sliceAng=(Math.PI*2)/n;
      const offset=((Math.PI*2)-ang)%(Math.PI*2);
      const winner=S.wheelItems[Math.floor(offset/sliceAng)%n];
      const resultEl=$('wheelResult');
      if(resultEl)resultEl.innerHTML=`<div class="wheel-result-text anim-pop">🎯 ${esc(winner)}</div>`;
      showToast(`${winner} โดนแล้ว! 🎯`,3000);
    }
    _rafId=requestAnimationFrame(inertia);
  }
  cv.addEventListener('pointerup',onUp);
  cv.addEventListener('pointercancel',onUp);
}
function renderWheelItems(){
  const list=$('wheelItemsList');if(!list)return;
  list.innerHTML=S.wheelItems.length?S.wheelItems.map((item,i)=>`
    <div class="wheel-item-row">
      <div class="wheel-dot" style="background:${COLORS[i%COLORS.length]}"></div>
      <div class="wheel-item-text">${esc(item)}</div>
      <button class="btn-del" onclick="delWheelItem(${i})">✕</button>
    </div>`).join('')
    :'<div style="text-align:center;color:var(--t2);padding:0.875rem;font-size:14px">ยังไม่มีตัวเลือก</div>';
  drawWheel(S.wheelAngle);
}
function addWheelItem(){
  const inp=$('wheelAddInput');if(!inp)return;
  const v=inp.value.trim();
  if(!v){showToast('ใส่ชื่อด้วย');return}
  if(S.wheelItems.includes(v)){showToast('มีชื่อนี้แล้ว!');return}
  S.wheelItems.push(v);inp.value='';renderWheelItems();
}
function delWheelItem(i){S.wheelItems.splice(i,1);renderWheelItems()}
function drawWheel(rot){
  const canvas=$('wheelCanvas');if(!canvas)return;
  // Keep canvas buffer = rendered size to avoid blur
  const rect=canvas.getBoundingClientRect();
  const sz=Math.round(rect.width||canvas.width);
  if(sz>0&&(canvas.width!==sz||canvas.height!==sz)){canvas.width=sz;canvas.height=sz;}
  const ctx=canvas.getContext('2d');
  const W=canvas.width,cx=W/2,cy=W/2;
  const items=S.wheelItems,r=W/2-6;
  ctx.clearRect(0,0,W,W);
  if(!items.length){
    ctx.fillStyle='rgba(255,255,255,0.04)';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();return;
  }
  const slice=Math.PI*2/items.length;
  items.forEach((item,i)=>{
    const s=rot+i*slice-Math.PI/2,e=s+slice;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,s,e);ctx.closePath();
    const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    const _th=document.documentElement.getAttribute('data-theme')||'dark';
    const _isCream=_th==='cream';
    grad.addColorStop(0,COLORS[i%COLORS.length]+(_isCream?'80':'50'));
    grad.addColorStop(1,COLORS[i%COLORS.length]+(_isCream?'50':'20'));
    ctx.fillStyle=grad;ctx.fill();
    ctx.strokeStyle=COLORS[i%COLORS.length]+(_isCream?'cc':'90');ctx.lineWidth=1.5;ctx.stroke();
    const mid=s+slice/2,tx=cx+(r-32)*Math.cos(mid),ty=cy+(r-32)*Math.sin(mid);
    ctx.save();ctx.translate(tx,ty);ctx.rotate(mid+Math.PI/2);
    ctx.textAlign='center';
    // ใช้สีตามธีม
    const isDark=!['cream'].includes(document.documentElement.getAttribute('data-theme')||'dark');
    ctx.fillStyle=isDark?'rgba(255,255,255,0.92)':'rgba(30,20,10,0.88)';
    ctx.font=`700 ${Math.max(13,Math.min(19,260/items.length))}px Kanit,sans-serif`;
    ctx.fillText(item.length>9?item.slice(0,9)+'…':item,0,0);
    ctx.restore();
  });
  ctx.beginPath();ctx.arc(cx,cy,22,0,Math.PI*2);
  const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,22);
  cg.addColorStop(0,'#1a1a30');cg.addColorStop(1,'#0c0c18');
  ctx.fillStyle=cg;ctx.fill();
  const _isDark2=!['cream'].includes(document.documentElement.getAttribute('data-theme')||'dark');
  ctx.strokeStyle=_isDark2?'rgba(255,255,255,0.18)':'rgba(0,0,0,0.15)';ctx.lineWidth=2;ctx.stroke();
}
/* ══ SOUND ENGINE ══════════════════════════════════════════════ */
// Haptic
function _haptic(pattern){try{navigator.vibrate&&navigator.vibrate(pattern)}catch(e){}}

const _AC=(()=>{try{return new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}})();
function _resumeAC(){if(_AC&&_AC.state==='suspended')_AC.resume()}

// ── วงล้อ: click ตอนลูกศรข้ามเส้นแบ่ง segment จริงๆ ──
let _wheelPrevSeg=-1;
function _wheelClick(vel){
  if(!_AC)return;
  const now=_AC.currentTime;
  // เสียง tick แบบ ratchet — triangle burst สั้น pitch สูง
  const vol=Math.min(0.25,0.08+vel*0.009);
  const pitch=500+vel*18;
  const g=_AC.createGain();
  g.gain.setValueAtTime(vol,now);
  g.gain.exponentialRampToValueAtTime(0.001,now+0.03);
  const o=_AC.createOscillator();
  o.type='triangle';
  o.frequency.setValueAtTime(pitch,now);
  o.frequency.exponentialRampToValueAtTime(pitch*0.6,now+0.03);
  o.connect(g);g.connect(_AC.destination);
  o.start(now);o.stop(now+0.03);
  // click body — noise เบาๆ
  const nb=_AC.createBuffer(1,Math.ceil(_AC.sampleRate*0.02),_AC.sampleRate);
  const nd=nb.getChannelData(0);
  for(let i=0;i<nd.length;i++)nd[i]=(Math.random()*2-1)*Math.pow(1-i/nd.length,3);
  const ns=_AC.createBufferSource();ns.buffer=nb;
  const ng=_AC.createGain();ng.gain.setValueAtTime(vol*0.4,now);ng.gain.exponentialRampToValueAtTime(0.001,now+0.02);
  const bp=_AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=3000;bp.Q.value=1;
  ns.connect(bp);bp.connect(ng);ng.connect(_AC.destination);
  ns.start(now);
}
// เรียกจาก drawWheel ทุก frame — detect crossing
function _wheelCheckCross(angle,vel){
  if(!S.wheelItems||S.wheelItems.length<2)return;
  const n=S.wheelItems.length;
  const sliceAng=(Math.PI*2)/n;
  const offset=((Math.PI*2)-((angle%(Math.PI*2))+(Math.PI*2))%(Math.PI*2))%(Math.PI*2);
  const seg=Math.floor(offset/sliceAng)%n;
  if(_wheelPrevSeg!==-1&&seg!==_wheelPrevSeg){_wheelClick(vel||_wheelHoldVel);}
  _wheelPrevSeg=seg;
}
function _wheelResetCross(){_wheelPrevSeg=-1;}

// ── ไพ่: เสียงตอนขยับแต่ละใบ (track pixel crossing) + land ──
let _cardPrevItemIdx=-1;
function _cardTick(vel){
  if(!_AC)return;
  const now=_AC.currentTime;
  // เสียงกระดาษ — noise burst
  const len=Math.ceil(_AC.sampleRate*0.028);
  const buf=_AC.createBuffer(1,len,_AC.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5);
  const src=_AC.createBufferSource();src.buffer=buf;
  const vol=Math.min(0.28,0.1+vel*0.013);
  const g=_AC.createGain();g.gain.setValueAtTime(vol,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.028);
  const bp=_AC.createBiquadFilter();bp.type='bandpass';
  bp.frequency.value=1800+vel*60+Math.random()*400;bp.Q.value=1.1;
  src.connect(bp);bp.connect(g);g.connect(_AC.destination);
  src.start(now);
  // thud เบา ๆ
  const o=_AC.createOscillator();o.type='sine';
  o.frequency.setValueAtTime(80,now);o.frequency.exponentialRampToValueAtTime(38,now+0.04);
  const og=_AC.createGain();og.gain.setValueAtTime(vol*0.45,now);og.gain.exponentialRampToValueAtTime(0.001,now+0.05);
  o.connect(og);og.connect(_AC.destination);
  o.start(now);o.stop(now+0.05);
}
// เรียกจาก scrollTick และ decelTick ทุก frame
function _cardCheckCross(scrollOffset,vel){
  const idx=Math.floor(scrollOffset/180);
  if(_cardPrevItemIdx!==-1&&idx!==_cardPrevItemIdx){_cardTick(vel||_drawHoldVel);}
  _cardPrevItemIdx=idx;
}
function _cardResetCross(){_cardPrevItemIdx=-1;}
function _cardSoundLand(){
  if(!_AC)return;
  const now=_AC.currentTime;
  const len=Math.ceil(_AC.sampleRate*0.07);
  const buf=_AC.createBuffer(1,len,_AC.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,1.8);
  const src=_AC.createBufferSource();src.buffer=buf;
  const g=_AC.createGain();g.gain.setValueAtTime(0.38,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.07);
  const bp=_AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1600;bp.Q.value=0.8;
  src.connect(bp);bp.connect(g);g.connect(_AC.destination);
  src.start(now);
  const o=_AC.createOscillator();o.type='sine';
  o.frequency.setValueAtTime(110,now);o.frequency.exponentialRampToValueAtTime(42,now+0.1);
  const og=_AC.createGain();og.gain.setValueAtTime(0.32,now);og.gain.exponentialRampToValueAtTime(0.001,now+0.12);
  o.connect(og);og.connect(_AC.destination);
  o.start(now);o.stop(now+0.12);
}

function spinWheel(){startHoldSpin();setTimeout(releaseHoldSpin,1500+Math.random()*1000)}
let _wheelHoldRAF=null,_wheelHoldActive=false,_wheelHoldStart=0,_wheelHoldVel=2;
function startHoldSpin(e){
  e&&e.preventDefault&&e.preventDefault();
  const btn=$('btnSpin');
  if(_wheelHoldActive||!btn||btn.disabled)return;
  if(S.wheelItems.length<2){showToast('ต้องมีอย่างน้อย 2 ตัวเลือก');return}
  _wheelHoldActive=true;_wheelHoldStart=performance.now();_wheelHoldVel=2;
  btn.classList.add('holding');
  _resumeAC();_wheelResetCross();
  const resultEl=$('wheelResult');if(resultEl)resultEl.innerHTML='';
  let lastT=performance.now();
  function spinTick(now){
    if(!_wheelHoldActive)return;
    const dt=Math.min((now-lastT)/1000,0.05);lastT=now;
    _wheelHoldVel=Math.min(20,2+((now-_wheelHoldStart)/1000)*5);
    S.wheelAngle=(S.wheelAngle+_wheelHoldVel*dt)%(Math.PI*2);
    _wheelCheckCross(S.wheelAngle,_wheelHoldVel);
    drawWheel(S.wheelAngle);
    _wheelHoldRAF=requestAnimationFrame(spinTick);
  }
  _wheelHoldRAF=requestAnimationFrame(spinTick);
}
function releaseHoldSpin(){
  if(!_wheelHoldActive)return;
  _wheelHoldActive=false;
  if(_wheelHoldRAF){cancelAnimationFrame(_wheelHoldRAF);_wheelHoldRAF=null;}
  const btn=$('btnSpin');if(btn){btn.classList.remove('holding');btn.disabled=true;}
  const vel=_wheelHoldVel;
  const decelDur=Math.max(1000,vel*200);
  const a0=S.wheelAngle;
  const extraAngle=vel*(decelDur/1000)*0.5;
  const t0=performance.now();
  function decelTick(now){
    const p=Math.min((now-t0)/decelDur,1);
    const ease=1-Math.pow(1-p,3);
    const ang=(a0+extraAngle*ease)%(Math.PI*2);
    _wheelCheckCross(ang,vel*(1-p));
    drawWheel(ang);
    if(p<1){requestAnimationFrame(decelTick);return;}
    const finalAngle=((a0+extraAngle)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
    S.wheelAngle=finalAngle;
    const n=S.wheelItems.length,sliceAng=(Math.PI*2)/n;
    const offset=((Math.PI*2)-finalAngle%(Math.PI*2))%(Math.PI*2);
    const winnerIdx=Math.floor(offset/sliceAng)%n;
    const winner=S.wheelItems[winnerIdx];
    drawWheel(finalAngle);
    const resultEl=$('wheelResult');
    if(resultEl)resultEl.innerHTML=`<div class="wheel-result-text anim-pop">🎯 ${esc(winner)}</div>`;
    showToast(`${winner} โดนแล้ว! 🎯`,3000);
    _haptic([60,30,60]);
    if(btn)btn.disabled=false;
  }
  requestAnimationFrame(decelTick);
}

