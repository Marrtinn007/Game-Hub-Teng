/* ══ CARDS ═══════════════════════════════ */
function initCards(){
  const vals=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const suits=['♠','♥','♦','♣'];
  S.cardDeck=shuffle(vals.flatMap(v=>suits.map(s=>({v,s}))));
  S.cardIdx=0;S._cardSpinning=false;S.cardRound=0;
  const cl=$('cardsLeft');if(cl)cl.textContent=S.cardDeck.length;
  const cr=$('cardRound');if(cr)cr.textContent='0';
  _reel=null;_reelBase=0;_drawScrollOffset=0;
  const reel=$('cardSlotReel');
  if(reel)reel.innerHTML='<div class="card-slot-item"><span style="font-size:14px;color:var(--t2)">กดปุ่มด้านล่างเพื่อจั่วไพ่</span></div>';
}
// ── HOLD-TO-DRAW ──
let _drawHoldRAF=null,_drawHoldActive=false,_drawHoldStart=0,_drawHoldPhase='idle',_drawScrollOffset=0,_drawHoldVel=1;
const _DRAW_ITEM_H=240;
const _DRAW_ALL_VALS=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const _DRAW_ALL_SUITS=['♠','♥','♦','♣'];
// ── Card Reel Engine — zero innerHTML in animation loop ──
// pre-build structure แค่ครั้งเดียว แล้วแก้ textContent/style เท่านั้น
function _makeCardNode(){
  const wrap=document.createElement('div');wrap.className='card-slot-item';
  const val=document.createElement('div');val.className='playing-card-val';
  const rule=document.createElement('div');rule.className='playing-card-rule';
  rule.style.fontSize='22px';rule.style.color='var(--t1)';
  const desc=document.createElement('div');desc.className='playing-card-desc';
  desc.style.display='none';
  wrap.appendChild(val);wrap.appendChild(rule);wrap.appendChild(desc);
  return wrap;
}
function _fillNode(node, fv, fs, ruleText, descText, isResult){
  const fr=fs==='♥'||fs==='♦';
  const val=node.children[0];
  const rule=node.children[1];
  const desc=node.children[2];
  val.textContent=fv+fs;
  val.style.color=fr?'#f06e7a':'var(--t0)';
  rule.textContent=ruleText||'';
  if(isResult&&descText){
    desc.textContent=descText;
    desc.style.display='';
  } else {
    desc.textContent='';
    desc.style.display='none';
  }
}
function _fillNodeRandom(node){
  const fv=_DRAW_ALL_VALS[Math.floor(Math.random()*_DRAW_ALL_VALS.length)];
  const fs=_DRAW_ALL_SUITS[Math.floor(Math.random()*_DRAW_ALL_SUITS.length)];
  const fRule=CARDS[fv]||{r:fv,d:''};
  _fillNode(node,fv,fs,fRule.r,'',false);
}

const _POOL=20;
let _reel=null,_reelBase=0;

function _reelInit(){
  const reel=$('cardSlotReel');if(!reel)return;
  reel.innerHTML='';
  for(let i=0;i<_POOL;i++){
    const n=_makeCardNode();
    _fillNodeRandom(n);
    reel.appendChild(n);
  }
  _drawScrollOffset=0;_reelBase=0;
  reel.style.transform='translateY(0)';
  _reel=reel;
}

function _reelSetCard(offsetPx,card,rule){
  if(!_reel)return;
  const idx=Math.round((offsetPx-_reelBase)/_DRAW_ITEM_H);
  if(idx>=0&&idx<_reel.children.length){
    _fillNode(_reel.children[idx],card.v,card.s,rule.r,rule.d,true);
  }
}

function _reelRecycle(scrollOffset){
  if(!_reel)return;
  while(_reelBase+_DRAW_ITEM_H*2<scrollOffset){
    const el=_reel.firstChild;if(!el)break;
    _fillNodeRandom(el);
    _reel.removeChild(el);
    _reel.appendChild(el);
    _reelBase+=_DRAW_ITEM_H;
  }
  const topVisible=_reelBase+(_POOL-3)*_DRAW_ITEM_H;
  while(scrollOffset+_DRAW_ITEM_H*3>topVisible){
    const n=_makeCardNode();_fillNodeRandom(n);
    _reel.appendChild(n);
    if(_reel.children.length>_POOL){
      _reel.removeChild(_reel.firstChild);
      _reelBase+=_DRAW_ITEM_H;
    }
  }
}


function toggleDraw(){
  if(_drawHoldPhase==='spinning'){
    // กำลังหมุนอยู่ → หยุด
    releaseHoldDraw();
  } else if(_drawHoldPhase==='idle'){
    // ยังไม่ได้หมุน → เริ่มหมุน
    startHoldDraw();
  }
  // ถ้า phase เป็น 'settling' ก็ไม่ทำอะไร รอให้หยุดก่อน
}

