/* ==========================================
   JOY UNIVERSITY - DEAN DASHBOARD
   script.js  (all JavaScript)
   ========================================== */

/* ---------- JS PART 1: script block 1 ---------- */
(function(){
  const panel=document.getElementById('menuSettingsPanel');
  const btn=document.getElementById('menuSettings');
  const closeBtn=document.getElementById('menuSettingsClose');
  function openSettings(fromHistory=false){
    if(!fromHistory) history.pushState({...history.state,deanSettings:true},'',location.href);
    panel?.classList.add('open'); panel?.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function closeSettings(){
    panel?.classList.remove('open'); panel?.setAttribute('aria-hidden','true'); document.body.style.overflow='';
  }
  btn?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();document.querySelectorAll('.menu a').forEach(a=>a.classList.remove('active'));btn.classList.add('active');openSettings();if(innerWidth<=900)document.getElementById('sidebar')?.classList.remove('open');},true);
  closeBtn?.addEventListener('click',()=>{if(history.state?.deanSettings)history.back();else closeSettings();});
  panel?.addEventListener('click',e=>{if(e.target===panel){if(history.state?.deanSettings)history.back();else closeSettings();}});
  window.addEventListener('popstate',()=>{if(history.state?.deanSettings)openSettings(true);else closeSettings();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel?.classList.contains('open')){if(history.state?.deanSettings)history.back();else closeSettings();}});
})();

/* ---------- JS PART 2: script block 2 ---------- */
const $=id=>document.getElementById(id);
$('today').textContent=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

/* Mobile menu */
function updateMenuButton(){
  const open=$('sidebar').classList.contains('open');
  $('menuBtn').textContent=open?'×':'☰';
  $('menuBtn').setAttribute('aria-label',open?'Close menu':'Open menu');
  $('sidebarOverlay')?.classList.toggle('open',open);
  $('sidebarOverlay')?.setAttribute('aria-hidden',String(!open));
}
$('menuBtn').onclick=()=>{
  $('sidebar').classList.toggle('open');
  updateMenuButton();
};
$('sidebarOverlay')?.addEventListener('click',()=>{
  $('sidebar').classList.remove('open');
  updateMenuButton();
});
document.addEventListener('click',e=>{
  if(innerWidth<=900&&!e.target.closest('#sidebar,#menuBtn')){
    $('sidebar').classList.remove('open');
    updateMenuButton();
  }
});


/* Floating AI chat */
const panel=$('aiPanel'),fab=$('aiFab'),body=$('aiBody'),text=$('aiText'),send=$('aiSend');
const suggestions=['What is my attendance this week?','Show my timetable for today','When is my next exam?','How do I pay my fees?'];

function openChat(){
  panel.classList.add('open');
  history.replaceState(null,'','#ai');
  fab.classList.remove('hidden');
  fab.classList.add('ai-open');
  fab.textContent='🔙';
  fab.setAttribute('aria-label','Back to page');
  fab.title='Back to page';
  text.focus();
}
function closeChat(){
  panel.classList.remove('open');
  if(window.location.hash==='#ai') history.replaceState(null,'',window.location.pathname+window.location.search);
  fab.classList.remove('ai-open');
  fab.classList.remove('hidden');
  fab.textContent='✨ Ask AI';
  fab.setAttribute('aria-label','Open AI assistant');
  fab.title='Open AI assistant';
}
fab.onclick=()=>panel.classList.contains('open')?closeChat():openChat();
$('aiClose').onclick=closeChat;
$('menuAi').onclick=e=>{e.preventDefault();$('sidebar').classList.remove('open');openChat()};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeChat()});

function newChat(){
  body.innerHTML='';
  const empty=document.createElement('div');
  empty.className='ai-empty';
  empty.innerHTML='<h3>How can I help?</h3><p>Ask about classes, exams, fees or campus services.</p>';
  const chips=document.createElement('div');
  chips.className='ai-chips';
  suggestions.forEach(s=>{
    const b=document.createElement('button');
    b.textContent=s;b.onclick=()=>ask(s);
    chips.appendChild(b);
  });
  empty.appendChild(chips);
  body.appendChild(empty);
  text.value='';send.disabled=true;text.focus();
}
$('aiNew').onclick=newChat;

