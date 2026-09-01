import re

with open('games/04-cyber-slacker/js/game.js', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add btnAdRevive to initDOM
c = c.replace(\"btnPlayAgain: document.getElementById('btnPlayAgain'),\", \"btnPlayAgain: document.getElementById('btnPlayAgain'),\\n      btnAdRevive: document.getElementById('btnAdRevive'),\")

# 2. Add this.hasRevived = false to constructor/startShift
c = c.replace(\"this.isGameOver = false;\", \"this.isGameOver = false;\\n    this.hasRevived = false;\")

# 3. Add to initEvents
event_code = '''
    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        }
      });
    }
'''
c = c.replace(\"// Button Actions\", event_code + \"\\n    // Button Actions\")

# 4. Modify handleBustedByBoss
busted_old = '''  handleBustedByBoss() {
    this.isGameOver = true;
    slackerAudio.playBustedSiren();
    if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('bustedTitle');
    if (this.ui.endDesc) this.ui.endDesc.innerText = i18n.t('bustedDesc');
    if (this.ui.finalNetWorth) this.ui.finalNetWorth.innerText = $;
    if (this.ui.finalXp) this.ui.finalXp.innerText = Math.floor(this.slackerXp);
    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
  }'''

busted_new = '''  handleBustedByBoss() {
    this.isGameOver = true;
    slackerAudio.playBustedSiren();
    if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('bustedTitle');
    if (this.ui.endDesc) this.ui.endDesc.innerText = i18n.t('bustedDesc');
    if (this.ui.finalNetWorth) this.ui.finalNetWorth.innerText = $;
    if (this.ui.finalXp) this.ui.finalXp.innerText = Math.floor(this.slackerXp);
    
    // Show Ad Revive button if not used yet
    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.style.display = this.hasRevived ? 'none' : 'block';
    }
    
    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
  }

  revivePlayer() {
    this.isGameOver = false;
    this.hasRevived = true;
    this.stealth.reset();
    
    // Reset boss position completely
    this.stealth.currentDist = 120;
    this.stealth.alertness = 0;
    this.stealth.isApproaching = false;

    if (this.ui.endModal) this.ui.endModal.style.display = 'none';
  }'''

c = c.replace(busted_old, busted_new)

with open('games/04-cyber-slacker/js/game.js', 'w', encoding='utf-8') as f:
    f.write(c)
