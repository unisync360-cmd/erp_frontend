// ===== Original script block 1 =====
const titles={dashboard:['Faculty Dashboard','Faculty ERP Portal'],students:['Students','Student management'],classes:['My Classes','Subjects and sections'],attendance:['Attendance','Attendance management'],marks:['Marks & Results','Academic performance'],assignments:['Assignments','Assignment management'],timetable:['Timetable','Teaching schedule'],materials:['Study Materials','Teaching resources'],announcements:['Announcements','Notices and updates'],messages:['Messages','Faculty communication'],appointments:['Appointments','Meetings and mentoring'],analytics:['Analytics','Class performance insights'],reports:['Reports','Academic reports'],helpdesk:['Help Desk','Support and assistance'],settings:['Settings','Faculty account preferences'],onlineexam:['Online Exam','Create and publish online examinations']};
const links=document.querySelectorAll('.nav a[data-page]');
document.querySelectorAll('.nav-group-toggle').forEach(btn=>btn.addEventListener('click',()=>{
  const key=btn.dataset.group, panel=document.querySelector('[data-panel="'+key+'"]');
  const willOpen=!panel.classList.contains('open');
  document.querySelectorAll('.nav-group').forEach(p=>p.classList.remove('open'));
  document.querySelectorAll('.nav-group-toggle').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-expanded','false')});
  if(willOpen){panel.classList.add('open');btn.classList.add('active');btn.setAttribute('aria-expanded','true')}
}));
function updateMenuButton(){
  const open=document.getElementById('sidebar').classList.contains('show');
  const btn=document.getElementById('menuBtn');
  btn.textContent=open?'×':'☰';
  btn.setAttribute('aria-label',open?'Close menu':'Open menu');
  document.getElementById('sidebarOverlay')?.classList.toggle('open',open);
  document.getElementById('sidebarOverlay')?.setAttribute('aria-hidden',String(!open));
}
function go(id,fromHistory=false){
  if(!id || !titles[id]) return;
  const page=document.getElementById(id);
  if(!page) return;
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  page.classList.add('active');
  links.forEach(a=>a.classList.toggle('active',a.dataset.page===id));
  const title=document.getElementById('pageTitle'), sub=document.getElementById('pageSub');
  if(title) title.textContent=titles[id][0];
  if(sub) sub.textContent=titles[id][1];
  if(fromHistory){
    try{ history.replaceState(history.state || {facultyPage:id},'', '#'+id); }catch(err){}
  } else {
    try{
      const target='#'+id;
      if(location.hash!==target) history.pushState({facultyPage:id},'',target);
    }catch(err){ }
  }
  closeNotifications();
  closeAI();
  if(window.innerWidth<=900){
    document.getElementById('sidebar').classList.remove('show');
    updateMenuButton();
  }
  window.scrollTo(0,0);
}
links.forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();
  e.stopPropagation();
  go(a.getAttribute('data-page'));
}));
document.querySelector('.nav a[data-action="logout"]')?.addEventListener('click',e=>{e.preventDefault();logoutFromDashboard();});
document.getElementById('menuBtn').addEventListener('click',()=>{document.getElementById('sidebar').classList.toggle('show');updateMenuButton();});
document.getElementById('sidebarOverlay')?.addEventListener('click',()=>{
  document.getElementById('sidebar').classList.remove('show');
  updateMenuButton();
});
document.addEventListener('click',e=>{const s=document.getElementById('sidebar'),m=document.getElementById('menuBtn');if(window.innerWidth<=900&&s.classList.contains('show')&&!s.contains(e.target)&&!m.contains(e.target)){s.classList.remove('show');updateMenuButton();}});
function notify(){
  const p=document.getElementById('notificationsPanel');
  if(!p)return;
  const open=p.classList.toggle('open');
  p.setAttribute('aria-hidden',String(!open));
  if(open){
    document.getElementById('aiPanel')?.classList.remove('open');
    document.getElementById('aiPanel')?.setAttribute('aria-hidden','true');
    document.getElementById('aiFab')?.classList.remove('ai-open');
  }
}
function closeNotifications(){const p=document.getElementById('notificationsPanel');if(p){p.classList.remove('open');p.setAttribute('aria-hidden','true');}}
const aiFab=document.getElementById('aiFab'),aiPanel=document.getElementById('aiPanel'),aiClose=document.getElementById('aiClose'),aiInput=document.getElementById('aiInput'),aiSend=document.getElementById('aiSend'),aiBody=document.getElementById('aiBody');
function closeAI(){
  if(!aiPanel||!aiFab)return;
  aiPanel.classList.remove('open');
  aiPanel.setAttribute('aria-hidden','true');
  aiFab.classList.remove('ai-open');
  const label=aiFab.querySelector('.ai-fab-label');
  if(label) label.textContent='Ask AI';
  aiFab.setAttribute('aria-label','Ask AI for faculty help');
}
function toggleAI(){
  if(aiPanel.classList.contains('open')){closeAI();return;}
  closeNotifications();
  aiPanel.classList.add('open');
  aiPanel.setAttribute('aria-hidden','false');
  aiFab.classList.add('ai-open');
  const label=aiFab.querySelector('.ai-fab-label');
  if(label) label.textContent='Ask AI';
  aiFab.setAttribute('aria-label','Close Ask AI');
  if(aiInput)aiInput.focus();
}
function addAIMessage(text,type){const d=document.createElement('div');d.className='ai-msg '+type;d.textContent=text;aiBody.appendChild(d);aiBody.scrollTop=aiBody.scrollHeight;}
function facultyAIReply(q){const x=q.toLowerCase();if(x.includes('attendance'))return 'Use the Attendance page to view classes and update student attendance. I can also guide you through the steps.';if(x.includes('mark')&&x.includes('attendance'))return 'Open Attendance from the sidebar, select the class, choose the date, mark each student present or absent, then save.';if(x.includes('mark')||x.includes('marks'))return 'Open Marks & Results to enter internal marks, assignments and totals for your class.';if(x.includes('assignment'))return 'Use Assignments to create assignments, publish deadlines and review student submissions.';if(x.includes('timetable')||x.includes('schedule'))return 'Your Timetable page shows your weekly teaching schedule, labs, meetings and mentoring slots.';if(x.includes('announcement')||x.includes('notice'))return 'Open Announcements to create and publish notices for students and your department.';if(x.includes('student'))return 'Use Students to view and manage student information, class details and academic records.';if(x.includes('report')||x.includes('analytics'))return 'Reports and Analytics provide attendance, marks, submission and class-performance information.';return 'I can help with Attendance, Marks, Assignments, Timetable, Announcements, Students, Reports and Analytics. What would you like to do?';}
function askAI(){const q=aiInput.value.trim();if(!q)return;addAIMessage(q,'user');aiInput.value='';setTimeout(()=>addAIMessage(facultyAIReply(q),'bot'),250);}
aiSend.addEventListener('click',askAI);aiInput.addEventListener('keydown',e=>{if(e.key==='Enter')askAI();});