function addMsg(role,content){
  const empty=body.querySelector('.ai-empty');if(empty)empty.remove();
  const m=document.createElement('div');
  m.className='msg '+role;m.textContent=content;
  body.appendChild(m);body.scrollTop=body.scrollHeight;
  return m;
}

/* Demo replies. Replace getReply() with a call to your own backend/API. */
async function getReply(q){
  const t=q.toLowerCase();
  await new Promise(r=>setTimeout(r,700));
  if(t.includes('attendance'))return 'Your overall attendance is 86%, above the 75% minimum.';
  if(t.includes('timetable')||t.includes('class'))return 'Today: Data Structures at 9:00 AM (done), Database Systems at 11:00 AM, and Operating Systems Lab at 2:00 PM.';
  if(t.includes('exam'))return 'Your next exam starts on October 14. Check the Exams page for the full schedule.';
  if(t.includes('fee')||t.includes('pay'))return 'Open Fees, or use the Pay fees shortcut on the dashboard. The deadline is October 20.';
  return 'I can help with attendance, timetable, exams and fees. Try one of those, or contact the academic office for anything else.';
}

async function ask(q){
  q=q.trim();if(!q)return;
  addMsg('user',q);
  text.value='';text.style.height='auto';send.disabled=true;
  const typing=addMsg('bot typing','Thinking…');
  try{typing.remove();addMsg('bot',await getReply(q))}
  catch(err){typing.remove();addMsg('bot','Something went wrong. Please try again.')}
}

text.addEventListener('input',()=>{
  send.disabled=!text.value.trim();
  text.style.height='auto';text.style.height=Math.min(text.scrollHeight,100)+'px';
});
text.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask(text.value)}
});
send.onclick=()=>ask(text.value);

newChat();



/* FINAL WORKING MENU SYSTEM */
(function(){
  const panelMap = {
    departments: 'departmentsManagementPanel',
    faculty: 'facultyPanel',
    students: 'studentsPanel',
    fees: 'feesPanel',
    timetable: 'timetablePanel',
    exams: 'examsPanel',
    attendance: 'attendancePanel',
    announcements: 'announcementsPanel',
    documents: 'documentsPanel',
    reports: 'reportsPanel',
    settings: 'settingsPanel'
  };

  function closeAllPanels(){
    document.querySelectorAll('.open-panel').forEach(function(p){
      p.classList.remove('show');
    });
  }

  function openPanel(section){
    closeAllPanels();
    var id = panelMap[section];
    var panel = id ? document.getElementById(id) : null;
    if(panel){
      panel.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closePanel(panel){
    if(panel) panel.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Use ONE click listener for the entire sidebar.
  var menu = document.querySelector('.menu');
  if(menu){
    menu.addEventListener('click', function(e){
      var link = e.target.closest('a[data-section]');
      if(!link) return;

      e.preventDefault();
      e.stopPropagation();

      var section = link.getAttribute('data-section');

      if(section === 'dashboard'){
        closeAllPanels();
        document.body.style.overflow = '';
        document.querySelectorAll('.menu a').forEach(function(a){
          a.classList.remove('active');
        });
        link.classList.add('active');
        return;
      }

      if(panelMap[section]){
        document.querySelectorAll('.menu a').forEach(function(a){
          a.classList.remove('active');
        });
        link.classList.add('active');
        openPanel(section);

        var sidebar = document.getElementById('sidebar');
        if(window.innerWidth <= 900 && sidebar){
          sidebar.classList.remove('open');
        }
      }
    }, false);
  }

  // Overview cards also open panels.
  document.addEventListener('click', function(e){
    var card = e.target.closest('.open-card[data-open]');
    if(card){
      e.preventDefault();
      openPanel(card.getAttribute('data-open').replace('Panel',''));
      return;
    }

    var close = e.target.closest('.panel-close[data-close]');
    if(close){
      e.preventDefault();
      closePanel(document.getElementById(close.getAttribute('data-close')));
      return;
    }

    var panel = e.target.closest('.open-panel');
    if(panel && e.target === panel){
      closePanel(panel);
    }
  }, false);

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      closeAllPanels();
      document.body.style.overflow = '';
    }
  });
})();

