import os

filepath = 'games/02-wordle-survivor/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<script type="module" src="js/game.js?v=2.3"></script>', '<script src="../../js/mock-ad-sdk.js?v=1.1"></script>\n  <script type="module" src="js/game.js?v=2.3"></script>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
