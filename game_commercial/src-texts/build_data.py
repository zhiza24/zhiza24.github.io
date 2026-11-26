# Сборка tests-data.js: запускать из папки src-texts (python3 build_data.py).
import re, json
KIT=open('./kit.md',encoding='utf8').read()
Q=open('./questions.md',encoding='utf8').read()
def unwrap(t): return re.sub(r'\s*\n\s*',' ',t.strip()).replace('---','—').replace('--','–')
def section(text,start,end):
    i=text.index(start); j=text.index(end,i+len(start)) if end else len(text); return text[i:j]
def levels(block):
    out={}
    for h,body in re.findall(r'^## (.+?)\n(.*?)(?=^## |^### |^# |\Z)',block,re.S|re.M):
        lv=re.findall(r'\*\*(\d+)--(\d+)\.\*\*\s*(.*?)(?=\n\s*\n|\Z)',body,re.S)
        if len(lv)==4: out[h.strip()]=[unwrap(x[2]) for x in lv]
    return out
SVk=levels(section(KIT,'# 1. Самоценность','# 2. Ответственность'))
RSk=levels(section(KIT,'# 2. Ответственность','# 3. Кривой Мир'))
KMk=levels(section(KIT,'# 3. Кривой Мир','# Тексты результатов для игры --- пакет 2А'))
CTk=levels(section(KIT,'# 4. Критическое мышление','## Пояснения к 12 ситуациям'))
def para(block,label):
    m=re.search(r'\*\*'+re.escape(label)+r'\*\*\s*(.*?)(?=\n\s*\n|\Z)',block,re.S); return unwrap(m.group(1)) if m else None
svAll=unwrap(re.search(r'### Общий результат, если выраженных затруднений нет\n\n(.*?)\n\n---',KIT,re.S).group(1))
rsB=section(KIT,'### Два дополнительных перекоса','### Если вопросы пропущены')
rsSkew={'over':para(rsB,'Беру лишнее на себя.'),'away':para(rsB,'Ухожу от своего.')}
kmB=section(KIT,'### Несколько равных ведущих шкал','**Техническое правило')
km2=unwrap(re.search(r'\*\*Две шкалы:\*\* «(.*?)»',kmB,re.S).group(1)); km3=unwrap(re.search(r'\*\*Три и более шкал:\*\* «(.*?)»',kmB,re.S).group(1))
ldB=section(KIT,'# 5. Лабиринт желаний','# Тексты результатов для игры --- пакет 2Б')
ldR={k:para(ldB,k) for k in ['Направление уже обозначено.','Желание есть, формулировка пока размыта.','Два желания конкурируют.','Желание соседствует с сопротивлением.','Сейчас трудно услышать собственное желание.','Недостаточно данных.']}
ldG={k:para(ldB,k) for k in ['Защита.','Предсказуемость.','Принадлежность.','Привычная идентичность.','Немедленное облегчение.','Реальное ограничение ресурса.']}
ldPrice=unwrap(re.search(r'## Цена перемен\n\n(.*?)\n\n## ',ldB,re.S).group(1))
fsB=section(KIT,'# 6. Первые настройки','# 7. Профиль')
fsIntro=unwrap(re.search(r'## Вводный текст сравнения\n\n(.*?)\n\n## ',fsB,re.S).group(1))
fsS={}
for h in ['Замирание и ожидание','Контроль и самостоятельное удерживание','Подстройка и сохранение контакта','Уход в себя и дистанция']:
    b=section(fsB,'## '+h,'\n## ')
    fsS[h]={k:para(b,lab) for k,lab in [('child','Детство:'),('now','Сейчас:'),('kept','Если сохранилось:'),('changed','Если изменилось:')]}
fsSp={k:para(fsB,k) for k in ['Не помню.','Не было.','Недостаточно данных.']}
fsR={k:para(fsB,k) for k in ['Стратегия сохранилась.','Стратегия ослабла.','Стратегия изменилась.','Стратегия появилась позже.','Совпадение не выявлено.']}
piB=section(KIT,'# 7. Профиль','# Тексты результатов для игры --- пакет 2В')
piNone=unwrap(re.search(r'Пояснение под ответом: «(.*?)»',piB,re.S).group(1))
piBal={k:para(piB,k) for k in ['Логика / Этика.','Сенсорика / Интуиция.','Экстраверсия / Интроверсия.','Рациональность / Иррациональность.']}
piLim=para(piB,'Ограничение:')
s9=section(KIT,'# 9. Связки','# 10.')
svToVal=unwrap(re.search(r'\*\*Самоценность → ценности\.\*\* «(.*?)»',s9,re.S).group(1))
valToR=unwrap(re.search(r'\*\*Ценности → Реактор\.\*\* «(.*?)»',s9,re.S).group(1))
for name,d in [('SV',SVk),('RS',RSk),('KM',KMk),('CT',CTk)]: assert len(d)==6,(name,list(d))
# ---- questions
def rows(block,n):
    out=[]
    for line in block.splitlines():
        if line.startswith('| ') and not line.startswith('| --') :
            c=[x.strip() for x in line.strip().strip('|').split('|')]
            if len(c)>=n and re.match(r'^[A-Z]{2,4}\d',c[0]): out.append(c)
    return out
