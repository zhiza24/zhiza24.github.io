/* Общий звук игры: одна настройка на все страницы (localStorage alch_v5_sound = 'off' | 'on').
   Глушит аудио и звук видео (HTMLMediaElement) и синтезированные звуки (AudioContext).
   Подключается в <head> раньше сценариев страницы. Видео без звука продолжает играть. */
(function(){
'use strict';
if(window.GSound)return;
var KEY='alch_v5_sound',media=new Set(),ctxs=new Set(),ctx=null,unlocked=false;
function off(){try{return localStorage.getItem(KEY)==='off'}catch(e){return false}}
function apply(el){if(!el)return;if(off()){if(!el.muted){el.muted=true;el._gsMuted=true}}else if(el._gsMuted){el.muted=false;el._gsMuted=false}}
var MP=window.HTMLMediaElement&&HTMLMediaElement.prototype;
if(MP){var play=MP.play;MP.play=function(){media.add(this);apply(this);return play.apply(this,arguments)};
 var d=Object.getOwnPropertyDescriptor(MP,'muted');
 if(d&&d.set)Object.defineProperty(MP,'muted',{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){if(!v&&off()&&media.has(this)){d.set.call(this,true);this._gsMuted=true;return}d.set.call(this,v)}})}
['AudioContext','webkitAudioContext'].forEach(function(n){var C=window[n];if(!C)return;
 var W=function(){var c=new (Function.prototype.bind.apply(C,[null].concat([].slice.call(arguments))))();ctxs.add(c);if(off()){try{c.suspend()}catch(e){}}return c};
 W.prototype=C.prototype;window[n]=W});
function AC(){return window.AudioContext||window.webkitAudioContext}
function ensureCtx(){
 if(ctx)return ctx;
 var C=AC();if(!C)return null;
 ctx=new C();
 return ctx;
}
function unlock(){
 var c=ensureCtx();
 if(!c)return;
 if(c.state==='suspended'){try{c.resume()}catch(e){}}
 if(unlocked||off())return;
 try{
  var b=c.createBuffer(1,1,c.sampleRate||44100);
  var s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0);
  unlocked=true;
 }catch(e){}
}
function sync(){media.forEach(apply);document.querySelectorAll('audio,video').forEach(function(el){if(!el.paused||media.has(el)){media.add(el);apply(el)}});
 ctxs.forEach(function(c){try{off()?c.suspend():c.resume()}catch(e){}});
 document.querySelectorAll('.gsnd').forEach(paint)}
var ON='<path d="M3.5 9.5h3.3L11.5 5.6v12.8l-4.7-3.9H3.5z"/><path d="M15 9.2a4 4 0 0 1 0 5.6"/><path d="M17.6 6.6a7.6 7.6 0 0 1 0 10.8"/>',
    OFF='<path d="M3.5 9.5h3.3L11.5 5.6v12.8l-4.7-3.9H3.5z"/><path d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>';
function paint(b){var o=!off();b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f0c870" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(o?ON:OFF)+'</svg>';b.setAttribute('aria-label',o?'Выключить звук':'Включить звук');b.setAttribute('aria-pressed',o?'false':'true');b.title=o?'Звук включен':'Звук выключен'}
function set(on){try{localStorage.setItem(KEY,on?'on':'off')}catch(e){}sync()}
function button(){var b=document.createElement('button');b.type='button';b.className='gsnd';b.style.cssText='display:flex;align-items:center;justify-content:center';paint(b);b.onclick=function(e){e.preventDefault();set(off())};return b}

function rustle(){
 if(off())return;
 unlock();
 var c=ensureCtx();if(!c||c.state==='suspended')return;
 var dur=0.42,sr=c.sampleRate,n=Math.floor(sr*dur),buf=c.createBuffer(1,n,sr),d=buf.getChannelData(0);
 for(var i=0;i<n;i++){
  var t=i/sr;
  var e1=Math.exp(-t*7)*(t<0.05?t/0.05:1);
  var t2=t-0.09,e2=t2>0?Math.exp(-t2*9)*(t2<0.04?t2/0.04:1):0;
  d[i]=(Math.random()*2-1)*(e1*0.8+e2*0.45);
 }
 var src=c.createBufferSource();src.buffer=buf;
 var filt=c.createBiquadFilter();filt.type='bandpass';filt.frequency.value=1700;filt.Q.value=0.65;
 var g=c.createGain();g.gain.value=0.11;
 src.connect(filt);filt.connect(g);g.connect(c.destination);
 try{src.start()}catch(e){}
}
function clickSnd(){
 if(off())return;
 unlock();
 var c=ensureCtx();if(!c||c.state==='suspended')return;
 var now=c.currentTime;
 [[640,0.05,0.1],[980,0.028,0.08]].forEach(function(x){
  var o=c.createOscillator();o.type='sine';o.frequency.value=x[0];
  var g=c.createGain();
  g.gain.setValueAtTime(0,now);
  g.gain.linearRampToValueAtTime(x[1],now+0.008);
  g.gain.exponentialRampToValueAtTime(0.0001,now+x[2]);
  o.connect(g);g.connect(c.destination);
  o.start(now);o.stop(now+x[2]+0.02);
 });
 try{if(navigator.vibrate)navigator.vibrate(10)}catch(e){}
}

window.addEventListener('storage',function(e){if(e.key===KEY)sync()});
document.addEventListener('play',function(e){var t=e.target;if(t&&t.tagName&&/^(AUDIO|VIDEO)$/.test(t.tagName)){media.add(t);apply(t)}},true);
['pointerdown','touchstart','keydown'].forEach(function(ev){
 document.addEventListener(ev,function(){if(!off())unlock()},{capture:true,passive:true});
});
document.addEventListener('click',function(e){
 var t=e.target&&e.target.closest&&e.target.closest('button,input[type=button],input[type=submit],[role=button],.sun-btn');
 if(!t||t.disabled||t.getAttribute('aria-disabled')==='true')return;
 if(t.classList.contains('gsc-icon')||t.id==='gsc-icon'||t.classList.contains('gsnd')||t.id==='snd')return;
 clickSnd();
},true);

window.GSound={isOn:function(){return !off()},set:set,toggle:function(){set(off())},button:button,sync:sync,unlock:unlock,click:clickSnd,rustle:rustle};
})();
