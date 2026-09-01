import os

files_to_check = [
    'games/03-dungeon-claw/index.html',
    'games/03-dungeon-claw/js/game.js',
    'games/03-dungeon-claw/css/style.css',
    'games/04-cyber-slacker/index.html',
    'games/04-cyber-slacker/js/game.js',
    'games/04-cyber-slacker/css/style.css',
]

for filepath in files_to_check:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Replace IDs and Classes
    c = c.replace('btnAdRevive', 'btnExtraLife')
    c = c.replace('ad-btn', 'extra-life-btn')
    
    # Bump cache buster in HTML to v1.3
    if filepath.endswith('.html'):
        c = c.replace('game.js?v=1.2', 'game.js?v=1.3')
        c = c.replace('game.js?v=8.4', 'game.js?v=8.5')
        c = c.replace('(v1.2)', '(v1.3)')
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)
