import re

with open('games/08-circus-3d/js/game.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('''        if (boss) {
          boss.style.opacity = '0';
          boss.style.pointerEvents = 'none';
          boss.style.transform = 'translate(-50%, -200px)'; // move way off screen
        }''', '')

c = c.replace('''        if (boss) {
          boss.style.opacity = '1';
          boss.style.pointerEvents = 'auto';
          boss.style.transform = 'translateX(-50%)'; // reset
        }''', '')

with open('games/08-circus-3d/js/game.js', 'w', encoding='utf-8') as f:
    f.write(c)
