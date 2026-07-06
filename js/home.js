/* ══ PROFILE MENU ════════════════════════════════════════════ */
function toggleProfileMenu(){
  const d=$('profileDropdown');
  if(!d)return;
  const isOpen=d.classList.contains('open');
  if(isOpen){
    // ปิด: เล่น animation ออกก่อน แล้วค่อย hide
    d.classList.remove('open');
    d.classList.add('closing');
    d.addEventListener('animationend',()=>{
      d.classList.remove('closing');
      d.style.display='none';
    },{once:true});
  } else {
    d.style.display='block';
    d.classList.remove('closing');
    d.classList.add('open');
    // ปิดเมื่อคลิกที่อื่น
    setTimeout(()=>{
      document.addEventListener('click',function _close(e){
        if(!$('profileMenuWrap')?.contains(e.target)){
          if(d.classList.contains('open')){
            d.classList.remove('open');
            d.classList.add('closing');
            d.addEventListener('animationend',()=>{
              d.classList.remove('closing');
              d.style.display='none';
            },{once:true});
          }
          document.removeEventListener('click',_close);
        }
      });
    },10);
  }
}

/* ══ ADMIN PANEL ══════════════════════════════════════════════ */
function openAdminPanel(){
  if(!isAdmin()){showToast('ไม่มีสิทธิ์ Admin');return;}
  const ov=$('adminPanelOverlay'),sh=$('adminPanelSheet');
  if(!ov||!sh)return;
  ov.style.display='';sh.style.display='';
  // force reflow ก่อนเปลี่ยน transform/opacity เพื่อให้ transition เล่น
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      ov.style.opacity='1';ov.style.background='rgba(0,0,0,0.6)';ov.style.backdropFilter='blur(4px)';
      sh.style.transform='translateY(0)';
    });
  });
  renderAdminStats();
  renderAdminGames();
}
function closeAdminPanel(){
  const ov=$('adminPanelOverlay'),sh=$('adminPanelSheet');
  if(!ov||!sh)return;
  ov.style.opacity='0';ov.style.background='rgba(0,0,0,0)';ov.style.backdropFilter='blur(0px)';
  sh.style.transform='translateY(100%)';
  setTimeout(()=>{ov.style.display='none';sh.style.display='none';},320);
  stopAdminStats();
}
/* ── ลากปิด Admin Panel (swipe down to dismiss เมื่ออยู่บนสุดแล้ว) ── */
(function(){
  let dragging=false,startY=0,curY=0,sheetH=0;
  function onDown(e){
    const sh=$('adminPanelSheet');if(!sh)return;
    // อนุญาตให้ลากปิดเฉพาะตอนสกอลล์อยู่บนสุดแล้วเท่านั้น (ไม่งั้นจะไปแย่ง scroll)
    if(sh.scrollTop>0)return;
    dragging=true;startY=(e.touches?e.touches[0].clientY:e.clientY);curY=0;
    sheetH=sh.offsetHeight;
    sh.style.transition='none';
  }
  function onMove(e){
    if(!dragging)return;
    const sh=$('adminPanelSheet');if(!sh)return;
    const y=(e.touches?e.touches[0].clientY:e.clientY);
    const dy=y-startY;
    // ถ้าลากขึ้น (ค่าลบ) ไม่ต้องทำอะไร ปล่อยให้ scroll ปกติทำงาน
    if(dy<0){curY=0;sh.style.transform='translateY(0)';return;}
    curY=dy;
    sh.style.transform=`translateY(${curY}px)`;
    e.preventDefault?.();
  }
  function onUp(){
    if(!dragging)return;
    dragging=false;
    const sh=$('adminPanelSheet');if(!sh)return;
    sh.style.transition='transform 0.32s var(--spring)';
    if(curY>sheetH*0.22){
      closeAdminPanel();
    } else {
      sh.style.transform='translateY(0)';
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const sh=$('adminPanelSheet');
    if(!sh)return;
    sh.addEventListener('pointerdown',onDown);
    sh.addEventListener('touchstart',onDown,{passive:true});
    window.addEventListener('pointermove',onMove,{passive:false});
    window.addEventListener('touchmove',onMove,{passive:false});
    window.addEventListener('pointerup',onUp);
    window.addEventListener('touchend',onUp);
  });
})();
let _adminStatsListening=false,_adminStatsDebounceT=null;
function _adminStatsCompute(rooms){
  rooms=rooms||{};
  const roomKeys=Object.keys(rooms);

  let activeRooms=0,totalPlayers=0;
  const emptyRooms=[];
  roomKeys.forEach(k=>{
    const players=rooms[k].players||{};
    const playerVals=Object.values(players).filter(p=>p&&p.name);
    const onlinePlayers=playerVals.filter(p=>p.online!==false);
    if(onlinePlayers.length>0){
      activeRooms++;
      totalPlayers+=onlinePlayers.length;
    } else {
      // ห้องว่าง: ไม่มี players เลย หรือทุกคน offline
      emptyRooms.push(k);
    }
  });
  // ยุบห้องว่างอัตโนมัติ
  if(emptyRooms.length){
    emptyRooms.forEach(k=>db.ref('rooms/'+k).remove().catch(()=>{}));
  }
  const el=$('adminStats');
  if(!el)return;
  el.innerHTML=`
    <div style="background:var(--card2);border-radius:var(--r);padding:12px 14px;border:1px solid var(--line)">
      <div style="font-size:24px;font-weight:900;color:var(--ac)">${activeRooms}</div>
      <div style="font-size:12px;color:var(--t2);margin-top:2px">วงที่เปิดอยู่</div>
    </div>
    <div style="background:var(--card2);border-radius:var(--r);padding:12px 14px;border:1px solid var(--line)">
      <div style="font-size:24px;font-weight:900;color:var(--ok)">${totalPlayers}</div>
      <div style="font-size:12px;color:var(--t2);margin-top:2px">ผู้เล่น online</div>
    </div>`;
}
function renderAdminStats(){
  if(!db||!isAdmin())return;
  // แสดง loading ก่อน
  const el=$('adminStats');
  if(el&&!_adminStatsListening){
    el.innerHTML=`
    <div style="background:var(--card2);border-radius:var(--r);padding:12px 14px;border:1px solid var(--line)">
      <div style="font-size:24px;font-weight:900;color:var(--ac)">—</div>
      <div style="font-size:12px;color:var(--t2);margin-top:2px">วงที่เปิดอยู่</div>
    </div>
    <div style="background:var(--card2);border-radius:var(--r);padding:12px 14px;border:1px solid var(--line)">
      <div style="font-size:24px;font-weight:900;color:var(--ok)">—</div>
      <div style="font-size:12px;color:var(--t2);margin-top:2px">ผู้เล่น online</div>
    </div>`;
  }
  if(_adminStatsListening)return;
  _adminStatsListening=true;
  db.ref('rooms').on('value',snap=>{
    clearTimeout(_adminStatsDebounceT);
    _adminStatsDebounceT=setTimeout(()=>_adminStatsCompute(snap.val()),400);
  });
}
function stopAdminStats(){
  if(!db)return;
  db.ref('rooms').off('value');
  _adminStatsListening=false;
  clearTimeout(_adminStatsDebounceT);
}
function renderAdminGames(){
  const el=$('adminGamesList');if(!el)return;
  el.innerHTML=HOME_GAMES_CONFIG.map(g=>{
    const isHidden=!!hiddenGames[g.id];
    const toggleId='toggle_'+g.id;
    return `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card2);border-radius:var(--r);border:1px solid var(--line)">
      <span style="font-size:20px;width:28px;text-align:center">${g.icon}</span>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;${isHidden?'opacity:0.4':''}">${g.name}</div>
        <div style="font-size:11px;color:var(--t3)">${isHidden?'🙈 ซ่อนอยู่':'👁️ แสดงอยู่'}</div>
      </div>
      <div id="${toggleId}" onclick="adminToggleGame('${g.id}',${isHidden})"
        style="display:flex;align-items:center;width:46px;height:26px;flex-shrink:0;padding:2px;cursor:pointer;border-radius:13px;background:${isHidden?'rgba(255,255,255,0.1)':'var(--ac)'};border:1px solid ${isHidden?'var(--line)':'var(--ac)'};transition:background-color 0.25s,border-color 0.25s;box-sizing:border-box">
        <div style="width:20px;height:20px;flex-shrink:0;border-radius:50%;background:#fff;transition:transform 0.25s var(--spring);transform:translateX(${isHidden?'0':'20px'});box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>
      </div>
    </div>`;
  }).join('');
}
function adminToggleGame(id,currentlyHidden){
  if(!db||!isAdmin())return;
  const newHidden={...hiddenGames};
  // currentlyHidden=true → กดเพื่อแสดง, false → กดเพื่อซ่อน
  if(currentlyHidden) delete newHidden[id];
  else newHidden[id]=true;
  // อัป local ก่อนเพื่อ UI ตอบสนองทันที
  hiddenGames=newHidden;
  renderAdminGames();
  renderHomeGames();
  // แล้วค่อย sync Firebase
  db.ref('config/hiddenGames').set(Object.keys(newHidden).length?newHidden:null)
    .then(()=>showToast(currentlyHidden?('✅ แสดง '+id+' แล้ว'):('🙈 ซ่อน '+id+' แล้ว')))
    .catch(err=>{
      // rollback ถ้า Firebase error
      if(currentlyHidden) hiddenGames[id]=true; else delete hiddenGames[id];
      renderAdminGames();renderHomeGames();
      showToast('❌ บันทึกไม่ได้: '+err.message);
    });
}
function cleanupRooms(){
  if(!db||!isAdmin())return;
  showToast('กำลังตรวจสอบ...',2000);
  db.ref('rooms').once('value').then(snap=>{
    const rooms=snap.val()||{};
    const toDelete=[];
    Object.keys(rooms).forEach(k=>{
      const players=rooms[k].players||{};
      const onlinePlayers=Object.values(players).filter(p=>p&&p.name&&p.online!==false);
      if(onlinePlayers.length===0)toDelete.push(k);
    });
    if(!toDelete.length){showToast('ไม่มีวงที่ต้องล้าง ✅');return;}
    Promise.all(toDelete.map(k=>db.ref('rooms/'+k).remove())).then(()=>{
      showToast('ลบ '+toDelete.length+' วงแล้ว 🗑️');
      renderAdminStats();
    }).catch(err=>showToast('ลบไม่ได้: '+err.message));
  });
}