def likert(start,end,prefix):
    b=section(Q,start,end); return rows(b,4)
SVq=likert('# 1. САМ','# 2. ОТВЕТ','SV');RSq=likert('# 2. ОТВЕТ','## Дополнительные перекосы','RS');RXq=rows(section(Q,'## Дополнительные перекосы','# 3. КРИВОЙ'),4)
KMq=likert('# 3. КРИВОЙ','# 4. КРИТ','KM');CTq=likert('## 4.1.','## 4.2.','CT')
sit=[]
for part in section(Q,'## 4.2.','# 5. ЛАБИРИНТ').split('### Ситуация ')[1:]:
    head,rest=part.split('\n',1)
    num,h=head.split('. ',1)
    sid=re.search(r'ID: (CTSC\d+)',rest).group(1)
    t=re.search(r'ID: CTSC\d+\n\n(.*?)\n\n- A',rest,re.S).group(1).strip()
    opts=re.findall(r'^- ([ABC])\. (.*)$',rest,re.M)
    key=re.search(r'Ключ: ([ABC])',rest).group(1)
    exp={}
    for line in rest.splitlines():
        mm=re.match(r'\|\s*([ABC])\s*\|\s*(.*?)\s*\|$',line)
        if mm: exp[mm.group(1)]=mm.group(2)
    sit.append({'id':sid,'h':h.strip(),'t':t,'o':[[x,y.strip()] for x,y in opts],'key':key,'ex':exp})
assert len(sit)==12 and all(len(s['ex'])==3 for s in sit),len(sit)
LDq=rows(section(Q,'# 5. ЛАБИРИНТ','### Условия показа результатов'),3)
FSch=rows(section(Q,'## 6.1.','## 6.2.'),3);FScu=rows(section(Q,'## 6.2.','### Правило подсчета'),3)
PIq=rows(section(Q,'# 7.','### Правило подсчета'),4)
assert (len(SVq),len(RSq),len(RXq),len(KMq),len(CTq),len(LDq),len(FSch),len(FScu),len(PIq))==(24,24,4,24,24,15,12,12,32),(len(SVq),len(RSq),len(RXq),len(KMq),len(CTq),len(LDq),len(FSch),len(FScu),len(PIq))
# ---- gender and typo fixes (all listed in written_by_bot.md)
G=[('что сделал не так','что {сделал|сделала} не так'),('не уверен,','не {уверен|уверена},'),('Если ты ошибся','Если ты {ошибся|ошиблась}'),('теперь обязан','теперь {обязан|обязана}'),
('что разочаровал','что {разочаровал|разочаровала}'),('мало сделал','мало {сделал|сделала}'),('не успел.','не {успел|успела}.'),('что должен срочно','что {должен|должна} срочно'),
('уже все исправил','уже все {исправил|исправила}'),('выполнить общую задачу самому','выполнить общую задачу {самому|самой}'),('не справился с задачей','не {справился|справилась} с задачей'),
('что ты стал хуже','что ты {стал|стала} хуже'),('быть полезным','быть {полезным|полезной}'),('ты готов пересмотреть','ты {готов|готова} пересмотреть'),('способен повлиять','{способен|способна} повлиять'),
('ты об этом подумал','ты об этом {подумал|подумала}'),('ты готов изменить','ты {готов|готова} изменить'),('публично высказал','публично {высказал|высказала}'),
('ты хотел бы','ты {хотел|хотела} бы'),('ты реально готов','ты реально {готов|готова}'),('Ты попал','Ты {попал|попала}'),
('ты замолкал и ждал','ты {замолкал|замолкала} и {ждал|ждала}'),('ты долго ждал','ты долго {ждал|ждала}'),('ты старался','ты {старался|старалась}'),('Ты старался','Ты {старался|старалась}'),
('Ты предпочитал','Ты {предпочитал|предпочитала}'),('Ты следил','Ты {следил|следила}'),('Ты соглашался с близкими, даже если хотел','Ты {соглашался|соглашалась} с близкими, даже если {хотел|хотела}'),
('Ты скрывал','Ты {скрывал|скрывала}'),('ты уходил','ты {уходил|уходила}'),('выполнить задачу самому','выполнить задачу {самому|самой}'),('как передал','как {передал|передала}'),('чего хочешь сам.','чего хочешь {сам|сама}.'),
# kit texts
('быть заметным','быть {заметным|заметной}'),('быть требовательным','быть {требовательным|требовательной}'),('из из первых','из первых'),('был неправильно.','был неправильным.'),
('что ты виноват','что ты {виноват|виновата}'),('ты редко ищешь','Ты редко ищешь'),('ты заключил','ты {заключил|заключила}'),('лично заинтересован','лично {заинтересован|заинтересована}'),
('учитываешь новые факты и уточнять','учитываешь новые факты и уточняешь'),('если бы я впервые увидел','если бы я впервые {увидел|увидела}'),('Ты смог назвать','Ты {смог|смогла} назвать'),('ты увидел','ты {увидел|увидела}'),('поступок был неправильно','поступок был неправильным')]
used=set()
def fx(s):
    for a,b in G:
        if a in s: s=s.replace(a,b); used.add(a)
    return s
