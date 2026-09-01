import os

js_path = 'games/05-cosmic-orbit/js/arcade_boot.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('INITIALIZING CLAW MECHANISM...', 'INITIALIZING GRAV-DRIVE...')
js = js.replace('./audio.js?v=8.3', './audio.js?v=1.1')
js = js.replace('soundEngine', 'cosmicAudio')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
