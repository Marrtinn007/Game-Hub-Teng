/* ══ WW ROLE INFO ════════════════════════ */
const WW_TEAM_HEX={good:'#4eca8b',evil:'#f06e7a',solo:'#f0c060'};
function wwTeamHex(team){return WW_TEAM_HEX[team]||'#7c9cff';}
function hexAlpha(hex,a){const n=parseInt(hex.slice(1),16);return`rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;}
function showRoleInfo(r,event){
  event&&event.stopPropagation();
  const role=WW[r];if(!role)return;
  const teamHex=wwTeamHex(role.team);
  const teamLabel={good:'🏡 ฝ่ายชาวบ้าน',evil:'🐯 ฝ่ายสมิง',solo:'⚖️ ฝ่ายอิสระ'}[role.team]||'🏡 ฝ่ายชาวบ้าน';
  const pts=role.pts||0;const ptsStr=pts>0?`+${pts}`:String(pts);
  const ptsHex=pts>0?'#4eca8b':pts<0?'#f06e7a':null;
  const box=$('roleInfoContent');if(!box)return;
  box.innerHTML=`
    <div style="text-align:center;margin-bottom:1.25rem">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:136px;height:136px;border-radius:28px;background:${hexAlpha(teamHex,0.14)};box-shadow:0 0 0 3px ${hexAlpha(teamHex,0.5)},0 8px 22px rgba(0,0,0,0.4);font-size:52px;line-height:1;margin-bottom:10px;overflow:hidden">
        <img src="img/Ch/${r}.png" alt="" style="width:100%;height:100%;object-fit:cover;object-position:top center" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
        <span style="display:none">${role.e}</span>
      </div>
      <div style="font-size:24px;font-weight:900;color:var(--t0)">${role.name}</div>
      <div style="font-size:14px;color:var(--t2);margin-top:3px">${role.en}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-top:10px">
        <span style="display:inline-block;padding:5px 16px;border-radius:var(--r-pill);font-size:13px;font-weight:800;background:${hexAlpha(teamHex,0.18)};color:${teamHex};border:1px solid ${hexAlpha(teamHex,0.4)}">${teamLabel}</span>
        <span style="display:inline-block;padding:5px 16px;border-radius:var(--r-pill);font-size:13px;font-weight:900;background:${ptsHex?hexAlpha(ptsHex,0.18):'var(--card2)'};color:${ptsHex||'var(--t2)'};border:1px solid ${ptsHex?hexAlpha(ptsHex,0.4):'var(--line)'}">แต้ม ${ptsStr}</span>
      </div>
    </div>
    <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-s);padding:1rem 1.25rem;margin-bottom:0.875rem;backdrop-filter:var(--blur-sm)">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.08em;color:var(--t2);text-transform:uppercase;margin-bottom:8px">หน้าที่</div>
      <div style="font-size:16px;color:var(--t0);font-weight:500;line-height:1.7;white-space:pre-line">${role.desc.replace(/\\n/g,'\n')}</div>
    </div>
    <div style="background:rgba(255,133,0,0.07);border:1px solid rgba(255,133,0,0.15);border-radius:var(--r-s);padding:0.875rem 1rem;font-size:14px;color:var(--ac);line-height:1.55">
      💡 สามารถปรับเปลี่ยนกฎได้ตามความเหมาะสมของกลุ่ม
    </div>`;
  openModal('modal-role-info');
}

/* ══ WW SETUP ════════════════════════════ */
function initWW(){
  S.wwAssigned={};S.wwAlive={};S.wwMyRole=null;S.wwFlipped={};S.wwListHidden=false;
  S.wwStatus={};S.wwCupidPair=[];S.wwWolfIds=[];S.wwExpandedTeams={evil:false,good:false,solo:false};
  // reset counts — player sets manually
  S.wwPlayerCount=getPlayers().filter(p=>!p.isHost).length||0;
  Object.keys(S.wwRoleCounts).forEach(k=>S.wwRoleCounts[k]=0);
  renderWWSetup();
}
function renderWWSetup(){
  const pl=$('wwPhaseLabel');if(pl)pl.textContent='ตั้งค่าเกม';
  const body=$('wwBody');if(!body)return;
  if(!S.isHost){
    body.innerHTML=`<div style="text-align:center;padding:4rem 1rem"><div style="font-size:60px;margin-bottom:1rem;animation:floatIcon 3s ease-in-out infinite">⏳</div><div style="font-size:17px;font-weight:800;color:var(--t0);margin-bottom:0.5rem">รอ Host แจกไพ่</div><div style="font-size:14px;color:var(--t2);line-height:1.7">เมื่อ Host แจกไพ่แล้ว<br>คุณจะเห็นการ์ดบทบาทของคุณ</div></div>`;
    return;
  }
  // always sync from actual players first
  const nonHostCount=getPlayers().filter(p=>!p.isHost).length;
  if(nonHostCount>0) S.wwPlayerCount=nonHostCount;
  if(!S.wwPlayerCount) S.wwPlayerCount=0;
  const n=S.wwPlayerCount;
  const total=totalRoles(),over=total>n,under=total<n&&total>0;
  const WW_TEAMS=[
    {id:'evil',label:'🐯 ฝ่ายสมิง',roles:ROLE_ORDER.filter(r=>WW[r]?.team==='evil')},
    {id:'good',label:'🏡 ฝ่ายชาวบ้าน',roles:ROLE_ORDER.filter(r=>WW[r]?.team==='good')},
    {id:'solo',label:'⚖️ ฝ่ายอิสระ',roles:ROLE_ORDER.filter(r=>WW[r]?.team==='solo')},
  ];
  const teamCount=roles=>roles.reduce((sum,r)=>sum+(S.wwRoleCounts[r]||0),0);
  const canDeal = total>0 && total===n;
  body.innerHTML=`
    <div class="ww-score-bar">
      <div>
        <div class="label" style="margin:0">แต้มรวม</div>
        <div id="wwPtsDisplay" style="font-size:20px;margin-top:3px">${ptsDisplay()}</div>
      </div>
      <div style="text-align:right">
        <div class="label" style="margin:0">บทบาท / ผู้เล่น</div>
        <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;margin-top:3px">
          <button class="ww-c-btn2" style="width:30px;height:30px;font-size:16px" onclick="adjustWWPlayerCount(-1)">−</button>
          <div id="wwCountDisplay" style="font-size:20px;font-weight:900;min-width:60px;text-align:center;color:${over?'var(--danger)':under?'var(--warn)':total===n&&n>0?'var(--ok)':'var(--t2)'}">${total} / ${n}</div>
          <button class="ww-c-btn2" style="width:30px;height:30px;font-size:16px" onclick="adjustWWPlayerCount(1)">+</button>
        </div>
      </div>
    </div>
    ${WW_TEAMS.map(t=>{
      const open=!!S.wwExpandedTeams[t.id];
      const tc=wwTeamHex(t.id);
      return`<div class="ww-team-group">
        <button class="ww-team-header${open?' open':''}" style="border-color:${open?tc:hexAlpha(tc,0.35)};color:${tc};${open?`background:${hexAlpha(tc,0.14)}`:''}" onclick="toggleWWTeam('${t.id}')">
          <span class="ww-team-header-label">${t.label}</span>
          <span class="ww-team-tab-count" id="wwTabCount-${t.id}" style="color:${tc};background:${hexAlpha(tc,0.18)}">${teamCount(t.roles)}</span>
          <span class="ww-team-chevron" style="color:${tc}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
        </button>
        ${open?`<div class="ww-roles-list">${t.roles.map(r=>renderRoleChip(r)).join('')}</div>`:''}
      </div>`;
    }).join('')}
    <div style="margin-top:1.25rem">
      ${n===0?'<p style="font-size:14px;color:var(--t2);text-align:center;margin-bottom:10px">กดปุ่ม + ด้านบนเพื่อตั้งจำนวนผู้เล่น</p>':''}
      ${over?'<p style="font-size:14px;color:var(--danger);text-align:center;margin-bottom:10px">⚠ บทบาทเกินจำนวนผู้เล่น</p>':''}
      ${under?`<p style="font-size:14px;color:var(--warn);text-align:center;margin-bottom:10px">⚠ บทบาทยังไม่ครบ (ขาดอีก ${n-total} ใบ)</p>`:''}
    </div>
    <button class="btn btn-ac btn-next" onclick="previewAndDeal()" ${(!canDeal||over)?'disabled':''}>${over?'⚠ เกินไป':!canDeal&&n===0?'ตั้งจำนวนผู้เล่นก่อน':!canDeal?'🎴 เพิ่มบทบาทให้ครบ':'🎴 ดูสรุปก่อนแจก'+CHEVRON_SVG}</button>`;
}
function renderRoleChip(r){
  const role=WW[r];if(!role)return'';
  const count=S.wwRoleCounts[r]||0;
  const teamLabel={good:'ฝ่ายชาวบ้าน',evil:'ฝ่ายสมิง',solo:'ฝ่ายอิสระ'}[role.team]||'ฝ่ายชาวบ้าน';
  const pts=role.pts||0;const ptsStr=pts>0?`+${pts}`:String(pts);
  const ptsHex=pts>0?'#4eca8b':pts<0?'#f06e7a':null;
  const tc=wwTeamHex(role.team);
  return`<div class="ww-role-chip${count>0?' has':''}" style="border-left:3px solid ${tc};${count>0?`background:${hexAlpha(tc,0.14)};border-color:${tc}`:''}">
    <div class="ww-role-chip-icon" style="background:${hexAlpha(tc,0.14)};color:${tc}" onclick="showRoleInfo('${r}',event)"><img src="img/Ch/${r}.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/><span style="display:none">${role.e}</span></div>
    <div class="ww-role-chip-info" onclick="showRoleInfo('${r}',event)">
      <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap">
        <span class="ww-role-chip-name">${role.name}</span>
        <span style="font-size:12px;color:var(--t2);font-weight:400">${role.en}</span>
        <span style="font-size:11px;font-weight:900;color:${ptsHex||'var(--t2)'};background:${ptsHex?hexAlpha(ptsHex,0.18):'var(--card2)'};padding:1px 8px;border-radius:var(--r-pill)">${ptsStr}</span>
      </div>
      <div class="ww-role-chip-sub">${teamLabel} · ${role.short}</div>
    </div>
    <button class="ww-info-btn" onclick="showRoleInfo('${r}',event)">📖</button>
    <div class="ww-role-counter">
      <button class="ww-c-btn2" onclick="changeRoleCount('${r}',-1)">−</button>
      <div class="ww-c-num2" id="rc-${r}">${count}</div>
      <button class="ww-c-btn2" onclick="changeRoleCount('${r}',1)">+</button>
    </div>
  </div>`;
}
function toggleWWTeam(team){S.wwExpandedTeams[team]=!S.wwExpandedTeams[team];renderWWSetup();}
function adjustWWPlayerCount(d){
  const nonHostCount=getPlayers().filter(p=>!p.isHost).length;
  // if real players present, don't go below that
  const min=nonHostCount>0?nonHostCount:0;
  S.wwPlayerCount=Math.max(min,Math.min(18,(S.wwPlayerCount||0)+d));
  renderWWSetup();
}
function changeRoleCount(r,d){
  const role=WW[r];if(!role)return;
  const cur=S.wwRoleCounts[r]||0;
  const next=Math.max(0,Math.min(role.max||10,cur+d));
  const n=S.wwPlayerCount||0;
  const newTotal=totalRoles()-cur+next;
  if(d>0&&n>0&&newTotal>n){showToast('บทบาทเกินจำนวนผู้เล่น!');return}
  S.wwRoleCounts[r]=next;
  // update chip
  const el=$(`rc-${r}`);
  if(el){
    el.textContent=next;
    const chip=el.closest('.ww-role-chip');
    if(chip)next>0?chip.classList.add('has'):chip.classList.remove('has');
  }
  // update active tab's badge count
  const tabCountEl=$(`wwTabCount-${role.team}`);
  if(tabCountEl)tabCountEl.textContent=next-cur+parseInt(tabCountEl.textContent||'0',10);
  // update score bar
  const total=totalRoles();
  const over=total>n,under=total<n&&total>0;
  const ptsEl=$('wwPtsDisplay');
  const cntEl=$('wwCountDisplay');
  if(ptsEl)ptsEl.innerHTML=ptsDisplay();
  if(cntEl){cntEl.textContent=`${total} / ${n}`;cntEl.style.color=over?'var(--danger)':under?'var(--warn)':total===n&&n>0?'var(--ok)':'var(--t2)';}
  // update deal button
  const canDeal=total>0&&total===n&&!over;
  const btn=$('wwBody')?.querySelector('.btn-next');
  if(btn){btn.disabled=!canDeal;btn.innerHTML=over?'⚠ เกินไป':!canDeal?'🎴 เพิ่มบทบาทให้ครบ':'🎴 ดูสรุปก่อนแจก'+CHEVRON_SVG;}
}

/* ══ WW DEAL ═════════════════════════════ */
function previewAndDeal(){
  const players=getPlayers().filter(p=>!p.isHost).slice(0,S.wwPlayerCount);
  if(players.length===0){showToast('ยังไม่มีผู้เล่น!');return}
  if(totalRoles()!==players.length){showToast(`⚠ บทบาท ${totalRoles()} ใบ ≠ ผู้เล่น ${players.length} คน`);return}
  const summary={};ROLE_ORDER.forEach(r=>{const cnt=S.wwRoleCounts[r]||0;if(cnt>0)summary[r]=cnt;});
  const rows=Object.entries(summary).map(([r,cnt])=>{
    const role=WW[r];const pts=(role.pts||0)*cnt;const ptsStr=pts>0?`+${pts}`:String(pts);
    const ptsColor=pts>0?'var(--ok)':pts<0?'var(--danger)':'var(--t2)';
    return`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--glass-border)">
      <span style="display:inline-flex;width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0;align-items:center;justify-content:center;font-size:20px"><img src="img/Ch/${r}.png" alt="" style="width:100%;height:100%;object-fit:cover;object-position:top center" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'"/><span style="display:none">${role.e}</span></span>
      <div style="flex:1"><div style="font-size:16px;font-weight:800">${role.name}</div><div style="font-size:12px;color:var(--t2)">${role.en}</div></div>
      <div style="text-align:right"><div style="font-size:18px;font-weight:900">${cnt} ใบ</div><div style="font-size:13px;font-weight:800;color:${ptsColor}">${ptsStr}</div></div>
    </div>`;
  }).join('');
  const p=totalPts();const ptsColor=p>2?'var(--danger)':p<-2?'#60a5fa':p===0?'var(--ok)':'var(--warn)';
  const ptsLabel=p>2?'ฝ่ายชาวบ้านได้เปรียบ':p<-2?'ฝ่ายสมิงได้เปรียบ':p===0?'⚖ สมดุลสมบูรณ์':'ใกล้สมดุล';
  const box=$('dealPreviewContent');if(!box)return;
  box.innerHTML=`
    <div style="margin-bottom:1.25rem">${rows}</div>
    <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--r-s);padding:14px 18px;display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <span style="font-size:15px;color:var(--t2);font-weight:600">แต้มรวม</span>
      <span style="font-size:22px;font-weight:900;color:${ptsColor}">${p>0?'+':''}${p} — ${ptsLabel}</span>
    </div>
    <div style="font-size:14px;color:var(--t2);text-align:center;line-height:1.65">ผู้เล่น ${players.length} คน · บทบาท ${totalRoles()} ใบ</div>`;
  openModal('modal-deal-preview');
}
function confirmDeal(){closeModal('modal-deal-preview');startWWDeal()}
function startWWDeal(){
  const players=getPlayers().filter(p=>!p.isHost).slice(0,S.wwPlayerCount);
  if(players.length===0){showToast('ยังไม่มีผู้เล่น!');return}
  if(totalRoles()!==players.length){showToast(`⚠ บทบาท ${totalRoles()} ≠ ผู้เล่น ${players.length} คน`);return}
  let roles=[];
  ROLE_ORDER.forEach(r=>{for(let i=0;i<(S.wwRoleCounts[r]||0);i++)roles.push(r)});
  roles=shuffle(roles);
  const assigned={},alive={};
  players.forEach((p,i)=>{assigned[p.id]=roles[i];alive[p.id]=true});
  S.wwAssigned=assigned;S.wwAlive=alive;S.wwFlipped={};S.wwMyRole=null;
  S.wwStatus={};S.wwCupidPair=[];
  const wolfTeamRoles=['werewolf','wolfcub','lonewolf','alphawolf','minion','sorcerer'];
  const wolfIds=players.filter(p=>wolfTeamRoles.includes(assigned[p.id])).map(p=>p.id);
  S.wwWolfIds=wolfIds;
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww`).set({assigned,alive,dealt:true,dealId:Date.now(),status:{},cupidPair:[],wolfIds});
  renderWWHost();
}

