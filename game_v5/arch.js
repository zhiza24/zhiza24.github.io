/* Большой тест «Архитектура личности» в игре: показ вопросов, подсчет, итоги, сохранение.
   Части по маршруту: a (Маг, ego.html), b (Эхо), v (Зодчий), p (Страж), d (Архитектор).
   Сохранение: P.ego (линия А), P.archB, P.archV, P.archP, P.archD в alch_v5_profile.
   ?preview=1 — просмотр без сохранения в профиль (ответы живут во вкладке). */
(function(){
'use strict';
var D=window.GARCH,K='alch_v5_profile',PV='alch_v5_arch_preview';
var Q=new URLSearchParams(location.search),preview=Q.get('preview')==='1';
var NEXT_PV={a:'slot.html?id=arch_b&preview=1',b:'slot.html?id=arch_v&preview=1',v:'slot.html?id=arch_p&preview=1',p:'slot.html?id=arch_d&preview=1',d:'tasks.html'};
var FIELD={a:'ego',b:'archB',v:'archV',p:'archP',d:'archD'};
function prof(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
function fem(){return (window.GGender?GGender():(prof().gender==='f'?'f':'m'))==='f'}
function g(s){if(s==null)return '';var f=fem();return String(s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return f?w:m})}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function h(s){return esc(g(s))}
function pvs(){try{return JSON.parse(sessionStorage.getItem(PV))||{}}catch(e){return {}}}
function data(){var P=prof();if(preview){var o=pvs();Object.keys(FIELD).forEach(function(k){var f=FIELD[k];if(o[f]!==undefined)P[f]=o[f]})}return P}
function store(part,val,raw,logText,extra){var f=FIELD[part];
 if(preview){var o=pvs();o[f]=val;sessionStorage.setItem(PV,JSON.stringify(o));return}
 var P=prof();(P.log=P.log||[]).push({t:Date.now(),x:logText});if(extra)extra(P);
 if(window.GProfile)GProfile.saveResult(f,val,raw,{profile:P});else{P[f]=val;localStorage.setItem(K,JSON.stringify(P))}}
function go(part){if(preview){location.href=NEXT_PV[part];return}location.href=window.GRoute?GRoute.advance():'tasks.html'}
/* устойчивое перемешивание вариантов: seed от имени и даты игрока */
function seedOf(id){var P=prof(),s=String(P.name||'')+'|'+String(P.birth||'')+'|'+id,x=2166136261;for(var i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619)}return x>>>0}
function shuffle(list,id){var a=list.slice(),x=seedOf(id)||1;for(var i=a.length-1;i>0;i--){x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;var j=x%(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
function num(n,one,many){var w=['','одной','двух','трех','четырех','пяти','шести','семи','восьми','девяти','десяти'];return (w[n]||n)+' '+(n===1?one:many)}

/* ---------- стиль ---------- */
var css='.ar-ph{margin:12px 0 14px;border:2px dashed #b8893f;border-radius:16px;padding:20px 14px;text-align:center;background:rgba(32,23,14,.55);color:#e8d3ac}.ar-ph b{display:block;font:800 19px Manrope;color:#f0c870;letter-spacing:.04em;margin-bottom:4px}.ar-ph small{display:block;margin-top:6px;font-size:15px;line-height:1.4;color:#cdb68c}'+
'.ar-draft{border-left:3px solid #c99a45;padding:4px 0 4px 10px;font-style:italic;line-height:1.5}.ar-draft span{display:inline-block;margin-left:6px;font:700 12px Manrope;font-style:normal;letter-spacing:.06em;text-transform:uppercase;opacity:.6}'+
'.ar-on{background:linear-gradient(#ffe9a8,#e0a940)!important;color:#2a1606!important;border-color:#6a3a12!important}.ar-skip{display:block;margin:10px auto 0;background:none;border:0;color:inherit;opacity:.7;font:600 16px Manrope;text-decoration:underline;cursor:pointer}.ar-det{margin:12px 0}.ar-det summary{cursor:pointer;font-weight:600;opacity:.85}.ar-det p{margin:8px 0}.ar-quiet{display:inline;width:auto;min-height:0;margin:12px 0 0;padding:0;border:0;background:none!important;color:#c9a46a!important;font:500 15px/1.5 Manrope,sans-serif;box-shadow:none;text-align:left;cursor:pointer}'+
'.ar-ta{width:100%;box-sizing:border-box;margin-top:8px;padding:10px;border-radius:10px;border:1.5px solid #a8692a;font:600 17px Manrope;background:#fff6dc;color:#3a2410}.ar-ctx{font-size:16px;opacity:.85;margin:-4px 0 10px;line-height:1.4}.ar-blk{margin:14px 0}.ar-blk h3{margin:0 0 6px;font:800 16px Manrope;letter-spacing:.05em;text-transform:uppercase;opacity:.8}.ar-blk p{margin:6px 0;line-height:1.55}.ar-pt{font-weight:700}.ar-title{font:800 22px Manrope;color:#f0c870;line-height:1.3}.sc .ar-title{font:700 26px \'Cormorant Garamond\',serif;color:#6a3a12}'+
'.ao{display:block;width:100%;margin:7px 0;padding:12px 14px;border:1px solid #9e783a;border-radius:12px;background:#20170e;color:#f4ecdf;font:600 18px Manrope;text-align:left;cursor:pointer}.aq{font:700 22px Manrope;color:#f0c870;line-height:1.35;margin:4px 0 12px}.al{font-size:15px;color:#bfa77f;text-transform:uppercase;letter-spacing:.06em;margin:6px 0}.ar-slot .ar-ta{background:#20170e;color:#f4ecdf;border-color:#9e783a}.ar-slot .ar-on{color:#2a1606!important}';
function addCss(){if(document.getElementById('ar-css'))return;var s=document.createElement('style');s.id='ar-css';s.textContent=css;document.head.appendChild(s)}
var SKIN={ego:{opt:'a',q:'q',l:'l',go:'go'},slot:{opt:'ao',q:'aq',l:'al',go:'next'}};

/* ---------- подсчет ---------- */
var ACODES=['A1','A2','A3','A4','A5','A6','A7','A8','A9','A10','A11','A12'],BCODES=['B1','B2','B3','B4','B5','B6','B7','B8'];
function scoreA(ans){var s={},sit={};ACODES.forEach(function(c){s[c]=0;sit[c]=0});var skips=0;
 D.A.forEach(function(q){var c=ans[q.id];if(c==null||c==='skip'){skips++;return}if(c!=='0'){s[c]++;sit[c]++}});
 var m=Array.isArray(ans.A11)?ans.A11:[];if(!m.length)skips++;var a11=m.filter(function(c){return c!=='0'});a11.forEach(function(c,i){s[c]+=3-i});
 var rv=ans.A12;if(rv==null||rv==='skip')skips++;var R=/^R[0-4]$/.test(rv||'')?+rv.slice(1):null;
 var ord=ACODES.slice().sort(function(x,y){var ix=a11.indexOf(x),iy=a11.indexOf(y);return s[y]-s[x]||(ix<0?9:ix)-(iy<0?9:iy)||sit[y]-sit[x]||ACODES.indexOf(x)-ACODES.indexOf(y)});
 var cand=ord.filter(function(c){return s[c]>0}).slice(0,2);
 return {scores:s,sit:sit,a11:a11,R:R,Rcode:a12Code(ans),cand:cand,skips:skips}}
function a12Code(ans){var m=(Array.isArray(ans.A11)?ans.A11:[]).filter(function(c){return c!=='0'});if(m.length)return m[0];
 var s={};D.A.forEach(function(q){var c=ans[q.id];if(c&&c!=='0'&&c!=='skip')s[c]=(s[c]||0)+1});var k=Object.keys(s).sort(function(x,y){return s[y]-s[x]||ACODES.indexOf(x)-ACODES.indexOf(y)});return k[0]||null}
function scoreB(ans){var s={};BCODES.forEach(function(c){s[c]=0});D.B.forEach(function(q){var c=ans[q.id];if(c&&c!=='0'&&c!=='skip')s[c]++});
 var cand=BCODES.slice().sort(function(x,y){return s[y]-s[x]||BCODES.indexOf(x)-BCODES.indexOf(y)}).filter(function(c){return s[c]>0}).slice(0,2);return {scores:s,count:JSON.parse(JSON.stringify(s)),cand:cand}}
function modeOf(ans){var s={C1:0,C2:0,C3:0,C4:0};D.C.forEach(function(q){var c=ans[q.id];if(c&&s[c]!=null)s[c]++});
 if(s.C4>=3)return {scores:s,mode:'C4'};var mx=Math.max(s.C1,s.C2,s.C3,s.C4),tops=Object.keys(s).filter(function(k){return s[k]===mx});
 if(tops.length===1&&mx>=3)return {scores:s,mode:tops[0]};
 if(tops.length>=2&&((tops.indexOf('C1')>=0&&tops.indexOf('C2')>=0)||(tops.indexOf('C2')>=0&&tops.indexOf('C3')>=0))&&s.C4>=2)return {scores:s,mode:'C4'};
 return {scores:s,mode:'mix'}}
function v02(x){return x==='2'?2:x==='1'?1:(x==='0a'||x==='0b')?0:null}
/* итоговые статусы по правилам 9.1–9.4 */
function finalize(P){var e=P.ego&&P.ego.v===2?P.ego:null,b=P.archB||null,V=(P.archV&&P.archV.answers)||{},out={};
 var cand=e?e.cand||[]:[],S=e?e.scores:{};
 function st(c,i){if(!c||!e)return 'unclear';var s=S[c]||0,sit=e.sit[c]||0,inA=e.a11.indexOf(c)>=0,R=e.Rcode===c?e.R:null,vv=v02(V['V02_'+i]),rec=V['V01_'+i]&&V['V01_'+i]!=='none'&&V['V01_'+i]!=='skip';
  if(e.skips>=5)return 'unclear';
  if(s>=4&&sit>=2&&inA&&R!=null&&R>=2&&vv!=null&&vv>=1&&rec)return 'supported';
  if(s>=3&&(inA||(vv!=null&&vv>=1)))return 'tentative';return 'unclear'}
 var a=st(cand[0],0);
 if(a!=='unclear'&&cand[1]){var s0=S[cand[0]],s1=S[cand[1]],v0=v02(V.V02_0),v1=v02(V.V02_1);if(Math.abs(s0-s1)<=1&&s0>=3&&s1>=3&&v0>=1&&v1>=1)a='mixed'}
 out.a=a;out.a1=cand[0]||null;out.a2=cand[1]||null;out.recalled=!!(V.V01_0&&V.V01_0!=='none'&&V.V01_0!=='skip');
 var bs=b?JSON.parse(JSON.stringify(b.scores)):{},bc=b?(b.cand||[]).slice():[],v6=V.V06;
 if(bc[0]&&bc[1]){if(v6==='b1')bs[bc[0]]+=2;if(v6==='b2')bs[bc[1]]+=2;if(v6==='both'){bs[bc[0]]++;bs[bc[1]]++}if(v6==='neither'){bs[bc[0]]-=2;bs[bc[1]]-=2}}
 var askedB=bc[0],bo=bc.slice().sort(function(x,y){return bs[y]-bs[x]}),b1=bo[0],b2=bo[1],cnt=b?b.count||b.scores:{};
 var bst='unclear';if(b1){var t=bs[b1];
  if(bo[1]&&Math.abs(t-bs[b2])<=1&&t>=3&&bs[b2]>=3&&v6==='both')bst='mixed';
  else if(t>=3&&(cnt[b1]||0)>=3&&!(V.V05==='disconfirm'&&b1===askedB))bst='supported';
  else if(t>=2)bst='tentative'}
 out.b=bst;out.b1=b1||null;out.b2=b2||null;
 var lo=a==='unclear',hi=a==='supported'&&bst==='supported'&&(V.V05==='repeat'||V.V05==='cost')&&out.recalled;
 out.cons=hi?'high':(!lo&&bst!=='unclear')?'medium':'low';
 return out}

/* ---------- блоки результата (раздел 13) ---------- */
function blocks(P,upto){var F=finalize(P),V=(P.archV&&P.archV.answers)||{},B=[],a=F.a,e=P.ego&&P.ego.v===2?P.ego:null;
 var key=a==='unclear'||!F.a1?'none':F.a1,RA=D.resA[key];
 B.push({h:'',t:[a==='mixed'?g(RA.title)+' · '+g(D.resA[F.a2].title):g(RA.title)],cls:'title',cons:g(D.cons[F.cons])});
 if(key!=='none'&&e&&F.recalled){var n=e.sit[F.a1]||0,m=1+((v02(V.V02_0)||0)>=1?1:0);B.push({h:'',t:['Ты отмечаешь это ощущение'+(n?' в '+num(n,'ситуации','ситуациях')+' и':'')+' в '+num(m,'сфере','сферах')+'.']})}
 B.push({h:'',t:[g(RA.text),'Новая точка: «'+g(RA.point).replace(/\.$/,'')+'».'].concat(a==='mixed'?[g(D.resA[F.a2].text),'Новая точка: «'+g(D.resA[F.a2].point).replace(/\.$/,'')+'».']:[])});
 if(F.b!=='unclear'&&F.b1){var bl=[F.b1].concat(F.b==='mixed'&&F.b2?[F.b2]:[]);B.push({h:'Что может поддерживать этот сценарий',t:bl.map(function(c){var r=D.resB[c];return g(r.text)+(r.sw?' Переключатель: '+g(r.sw).charAt(0).toLowerCase()+g(r.sw).slice(1):'')})})}
 else if(P.archB)B.push({h:'Что может поддерживать этот сценарий',t:[g(D.resB.none.text)]});
 if(key!=='none'&&F.b!=='unclear'&&F.b1){var lk='';
  if(F.a1==='A12'&&F.b1!=='B8')lk=g(D.linkA12).replace('%B%',g(D.bdesc[F.b1]));
  else if(F.b1==='B8'&&F.a1!=='A12')lk=g(D.linkB8);
  else if(V.V05==='repeat'||V.V05==='cost'){var ph=g(D.phrase[F.a1]);lk=g(D.link).replace(/%A%/g,ph).replace('%M%',g(D.AB[F.a1][BCODES.indexOf(F.b1)]))}
  if(lk)B.push({h:'',t:[lk]})}
 var md=P.archV&&P.archV.c?P.archV.c.mode:null;if(md){var rc=D.resC[md];B.push({h:'Как ты сейчас реагируешь',t:[rc.name+'. '+g(rc.text),g(D.modeNote)]})}
 if(upto==='d'){
  var pp=P.archP;if(pp){var tx=[];if(pp.branch!=='U'){tx.push('«'+g(D.resA[pp.branch].point).replace(/\.$/,'')+'».')}else tx.push(g(D.ui.pU));
   (pp.answers||[]).forEach(function(x){if(x&&x.text)tx.push('— '+x.text+(x.own?': '+x.own:''))});B.push({h:'Где находится точка переключения',t:tx})}
  var d=P.archD||{};
  if(d.d1)B.push({h:'Какое состояние ты хочешь развивать',t:[d.d1t]});
  if(d.d2)B.push({h:'Твой первый признак перемен',t:[d.d2t+(d.d2own?': '+d.d2own:'')]});
  if(d.d3)B.push({h:'Один шаг на ближайшие два дня',t:[d.d3t+(d.d3own?': '+d.d3own:'')]});
 }
 var chk=[];if(e&&e.period==='P3')chk.push(g(D.ui.stress));
 if(V.V03==='context'||V.V04==='real')chk.push(g(D.ui.ctx));
 if(!chk.length){if(F.a2&&a!=='mixed'&&key!=='none')chk.push(g(D.ui.check2).replace('%A%',g(D.phrase[F.a2])));else chk.push(g(D.ui.checkNone))}
 if(upto==='d')chk.push(g(D.ui.care));
 B.push({h:'Что еще стоит проверить',t:chk});
 var quote=P.archV&&P.archV.quote;if(quote)B.splice(1,0,{h:'Твоя фраза',t:['«'+quote+'»']});
 return {list:B,F:F}}
function blocksHTML(r){return r.list.map(function(b){return '<div class="ar-blk">'+(b.h?'<h3>'+esc(b.h)+'</h3>':'')+(b.cls==='title'?'<div class="ar-title">'+esc(b.t[0])+'</div>'+(b.cons?'<p style="opacity:.8;font-size:16px">'+esc(b.cons)+'</p>':''):b.t.map(function(p){return '<p>'+esc(p)+'</p>'}).join(''))+'</div>'}).join('')}
function blocksText(r){return r.list.map(function(b){return (b.h?b.h.toUpperCase()+'\n':'')+b.t.join('\n')+(b.cons?'\n'+b.cons:'')}).join('\n\n')}

/* ---------- раннер вопросов ---------- */
function Runner(o){this.o=o;this.i=0;this.hist=[];this.ans={};this.box=o.box;this.sk=SKIN[o.skin];}
Runner.prototype.items=function(){return this.o.items};
Runner.prototype.start=function(){var self=this;window.gBack=function(){if(self.hist.length){self.i=self.hist.pop();self.draw();scrollTo(0,0);return true}return false};this.draw()};
Runner.prototype.next=function(){this.hist.push(this.i);this.i++;if(this.o.onStep)this.o.onStep(this.i,this.items().length);this.draw();scrollTo(0,0)};
Runner.prototype.draw=function(){var it=this.items()[this.i];if(!it){this.o.done(this.ans);return}var k=this.sk,self=this,b=this.box,qn=this.items().filter(function(x){return x.kind!=='intro'&&x.kind!=='screen'}),ix=qn.indexOf(it);
 if(it.kind==='intro'){var I=D.intro[it.key];b.innerHTML='<div class="ar-ph"><b>'+esc(I.z)+'</b>'+esc(I.who)+' · здесь будет картинка или видео<small>'+esc(I.zdesc)+'</small></div><div class="'+k.q+'">'+h(I.title)+'</div>'+(D.showDraft&&I.draft?'<p class="ar-draft">'+h(I.draft)+'<span>черновик</span></p>':'')+'<p style="line-height:1.55">'+h(I.text)+'</p><button class="'+k.go+'" id="arGo">'+h(I.btn)+'</button>';
  b.querySelector('#arGo').onclick=function(){self.next()};return}
 if(it.kind==='screen'){b.innerHTML=it.html()+'<button class="'+k.go+'" id="arGo">'+esc(it.btn||'Дальше')+'</button>';b.querySelector('#arGo').onclick=function(){if(it.go)it.go();self.next()};return}
 var head=(ix>=0?'<div class="'+k.l+'">Вопрос '+(ix+1)+' из '+qn.length+'</div>':'')+(it.h?'<div class="'+k.l+'" style="opacity:.8">'+h(it.h)+'</div>':'')+(it.parts?'<div class="'+k.q+'">'+h(it.parts[0])+'</div><p class="ar-ctx" style="font-size:17px">«'+h(it.parts[1])+'»</p><div class="'+k.q+'">'+h(it.parts[2])+'</div>':'<div class="'+k.q+'">'+h(typeof it.t==='function'?it.t(this.ans):it.t)+'</div>');
 var ctx=typeof it.ctx==='function'?it.ctx(this.ans):it.ctx;if(ctx)head+='<p class="ar-ctx">'+h(ctx)+'</p>';if(it.hint)head+='<p class="ar-ctx">'+h(it.hint)+'</p>';
 if(it.kind==='text'){b.innerHTML=head+'<textarea class="ar-ta" id="arTx" rows="3" maxlength="300"></textarea><button class="'+k.go+'" id="arGo">Дальше</button>';var tx=b.querySelector('#arTx');tx.value=this.ans[it.id]||'';b.querySelector('#arGo').onclick=function(){var v=tx.value.trim();if(v)self.ans[it.id]=v;else delete self.ans[it.id];self.next()};return}
 var opts=it.o.slice(),tail=[];if(it.shuffle){var last=opts.filter(function(x){return x[0]==='0'});opts=shuffle(opts.filter(function(x){return x[0]!=='0'}),it.id).concat(last)}
 var multi=it.kind==='multi',sel=multi?(Array.isArray(this.ans[it.id])?this.ans[it.id].slice():[]):null;
 b.innerHTML=head+'<div id="arOp">'+opts.map(function(x){return '<button class="'+k.opt+'" data-c="'+esc(x[0])+'">'+h(String(x[1]).replace('%B1%',it.b1||'').replace('%B2%',it.b2||''))+'</button>'}).join('')+'</div><div id="arEx"></div>'+(multi?'<button class="'+k.go+'" id="arGo">Готово</button>':'')+(it.noskip?'':'<button class="ar-skip" id="arSk">Пропустить</button>');
 var exb=b.querySelector('#arEx');
 function mark(){b.querySelectorAll('#arOp button').forEach(function(x){var n=sel.indexOf(x.dataset.c);x.classList.toggle('ar-on',n>=0);var t=x.querySelector('i');if(t)t.remove();if(n>=0)x.insertAdjacentHTML('afterbegin','<i style="font-style:normal;font-weight:800;margin-right:6px">'+(n+1)+'.</i>')})}
 b.querySelectorAll('#arOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c;
  if(multi){var n=sel.indexOf(c);if(n>=0)sel.splice(n,1);else if(c==='0')sel=['0'];else{sel=sel.filter(function(z){return z!=='0'});if(sel.length<3)sel.push(c)}mark();return}
  if(it.text&&it.text.indexOf(c)>=0){b.querySelectorAll('#arOp button').forEach(function(z){z.classList.toggle('ar-on',z===x)});exb.innerHTML='<textarea class="ar-ta" id="arTx" rows="2" maxlength="200" placeholder="Коротко, своими словами"></textarea><button class="'+k.go+'" id="arOk">Дальше</button>';var ta=exb.querySelector('#arTx');ta.value=self.ans[it.id+'_text']||'';ta.focus();exb.querySelector('#arOk').onclick=function(){self.ans[it.id]=c;var v=ta.value.trim();if(v)self.ans[it.id+'_text']=v;else delete self.ans[it.id+'_text'];self.raw(it,c);self.next()};return}
  self.ans[it.id]=c;delete self.ans[it.id+'_text'];self.raw(it,c);try{navigator.vibrate&&navigator.vibrate(15)}catch(e){}self.next()}});
 if(multi){mark();b.querySelector('#arGo').onclick=function(){if(!sel.length)return;self.ans[it.id]=sel.slice();self.raw(it,sel);self.next()}}
 var sk=b.querySelector('#arSk');if(sk)sk.onclick=function(){self.ans[it.id]='skip';self.next()}};
Runner.prototype.raw=function(it,c){if(preview||!window.GProfile||!this.o.module)return;try{GProfile.recordRaw(this.o.module,it.id,c,{})}catch(e){}};

/* ---------- части ---------- */
function resultScreen(box,skin,html,part,save){var k=SKIN[skin];save();box.innerHTML=html+(preview?'<p class="ar-ctx">Просмотр: ответы не сохраняются в твой путь.</p>':'')+'<button class="'+k.go+'" id="arNext">'+(preview&&part==='d'?'Закончить просмотр':preview?'Дальше':({a:'Дальше: Эхо',b:'Дальше: свайп хорошего',v:'Дальше: итог Точки А',p:'Дальше: основание установки'})[part]||'Дальше')+'</button>';box.querySelector('#arNext').onclick=function(){go(part)};if(window.GQuote)GQuote.add(box,{a:'ego.html',b:'slot.html?id=arch_b',v:'slot.html?id=arch_v',p:'slot.html?id=arch_p',d:'slot.html?id=arch_d'}[part],box.querySelector('#arNext'));scrollTo(0,0)}
function partA(box,skin,hooks){var items=[{kind:'intro',key:'a'},{kind:'one',id:'S1',t:D.period.t,o:D.period.o}];
 D.A.forEach(function(q){items.push({kind:'one',id:q.id,h:q.h,t:q.t,o:q.o,shuffle:true})});
 items.push({kind:'multi',id:'A11',h:D.A11.h,t:D.A11.t,hint:D.A11.hint,o:D.A11.o,shuffle:true});
 items.push({kind:'one',id:'A12',h:D.A12.h,t:D.A12.t,o:D.A12.o,ctx:function(ans){var c=a12Code(ans);if(!c)return '';var m=(ans.A11||[]).filter(function(x){return x!=='0'}).length;return (m?'Речь о чувстве: «':'Если вспоминать самое частое в твоих ответах: «')+g(D.phrase[c])+'»'}});
 new Runner({box:box,skin:skin,items:items,module:'ego',onStep:hooks&&hooks.step,done:function(ans){var r=scoreA(ans),c=r.cand[0],lead=c&&r.scores[c]>=3&&r.skips<5?c:null,RA=D.resA[lead||'none'];
  var res={v:2,line:'A',top:lead?g(D.phrase[lead]):'Один фон пока не выделился',lead:lead,period:ans.S1&&ans.S1!=='skip'?ans.S1:null,answers:ans,scores:r.scores,sit:r.sit,a11:r.a11,R:r.R,Rcode:r.Rcode,cand:r.cand,skips:r.skips,at:Date.now()};
  var also=lead&&r.cand[1]&&r.scores[r.cand[1]]>=3&&r.scores[lead]-r.scores[r.cand[1]]<=1?g(D.ui.alsoA).replace('%A%',g(D.phrase[r.cand[1]])):'';
  var html='<div class="'+SKIN[skin].l+'">Твое знакомое состояние</div><div class="'+SKIN[skin].q+'">'+h(RA.title)+'</div><p style="line-height:1.55">'+h(RA.text)+'</p><p class="ar-pt">Новая точка: «'+h(RA.point).replace(/\.$/,'')+'»</p>'+(also?'<p>'+esc(also)+'</p>':'')+(res.period==='P3'?'<p>'+h(D.ui.stress)+'</p>':'')+(D.showDraft?'<p class="ar-draft">'+h(D.ui.preA)+'<span>черновик</span></p>':'<p>'+h(D.ui.preA)+'</p>')+'<div class="'+SKIN[skin].l+'">Черный кристалл у Героя · запись в Дневнике</div>';
  resultScreen(box,skin,html,'a',function(){store('a',res,{answers:ans},'Фоновое состояние: '+res.top,function(P){if(window.GArts)GArts.grantInto(P,'black_crystal');else{P.arts=P.arts||[];if(P.arts.indexOf('Черный кристалл')<0)P.arts.push('Черный кристалл')}
   try{var p=window.GP?GP():null;if(p){p.done[3]=1;p.log.push({s:3,t:'Фоновое состояние',r:res.top,d:new Date().toLocaleDateString('ru')});P.path=p}}catch(e){}})})}}).start()}
function partB(box){var items=[{kind:'intro',key:'b'}];D.B.forEach(function(q){items.push({kind:'one',id:q.id,h:q.h,t:q.t,o:q.o,shuffle:true})});
 new Runner({box:box,skin:'slot',items:items,module:'archB',done:function(ans){var r=scoreB(ans),c=r.cand[0],lead=c&&r.scores[c]>=2?c:null,RB=D.resB[lead||'none'];
  var res={v:1,line:'B',top:lead?RB.name:'Один привычный способ пока не выделился',lead:lead,answers:ans,scores:r.scores,count:r.count,cand:r.cand,at:Date.now()};
  var html='<span class="tag">Точка 0</span><span class="tag">Эхо</span><div class="al">Твой привычный ход</div><div class="aq">'+h(lead?RB.name:res.top)+'</div><p>'+h(RB.text)+'</p>'+(RB.sw?'<p class="ar-pt">Переключатель: '+h(RB.sw)+'</p>':'')+(lead&&D.bfull&&D.bfull[lead]?(function(x,L){return '<details class="ar-det"><summary>Подробнее об этом ходе</summary><p>'+h(x.d)+'</p><p><b>'+esc(L.logic)+':</b> '+h(x.logic)+'</p><p><b>'+esc(L.gain)+':</b> '+h(x.gain)+'</p><p><b>'+esc(L.cost)+':</b> '+h(x.cost)+'</p></details>'})(D.bfull[lead],D.bfullLabels||{}):'')+(lead==null&&D.showDraft?'<p class="ar-draft">Текст для этого случая — черновик<span>черновик</span></p>':'');
  resultScreen(box,'slot',html,'b',function(){store('b',res,{answers:ans},'Привычный ход: '+res.top)})}}).start()}
function partV(box){var P=data(),e=P.ego&&P.ego.v===2?P.ego:null,a=e?e.cand||[]:[],b=P.archB?P.archB.cand||[]:[],items=[{kind:'intro',key:'v'}];
 D.C.forEach(function(q){items.push({kind:'one',id:q.id,t:q.t,o:q.o})});
 function ph(i){return g(D.phrase[a[i]])}
 if(a[0]){items.push({kind:'one',id:'V01_0',t:D.V01.t.replace('%A%',ph(0)),o:D.V01.o,text:D.V01.text});
  if(a[1])items.push({kind:'one',id:'V01_1',t:D.V01.t.replace('%A%',ph(1)),o:D.V01.o,text:D.V01.text});
  items.push({kind:'one',id:'V02_0',t:D.V02.t,ctx:'Речь об ощущении «'+ph(0)+'»',o:D.V02.o});
  if(a[1])items.push({kind:'one',id:'V02_1',t:D.V02.t,ctx:'Речь об ощущении «'+ph(1)+'»',o:D.V02.o});
  items.push({kind:'one',id:'V03',t:D.V03.t,ctx:'Речь об ощущении «'+ph(0)+'»',o:D.V03.o});
  items.push({kind:'one',id:'V04',t:D.V04.t,ctx:'Речь об ощущении «'+ph(0)+'»',o:D.V04.o})}
 if(b[0]){var bf=D.bfull||{},full=function(c){return bf[c]?g(bf[c].d):null},d1=full(b[0])||g(D.bdesc[b[0]]),vp=D.V05.t.split('«%B%»'),v5={kind:'one',id:'V05',t:D.V05.t.replace('%B%',d1),o:D.V05.o};if(full(b[0])&&vp.length===2)v5.parts=[vp[0].replace(/\s+$/,''),d1,vp[1].replace(/^,\s*/,'')];items.push(v5);
  if(b[1]){var d2=full(b[1])||g(D.bdesc[b[1]]),cap=function(s){return s.charAt(0).toUpperCase()+s.slice(1)};items.push({kind:'one',id:'V06',t:D.V06.t,o:D.V06.o,b1:cap(d1),b2:cap(d2)})}}
 items.push({kind:'text',id:'quote',t:D.quote.t,hint:D.quote.hint});
 new Runner({box:box,skin:'slot',items:items,module:'archV',done:function(ans){var m=modeOf(ans),V={};Object.keys(ans).forEach(function(k){if(/^V0|^V0\d_/.test(k))V[k]=ans[k]});
  var res={v:1,c:{answers:{},scores:m.scores,mode:m.mode},answers:V,quote:ans.quote||null,at:Date.now()};D.C.forEach(function(q){if(ans[q.id])res.c.answers[q.id]=ans[q.id]});
  var P2=data();P2.archV=res;var r=blocks(P2,'v');res.status=r.F;res.cons=r.F.cons;res.top=r.list[0].t[0];
  var html='<span class="tag">Точка А</span><span class="tag">Зодчий</span><div class="al">Что подтвердилось</div>'+blocksHTML(r);
  resultScreen(box,'slot',html,'v',function(){store('v',res,{answers:ans},'Сверка Зодчего: '+res.top)})}}).start()}
function partP(box){var P=data(),F=P.archV?finalize(P):{a:'unclear'},br=['supported','tentative','mixed'].indexOf(F.a)>=0&&F.a1?F.a1:'U',Ps=D.P[br],items=[{kind:'intro',key:'p'}];
 Ps.forEach(function(q,i){items.push({kind:'one',id:'P'+(i+1),t:q.t,o:q.o.map(function(x,j){return [String(j),x]}),text:q.o.map(function(x,j){return /^(Свой|Другое)/.test(x)?String(j):null}).filter(function(x){return x})})});
 new Runner({box:box,skin:'slot',items:items,module:'archP',done:function(ans){var A=Ps.map(function(q,i){var c=ans['P'+(i+1)];return c==null||c==='skip'?null:{q:i+1,i:+c,text:g(q.o[+c]),own:ans['P'+(i+1)+'_text']||null}});
  var res={v:1,branch:br,answers:A,top:br==='U'?'Исследовать, от чего зависит реакция':g(D.resA[br].point),at:Date.now()};
  var bsw=F.b&&F.b!=='unclear'&&F.b1&&D.resB[F.b1].sw?g(D.resB[F.b1].sw):'';
  var html='<span class="tag">Точка Б</span><span class="tag">Страж</span><div class="al">Где находится точка переключения</div>'+(br==='U'?'<p>'+h(D.ui.pU)+'</p>':'<div class="aq">«'+h(D.resA[br].point).replace(/\.$/,'')+'»</div>')+(bsw?'<p class="ar-pt">Переключатель привычного хода: '+esc(bsw)+'</p>':'')+A.filter(function(x){return x}).map(function(x){return '<p>— '+esc(x.text)+(x.own?': '+esc(x.own):'')+'</p>'}).join('');
  resultScreen(box,'slot',html,'p',function(){store('p',res,{answers:ans},'Точка переключения: '+res.top)})}}).start()}
function partD(box){var items=[{kind:'intro',key:'d'},{kind:'one',id:'D01',t:D.D01.t,o:D.D01.o},{kind:'one',id:'D02',t:D.D02.t,o:D.D02.o,text:D.D02.text},{kind:'one',id:'D03',t:D.D03.t,o:D.D03.o,text:D.D03.text},
  {kind:'screen',btn:'Собрать мою карту',html:function(){var x=D.practice;return '<span class="tag">Точка С</span><div class="ar-ph"><b>Заставка 5</b>Практика «Точка сборки» · здесь может быть короткое видео<small>Архитектор останавливается у чертежного стола, вдох, опора под ногами.</small></div><div class="aq">'+esc(x.title)+'</div>'+x.p.map(function(p){return '<p>'+h(p)+'</p>'}).join('')+'<p class="ar-ctx">'+h(x.note)+'</p>'}}];
 new Runner({box:box,skin:'slot',items:items,module:'archD',done:function(ans){function pick(id){var c=ans[id];if(!c||c==='skip')return null;var o=D[id].o.filter(function(x){return x[0]===c})[0];return o?g(o[1]):null}
  var res={v:1,d1:ans.D01&&ans.D01!=='skip'?ans.D01:null,d1t:pick('D01'),d2:ans.D02&&ans.D02!=='skip'?ans.D02:null,d2t:pick('D02'),d2own:ans.D02_text||null,d3:ans.D03&&ans.D03!=='skip'?ans.D03:null,d3t:pick('D03'),d3own:ans.D03_text||null,at:Date.now()};
  res.top=res.d1t?res.d1t.split(':')[0]:'Состояние пока не выбрано';
  var P2=data();P2.archD=res;var r=blocks(P2,'d');res.map=blocksText(r);
  var html='<span class="tag">Точка С</span><span class="tag">Архитектор</span><div class="al">Моя карта</div>'+blocksHTML(r)+(D.ui.reactorRes?'<p class="ar-pt">'+h(D.ui.reactorRes)+'</p>':'');
  resultScreen(box,'slot',html,'d',function(){store('d',res,{answers:ans},'Выбрано состояние: '+res.top)});
  var nx=box.querySelector('#arNext');if(nx&&!(typeof preview!=='undefined'&&preview))nx.textContent='Дальше: Реактор';
  var cp=document.createElement('button');cp.type='button';cp.id='arCopy';cp.className='ar-quiet';cp.textContent='Скопировать мою карту';if(nx&&nx.parentNode)nx.after(cp);else box.append(cp);
  cp.onclick=function(){var t='Моя карта\n\n'+res.map;function ok(){cp.textContent='Скопировано'}if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,function(){fb(t);ok()});else{fb(t);ok()}}}}).start()}
function fb(t){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
window.GArch={preview:preview,g:g,finalize:finalize,blocks:blocks,scoreA:scoreA,scoreB:scoreB,modeOf:modeOf,
 mount:function(part,box,skin,hooks){addCss();if(skin==='slot')box.classList.add('ar-slot');({a:partA,b:partB,v:partV,p:partP,d:partD})[part](box,skin||'slot',hooks)}};
})();
