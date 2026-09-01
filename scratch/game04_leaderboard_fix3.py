import os
import re

filepath = 'games/04-cyber-slacker/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('js/game.js?v=1.5', 'js/game.js?v=1.8')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
