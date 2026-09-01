import os

filepath = 'games/02-wordle-survivor/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

cheat = '''
      // Developer cheat for testing ads
      if (this.ui.timerEl) {
        this.ui.timerEl.addEventListener('click', () => {
          this.player.stats.hp = 0;
          this.showGameOver();
        });
      }
'''

c = c.replace(cheat, '')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
