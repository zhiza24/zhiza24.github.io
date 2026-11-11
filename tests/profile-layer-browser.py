"""New player and legacy save: artifacts by id, visits, hero/diary/map, no console errors."""
import functools, http.server, json, pathlib, threading
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/game_v4/'

old_save = {
    'name': 'Светлана',
    'birth': '10.02.1979',
    'gender': 'f',
    'points': [10, 2, 4, 16],
    'mapStyle': 'forest',
    'ego': {'schema': 'ct', 'mixed': False, 'mode': 'cr', 'sc': {'ct': 6, 'ab': 1}, 'md': {'cr': 3}},
    'dq': {'accepted': 40, 'voices': ['это мелочь']},
    'wheel': [4, 5, 6, 7, 8, 3, 2, 9],
    'arts': ['Зеркало', 'Черный кристалл', {'n': 'Мост'}, 'Фонарь', 'Зеркало'],
    'flow': {
        'version': 2,
        'current': 'swipe.html',
        'last': 'swipe.html',
        'completed': {},
        'visited': {'elder.html': 123}
    },
    'reactor': {'day': 0},
    'diary': {'ins': [{'x': 'Старая запись', 'd': 100}], 'q': []}
}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox'])
    errors = []
    console_errors = []
    results = []
    for width, kind in [(320, 'old'), (390, 'old'), (1280, 'old'), (320, 'new'), (390, 'new')]:
        ctx = browser.new_context(viewport={'width': width, 'height': 844 if width < 1000 else 900}, timezone_id='Europe/Moscow')
        ctx.route('**/upd.js*', lambda r: r.fulfill(body=''))
        ctx.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body=''))
        page = ctx.new_page()
        page.on('pageerror', lambda e: errors.append(f'{kind}:{width}:{e}'))
        page.on('console', lambda m: console_errors.append(f'{kind}:{width}:{m.text}') if m.type == 'error' else None)

        page.goto(base + 'tasks.html')
        flow = page.evaluate('GFLOW.map(s => s.u)')
        if kind == 'old':
            seed = json.loads(json.dumps(old_save))
            at = flow.index('swipe.html')
            seed['flow']['completed'] = {u: 100 for u in flow[1:at]}
            page.evaluate('(p) => { localStorage.clear(); localStorage.alch_profile = JSON.stringify(p) }', seed)
            page.goto(base + 'hero.html?section=arts')
            page.wait_for_function("document.getElementById('ov') && document.getElementById('ov').classList.contains('on')")
            text = page.locator('#pb').inner_text()
            assert 'Зеркало' in text and 'Черный кристалл' in text and 'Мост' in text and 'Фонарь' in text
            assert 'mirror' not in text and 'black_crystal' not in text and '[object Object]' not in text
            page.goto(base + 'diary.html?tab=tests')
            page.wait_for_selector('#c')
            diary = page.locator('#c').inner_text()
            assert 'Зеркало' in diary and 'Фонарь' in diary
            assert 'black_crystal' not in diary and '[object Object]' not in diary
            page.goto(base + 'map.html')
            page.wait_for_selector('.node')
            assert page.locator('.node').count() == 8
            assert page.locator('#resume').get_attribute('href') == 'swipe.html'
            page.goto(base + 'tasks.html')
            page.wait_for_selector('body')
            page.goto(base + 'swipe.html')
            page.wait_for_function("document.body.dataset.page")
            page.evaluate("() => { GPro.save(GPro.load()); }")
            saved = page.evaluate('JSON.parse(localStorage.alch_profile)')
            assert saved['name'] == 'Светлана'
            assert saved['wheel'] == [4, 5, 6, 7, 8, 3, 2, 9]
            assert saved['ego']['schema'] == 'ct'
            assert 'mirror' in saved['arts'] and 'black_crystal' in saved['arts']
            assert saved['arts'].count('mirror') == 1
            assert 'неизвестный' not in json.dumps(saved['arts'])
            assert saved['flow']['visited'].get('swipe.html')
            first_visit = saved['flow']['visited']['swipe.html']
            page.reload()
            page.wait_for_function("document.body.dataset.page")
            saved2 = page.evaluate('JSON.parse(localStorage.alch_profile)')
            assert saved2['flow']['visited']['swipe.html'] == first_visit
            locked = page.evaluate("() => ({status: GRoute.status('reactor.html'), granted: GArts.grant('guardian_measure', {source: 'reactor.html'}), arts: JSON.parse(localStorage.alch_profile).arts})")
            assert locked['status'] == 'locked'
            assert locked['granted'] is False
            assert 'guardian_measure' not in locked['arts']
            assert page.evaluate("GRoute.resume()") == 'swipe.html'
        else:
            page.evaluate('localStorage.clear()')
            page.goto(base + 'map.html')
            page.wait_for_selector('#start')
            assert page.locator('#start').get_attribute('href')
            page.locator('#start').click()
            page.wait_for_function("location.pathname.endsWith('/form.html')")
            page.evaluate("() => { GArts.grant('lantern'); GArts.grant('Фонарь'); }")
            page.goto(base + 'hero.html?section=arts')
            page.wait_for_function("document.getElementById('pb') && document.getElementById('pb').innerText.length > 0")
            arts_text = page.locator('#pb').inner_text()
            assert 'Фонарь' in arts_text
            assert arts_text.count('Фонарь') == 1
            assert 'lantern' not in arts_text
            saved = page.evaluate('JSON.parse(localStorage.alch_profile || "{}")')
            assert saved.get('arts') == ['lantern']
            page.goto(base + 'diary.html?tab=tests')
            page.wait_for_selector('#c')
            assert 'Фонарь' in page.locator('#c').inner_text()
        results.append({'kind': kind, 'width': width, 'result': 'PASS'})
        ctx.close()

    assert not errors, errors
    assert not console_errors, console_errors
    print(json.dumps({'result': 'PASS', 'cases': results, 'runtime_errors': errors, 'console_errors': console_errors}, ensure_ascii=False))
    browser.close()
server.shutdown()