def deep(o):
    if isinstance(o,str): return fx(o)
    if isinstance(o,list): return [deep(x) for x in o]
    if isinstance(o,dict): return {k:deep(v) for k,v in o.items()}
    return o
def scales(qs,kit,order):
    sc=[];names=[]
    for r in qs:
        if r[2] not in names: names.append(r[2])
    for i,n in enumerate(names):
        assert n in kit,(n,list(kit)); items=[{'id':r[0],'t':r[1],'rev':r[3].startswith('Обрат')} for r in qs if r[2]==n]
        assert len(items)==4 and sum(x['rev'] for x in items)==2,(n,items)
        sc.append({'id':items[0]['id'].split('_')[0],'name':n,'items':items,'lv':kit[n]})
    return sc
D={'v':1,
 'sv':{'scales':scales(SVq,SVk,None),'allClear':svAll},
 'rs':{'scales':scales(RSq,RSk,None),'skew':{'over':{'name':'Беру лишнее на себя','items':[RXq[0][0],RXq[1][0]],'t':rsSkew['over']},'away':{'name':'Ухожу от своего','items':[RXq[2][0],RXq[3][0]],'t':rsSkew['away']}},'rx':[{'id':r[0],'t':r[1]} for r in RXq]},
 'km':{'scales':scales(KMq,KMk,None),'two':km2,'many':km3},
 'ct':{'scales':scales(CTq,CTk,None),'sit':sit},
 'ld':{'q':[{'id':r[0],'t':r[1],'f':r[2]} for r in LDq],'res':ldR,'gain':ldG,'price':ldPrice},
 'fs':{'intro':fsIntro,'child':[{'id':r[0],'t':r[1],'s':r[2]} for r in FSch],'now':[{'id':r[0],'t':r[1],'s':r[2]} for r in FScu],'str':fsS,'sp':fsSp,'res':fsR},
 'pi':{'q':[{'id':r[0],'t':r[1],'p1':r[2],'p2':r[3]} for r in PIq],'none':piNone,'bal':piBal,'lim':piLim},
 'link':{'svToValues':svToVal,'valuesToReactor':valToR}}
G.append(('Можешь быть внимательным','Можешь быть {внимательным|внимательной}'))
RX3='В общем деле ты ждешь, что первый шаг сделает кто-то другой, даже когда он доступен и тебе.'
D['rs']['rx'][2]['t']=RX3
def dot(x): return x if x[-1] in '.!?»' else x+'.'
for k in ('two','many'): D['km'][k]=dot(D['km'][k])
D['pi']['none']=dot(D['pi']['none'])
D['pi']['lim']=D['pi']['lim'][0].upper()+D['pi']['lim'][1:]
for k in D['link']: D['link'][k]=dot(D['link'][k])
D=deep(D)
unused=[a for a,b in G if a not in used]
js='/* Тексты и вопросы семи тестов. Источники: комплект текстов 12.11.2026 (src-texts/kit.md) и вопросы 12.11.2026 (src-texts/questions.md).\n   Файл собран скриптом, тексты дословные, кроме правок, перечисленных в written_by_bot.md. Запись {м|ж} = форма по полу игрока. */\nwindow.GTESTS='+json.dumps(D,ensure_ascii=False,indent=0)+';\n'
open('../tests-data.js','w',encoding='utf8').write(js)
print('unused fixes:',unused); print('\u0451' in js)
print(json.dumps(D['ld']['res'],ensure_ascii=False)[:300])
