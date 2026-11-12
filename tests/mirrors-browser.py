"""Isolated Chromium checks: no user desktop or signed-in browser profile."""
import functools, http.server, json, pathlib, threading
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=pathlib.Path('/workspace/mirrors-test-output'); OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/game_v4/'
seed={'name':'Тест','gender':'f','birth':'10.02.1979','flow':{'version':2,'current':'slot.html?id=mirrors','last':'slot.html?id=mirrors','completed':{'wheel-test.html':1}},'diary':{'ins':[],'q':[]}}
def click(page,text): page.locator('#m').get_by_role('button',name=text,exact=True).click()
def shot(page,name):
    page.evaluate('scrollTo(0,0)');page.screenshot(path=str(OUT/name),full_page=True)
def no_overflow(page):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal overflow'
    for size in page.locator('#m button').evaluate_all('(buttons)=>buttons.map(b=>b.getBoundingClientRect().height)'):
        assert size>=47, f'Touch target {size}'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,timezone_id='Europe/Moscow')
    context.route('**/upd.js*',lambda route:route.fulfill(body=''))
    context.route('https://fonts.googleapis.com/**',lambda route:route.fulfill(body=''))
    page=context.new_page(); errors=[]; page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(base+'tasks.html')
    page.evaluate('(seed)=>localStorage.setItem("alch_profile",JSON.stringify(seed))',seed);page.goto(base+'slot.html?id=mirrors')
    no_overflow(page);shot(page,'intro-mobile.png')
    click(page,'Посмотреть в первое зеркало')
    for i in range(6):
        page.locator('[data-option=A]').click()
        if i==0:
            no_overflow(page);shot(page,'question-mobile.png')
            page.reload();assert page.locator('[data-option=A]').get_attribute('aria-pressed')=='true'
        click(page,'Завершить первое зеркало' if i==5 else 'Далее')
    click(page,'Перейти ко второму зеркалу')
    for i in range(6):
        page.locator('[data-option=B]').click()
        if i==2:
            more=page.locator('#m details').filter(has=page.get_by_text('Конкретный пример (необязательно)',exact=True))
            more.locator('summary').click();more.locator('textarea').fill('Мой пример из жизни')
            page.reload();assert page.evaluate('JSON.parse(localStorage.alch_profile).mirrors.draft.actual_actions.desire.example')=='Мой пример из жизни'
        click(page,'Совместить зеркала' if i==5 else 'Далее')
    assert page.locator('.mirror-pair').count()==6
    page.locator('.mirror-pair summary').first.click();no_overflow(page)
    shot(page,'comparison-mobile.png')
    click(page,'Что я замечаю');page.locator('[data-observation=C]').click();page.locator('[data-cause=external]').click()
    page.reload();assert page.locator('[data-cause=external]').get_attribute('aria-pressed')=='true'
    no_overflow(page);click(page,'Сохранить наблюдение')
    state=page.evaluate('JSON.parse(localStorage.alch_profile)');assert len(state['mirrors']['history'])==1
    assert state['flow']['current']=='slot.html?id=source';assert len(state['diary']['ins'])==1
    shot(page,'result-mobile.png')
    click(page,'Дальше: Источник');page.wait_for_url('**/slot.html?id=source')
    assert 'Я обнаружила' in page.locator('#m').inner_text()
    # Actual browser back and reload, then read-only review through diary.
    page.go_back();page.wait_for_url('**/tasks.html?review=**');assert 'Просмотр пройденного' in page.locator('#tasks').inner_text();page.reload();assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.goto(base+'diary.html?tab=tests');page.locator('a[href*="review="]').click()
    before=page.evaluate('localStorage.alch_profile');page.reload();assert page.evaluate('localStorage.alch_profile')==before
    assert page.locator('#m button').count()==0
    # Narrow phone and desktop rendering of open answer cards.
    page.locator('.mirror-pair summary').first.click()
    page.set_viewport_size({'width':320,'height':640});no_overflow(page)
    page.set_viewport_size({'width':1280,'height':900});no_overflow(page);shot(page,'review-desktop.png')
    assert not errors,errors
    # Preview does not mutate the live route, even after interaction and reload.
    before=page.evaluate('localStorage.alch_profile');page.goto(base+'slot.html?id=mirrors&preview=1')
    click(page,'Посмотреть в первое зеркало');page.locator('[data-option=F]').click();page.reload()
    assert page.evaluate('localStorage.alch_profile')==before
    assert page.locator('[data-option=F]').get_attribute('aria-pressed')=='true'
    report={'result':'PASS','browser':browser.version,'viewports':[320,390,1280],'runtime_errors':errors,'checks':['full 12-answer flow','reload and optional example','mobile touch targets and no overflow','explicit completion and diary','source context','browser back','read-only no mutation','preview isolation']}
    (OUT/'browser-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False))
    context.close();browser.close()
server.shutdown()
