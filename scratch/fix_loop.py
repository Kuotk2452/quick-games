import os

filepath = 'games/03-dungeon-claw/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('this.currentMonster.mesh.position.y = 4.2 + Math.sin', 'this.currentMonster.mesh.position.y = 1.2 + Math.sin')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
