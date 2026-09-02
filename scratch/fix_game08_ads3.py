import os

filepath = 'games/08-circus-3d/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

bad_coins = '''      if (this.ui.btnAdCoins) {
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
      }'''

fixed_coins = '''      if (this.ui.btnAdCoins) {
        this.ui.btnAdCoins.addEventListener('click', () => {
          if (window.QuickGamesAdSDK) {
            window.QuickGamesAdSDK.showRewardedVideo(() => {
              this.coins += 500;
              workshop.addCoins(500); // Also update workshop bank immediately
              this.updateBankHeader();
              if (this.ui.workshopCoinBalance) this.ui.workshopCoinBalance.innerText = this.coins.toString();
            });
          }
        });
      }'''

bad_revive = '''      if (this.ui.btnAdRevive) {
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
      }'''

fixed_revive = '''      if (this.ui.btnAdRevive) {
        this.ui.btnAdRevive.addEventListener('click', () => {
          if (window.QuickGamesAdSDK) {
            window.QuickGamesAdSDK.showRewardedVideo(() => {
              this.ui.endModal.style.display = 'none';
              this.ui.btnAdRevive.style.display = 'none';
              
              // Clear immediate obstacles so player doesn't instantly die again
              this.obstacles = this.obstacles.filter(obs => obs.x > this.player.x + 10);
              
              // Resume game
              this.state = 'PLAYING';
              this.lastTime = performance.now();
              requestAnimationFrame(this.loop);
            });
          }
        });
      }'''

js = js.replace(bad_coins, fixed_coins)
js = js.replace(bad_revive, fixed_revive)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