/* ══ WW STATUS SYSTEM ════════════════════ */
const STATUS_DEF={
  dead:     {e:'💀',label:'เสียชีวิต'},
  silenced: {e:'🔇',label:'ใบ้'},
  exiled:   {e:'🚪',label:'ออกหมู่บ้าน'},
  loved:    {e:'💘',label:'คู่รัก'},
  blessed:  {e:'🙏',label:'ได้รับพร'},
  dying:    {e:'☠️',label:'กำลังจะตาย'},
  targeted: {e:'🎯',label:'เป้า Hoodlum'},
  werewolf: {e:'🐯',label:'กลายเป็นสมิง'},
};
// which roles unlock which statuses
const STATUS_FOR_ROLE={
  silenced:  ['spellcaster'],
  exiled:    ['oldhag'],
  blessed:   ['priest'],
  dying:     ['toughguy'],
  targeted:  ['hoodlum'],
  werewolf:  ['cursed'],
};

/* ══ WW TIMER ════════════════════════════ */
let _wwTimerInterval = null;

function initWWTimerState(){
  if(!S.wwTimerSecs) S.wwTimerSecs = 120; // default 2 min
  if(!S.wwTimerRunning) S.wwTimerRunning = false;
  if(!S.wwTimerStartedAt) S.wwTimerStartedAt = null;
  if(!S.wwTimerSnapshot) S.wwTimerSnapshot = 120;
}