function filterTable(inputId,tableId){const q=document.getElementById(inputId).value.toLowerCase();document.querySelectorAll('#'+tableId+' tbody tr').forEach(r=>r.style.display=r.innerText.toLowerCase().includes(q)?'':'none');} function updateFacultyDateTime(){const n=new Date();document.getElementById('facultyDate').textContent=n.toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});document.getElementById('facultyTime').textContent=n.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}updateFacultyDateTime();setInterval(updateFacultyDateTime,1000);

function openActionModal(id){const m=document.getElementById(id);if(!m)return;m.classList.add('open');m.setAttribute('aria-hidden','false');if(id==='attendanceModal'){document.getElementById('attDate').value=new Date().toISOString().slice(0,10);m.querySelectorAll('.attendance-status').forEach(box=>{box.checked=false;});}}
function closeActionModal(id){const m=document.getElementById(id);if(!m)return;m.classList.remove('open');m.setAttribute('aria-hidden','true');}
function openAttendanceForm(){openActionModal('attendanceModal');}
function saveAttendance(e){
  e.preventDefault();
  const rows=[...document.querySelectorAll('#attendanceModal .attendance-row')];
  const present=rows.filter(row=>row.querySelector('.attendance-status')?.checked).length;
  const unmarked=rows.length-present;
  const cls=document.getElementById('attClass')?.value||'selected class';
  const date=document.getElementById('attDate')?.value||'selected date';
  closeActionModal('attendanceModal');
  alert('Attendance saved for '+cls+' on '+date+'.\nPresent: '+present+'\nNot marked: '+unmarked+'\n\nThis frontend demo displays the selected attendance. Connect a backend API to store it permanently.');
}
function openAssignmentForm(){openActionModal('assignmentModal');}
function publishAssignment(e){e.preventDefault();const file=document.getElementById('assignmentFile').files[0];const title=document.getElementById('assignmentTitle').value.trim();if(!file||!title)return;closeActionModal('assignmentModal');alert('Assignment "'+title+'" is ready to publish. Your backend can upload the file and create the assignment record through the API.');e.target.reset();}
function openMaterialForm(){openActionModal('materialModal');}
function saveMaterial(e){e.preventDefault();const file=document.getElementById('materialFile').files[0];const title=document.getElementById('materialTitle').value.trim();const cls=document.getElementById('materialClass').value;if(!file||!title)return;closeActionModal('materialModal');alert('Material "'+title+'" for '+cls+' is ready to upload. Your backend can store the file and class mapping through the API.');e.target.reset();}
document.addEventListener('click',e=>{if(e.target.classList.contains('action-modal'))closeActionModal(e.target.id)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeActionModal('attendanceModal');closeActionModal('assignmentModal');closeActionModal('materialModal');closeNotifications();closeAI();}});

