import re

with open('games/08-circus-3d/js/game.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Add ui reference
c = c.replace(\"btnRetry: document.getElementById('btnRetry'),\", \"btnRetry: document.getElementById('btnRetry'),\\n      toggleHudBtn: document.getElementById('toggleHudBtn'),\\n      gameplayHUD: document.getElementById('gameplayHUD'),\")

# Add event listener
listener_code = '''
    if (this.ui.toggleHudBtn && this.ui.gameplayHUD) {
      this.ui.toggleHudBtn.addEventListener('click', () => {
        this.ui.gameplayHUD.classList.toggle('hud-collapsed');
        const isCollapsed = this.ui.gameplayHUD.classList.contains('hud-collapsed');
        this.ui.toggleHudBtn.innerHTML = isCollapsed ? '&#9660;' : '&#9650;';
      });
    }
'''

c = c.replace(\"// Modal Actions\", listener_code + \"\\n    // Modal Actions\")

with open('games/08-circus-3d/js/game.js', 'w', encoding='utf-8') as f:
    f.write(c)
