import os
import re

# 1. Update index.html
html_path = 'games/05-cosmic-orbit/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Add SDK
if 'mock-reward-sdk.js' not in html:
    html = html.replace('<!-- Main Game Script -->', '<!-- Ad SDK -->\n  <script src="../../js/mock-reward-sdk.js"></script>\n  <!-- Main Game Script -->')

# Add Supercharge button in cosmic-powers-bar
supercharge_btn = '''      <button id="btnAdSupercharge" class="power-btn" style="border-color: rgba(234, 179, 8, 0.6); color: #eab308;">
        <span class="power-icon">⚡</span>
        <span class="power-text">Supercharge (Ad)</span>
      </button>
    </footer>'''

if 'btnAdSupercharge' not in html:
    html = html.replace('    </footer>', supercharge_btn)

# Add Ad Revive button in endModal
revive_btn = '''      <div class="modal-actions" style="flex-direction: column; gap: 8px;">
        <button id="btnAdRevive" class="primary-start-btn" style="display: none; background: #eab308; color: #111; width: 100%; font-weight: bold;">🎥 Watch Ad to Clear Horizon & Revive</button>
        <div style="display: flex; gap: 8px; width: 100%;">
          <button id="btnPlayAgain" class="primary-start-btn" style="flex: 1;" data-i18n="playAgain">🔄 New System</button>
          <button id="btnShareScore" class="secondary-btn" style="flex: 1;" data-i18n="shareScore">📋 Share</button>
        </div>
      </div>'''

html = re.sub(r'<div class="modal-actions">.*?</div>', revive_btn, html, flags=re.DOTALL)

# Bump version
html = re.sub(r'js/game\.js\?v=[\d\.]+', 'js/game.js?v=2.5', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update game.js
js_path = 'games/05-cosmic-orbit/js/game.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to initDOM
dom_target = "btnShareScore: document.getElementById('btnShareScore'),"
dom_injection = "btnShareScore: document.getElementById('btnShareScore'),\n      btnAdRevive: document.getElementById('btnAdRevive'),\n      btnAdSupercharge: document.getElementById('btnAdSupercharge'),"
js = js.replace(dom_target, dom_injection)

# Add event listeners in initEvents
event_injection = '''
    if (this.ui.btnAdSupercharge) {
      this.ui.btnAdSupercharge.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            // Mega Gravity Pulse + Merge bonus
            this.physics.applyGravityPulse();
            this.score += 1000;
            this.updateHUD();
            this.particles.spawnSupernova(this.centerX, this.centerY, '#eab308');
            cosmicAudio.playSupernovaChime();
          });
        }
      });
    }

    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            // Clear outer overflowing planets to save run
            const limit = this.physics.eventHorizonRadius * 0.85;
            this.physics.bodies = this.physics.bodies.filter(b => Math.hypot(b.pos.x - this.centerX, b.pos.y - this.centerY) < limit);
            this.physics.overflowWarningTime = 0;
            this.isGameOver = false;
            if (this.ui.endModal) this.ui.endModal.style.display = 'none';
            if (this.ui.horizonWarning) this.ui.horizonWarning.style.display = 'none';
            this.particles.spawnSupernova(this.centerX, this.centerY, '#00f0ff');
            cosmicAudio.playSupernovaChime();
          });
        }
      });
    }
'''
js = js.replace("if (this.ui.btnPlayAgain) {", event_injection + "\n    if (this.ui.btnPlayAgain) {")

# Show AdRevive on Game Over
show_revive = '''        if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
        if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'block';'''
js = js.replace("if (this.ui.endModal) this.ui.endModal.style.display = 'flex';", show_revive)

# Hide AdRevive on Start Game
hide_revive = '''    if (this.ui.endModal) this.ui.endModal.style.display = 'none';
    if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'none';'''
js = js.replace("if (this.ui.endModal) this.ui.endModal.style.display = 'none';", hide_revive)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Game 05 updated successfully.")
