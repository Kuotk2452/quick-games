import re

with open('games/08-circus-3d/css/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix dangling comma
c = re.sub(r'body\.hud-collapsed #hudTopBar,\s*#hudTopBar, #bossHUD', '#hudTopBar, #bossHUD', c)

with open('games/08-circus-3d/css/style.css', 'w', encoding='utf-8') as f:
    f.write(c)