function wwTimerAdjust(delta){
  if(!S.isHost) return;
  // delta in seconds (±10)
  S.wwTimerSecs = Math.max(10, Math.min(3600, (S.wwTimerSecs||120) + delta));
  S.wwTimerSnapshot = S.wwTimerSecs;
  S.wwTimerRunning = false;
  S.wwTimerStartedAt = null;
  if(_wwTimerInterval){clearInterval(_wwTimerInterval);_wwTimerInterval=null;}
  _syncWWTimer();
  renderWWTimerWidget();
}

function wwTimerToggle(){
  if(!S.isHost) return;
  if(S.wwTimerRunning){
    // pause — save remaining
    const elapsed = Math.floor((Date.now()-(S.wwTimerStartedAt||Date.now()))/1000);
    S.wwTimerSecs = Math.max(0, (S.wwTimerSnapshot||0) - elapsed);
    S.wwTimerSnapshot = S.wwTimerSecs;
    S.wwTimerRunning = false;
    S.wwTimerStartedAt = null;
    if(_wwTimerInterval){clearInterval(_wwTimerInterval);_wwTimerInterval=null;}
  } else {
    // start
    if((S.wwTimerSecs||0) <= 0){
      showToast('ตั้งเวลาก่อนนะ');return;
    }
    S.wwTimerRunning = true;
    S.wwTimerStartedAt = Date.now();
    S.wwTimerSnapshot = S.wwTimerSecs;
    _startWWTimerTick();
  }
  _syncWWTimer();
  renderWWTimerWidget();
}

