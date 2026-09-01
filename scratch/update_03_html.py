import re

with open('games/03-dungeon-claw/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Add mock ad sdk
c = c.replace('</body>', '  <script src=\"../../js/mock-ad-sdk.js\"></script>\\n</body>')

# Add button to modal-buttons
btn_html = '''        <div class=\"modal-buttons\">
          <button id=\"btnAdRevive\" class=\"ad-btn\" style=\"display: none; width: 100%; padding: 14px; background: #eab308; color: #111; border: none; border-radius: 8px; font-size: 16px; font-weight: 800; cursor: pointer; margin-bottom: 12px; box-shadow: 0 0 12px rgba(250, 204, 21, 0.4);\">&#127909; Watch Ad to Revive (Full HP)</button>'''
c = c.replace('<div class=\"modal-buttons\">', btn_html, 1)

with open('games/03-dungeon-claw/index.html', 'w', encoding='utf-8') as f:
    f.write(c)
