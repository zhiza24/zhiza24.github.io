"""Original visual scenes must remain visible without replaying saves or route advances."""
import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=pathlib.Path('/workspace/original-scenes-test-output');OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/game_v4/'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox']);context=browser.new_context(timezone_id='Europe/Moscow');context.route('**/upd.js*',lambda r:r.fulfill(body=''));context.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(body=''));page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base+'tasks.html');flow=page.evaluate('GFLOW.map(s=>s.u)')
 seed={'name':'Тест','birth':'10.02.1979','gender':'f','flow':{'version':2,'current':'reactor.html','last':'reactor.html','completed':{u:100 for u in flow[1:36]}},'reactor':{'day':5,'days':{}},'passport':{'birth':'10.02.1979','version':'old-canary','answers':{'preserve':'old-answer'}},'lab':{'lead':'resp','queue':['err'],'cycle':1,'agree':True},'diary':{'ins':[{'x':'Сохраненное наблюдение','d':100}],'q':[]},'wheel':[1,2,3,4,5,6,7,8],'mirror_exercise':{'completed_at':100,'main_observation':{'option_id':'A','selected_text':'Мое наблюдение'},'personal_note':'Моя запись'},'keep':{'all':True}}
 def set_profile(data):
  page.goto(base+'tasks.html');page.evaluate('(data)=>{localStorage.clear();localStorage.setItem("alch_profile",JSON.stringify(data));sessionStorage.setItem("gLastStep","unchanged")}',data)
 def raw():return page.evaluate('window.GOpening?JSON.stringify(GOpening.savedProfile()):localStorage.alch_profile')
 def unchanged(before):assert raw()==before,'Viewing a scene mutated profile';assert page.evaluate('window.GOpening||sessionStorage.gLastStep==="unchanged"')
 # A completed initiation can be shown as the original editable draft without saving.
 for width in [320,390,1280]:
  page.set_viewport_size({'width':width,'height':844 if width<1000 else 900})
  set_profile(seed);before=raw();page.goto(base+'map.html');page.locator('#start').click();page.wait_for_url('**/form.html?opening=1&v=opening2');assert page.locator('.board').is_visible();assert not page.locator('#nm').evaluate('(e)=>e.readOnly');assert page.locator('#next').inner_text()=='РОЖДЕНИЕ ГЕРОЯ';unchanged(before);page.reload();unchanged(before)
 # Original story backgrounds, video and typography remain, not a generic record viewer.
 page.set_viewport_size({'width':390,'height':844});set_profile(seed);before=raw()
 for target,selector in [('elder.html','video[src="media/elder.mp4"]'),('scene.html?k=start','.bg'),('scene.html?k=ego','.bg'),('scene.html?k=pa','.bg'),('scene.html?k=pa_test','.bg'),('sum.html','#box'),('fin.html','#box'),('slot.html?id=source','#m'),('slot.html?id=pa_end','#m'),('slot.html?id=pb_intro','#m'),('slot.html?id=pc_intro','#m')]:
  page.goto(base+target);page.wait_for_url('**/*review=1');assert page.locator(selector).count()==1;assert page.locator('.gnav').count()==1;unchanged(before);page.reload();unchanged(before)
  assert page.evaluate('GRoute.complete()') is False;unchanged(before)
  if target=='elder.html':assert page.locator('#v').get_attribute('poster')=='img/elder.jpg';page.screenshot(path=str(OUT/'elder-review-mobile.png'))
  if target.startswith('scene.html'):assert 'url(' in page.locator('.bg').evaluate('(e)=>getComputedStyle(e).backgroundImage');page.locator('#go').click();page.wait_for_url('**/tasks.html');unchanged(before)
 # Legacy saves without a trusted checkpoint still open the original form read-only.
 legacy={k:v for k,v in seed.items() if k!='flow'};set_profile(legacy);before=raw();page.goto(base+'map.html');page.locator('#start').click();page.wait_for_url('**/form.html?opening=1&v=opening2');unchanged(before);page.reload();unchanged(before)
 set_profile(seed);before=raw()
 # Old generic-review bookmarks now reconnect to the original form too.
 page.goto(base+'tasks.html?review=form.html');page.wait_for_url('**/form.html?review=1');unchanged(before)
 # Locked future story scenes remain locked, even with review=1.
 set_profile({});page.goto(base+'scene.html?k=pa&review=1');page.wait_for_url('**/tasks.html?locked=1');assert raw()=='{}'
 # New entry still follows the original form -> Elder transition.
 page.goto(base+'form.html');page.locator('#nm').fill('Новый игрок');page.locator('#bd').fill('10.02.1979');page.locator('[data-g=f]').click();page.locator('#next').click();page.wait_for_url('**/elder.html');assert page.locator('#v').get_attribute('src')=='media/elder.mp4';assert page.evaluate('JSON.parse(localStorage.alch_profile).flow.current')=='elder.html'
 assert not errors,errors
 print(json.dumps({'result':'PASS','viewports':[320,390,1280],'checks':['original editable draft form for existing saves','no writes on original visual review or reload','original Elder video/poster and 0/A/B/C story scenes','old review links repaired','future review locks retained','new form to Elder transition'],'runtime_errors':errors},ensure_ascii=False))
 context.close();browser.close()
server.shutdown()