// ===== Original script block 2 =====
function openUserProfile(){document.getElementById('profileModal')?.classList.add('open')}
function closeUserProfile(){document.getElementById('profileModal')?.classList.remove('open')}
function logoutFromDashboard(){
  try{
    if(window.parent && window.parent !== window && typeof window.parent.logout === 'function'){
      window.parent.logout();
      return;
    }
  }catch(err){}
  try{ sessionStorage.removeItem('erpUser'); }catch(err){}
  try{
    if(window.parent && window.parent !== window){
      window.parent.location.reload();
      return;
    }
  }catch(err){}
  window.location.reload();
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeUserProfile()});
document.getElementById('profileModal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeUserProfile()});

// ===== Original script block 3 =====
// Frontend-only session guard: the backend can replace this with real auth later.
(function(){
  try{
    const raw=sessionStorage.getItem('erpUser');
    if(raw) document.documentElement.dataset.erpSession='active';
  }catch(e){}
})();

// ===== Original script block 4 =====
(function(){
  const pageMap=[
    ['dashboard','Dashboard','overview home'],['students','Students','student student list'],['classes','My Classes','classes subjects courses'],['attendance','Attendance','attendance present absent face recognition student access'],['marks','Marks & Results','marks results grades'],['assignments','Assignments','assignment upload file homework'],['timetable','Timetable','timetable schedule'],['materials','Study Materials','materials upload file notes'],['announcements','Announcements','announcement notice'],['messages','Messages','messages communication'],['appointments','Appointments','appointments meetings'],['analytics','Analytics','analytics performance'],['reports','Reports','reports'],['helpdesk','Help Desk','support help technical issue ticket'],['settings','Settings','settings profile']
  ];
  const search=document.getElementById('globalSearch'), results=document.getElementById('globalSearchResults');
  function renderResults(q){
    if(!results)return; const x=q.trim().toLowerCase();
    if(!x){results.classList.remove('open');results.innerHTML='';return;}
    const hits=pageMap.filter(p=>(p[1]+' '+p[2]).toLowerCase().includes(x)).slice(0,6);
    results.innerHTML=hits.length?hits.map(p=>'<button class="search-result" type="button" data-search-page="'+p[0]+'"><b>'+p[1]+'</b><small>Open '+p[1]+' menu</small></button>').join(''):'<div class="search-result"><b>No matching menu</b><small>Try attendance, assignment, students, marks, timetable or materials.</small></div>';
    results.classList.add('open');
  }
  search?.addEventListener('input',e=>renderResults(e.target.value));
  search?.addEventListener('keydown',e=>{if(e.key==='Enter'){const hit=results?.querySelector('[data-search-page]');if(hit){window.go(hit.dataset.searchPage);results.classList.remove('open');search.value='';} } if(e.key==='Escape'){results?.classList.remove('open');}});
  results?.addEventListener('click',e=>{const b=e.target.closest('[data-search-page]');if(!b)return;window.go(b.dataset.searchPage);results.classList.remove('open');if(search)search.value='';});
  document.addEventListener('click',e=>{if(results&&!results.contains(e.target)&&e.target!==search)results.classList.remove('open');});

  // Browser history: one dashboard menu = one history step.
  const baseGo=window.go;
  window.go=function(id,fromHistory=false){
    if(typeof baseGo!=='function') return;
    baseGo(id,!!fromHistory);
  };
  window.addEventListener('popstate',function(){
    const id=location.hash.replace(/^#/,'');
    if(id && document.getElementById(id)) window.go(id,true);
    else window.go('dashboard',true);
  });
  const initial=location.hash.replace(/^#/,'');
  if(initial && document.getElementById(initial)) window.go(initial,true);
  else window.go('dashboard',true);

  // Faculty-controlled attendance access window.
  const accessUntil=document.getElementById('accessUntil'), status=document.getElementById('accessStatusBadge'), countdown=document.getElementById('accessCountdown'), box=document.querySelector('.student-access-control');
  const openBtn=document.getElementById('openStudentAccessBtn'), closeBtn=document.getElementById('closeStudentAccessBtn');
  let accessTimer=null, accessOpen=false;
  if(accessUntil){const d=new Date(Date.now()+10*60000); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); accessUntil.value=d.toISOString().slice(0,16);}
  function setAccess(open){
    accessOpen=open; box?.classList.toggle('access-open',open); status.textContent=open?'Access Open':'Access Closed'; status.className='badge '+(open?'success':'warning');
    if(accessTimer){clearInterval(accessTimer);accessTimer=null;}
    if(open){
      const target=new Date(accessUntil.value).getTime();
      const tick=()=>{const left=target-Date.now(); if(left<=0){setAccess(false);return;} const m=Math.floor(left/60000),s=Math.floor((left%60000)/1000); countdown.textContent='Student face-recognition attendance access is OPEN. Access closes in '+m+'m '+String(s).padStart(2,'0')+'s, or you can close it manually.';};
      tick();accessTimer=setInterval(tick,1000);
      try{sessionStorage.setItem('facultyAttendanceAccess',JSON.stringify({open:true,className:document.getElementById('accessClass')?.value,until:accessUntil.value}));}catch(e){}
    }else{countdown.textContent='Students cannot submit attendance while access is closed.';try{sessionStorage.removeItem('facultyAttendanceAccess')}catch(e){}}
  }
  openBtn?.addEventListener('click',()=>{if(!accessUntil.value){alert('Please select an access end time.');return;} if(new Date(accessUntil.value)<=new Date()){alert('Access time must be in the future.');return;} setAccess(true);});
  closeBtn?.addEventListener('click',()=>setAccess(false));
  try{const saved=JSON.parse(sessionStorage.getItem('facultyAttendanceAccess')||'null');if(saved?.open&&new Date(saved.until)>new Date()){if(accessUntil)accessUntil.value=saved.until;setAccess(true);}else{sessionStorage.removeItem('facultyAttendanceAccess');}}catch(e){}
})();

// ===== Original script block 5 =====
(function(){
  const table=document.getElementById('internalMarksTable');
  if(!table)return;
  const storageKey='joyFacultyInternalMarks_v1';
  function rows(){return [...table.querySelectorAll('tbody tr')];}
  function updateStats(){
    const totals=rows().map(r=>Number(r.querySelector('.total-cell b').textContent.split('/')[0]));
    if(!totals.length)return;
    const avg=totals.reduce((a,b)=>a+b,0)/totals.length;
    const average=document.getElementById('marksAverage');
    const highest=document.getElementById('marksHighest');
    if(average)average.textContent=avg.toFixed(1);
    if(highest)highest.textContent=Math.max(...totals);
  }
  function saveAll(){
    const data=rows().map(r=>({name:r.dataset.student,marks:[...r.querySelectorAll('.mark-cell')].map(c=>Number(c.dataset.mark))}));
    try{localStorage.setItem(storageKey,JSON.stringify(data));}catch(e){}
  }
  function applySaved(){
    try{
      const data=JSON.parse(localStorage.getItem(storageKey)||'null');
      if(!Array.isArray(data))return;
      data.forEach(item=>{
        const row=rows().find(r=>r.dataset.student===item.name);
        if(!row||!Array.isArray(item.marks)||item.marks.length!==3)return;
        row.querySelectorAll('.mark-cell').forEach((cell,i)=>{cell.dataset.mark=item.marks[i];cell.textContent=item.marks[i];});
        row.querySelector('.total-cell').innerHTML='<b>'+item.marks.reduce((a,b)=>a+Number(b),0)+'/60</b>';
      });
      updateStats();
    }catch(e){}
  }
  window.editInternalMarks=function(button){
    const row=button.closest('tr');
    if(row.dataset.editing==='true')return;
    row.dataset.editing='true';
    row.querySelectorAll('.mark-cell').forEach((cell,i)=>{
      const input=document.createElement('input');
      input.className='mark-edit-input';input.type='number';input.min='0';input.max=[25,25,10][i];input.step='1';input.value=cell.dataset.mark;input.setAttribute('aria-label',['Internal 1','Internal 2','Assignment'][i]+' marks');
      cell.textContent='';cell.appendChild(input);
    });
    const action=row.lastElementChild;
    action.innerHTML='<div class="mark-actions"><button class="btn" type="button" onclick="saveInternalMarks(this)">💾 Save</button><button class="btn secondary" type="button" onclick="cancelInternalMarks(this)">Cancel</button></div>';
    row.dataset.original=JSON.stringify([...row.querySelectorAll('.mark-cell')].map(c=>Number(c.dataset.mark)));
  };
  window.saveInternalMarks=function(button){
    const row=button.closest('tr');
    const inputs=[...row.querySelectorAll('input.mark-edit-input')];
    const limits=[25,25,10];
    const values=inputs.map((input,i)=>Number(input.value));
    if(inputs.some((input,i)=>input.value===''||!Number.isInteger(values[i])||values[i]<0||values[i]>limits[i])){
      alert('Enter whole-number marks within the allowed limits: 25, 25 and 10.');return;
    }
    row.querySelectorAll('.mark-cell').forEach((cell,i)=>{cell.dataset.mark=values[i];cell.textContent=values[i];});
    row.querySelector('.total-cell').innerHTML='<b>'+values.reduce((a,b)=>a+b,0)+'/60</b>';
    row.lastElementChild.innerHTML='<button class="btn secondary" type="button" onclick="editInternalMarks(this)">✏️ Edit</button>';
    delete row.dataset.editing;delete row.dataset.original;
    saveAll();updateStats();
  };
  window.cancelInternalMarks=function(button){
    const row=button.closest('tr');
    const original=JSON.parse(row.dataset.original||'[]');
    row.querySelectorAll('.mark-cell').forEach((cell,i)=>{cell.textContent=original[i];});
    row.lastElementChild.innerHTML='<button class="btn secondary" type="button" onclick="editInternalMarks(this)">✏️ Edit</button>';
    delete row.dataset.editing;delete row.dataset.original;
  };
  applySaved();
})();

// ===== Original script block 6 =====
(function(){
  const $=id=>document.getElementById(id);
  function toast(msg){const w=$('toastWrap');if(!w)return;const d=document.createElement('div');d.className='faculty-toast';d.textContent=msg;w.appendChild(d);setTimeout(()=>d.remove(),3200)}
  window.facultyToast=toast;
  document.addEventListener('click',e=>{const p=$('notificationsPanel'),b=$('notificationBtn');if(p&&p.classList.contains('open')&&!p.contains(e.target)&&e.target!==b&&!b?.contains(e.target))closeNotifications();});

  // Reliable navigation for standalone and embedded use.
  const originalGo=window.go;
  window.go=function(id,fromHistory=false){
    if(typeof originalGo==='function') originalGo(id,!!fromHistory);
    else return;
    document.querySelectorAll('.nav a[data-page]').forEach(a=>a.classList.toggle('active',a.dataset.page===id));
    if(typeof closeNotifications==='function')closeNotifications();
    if(typeof closeAI==='function')closeAI();
  };
  function initRoute(){
    const id=(location.hash||'').replace('#','');
    if(id && document.getElementById(id) && typeof window.go==='function') window.go(id,true);
    else if(typeof window.go==='function') window.go('dashboard',true);
  }
  window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id&&document.getElementById(id))window.go(id)});
  initRoute();

  // Make dashboard shortcut cards behave like the sidebar.
  document.querySelectorAll('.faculty-story[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();window.go(a.getAttribute('href').slice(1));}));

  // Replace intrusive demo alerts with small non-blocking messages where appropriate.
  window.notify=function(){toast('You have 3 new faculty notifications.');};

  // Standalone-safe logout; embedded ERP still gets the parent logout first.
  const oldLogout=window.logoutFromDashboard;
  window.logoutFromDashboard=function logout() {
    sessionStorage.removeItem('erpUser');
    window.location.href = 'INDEX.html';
};

  // Material upload now uses the same class-selection flow as assignments.
  window.chooseMaterial=function(){if(typeof window.openMaterialForm==='function')window.openMaterialForm();};

  // Lightweight announcement modal for the standalone frontend.
  window.openAnnouncementForm=function(){
    if($('announcementModal')){$('announcementModal').classList.add('open');return;}
    const m=document.createElement('div');m.id='announcementModal';m.className='action-modal open';m.innerHTML='<div class="action-card"><div class="action-head"><h2>New Announcement</h2><button type="button" class="icon-close" onclick="closeAnnouncementForm()">×</button></div><form onsubmit="saveAnnouncement(event)"><label>Title<input id="newAnnouncementTitle" required placeholder="Announcement title"></label><label>Message<textarea id="newAnnouncementMessage" rows="4" required placeholder="Write the notice..."></textarea></label><label>Audience<select id="newAnnouncementAudience"><option>ECE-A</option><option>ECE-B</option><option>All Students</option></select></label><div class="action-foot"><button type="button" class="btn secondary" onclick="closeAnnouncementForm()">Cancel</button><button class="btn" type="submit">Publish</button></div></form></div>';document.body.appendChild(m);
  };
  window.closeAnnouncementForm=function(){const m=$('announcementModal');if(m)m.remove();};
  window.saveAnnouncement=function(e){e.preventDefault();const t=$('newAnnouncementTitle').value.trim(),a=$('newAnnouncementAudience').value;closeAnnouncementForm();toast('Announcement "'+t+'" prepared for '+a+'. Backend publishing can be connected here.');};

  // Appointment modal.
  window.openAppointmentForm=function(){
    if($('appointmentModal'))return;
    const m=document.createElement('div');m.id='appointmentModal';m.className='action-modal open';m.innerHTML='<div class="action-card"><div class="action-head"><h2>New Appointment</h2><button type="button" class="icon-close" onclick="closeAppointmentForm()">×</button></div><form onsubmit="saveAppointment(event)"><div class="form-grid"><label>With<input id="apptWith" required placeholder="Student / group / office"></label><label>Purpose<input id="apptPurpose" required placeholder="Project guidance"></label><label>Date<input id="apptDate" type="date" required></label><label>Time<input id="apptTime" type="time" required></label></div><div class="action-foot"><button type="button" class="btn secondary" onclick="closeAppointmentForm()">Cancel</button><button class="btn" type="submit">Create Appointment</button></div></form></div>';document.body.appendChild(m);
  };
  window.closeAppointmentForm=function(){const m=$('appointmentModal');if(m)m.remove();};
  window.saveAppointment=function(e){e.preventDefault();const who=$('apptWith').value.trim();closeAppointmentForm();toast('Appointment with '+who+' prepared. Backend calendar integration can be connected here.');};

  // Escape closes every overlay created by this copy.
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAnnouncementForm();closeAppointmentForm();}});

  // Reports and Help Desk actions are wired in the final interaction block below.

  // Replace material and announcement/appointment demo handlers.
  document.querySelectorAll('#materials button.btn').forEach(btn=>{if(btn.textContent.includes('Upload')){btn.onclick=openMaterialForm;}});
  document.querySelectorAll('#announcements button.btn').forEach(btn=>{if(btn.textContent.includes('New Announcement'))btn.onclick=openAnnouncementForm;});
  document.querySelectorAll('#appointments button.btn').forEach(btn=>{if(btn.textContent.includes('New Appointment'))btn.onclick=openAppointmentForm;});

  // Close action modals when clicking their backdrop.
  document.addEventListener('click',e=>{if(e.target.classList&&e.target.classList.contains('action-modal'))e.target.remove();});
})();

