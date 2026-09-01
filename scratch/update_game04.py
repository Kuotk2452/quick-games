import os

filepath = 'games/04-cyber-slacker/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# Add btnViewLeaderboard
js = js.replace("btnPlayAgain: document.getElementById('btnPlayAgain'),", "btnPlayAgain: document.getElementById('btnPlayAgain'),\n        btnViewLeaderboard: document.getElementById('btnViewLeaderboard'),")

# Add click listener
listener = '''      if (this.ui.btnViewLeaderboard) {
        this.ui.btnViewLeaderboard.addEventListener('click', () => {
          if (window.leaderboardManager) {
            window.leaderboardManager.show(this.netWorth);
          }
        });
      }'''

js = js.replace("      if (this.ui.btnPlayAgain) {", listener + "\n      if (this.ui.btnPlayAgain) {")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
