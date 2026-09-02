import os

def fix_robust_onclick():
    game_file = "games/09-orbit-odyssey/js/game.js"
    html_file = "games/09-orbit-odyssey/index.html"

    # 1. Update game.js
    with open(game_file, "r", encoding="utf-8") as f:
        g_content = f.read()

    # Add triggerAdBoost and triggerAdRevive methods to the class
    trigger_methods = """  triggerAdBoost() {
    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.startGame(300);
      });
    } else {
      console.warn("Ad SDK fallback triggered.");
      this.startGame(300);
    }
  }

  triggerAdRevive() {
    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.revivePlayer();
      });
    } else {
      console.warn("Ad SDK fallback triggered.");
      this.revivePlayer();
    }
  }

  runBootSequence() {"""

    g_content = g_content.replace("  runBootSequence() {", trigger_methods)

    # Export to window
    g_content = g_content.replace("new OrbitGame();", "window.gameApp = new OrbitGame();")

    with open(game_file, "w", encoding="utf-8") as f:
        f.write(g_content)

    # 2. Update index.html
    with open(html_file, "r", encoding="utf-8") as f:
        h_content = f.read()

    old_btn_boost = '<button id="btnAdBoost" class="btn-primary" style="background: #eab308; color: #111; margin-top: 10px; width: 100%; font-weight: bold; border-color: #fef08a;">'
    new_btn_boost = '<button id="btnAdBoost" onclick="window.gameApp.triggerAdBoost()" class="btn-primary" style="background: #eab308; color: #111; margin-top: 10px; width: 100%; font-weight: bold; border-color: #fef08a;">'
    h_content = h_content.replace(old_btn_boost, new_btn_boost)

    old_btn_revive = '<button id="btnAdRevive" class="btn-primary" style="background: #eab308; color: #111; margin-bottom: 10px; width: 100%; font-weight: bold; border-color: #fef08a;">'
    new_btn_revive = '<button id="btnAdRevive" onclick="window.gameApp.triggerAdRevive()" class="btn-primary" style="background: #eab308; color: #111; margin-bottom: 10px; width: 100%; font-weight: bold; border-color: #fef08a;">'
    h_content = h_content.replace(old_btn_revive, new_btn_revive)
    
    # Bump version to v=2.2
    h_content = h_content.replace('game.js?v=2.1', 'game.js?v=2.2')

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(h_content)


if __name__ == "__main__":
    fix_robust_onclick()
