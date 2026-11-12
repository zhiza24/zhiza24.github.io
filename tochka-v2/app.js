'use strict';
const root=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const A=Object.fromEntries(DATA.questions.filter(q=>q.id.startsWith('A')).map(q=>[q.id,q]));
const B=Object.fromEntries(DATA.questions.filter(q=>q.id.startsWith('B')).map(q=>[q.id,q]));
const C=Object.fromEntries(DATA.questions.filter(q=>q.id.startsWith('C')).map(q=>[q.id,q]));
const V={
 V01:{q:'Вспомните недавнюю ситуацию, после которой осталось ощущение «{phrase}». Что это была за ситуация?',options:['Работа или деньги','Отношения или семья','Дружба или общение','Мое отношение к себе','Другое','Не могу вспомнить такого случая']},
 V02:{q:'А теперь вспомните другую сферу жизни. Было ли там за последние месяцы похожее ощущение?',options:['Да, и довольно часто','Да, но один-два раза','Нет, это бывает только в одной сфере','Нет, в другой сфере все иначе','Не могу сказать']},
 V03:{q:'Когда в похожей ситуации все складывалось иначе, Вы могли это заметить и принять?',options:['Да, это меняло мое ощущение','Да, но хорошее быстро забывалось','Мне было трудно поверить, что все хорошо','Таких ситуаций не помню','В действительности ситуация была неблагоприятной']},
 V04:{q:'Как Вы обычно понимаете, что это ощущение связано именно с происходящим, а не с первой догадкой?',options:['Сверяю вывод с конкретными фактами','Уточняю у человека, если это уместно','Чаще просто чувствую, что все именно так','Сначала уверена, потом могу усомниться','В некоторых ситуациях есть прямые доказательства']},
 V05:{q:'Когда Вы поступаете так: «{bHuman}», к чему это чаще приводит?',options:['Становится легче, и вопрос решается','Ненадолго легче, а потом все повторяется','Я устаю, злюсь или отдаляюсь','По-разному; зависит от ситуации','На самом деле я так почти не поступаю']},
 V06:{q:'А какой из двух способов Вам действительно более знаком в сложных ситуациях?',options:['{b1}','{b2}','Оба, но в разных обстоятельствах','Ни один']}
};
const bHuman={B1:'стараюсь сделать больше, чтобы подтвердить свою ценность',B2:'пытаюсь понять ожидания других и подстроиться',B3:'проверяю детали и стараюсь все проконтролировать',B4:'отступаю, чтобы не столкнуться с отказом или критикой',B5:'беру на себя чужие задачи и ответственность',B6:'начинаю бороться и защищать свою позицию',B7:'откладываю решение, пока не станет яснее',B8:'уточняю факты и выбираю посильное действие'};
const Aphrase=Object.fromEntries(Object.entries(DATA.codesA).map(([k,v])=>[k,v.phrase]));
const state={answers:{},period:null,queue:[],pos:0,selected:[],free:''};
function add(q){state.queue.push(q)}
function qObj(id,q,options,type='single',extra={}){return {id,q,options:options.map(x=>typeof x==='string'?{text:x,code:null}:x),type,...extra}}
function start(){state.answers={};state.queue=[];state.pos=0;state.period=null;
 add(qObj('PERIOD','На какой период Вы будете опираться, отвечая на вопросы?',['Последние 2–3 месяца','Последний год','Сейчас сложный период; отвечу про то, что происходит чаще всего','Не уверена/не уверен']));
 DATA.questions.filter(q=>q.id.startsWith('A')).forEach(q=>add(qObj(q.id,q.q,q.options,q.type)));
 DATA.questions.filter(q=>q.id.startsWith('B')).forEach(q=>add(qObj(q.id,q.q,q.options)));
 DATA.questions.filter(q=>q.id.startsWith('C')).forEach(q=>add(qObj(q.id,q.q,q.options)));
 state.queue.push({id:'PHASE2',type:'phase2'});
}
function sum(prefix){const out={};for(let i=1;i<=(prefix==='A'?12:prefix==='B'?8:4);i++)out[prefix+i]=0;
 for(const [id,val] of Object.entries(state.answers)){if(!id.startsWith(prefix)||id==='A12')continue;const q=A[id]||B[id]||C[id];if(!q)continue;
  if(id==='A11'){(val||[]).forEach((idx,k)=>{const code=q.options[idx]?.code;if(code&&code!=='0')out[code]+= [3,2,1][k]||0});}
  else {const code=q.options[val]?.code;if(code&&code!=='0'&&out[code]!==undefined)out[code]++;}
 }return out;}
