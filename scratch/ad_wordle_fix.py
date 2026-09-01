import os

filepath = 'games/02-wordle-survivor/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

bad_logic = '''    // Clear close monsters to prevent instant death
    if (this.monsters) {
      this.monsters = this.monsters.filter(m => m.y < 350); // Keep monsters that are far away, kill the ones close
    }'''

good_logic = '''    // Clear close monsters to prevent instant death
    if (this.enemyManager && this.enemyManager.enemies) {
      this.enemyManager.enemies = this.enemyManager.enemies.filter(m => {
        const dist = Math.hypot(m.x - this.player.x, m.y - this.player.y);
        return dist > 250; // Keep monsters that are far away
      });
    }'''

c = c.replace(bad_logic, good_logic)
c = c.replace('js/game.js?v=2.3', 'js/game.js?v=2.4')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
