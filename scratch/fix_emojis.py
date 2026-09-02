import os

def fix_html_emojis():
    file_path = "games/09-orbit-odyssey/index.html"
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Re-insert the proper emojis
    content = content.replace("s", "⚡")
    content = content.replace("dYZ", "🎥")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_html_emojis()