function ranked(scores){return Object.keys(scores).filter(k=>scores[k]>0).sort((a,b)=>scores[b]-scores[a]||a.localeCompare(b,'en',{numeric:true}));}
function nextPhase(){const sa=sum('A'),sb=sum('B');state.aRank=ranked(sa).slice(0,2);state.bRank=ranked(sb).slice(0,2);state.vCandidates=[];
 state.aRank.forEach((code,i)=>{
  const phrase=Aphrase[code]||code;
  add(qObj('V01_'+code,V.V01.q.replace('{phrase}',phrase),V.V01.options));
  add(qObj('V02_'+code,V.V02.q,V.V02.options));
 });
 if(state.aRank[0]){add(qObj('V03',V.V03.q,V.V03.options));add(qObj('V04',V.V04.q,V.V04.options));}
 if(state.bRank[0])add(qObj('V05',V.V05.q.replace('{описание B без ярлыка}',bHuman[state.bRank[0]]),V.V05.options));
 if(state.bRank.length>1)add(qObj('V06',V.V06.q,V.V06.options.map((x,i)=>i===0?bHuman[state.bRank[0]]:i===1?bHuman[state.bRank[1]]:x)));
 add(qObj('FREE','Если описать знакомый внутренний финал одной своей фразой, как бы она звучала?',['Написать свою фразу'], 'text'));
 state.queue.push({id:'BRANCH',type:'branch'});
}
function getAStatus(code){const qscore=sum('A'),sit={};for(let i=1;i<=12;i++)sit['A'+i]=0;
 for(let i=1;i<=10;i++){const id='A'+String(i).padStart(2,'0'),v=state.answers[id];if(v==null)continue;const c=A[id].options[v]?.code;if(c)sit[c]=(sit[c]||0)+1;}
 const a11=state.answers.A11||[];const has=a11.some(i=>A.A11.options[i]?.code===code);const r=state.answers.A12;const R=r==null?null:Number(A.A12.options[r]?.code?.slice(1));
 const v01=state.answers['V01_'+code],v02=state.answers['V02_'+code];const recalled=v01!=null&&v01!==5;const cross=v02===0?2:v02===1?1:0;
 const skips=Array.from({length:10},(_,i)=>state.answers['A'+String(i+1).padStart(2,'0')]).filter(x=>x==null).length;
 if(skips>4||!recalled||R===0&&cross<1)return 'unclear';
 if((qscore[code]||0)>=4&&(sit[code]||0)>=2&&has&&R>=2&&cross>=1)return 'supported';
 if((qscore[code]||0)>=3&&(has||cross>=1))return 'tentative';return 'unclear';}
