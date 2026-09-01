import re

with open('games/08-circus-3d/js/game.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the current toggle HUD logic
old_toggle_start = \"const toggleHUD = (e, forceCollapse = null) => {\"
old_toggle_end = \"toggleHUD(null, false); // swipe down -> expand\\n          }\\n        }\\n      }\\n    }, { passive: true });\"

# Regex to remove the old block
c = re.sub(r'const toggleHUD =.*?\{ passive: true \}\);', '', c, flags=re.DOTALL)

new_logic = '''
    window.toggleHUD = (forceCollapse = null) => {
      const btn = document.getElementById('toggleHudBtn');
      const topBar = document.getElementById('hudTopBar');
      const boss = document.getElementById('bossHUD');
      
      const isCurrentlyCollapsed = document.body.classList.contains('hud-collapsed');
      let shouldCollapse = !isCurrentlyCollapsed;
      if (forceCollapse !== null) shouldCollapse = forceCollapse;
      
      if (shouldCollapse) {
        document.body.classList.add('hud-collapsed');
        if (topBar) topBar.style.display = 'none';
        if (boss) boss.style.opacity = '0';
        if (boss) boss.style.pointerEvents = 'none';
        if (btn) btn.innerHTML = '&#9660;';
      } else {
        document.body.classList.remove('hud-collapsed');
        if (topBar) topBar.style.display = 'flex';
        if (boss) boss.style.opacity = '1';
        if (boss) boss.style.pointerEvents = 'auto';
        if (btn) btn.innerHTML = '&#9650;';
      }
    };

    if (this.ui.toggleHudBtn) {
      // Use both click and pointerdown to ensure it fires reliably
      this.ui.toggleHudBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        window.toggleHUD();
      });
    }

    // A simpler swipe detection on the window
    let swipeStartY = 0;
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        swipeStartY = e.touches[0].clientY;
      }
    }, { passive: true });
    
    window.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touchEndY = e.changedTouches[0].clientY;
        const dy = touchEndY - swipeStartY;
        // Swipe up
        if (dy < -40 && swipeStartY < window.innerHeight / 2) {
          window.toggleHUD(true);
        } 
        // Swipe down
        else if (dy > 40 && swipeStartY < window.innerHeight / 2) {
          window.toggleHUD(false);
        }
      }
    }, { passive: true });
'''

c = c.replace(\"// Modal Actions\", new_logic + \"\\n    // Modal Actions\")

with open('games/08-circus-3d/js/game.js', 'w', encoding='utf-8') as f:
    f.write(c)
