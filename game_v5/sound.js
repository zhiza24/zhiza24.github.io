/* Общий звук игры: одна настройка на все страницы (localStorage alch_v5_sound = 'off' | 'on').
   Глушит аудио и звук видео (HTMLMediaElement) и синтезированные звуки (AudioContext).
   Подключается в <head> раньше сценариев страницы. Видео без звука продолжает играть. */
(function(){
'use strict';
if(window.GSound)return;
var KEY='alch_v5_sound',media=new Set(),ctxs=new Set();
function off(){try{return localStorage.getItem(KEY)==='off'}catch(e){return false}}
function apply(el){if(!el)return;if(off()){if(!el.muted){el.muted=true;el._gsMuted=true}}else if(el._gsMuted){el.muted=false;el._gsMuted=false}}
var MP=window.HTMLMediaElement&&HTMLMediaElement.prototype;
if(MP){var play=MP.play;MP.play=function(){media.add(this);apply(this);return play.apply(this,arguments)};
 var d=Object.getOwnPropertyDescriptor(MP,'muted');
 if(d&&d.set)Object.defineProperty(MP,'muted',{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){if(!v&&off()&&media.has(this)){d.set.call(this,true);this._gsMuted=true;return}d.set.call(this,v)}})}
['AudioContext','webkitAudioContext'].forEach(function(n){var C=window[n];if(!C)return;
 var W=function(){var c=new (Function.prototype.bind.apply(C,[null].concat([].slice.call(arguments))))();ctxs.add(c);if(off()){try{c.suspend()}catch(e){}}return c};
 W.prototype=C.prototype;window[n]=W});
function sync(){media.forEach(apply);document.querySelectorAll('audio,video').forEach(function(el){if(!el.paused||media.has(el)){media.add(el);apply(el)}});
 ctxs.forEach(function(c){try{off()?c.suspend():c.resume()}catch(e){}});
 document.querySelectorAll('.gsnd').forEach(paint)}
var ON='<path d="M3.5 9.5h3.3L11.5 5.6v12.8l-4.7-3.9H3.5z"/><path d="M15 9.2a4 4 0 0 1 0 5.6"/><path d="M17.6 6.6a7.6 7.6 0 0 1 0 10.8"/>',
    OFF='<path d="M3.5 9.5h3.3L11.5 5.6v12.8l-4.7-3.9H3.5z"/><path d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>';
function paint(b){var o=!off();b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f0c870" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(o?ON:OFF)+'</svg>';b.setAttribute('aria-label',o?'Выключить звук':'Включить звук');b.setAttribute('aria-pressed',o?'false':'true');b.title=o?'Звук включен':'Звук выключен'}
function set(on){try{localStorage.setItem(KEY,on?'on':'off')}catch(e){}sync()}
function button(){var b=document.createElement('button');b.type='button';b.className='gsnd';b.style.cssText='display:flex;align-items:center;justify-content:center';paint(b);b.onclick=function(e){e.preventDefault();set(off())};return b}
window.addEventListener('storage',function(e){if(e.key===KEY)sync()});
document.addEventListener('play',function(e){var t=e.target;if(t&&t.tagName&&/^(AUDIO|VIDEO)$/.test(t.tagName)){media.add(t);apply(t)}},true);
window.GSound={isOn:function(){return !off()},set:set,toggle:function(){set(off())},button:button,sync:sync};
})();
