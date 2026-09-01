import re

with open('games/08-circus-3d/css/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

# First, remove the old transform overrides if they exist
c = re.sub(r'body\.hud-collapsed #bossHUD \{[^}]+\}', '', c)

c += '''
/* Boss HUD behavior when score is collapsed */
body.hud-collapsed #bossHUD {
  top: 5px !important;
  transition: top 0.3s ease;
}

/* Slimmer Boss HUD for Landscape */
@media (max-height: 500px) and (orientation: landscape) {
  .boss-hud {
    padding: 2px 10px;
    border-width: 1px;
    background: rgba(15, 11, 30, 0.5);
    max-width: 400px;
  }
  .boss-info {
    font-size: 10px;
    margin-bottom: 2px;
  }
  .boss-hp-track {
    height: 4px;
  }
}
'''

with open('games/08-circus-3d/css/style.css', 'w', encoding='utf-8') as f:
    f.write(c)
