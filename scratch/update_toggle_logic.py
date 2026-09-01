import re

with open('games/08-circus-3d/js/game.js', 'r', encoding='utf-8') as f:
    c = f.read()

old_toggle = '''
    if (this.ui.toggleHudBtn && this.ui.gameplayHUD) {
      this.ui.toggleHudBtn.addEventListener('click', () => {
        this.ui.gameplayHUD.classList.toggle('hud-collapsed');
        const isCollapsed = this.ui.gameplayHUD.classList.contains('hud-collapsed');
        this.ui.toggleHudBtn.innerHTML = isCollapsed ? '&#9660;' : '&#9650;';
      });
    }
'''

new_toggle = '''
    const toggleHUD = (e, forceCollapse = null) => {
      if (e && e.preventDefault) e.preventDefault();
      
      if (forceCollapse === true) {
        document.body.classList.add('hud-collapsed');
      } else if (forceCollapse === false) {
        document.body.classList.remove('hud-collapsed');
      } else {
        document.body.classList.toggle('hud-collapsed');
      }
      
      const isCollapsed = document.body.classList.contains('hud-collapsed');
      if (this.ui.toggleHudBtn) {
        this.ui.toggleHudBtn.innerHTML = isCollapsed ? '&#9660;' : '&#9650;';
      }
    };

    if (this.ui.toggleHudBtn) {
      this.ui.toggleHudBtn.addEventListener('click', toggleHUD);
      this.ui.toggleHudBtn.addEventListener('touchstart', toggleHUD, { passive: false });
    }

    // Swipe up/down in the top half of the screen to toggle HUD
    let hudTouchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        hudTouchStartY = e.touches[0].clientY;
      }
    }, { passive: true });
    
    window.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touchEndY = e.changedTouches[0].clientY;
        const dy = touchEndY - hudTouchStartY;
        // If swiped vertically significantly, and gesture started in top 50% of screen
        if (Math.abs(dy) > 40 && hudTouchStartY < window.innerHeight / 2) {
          if (dy < -40) {
            toggleHUD(null, true); // swipe up -> collapse
          } else if (dy > 40) {
            toggleHUD(null, false); // swipe down -> expand
          }
        }
      }
    }, { passive: true });
'''

c = c.replace(old_toggle.strip(), new_toggle.strip())

with open('games/08-circus-3d/js/game.js', 'w', encoding='utf-8') as f:
    f.write(c)
