import os

def bump_cache_version():
    file_path = "games/09-orbit-odyssey/index.html"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace the old version string
    old_script = '<script type="module" src="js/game.js?v=2.0"></script>'
    new_script = '<script type="module" src="js/game.js?v=2.1"></script>'
    
    if old_script in content:
        content = content.replace(old_script, new_script)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully bumped game.js version to v=2.1")
    else:
        print("Could not find the exact script tag.")

if __name__ == "__main__":
    bump_cache_version()
