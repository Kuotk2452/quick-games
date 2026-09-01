import os

filepath = 'games/04-cyber-slacker/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('constructor() {', 'constructor() {\n    window.slackerInstance = this;')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
