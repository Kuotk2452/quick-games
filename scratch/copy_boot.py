import os
import re

css_path_3 = 'games/03-dungeon-claw/css/style.css'
css_path_5 = 'games/05-cosmic-orbit/css/style.css'

with open(css_path_3, 'r', encoding='utf-8') as f:
    css3 = f.read()

with open(css_path_5, 'r', encoding='utf-8') as f:
    css5 = f.read()

# Extract arcade boot screen CSS
match = re.search(r'/\* Arcade Boot Screen \*/.*?/\* ========================================== \*/', css3, re.DOTALL)
if not match:
    match = re.search(r'/\* Arcade Boot Screen \*/.*', css3, re.DOTALL)

if match:
    arcade_css = match.group(0)
    # Remove telemetry boot screen CSS
    css5 = re.sub(r'/\* Telemetry Boot Screen \*/.*?/\* ========================================== \*/', '', css5, flags=re.DOTALL)
    css5 = re.sub(r'/\* Telemetry Boot Screen \*/.*?(?=/\* ==========================================)', '', css5, flags=re.DOTALL)
    
    # Append arcade CSS
    css5 += '\n' + arcade_css

    with open(css_path_5, 'w', encoding='utf-8') as f:
        f.write(css5)
        print('CSS Copied')
