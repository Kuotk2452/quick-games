import os
import glob

html_files = [
    'games/02-wordle-survivor/index.html',
    'games/03-dungeon-claw/index.html',
    'games/04-cyber-slacker/index.html'
]

for filepath in html_files:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            c = f.read()
        
        c = c.replace('mock-ad-sdk.js', 'mock-reward-sdk.js')
        
        # bump cache version
        if '02-wordle-survivor' in filepath:
            c = c.replace('game.js?v=2.4', 'game.js?v=2.5')
        elif '03-dungeon-claw' in filepath:
            c = c.replace('game.js?v=8.9', 'game.js?v=9.0')
        elif '04-cyber-slacker' in filepath:
            c = c.replace('?v=1.3', '?v=1.4')
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(c)

print('Done')