function wwTimerReset(){
  if(!S.isHost) return;
  S.wwTimerRunning = false;
  S.wwTimerStartedAt = null;
  if(_wwTimerInterval){clearInterval(_wwTimerInterval);_wwTimerInterval=null;}
  // keep current snapshot secs
  S.wwTimerSecs = S.wwTimerSnapshot || 120;
  _syncWWTimer();
  renderWWTimerWidget();
}

function _syncWWTimer(){
  if(firebaseReady && S.roomCode){
    db.ref(`rooms/${S.roomCode}/wwTimer`).set({
      secs: S.wwTimerSecs,
      snapshot: S.wwTimerSnapshot,
      running: S.wwTimerRunning,
      startedAt: S.wwTimerStartedAt||null,
      updatedAt: Date.now()
    });
  }
}

function _startWWTimerTick(){
  if(_wwTimerInterval){clearInterval(_wwTimerInterval);_wwTimerInterval=null;}
  _wwTimerInterval = setInterval(()=>{
    const elapsed = Math.floor((Date.now()-(S.wwTimerStartedAt||Date.now()))/1000);
    const left = Math.max(0,(S.wwTimerSnapshot||0)-elapsed);
    const el = $('wwTimerDisplay');
    if(el){
      el.textContent = fmtTime(left);
      el.className = 'ww-timer-display' + (left<=10&&left>0?' urgent':'') + (left<=0?' done':'');
    }
    if(left<=0){
      clearInterval(_wwTimerInterval);_wwTimerInterval=null;
      S.wwTimerRunning=false;
      showToast('⏰ หมดเวลา!',4000);
      _haptic([100,50,100,50,200]);
      // update play/pause button
      const btn=$('wwTimerToggleBtn');
      if(btn){btn.textContent='▶ เริ่ม';btn.style.background='linear-gradient(180deg,var(--btn-ac-from,#8faeff) 0%,var(--btn-ac-to,#6278e8) 100%)';}
    }
  },250);
}

