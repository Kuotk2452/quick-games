import os
import re

filepath = 'games/08-circus-3d/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

perfect_banner = '''    <div id="closeCallBanner" class="close-call-badge" style="display: none;">
      <span data-i18n="closeCallBonus">CLOSE CALL SLIDE! +300</span>
    </div>
    <div id="perfectJumpBanner" class="close-call-badge" style="display: none; background: rgba(234, 179, 8, 0.9); color: #000; box-shadow: 0 0 20px #eab308; border: 2px solid #fff;">
      <span style="font-weight:900; letter-spacing:2px;">PERFECT JUMP! BULLET TIME!</span>
    </div>'''

html = re.sub(r'<div id="closeCallBanner".*?</div>', perfect_banner, html, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
