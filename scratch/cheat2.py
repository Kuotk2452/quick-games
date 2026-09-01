import os

filepath = 'games/03-dungeon-claw/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

cheat = '''
      // Developer cheat for testing ads
      if (this.ui.hpDisplay) {
        this.ui.hpDisplay.addEventListener('click', () => {
          this.hp = 0;
          this.showGameOver();
        });
      }
'''

c = c.replace('turnHintText: document.getElementById(\'turnHintText\')\n    };', 'turnHintText: document.getElementById(\'turnHintText\')\n    };\n' + cheat)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
