import os
import re

filepath = 'games/04-cyber-slacker/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'dY\?\+\s*View Global Rank', 'View Global Rank', html)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
