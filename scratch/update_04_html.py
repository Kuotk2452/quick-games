import re

with open('games/04-cyber-slacker/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Add mock ad sdk
c = c.replace('</body>', '  <script src=\"../../js/mock-ad-sdk.js\"></script>\\n</body>')

# Add button to modal-actions
btn_html = '''        <div class=\"modal-actions\">
          <button id=\"btnAdRevive\" class=\"ad-btn\" style=\"display: none; background: #eab308; color: #111;\">&#127909; Watch Ad to Bribe HR</button>'''
c = c.replace('<div class=\"modal-actions\">', btn_html)

with open('games/04-cyber-slacker/index.html', 'w', encoding='utf-8') as f:
    f.write(c)
