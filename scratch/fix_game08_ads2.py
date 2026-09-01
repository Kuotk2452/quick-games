import os

filepath = 'games/08-circus-3d/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

bad_victory_injection = '''    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
      if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'block';
  }

  triggerGameOver() {'''

fixed_victory_injection = '''    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
      if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'none';
  }

  triggerGameOver() {'''

js = js.replace(bad_victory_injection, fixed_victory_injection)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
