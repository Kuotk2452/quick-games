import os

filepath = 'games/08-circus-3d/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

perfect_banner = '''    <div id="closeCallBanner" class="close-call-badge" style="display: none;">
      <span data-i18n="closeCallBonus">s CLOSE CALL SLIDE! +300</span>
    </div>
    <div id="perfectJumpBanner" class="close-call-badge" style="display: none; background: #eab308; color: #111;">
      <span data-i18n="perfectJump">~? PERFECT JUMP! BULLET TIME!</span>
    </div>'''

html = html.replace('''    <div id="closeCallBanner" class="close-call-badge" style="display: none;">
      <span data-i18n="closeCallBonus">s CLOSE CALL SLIDE! +300</span>
    </div>''', perfect_banner)

html = html.replace('js/game.js?v=2.1', 'js/game.js?v=2.2')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
