import os

html_path = 'games/05-cosmic-orbit/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('js/game.js?v=1.1', 'js/game.js?v=2.4')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
