import re

with open('games/03-dungeon-claw/js/game.js', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add this.ui.btnAdRevive
c = c.replace(\"btnPlayAgain: document.getElementById('btnPlayAgain'),\", \"btnPlayAgain: document.getElementById('btnPlayAgain'),\\n      btnAdRevive: document.getElementById('btnAdRevive'),\")

# 2. Add this.hasRevived = false
c = c.replace(\"this.maxEnergy = 3;\", \"this.maxEnergy = 3;\\n    this.hasRevived = false;\")

# 3. Add listener
listener = '''    if (this.ui.btnPlayAgain) this.ui.btnPlayAgain.addEventListener('click', () => this.startGame());
    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        }
      });
    }'''
c = c.replace(\"if (this.ui.btnPlayAgain) this.ui.btnPlayAgain.addEventListener('click', () => this.startGame());\", listener)

with open('games/03-dungeon-claw/js/game.js', 'w', encoding='utf-8') as f:
    f.write(c)
