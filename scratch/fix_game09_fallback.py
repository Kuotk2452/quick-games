import os

def fix_ad_blocker_fallback():
    file_path = "games/09-orbit-odyssey/js/game.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    old_boost = """    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.startGame(300);
          });
        }
      });
    }"""
    
    new_boost = """    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.startGame(300);
          });
        } else {
          console.warn("Ad SDK not found (blocked by AdBlocker?). Proceeding with fallback.");
          this.startGame(300);
        }
      });
    }"""

    old_revive = """    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        }
      });
    }"""

    new_revive = """    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        } else {
          console.warn("Ad SDK not found (blocked by AdBlocker?). Proceeding with fallback.");
          this.revivePlayer();
        }
      });
    }"""

    if old_boost in content:
        content = content.replace(old_boost, new_boost)
    if old_revive in content:
        content = content.replace(old_revive, new_revive)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_ad_blocker_fallback()
    print("Fixed Ad Blocker fallback in game.js!")