/* ══ HOME GAMES ══════════════════════════════════════════════ */
const CHEVRON_SVG='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 5 16 12 9 19"/></svg>';
const REFRESH_SVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>';
const HOME_GAMES_CONFIG=[
  {id:'ww',    label:'🎲 ต้องสร้างวง', icon:'🐯', bg:'linear-gradient(135deg,#f87171,#b91c1c)', name:'คืนสมิง',      desc:'4–18 คน · แจกไพ่บทบาท',     action:"openJoinModal('ww')",    solo:false},
  {id:'spyfall',label:null,               icon:'🕵️', bg:'linear-gradient(135deg,#c084fc,#9333ea)', name:'สายลับกลางวง',   desc:'3+ คน · หาสายลับ',           action:"openJoinModal('spyfall')",solo:false},
  {id:'king',   label:null,               icon:'👑', bg:'linear-gradient(135deg,#fb923c,#c2410c)', name:"King's Game",    desc:'3+ คน · ราชาสั่ง',           action:"openJoinModal('king')",  solo:false},
  {id:'salem',  label:null,               icon:'🧙', bg:'linear-gradient(135deg,#a78bfa,#7c3aed)', name:'Salem 1692',      desc:'4–12 คน · ไพ่ชีวิต',        action:"openJoinModal('salem')", solo:false},
  {id:'wheel',  label:'⚡ เริ่มได้เลย',   icon:'🎡', bg:'linear-gradient(135deg,#4ade80,#16a34a)',name:'วงล้อ',           desc:'ตัดสินใจแทนคุณได้เลย',      action:"launchSolo('wheel')",    solo:true},
  {id:'cards',  label:null,               icon:'🃏', bg:'linear-gradient(135deg,#fda4af,#e11d48)',name:'ไพ่เฮฮา',        desc:'ชาเลนจ์สนุกๆ ในวงเพื่อน',  action:"launchSolo('cards')",    solo:true},
];
function renderHomeGames(){
  const multiList=$('homeMultiList'),soloList=$('homeSoloList');
  const multiSection=$('homeMultiSection'),soloSection=$('homeSoloSection');
  if(!multiList||!soloList)return;
  const visible=HOME_GAMES_CONFIG.filter(g=>!hiddenGames[g.id]);
  const multiRoom=visible.filter(g=>!g.solo);
  const soloGames=visible.filter(g=>g.solo);
  if(multiSection)multiSection.style.display=multiRoom.length?'':'none';
  if(soloSection)soloSection.style.display=soloGames.length?'':'none';
  const rowHtml=g=>`
    <div class="home-game-row">
      <div class="home-row-icon" style="background:${g.bg}">${g.icon}</div>
      <div class="home-row-info">
        <div class="home-row-name">${g.name}</div>
        <div class="home-row-desc">${g.desc}</div>
      </div>
      <button class="home-row-cta${g.solo?' solo':''}" onclick="${g.action}">${g.solo?'เล่นเลย':'สร้าง/เข้าร่วม'}${CHEVRON_SVG}</button>
    </div>`;
  multiList.innerHTML=multiRoom.map(rowHtml).join('');
  soloList.innerHTML=soloGames.map(rowHtml).join('');
  if(!visible.length&&multiSection){
    multiSection.style.display='';
    multiList.innerHTML='<div style="text-align:center;padding:3rem 1rem;color:var(--t3);font-size:14px">ยังไม่มีเกมที่เปิดให้เล่น</div>';
  }
}