/* ---------- JS PART 3: script block 3 ---------- */
(function(){
  const $=id=>document.getElementById(id);
  const panel=$('erpPanel'), formModal=$('erpFormModal'), tbody=$('erpTbody'), thead=$('erpThead'), fields=$('erpFields'), search=$('erpSearch');
  let current='departments', editIndex=-1;
  const configs={
    departments:{title:'🏫 Departments',sub:'Manage schools, departments, HODs, faculty and student strength.',add:'Add Department',cols:['ID','Department / School','Head of Department','Faculty','Students','Status'],fields:[['id','Department ID','text','SOCI'],['name','Department / School','text','School of Computing & Informatics'],['head','Head of Department','text','Dr. Name'],['faculty','Faculty Count','number','25'],['students','Student Count','number','500'],['status','Status','select','Active','Active|Inactive']],data:[
      {id:'SOCI',name:'School of Computing & Informatics',head:'Dr. Ravi Kumar',faculty:28,students:520,status:'Active'},
      {id:'SOET',name:'School of Engineering & Technology',head:'Dr. Priya Sharma',faculty:35,students:680,status:'Active'},
      {id:'SOANS',name:'School of Advanced & Natural Sciences',head:'Dr. Arun Kumar',faculty:22,students:410,status:'Active'},
      {id:'SOBM',name:'School of Business & Management',head:'Dr. Suresh Reddy',faculty:18,students:360,status:'Active'},
      {id:'SOH',name:'School of Humanities',head:'Dr. Anitha Rao',faculty:15,students:240,status:'Active'},
      {id:'SOHS',name:'School of Health Sciences',head:'Dr. Meena Das',faculty:20,students:300,status:'Active'}]},
    faculty:{title:'👨‍🏫 Faculty',sub:'Enter and manage faculty profiles, departments, designation and contact details.',add:'Add Faculty',cols:['Employee ID','Name','Department','Designation','Email','Phone','Status'],fields:[['id','Employee ID','text','FAC001'],['name','Faculty Name','text','Dr. Faculty Name'],['department','Department','select','SOCI','SOCI|SOET|SOANS|SOBM|SOH|SOHS'],['designation','Designation','text','Assistant Professor'],['email','Email','email','faculty@joyuniversity.edu'],['phone','Phone','tel','9876543210'],['status','Status','select','Active','Active|On Leave|Inactive']],data:[{id:'FAC001',name:'Dr. Ravi Kumar',department:'SOCI',designation:'Professor & HOD',email:'ravi@joyuniversity.edu',phone:'9876543210',status:'Active'},{id:'FAC002',name:'Dr. Priya Sharma',department:'SOET',designation:'Associate Professor',email:'priya@joyuniversity.edu',phone:'9876543211',status:'Active'}]},
    students:{title:'🎓 Students',sub:'Enter student admission, academic, contact and status details.',add:'Add Student',cols:['Student ID','Name','Department','Year','Section','Email','Status'],fields:[['id','Student ID','text','STU001'],['name','Student Name','text','Student Name'],['department','Department','select','SOCI','SOCI|SOET|SOANS|SOBM|SOH|SOHS'],['year','Year','select','1','1|2|3|4'],['section','Section','text','A'],['email','Email','email','student@joyuniversity.edu'],['phone','Phone','tel','9876543210'],['dob','Date of Birth','date',''],['status','Status','select','Active','Active|Graduated|Inactive']],data:[{id:'STU001',name:'Abhishek Reddy',department:'SOCI',year:'3',section:'A',email:'student@joyuniversity.edu',phone:'9876500000',dob:'2005-05-12',status:'Active'},{id:'STU002',name:'Ananya Rao',department:'SOET',year:'2',section:'B',email:'ananya@joyuniversity.edu',phone:'9876500001',dob:'2006-02-18',status:'Active'}]},
    fees:{title:'💳 Fees',sub:'Enter fee structures, payments, pending amounts and payment status.',add:'Add Fee Record',cols:['Receipt / ID','Student ID','Student Name','Fee Type','Amount','Paid','Balance','Status'],fields:[['id','Receipt / Fee ID','text','FEE001'],['studentId','Student ID','text','STU001'],['studentName','Student Name','text','Student Name'],['feeType','Fee Type','select','Tuition','Tuition|Hostel|Exam|Transport|Library|Other'],['amount','Total Amount','number','50000'],['paid','Paid Amount','number','25000'],['dueDate','Due Date','date',''],['status','Status','select','Pending','Paid|Pending|Partial']],data:[{id:'FEE001',studentId:'STU001',studentName:'Abhishek Reddy',feeType:'Tuition',amount:50000,paid:25000,dueDate:'2026-10-20',status:'Partial'},{id:'FEE002',studentId:'STU002',studentName:'Ananya Rao',feeType:'Exam',amount:5000,paid:5000,dueDate:'2026-10-10',status:'Paid'}]},
    timetable:{title:'📅 Timetable',sub:'Create class schedules with department, subject, faculty, room and timing.',add:'Add Timetable',cols:['Day','Time','Department','Year','Subject','Faculty','Room'],fields:[['day','Day','select','Monday','Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'],['time','Time','text','09:00 AM - 10:00 AM'],['department','Department','select','SOCI','SOCI|SOET|SOANS|SOBM|SOH|SOHS'],['year','Year','select','1','1|2|3|4'],['subject','Subject','text','Data Structures'],['faculty','Faculty','text','Dr. Ravi Kumar'],['room','Room / Lab','text','Room 204']],data:[{day:'Monday',time:'09:00 AM - 10:00 AM',department:'SOCI',year:'3',subject:'Data Structures',faculty:'Dr. Ravi Kumar',room:'Room 204'},{day:'Monday',time:'11:00 AM - 12:00 PM',department:'SOET',year:'2',subject:'Database Systems',faculty:'Dr. Priya Sharma',room:'Room 110'}]},
    exams:{title:'📝 Examinations',sub:'Enter exam schedules, assessments, results and examination details.',add:'Add Exam',cols:['Exam ID','Type','Department','Subject','Date','Time','Room','Status'],fields:[['id','Exam ID','text','EXAM001'],['type','Exam Type','select','Mid Term','Mid Term|Internal Assessment|Semester End|Practical|Other'],['department','Department','select','SOCI','SOCI|SOET|SOANS|SOBM|SOH|SOHS'],['subject','Subject','text','Data Structures'],['date','Exam Date','date',''],['time','Time','text','10:00 AM - 01:00 PM'],['room','Room','text','Exam Hall 1'],['status','Status','select','Scheduled','Scheduled|Completed|Cancelled']],data:[{id:'EXAM001',type:'Mid Term',department:'SOCI',subject:'Data Structures',date:'2026-10-14',time:'10:00 AM - 01:00 PM',room:'Exam Hall 1',status:'Scheduled'}]},
    attendance:{title:'📊 Attendance',sub:'Enter daily student/faculty attendance and review attendance percentage.',add:'Add Attendance',cols:['Date','Student / Faculty ID','Name','Department','Subject','Present','Percentage'],fields:[['date','Date','date',''],['personId','Student / Faculty ID','text','STU001'],['name','Name','text','Student Name'],['department','Department','select','SOCI','SOCI|SOET|SOANS|SOBM|SOH|SOHS'],['subject','Subject','text','Data Structures'],['present','Attendance','select','Present','Present|Absent|Leave'],['percentage','Current Percentage','number','86']],data:[{date:'2026-09-30',personId:'STU001',name:'Abhishek Reddy',department:'SOCI',subject:'Data Structures',present:'Present',percentage:86},{date:'2026-09-30',personId:'STU002',name:'Ananya Rao',department:'SOET',subject:'Database Systems',present:'Absent',percentage:78}]},
    announcements:{title:'📢 Announcements',sub:'Create notices and publish them to students, faculty or selected departments.',add:'Create Announcement',cols:['Title','Audience','Department','Publish Date','Priority','Status'],fields:[['title','Announcement Title','text','Mid-term schedule released'],['message','Message','textarea','Enter announcement details...'],['audience','Audience','select','All','All|Students|Faculty|Department'],['department','Department','select','All','All|SOCI|SOET|SOANS|SOBM|SOH|SOHS'],['date','Publish Date','date',''],['priority','Priority','select','Normal','Low|Normal|High'],['status','Status','select','Published','Draft|Published|Archived']],data:[{title:'Mid-term schedule released',message:'Exams begin October 14.',audience:'All',department:'All',date:'2026-09-30',priority:'High',status:'Published'}]},
    documents:{title:'📄 Documents',sub:'Add academic documents, circulars, records and upload file references.',add:'Add Document',cols:['Document ID','Title','Category','Department','Date','File','Status'],fields:[['id','Document ID','text','DOC001'],['title','Document Title','text','Academic Circular'],['category','Category','select','Circular','Circular|Department Record|Policy|Report|Other'],['department','Department','select','All','All|SOCI|SOET|SOANS|SOBM|SOH|SOHS'],['date','Document Date','date',''],['file','Upload File','file',''],['status','Status','select','Published','Draft|Published|Archived']],data:[{id:'DOC001',title:'Academic Calendar 2026-27',category:'Circular',department:'All',date:'2026-09-01',file:'academic-calendar.pdf',status:'Published'}]},
    reports:{title:'📈 Reports',sub:'Prepare report requests and export-ready report records for the backend.',add:'Create Report',cols:['Report ID','Report Type','Department','Period','Generated By','Status'],fields:[['id','Report ID','text','REP001'],['type','Report Type','select','Academic Performance','Academic Performance|Attendance|Fees|Faculty|Students|Department'],['department','Department','select','All','All|SOCI|SOET|SOANS|SOBM|SOH|SOHS'],['period','Period','text','September 2026'],['generatedBy','Generated By','text','Academic Dean'],['status','Status','select','Ready','Requested|Ready|Exported']],data:[{id:'REP001',type:'Academic Performance',department:'All',period:'September 2026',generatedBy:'Academic Dean',status:'Ready'}]},
    helpdesk:{title:'🎧 Helpdesk',sub:'Manage support requests, service issues and assistance for academic users.',add:'Add Support Request',cols:['Request ID','Requester','Category','Issue','Priority','Status'],fields:[['id','Request ID','text','HD001'],['requester','Requester','text','Academic User'],['category','Category','select','Technical','Technical|Academic|Fees|Account|Other'],['issue','Issue','text','Describe the support request'],['priority','Priority','select','Normal','Low|Normal|High|Urgent'],['status','Status','select','Open','Open|In Progress|Resolved|Closed']],data:[{id:'HD001',requester:'Academic User',category:'Technical',issue:'Dashboard assistance request',priority:'Normal',status:'Open'}]},
    settings:{title:'⚙️ Settings',sub:'Manage academic configuration values that can later be connected to the backend.',add:'Add Setting',cols:['Setting Key','Value','Category','Status'],fields:[['key','Setting Key','text','attendance.minimum'],['value','Value','text','75'],['category','Category','select','Academic','Academic|Fees|Notifications|Security|General'],['status','Status','select','Active','Active|Inactive']],data:[{key:'attendance.minimum',value:'75',category:'Academic',status:'Active'},{key:'academic.year',value:'2026-27',category:'Academic',status:'Active'}]}
  };
  // Make mutable copies so the frontend can add/edit/delete records without touching config defaults.
  Object.keys(configs).forEach(k=>configs[k].data=configs[k].data.map(x=>({...x})));

  function escape(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function statusHtml(v){let cls=String(v).toLowerCase().includes('active')||v==='Published'||v==='Paid'||v==='Ready'||v==='Present'?'erp-active':String(v).toLowerCase().includes('pending')||v==='Partial'||v==='Requested'||v==='Draft'?'erp-pending':'erp-inactive';return '<span class="erp-status '+cls+'">'+escape(v)+'</span>';}
  function display(rec,key){if(key==='balance') return Math.max(0,Number(rec.amount||0)-Number(rec.paid||0)); return rec[key]??'';}
  function open(section, fromHistory=false){current=section;editIndex=-1;const c=configs[section];if(!c)return;
    const panelIsOpen=panel.classList.contains('open');
    if(!fromHistory){
      if(!panelIsOpen){
        history.pushState({...history.state, deanERP:true, erpSection:section},'',location.href);
      }else{
        history.replaceState({...history.state, deanERP:true, erpSection:section},'',location.href);
      }
    } $('erpTitle').textContent=c.title;$('erpSubtitle').textContent=c.sub;$('erpAdd').textContent='＋ '+c.add; search.value=''; render();panel.classList.add('open');panel.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
   window.openERPSection=function(section,q='',fromHistory=false){
     open(section,fromHistory);
     if(q){ search.value=q; render(); }
     search.focus();
   };
   window.openERPSearch=function(q=''){
     const sections=Object.keys(configs);
     const lower=String(q).toLowerCase();
     for(const section of sections){
       if(configs[section].data.some(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(lower)))){
         window.openERPSection(section,q);
         return;
       }
     }
     window.openERPSection('students',q);
   };
  function close(){panel.classList.remove('open');panel.setAttribute('aria-hidden','true');closeForm();document.body.style.overflow='';}
  function closeWithHistory(){
    if(history.state && history.state.deanERP){ history.back(); }
    else close();
  }
  if(!history.state || !history.state.deanDashboard){
    history.replaceState({...history.state, deanDashboard:true},'',location.href);
  }
  window.addEventListener('popstate',()=>{
    if(history.state && history.state.deanERP && history.state.erpSection){
      open(history.state.erpSection,true);
    }else{
      close();
    }
  });
  function render(){const c=configs[current];const q=search.value.trim().toLowerCase();let rows=c.data.map((r,i)=>({r,i})).filter(x=>!q||Object.values(x.r).some(v=>String(v).toLowerCase().includes(q)));$('erpCount').textContent=rows.length;thead.innerHTML='<tr>'+c.cols.map(x=>'<th>'+x+'</th>').join('')+'<th>Actions</th></tr>';tbody.innerHTML=rows.length?rows.map(({r,i})=>'<tr>'+c.cols.map((col,j)=>{const key=fieldKey(current,j);let v=display(r,key);if(['status','present'].includes(key))v=statusHtml(v);return '<td>'+v+'</td>'}).join('')+'<td><button class="erp-action erp-edit" data-edit="'+i+'">✎ Edit</button><button class="erp-action erp-delete" data-delete="'+i+'">🗑 Delete</button></td></tr>').join(''):'<tr><td colspan="'+(c.cols.length+1)+'"><div class="erp-empty"><strong>No records found</strong>Use “Add Record” to enter data.</div></td></tr>';}
  function fieldKey(section,index){const map={departments:['id','name','head','faculty','students','status'],faculty:['id','name','department','designation','email','phone','status'],students:['id','name','department','year','section','email','status'],fees:['id','studentId','studentName','feeType','amount','paid','balance','status'],timetable:['day','time','department','year','subject','faculty','room'],exams:['id','type','department','subject','date','time','room','status'],attendance:['date','personId','name','department','subject','present','percentage'],announcements:['title','audience','department','date','priority','status'],documents:['id','title','category','department','date','file','status'],reports:['id','type','department','period','generatedBy','status'],helpdesk:['id','requester','category','issue','priority','status'],settings:['key','value','category','status']};return map[section][index];}
  function closeForm(){formModal.classList.remove('open');formModal.setAttribute('aria-hidden','true');}
  function openForm(index=-1){editIndex=index;const c=configs[current];$('erpFormTitle').textContent=index<0?c.add:'Edit '+c.add.replace(/^Add /,'');fields.innerHTML=c.fields.map(f=>{const [key,label,type,placeholder,opts]=f;const val=index<0?'':display(c.data[index],key);if(type==='select')return '<label>'+label+'<select name="'+key+'">'+opts.split('|').map(o=>'<option '+(o===val?'selected':'')+'>'+escape(o)+'</option>').join('')+'</select></label>';if(type==='textarea')return '<label class="erp-full">'+label+'<textarea name="'+key+'" placeholder="'+escape(placeholder||'')+'">'+escape(val)+'</textarea></label>';if(type==='file')return '<label>'+label+'<input class="erp-file" name="'+key+'" type="file">'+(val?'<small>Current: '+escape(val)+'</small>':'')+'</label>';return '<label>'+label+'<input name="'+key+'" type="'+type+'" value="'+escape(val)+'" placeholder="'+escape(placeholder||'')+'" '+(key==='percentage'?'min="0" max="100"':'')+'></label>';}).join('');formModal.classList.add('open');formModal.setAttribute('aria-hidden','false');}
  $('erpAdd').onclick=()=>openForm();$('erpClose').onclick=closeWithHistory;$('erpFormClose').onclick=closeForm;$('erpCancel').onclick=closeForm;search.oninput=render;
  tbody.addEventListener('click',e=>{const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');if(edit)openForm(Number(edit.dataset.edit));if(del){const i=Number(del.dataset.delete);if(confirm('Delete this record?')){configs[current].data.splice(i,1);render();}}});
  $('erpForm').addEventListener('submit',e=>{e.preventDefault();const c=configs[current],fd=new FormData(e.target),item={};c.fields.forEach(f=>{const key=f[0],type=f[2];let v=fd.get(key);if(type==='file'){const file=e.target.elements[key]?.files?.[0];v=file?file.name:(editIndex>=0?c.data[editIndex][key]:'');}item[key]=v;});if(['departments','faculty','students','fees','attendance'].includes(current)){['faculty','students','amount','paid','percentage'].forEach(k=>{if(k in item)item[k]=Number(item[k]||0);});}if(current==='fees'&&(!item.status||item.status===''))item.status='Pending';if(editIndex<0)c.data.push(item);else c.data[editIndex]=item;closeForm();render();});
  document.addEventListener('click',e=>{const link=e.target.closest('.menu a[data-section]');if(link&&configs[link.dataset.section]){e.preventDefault();e.stopPropagation();document.querySelectorAll('.menu a').forEach(a=>a.classList.remove('active'));link.classList.add('active');open(link.dataset.section);if(innerWidth<=900)$('sidebar').classList.remove('open');}} ,true);
  document.addEventListener('click',e=>{const card=e.target.closest('.story-card');if(card){const id=card.id;if(configs[id])open(id);}});
  panel.addEventListener('click',e=>{if(e.target===panel)close();});formModal.addEventListener('click',e=>{if(e.target===formModal)closeForm();});document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeForm();closeWithHistory();}});
})();

