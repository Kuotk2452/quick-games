import os
import re

filepath = 'games/04-cyber-slacker/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

btn_leaderboard = '''
          <button id="btnViewLeaderboard" class="secondary-btn" style="margin-bottom: 8px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: bold;">🏆 View Global Rank</button>
          <div style="display: flex; gap: 8px; width: 100%;">'''

html = html.replace('<div style="display: flex; gap: 8px; width: 100%;">', btn_leaderboard)
html = html.replace('js/game.js?v=1.6', 'js/game.js?v=1.7')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
