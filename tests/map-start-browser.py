"""Focused first-map CTA regression. Existing route/locks are not replaced."""
import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=pathlib.Path('/workspace/map-start-test-output');OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/game_v4/'
def save(current,previous):return {'name':'Тест','gender':'f','birth':'10.02.1979','keep':{'unchanged':True},'lab':{'lead':'resp','queue':['err'],'agree':True,'cycle':1},'flow':{'version':2,'current':current,'last':'reactor.html','completed':{previous:100}},'reactor':{'day':5,'days':{}}}
cases=[('new',{},'Старт','form.html'),('middle0',save('ego.html','scene.html?k=ego'),'Продолжить игру','ego.html'),('middleA',save('slot.html?id=mirrors','wheel-test.html'),'Продолжить игру','slot.html?id=mirrors'),('middleB',save('slot.html?id=sort','slot.html?id=evidence'),'Продолжить игру','slot.html?id=sort'),('reactor',save('reactor.html','slot.html?id=pc_intro'),'Продолжить игру','reactor.html'),('legacy',{'name':'Тест','flow':{'last':'reactor.html','max':99},'reactor':{'day':7},'keep':{'unchanged':True}},'Продолжить игру','form.html')]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox']);context=b.new_context(timezone_id='Europe/Moscow');context.route('**/upd.js*',lambda r:r.fulfill(body=''));context.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(body=''));page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for width in [320,390,1280]:
  page.set_viewport_size({'width':width,'height':844 if width<1000 else 900})
  for name,data,label,href in cases:
   page.goto(base+'tasks.html');page.evaluate('(p)=>{localStorage.clear();localStorage.setItem("alch_profile",JSON.stringify(p))}',data);before=page.evaluate('localStorage.alch_profile');page.goto(base+'map.html')
   cta=page.locator('#resume');assert cta.inner_text()==label;assert cta.get_attribute('href')==href;assert page.locator('.node').count()==8;assert page.evaluate('localStorage.alch_profile')==before
   assert cta.evaluate('(e)=>{const r=e.getBoundingClientRect();return r.height>=48&&r.y>=0&&r.bottom<innerHeight-100&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===e}')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('.node.locked').count()>0
   if width==390 and name in ['new','middleA']:page.screenshot(path=str(OUT/(name+'-mobile.png')),full_page=False)
   page.reload();assert cta.inner_text()==label;assert page.evaluate('localStorage.alch_profile')==before
   cta.click();page.wait_for_url(base+href);after=page.evaluate('JSON.parse(localStorage.alch_profile)');assert after.get('keep')==data.get('keep');assert after.get('reactor',{}).get('day')==data.get('reactor',{}).get('day')
 # A direct future URL still cannot unlock progress.
 page.goto(base+'tasks.html');page.evaluate('localStorage.setItem("alch_profile","{}")');page.goto(base+'reactor.html');page.wait_for_url('**/tasks.html?locked=1');assert page.evaluate('localStorage.alch_profile')=='{}'
 assert not errors,errors
 print(json.dumps({'result':'PASS','viewports':[320,390,1280],'cases':[c[0] for c in cases],'checks':['visible initial CTA >=48px and unoccluded','correct label and exact current target','eight map segments/locks retained','reload and saved data preserved','future direct URL remains locked'],'runtime_errors':errors},ensure_ascii=False))
 context.close();b.close()
server.shutdown()
