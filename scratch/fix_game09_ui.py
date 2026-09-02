import os

def fix_ui_bindings():
    file_path = "games/09-orbit-odyssey/js/game.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the UI bindings block and insert btnAdBoost and btnAdRevive
    old_bindings = """      btnStart: document.getElementById('btnStart'),
      btnRestart: document.getElementById('btnRestart')"""
      
    new_bindings = """      btnStart: document.getElementById('btnStart'),
      btnRestart: document.getElementById('btnRestart'),
      btnAdBoost: document.getElementById('btnAdBoost'),
      btnAdRevive: document.getElementById('btnAdRevive')"""

    if old_bindings in content:
        content = content.replace(old_bindings, new_bindings)
    else:
        print("Warning: old bindings not found. Maybe already updated?")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_ui_bindings()
    print("Fixed UI bindings in game.js!")
