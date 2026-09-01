import os

filepath = 'games/08-circus-3d/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to initDOM
dom_injection = '''
      this.ui.btnAdCoins = document.getElementById('btnAdCoins');
      this.ui.btnAdRevive = document.getElementById('btnAdRevive');'''

js = js.replace("this.ui.btnSelectAct = document.getElementById('btnSelectAct');", "this.ui.btnSelectAct = document.getElementById('btnSelectAct');" + dom_injection)

# Add event listeners
listeners = '''
      if (this.ui.btnAdCoins) {
        this.ui.btnAdCoins.addEventListener('click', () => {
          if (window.MockRewardSDK) {
            window.MockRewardSDK.showAd().then(success => {
              if (success) {
                this.coins += 500;
                this.saveData();
                this.renderWorkshopUpgrades();
              }
            });
          }
        });
      }

      if (this.ui.btnAdRevive) {
        this.ui.btnAdRevive.addEventListener('click', () => {
          if (window.MockRewardSDK) {
            window.MockRewardSDK.showAd().then(success => {
              if (success) {
                this.ui.endModal.style.display = 'none';
                this.ui.btnAdRevive.style.display = 'none';
                
                // Clear immediate obstacles so player doesn't instantly die again
                this.obstacles = this.obstacles.filter(obs => obs.x > this.player.x + 10);
                
                // Resume game
                this.state = 'PLAYING';
                this.lastTime = performance.now();
                requestAnimationFrame(this.loop);
              }
            });
          }
        });
      }
'''
js = js.replace("if (this.ui.btnNextAct) {", listeners + "\n      if (this.ui.btnNextAct) {")

# Show AdRevive on failure
failure_injection = '''
      if (this.ui.btnAdRevive) {
        this.ui.btnAdRevive.style.display = 'block';
      }
'''
js = js.replace("if (this.ui.btnRetry) this.ui.btnRetry.style.display = 'block';", "if (this.ui.btnRetry) this.ui.btnRetry.style.display = 'block';" + failure_injection)

# Hide AdRevive on victory
victory_injection = '''
      if (this.ui.btnAdRevive) {
        this.ui.btnAdRevive.style.display = 'none';
      }
'''
js = js.replace("if (this.ui.btnRetry) this.ui.btnRetry.style.display = 'none';", "if (this.ui.btnRetry) this.ui.btnRetry.style.display = 'none';" + victory_injection)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
