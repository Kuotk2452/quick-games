import os

def fix_btn_ad_boost():
    file_path = "games/09-orbit-odyssey/js/game.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove the old addEventListener blocks that might cause double firing or errors
    old_listener_boost = """    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.startGame(300);
          });
        } else {
          console.warn("Ad SDK fallback triggered.");
          this.startGame(300);
        }
      });
    }"""
    content = content.replace(old_listener_boost, "")

    old_listener_revive = """    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        } else {
          console.warn("Ad SDK fallback triggered.");
          this.revivePlayer();
        }
      });
    }"""
    content = content.replace(old_listener_revive, "")

    # 2. Add ultra-robust diagnostic alerts to the very top of triggerAdBoost
    old_trigger = """  triggerAdBoost() {
    console.log("Triggered Ad Boost! (v3.0)");
    if (window.QuickGamesAdSDK) {"""
    
    new_trigger = """  triggerAdBoost() {
    alert("DIAGNOSTIC: Button click successfully reached Javascript!");
    if (window.QuickGamesAdSDK) {"""
    content = content.replace(old_trigger, new_trigger)
    
    old_revive_trigger = """  triggerAdRevive() {
    if (window.QuickGamesAdSDK) {"""
    
    new_revive_trigger = """  triggerAdRevive() {
    alert("DIAGNOSTIC: Button click successfully reached Javascript!");
    if (window.QuickGamesAdSDK) {"""
    content = content.replace(old_revive_trigger, new_revive_trigger)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_btn_ad_boost()
