import os

def restore_event_listeners():
    game_file = "games/09-orbit-odyssey/js/game.js"
    html_file = "games/09-orbit-odyssey/index.html"

    # 1. Update game.js
    with open(game_file, "r", encoding="utf-8") as f:
        g_content = f.read()

    # Re-insert addEventListener blocks inside bindEvents()
    old_bind = """    this.ui.btnRestart.addEventListener('click', () => this.startGame());"""
    new_bind = """    this.ui.btnRestart.addEventListener('click', () => this.startGame());

    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', () => this.triggerAdBoost());
    }
    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => this.triggerAdRevive());
    }"""
    
    if "this.ui.btnAdBoost.addEventListener" not in g_content:
        g_content = g_content.replace(old_bind, new_bind)

    with open(game_file, "w", encoding="utf-8") as f:
        f.write(g_content)

    # 2. Update index.html to remove onclick and bump to v=5.0
    with open(html_file, "r", encoding="utf-8") as f:
        h_content = f.read()

    h_content = h_content.replace('onclick="window.gameApp.triggerAdBoost()" ', '')
    h_content = h_content.replace('onclick="window.gameApp.triggerAdRevive()" ', '')
    h_content = h_content.replace('game.js?v=4.0', 'game.js?v=5.0')
    h_content = h_content.replace('game.js?v=3.0', 'game.js?v=5.0') # just in case

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(h_content)

if __name__ == "__main__":
    restore_event_listeners()
