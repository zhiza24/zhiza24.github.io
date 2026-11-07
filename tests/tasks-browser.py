"""Route integration tests with real parser-time gating, isolated headless Chromium."""
import functools,http.server,json,pathlib,threading
from playwright.sync_api import sync_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=pathlib.Path('/workspace/tasks-test-output');OUT.mkdir(exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/game_v4/'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},timezone_id='Europe/Moscow')
 context.route('**/upd.js*',lambda r:r.fulfill(body=''));context.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(body=''))
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base+'tasks.html');flow=page.evaluate('GFLOW.map(x=>x.u)')
 def at(i):
  return {'name':'Тест','birth':'10.02.1979','gender':'f','wheel':[1,2,3,4,5,6,7,8],'reactor':{'day':5,'days':{}},'lab':{'lead':'resp','queue':['err'],'cycle':1,'agree':True},'flow':{'version':2,'current':flow[i],'last':'reactor.html','completed':{u:100 for u in flow[1:i]}},'diary':{'ins':[],'q':[]}}
 def seed(data):
  page.goto(base+'tasks.html');page.evaluate('(v)=>localStorage.setItem("alch_profile",JSON.stringify(v))',data);page.reload();return page.evaluate('localStorage.alch_profile')
 def unchanged(raw): assert page.evaluate('localStorage.alch_profile')==raw,'Read-only/locked navigation mutated profile'
 def check(): assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),'Mobile overflow'
 for i in [1,12,21,27,35,36,37,39]:
  data=at(i);raw=seed(data);assert page.locator('.task-card.current').count()==1;assert page.locator('.task-card.current').get_attribute('data-step')==flow[i]
  assert page.locator('.task-card.locked a').count()==0;assert page.locator('.task-card.done').count()==i
  assert page.locator('.task-hero a').get_attribute('href')==flow[i];check();unchanged(raw);page.reload();unchanged(raw)
  if i==21:
   page.screenshot(path=str(OUT/'tasks-mobile.png'),full_page=False)
   # Completed stage review never runs its old auto-saving scene.
   page.locator('.task-card.done').filter(has=page.get_by_text('Колесо баланса',exact=True)).get_by_role('link').click();assert 'Просмотр пройденного' in page.locator('#tasks').inner_text();unchanged(raw)
   page.reload();unchanged(raw)
  if i<36:
   for target in ['reactor.html','slot.html?id=end','scene.html?k=pc','stage.html?s=1','slot.html?id=guard&review=1']:
    page.goto(base+target);page.wait_for_url('**/tasks.html**');unchanged(raw);assert page.locator('#tasks').is_visible()
 # New and untrusted legacy cursor must not open the reactor.
 for data in [{},{'flow':{'last':'reactor.html','max':100},'reactor':{'day':7}}]:
  raw=seed(data);assert page.locator('.task-hero a').get_attribute('href')=='form.html';page.goto(base+'reactor.html');page.wait_for_url('**/tasks.html**');unchanged(raw)
 # Actual current reactor still works, including a saved day and daily progress.
 data=at(36);data['reactor']={'day':5,'days':{},'last':'old'};raw=seed(data);page.locator('.task-hero a').click();page.wait_for_url('**/reactor.html');assert page.locator('#dd .ok').count()==5
 page.locator('#tk .chk').first.click();page.locator('#ok').click();assert page.evaluate('JSON.parse(localStorage.alch_profile).reactor.day')==6
 page.get_by_role('link',name='Задания',exact=True).click();assert page.locator('.task-card.current').get_attribute('data-step')=='reactor.html'
 # Past direct scenes are redirected BEFORE script side effects, with query spoofing ineffective.
 data=at(27);raw=seed(data)
 for target in ['wheel-test.html','slot.html?id=source','scene.html?k=pa','form.html','choose.html']:
  expected=page.evaluate('(u)=>GRoute.reviewUrl(u)',target);page.goto(base+target);page.wait_for_url(base+expected);unchanged(raw)
 # The actual final scene can finish the last cycle, without creating a fake next task.
 data=at(len(flow)-1);data['reactor']['day']=21;data['retest']={'wheel':[2]*8};data['lab']['queue']=[];seed(data);page.locator('.task-hero a').click();page.wait_for_url('**/slot.html?id=end');page.locator('#nx').click();page.wait_for_url('**/tasks.html');raw=page.evaluate('localStorage.alch_profile');assert page.locator('.task-card.locked,.task-card.current').count()==0;assert page.locator('.task-hero').inner_text().startswith('Путь завершен');unchanged(raw)
 # Nav assignment links and Hero hotspot always go to the task list, not a stale reactor last.
 data=at(21);raw=seed(data);page.goto(base+'diary.html');assert page.locator('.gnav a').filter(has_text='Задания').get_attribute('href')=='tasks.html'
 page.goto(base+'hero.html');assert page.locator('#tq').get_attribute('role')=='link';page.locator('#tq').click();page.wait_for_url('**/tasks.html');assert page.locator('.task-hero a').get_attribute('href')==flow[21]
 page.set_viewport_size({'width':320,'height':640});check();page.set_viewport_size({'width':1280,'height':900});check();page.screenshot(path=str(OUT/'tasks-desktop.png'),full_page=False)
 assert not errors,errors
 print(json.dumps({'result':'PASS','browser':browser.version,'viewports':[320,390,1280],'checkpoints':[1,12,21,27,35,36,37,39],'checks':['stale last ignored','locks and direct URL guard','inert parser blocks old autosaves','readonly past and reload unchanged','reactor daily workflow','complete route','nav and Hero tasks links'],'runtime_errors':errors},ensure_ascii=False))
 context.close();browser.close()
server.shutdown()
