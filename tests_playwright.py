from playwright.sync_api import sync_playwright
MOCK = """
window.__said='';
class FakeSR{constructor(){this.lang='';}start(){setTimeout(()=>{const alt=[{transcript:window.__said||'hello'},{transcript:'hallo'}];const res=[alt];this.onresult&&this.onresult({results:res});this.onend&&this.onend();},150)}stop(){}abort(){}}
Object.defineProperty(window,'webkitSpeechRecognition',{value:FakeSR,configurable:true});Object.defineProperty(window,'SpeechRecognition',{value:FakeSR,configurable:true});
const fakeV=[{name:'Google US English',lang:'en-US'},{name:'Samantha',lang:'en-US'}];
Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>fakeV,speak:u=>{window.__spoken=(window.__spoken||[]).concat(u.text);setTimeout(()=>u.onend&&u.onend(),50)},cancel:()=>{},onvoiceschanged:null}});
Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:function(t){this.text=t}});
"""
errs=[]
D='/workspace/english-a1-app/screenshots/'
with sync_playwright() as p:
    b=p.chromium.launch()
    for name,vp,mock in [('desktop',{'width':1280,'height':860},True),('mobile',{'width':390,'height':844},True),('nosr',{'width':390,'height':844},False)]:
        pg=b.new_page(viewport=vp)
        pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
        pg.on('pageerror',lambda e: errs.append(str(e)))
        if mock: pg.add_init_script(MOCK)
        else: pg.add_init_script("Object.defineProperty(window,'webkitSpeechRecognition',{value:undefined});Object.defineProperty(window,'SpeechRecognition',{value:undefined});")
        pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(500)
        pg.screenshot(path=D+f'{name}-home.png',full_page=True)
        if name=='nosr':
            pg.click('.tabs [data-go=learn]'); pg.click('[data-c=greetings]'); pg.click('text=Jó volt'); pg.screenshot(path=D+'nosr-fallback.png'); continue
        # learn
        pg.click('.tabs [data-go=learn]'); pg.click('[data-c=greetings]')
        pg.keyboard.press('Space'); pg.wait_for_timeout(700); pg.screenshot(path=D+f'{name}-learn-flipped.png')
        pg.keyboard.press('Space'); pg.evaluate("window.__said='hello'"); pg.click('.mic'); pg.wait_for_timeout(500)
        assert '100%' in pg.inner_text('.feedback'), pg.inner_text('.feedback')
        pg.keyboard.press('ArrowRight'); pg.evaluate("window.__said='hey'"); pg.click('.mic'); pg.wait_for_timeout(500)
        pg.screenshot(path=D+f'{name}-learn-feedback.png')
        # drill
        pg.click('.tabs [data-go=drill]'); pg.click('[data-c=numbers]'); pg.wait_for_timeout(200)
        for _ in range(30):
            if pg.locator('#again').count(): break
            w=pg.inner_text('.panel .word'); pg.evaluate(f"window.__said={w!r}"); pg.click('.mic'); pg.wait_for_timeout(300)
            if _==1: pg.screenshot(path=D+f'{name}-drill.png')
            pg.click('#nextD')
        assert pg.locator('#again').count(), 'drill did not finish'
        # quiz
        pg.click('.tabs [data-go=quiz]'); pg.wait_for_timeout(200)
        for _ in range(10): pg.keyboard.press('1'); pg.click('#qn')
        assert 'Eredmény' in pg.inner_text('main')
        pg.click('.tabs [data-go=quiz]'); pg.keyboard.press('2'); pg.screenshot(path=D+f'{name}-quiz.png')
        # pairs
        pg.click('.tabs [data-go=pairs]'); pg.click('#pq'); pg.click('[data-pick=ship]'); pg.screenshot(path=D+f'{name}-pairs.png')
        # dialog
        pg.click('.tabs [data-go=dialog]'); pg.click('[data-d="1"]'); pg.click('#all'); pg.wait_for_timeout(600); pg.screenshot(path=D+f'{name}-dialog.png',full_page=True)
        # levels + settings + dark
        pg.click('.tabs [data-go=home]'); pg.click('[data-level=B1]'); pg.click('#themeBtn'); pg.wait_for_timeout(300); pg.screenshot(path=D+f'{name}-home-B1-dark.png',full_page=True)
        pg.click('#settingsBtn'); pg.screenshot(path=D+f'{name}-settings.png'); pg.click('text=Kész'); pg.click('#themeBtn')
        print(name,'ok; spoken',len(pg.evaluate('window.__spoken||[]')))
    b.close()
print('ERRORS:',errs)
