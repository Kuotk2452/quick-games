import os
import re

# 1. Update index.html
html_path = 'games/09-orbit-odyssey/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Add SDK
if 'mock-reward-sdk.js' not in html:
    html = html.replace('<!-- Main Game Script -->', '<!-- Ad SDK -->\n  <script src="../../js/mock-reward-sdk.js"></script>\n  <!-- Main Game Script -->')

# Add Boost button in mainMenu
boost_btn = '''        <button id="btnStart" class="btn-primary">INITIATE LAUNCH</button>
        <button id="btnAdBoost" class="btn-primary" style="background: #eab308; color: #111; margin-top: 10px; width: 100%; font-weight: bold; border-color: #fef08a;">
          ⚡ Watch Ad: +300 LY Warp Jump Boost
        </button>'''

if 'btnAdBoost' not in html:
    html = html.replace('<button id="btnStart" class="btn-primary">INITIATE LAUNCH</button>', boost_btn)

# Add Revive button in gameOverMenu
revive_btn = '''        <div class="action-buttons">
          <button id="btnAdRevive" class="btn-primary" style="background: #eab308; color: #111; margin-bottom: 10px; width: 100%; font-weight: bold; border-color: #fef08a;">
            🎥 Watch Ad: Quantum Warp Revive (Continue Run)
          </button>
          <button id="btnRestart" class="btn-primary">REDEPLOY</button>
        </div>'''

html = re.sub(r'<div class="action-buttons">.*?</div>', revive_btn, html, flags=re.DOTALL)

# Bump cache
html = re.sub(r'js/game\.js\?v=[\d\.]+', 'js/game.js?v=2.0', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update game.js
js_path = 'games/09-orbit-odyssey/js/game.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to initUI
dom_target = "btnRestart: document.getElementById('btnRestart'),"
dom_injection = "btnRestart: document.getElementById('btnRestart'),\n      btnAdBoost: document.getElementById('btnAdBoost'),\n      btnAdRevive: document.getElementById('btnAdRevive'),"
js = js.replace(dom_target, dom_injection)

# Add event listeners in bindEvents
event_injection = '''
    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.startGame();
            this.player.y = 300;
            this.maxDistance = 300;
            this.distance = 300;
            this.chunkY = 300;
            this.spawnChunk(this.chunkY);
            this.space.spawnExplosion(this.player.x, this.player.y);
          });
        }
      });
    }

    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        }
      });
    }
'''
js = js.replace("this.ui.btnRestart.addEventListener('click', () => this.startGame());", "this.ui.btnRestart.addEventListener('click', () => this.startGame());" + event_injection)

# Add revivePlayer method
revive_method = '''
  revivePlayer() {
    orbitAudio.playBGM();
    this.state = 'PLAYING';
    this.ui.gameOverMenu.classList.add('hidden');
    this.ui.hud.classList.remove('hidden');

    this.player.vx = 0;
    this.player.vy = 80;
    this.player.orbiting = false;
    this.player.targetPlanet = null;

    // Clear nearby lethal hazards near player's revive location
    this.asteroids = this.asteroids.filter(a => {
      if (Math.abs(a.y - this.player.y) < 60) {
        this.space.scene.remove(a.mesh);
        return false;
      }
      return true;
    });

    this.blackholes = this.blackholes.filter(b => {
      if (Math.abs(b.y - this.player.y) < 60) {
        this.space.scene.remove(b.group);
        return false;
      }
      return true;
    });

    this.space.spawnExplosion(this.player.x, this.player.y);
  }
'''
js = js.replace("gameOver(reason) {", revive_method + "\n  gameOver(reason) {")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Game 09 updated successfully.")
