import os

filepath = 'games/08-circus-3d/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

bad_adcoins_logic = '''      if (this.ui.btnAdCoins) {
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

good_adcoins_logic = '''      if (this.ui.btnAdCoins) {
        this.ui.btnAdCoins.addEventListener('click', () => {
          if (window.QuickGamesAdSDK) {
            window.QuickGamesAdSDK.showRewardedVideo(() => {
              workshop.addCoins(500);
              this.updateBankHeader();
              this.renderWorkshop(); // Updates all buttons and coin balance correctly
            });
          }
        });
      }'''

js = js.replace(bad_adcoins_logic, good_adcoins_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
