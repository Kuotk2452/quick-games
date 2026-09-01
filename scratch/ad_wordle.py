import os
import re

filepath = 'games/02-wordle-survivor/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(
    r'<div class="modal-actions">\s*<button id="btnPlayAgain"',
    '<div class="modal-actions" style="flex-direction: column; gap: 10px;">\n          <button id="btnExtraLife" class="primary-btn" style="display: none; background: #eab308; color: #111; width: 100%;">dYZz Watch Ad to Revive (Restore 50% HP)</button>\n          <button id="btnPlayAgain"',
    c
)

c = c.replace('js/game.js?v=2.2', 'js/game.js?v=2.3')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(c)
