import re

with open('games/08-circus-3d/css/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

toggle_css = '''
/* Toggle HUD Button */
.toggle-hud-btn {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 24px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  border-radius: 0 0 8px 8px;
  font-size: 12px;
  z-index: 1000;
  display: none; /* hidden by default, shown on mobile landscape */
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  backdrop-filter: blur(4px);
}

.hud-collapsed #hudTopBar,
.hud-collapsed #bossHUD {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-20px) scale(0.95);
  transition: all 0.2s ease;
}

#hudTopBar, #bossHUD {
  transition: all 0.2s ease;
}

@media (max-height: 500px) and (orientation: landscape) {
  .toggle-hud-btn {
    display: flex;
  }
}
'''

# We also need to fix boss-hud positioning so it's absolute
old_boss_hud = '''.boss-hud {
  width: 100%;
  max-width: 600px;
  background: rgba(15, 11, 30, 0.92);
  border: 2px solid var(--circus-red);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 0 24px rgba(239, 68, 68, 0.6);
  pointer-events: auto;
  margin-top: 6px;
}'''

new_boss_hud = '''.boss-hud {
  position: absolute;
  top: 55px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  background: rgba(15, 11, 30, 0.92);
  border: 2px solid var(--circus-red);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 0 24px rgba(239, 68, 68, 0.6);
  pointer-events: auto;
  z-index: 100;
}
.hud-collapsed #bossHUD {
  transform: translate(-50%, -20px) scale(0.95) !important;
}
'''

c = c.replace(old_boss_hud, new_boss_hud)
c += toggle_css

with open('games/08-circus-3d/css/style.css', 'w', encoding='utf-8') as f:
    f.write(c)