function startHoldDraw(e){
  e&&e.preventDefault&&e.preventDefault();
  if(_drawHoldPhase!=='idle')return;
  if(S.cardIdx>=S.cardDeck.length){showToast('\u0e2b\u0e21\u0e14\u0e2a\u0e33\u0e23\u0e31\u0e1a\u0e41\u0e25\u0e49\u0e27! \u0e40\u0e23\u0e34\u0e48\u0e21\u0e43\u0e2b\u0e21\u0e48');initCards();return;}
  _drawHoldActive=true;_drawHoldStart=performance.now();_drawHoldPhase='spinning';_drawHoldVel=1;
  const btn=$('btnDrawCard');
  if(btn){btn.classList.add('holding');btn.textContent='⏹ หยุด!';}
  _resumeAC();_cardResetCross();
  // ถ้ายังไม่มี reel หรือ reset ครั้งแรก
  if(!_reel||_reel.children.length===0) _reelInit();
  let lastT=performance.now();
  function scrollTick(now){
    if(!_drawHoldActive)return;
    const dt=Math.min((now-lastT)/1000,0.05);lastT=now;
    _drawHoldVel=Math.min(12,1+((now-_drawHoldStart)/1000)*3.5);
    _drawScrollOffset+=_drawHoldVel*_DRAW_ITEM_H*dt;
    _reelRecycle(_drawScrollOffset);
    _cardCheckCross(_drawScrollOffset,_drawHoldVel);
    _reel.style.transform=`translateY(-${_drawScrollOffset-_reelBase}px)`;
    _drawHoldRAF=requestAnimationFrame(scrollTick);
  }
  _drawHoldRAF=requestAnimationFrame(scrollTick);
}

function releaseHoldDraw(){
  if(!_drawHoldActive||_drawHoldPhase!=='spinning')return;
  _drawHoldActive=false;_drawHoldPhase='settling';
  if(_drawHoldRAF){cancelAnimationFrame(_drawHoldRAF);_drawHoldRAF=null;}
  const btn=$('btnDrawCard');
  if(btn){btn.classList.remove('holding');btn.textContent='🃏 สุ่มไพ่!';}
  if(S.cardIdx>=S.cardDeck.length){showToast('\u0e2b\u0e21\u0e14\u0e2a\u0e33\u0e23\u0e31\u0e1a\u0e41\u0e25\u0e49\u0e27! \u0e40\u0e23\u0e34\u0e48\u0e21\u0e43\u0e2b\u0e21\u0e48');initCards();_drawHoldPhase='idle';return;}
  const card=S.cardDeck[S.cardIdx++];
  S.cardRound=(S.cardRound||0)+1;
  const cl=$('cardsLeft');if(cl)cl.textContent=S.cardDeck.length-S.cardIdx;
  const cr=$('cardRound');if(cr)cr.textContent=S.cardRound;
  const rule=CARDS[card.v]||{r:card.v,d:''};
  const isRed=card.s==='\u2665'||card.s==='\u2666';
  const sc=isRed?'#f06e7a':'var(--t0)';
  if(!_reel){_drawHoldPhase='idle';return;}
  const vel=_drawHoldVel;
  const decelDur=Math.max(1400,vel*350);
  // snap ไปที่ขอบ item ถัดไป + extra 4 ใบ
  const curOffset=_drawScrollOffset;
  const snapTo=Math.ceil(curOffset/_DRAW_ITEM_H)*_DRAW_ITEM_H;
  const extraItems=Math.max(3,Math.round(vel*decelDur/1000*0.4));
  const targetOffset=snapTo+extraItems*_DRAW_ITEM_H;
  // วางไพ่จริงที่ตำแหน่ง target
  // เพิ่ม node ให้ถึง target ก่อน
  while(_reelBase+_reel.children.length*_DRAW_ITEM_H<targetOffset+_DRAW_ITEM_H*2){
    const n=_makeCardNode();_fillNodeRandom(n);
    _reel.appendChild(n);
    if(_reel.children.length>_POOL+8){
      _reel.removeChild(_reel.firstChild);
      _reelBase+=_DRAW_ITEM_H;
    }
  }
  _reelSetCard(targetOffset, card, rule);
  const dist=targetOffset-curOffset;
  const t0=performance.now();
  function decelTick(now){
    const p=Math.min((now-t0)/decelDur,1),ease=1-Math.pow(1-p,4);
    const pos=curOffset+dist*ease;
    _reelRecycle(pos);
    _cardCheckCross(pos,vel*(1-p));
    _reel.style.transform=`translateY(-${pos-_reelBase}px)`;
    if(p<1){requestAnimationFrame(decelTick);return;}
    _reel.style.transform=`translateY(-${targetOffset-_reelBase}px)`;
    _drawScrollOffset=targetOffset;_drawHoldPhase='idle';
    _cardSoundLand();
    _haptic([40,20,40]);
  }
  requestAnimationFrame(decelTick);
}
function drawCard(){startHoldDraw();setTimeout(releaseHoldDraw,1200+Math.random()*600)}

