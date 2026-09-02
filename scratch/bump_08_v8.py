import os
import re

filepath = 'games/08-circus-3d/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'js/game\.js\?v=[\d\.]+', 'js/game.js?v=2.7', html)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
