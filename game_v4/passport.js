/* Расчетные слои не зависят от ответов игрока. */
(function (root) {
'use strict';
const D=root.GPassportData;
function sum(n){return String(Math.abs(n)).split('').reduce((s,c)=>s+Number(c),0)}
function red(n){while(n>22)n=sum(n);return n}
function parse(birth){
 const m=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(birth||'');if(!m)return null;
 const day=+m[1],month=+m[2],year=+m[3],date=new Date(year,month-1,day);
 if(year<1920||year>new Date().getFullYear()||date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day||date>new Date())return null;
 return {day,month,year,raw:m[1]+m[2]+m[3]};
}
function counts(raw){const out={};for(let i=1;i<=9;i++)out[i]=0;for(const c of raw)if(c>='1'&&c<='9')out[c]++;return out}
function directionLevel(n){return n===0?'0':n===1?'1':n<=3?'2-3':n<=5?'4-5':'6+'}
function calculate(birth){
 const p=parse(birth);if(!p)return null;
 const A=red(p.day),C=p.month,E=red(sum(p.year)),G=red(A+C+E);
 const positions={A,B:red(A+C),C,D:red(C+E),E,F:red(E+G),G,H:red(G+A),I:red(A+C+E+G)};
 const first=sum(p.raw),second=sum(first),third=first-2*Number(String(p.day)[0]),fourth=sum(third);
 const raw=counts(p.raw),working=[first,second,third,fourth],pythagoras=counts(p.raw+working.join(''));
 const directions=D.directions.map(d=>{const count=d.cells.reduce((n,i)=>n+raw[i],0);return {id:d.id,count,level:directionLevel(count)}});
 return {version:D.version,birth,method:D.method,positions,rawDigits:raw,workingNumbers:working,pythagoras,directions};
}
function hypotheses(layers){return D.themes.map(t=>{
 const p=t.pythagoras.filter(n=>layers.pythagoras[n]>0),d=t.directions.filter(id=>layers.directions.find(x=>x.id===id&&x.count>0));
 const a=Object.entries(layers.positions).filter(([position,id])=>t.arcana.some(x=>x.id===id&&x.positions.includes(position))).map(([position,id])=>({position,id}));
 // Здесь поддержка — наличие маркера (0/1), не оценка личности и не полюс темы.
 const numeric=Math.min(1.5,(p.length?1:0)+(d.length?.5:0)),archetypal=a.length?1:0;
 return {id:t.id,status:'new',pole:'neutral',sources:{pythagoras:p,directions:d,arcana:a},numericWeight:numeric,archetypalWeight:archetypal,weight:numeric+archetypal,normalizedSupport:(numeric+archetypal)/2.5,independentGroups:(numeric?1:0)+(archetypal?1:0)};
})}
function load(){try{return JSON.parse(localStorage.getItem('alch_profile'))||{}}catch(e){return {}}}
function ensure(P){P=P||load();const layers=calculate(P.birth);if(!layers)return null;
 if(!P.passport||P.passport.birth!==P.birth||P.passport.version!==D.version){
  if(P.passport){P.passportHistory=P.passportHistory||[];P.passportHistory.push(JSON.parse(JSON.stringify(P.passport)))}
  P.passport={version:D.version,birth:P.birth,createdAt:Date.now(),layers,answers:{},history:[],hypotheses:hypotheses(layers)};
  localStorage.setItem('alch_profile',JSON.stringify(P));
 }
 return P.passport;
}
function answer(key,value,note){
 if(!['yes','partly','no','unknown'].includes(value))throw Error('Invalid answer');
 const P=load(),passport=ensure(P);if(!passport)return null;
 const record={choice:value,note:String(note||''),at:Date.now(),question:key};passport.answers[key]=record;passport.history.push({key,...record});
 if(key.startsWith('theme:')){const h=passport.hypotheses.find(x=>x.id===key.slice(6));if(h)h.status={yes:'confirmed',partly:'checking',no:'revised',unknown:'ambiguous'}[value]}
 P.diary=P.diary||{ins:[],q:[]};P.diary.ins=P.diary.ins||[];
 const kind=key.split(':')[0],id=key.split(':')[1];
 let label='';if(kind==='position'){const position=D.positions.find(p=>p.id===id);label=position?position.name:''}else if(kind==='theme'){const theme=D.themes.find(t=>t.id===id);label=theme?theme.name:''}else if(kind==='digit'){const digit=D.pythagoras.digits.find(t=>t.digit===Number(id));label=digit?digit.name:''}else if(kind==='direction'){const dir=D.directions.find(t=>t.id===Number(id));label=dir?dir.name:''}
 const entry={id:'passport:'+key,d:record.at,at:'Паспорт героя',source:{type:'passport',key,choice:value},x:label+' — '+{yes:'да, узнаю себя',partly:'частично знакомо',no:'нет, не про меня',unknown:'пока не знаю'}[value]+(record.note?'\nМой пример: '+record.note:'')};
 const old=P.diary.ins.findIndex(e=>e.id===entry.id);if(old<0)P.diary.ins.push(entry);else P.diary.ins[old]=entry;
 localStorage.setItem('alch_profile',JSON.stringify(P));return record;
}
function say(text,gender){if(gender===undefined)gender=load().gender;const pair=D.genderedTexts&&D.genderedTexts[text];return pair?(gender==='f'?pair.f:pair.m):text}
function context(P){P=P||load();const b=P.passport;if(!b||b.birth!==P.birth)return {themes:[],positions:[]};const a=b.answers||{};
 return {themes:D.themes.filter(t=>a['theme:'+t.id]&&a['theme:'+t.id].choice==='yes').map(t=>({id:t.id,name:t.name})),positions:D.positions.filter(p=>a['position:'+p.id]&&['yes','partly'].includes(a['position:'+p.id].choice)).map(p=>({id:p.id,arcana:b.layers.positions[p.id],choice:a['position:'+p.id].choice,note:a['position:'+p.id].note}))};
}
function practice(day,P){P=P||load();const c=context(P);if(!c.positions.length)return null;const position=c.positions[Math.max(0,Number(day)||0)%c.positions.length],a=D.arcana[position.arcana-1];return {source:'passport',position:position.id,arcana:a.id,title:say(a.game_task.title,P.gender),instruction:say(a.game_task.instruction,P.gender),observation:say(a.game_task.observation,P.gender),note:position.note,choice:position.choice};}
root.GPassport={say,context,practice,calculate,parse,red,counts,directionLevel,hypotheses,ensure,answer,load};
})(typeof window!=='undefined'?window:globalThis);
