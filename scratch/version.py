import re

with open('games/04-cyber-slacker/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<h1 class=\"modal-title\" data-i18n=\"gameTitle\">Cyber Slacker: Office Battle Royale</h1>', '<h1 class=\"modal-title\" data-i18n=\"gameTitle\">Cyber Slacker: Office Battle Royale (v1.2)</h1>')

with open('games/04-cyber-slacker/index.html', 'w', encoding='utf-8') as f:
    f.write(c)
