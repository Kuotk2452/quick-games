import os
import re

filepath = 'games/08-circus-3d/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Change COINS to COINS EARNED in the endModal stats-box
html = html.replace('<span class="stat-label">COINS</span>', '<span class="stat-label">COINS EARNED</span>')

# bump cache
html = re.sub(r'js/game\.js\?v=[\d\.]+', 'js/game.js?v=2.8', html)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