/* ---------- JS PART 4: script block 4 ---------- */
(function(){
  const btn=document.getElementById('notificationBtn');
  const box=document.getElementById('notificationPanel');
  const close=document.getElementById('notificationClose');
  function openNotifications(){
    box?.classList.add('open');
    box?.setAttribute('aria-hidden','false');
  }
  function closeNotifications(){
    box?.classList.remove('open');
    box?.setAttribute('aria-hidden','true');
  }
  btn?.addEventListener('click',e=>{e.stopPropagation();openNotifications();});
  close?.addEventListener('click',closeNotifications);
  document.addEventListener('click',e=>{
    if(box?.classList.contains('open') && !box.contains(e.target) && e.target!==btn) closeNotifications();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNotifications();});
  document.querySelectorAll('.notification-item').forEach(item=>{
    item.addEventListener('click',()=>{
      const section=item.dataset.notification;
      closeNotifications();
      if(typeof window.openERPSection==='function') window.openERPSection(section);
    });
  });
})();

/* ---------- JS PART 5: script block 5 ---------- */
function openChangePassword(){
  const modal=document.getElementById('passwordModal');
  const form=document.getElementById('changePasswordForm');
  const msg=document.getElementById('passwordMessage');
  if(form) form.reset();
  if(msg) msg.textContent='';
  if(modal){modal.classList.add('open');modal.setAttribute('aria-hidden','false');setTimeout(()=>document.getElementById('currentPassword')?.focus(),80)}
}
function closeChangePassword(){
  const modal=document.getElementById('passwordModal');
  if(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}
}
function saveNewPassword(e){
  e.preventDefault();
  const current=document.getElementById('currentPassword')?.value||'';
  const next=document.getElementById('newPassword')?.value||'';
  const confirm=document.getElementById('confirmPassword')?.value||'';
  const msg=document.getElementById('passwordMessage');
  if(!current){msg.textContent='Please enter your current password.';return;}
  if(next.length<6){msg.textContent='New password must contain at least 6 characters.';return;}
  if(next!==confirm){msg.textContent='New password and confirmation do not match.';return;}
  try{sessionStorage.setItem('deanPasswordUpdated','true')}catch(err){}
  msg.style.color='#23703a';
  msg.textContent='Password updated successfully.';
  setTimeout(()=>{msg.style.color='';closeChangePassword()},900);
}
function openUserProfile(){document.getElementById('profileModal')?.classList.add('open')}
function closeUserProfile(){document.getElementById('profileModal')?.classList.remove('open')}
function logout() {
    sessionStorage.removeItem('erpUser');
    window.location.href = 'INDEX.html';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeUserProfile();closeChangePassword()}});