function syncWWTimerState(data){
  if(!data) return;
  const wasRunning = S.wwTimerRunning;
  S.wwTimerSecs = data.secs||120;
  S.wwTimerSnapshot = data.snapshot||data.secs||120;
  S.wwTimerRunning = !!data.running;
  S.wwTimerStartedAt = data.startedAt||null;
  // tick for all clients
  if(S.wwTimerRunning){
    if(!wasRunning || !_wwTimerInterval) _startWWTimerTick();
  } else {
    if(_wwTimerInterval){clearInterval(_wwTimerInterval);_wwTimerInterval=null;}
  }
  renderWWTimerWidget();
}

function renderWWTimerWidget(){
  const wrap = $('wwTimerWrap');
  if(!wrap) return;
  initWWTimerState();
  const running = S.wwTimerRunning;
  const elapsed = running ? Math.floor((Date.now()-(S.wwTimerStartedAt||Date.now()))/1000) : 0;
  const left = running ? Math.max(0,(S.wwTimerSnapshot||0)-elapsed) : (S.wwTimerSecs||0);

  if(S.isHost){
    wrap.innerHTML=`
      <div class="ww-timer-card">
        <div class="ww-timer-label">⏱ จับเวลา</div>
        <div class="ww-timer-controls-row">
          <button class="ww-timer-adj-btn" onclick="wwTimerAdjust(-60)">−1m</button>
          <button class="ww-timer-adj-btn" onclick="wwTimerAdjust(-10)">−10</button>
          <div class="ww-timer-display${left<=10&&left>0?' urgent':''}${left<=0&&running?' done':''}" id="wwTimerDisplay">${fmtTime(left)}</div>
          <button class="ww-timer-adj-btn" onclick="wwTimerAdjust(10)">+10</button>
          <button class="ww-timer-adj-btn" onclick="wwTimerAdjust(60)">+1m</button>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-sf" style="flex:1;height:42px;font-size:15px;font-weight:700" id="wwTimerToggleBtn" onclick="wwTimerToggle()">
            ${running?'⏸ หยุด':'▶ เริ่ม'}
          </button>
          <button class="btn btn-sf" style="width:42px;height:42px;font-size:16px" onclick="wwTimerReset()" title="รีเซต">${REFRESH_SVG}</button>
        </div>
      </div>`;
  } else {
    // player view — small number only, no box
    if(left<=0&&!running){
      wrap.innerHTML='';
      return;
    }
    wrap.innerHTML=`<div style="text-align:center;margin-top:10px;margin-bottom:4px">
      <div class="ww-timer-display${left<=10&&left>0?' urgent':''}${left<=0?' done':''}" id="wwTimerDisplay" style="font-size:28px;display:inline-block">${fmtTime(left)}</div>
      ${!running&&left>0?'<div style="font-size:11px;color:var(--t3);margin-top:2px;letter-spacing:0.05em">รอ Host เริ่ม</div>':''}
      ${left<=0?'<div style="font-size:12px;color:var(--danger);margin-top:2px;font-weight:700">⏰ หมดเวลา!</div>':''}
    </div>`;
  }
}

function toggleWWList(){S.wwListHidden=!S.wwListHidden;renderWWHost();}

