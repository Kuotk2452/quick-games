import os

filepath = 'games/03-dungeon-claw/js/monsters.js'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('group.position.set(0, 4.2, -1.8);', 'group.position.set(0, 1.2, -3.2);')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
