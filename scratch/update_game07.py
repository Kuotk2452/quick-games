import os
import re

# 1. Update index.html
html_path = 'games/07-neon-beat/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Add SDK
if 'mock-reward-sdk.js' not in html:
    html = html.replace('<!-- Main Game Script -->', '<!-- Ad SDK -->\n  <script src="../../js/mock-reward-sdk.js"></script>\n  <!-- Main Game Script -->')

# Add Double Score Ad Button in endModal
double_btn = '''      <div class="modal-actions" style="flex-direction: column; gap: 8px;">
        <button id="btnAdDoubleScore" class="primary-start-btn" style="background: #eab308; color: #111; width: 100%; font-weight: bold;">🎥 Watch Ad: Double Score & Boost Grade (x2 ⚡)</button>
        <div style="display: flex; gap: 8px; width: 100%;">
          <button id="btnRetry" class="primary-start-btn" style="flex: 1;" data-i18n="restartBtn">🔄 Retry</button>
          <button id="btnSelectTrack" class="secondary-btn" style="flex: 1;" data-i18n="selectSongBtn">🎵 Select Track</button>
        </div>
        <button id="btnShareScore" class="secondary-btn" style="width: 100%;" data-i18n="shareScore">📋 Share</button>
      </div>'''

html = re.sub(r'<div class="modal-actions">.*?</div>', double_btn, html, flags=re.DOTALL)

# Bump cache
html = re.sub(r'js/game\.js\?v=[\d\.]+', 'js/game.js?v=2.0', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update game.js
js_path = 'games/07-neon-beat/js/game.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to initDOM
dom_target = "btnRetry: document.getElementById('btnRetry'),"
dom_injection = "btnRetry: document.getElementById('btnRetry'),\n      btnAdDoubleScore: document.getElementById('btnAdDoubleScore'),"
js = js.replace(dom_target, dom_injection)

# Add event listeners in initEvents
event_injection = '''
    if (this.ui.btnAdDoubleScore) {
      this.ui.btnAdDoubleScore.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.score *= 2;
            if (this.ui.resultScore) this.ui.resultScore.innerText = this.score.toLocaleString();
            if (this.ui.gradeDisplay) {
              this.ui.gradeDisplay.innerText = 'SSS+';
              this.ui.gradeDisplay.style.color = '#eab308';
            }
            if (this.ui.btnAdDoubleScore) {
              this.ui.btnAdDoubleScore.innerText = '✅ Score Doubled! (x2 Applied)';
              this.ui.btnAdDoubleScore.disabled = true;
              this.ui.btnAdDoubleScore.style.opacity = '0.75';
            }
            const track = TRACK_LIST[this.selectedTrackIndex];
            localStorage.setItem(
b_score_, this.score.toString());
            localStorage.setItem(
b_grade_, 'SSS+');
          });
        }
      });
    }
'''
js = js.replace("if (this.ui.btnRetry) {", event_injection + "\n    if (this.ui.btnRetry) {")

# Reset double button state on finishTrack
finish_reset = '''    if (this.ui.btnAdDoubleScore) {
      this.ui.btnAdDoubleScore.innerText = '🎥 Watch Ad: Double Score & Boost Grade (x2 ⚡)';
      this.ui.btnAdDoubleScore.disabled = false;
      this.ui.btnAdDoubleScore.style.opacity = '1';
    }
    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';'''

js = js.replace("if (this.ui.endModal) this.ui.endModal.style.display = 'flex';", finish_reset)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Game 07 updated successfully.")
