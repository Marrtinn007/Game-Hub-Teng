/* ══ HOME GREETINGS ══════════════════════ */
const HOME_GREETINGS=[
  {text:'สวัสดี',e:'👋'},
  {text:'หวัดดี',e:'😄'},
  {text:'ยินดีต้อนรับ',e:'🎉'},
  {text:'ดีใจที่เจอกัน',e:'💫'},
  {text:'พร้อมลุยหรือยัง',e:'⚡'},
  {text:'มาสนุกกัน',e:'🎮'},
];
function randomGreeting(){return HOME_GREETINGS[Math.floor(Math.random()*HOME_GREETINGS.length)]}

/* ══ SETTINGS ════════════════════════════ */
const DEFAULT_SETTINGS={voiceEnabled:true,voiceVolume:1.0,nightActionTime:20,discussTime:120,voteTime:60,voicePauseTime:3};
let SETTINGS={...DEFAULT_SETTINGS};

/* ══ STATE ═══════════════════════════════ */
const S={
  roomCode:null,roomName:null,nickname:null,isHost:false,myPlayerId:null,
  sessionId:'sess_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
  players:[],selectedGame:null,pendingRoomCode:null,paused:false,
  wheelItems:[],wheelSpinning:false,wheelAngle:0,
  cardDeck:[],cardIdx:0,cardRound:0,_cardSpinning:false,
  wwPlayerCount:0,wwExpandedTeams:{evil:false,good:false,solo:false},
  wwRoleCounts:{werewolf:0,wolfcub:0,lonewolf:0,minion:0,sorcerer:0,alphawolf:0,cursed:0,villager:0,seer:0,bodyguard:0,hunter:0,witch:0,prince:0,cupid:0,mason:0,spellcaster:0,auraseer:0,apprenticeseer:0,priest:0,troublemaker:0,pi:0,oldhag:0,toughguy:0,lycan:0,diseased:0,mystic:0,mentalist:0,huntress:0,tanner:0,vampire:0,cultleader:0,hoodlum:0,revealer:0,madbomber:0},
  wwAssigned:{},wwAlive:{},wwMyRole:null,wwFlipped:{},_lastDealId:null,
  wwStatus:{},wwCupidPair:[],wwWolfIds:[],
  myWord:null,myWordVisible:false,
  spyNumSpies:1,spyTimeMins:8,spyDealt:false,spyFlipped:false,_lastSpyData:null,_lastSpyDealId:null,
  spyLocation:null,spyRole:null,spyIsSpy:false,spyFlipped:false,spyNumSpies:1,spyTimer:null,spyTimeLeft:0,spyDealt:false,
};

