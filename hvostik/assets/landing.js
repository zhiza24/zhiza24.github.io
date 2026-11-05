(function(){
  "use strict";

  /* burger */
  var burger=document.querySelector('.burger'), mnav=document.getElementById('mnav');
  if(burger&&mnav){
    burger.addEventListener('click',function(){
      var open=burger.getAttribute('aria-expanded')==='true';
      burger.setAttribute('aria-expanded',String(!open));
      burger.setAttribute('aria-label',open?'Открыть меню':'Закрыть меню');
      mnav.classList.toggle('open',!open);
      document.body.style.overflow=!open?'hidden':'';
    });
    mnav.addEventListener('click',function(e){
      if(e.target.tagName==='A'){
        burger.setAttribute('aria-expanded','false');
        mnav.classList.remove('open');
        document.body.style.overflow='';
      }
    });
  }

  /* copy card number */
  function copyText(t){
    if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(t);}
    return new Promise(function(res,rej){
      try{
        var ta=document.createElement('textarea');
        ta.value=t; ta.setAttribute('readonly','');
        ta.style.position='fixed'; ta.style.top='-1000px';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta); res();
      }catch(err){rej(err);}
    });
  }
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    var label=btn.textContent;
    btn.addEventListener('click',function(){
      copyText(btn.getAttribute('data-copy')).then(function(){
        btn.classList.add('is-done');
        btn.textContent='Номер скопирован';
        setTimeout(function(){btn.classList.remove('is-done');btn.textContent=label;},2200);
      }).catch(function(){
        btn.textContent='Не удалось, выделите номер';
      });
    });
  });

  /* amounts */
  var amounts=document.querySelectorAll('.amount'),
      impact=document.getElementById('impact'),
      cta=document.getElementById('donateCta'),
      chosen=1000;
  var text={
    500:'<b>500 ₽</b> — это 5 дней корма и обработок для одного питомца.',
    1000:'<b>1 000 ₽</b> — это 10 дней корма и обработок для одного питомца.',
    2000:'<b>2 000 ₽</b> — это три недели корма и обработок для одного питомца.'
  };
  function money(n){return n.toLocaleString('ru-RU').replace(/\u00A0/g,' ')+' ₽';}
  amounts.forEach(function(btn){
    btn.addEventListener('click',function(){
      var v=btn.getAttribute('data-amount');
      amounts.forEach(function(b){b.classList.remove('is-on');b.setAttribute('aria-pressed','false');});
      btn.classList.add('is-on'); btn.setAttribute('aria-pressed','true');
      if(v==='own'){
        var raw=window.prompt('Своя сумма в рублях','1500');
        var n=parseInt(String(raw||'').replace(/[^0-9]/g,''),10);
        if(!n||n<50){n=1500;}
        chosen=n;
        btn.textContent=money(n);
        impact.innerHTML='<b>'+money(n)+'</b> — сумма уйдет на корм, лечение и передержку подопечных фонда.';
      }else{
        chosen=parseInt(v,10);
        impact.innerHTML=text[v]||('<b>'+money(chosen)+'</b> — сумма уйдет на подопечных фонда.');
      }
      cta.textContent='Перевести '+money(chosen);
    });
  });

  /* modal */
  var data={
    dog1:{
      title:'Рекс',
      kicker:'На лечении · сбор открыт',
      img:'assets/img/dog1.jpg',
      alt:'Пес Рекс лежит в вольере и смотрит в камеру',
      sum:'собрано 6 800 из 15 000 ₽', pct:45, bar:'6 800 ₽', of:'из 15 000 ₽',
      text:[
        'Рекса сняли с цепи в промзоне на окраине: он лежал у бетонного забора и не поднимался. Возле него стояла миска с водой, в которой уже появился лед. Собаке на вид около трех лет, вес — 11 кг при норме 22.',
        'В клинике обнаружили сильное истощение и запущенную инфекцию уха. Первые четыре дня он получал капельницы и антибиотики. Есть начал только на пятый день, и то понемногу, с руки куратора.',
        'Сейчас Рекс ест сам, вес идет вверх, ухо обрабатывают каждый день. Он уже встает, когда слышит шаги, и подставляет голову под руку. С другими собаками пока осторожен, но агрессии нет.',
        'После курса лечения ему нужна передержка без маленьких детей и без кошек. Куратор ищет ее заранее, чтобы не держать собаку в клинике дольше, чем нужно.'
      ]
    },
    cat1:{
      title:'Марта',
      kicker:'Ищет дом · готова к переезду',
      img:'assets/img/cat1.jpg',
      alt:'Кошка Марта сидит на пледе у окна',
      pct:80, sum:'собрано 4 000 из 5 000 ₽', bar:'4 000 ₽', of:'из 5 000 ₽',
      text:[
        'Марту забрали из квартиры, где ее оставили после переезда хозяев. Она прожила в пустой комнате почти две недели, пока соседи не услышали мяуканье за дверью.',
        'Кошке около двух лет. Она стерилизована, лоток знает, к людям тянется сразу: выходит навстречу и ложится набок, чтобы погладили. К другим кошкам относится спокойно, но лучше ей быть единственной.',
        'Обследование показало, что Марта здорова. Осталось сделать две прививки и получить ветпаспорт — на это и идет сбор. Сумма небольшая, но для фонда важна каждая часть.',
        'Марта ищет дом без собак и без очень маленьких детей. Она спокойная, почти не мяукает и любит сидеть на подоконнике. Куратор привезет ее сам и поможет с адаптацией.'
      ]
    },
    dog2:{
      title:'Булат',
      kicker:'Передержка · социализация',
      img:'assets/img/dog2.jpg',
      alt:'Пес Булат лежит на пледе и смотрит в камеру',
      pct:30, sum:'собрано 3 600 из 12 000 ₽', bar:'3 600 ₽', of:'из 12 000 ₽',
      text:[
        'Булат провел на цепи четыре года. Его забрали после того, как соседи написали, что собака перестала вставать и скулит круглые сутки. Хозяин отдал его без разговоров.',
        'Первые дни он боялся поводка и прижимался к стене, когда к нему подходили. Сейчас учится ходить рядом, спокойно реагирует на улицу и уже спит в комнате, а не у двери.',
        'Нужен курс занятий с кинологом и лечение кожи — от постоянного лежания на бетоне появились залысины. Сбор покрывает занятия, анализы и мази.',
        'Булату ищут дом за городом или в частном секторе, где можно гулять без толпы. Он не агрессивный, но ему нужно время, чтобы поверить человеку. Куратор будет рядом столько, сколько потребуется.'
      ]
    },
    cat2:{
      title:'Уголек',
      kicker:'Новый · только с передержки',
      img:'assets/img/cat2.jpg',
      alt:'Черный котенок Уголек сидит в переноске',
      pct:15, sum:'собрано 1 500 из 10 000 ₽', bar:'1 500 ₽', of:'из 10 000 ₽',
      text:[
        'Уголька нашли в переноске у мусорных контейнеров. Ему около четырех месяцев, он был один, без воды и без матери. Котенок просидел там, по словам очевидцев, не меньше суток.',
        'Первые часы он шипел на всех, но уже к вечеру уснул на руках у куратора. Сейчас ест самостоятельно, играет с бумажным шариком и не боится пылесоса.',
        'Нужны две прививки, кастрация по возрасту и обработка от паразитов. Сбор небольшой: основное — это время, которое котенок проведет на передержке до пристройства.',
        'Уголек ищет дом, где будет кто-то дома днем. Он очень контактный и плохо переносит одиночество. К лотку приучен, ест сухой корм для котят.'
      ]
    }
  };

  var dlg=document.getElementById('storyModal');
  if(dlg&&typeof dlg.showModal==='function'){
    var mImg=document.getElementById('modalImg'), mTitle=document.getElementById('modalTitle'),
        mKick=document.getElementById('modalKicker'), mStory=document.getElementById('modalStory'),
        mBar=document.getElementById('modalBar'), mFill=document.getElementById('modalBarFill'),
        mSum=document.getElementById('modalSum'), mPct=document.getElementById('modalPct');

    window.__openCard=function(k){openCard(k);};
    function openCard(key){
      var d=data[key]; if(!d)return;
      mImg.src=d.img; mImg.alt=d.alt;
      mTitle.textContent=d.title; mKick.textContent=d.kicker;
      mStory.innerHTML=d.text.map(function(p){return '<p>'+p+'</p>';}).join('');
      mFill.style.width=d.pct+'%';
      mBar.setAttribute('aria-valuenow',String(d.pct));
      mSum.textContent=d.sum; mPct.textContent=d.pct+'%';
      buildPay(document.getElementById('modalPay'),d.title);
      dlg.showModal();
    }

    document.querySelectorAll('.card').forEach(function(card){
      var key=card.getAttribute('data-story');
      card.querySelectorAll('.card__media,.card__title').forEach(function(t){
        t.addEventListener('click',function(){openCard(key);});
      });
    });

    dlg.addEventListener('click',function(e){
      if(e.target===dlg||e.target.closest('[data-close]')){dlg.close();}
    });
    dlg.addEventListener('keydown',function(e){if(e.key==='Escape'){dlg.close();}});
  }


  /* per-pet pay */
  function buildPay(box,name){
    if(!box)return;
    box.innerHTML='<div class="pay__amts"><button type="button" data-a="300">300 ₽</button><button type="button" data-a="700" class="is-on">700 ₽</button><button type="button" data-a="1500">1 500 ₽</button><button type="button" data-a="own">Любая сумма</button></div>'+
      '<div class="pay__card">Переведите <span class="pay__sum">700 ₽</span> для: '+name+'<b>2200 1520 5952 1024</b>Карта Альфа-Банк фонда</div>'+
      '<button class="btn btn--accent btn--sm btn--block pay__copy" type="button">Скопировать номер карты</button>';
    var sum=box.querySelector('.pay__sum');
    box.querySelectorAll('.pay__amts button').forEach(function(b){b.addEventListener('click',function(){
      box.querySelectorAll('.pay__amts button').forEach(function(x){x.classList.remove('is-on');});
      b.classList.add('is-on'); var a=b.getAttribute('data-a');
      if(a==='own'){var n=parseInt(String(window.prompt('Сумма в рублях','1000')||'').replace(/[^0-9]/g,''),10)||1000;b.textContent=n.toLocaleString('ru-RU')+' ₽';sum.textContent=b.textContent;}
      else sum.textContent=b.textContent;
    });});
    var cp=box.querySelector('.pay__copy');
    cp.addEventListener('click',function(){copyText('2200152059521024').then(function(){cp.textContent='Номер скопирован';});});
  }
  document.querySelectorAll('.card').forEach(function(card){
    var btn=card.querySelector('.card__help'),box=card.querySelector('.card__pay');
    if(!btn||!box)return;
    btn.addEventListener('click',function(){
      if(box.hidden){buildPay(box,card.querySelector('.card__title').textContent);box.hidden=false;btn.textContent='Скрыть';}
      else{box.hidden=true;btn.textContent='Помочь';}
    });
  });
  document.querySelectorAll('[data-open]').forEach(function(b){b.addEventListener('click',function(){if(window.__openCard)window.__openCard(b.getAttribute('data-open'));});});

  /* reveal on scroll */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
    },{rootMargin:'0px 0px -8% 0px',threshold:0.08});
    document.querySelectorAll('.hero__photo,.story__photo,.story__body,.card,.steps li,.numbers__grid li,.miska__photo,.miska__body,.opeka__photo,.opeka__body,.reqs__card,.final__in').forEach(function(el){
      el.classList.add('rv'); io.observe(el);
    });
  }
})();