/* ══ THEME SWITCHER ════════════════════════════════════════════ */
const THEMES={
  dark:{e:'🌙',label:'Dark'},
  cream:{e:'🍵',label:'Cream'},
  ocean:{e:'🌊',label:'Ocean'},
};
const THEME_NAMES_TH={dark:'มืด',cream:'ครีม',ocean:'ทะเล'};
function _refreshThemeIndicator(t){
  const lbl=$('themeActiveLabel');
  if(lbl)lbl.textContent=(THEMES[t]?.e||'')+' '+(THEME_NAMES_TH[t]||t);
  ['dark','cream','ocean'].forEach(k=>{
    const b=$('themeDotBtn-'+k);
    if(!b)return;
    if(k===t){b.style.borderColor='var(--ac)';b.style.boxShadow='0 0 0 2px var(--ac-dim)';}
    else{b.style.borderColor='var(--line)';b.style.boxShadow='none';}
  });
}
function setTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem('ghTeng_theme',t);
  // อัป active state
  document.querySelectorAll('.theme-option').forEach(el=>{
    el.classList.toggle('active',el.textContent.includes(THEMES[t]?.label||t));
  });
  _refreshThemeIndicator(t);
  // อัปเดตไอคอนปุ่ม
  const iconEl=$('themeBtnIcon');
  if(iconEl){
    const icons={
      dark:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
      cream:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
      ocean:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    };
    iconEl.innerHTML=icons[t]||icons.dark;
  }
  closeThemeSheet();
}
function toggleThemeSheet(){
  const s=$('themeSheet');s&&s.classList.toggle('open');
}
function closeThemeSheet(){$('themeSheet')?.classList.remove('open')}
// ปิดเมื่อกดที่อื่น
document.addEventListener('click',e=>{
  if(!e.target.closest('#themeSheet')&&!e.target.closest('#themeSwitcherBtn'))closeThemeSheet();
},{passive:true});
// โหลดธีมจาก localStorage
(function(){
  const saved=localStorage.getItem('ghTeng_theme')||'dark';
  document.documentElement.setAttribute('data-theme',saved);
})();


