import os
import re

filepath = 'games/04-cyber-slacker/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('id="btnViewLeaderboard" class="secondary-btn"', 'id="btnViewLeaderboard" class="secondary-btn" onclick="if(window.leaderboardManager) window.leaderboardManager.show(1523.50);"')

html = re.sub(r'js/leaderboard\.js\?v=[\d\.]+', 'js/leaderboard.js?v=1.2', html)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
