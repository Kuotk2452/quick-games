import os

def fix_html_all():
    file_path = "games/09-orbit-odyssey/index.html"
    
    # Read as bytes to avoid any decoding issues
    with open(file_path, "rb") as f:
        content_bytes = f.read()

    # Try to decode as utf-8, if it fails, it means it's ANSI corrupted
    try:
        content = content_bytes.decode('utf-8')
    except UnicodeDecodeError:
        content = content_bytes.decode('windows-1252')

    # Remove onclick attributes
    content = content.replace('onclick="window.gameApp.triggerAdBoost()" ', '')
    content = content.replace('onclick="window.gameApp.triggerAdRevive()" ', '')
    
    # Fix corrupted emojis if present
    content = content.replace("s", "⚡")
    content = content.replace("dYZ", "🎥")
    content = content.replace("s", "⚡") # Sometimes it's this
    content = content.replace("dYZ", "🎥")

    # Bump version
    content = content.replace("game.js?v=4.0", "game.js?v=5.0")
    content = content.replace("game.js?v=3.0", "game.js?v=5.0")
    content = content.replace("game.js?v=2.2", "game.js?v=5.0")
    content = content.replace("game.js?v=2.1", "game.js?v=5.0")
    content = content.replace("game.js?v=2.0", "game.js?v=5.0")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_html_all()