document.getElementById('profileModal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeUserProfile()});
document.getElementById('passwordModal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeChangePassword()});
document.querySelector('.student-profile')?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openUserProfile();}});

/* ---------- JS PART 6: script block 6 ---------- */
// Frontend-only session guard: the backend can replace this with real auth later.
(function(){
  try{
    const raw=sessionStorage.getItem('erpUser');
    if(raw) document.documentElement.dataset.erpSession='active';
  }catch(e){}
})();

/* ---------- JS PART 7: script block 7 ---------- */
/* Three expandable menu groups */
document.querySelectorAll('.menu-group-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    const group = btn.dataset.menuGroup;
    const panel = document.getElementById('menu-' + group);
    const isOpen = panel.classList.contains('open');

    document.querySelectorAll('.menu-group-btn').forEach(function(other){
      other.classList.remove('open');
      other.setAttribute('aria-expanded','false');
    });
    document.querySelectorAll('.menu-submenu').forEach(function(other){
      other.classList.remove('open');
    });

    if(!isOpen){
      btn.classList.add('open');
      btn.setAttribute('aria-expanded','true');
      panel.classList.add('open');
    }
  });
});

/* Close submenu when a submenu action is selected on small screens. */
document.querySelectorAll('.menu-submenu a').forEach(function(link){
  link.addEventListener('click', function(){
    document.querySelectorAll('.menu-submenu a').forEach(function(a){a.classList.remove('active')});
    if(link.dataset.section) link.classList.add('active');
    if(window.innerWidth <= 900){
      document.querySelectorAll('.menu-submenu').forEach(function(p){p.classList.remove('open')});
      document.querySelectorAll('.menu-group-btn').forEach(function(b){
        b.classList.remove('open');
        b.setAttribute('aria-expanded','false');
      });
    }
  });
});

/* ---------- JS PART 8: script block 8 ---------- */
(function(){
  const input=document.getElementById('dashboardSearch');
  if(!input) return;
  input.addEventListener('input',function(){
    const q=this.value.trim().toLowerCase();
    const targets=[
      ...document.querySelectorAll('.dean-story-row .story-card'),
      ...document.querySelectorAll('.dashboard-grid > .card'),
      ...document.querySelectorAll('.dean-info-panels > .card')
    ];
    targets.forEach(el=>{
      const match=!q || el.textContent.toLowerCase().includes(q);
      el.style.display=match?'':'none';
    });
  });
})();

