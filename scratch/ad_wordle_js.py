import os

filepath = 'games/02-wordle-survivor/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

# Add btnExtraLife to DOM object
c = c.replace('btnPlayAgain: document.getElementById(\'btnPlayAgain\'),', 'btnExtraLife: document.getElementById(\'btnExtraLife\'),\n        btnPlayAgain: document.getElementById(\'btnPlayAgain\'),')

# Setup Ad Revive Logic
revive_logic = '''
    // Ad Revive Logic
    if (this.ui.btnExtraLife) {
      this.ui.btnExtraLife.addEventListener('click', () => {
        if (!window.QuickGamesAdSDK) {
          alert('Ad SDK not found!');
          return;
        }
        window.QuickGamesAdSDK.showRewardedVideo(() => {
          this.revivePlayer();
        });
      });
    }

    // Play again'''
c = c.replace('// Play again', revive_logic)

# showGameOver logic
gameover_logic = '''
    if (this.ui.gameOverModal) {
      this.ui.gameOverModal.style.display = 'flex';
    }
    
    if (this.ui.btnExtraLife) {
      this.ui.btnExtraLife.style.display = this.hasRevived ? 'none' : 'block';
    }
'''
c = c.replace('''    if (this.ui.gameOverModal) {
      this.ui.gameOverModal.style.display = 'flex';
    }''', gameover_logic)

# startGame logic
c = c.replace('this.gameState = \'PLAYING\';', 'this.gameState = \'PLAYING\';\n    this.hasRevived = false;')

# revivePlayer method
revive_method = '''
  revivePlayer() {
    this.hasRevived = true;
    this.player.stats.hp = Math.floor(this.player.stats.maxHp / 2); // 50% HP
    this.gameState = 'PLAYING';
    
    if (this.ui.gameOverModal) {
      this.ui.gameOverModal.style.display = 'none';
    }
    
    // Clear close monsters to prevent instant death
    if (this.monsters) {
      this.monsters = this.monsters.filter(m => m.y < 350); // Keep monsters that are far away, kill the ones close
    }
    
    soundEngine.playLevelUp(); // Re-use level up sound for revive
    this.gameLoop(0);
  }

  showGameOver() {'''
c = c.replace('  showGameOver() {', revive_method)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
