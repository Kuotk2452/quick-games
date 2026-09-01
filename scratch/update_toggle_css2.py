import re

with open('games/08-circus-3d/css/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('width: 40px;', 'width: 80px;')
c = c.replace('height: 24px;', 'height: 36px;')
c = c.replace('top: 5px;', 'top: 0px;')
c = c.replace('font-size: 12px;', 'font-size: 18px;')
c = c.replace('border-radius: 0 0 8px 8px;', 'border-radius: 0 0 16px 16px;')

with open('games/08-circus-3d/css/style.css', 'w', encoding='utf-8') as f:
    f.write(c)