/* ══ WW HOST VIEW ════════════════════════ */
function renderWWHost(){
  const pl=$('wwPhaseLabel');if(pl)pl.textContent='ดำเนินเกม';
  const body=$('wwBody');if(!body)return;
  if(!S.wwStatus)S.wwStatus={};if(!S.wwCupidPair)S.wwCupidPair=[];
  const players=getPlayers().filter(p=>S.wwAssigned[p.id]);
  const wolfTeamRoles=['werewolf','wolfcub','lonewolf','alphawolf','minion','sorcerer'];
  const wolfList=players.filter(p=>wolfTeamRoles.includes(S.wwAssigned[p.id])).map(p=>p.name);
  const cupPair=S.wwCupidPair||[];
  initWWTimerState();
  const wwHidden=!!S.wwListHidden;
  body.innerHTML=`
    ${wolfList.length?`<div style="background:rgba(255,59,48,0.1);border-left:3px solid var(--danger);border-radius:var(--r-s);padding:10px 14px;font-size:13px;color:var(--danger);margin-bottom:1rem;font-weight:700">🐯 ฝ่ายสมิง · ${wolfList.map(n=>esc(n)).join(' · ')}</div>`:''}
    ${cupPair.length===2?`<div style="background:rgba(244,114,182,0.1);border-left:3px solid #f472b6;border-radius:var(--r-s);padding:10px 14px;font-size:13px;color:#f472b6;margin-bottom:1rem;font-weight:700">💘 คู่รัก · ${cupPair.map(id=>esc(playerName_(id))).join(' & ')}</div>`:''}
    <div id="wwTimerWrap"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div class="label" style="margin:0">ผู้เล่น</div>
      <button class="btn btn-sf" style="height:32px;padding:0 12px;font-size:12px;font-weight:700" onclick="toggleWWList()">${wwHidden?'👁 แสดงรายชื่อ':'🙈 ซ่อนรายชื่อ'}</button>
    </div>
    ${wwHidden
      ? `<div style="background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:1.25rem;text-align:center;margin-bottom:1rem">
          <div style="font-size:28px;margin-bottom:4px">🙈</div>
          <div style="font-size:14px;color:var(--t2)">รายชื่อถูกซ่อนอยู่</div>
        </div>`
      : `<div class="ww-host-list" id="wwHostList">${players.map((p,i)=>hostPlayerRow(p,i)).join('')}</div>`
    }`;
  renderWWTimerWidget();
}
function hostPlayerRow(p,i){
  const role=WW[S.wwAssigned[p.id]||'villager']||WW.villager;
  const dead=S.wwAlive[p.id]===false;
  const teamColors={good:'#32d74b',evil:'#ff453a',solo:'#ff9f0a'};
  const tc=teamColors[role.team]||'#8b8b9a';
  const st=S.wwStatus?.[p.id]||{};
  const chipCls={loved:'ww-status-chip-pink',dying:'ww-status-chip-red',werewolf:'ww-status-chip-red',silenced:'ww-status-chip-orange',exiled:'ww-status-chip-orange',blessed:'ww-status-chip-blue',targeted:'ww-status-chip-orange'};
  const badges=Object.keys(STATUS_DEF).filter(s=>s!=='dead'&&st[s]).map(s=>`<span class="ww-status-chip ${chipCls[s]||'ww-status-chip-blue'}">${STATUS_DEF[s].e} ${STATUS_DEF[s].label}</span>`).join('');
  return`<div class="ww-host-row${dead?' dead-row':''}" id="hrow-${esc(p.id)}" onclick="openStatusMenu('${esc(p.id)}')">
    <div class="ww-host-row-accent" style="background:${dead?'rgba(255,255,255,0.05)':tc}"></div>
    <div class="ww-host-row-body">
      <div class="ww-host-row-name${dead?' dead':''}">${esc(p.name)}</div>
      <div class="ww-host-row-role" style="color:${dead?'var(--t2)':tc}">${role.e} ${role.name}</div>
      ${badges?`<div class="ww-host-row-statuses">${badges}</div>`:''}
    </div>
    <div class="ww-host-row-right">
      <div class="ww-dead-icon" onclick="event.stopPropagation();toggleWWDead('${esc(p.id)}')">${dead?'💀':'🟢'}</div>
    </div>
  </div>`;
}