// ===== Original script block 7 =====
(function(){
  let aiHistoryState=false;
  function safeCloseAI(){
    try{
      const p=document.getElementById('aiPanel'), f=document.getElementById('aiFab');
      if(p){p.classList.remove('open');p.setAttribute('aria-hidden','true');}
      if(f){f.classList.remove('ai-open');}
    }catch(e){}
  }
  function resetAIButton(){
    const f=document.getElementById('aiFab');
    if(f){
      f.classList.remove('ai-open');
      const label=f.querySelector('.ai-fab-label');
      if(label)label.textContent='Ask AI';
      f.setAttribute('aria-label','Ask AI for faculty help');
    }
  }
  function safeCloseNotifications(){
    try{const p=document.getElementById('notificationsPanel');if(p){p.classList.remove('open');p.setAttribute('aria-hidden','true');}}catch(e){}
  }
  window.notify=function(){
    const p=document.getElementById('notificationsPanel');
    if(!p)return;
    const open=!p.classList.contains('open');
    safeCloseAI(); resetAIButton();
    p.classList.toggle('open',open);
    p.setAttribute('aria-hidden',String(!open));
  };

  // Opening Ask AI creates a harmless same-page history step.
  // Therefore Android/browser Back closes Ask AI first, then the next Back returns to the previous ERP page.
  const fab=document.getElementById('aiFab');
  // Robust Ask AI click handler: use the button's own click property so it
  // remains clickable on mobile even when other document handlers are active.
  if(fab){
    fab.onclick=function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      const panel=document.getElementById('aiPanel');
      if(!panel)return false;
      const isOpen=panel.classList.contains('open');
      if(isOpen){
        safeCloseAI(); resetAIButton();
        if(aiHistoryState){
          aiHistoryState=false;
          try{history.back();}catch(e){}
        }
        return false;
      }
      safeCloseNotifications();
      if(!aiHistoryState){
        try{
          history.pushState(Object.assign({},history.state||{}, {aiOverlay:true}), '', location.href);
          aiHistoryState=true;
        }catch(e){}
      }
      panel.classList.add('open');
      panel.setAttribute('aria-hidden','false');
      fab.classList.add('ai-open');
      fab.setAttribute('aria-label','Close Ask AI');
      const label=fab.querySelector('.ai-fab-label');
      if(label)label.textContent='Ask AI';
      const input=document.getElementById('aiInput');
      if(input)setTimeout(()=>input.focus(),0);
      return false;
    };
  }
  document.getElementById('aiClose')?.addEventListener('click',function(){
    safeCloseAI(); resetAIButton();
    if(aiHistoryState){aiHistoryState=false;try{history.back();}catch(e){}}
  });

  // Navigation must clear the AI history step, so Back never gets trapped on the assistant.
  const oldGo=window.go;
  if(typeof oldGo==='function'){
    window.go=function(id,fromHistory){
      safeCloseAI(); resetAIButton(); safeCloseNotifications();
      if(aiHistoryState){
        aiHistoryState=false;
        try{history.replaceState(Object.assign({},history.state||{}, {aiOverlay:false}), '', location.href);}catch(e){}
      }
      return oldGo(id,!!fromHistory);
    };
  }

  window.addEventListener('popstate',function(e){
    if(aiHistoryState){
      aiHistoryState=false;
      safeCloseAI(); resetAIButton();
      // This Back action was consumed only by Ask AI; keep the current ERP page.
      return;
    }
    safeCloseAI(); resetAIButton(); safeCloseNotifications();
    const id=location.hash.replace(/^#/,'');
    if(id && document.getElementById(id) && typeof window.go==='function') window.go(id,true);
    else if(typeof window.go==='function') window.go('dashboard',true);
  });
  window.addEventListener('hashchange',function(){safeCloseAI();resetAIButton();safeCloseNotifications();});
  document.addEventListener('click',function(e){
    const nav=e.target.closest?.('.nav a[data-page], .faculty-story[href^="#"], [onclick*="go("]');
    if(nav){safeCloseAI();resetAIButton();safeCloseNotifications();}
  },true);
  window.addEventListener('scroll',function(){
    const p=document.getElementById('aiPanel');
    if(p&&p.classList.contains('open')){safeCloseAI();resetAIButton();}
  },{passive:true});
  resetAIButton();
})();


