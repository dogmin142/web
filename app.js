const bank=Array.from({length:30},(_,i)=>{const a=i+2,b=i+3;return{q:`Cho $x=${a}$ và $y=${b}$. Giá trị của $x+y$ là?`,opts:[a+b,a+b+1,a+b-1,a*b],ans:0}});
let deadline,tick;
const $=id=>document.getElementById(id);
function show(id){['login','dash','quiz','result'].forEach(x=>$(x).classList.toggle('hidden',x!==id))}
function key(){return 'mqState:'+localStorage.getItem('mqUser')}
function state(){return JSON.parse(localStorage.getItem(key())||'{"attempts":0,"best":null}')}
function save(s){localStorage.setItem(key(),JSON.stringify(s))}
function login(){const id=$('studentId').value.trim(),p=$('pw').value;if(!/^[A-Za-z0-9._-]{3,30}$/.test(id)||p.length<6){$('loginErr').textContent='MSSV hoặc mật khẩu chưa hợp lệ.';return}localStorage.setItem('mqUser',id);renderDash();show('dash')}
function logout(){localStorage.removeItem('mqUser');$('pw').value='';show('login')}
function renderDash(){const s=state();$('who').textContent=localStorage.getItem('mqUser');$('attempts').textContent=s.attempts+'/3';$('best').textContent=s.best==null?'—':s.best+'/30';$('startBtn').disabled=s.attempts>=3}
function startQuiz(){const s=state();if(s.attempts>=3)return;$('questions').innerHTML=bank.map((q,i)=>`<div class="q"><b>Câu ${i+1}.</b> ${q.q}${q.opts.map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('')}</div>`).join('');$('progress').textContent='30 câu • Lần '+(s.attempts+1)+'/3';deadline=Date.now()+30*60*1000;clearInterval(tick);tick=setInterval(updateTimer,1000);updateTimer();show('quiz');window.MathJax?.typesetPromise()}
function updateTimer(){const d=Math.max(0,deadline-Date.now()),m=Math.floor(d/60000),s=Math.floor(d%60000/1000);$('timer').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');if(!d)submitQuiz()}
function submitQuiz(e){e?.preventDefault();clearInterval(tick);let pts=0;bank.forEach((q,i)=>{const a=document.querySelector(`input[name=q${i}]:checked`);if(a&&+a.value===q.ans)pts++});const s=state();s.attempts++;s.best=Math.max(s.best??0,pts);save(s);$('score').textContent=pts+'/30';$('summary').textContent='Điểm cao nhất: '+s.best+'/30 • Đã dùng '+s.attempts+'/3 lượt.';show('result')}
function backDash(){renderDash();show('dash')}
if(localStorage.getItem('mqUser')){renderDash();show('dash')}else show('login');