/* Цитата из Книги Алхимика на экране результата: одна дословная фраза из главы шага + тихая кнопка «Открыть главу».
   Тексты скопированы дословно из tochka-book.js (глава n, раздел s для ридера). Только для экранов результата. */
(function(){
if(window.GQuote)return;
var Q={
'ego.html':[7,-1,'Это чувство часто является не реакцией на конкретную ситуацию, а уже существующей внутренней настройкой.'],
'slot.html?id=arch_b':[7,-1,'Ваша реакция — это не вы. Это результат работы внутренней системы, которая пытается сохранить знакомый порядок.'],
'slot.html?id=arch_v':[4,1,'Мозг постоянно выделяет то, что соответствует текущему состоянию, опыту и внутренней настройке.'],
'slot.html?id=arch_p':[5,2,'Именно в настоящем моменте человек возвращает себе возможность влиять на собственное восприятие, решения и действия.'],
'slot.html?id=arch_d':[8,-1,'Сначала меняется точка, из которой вы себя ощущаете, а затем постепенно меняется все остальное.'],
'sum.html':[4,-1,'Фокус внимания определяет, какая часть окружающего мира становится значимой для человека.'],
'fin.html':[11,-1,'Мой внутренний узор — это не я. Я могу наблюдать его и выбирать иначе.'],
'slot.html?id=pa_end':[11,-1,'Меняя состояние, из которого вы встречаете жизнь, вы меняете направление внимания, восприятия и действий.'],
'slot.html?id=pb_end':[8,-1,'Все эти состояния остаются частью опыта, но они перестают быть единственной возможной реальностью.'],
'slot.html?id=sv':[6,-1,'Самоценность находится до любой оценки. Она начинается с простого факта: Я есмь.'],
'slot.html?id=vsort':[6,-1,'Здесь появляется пространство выбора. Пространство, в котором больше не нужно оправдываться или стесняться своих желаний.'],
'slot.html?id=km':[3,-1,'В детстве человек не выбирает свою систему координат.'],
'slot.html?id=fs':[3,-1,'В детстве человек еще не обладает развитым критическим мышлением. Он не сравнивает разные модели реальности и не выбирает, какие из них подходят ему.'],
'slot.html?id=lab_d':[3,-1,'Так человек постепенно учится лучше чувствовать чужие ожидания, чем собственные желания.'],
'slot.html?id=ct':[4,-1,'А ведущий внутренний узор задает привычный способ интерпретации происходящего, окрашивая восприятие событий еще до того, как человек успевает их осознанно оценить.'],
'slot.html?id=rs':[4,-1,'Мы не можем контролировать все события, происходящие вокруг нас. Но можем осознавать, куда направлено наше внимание и какое состояние мы поддерживаем в настоящем моменте.'],
'slot.html?id=pi':[3,-1,'Внутренняя система человека не появляется готовой. Она формируется постепенно под влиянием опыта, отношений и способов взаимодействия с окружающим миром.'],
'slot.html?id=dialog':[5,-1,'По мере осознания человек постепенно перестает жить только из автоматической реакции и начинает замечать, из какой позиции он встречается с происходящим.'],
'slot.html?id=compare':[11,-1,'Каждое возвращение в состояние «Я есмь» — это не просто момент спокойствия. Это сигнал новой настройки системы.']};
var TT=['Приветствие','Возвращение к себе','Карта исследования','Уровень I. Создание внутреннего узора','Уровень II. Фокус внимания','Уровень III. Новая позиция','Уровень IV. Пересборка внутреннего узора','Инструмент самодиагностики','Новая точка сборки','Практика «Я есмь»','Новая настройка системы','Карта пройденного пути'];
function css(){if(document.getElementById('gq-css'))return;var s=document.createElement('style');s.id='gq-css';s.textContent=
'.gq{margin:22px 0 14px;padding:12px 14px 12px 16px;border-left:2px solid #c99a45;text-align:left}'+
'.gq-c{font:700 11px Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#a8762f;margin:0 0 6px}'+
'.gq-t{font:500 18.5px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,"Segoe UI",Roboto,sans-serif;font-style:normal;color:inherit;margin:0 0 10px}'+
'.gq-b{display:inline-flex;align-items:center;gap:6px;background:transparent!important;border:1px solid rgba(201,154,69,.7)!important;color:#a8762f!important;border-radius:18px;padding:7px 14px;font:700 13px Manrope,sans-serif;cursor:pointer;width:auto!important;margin:0!important;box-shadow:none!important}'+
'[data-theme=dark] .gq-c,[data-theme=dark] .gq-b{color:#e0b860!important}';
document.head.appendChild(s)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function openCh(q){function go(){window.GBook&&GBook.openChapter(q[0],q[1],'path')}
 if(window.GBook)return go();var s=document.createElement('script');s.src='book.js?v=b6';s.onload=go;document.head.appendChild(s)}
/* add(контейнер, ключ шага, [элемент, перед которым вставить]) — не больше одной цитаты на экран */
function add(box,key,before){var q=Q[key];if(!q||!box||document.querySelector('.gq'))return null;css();
 var d=document.createElement('div');d.className='gq';
 d.innerHTML='<p class="gq-c">Книга Алхимика · '+esc(TT[q[0]])+'</p><p class="gq-t">'+esc(q[2])+'</p><button type="button" class="gq-b">Открыть главу</button>';
 d.querySelector('.gq-b').onclick=function(e){e.preventDefault();e.stopPropagation();openCh(q)};
 if(before&&before.parentNode===box)box.insertBefore(d,before);else box.appendChild(d);return d}
window.GQuote={add:add,Q:Q};
})();
