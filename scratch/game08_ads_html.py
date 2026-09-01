import os
import re

filepath = 'games/08-circus-3d/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# Add SDK before the game.js script
html = html.replace('<script type="module" src="js/game.js', '<script src="../../js/mock-reward-sdk.js"></script>\n  <script type="module" src="js/game.js')

# Add Watch Ad to Revive button in endModal
revive_btn = '''        <button id="btnAdRevive" class="primary-btn" style="display: none; background: #eab308; color: #111; margin-bottom: 10px; width: 100%;">🎥 Watch Ad to Revive</button>
        <div class="modal-buttons">'''
html = html.replace('<div class="modal-buttons">', revive_btn)

# Add Watch Ad for Coins in Workshop
coins_btn = '''      <div class="workshop-balance-bar">
        <span data-i18n="bankCoinsLabel">Gold Coins:</span>
        <span id="workshopCoinBalance" class="balance-num">💰 500</span>
      </div>
      <button id="btnAdCoins" class="primary-btn" style="background: #eab308; color: #111; margin-bottom: 15px; width: 100%;">🎥 Watch Ad for +500 Coins</button>'''
html = re.sub(r'<div class="workshop-balance-bar">.*?</div>', coins_btn, html, flags=re.DOTALL)

# bump cache
html = re.sub(r'js/game\.js\?v=[\d\.]+', 'js/game.js?v=2.3', html)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
