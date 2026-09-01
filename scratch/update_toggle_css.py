import re

with open('games/08-circus-3d/css/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace .hud-collapsed #hudTopBar with body.hud-collapsed #hudTopBar
c = c.replace('.hud-collapsed #hudTopBar', 'body.hud-collapsed #hudTopBar')
c = c.replace('.hud-collapsed #bossHUD', 'body.hud-collapsed #bossHUD')

with open('games/08-circus-3d/css/style.css', 'w', encoding='utf-8') as f:
    f.write(c)