function toggleWWDead(pid){
  if(!S.wwStatus)S.wwStatus={};
  const wasDead=S.wwAlive[pid]===false;
  S.wwAlive[pid]=wasDead?true:false;
  if(!wasDead){if(!S.wwStatus[pid])S.wwStatus[pid]={};S.wwStatus[pid].dead=true;}
  else{const ns={...S.wwStatus[pid]};delete ns.dead;S.wwStatus[pid]=ns;}
  if(firebaseReady){db.ref(`rooms/${S.roomCode}/ww/alive/${pid}`).set(S.wwAlive[pid]);db.ref(`rooms/${S.roomCode}/ww/status`).set(S.wwStatus);}
  renderWWHost();
  // Cupid partner death
  if(!wasDead){
    // Check cupid partner — find others with loved status
    const cupPair=S.wwCupidPair||[];
    if(cupPair.includes(pid)&&cupPair.length===2){
      const partner=cupPair.find(id=>id!==pid);
      if(partner&&S.wwAlive[partner]!==false){
        setTimeout(()=>{
          const pname=playerName_(partner);
          if(confirm('💔 '+pname+' คือคู่รัก — ตายตามด้วยไหม?'))toggleWWDead(partner);
        },350);
      }
    }
  }
  // Tough Guy already dying
  if(!wasDead&&S.wwStatus?.[pid]?.dying){
    delete S.wwStatus[pid].dying;
    if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww/status`).set(S.wwStatus);
  }
}
function openStatusMenu(pid){
  if(!S.wwStatus)S.wwStatus={};
  const st=S.wwStatus[pid]||{};
  const activeRoles=ROLE_ORDER.filter(r=>(S.wwRoleCounts[r]||0)>0);
  const box=$('statusMenuContent');const overlay=$('statusMenuOverlay');
  if(!box||!overlay)return;

  // Build status buttons
  const relevant=Object.keys(STATUS_DEF).filter(s=>{
    if(s==='dead')return true;
    const needed=STATUS_FOR_ROLE[s];
    if(!needed)return true;
    return needed.some(r=>activeRoles.includes(r));
  });

  // Cupid: loved status — max 2 people, show toggle
  const cupPair=S.wwCupidPair||[];
  const isLoved=st['loved'];
  const canAddLoved=cupPair.length<2||isLoved;

  const btns=relevant.map(s=>{
    const def=STATUS_DEF[s];if(!def)return'';
    const active=s==='dead'?S.wwAlive[pid]===false:!!st[s];
    if(s==='loved'){
      const activeClass=active?'active-pink':'';
      const disabled=!canAddLoved&&!active?'style="opacity:0.35;pointer-events:none"':'';
      return`<button class="ww-status-menu-btn${active?' active-pink':''}" ${disabled} onclick="toggleStatus('${esc(pid)}','loved')">${def.e} ${def.label}${cupPair.length===2&&!active?' (ครบแล้ว)':''}</button>`;
    }
    const redStatuses=['dead','dying','werewolf'];
    const activeClass=active?(redStatuses.includes(s)?'active-red':'active'):'';
    return`<button class="ww-status-menu-btn${activeClass?' '+activeClass:''}" onclick="toggleStatus('${esc(pid)}','${s}')">${def.e} ${def.label}</button>`;
  }).join('');

  box.innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:12px">
      <div style="font-size:18px;font-weight:900;color:var(--t0)">${esc(playerName_(pid))}</div>
      <div style="font-size:13px;color:var(--t2)">${WW[S.wwAssigned[pid]||'villager']?.name||''}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">${btns}</div>`;
  overlay.classList.add('open');overlay.dataset.pid=pid;
}

function toggleStatus(pid,s){
  if(!S.wwStatus)S.wwStatus={};if(!S.wwStatus[pid])S.wwStatus[pid]={};
  if(s==='dead'){toggleWWDead(pid);closeStatusMenu();return;}
  if(s==='loved'){
    // max 2 people with loved
    if(!S.wwCupidPair)S.wwCupidPair=[];
    const already=S.wwStatus[pid].loved;
    if(already){
      // remove
      delete S.wwStatus[pid].loved;
      S.wwCupidPair=S.wwCupidPair.filter(id=>id!==pid);
    } else {
      if(S.wwCupidPair.length>=2){showToast('💘 คู่รักครบ 2 คนแล้ว กดออกคนใดคนหนึ่งก่อน');return;}
      S.wwStatus[pid].loved=true;
      S.wwCupidPair.push(pid);
    }
    if(firebaseReady&&S.roomCode){db.ref(`rooms/${S.roomCode}/ww/status`).set(S.wwStatus);db.ref(`rooms/${S.roomCode}/ww/cupidPair`).set(S.wwCupidPair);}
    closeStatusMenu();renderWWHost();return;
  }
  if(s==='dying'){
    const was=S.wwStatus[pid].dying;
    if(was)delete S.wwStatus[pid].dying;else S.wwStatus[pid].dying=true;
    if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww/status`).set(S.wwStatus);
    closeStatusMenu();renderWWHost();return;
  }
  const was=S.wwStatus[pid][s];
  if(was)delete S.wwStatus[pid][s];else S.wwStatus[pid][s]=true;
  if(firebaseReady)db.ref(`rooms/${S.roomCode}/ww/status`).set(S.wwStatus);
  closeStatusMenu();renderWWHost();
}

function closeStatusMenu(){$('statusMenuOverlay')?.classList.remove('open')}
function showToughGuyAlert(pid){
  const overlay=$('toughguyOverlay');if(!overlay)return;
  const nameEl=$('toughguyName');if(nameEl)nameEl.textContent=playerName_(pid);
  overlay.dataset.pid=pid;overlay.classList.add('show');
}
function confirmToughGuyDeath(){
  const pid=$('toughguyOverlay')?.dataset?.pid;
  if(pid){if(!S.wwStatus)S.wwStatus={};if(S.wwStatus[pid])delete S.wwStatus[pid].dying;toggleWWDead(pid);}
  $('toughguyOverlay')?.classList.remove('show');
}

/* ══ WW PLAYER VIEW ══════════════════════ */
function renderWWPlayer(){
  const pl=$('wwPhaseLabel');if(pl)pl.textContent='บทบาทของคุณ';
  const body=$('wwBody');if(!body)return;
  const myPlayer=getPlayers().find(p=>p.id===myId());
  if(!myPlayer||!S.wwMyRole){
    body.innerHTML=`<div style="text-align:center;padding:3.5rem 1rem"><div style="font-size:56px;margin-bottom:1rem;animation:floatIcon 3s ease-in-out infinite">⏳</div><div style="font-size:16px;color:var(--t2)">รอ Host แจกไพ่...</div></div>`;
    return;
  }
  const dead=S.wwAlive[myId()]===false;
  body.innerHTML=`
    ${dead?'<div class="spectator-bar">💀 คุณเสียชีวิตแล้ว — มองดูเกมต่อไปได้</div>':''}
    <p style="font-size:13px;color:var(--t2);text-align:center;margin-bottom:1.5rem;line-height:1.65">กดไพ่เพื่อดูบทบาทของคุณ<br>⚠️ ห้ามให้คนอื่นเห็น!</p>
    <div class="ww-card-grid">${roleCardHTML(myPlayer)}</div>
    <div id="wwTimerWrap"></div>`;
  renderWWTimerWidget();
}
function roleCardHTML(p){
  const flipped=!!S.wwFlipped[p.id];
  const roleKey=S.wwAssigned[p.id]||'villager';
  const role=WW[roleKey]||WW.villager;
  const teamColor={good:'var(--ok)',evil:'var(--wolf)',solo:'var(--solo)'}[role.team]||'var(--ac)';
  const teamBg={good:'rgba(52,211,153,0.16)',evil:'rgba(255,92,92,0.16)',solo:'rgba(251,191,36,0.16)'}[role.team]||'rgba(124,159,255,0.16)';
  const teamHex=wwTeamHex(role.team);
  const wolfTeamRoles=['werewolf','wolfcub','lonewolf','alphawolf','minion','sorcerer'];
  const isWolf=wolfTeamRoles.includes(roleKey)||roleKey==='cursed';
  let alliesHtml='';
  if(isWolf&&S.wwWolfIds?.length>0){
    const allNames=getPlayers().filter(q=>S.wwWolfIds.includes(q.id)&&q.id!==p.id).map(q=>esc(q.name));
    if(allNames.length>0)alliesHtml=`<div class="rpc-wolf-allies"><b>🐯 พวกสมิง:</b> ${allNames.join(', ')}</div>`;
  }
  const shortDesc=role.short||'';
  return`<div class="role-playing-card${flipped?' flipped':''}" id="rpc-${esc(p.id)}" onclick="toggleRoleCard('${esc(p.id)}')">
    <div class="rpc-inner">
      <div class="rpc-front">
        <div class="rpc-card-bg">🃏</div>
        <div class="rpc-player-name">${esc(p.name)}</div>
        <div class="rpc-hint">กดเพื่อดูบทบาท</div>
      </div>
      <div class="rpc-back">
        <div class="rpc-back-team-bar" style="background:${teamBg};color:${teamColor}">${role.tl}</div>
        <div class="rpc-portrait-frame" style="box-shadow:0 0 0 3px ${hexAlpha(teamHex,0.5)},0 8px 22px rgba(0,0,0,0.45)">
          <img class="rpc-back-portrait" src="img/Ch/${roleKey}.png" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
          <div class="rpc-back-emoji" style="display:none">${role.e}</div>
        </div>
        <div class="rpc-back-name">${role.name}</div>
        <div class="rpc-back-en">${role.en||''}</div>
        ${alliesHtml}
        <div class="rpc-back-desc">${esc(shortDesc)}</div>
      </div>
    </div>
  </div>`;
}
function toggleRoleCard(pid){
  S.wwFlipped[pid]=!S.wwFlipped[pid];
  const card=$(`rpc-${pid}`);if(!card)return;
  S.wwFlipped[pid]?card.classList.add('flipped'):card.classList.remove('flipped');
}

/* ══ WW SYNC ════════════════════════════ */
function syncWWState(data){
  if(data.assigned){S.wwAssigned=data.assigned;S.wwMyRole=data.assigned[myId()];}
  if(data.alive)S.wwAlive=data.alive;
  if(data.status)S.wwStatus=data.status;
  if(data.cupidPair)S.wwCupidPair=data.cupidPair;
  if(data.wolfIds)S.wwWolfIds=data.wolfIds;
  if(!data.dealt)return;
  const body=$('wwBody');if(!body)return;
  const onWW=document.querySelector('.screen.active')?.id==='screen-ww';if(!onWW)return;
  if(S.isHost)renderWWHost();
  else{
    if(data.dealId&&data.dealId!==S._lastDealId){
      S.wwFlipped={};S._lastDealId=data.dealId;
      _haptic([30,20,30,20,50]); // สั่นแจ้งเตือนว่าได้ไพ่แล้ว
    }
    renderWWPlayer();
  }
  // restore timer state
  if(S._lastWWTimer)syncWWTimerState(S._lastWWTimer);
}
function closeNightScreens(){}

