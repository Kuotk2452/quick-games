import os
import re

filepath = 'games/04-cyber-slacker/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('window.leaderboardManager.show(this.netWorth);', 'window.leaderboardManager.show(this.crypto.getTotalNetWorth());')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
