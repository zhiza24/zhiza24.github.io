/* «Зеркало внутреннего мира»: подсчет (GInner.score) и экран теста (GInner.mount).
   Профиль: P.backgroundProfile (algoVersion 1). Сырые ответы хранятся без изменений, пропуск и «зависит» не нули.
   P.kmTest и P.firstSet не трогаются. Названия семейств, ран и ключей игроку не показываются. */
(function(){
'use strict';
var D=window.GIMD;if(!D)return;
var FAMS=['S1','S2','S3','S4','S5','S6','S7','S8'],POS=['S1','S2','S3','S4'],NEG=['S5','S6','S7','S8'],ADS=['A1','A2','A3','A4','A5','A6'];
function parseKey(k){var o={S:{},A:{}};String(k||'').split(/\s+/).forEach(function(tok){if(!tok)return;var parts=tok.split('/'),w=1/parts.length;parts.forEach(function(p){var t=p.charAt(0)==='S'?'S':(p.charAt(0)==='A'?'A':null);if(!t)return;o[t][p]=(o[t][p]||0)+w})});return o}
function isIdx(v){return typeof v==='number'&&v>=0}
function r2(x){return Math.round(x*1000)/1000}
/* ---------- подсчет ---------- */
function score(ans){
 ans=ans||{};var raw={},exp={},chap={},adapt={},adChap={},perCh=[{},{},{},{}],valid=0,dep=0,skip=0,answered=0,sitHits={};
 FAMS.forEach(function(s){raw[s]=0;exp[s]=0;chap[s]={}});ADS.forEach(function(a){adapt[a]=0;adChap[a]={}});
 D.Q.forEach(function(q){var id=q[0],ch=q[1],opts=q[3],v=ans[id];
  if(v==='dep'){dep++;return}if(v==='skip'){skip++;return}if(!isIdx(v)||!opts[v])return;
  valid++;var K=parseKey(opts[v][1]);sitHits[id]=K;
  opts.forEach(function(o){var k=parseKey(o[1]);Object.keys(k.S).forEach(function(s){exp[s]+=k.S[s]/opts.length})});
  Object.keys(K.S).forEach(function(s){raw[s]+=K.S[s];chap[s][ch]=1;perCh[ch][s]=(perCh[ch][s]||0)+K.S[s]});
  Object.keys(K.A).forEach(function(a){adapt[a]+=K.A[a];adChap[a][ch]=1});
 });
 answered=valid+dep;
 /* послевкусие */
 var aft={},aftValid=0,aftN=0,aftPos={},aftNeg={},POSIT=['im13','im14','im16','im18'],NEGT=['im03','im08','im17','im22'];FAMS.forEach(function(s){aft[s]=0;aftPos[s]=0;aftNeg[s]=0});
 var posN=0,negN=0,aftChap={},CHOF={};D.Q.forEach(function(q){CHOF[q[0]]=q[1]});FAMS.forEach(function(s){aftChap[s]={}});
 D.AFTER_AT.forEach(function(id){var v=ans['af_'+id];if(!isIdx(v)||!D.AFTER[v])return;aftN++;var k=parseKey(D.AFTER[v][1]);if(!Object.keys(k.S).length)return;aftValid++;
  var isP=POSIT.indexOf(id)>=0;if(isP)posN++;else negN++;
  Object.keys(k.S).forEach(function(s){aft[s]+=k.S[s];aftChap[s][CHOF[id]]=1;if(isP)aftPos[s]+=k.S[s];else aftNeg[s]+=k.S[s]})});
 var scores={},levels={},lift={};
 FAMS.forEach(function(s){
  var beh=valid?raw[s]/valid:0,af=aftValid?aft[s]/aftValid:0,share=aftValid>=3?0.7*beh+0.3*af:beh,l=exp[s]?raw[s]/exp[s]:0,nc=Object.keys(Object.assign({},chap[s],af>=0.35&&aftValid>=4?aftChap[s]:{})).length;
  scores[s]=r2(share);lift[s]=r2(l);
  var lv=0;
  if(valid>=6){
   if(share>=0.1)lv=1;
   if(share>=0.2&&(l>=1.1||af>=0.35)&&nc>=2)lv=2;
   if(share>=0.33&&(l>=1.3||af>=0.4)&&nc>=3)lv=3;
  }
  levels[s]=lv});
 /* ведущие состояния */
 var status='complete',kind,lead=[],second=[];
 var ranked=FAMS.slice().sort(function(a,b){return scores[b]-scores[a]});
 var strong=ranked.filter(function(s){return levels[s]>=2});
 if(valid<12){kind='insufficient';status='insufficient'}
 else if(!strong.length){kind='even'}
 else{
  var top=scores[strong[0]];lead=strong.filter(function(s){return top-scores[s]<=0.06});second=strong.filter(function(s){return lead.indexOf(s)<0});
  var hasP=lead.some(function(s){return POS.indexOf(s)>=0}),hasN=lead.some(function(s){return NEG.indexOf(s)>=0});
  /* контекст: главы тянут в разные стороны */
  var chP=0,chN=0;perCh.forEach(function(m){var p=0,n=0;POS.forEach(function(s){p+=m[s]||0});NEG.forEach(function(s){n+=m[s]||0});if(p+n<1.5)return;var sh=p/(p+n);if(sh>=0.65)chP++;else if(sh<=0.35)chN++});
  /* противоположное состояние, подтвержденное послевкусием, становится частью смешанной картины */
  if(!(hasP&&hasN)){var opp=second.filter(function(s){return (hasP?NEG:POS).indexOf(s)>=0&&aftValid>=4&&aft[s]/aftValid>=0.4})[0];if(opp){lead=lead.concat([opp]);second=second.filter(function(s){return s!==opp});hasP=hasN=true}}
  if(chP>=1&&chN>=1&&chP+chN>=3)kind='contextual';
  else if(hasP&&hasN)kind='mixed';
  else if(hasN){
   var negAft=0;NEG.forEach(function(s){negAft+=aft[s]});negAft=aftValid?negAft/aftValid:0;
   if(lead.every(function(s){return levels[s]===3})&&negAft>=0.5)kind='negative';
   else kind='contextual';
  }
  else kind=lead.length>1?'several':'positive';
 }
 /* устойчивость удовлетворения: радость в поступках, но после хорошего остается нехватка */
 var unstableJoy=levels.S1>=1&&posN>=2&&(aftPos.S6+aftPos.S8+aftPos.S5)/posN>=0.5;
 /* адаптации как гипотезы */
 var adaptHyp=[];['A1','A2','A3','A4'].forEach(function(a){if(adapt[a]>=4&&Object.keys(adChap[a]).length>=3)adaptHyp.push(a)});
 adaptHyp.sort(function(a,b){return adapt[b]-adapt[a]});
 /* ресурсы */
 var res=[];
 if(adapt.A5>=4&&Object.keys(adChap.A5).length>=3)res.push('A5');
 if(adapt.A6>=4&&Object.keys(adChap.A6).length>=3)res.push('A6');
 var j=0;['im13','im15','im16','im18'].forEach(function(id){var K=sitHits[id];if(K&&K.S.S1)j++});if(j>=2)res.push('joy');
 var hp=0;['im05','im19','im20'].forEach(function(id){var K=sitHits[id];if(K&&K.A.A3)hp++});if(hp>=2)res.push('help');
 var rs=0;['im02','im06','im24'].forEach(function(id){var K=sitHits[id];if(K&&K.S.S1&&K.S.S3)rs++});if(rs>=2)res.push('rest');
 if(levels.S4>=2&&adapt.A6>=3)res.push('near');
 /* чувствительности (гипотезы, без названий) */
 function hit(ids,fam){var c=0;ids.forEach(function(id){var K=sitHits[id];if(K&&K.S[fam])c++});return c}
 var sens=[];if(hit(['im07','im12','im16'],'S7')>=2)sens.push('W1');if(hit(['im08','im10'],'S7')>=2)sens.push('W2');
 if(hit(['im16','im17','im14'],'S7')+hit(['im16','im17'],'S5')>=2&&(sitHits.im16||sitHits.im17))sens.push('W3');
 if(hit(['im09','im11','im08'],'S5')>=2)sens.push('W4');if(hit(['im04','im15','im21'],'S6')>=2)sens.push('W5');
 /* ситуации, где реакции сильнее: главы с наибольшей долей зон внимания */
 var hot=[];perCh.forEach(function(m,i){var n=0,t=0;FAMS.forEach(function(s){t+=m[s]||0;if(NEG.indexOf(s)>=0)n+=m[s]||0});if(t&&n/t>=0.45)hot.push(i)});
 var resources=POS.filter(function(s){return levels[s]>=2}),vuln=NEG.filter(function(s){return levels[s]>=2});
 return {algoVersion:1,valid:valid,answered:answered,dep:dep,skip:skip,scores:scores,levels:levels,lift:lift,raw:raw,adapt:adapt,
  aftertaste:{valid:aftValid,shown:aftN,share:FAMS.reduce(function(o,s){o[s]=aftValid?r2(aft[s]/aftValid):0;return o},{}),afterGood:aftPos,afterHard:aftNeg},
  kind:kind,status:status,leadingStates:lead,secondaryStates:second,unstableJoy:unstableJoy,adaptHyp:adaptHyp,res:res,sens:sens,hotChapters:hot,
  resources:resources,vulnerabilities:vuln,positive:kind==='positive'||kind==='several'}
}
/* ---------- тексты результата ---------- */
function gx(s,f){return String(s==null?'':s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return f?w:m})}
function interp(R,f){
 var F=D.FAM,o={};
 function t(s){return F[s].t}
 var L=R.leadingStates;
 if(R.kind==='insufficient'){o.head='Картина пока складывается';o.lead='Ответов пока мало, чтобы описать ведущее состояние. Пропуски и «зависит от обстоятельств» не считаются нулем, поэтому вывода здесь нет. Можно вернуться и ответить на большую часть ситуаций.'}
 else if(R.kind==='even'){o.head='Ровная картина';o.lead='Ни одно состояние не выделилось как ведущее. Это не пустота: ты по-разному реагируешь в разных обстоятельствах, и это гибкость. Ниже то, что все же заметно.'}
 else if(R.kind==='positive'){o.head=t(L[0]);o.lead=gx(F[L[0]].x,f)}
 else if(R.kind==='several'||R.kind==='mixed'||R.kind==='negative'||R.kind==='contextual'){
  var key=L.slice(0,2).sort().join('+');
  if(R.kind==='contextual'){o.head='Разное в разных обстоятельствах';o.lead='Твоя картина зависит от контекста: в одних сферах тебя ведет одно состояние, в других — другое. Мы не выбираем одно принудительно.'}
  else if(L.length>=2){o.head=t(L[0])+' · '+t(L[1]);o.lead=D.MIX[key]?gx(D.MIX[key],f):gx(F[L[0]].x,f)+' '+gx(F[L[1]].x,f)}
  else{o.head=t(L[0]);o.lead=gx(F[L[0]].x,f)}
  if(L.indexOf('S5')>=0&&R.adaptHyp.indexOf('A2')>=0&&!D.MIX[key])o.lead+=' '+gx(D.MIXCTRL,f);
 }
 o.good=R.resources.filter(function(s){return L.indexOf(s)<0||R.kind!=='positive'}).map(function(s){return {t:t(s),x:gx(F[s].x,f)}});
 R.res.forEach(function(k){o.good.push({t:'',x:gx(D.RES[k],f)})});
 if(!o.good.length&&R.kind!=='insufficient')o.good.push({t:'',x:gx('То, что ты {заметил|заметила} свои привычные состояния, уже дает выбор: замеченное можно менять маленькими шагами.',f)});
 o.attn=R.vulnerabilities.map(function(s){return {t:t(s),x:gx(F[s].x,f),g:gx(F[s].g,f)}});
 o.adapt=R.adaptHyp.slice(0,2).map(function(a){return {t:D.ADAPT[a].t,x:gx(D.ADAPT[a].x,f)}});
 o.sens=R.sens.map(function(w){return gx(D.SENS[w],f)});
 o.hot=R.hotChapters.map(function(i){return D.CH[i].t});
 o.points=[];L.concat(R.secondaryStates).slice(0,3).forEach(function(s){o.points.push(gx(F[s].g,f))});
 if(R.unstableJoy)o.after='После хороших событий у тебя может быстро возвращаться ощущение, что чего-то не хватает. Это содержательная закономерность: радость есть, но ее стоит закреплять.';
 else if(R.aftertaste.valid>=3){var a=R.aftertaste.share,pos=a.S1+a.S2+a.S3+a.S4,neg=a.S5+a.S6+a.S7+a.S8;o.after=pos>=neg?'Когда событие заканчивается, с тобой чаще остается что-то хорошее: спокойствие, радость, интерес или желание поделиться.':'Когда событие заканчивается, с тобой чаще остаются мысли и напряжение, даже если все сложилось неплохо.'}
 return o}
/* ---------- экран ---------- */
function mount(box){
 var G=window.GTests;if(!G)return;G.css();
 var esc=G.esc,h=G.h,g=G.g,f=G.fem(),preview=G.preview,KEY='alch_v5_profile';
 function load(){return G.load()}
 var P=load(),have=P.backgroundProfile;
 var items=[{k:'intro'}];
 D.Q.forEach(function(q,i){if(i%6===0)items.push({k:'chapter',c:q[1]});items.push({k:'sit',q:q});if(D.AFTER_AT.indexOf(q[0])>=0)items.push({k:'after',id:q[0]});if(i%6===5)items.push({k:'elder',c:q[1]})});
 var st={i:0,ans:{},hist:[]};
 function keep(){if(preview)return;var P=load();P.backgroundProfileDraft={i:st.i,ans:st.ans,at:Date.now()};G.persist(P)}
 function raw(id,v){if(preview||!window.GProfile)return;try{GProfile.recordRaw('backgroundProfile',id,v,{v:1})}catch(e){}}
 function set(id,v){st.ans[id]=v;raw(id,v)}
 function next(){st.hist.push(st.i);st.i++;keep();draw();scrollTo(0,0)}
 window.gBack=function(){if(st.hist.length){st.i=st.hist.pop();keep();draw();scrollTo(0,0);return true}return false};
 var qn=D.Q.length;
 function qIndex(id){for(var i=0;i<D.Q.length;i++)if(D.Q[i][0]===id)return i;return -1}
 function back(){return st.hist.length?'<button class="ar-skip" id="imBk" style="margin-right:14px">Назад</button>':''}
 function bindBack(){var b=box.querySelector('#imBk');if(b)b.onclick=function(){window.gBack()}}
 function scene(bg,inner){return '<div class="im-scene" style="background:'+bg+'">'+inner+'</div>'}
 function draw(){
  var it=items[st.i];if(!it){finish();return}
  if(it.k==='intro'){
   box.innerHTML='<span class="tag">Точка 0</span><span class="tag">Исследование</span>'+scene('radial-gradient(circle at 50% 30%,#3a2a14,#120e08 70%)','<div class="im-mirror"></div><span class="im-sd">Старец ставит перед тобой зеркало. В нем не лицо, а дороги.</span>')+
    '<div class="aq">Зеркало внутреннего мира</div><p>'+h('Одни и те же события приводят людей к разным результатам. Кто-то видит возможности, кто-то замечает ограничения. Иногда одни и те же ситуации повторяются в жизни, меняя только декорации.')+'</p><p>'+h('Ты пройдешь через четыре главы жизненных историй. Здесь нет правильных и неправильных ответов. Выбирай то, что ближе к твоему обычному поведению. Похожие ситуации повторяются намеренно: важен не отдельный ответ, а общая картина.')+'</p><p class="ar-ctx">Можно ответить «зависит от обстоятельств» или пропустить. Пропуск не считается нулем. Ответы сохраняются сами.</p><button class="next" id="imGo">'+(st.resume?'Продолжить':'Войти в зеркало')+'</button>';
   box.querySelector('#imGo').onclick=function(){if(st.resume){var at=st.resume;st.resume=0;st.hist=[];for(var k=0;k<at;k++)st.hist.push(k);st.i=at;keep();draw();scrollTo(0,0)}else next()};return}
  if(it.k==='chapter'){var C=D.CH[it.c];
   box.innerHTML=scene(C.bg,'<b>Глава '+C.n+'</b><div class="im-ct">'+esc(C.t)+'</div><span class="im-sd">'+h(C.d)+'</span>')+'<button class="next" id="imGo">Начать главу</button><div>'+back()+'</div>';
   box.querySelector('#imGo').onclick=next;bindBack();return}
  if(it.k==='elder'){var E=D.CH[it.c];
   box.innerHTML=scene('radial-gradient(circle at 50% 70%,#4a2d10,#120e08 70%)','<b>Старец</b><span class="im-sd" style="font-size:18px!important">'+h(E.elder)+'</span>')+'<button class="next" id="imGo">'+(it.c<3?'Дальше':'Посмотреть в зеркало')+'</button><div>'+back()+'</div>';
   box.querySelector('#imGo').onclick=next;bindBack();return}
  if(it.k==='sit'){var q=it.q,qi=qIndex(q[0]),cur=st.ans[q[0]],C2=D.CH[q[1]];
   box.innerHTML='<div class="al">Глава '+C2.n+' · ситуация '+(qi+1)+' из '+qn+'</div><div class="im-bar"><i style="width:'+Math.round(qi*100/qn)+'%"></i></div><div class="aq">'+h(q[2])+'</div><div id="gtOp">'+
    q[3].map(function(o,j){return '<button class="ao'+(cur===j?' ar-on':'')+'" data-c="'+j+'">'+h(o[0])+'</button>'}).join('')+
    '<button class="ao im-dep'+(cur==='dep'?' ar-on':'')+'" data-c="dep">Зависит от обстоятельств</button></div><div>'+back()+'<button class="ar-skip" id="imSk">Пропустить</button></div>';
   box.querySelectorAll('#gtOp button').forEach(function(b){b.onclick=function(){var c=b.dataset.c;set(q[0],c==='dep'?'dep':+c);try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}next()}});
   box.querySelector('#imSk').onclick=function(){set(q[0],'skip');next()};bindBack();return}
  if(it.k==='after'){var ca=st.ans['af_'+it.id];
   box.innerHTML='<div class="al">Послевкусие</div><div class="aq">'+h('Событие уже произошло. Все закончилось. Что обычно остается с тобой после подобных ситуаций?')+'</div><div id="gtOp">'+
    D.AFTER.map(function(o,j){return '<button class="ao'+(ca===j?' ar-on':'')+'" data-c="'+j+'">'+h(o[0])+'</button>'}).join('')+'</div><div>'+back()+'<button class="ar-skip" id="imSk">Пропустить</button></div>';
   box.querySelectorAll('#gtOp button').forEach(function(b){b.onclick=function(){set('af_'+it.id,+b.dataset.c);next()}});
   box.querySelector('#imSk').onclick=function(){set('af_'+it.id,'skip');next()};bindBack();return}
 }
 function build(ans){var R=score(ans),I=interp(R,f),P=load(),old=P.backgroundProfile;
  var rec={v:1,version:1,algoVersion:1,answers:ans,scores:R.scores,levels:R.levels,resources:R.resources,vulnerabilities:R.vulnerabilities,adaptations:R.adapt,adaptHyp:R.adaptHyp,resTraits:R.res,sens:R.sens,
   emotionalOutcomes:R.aftertaste,leadingStates:R.leadingStates,secondaryStates:R.secondaryStates,kind:R.kind,positive:R.positive,unstableJoy:R.unstableJoy,status:R.status,interpretation:{head:I.head,lead:I.lead},
   valid:R.valid,top:I.head,at:Date.now(),history:(old&&old.history)||[]};
  if(old&&old.at&&old.answers){var o2={};Object.keys(old).forEach(function(k){if(k!=='history')o2[k]=old[k]});rec.history.push(o2)}
  return {rec:rec,R:R,I:I}}
 function petals(R){var s='<svg class="im-pet" viewBox="-110 -110 220 220" width="220" height="220" aria-hidden="true"><circle r="100" fill="none" stroke="#6a4e28" stroke-dasharray="2 4"/>';
  ['S1','S2','S3','S4','S5','S6','S7','S8'].forEach(function(k,i){var a=(i*45-90)*Math.PI/180,len=18+Math.min(1,R.scores[k]/0.45)*80,pos=i<4,x=Math.cos(a)*len,y=Math.sin(a)*len,px=Math.cos(a+Math.PI/2)*9,py=Math.sin(a+Math.PI/2)*9;
   s+='<path d="M0 0 Q'+(x/2+px)+' '+(y/2+py)+' '+x+' '+y+' Q'+(x/2-px)+' '+(y/2-py)+' 0 0Z" fill="'+(pos?'#e0a940':'#6d605a')+'" opacity="'+(R.levels[k]>=2?.95:.45)+'"/>'});
  return s+'<circle r="10" fill="#f0c870"/></svg>'}
 function html(B){var R=B.R,I=B.I,o='<span class="tag">Точка 0</span><span class="tag">Зеркало</span><div class="al">Твое внутреннее зеркало</div>'+petals(R)+'<div class="aq">'+esc(I.head)+'</div><p>'+esc(I.lead)+'</p>';
  if(I.good.length)o+='<div class="gt-lv">Что у тебя уже хорошо работает</div>'+I.good.map(function(x){return '<p>'+(x.t?'<b>'+esc(x.t)+'.</b> ':'')+esc(x.x)+'</p>'}).join('');
  if(I.after)o+='<div class="gt-lv">Что остается после событий</div><p>'+esc(I.after)+'</p>';
  if(I.attn.length)o+='<div class="gt-lv">Чему стоит уделить внимание</div>'+I.attn.map(function(x){return '<p><b>'+esc(x.t)+'.</b> '+esc(x.x)+'</p>'}).join('');
  if(I.adapt.length)o+='<details class="ar-det"><summary>Привычные способы реагировать</summary>'+I.adapt.map(function(x){return '<p><b>'+esc(x.t)+'.</b> '+esc(x.x)+'</p>'}).join('')+'<p class="ar-ctx">Это гипотеза, а не установленный факт о твоем прошлом.</p></details>';
  if(I.sens.length||I.hot.length)o+='<details class="ar-det"><summary>Где реакции бывают сильнее</summary>'+I.sens.map(function(x){return '<p>'+esc(x)+'</p>'}).join('')+(I.hot.length?'<p>Чаще всего это заметно в главе: '+esc(I.hot.join(', ').toLowerCase())+'.</p>':'')+'<p class="ar-ctx">Возможная эмоциональная чувствительность, не диагноз.</p></details>';
  if(I.points.length)o+='<details class="ar-det"><summary>Твои точки переключения</summary>'+I.points.map(function(x){return '<p>— '+esc(x)+'</p>'}).join('')+'</details>';
  return o}
 function diary(B){var I=B.I,R=B.R;var lines=[];
  lines.push('Ведущее: '+I.head);
  if(R.secondaryStates.length)lines.push('Дополнительно: '+R.secondaryStates.map(function(s){return D.FAM[s].t}).join(', '));
  if(I.good.length)lines.push('Опоры: '+I.good.map(function(x){return x.t||x.x}).join('; '));
  if(I.after)lines.push('Послевкусие: '+I.after);
  if(I.attn.length)lines.push('Зоны внимания: '+I.attn.map(function(x){return x.t}).join(', '));
  if(I.adapt.length)lines.push('Привычные способы (гипотеза): '+I.adapt.map(function(x){return x.t}).join(', '));
  if(I.sens.length)lines.push('Чувствительность: '+I.sens.join(' '));
  if(I.hot.length)lines.push('Сильнее реакции: '+I.hot.join(', '));
  if(I.points.length)lines.push('Точки переключения: '+I.points.join(' '));
  lines.push('Дата: '+new Date().toLocaleDateString('ru-RU')+' · версия исследования 1');
  return {id:'inner_mirror',title:'Мое внутреннее зеркало',passed:'Зеркало внутреннего мира',lead:I.head+'. '+I.lead,strong:I.good.length?I.good.map(function(x){return x.t||x.x}).join('; '):'',insight:I.points[0]||'',insightMore:lines.join('\n'),answers:[]}}
 function show(ans,fresh){var B=build(ans);if(fresh&&!preview){var P=load();delete P.backgroundProfileDraft;G.persist(P);G.store('im',B.rec,'Зеркало внутреннего мира: '+B.I.head)}
  var built={html:html(B),diary:diary(B)};G.result(box,'im',built,function(){st={i:0,ans:{},hist:[]};draw()})}
 function finish(){show(st.ans,true)}
 css();
 if(have&&have.v&&have.answers&&!preview&&!G.retakeMode){show(have.answers,false);return}
 var dr=P.backgroundProfileDraft;if(dr&&dr.ans&&!preview){st.ans=dr.ans;var at=Math.max(0,Math.min(items.length-1,dr.i||0));if(at>0)st.resume=at}
 draw()}