/* ══ UTILS ═══════════════════════════════ */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let _rejoinInProgress=false;
function showScreen(id){
  // ซ่อน connecting overlay เฉพาะเมื่อไม่ได้อยู่ใน rejoin flow
  if(!_rejoinInProgress){const ov=$('connectingOverlay');if(ov)ov.style.display='none';}
  if(id==='screen-lobby'){_rejoinInProgress=false;const ov=$('connectingOverlay');if(ov)ov.style.display='none';}
  // แสดง/ซ่อนปุ่มธีมตาม screen
  const gameScreens=['screen-ww','screen-wheel','screen-cards','screen-spyfall','screen-king','screen-salem'];
  const btn=$('themeSwitcherBtn');const sheet=$('themeSheet');
  if(btn){btn.style.display=gameScreens.includes(id)?'none':'';}
  if(sheet&&gameScreens.includes(id))sheet.classList.remove('open');

  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el=$(id);if(el){el.classList.add('active');el.scrollTop=0;}

}
function getPlayers(){return S.players.length?S.players:[{id:S.myPlayerId||'demo',name:S.nickname||'ผู้เล่น 1',isHost:true}]}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=0|Math.random()*(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function genCode(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<6;i++)s+=c[0|Math.random()*c.length];return s}
/* ══ PLAYER ID (ถาวรต่อบัญชี, ใช้ใน log/admin search) ══ */
function genPlayerId(){
  const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part=n=>{let s='';for(let i=0;i<n;i++)s+=c[0|Math.random()*c.length];return s};
  return `${part(3)}-${part(3)}-${part(6)}`;
}
let myPid=null;
function ensurePlayerId(uid){
  if(!db||!uid)return Promise.resolve(null);
  const ref=db.ref('userSessions/'+uid+'/pid');
  return ref.once('value').then(snap=>{
    if(snap.exists()&&snap.val()){myPid=snap.val();return myPid;}
    const pid=genPlayerId();
    return ref.set(pid).then(()=>{myPid=pid;return pid;}).catch(()=>{myPid=pid;return pid;});
  }).then(pid=>{
    renderProfilePid();
    return pid;
  }).catch(()=>null);
}
function renderProfilePid(){
  const el=$('profileDropPid');
  if(el)el.textContent=myPid?('ID: '+myPid):'';
}
function copyMyPid(){
  if(!myPid)return;
  navigator.clipboard?.writeText(myPid).then(()=>showToast('คัดลอก Player ID แล้ว')).catch(()=>{});
}
/* ══ LOG EVENTS (เขียนไป /logs สำหรับ admin) ══ */
function logEvent(action,detail){
  if(!db)return;
  try{
    db.ref('logs').push({
      pid:myPid||null,
      uid:currentUser?.uid||null,
      nick:S.nickname||currentUser?.displayName||null,
      action:action||'',
      detail:detail||null,
      room:S.roomCode||null,
      ts:Date.now()
    }).catch(()=>{});
  }catch(e){}
}
function totalRoles(){return Object.values(S.wwRoleCounts).reduce((a,b)=>a+b,0)}
function totalPts(){return Object.entries(S.wwRoleCounts).reduce((sum,[r,cnt])=>sum+(WW[r]?.pts||0)*cnt,0)}
function ptsDisplay(){
  const p=totalPts();
  const col=p>2?'var(--danger)':p<-2?'#60a5fa':p===0?'var(--ok)':'var(--warn)';
  const label=p>2?'ฝ่ายชาวบ้านได้เปรียบ':p<-2?'ฝ่ายสมิงได้เปรียบ':p===0?'⚖ สมดุล':'ใกล้สมดุล';
  return`<span style="color:${col};font-weight:900">${p>0?'+':''}${p} ${label}</span>`;
}
function myId(){return S.myPlayerId||'demo'}
function playerName_(pid){return getPlayers().find(p=>p.id===pid)?.name||''}
let _t;
function showToast(msg,dur=2600){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(_t);_t=setTimeout(()=>t.classList.remove('show'),dur)}
function closeAnnounceBanner(){const b=$('announceBanner');if(b)b.style.display='none';}
function openModal(id){$(id)?.classList.add('open')}
function closeModal(id){$(id)?.classList.remove('open')}
function closeModalOutside(e,id){if(e.target.id===id)closeModal(id)}

/* ══ GAMEOVER ════════════════════════════ */
function showGameover(icon,title,sub){
  const oi=$('gameoverIcon'),ti=$('gameoverTitle'),si=$('gameoverSub');
  if(oi)oi.textContent=icon;if(ti)ti.textContent=title;if(si)si.textContent=sub;
  $('gameoverOverlay')?.classList.add('show');
}
function closeGameover(){$('gameoverOverlay')?.classList.remove('show');backToLobby()}

/* ══ TTS ═════════════════════════════════ */
let _ttsAudio=null,_ttsAbort=false;
async function speak(text,onDone){
  if(!SETTINGS.voiceEnabled){onDone?.();return}
  try{
    if(_ttsAudio){_ttsAudio.pause();_ttsAudio=null}
    const res=await fetch(`${CONFIG.workerURL}/tts`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
    if(!res.ok)throw 0;
    const blob=await res.blob();const url=URL.createObjectURL(blob);
    const audio=new Audio(url);audio.volume=SETTINGS.voiceVolume;_ttsAudio=audio;
    audio.onended=()=>{URL.revokeObjectURL(url);_ttsAudio=null;onDone?.()};
    audio.onerror=()=>{URL.revokeObjectURL(url);_ttsAudio=null;_fallbackSpeak(text,onDone)};
    await audio.play();
  }catch(e){_fallbackSpeak(text,onDone)}
}
function _fallbackSpeak(text,onDone){
  const u=new SpeechSynthesisUtterance(text);u.lang='th-TH';u.volume=SETTINGS.voiceVolume;u.rate=0.88;
  u.onend=()=>onDone?.();u.onerror=()=>onDone?.();window.speechSynthesis?.cancel();window.speechSynthesis?.speak(u);
}
function stopSpeech(){if(_ttsAudio){_ttsAudio.pause();_ttsAudio=null}window.speechSynthesis?.cancel()}
function speakSequence(lines,onAllDone){
  _ttsAbort=false;let i=0;
  function next(){if(_ttsAbort||i>=lines.length){onAllDone?.();return}const line=lines[i++];speak(line.text,()=>{if(_ttsAbort){onAllDone?.();return}setTimeout(next,(line.pauseAfter??SETTINGS.voicePauseTime)*1000)})}
  next();
}
function stopSpeakSequence(){_ttsAbort=true;stopSpeech()}