// ===== Working Help Desk tickets and report generation =====
(function(){
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function showToast(message){
    if(typeof window.facultyToast === 'function') window.facultyToast(message);
    else alert(message);
  }

  // New Ticket opens a real in-page form; submitting adds the ticket to Recent Tickets.
  $('newTicketBtn')?.addEventListener('click', function(){
    if($('newTicketModal')) return;
    const modal=document.createElement('div');
    modal.className='action-modal open'; modal.id='newTicketModal';
    modal.innerHTML=`<div class="action-card" role="dialog" aria-modal="true" aria-labelledby="ticketFormTitle">
      <div class="action-head"><h2 id="ticketFormTitle">Create Help Desk Ticket</h2><button class="icon-close" type="button" data-ticket-close aria-label="Close">×</button></div>
      <form id="newTicketForm">
        <label>Issue title<input name="title" required maxlength="100" placeholder="Enter the issue title"></label>
        <div class="form-grid">
          <label>Category<select name="category" required><option value="">Select category</option><option>ERP / Technical</option><option>Attendance</option><option>Academic</option><option>Account / Profile</option><option>Other</option></select></label>
          <label>Priority<select name="priority" required><option>Normal</option><option>High</option><option>Urgent</option></select></label>
        </div>
        <label>Description<textarea name="description" rows="4" required maxlength="1000" placeholder="Describe the issue"></textarea></label>
        <div class="action-foot"><button class="btn secondary" type="button" data-ticket-close>Cancel</button><button class="btn" type="submit">Submit Ticket</button></div>
      </form></div>`;
    document.body.appendChild(modal);
    modal.querySelector('[name="title"]').focus();
    modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-ticket-close]'))modal.remove();});
    modal.querySelector('#newTicketForm').addEventListener('submit',e=>{
      e.preventDefault();
      const data=new FormData(e.currentTarget);
      const tbody=document.querySelector('#helpdesk table tbody');
      const ticketNo=String(Date.now()).slice(-6);
      const tr=document.createElement('tr');
      const cells=['HD-2026-'+ticketNo,data.get('title'),new Date().toLocaleDateString('en-IN'),'New'];
      cells.forEach((value,i)=>{const td=document.createElement('td');td.textContent=value;if(i===3){const badge=document.createElement('span');badge.className='badge info';badge.textContent='New';td.replaceChildren(badge);}tr.appendChild(td);});
      if(tbody)tbody.prepend(tr);
      const openBadge=document.querySelector('#helpdesk .badge.info');
      if(openBadge && openBadge.closest('.card')?.querySelector('h3')?.textContent.includes('My Tickets')){
        const count=(parseInt(openBadge.textContent,10)||0)+1;openBadge.textContent=count+' Open';
      }
      modal.remove();
      showToast('Ticket submitted successfully in this browser demo.');
    });
  });

  // Build report content from the actual sample rows already present in the faculty dashboard.
  function tableRows(selector){
    const table=document.querySelector(selector);
    if(!table) return [];
    const headers=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    return [...table.querySelectorAll('tbody tr')].filter(row=>row.cells.length).map(row=>
      [...row.cells].map((cell,i)=>({heading:headers[i]||('Column '+(i+1)),value:cell.innerText.trim()}))
    );
  }
  function renderReport(kind){
    const config={
      attendance:{title:'Attendance Report',selector:'#attendance table',intro:'Class-wise attendance summary'},
      marks:{title:'Marks Report',selector:'#internalMarksTable',intro:'Internal assessment and marks summary'},
      assignments:{title:'Assignment Report',selector:'#assignments table',intro:'Assignment submission and evaluation summary'}
    }[kind];
    const output=$('reportOutput');
    if(!config||!output)return;
    const rows=tableRows(config.selector);
    if(!rows.length){
      output.hidden=false;
      output.innerHTML='<h3>'+config.title+'</h3><p class="label">No report data is currently available in this dashboard.</p>';
      return;
    }
    const headers=rows[0].map(x=>x.heading);
    const body=rows.map(row=>'<tr>'+row.map(x=>'<td>'+esc(x.value)+'</td>').join('')+'</tr>').join('');
    output.hidden=false;
    output.innerHTML=`<div class="section-title report-heading"><div><h3>${config.title}</h3><p class="label">${config.intro} · Generated ${new Date().toLocaleString('en-IN')}</p></div><div class="actions"><button class="btn secondary" type="button" id="closeGeneratedReport">Close</button><button class="btn" type="button" id="printGeneratedReport">Print Report</button></div></div>
      <div class="report-table-wrap"><table><thead><tr>${headers.map(h=>'<th>'+esc(h)+'</th>').join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
    output.scrollIntoView({behavior:'smooth',block:'start'});
    $('closeGeneratedReport')?.addEventListener('click',()=>{output.hidden=true;output.innerHTML='';});
    $('printGeneratedReport')?.addEventListener('click',()=>{
      const printWindow=window.open('','_blank','width=900,height=700');
      if(!printWindow){showToast('Allow pop-ups to print the report.');return;}
      printWindow.document.write(`<!doctype html><html><head><title>${config.title}</title><style>body{font-family:Arial,sans-serif;padding:28px;color:#222}h2{color:#6b0f0f}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ccc;padding:10px;text-align:left}th{background:#eee}</style></head><body><h2>Joy University — ${config.title}</h2><p>${config.intro}</p><p>Generated: ${new Date().toLocaleString('en-IN')}</p><table><thead><tr>${headers.map(h=>'<th>'+esc(h)+'</th>').join('')}</tr></thead><tbody>${body}</tbody></table></body></html>`);
      printWindow.document.close();printWindow.focus();printWindow.print();
    });
  }
  document.querySelectorAll('#reports [data-report]').forEach(button=>{
    button.addEventListener('click',()=>renderReport(button.dataset.report));
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$('newTicketModal')?.remove();});
})();



// Keep the embedded faculty exam upload page sized to its content.
window.addEventListener('DOMContentLoaded',()=>{
  const frame=document.getElementById('facultyOnlineExamFrame');
  if(!frame)return;
  const fit=()=>{try{const d=frame.contentDocument;if(d&&d.documentElement){frame.style.height=Math.max(900,d.documentElement.scrollHeight+24)+'px';}}catch(e){/* same-origin restriction: retain the safe fallback height */}};
  frame.addEventListener('load',()=>{fit();try{const d=frame.contentDocument;if(d){new MutationObserver(fit).observe(d.documentElement,{childList:true,subtree:true,attributes:true});}}catch(e){}});
  window.addEventListener('resize',fit);
});
