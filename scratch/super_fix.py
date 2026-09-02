import os
import re

def super_fix():
    game_file = "games/09-orbit-odyssey/js/game.js"
    html_file = "games/09-orbit-odyssey/index.html"

    # 1. Update game.js: Completely replace bindEvents to use triggerAdBoost
    with open(game_file, "r", encoding="utf-8") as f:
        g_content = f.read()

    # Find bindEvents and replace everything inside it up to handleInteractStart
    match = re.search(r'bindEvents\(\)\s*\{.*?const handleInteractStart', g_content, re.DOTALL)
    if match:
        new_bind = """bindEvents() {
    this.ui.btnAckTutorial.addEventListener('click', () => {
      this.ui.tutorialScreen.classList.add('hidden');
      this.ui.mainMenu.classList.remove('hidden');
      this.state = 'MENU';
    });
    this.ui.btnStart.addEventListener('click', () => this.startGame());
    this.ui.btnRestart.addEventListener('click', () => this.startGame());
    
    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', (e) => { e.preventDefault(); this.triggerAdBoost(); });
    }
    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', (e) => { e.preventDefault(); this.triggerAdRevive(); });
    }

    const handleInteractStart"""
        g_content = g_content.replace(match.group(0), new_bind)

    with open(game_file, "w", encoding="utf-8") as f:
        f.write(g_content)

    # 2. Update index.html: Bump both JS files to bust all caches!
    with open(html_file, "r", encoding="utf-8") as f:
        h_content = f.read()

    h_content = h_content.replace('mock-reward-sdk.js"', 'mock-reward-sdk.js?v=2.0"')
    h_content = h_content.replace('game.js?v=5.0', 'game.js?v=6.0')

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(h_content)

if __name__ == "__main__":
    super_fix()
