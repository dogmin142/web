const TOTAL=30, LIMIT=30*60*1000, MAX_ATTEMPTS=3;
const bank=Array.from({length:TOTAL},(_,i)=>{
  const a=i+2,b=(i%7)+2;
  const correct=a+b;
  return {id:i+1,q:`Cho $x=${a}$ và $y=${b}$. Giá trị của $x+y$ là?`,opts:[correct,correct+1,correct-1,a*b],ans:0};
});
let tick=null;
const $=id=>document.getElementById(id);
function show(id){['login','dash','quiz','summary','result'].forEach(x=>$(x).classList.toggle('hidden',x!==id))}
function user(){return localStorage.getItem('mqUser')||''}
function stateKey(){return 'mqState:'+user()}
function attemptKey(){return 'mqAttempt:'+user()}
function getState(){try{return JSON.parse(localStorage.getItem(stateKey()))||{attempts:0,best:null,history:[]}}catch{return{attempts:0,best:null,history:[]}}}
function saveState(s){localStorage.setItem(stateKey(),JSON.stringify(s))}
function getAttempt(){try{return JSON.parse(localStorage.getItem(attemptKey()))}catch{return null}}
function saveAttempt(a){localStorage.setItem(attemptKey(),JSON.stringify(a))}
function clearAttempt(){localStorage.removeItem(attemptKey())}
function login(){
  const id=$('studentId').value.trim(),p=$('pw').value;
  if(!/^[A-Za-z0-9._-]{3,30}$/.test(id)||p.length<6){$('loginErr').textContent='MSSV hoặc mật khẩu chưa hợp lệ.';return}
  localStorage.setItem('mqUser',id);$('loginErr').textContent='';renderDash();show('dash');
}
function logout(){clearInterval(tick);localStorage.removeItem('mqUser');$('headerUser').textContent='';$('pw').value='';show('login')}
function renderDash(){
  const s=getState(),a=getAttempt();$('headerUser').textContent=user();$('who').textContent=user();$('attempts').textContent=s.attempts+'/'+MAX_ATTEMPTS;$('best').textContent=s.best==null?'—':s.best+'/'+TOTAL;
  $('startBtn').disabled=s.attempts>=MAX_ATTEMPTS||!!a;$('startBtn').textContent=s.attempts>=MAX_ATTEMPTS?'Đã dùng hết số lần làm':'Bắt đầu lần làm mới';
  $('resumeBtn').classList.toggle('hidden',!a);
}
function startQuiz(){
  const s=getState();if(s.attempts>=MAX_ATTEMPTS||getAttempt())return;
  const now=Date.now(),a={attemptNo:s.attempts+1,current:0,answers:Array(TOTAL).fill(null),flags:Array(TOTAL).fill(false),startedAt:now,deadline:now+LIMIT};
  saveAttempt(a);openAttempt();
}
function resumeQuiz(){if(getAttempt())openAttempt()}
function openAttempt(){clearInterval(tick);tick=setInterval(updateTimer,1000);renderQuestion();updateTimer();show('quiz')}
function renderQuestion(){
  const a=getAttempt();if(!a){renderDash();show('dash');return}
  const i=a.current,q=bank[i];$('qNumber').textContent='Câu '+(i+1);$('qStatus').textContent=a.answers[i]==null?'Chưa trả lời':'Đã trả lời';
  $('qPrompt').innerHTML=q.q;$('flagBtn').classList.toggle('active',a.flags[i]);$('flagBtn').textContent=a.flags[i]?'⚑ Bỏ đánh dấu':'⚑ Đánh dấu câu hỏi';
  $('qOptions').innerHTML=q.opts.map((o,j)=>`<label><input type="radio" name="answer" value="${j}" ${a.answers[i]===j?'checked':''}> <span>${o}</span></label>`).join('');
  document.querySelectorAll('input[name=answer]').forEach(el=>el.addEventListener('change',e=>{const x=getAttempt();x.answers[x.current]=Number(e.target.value);saveAttempt(x);renderNav();$('qStatus').textContent='Đã trả lời'}));
  $('prevBtn').disabled=i===0;$('nextBtn').textContent=i===TOTAL-1?'Kết thúc lần làm bài…':'Trang tiếp theo';renderNav();history.replaceState(null,'','#q'+(i+1));
  window.MathJax?.typesetPromise?.();
}
function renderNav(){
  const a=getAttempt();if(!a)return;$('navGrid').innerHTML=Array.from({length:TOTAL},(_,i)=>`<button class="navq ${i===a.current?'current':''} ${a.answers[i]!=null?'answered':''} ${a.flags[i]?'flagged':''}" onclick="goQuestion(${i})" aria-label="Câu ${i+1}">${i+1}</button>`).join('');
}
function goQuestion(i){const a=getAttempt();if(!a)return;a.current=i;saveAttempt(a);renderQuestion();show('quiz');window.scrollTo({top:0,behavior:'smooth'})}
function goPrev(){const a=getAttempt();if(a&&a.current>0)goQuestion(a.current-1)}
function goNext(){const a=getAttempt();if(!a)return;if(a.current<TOTAL-1)goQuestion(a.current+1);else showSummary()}
function toggleFlag(){const a=getAttempt();if(!a)return;a.flags[a.current]=!a.flags[a.current];saveAttempt(a);renderQuestion()}
function showSummary(){
  const a=getAttempt();if(!a)return;clearInterval(tick);
  $('summaryRows').innerHTML=a.answers.map((ans,i)=>`<tr><td><a href="#q${i+1}" onclick="goQuestion(${i});return false">Câu ${i+1}</a>${a.flags[i]?' ⚑':''}</td><td>${ans==null?'Chưa trả lời':'Đã lưu câu trả lời'}</td></tr>`).join('');
  show('summary');updateTimer();tick=setInterval(updateTimer,1000);
}
function returnToAttempt(){renderQuestion();show('quiz')}
function askSubmit(){const d=$('submitDialog');if(d.showModal)d.showModal();else if(confirm('Nộp tất cả và kết thúc?'))finalize(false)}
function finalSubmit(e){e?.preventDefault();$('submitDialog').close();finalize(false)}
function finalize(auto){
  const a=getAttempt();if(!a)return;clearInterval(tick);let pts=0;a.answers.forEach((v,i)=>{if(v===bank[i].ans)pts++});
  const s=getState();s.attempts++;s.best=Math.max(s.best??0,pts);s.history=s.history||[];s.history.push({attempt:s.attempts,score:pts,submittedAt:Date.now(),auto});saveState(s);clearAttempt();
  $('score').textContent=pts+'/'+TOTAL;$('summaryText').textContent=(auto?'Hết giờ — bài đã được nộp tự động. ':'')+'Điểm cao nhất hiện tại: '+s.best+'/'+TOTAL+' • Đã dùng '+s.attempts+'/'+MAX_ATTEMPTS+' lượt.';show('result');history.replaceState(null,'','#result');
}
function updateTimer(){
  const a=getAttempt();if(!a)return;const d=Math.max(0,a.deadline-Date.now()),m=Math.floor(d/60000),s=Math.floor((d%60000)/1000);$('timer').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');if(d<=0)finalize(true);
}
function backDash(){renderDash();show('dash');history.replaceState(null,'',location.pathname)}
window.addEventListener('beforeunload',()=>clearInterval(tick));
if(user()){renderDash();show('dash')}else show('login');