function css(){if(document.getElementById('im-css'))return;var s=document.createElement('style');s.id='im-css';s.textContent=
 '.im-scene{border-radius:18px;padding:26px 18px;margin:10px 0 16px;text-align:center;color:#f4ecdf;border:1px solid #6a4e28;transition:background .6s}.im-scene b{display:block;font:700 14px Manrope,sans-serif;letter-spacing:.16em;color:#f0c870;text-transform:uppercase}.im-scene .im-sd{display:block;margin-top:8px;color:#efe3cf!important;font:500 16px/1.45 Manrope,sans-serif}.im-scene b{color:#f0c870!important}.im-scene .im-ct{color:#ffe9a8!important}.im-ct{font:700 28px/1.15 "Cormorant Garamond",serif;color:#ffe9a8;margin-top:6px}'+
 '.im-mirror{width:90px;height:120px;margin:0 auto 6px;border-radius:50% 50% 46% 46%;border:3px solid #c9a46a;background:radial-gradient(ellipse at 40% 30%,rgba(255,233,168,.55),rgba(80,60,30,.2) 60%,#120e08);box-shadow:0 0 30px rgba(240,200,112,.25)}'+
 '.im-bar{height:4px;border-radius:2px;background:rgba(201,164,106,.25);margin:4px 0 12px}.im-bar i{display:block;height:100%;border-radius:2px;background:linear-gradient(90deg,#a8692a,#ffd877)}'+
 '.ao.im-dep{opacity:.8;font-style:italic}.im-pet{display:block;margin:6px auto 4px}';document.head.appendChild(s)}
window.GInner={score:score,interp:interp,mount:mount,parseKey:parseKey};
})();