function branchChoice(){const code=state.aRank[0];const status=code?getAStatus(code):'unclear';return status==='supported'||status==='tentative'?code:'U';}
function insertBranch(){const branch=branchChoice();const spec=DATA.P[branch]||DATA.P.U;spec.items.forEach((item,i)=>add(qObj('P'+(i+1),item.q,item.options)));}
function draw(){const q=state.queue[state.pos];if(!q){renderResult();return;}
 if(q.type==='phase2'){state.queue.splice(state.pos,1);nextPhase();draw();return;}
 if(q.type==='branch'){insertBranch();state.queue.splice(state.pos,1);draw();return;}
 const total=state.queue.length;const progress=Math.min(100,Math.round((state.pos/total)*100));
 if(q.type==='text'){root.innerHTML=`<section class="screen"><header><span>ТОЧКА ОТСЧЕТА</span><span>${progress}%</span></header><div class="progress"><i style="width:${progress}%"></i></div><main class="question"><div class="eyebrow">ЛИЧНОЕ УТОЧНЕНИЕ · НЕОБЯЗАТЕЛЬНО</div><h1>${esc(q.q)}</h1><textarea id="free" placeholder="Ваша формулировка" maxlength="500">${esc(state.free)}</textarea><div class="actions"><button class="secondary" id="skip">Пропустить</button><button id="next">Продолжить</button></div></main></section>`;
  document.getElementById('free').oninput=e=>state.free=e.target.value;document.getElementById('skip').onclick=()=>advance();document.getElementById('next').onclick=()=>{state.free=document.getElementById('free').value;advance()};return;}
 const rank=q.type==='rank',multi=rank;const selected=state.answers[q.id]??(multi?[]:null);
 root.innerHTML=`<section class="screen"><header><span>МАЙЯ ЯВЬ · АРХИТЕКТУРА ЛИЧНОСТИ</span><span>${progress}%</span></header><div class="progress"><i style="width:${progress}%"></i></div><main class="question"><div class="eyebrow">${sectionLabel(q.id)}</div><h1>${esc(q.q)}</h1>${rank?'<p class="hint">Выберите до трех вариантов. Первым отметьте наиболее знакомый.</p>':''}<div class="options">${q.options.map((o,i)=>{const on=multi?selected.includes(i):selected===i;return `<button class="option ${on?'on':''}" data-i="${i}"><span class="dot">${on?'✓':''}</span><span>${esc(o.text)}</span></button>`}).join('')}</div><div class="actions"><button class="secondary" id="back" ${state.pos===0?'disabled':''}>Назад</button><button id="next" ${selected==null||(multi&&!selected.length)?'disabled':''}>Далее</button></div><button class="skip" id="skip">Пропустить вопрос</button></main></section>`;
 root.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.i;if(multi){let arr=[...selected];if(i===q.options.findIndex(o=>o.code==='0'))arr=[i];else {arr=arr.filter(x=>x!==q.options.findIndex(o=>o.code==='0'));arr=arr.includes(i)?arr.filter(x=>x!==i):arr.length<3?[...arr,i]:arr;}state.answers[q.id]=arr;}else state.answers[q.id]=i;draw();});
 document.getElementById('back').onclick=()=>{if(state.pos>0){state.pos--;draw()}};document.getElementById('skip').onclick=()=>advance();document.getElementById('next').onclick=()=>advance();
}
function sectionLabel(id){if(id.startsWith('A'))return 'ЛИНИЯ А · ПОВТОРЯЮЩИЙСЯ ЭМОЦИОНАЛЬНЫЙ ФИНАЛ';if(id.startsWith('B'))return 'ЛИНИЯ Б · ПРИВЫЧНЫЕ РЕАКЦИИ';if(id.startsWith('C'))return 'ЛИНИЯ В · РЕЖИМ ВЗАИМОДЕЙСТВИЯ';if(id.startsWith('V'))return 'ПРОВЕРКА ГИПОТЕЗ';if(id.startsWith('P'))return 'ТОЧКА ПЕРЕКЛЮЧЕНИЯ';if(id.startsWith('D'))return 'ЖЕЛАЕМОЕ СОСТОЯНИЕ';return 'НАСТРОЙКА ИССЛЕДОВАНИЯ';}
function advance(){state.pos++;if(state.pos>=state.queue.length){if(!state._dAdded){state._dAdded=true;DATA.D.forEach(q=>add(qObj(q.id,q.q,q.options)));}else {renderResult();return;}}draw();}
function renderResult(){
 const sa=sum('A'),sb=sum('B'),sc=sum('C');const ar=ranked(sa),br=ranked(sb);const a=ar[0],a2=ar[1],b=br[0],b2=br[1];let aStatus=a?getAStatus(a):'unclear';
 if(a&&a2&&sa[a]-sa[a2]<=1&&sa[a]>=3&&sa[a2]>=3){const x=state.answers['V02_'+a],y=state.answers['V02_'+a2];if((x===0||x===1)&&(y===0||y===1))aStatus='mixed';}
 const v05=state.answers.V05,v06=state.answers.V06;let adj={...sb};if(b&&b2&&v06!=null){if(v06===0)adj[b]+=2;else if(v06===1)adj[b2]+=2;else if(v06===2){adj[b]++;adj[b2]++;}else if(v06===3){adj[b]-=2;adj[b2]-=2;}}
 const bRank=Object.keys(adj).filter(k=>adj[k]>0).sort((x,y)=>adj[y]-adj[x]||sb[y]-sb[x]);const bFinal=bRank[0],bFinal2=bRank[1];let bStatus='unclear';if(bFinal){if(bFinal2&&adj[bFinal]-adj[bFinal2]<=1&&adj[bFinal]>=3&&adj[bFinal2]>=3&&v06===2)bStatus='mixed';else if(adj[bFinal]>=3&&sb[bFinal]>=3&&v05!==4)bStatus='supported';else if(adj[bFinal]>=2)bStatus='tentative';}
 const cMax=Math.max(0,...Object.values(sc));const cTops=Object.keys(sc).filter(k=>sc[k]===cMax&&cMax>0);let mode='В разных ситуациях проявляются разные режимы',modeCode=null;if(sc.C4>=3)modeCode='C4';else if(cTops.length===1&&cMax>=3)modeCode=cTops[0];else if(cTops.length>1&&((cTops.includes('C1')&&cTops.includes('C2'))||(cTops.includes('C2')&&cTops.includes('C3')))&&sc.C4>=2)modeCode='C4';if(modeCode)mode=({C1:'Реактивный',C2:'Наблюдательный',C3:'Созидательный',C4:'Переходный'})[modeCode];
 const res=a&&aStatus!=='unclear'?DATA.results[a]:null;const aLabel=aStatus==='mixed'&&a2?`Два близких эмоциональных финала: ${DATA.codesA[a]?.name} и ${DATA.codesA[a2]?.name}`:(res?.heading||'Один устойчивый фоновый сценарий пока не выделился');const aText=aStatus==='mixed'&&a2?`В ответах близко проявились два состояния: «${Aphrase[a]}» и «${Aphrase[a2]}». Пока не стоит сводить их к одному объяснению. Посмотрите, в каких ситуациях появляется каждое из них.`:(res?.text||'Ваши ответы пока не дают достаточных оснований выделить один повторяющийся эмоциональный финал. Это не недостаток результата: возможно, реакции заметно зависят от обстоятельств и конкретной сферы жизни.');const point=res?.point||'Мне не обязательно иметь один скрытый сценарий, чтобы лучше понимать себя.';
 const bName=bFinal?DATA.codesB[bFinal]?.name:'Не выделился';const bNarrative=bFinal?DATA.scenarioTexts[bFinal]:'Пока нет достаточных данных, чтобы выделить устойчивый способ поддержания сценария.';const desired=DATA.D[0].options[state.answers.D01]||'Не выбрано';const d2=DATA.D[1].options[state.answers.D02]||'Не выбрано';const d3=DATA.D[2].options[state.answers.D03]||'Не выбрано';
 root.innerHTML=`<section class="screen result"><header><span>МАЙЯ ЯВЬ · ВАША КАРТА</span><button class="plain" id="restart">Начать заново</button></header><main class="resultbody"><div class="eyebrow">ТОЧКА ОТСЧЕТА</div><h1>${esc(aLabel)}</h1><p>${esc(aText)}</p>${state.answers.PERIOD===2?'<p class="periodnote">Вы отметили, что сейчас переживаете сложный период. Это могло повлиять на ответы, поэтому выводы стоит перепроверить позже.</p>':''}<div class="panel"><div class="eyebrow">ВОЗМОЖНЫЙ ПОДДЕРЖИВАЮЩИЙ СЦЕНАРИЙ · ${esc(bStatus==='supported'?'ПОДТВЕРЖДЕН В ОТВЕТАХ':bStatus==='tentative'?'ПРЕДПОЛОЖЕНИЕ':'НЕДОСТАТОЧНО ДАННЫХ')}</div><h2>${esc(bName)}</h2><p>${esc(bNarrative)}</p></div><div class="panel"><div class="eyebrow">ТЕКУЩИЙ РЕЖИМ</div><h2>${esc(mode)}</h2><p>${esc(DATA.modeTexts[modeCode]||'В разных обстоятельствах Вы используете разные способы реагировать. Сейчас нет оснований сводить их к одному режиму.')}</p></div><div class="panel accent"><div class="eyebrow">ВАША НОВАЯ ТОЧКА</div><h2>${esc(point)}</h2><p><b>Желаемое состояние:</b> ${esc(desired)}</p><p><b>Первый признак:</b> ${esc(d2)}</p><p><b>Шаг на ближайшие два дня:</b> ${esc(d3)}</p></div><div class="panel"><div class="eyebrow">ПРАКТИКА «ТОЧКА СБОРКИ»</div><p>Остановитесь на несколько секунд. Почувствуйте опору под ногами, обратите внимание на дыхание. Назовите то, что происходит: «Я замечаю мысль/чувство…» Затем спросите: «Что сейчас в моих силах? Какое действие соответствует состоянию, которое я выбрала?» Не нужно заставлять себя успокаиваться. Достаточно заметить выбор. Если дыхательные упражнения неприятны, просто посмотрите на предметы вокруг.</p></div><p class="disclaimer">Это авторский инструмент структурированной саморефлексии, а не диагностический или психометрически валидированный тест. Выводы — гипотезы для самостоятельной проверки.</p><div class="actions"><button id="copy">Скопировать карту</button><button class="secondary" id="restart2">Пройти еще раз</button></div></main></section>`;
 const plain=[aLabel,aText,'Поддерживающий сценарий: '+bName+' — '+bNarrative,'Режим: '+mode,'Новая точка: '+point,'Желаемое состояние: '+desired,'Первый признак: '+d2,'Шаг: '+d3,'\nЭто авторский инструмент саморефлексии, не диагностический тест.'].join('\n\n');
 document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(plain);document.getElementById('copy').textContent='Скопировано';}catch(e){document.getElementById('copy').textContent='Не удалось скопировать'}};
 document.getElementById('restart').onclick=()=>location.reload();document.getElementById('restart2').onclick=()=>location.reload();
}
function landing(){root.innerHTML=`<section class="screen landing"><div class="brand">МАЙЯ ЯВЬ <small>АВТОР СОСТОЯНИЙ</small></div><div class="orb"></div><div class="landingcopy"><div class="eyebrow">ЦИФРОВОЙ ПРАКТИКУМ</div><h1>ТОЧКА<br>ОТСЧЕТА</h1><p>Какое состояние возвращается в Вашу жизнь снова и снова?</p><p class="intro">Исследуйте повторяющийся эмоциональный финал, привычные реакции и возможность выбрать следующий ход.</p><button id="begin">Начать исследование <span>→</span></button><div class="footnote">Один вопрос на экран · Можно пропускать вопросы · Ответы остаются в этой вкладке</div></div></section>`;document.getElementById('begin').onclick=start;}
landing();