import os
filepath = 'games/02-wordle-survivor/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('js/game.js?v=2.3', 'js/game.js?v=2.4')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
