import os
import re

filepath = 'games/04-cyber-slacker/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

listener = '''    if (this.ui.btnViewLeaderboard) {
      this.ui.btnViewLeaderboard.addEventListener('click', () => {
        if (window.leaderboardManager) {
          window.leaderboardManager.show(this.netWorth);
        } else {
          console.error('LeaderboardManager not found');
        }
      });
    }'''

js = js.replace("    if (this.ui.btnPlayAgain) {", listener + "\n\n    if (this.ui.btnPlayAgain) {")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
