import os

filepath = 'games/08-circus-3d/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to initDOM properly
js = js.replace("btnSelectAct: document.getElementById('btnSelectAct'),", "btnSelectAct: document.getElementById('btnSelectAct'),\n        btnAdCoins: document.getElementById('btnAdCoins'),\n        btnAdRevive: document.getElementById('btnAdRevive'),")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
