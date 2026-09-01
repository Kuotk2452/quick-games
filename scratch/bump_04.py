import os
filepath = 'games/04-cyber-slacker/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()
html = html.replace('js/game.js?v=1.4', 'js/game.js?v=1.6')
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
