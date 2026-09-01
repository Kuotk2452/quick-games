import re

with open('games/04-cyber-slacker/js/game.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "this.ui.btnAdRevive.style.display = this.hasRevived ? 'none' : 'block';",
    "this.ui.btnAdRevive.style.display = this.hasRevived ? 'none' : 'flex';\n      this.ui.btnAdRevive.style.width = '100%';"
)

with open('games/04-cyber-slacker/js/game.js', 'w', encoding='utf-8') as f:
    f.write(c)

with open('games/04-cyber-slacker/index.html', 'r', encoding='utf-8') as f:
    c2 = f.read()

# Make sure button styling fits within flex layout properly
c2 = c2.replace(
    '''<div class="modal-actions">
          <button id="btnAdRevive" class="ad-btn" style="display: none; background: #eab308; color: #111;">&#127909; 
Watch Ad to Bribe HR</button>
          <button id="btnPlayAgain" class="primary-start-btn" data-i18n="playAgain">dY", New Workday</button>''',
    '''<div class="modal-actions" style="display: flex; flex-direction: column; gap: 8px;">
          <button id="btnAdRevive" class="ad-btn" style="display: none; justify-content: center; align-items: center; background: #eab308; color: #111; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; padding: 12px; font-size: 16px;">&#127909; Watch Ad to Bribe HR</button>
          <div style="display: flex; gap: 8px;">
            <button id="btnPlayAgain" class="primary-start-btn" style="flex: 1;" data-i18n="playAgain">dY", New Workday</button>'''
)

with open('games/04-cyber-slacker/index.html', 'w', encoding='utf-8') as f:
    f.write(c2)
