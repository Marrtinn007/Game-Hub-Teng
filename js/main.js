document.addEventListener('DOMContentLoaded',()=>{
  // โหลด active state ธีม
  const _st=localStorage.getItem('ghTeng_theme')||'dark';
  document.documentElement.setAttribute('data-theme',_st);
  document.querySelectorAll('.theme-option').forEach(el=>el.classList.toggle('active',el.textContent.includes(THEMES[_st]?.label||_st)));
  _refreshThemeIndicator(_st);
  // Global button click sound + haptic
  document.addEventListener('pointerdown',e=>{
    const t=e.target.closest('button,.btn,.game-card,.game-select-card,.btn-icon,.ww-c-btn2,.btn-spin,.btn-draw');
    if(t&&!t.disabled){_haptic(8);}
  },{passive:true});

  checkDeepLink();
  const jci=$('joinCodeInput');
  if(jci){
    jci.addEventListener('keydown',e=>{if(e.key==='Enter')joinRoomFromModal()});
    // sanitize real-time: ลบ space และตัวพิเศษออก, force uppercase (สำหรับ iOS)
    jci.addEventListener('input',()=>{
      const pos=jci.selectionStart;
      const cleaned=jci.value.replace(/[^A-Za-z0-9]/g,'').toUpperCase().slice(0,6);
      if(jci.value!==cleaned){jci.value=cleaned;try{jci.setSelectionRange(pos,pos);}catch(e){}}
    });
  }
  $('roomNameInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')$('hostNickInput')?.focus()});
  $('hostNickInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')confirmCreateRoom()});
  $('nickInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')confirmNick()});
  $('wheelAddInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')addWheelItem()});
  $('menuOverlay')?.addEventListener('click',e=>{if(e.target.id==='menuOverlay')closeMenu()});
});
