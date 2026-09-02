import os

def add_alert():
    file_path = "games/09-orbit-odyssey/js/game.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    old_boost = """  triggerAdBoost() {
    console.log("Triggered Ad Boost! (v3.0)");
    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.startGame(300);
      });
    } else {
      console.warn("Ad SDK fallback triggered.");
      this.startGame(300);
    }
  }"""
    
    new_boost = """  triggerAdBoost() {
    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.startGame(300);
      });
    } else {
      alert("Ad SDK blocked by your browser/AdBlocker! 🚀 Skipping Ad and granting 300LY boost instantly!");
      this.startGame(300);
    }
  }"""

    old_revive = """  triggerAdRevive() {
    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.revivePlayer();
      });
    } else {
      console.warn("Ad SDK fallback triggered.");
      this.revivePlayer();
    }
  }"""

    new_revive = """  triggerAdRevive() {
    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.revivePlayer();
      });
    } else {
      alert("Ad SDK blocked by your browser/AdBlocker! 🚀 Skipping Ad and reviving you instantly!");
      this.revivePlayer();
    }
  }"""

    if old_boost in content:
        content = content.replace(old_boost, new_boost)
    if old_revive in content:
        content = content.replace(old_revive, new_revive)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    add_alert()
