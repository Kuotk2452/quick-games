filepath = 'games/03-dungeon-claw/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('game.js?v=8.5', 'game.js?v=8.6')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
