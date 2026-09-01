import os

filepath = 'games/04-cyber-slacker/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('onclick="if(window.leaderboardManager) window.leaderboardManager.show(1523.50);"', 'onclick="if(window.leaderboardManager) window.leaderboardManager.show(window.slackerInstance ? window.slackerInstance.crypto.getTotalNetWorth() : 0);"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
