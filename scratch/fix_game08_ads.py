import os

filepath = 'games/08-circus-3d/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to triggerGameOver
js = js.replace("if (this.ui.endModal) this.ui.endModal.style.display = 'flex';", "if (this.ui.endModal) this.ui.endModal.style.display = 'flex';\n      if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'block';")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
