import os
import re

# 1. Update index.html
html_path = 'games/06-mecha-arena/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Add SDK
if 'mock-reward-sdk.js' not in html:
    html = html.replace('<!-- Main Game Script -->', '<!-- Ad SDK -->\n  <script src="../../js/mock-reward-sdk.js"></script>\n  <!-- Main Game Script -->')

# Add Scrap Ad button in workshop preview-panel
scrap_btn = '''        <button id="btnDeploy" class="deploy-action-btn" data-i18n="deployBtn">
          ⚔️ ENTER ARENA TOURNAMENT
        </button>
        <button id="btnAdScrap" class="deploy-action-btn" style="background: #eab308; color: #111; margin-top: 10px; border-color: #fef08a; font-weight: bold;">
          💰 Watch Ad for + Scrap Cash
        </button>'''

if 'btnAdScrap' not in html:
    html = html.replace('<button id="btnDeploy" class="deploy-action-btn" data-i18n="deployBtn">\n          ⚔️ ENTER ARENA TOURNAMENT\n        </button>', scrap_btn)

# Add Ad Revive button in endModal
revive_btn = '''      <div class="modal-actions" style="flex-direction: column; gap: 8px;">
        <button id="btnAdRevive" class="primary-start-btn" style="display: none; background: #eab308; color: #111; width: 100%; font-weight: bold;">🎥 Watch Ad: Emergency Overclock Revive (100% HP)</button>
        <div style="display: flex; gap: 8px; width: 100%;">
          <button id="btnNextMatch" class="primary-start-btn" style="flex: 1;" data-i18n="nextMatchBtn">⚔️ Next Match</button>
          <button id="btnShareScore" class="secondary-btn" style="flex: 1;" data-i18n="shareScore">📋 Share Build</button>
        </div>
      </div>'''

html = re.sub(r'<div class="modal-actions">.*?</div>', revive_btn, html, flags=re.DOTALL)

# Bump cache
html = re.sub(r'js/game\.js\?v=[\d\.]+', 'js/game.js?v=2.0', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update game.js
js_path = 'games/06-mecha-arena/js/game.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to initDOM
dom_target = "btnDeploy: document.getElementById('btnDeploy'),"
dom_injection = "btnDeploy: document.getElementById('btnDeploy'),\n      btnAdScrap: document.getElementById('btnAdScrap'),\n      btnAdRevive: document.getElementById('btnAdRevive'),"
js = js.replace(dom_target, dom_injection)

# Add event listeners in initEvents
event_injection = '''
    if (this.ui.btnAdScrap) {
      this.ui.btnAdScrap.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.scrapCash += 500;
            localStorage.setItem('ma_scrap', this.scrapCash);
            this.renderWorkshopUI();
            mechaAudio.playMetallicClank();
          });
        }
      });
    }

    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            if (this.ui.endModal) this.ui.endModal.style.display = 'none';
            if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'none';
            this.revivePlayer();
          });
        }
      });
    }
'''
js = js.replace("if (this.ui.btnDeploy) {", event_injection + "\n    if (this.ui.btnDeploy) {")

# Add revivePlayer method
revive_method = '''
  revivePlayer() {
    this.player = new CombatantBot('PLAYER', this.playerChassisId, this.playerWeaponId, this.playerModuleId, 120, this.height / 2, false);
    this.player.isDead = false;
    this.player.hp = this.player.maxHp;
    this.player.shieldTimer = 3.5; // 3.5s shield bubble on revive
    this.particles.spawnExplosion(this.player.pos.x, this.player.pos.y, 50);
    mechaAudio.playHydraulicPowerUp();
  }
'''
js = js.replace("returnToWorkshop() {", revive_method + "\n  returnToWorkshop() {")

# Hide AdRevive on Victory, Show on Defeat
victory_fix = '''      if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
      if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'none';'''
defeat_fix = '''      if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
      if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'block';'''

js = js.replace("if (this.ui.endModal) this.ui.endModal.style.display = 'flex';\n      this.enemy = null;", victory_fix + "\n      this.enemy = null;")
js = js.replace("if (this.ui.endModal) this.ui.endModal.style.display = 'flex';\n      this.player = null;", defeat_fix + "\n      this.player = null;")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Game 06 updated successfully.")
