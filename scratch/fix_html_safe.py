import os
import re

def fix_html_all():
    file_path = "games/09-orbit-odyssey/index.html"
    
    with open(file_path, "rb") as f:
        content_bytes = f.read()

    try:
        content = content_bytes.decode('utf-8')
    except:
        content = content_bytes.decode('windows-1252')

    # Remove onclick attributes using regex
    content = re.sub(r' onclick="[^"]+"', '', content)
    
    # Fix emojis specifically in the button text
    content = re.sub(r'[^a-zA-Z0-9<>\s=":#;\.\-]*\s*Watch Ad: \+300 LY', '⚡ Watch Ad: +300 LY', content)
    content = re.sub(r'[^a-zA-Z0-9<>\s=":#;\.\-]*\s*Watch Ad: Quantum Warp', '🎥 Watch Ad: Quantum Warp', content)

    # Bump version
    content = re.sub(r'game\.js\?v=\d+\.\d+', 'game.js?v=5.0', content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_html_all()
