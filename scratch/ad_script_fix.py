import os
import re

filepath = 'games/02-wordle-survivor/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# Add mock-reward-sdk.js before audio.js
c = re.sub(
    r'<script type="module" src="js/audio\.js',
    '<script src="../../js/mock-reward-sdk.js?v=1.2"></script>\n  <script type="module" src="js/audio.js',
    c
)

# Bump version to v=2.6
c = re.sub(r'js/game\.js\?v=[\d\.]+', 'js/game.js?v=2.6', c)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
