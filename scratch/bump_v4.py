import os

def bump_v4():
    file_path = "games/09-orbit-odyssey/index.html"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace("game.js?v=3.0", "game.js?v=4.0")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    bump_v4()
