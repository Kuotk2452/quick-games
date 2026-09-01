import os
import re

js_path = 'games/05-cosmic-orbit/js/game.js'
with open(js_path, 'rb') as f:
    js = f.read().decode('utf-8')

js = re.sub(r'telemetryBootScreen: document\.getElementById\(\'telemetryBootScreen\'\),', '', js)
js = re.sub(r'bootRadar: document\.getElementById\(\'bootRadar\'\),', '', js)
js = re.sub(r'bootTextStatus: document\.getElementById\(\'bootTextStatus\'\),', '', js)
js = re.sub(r'bootTextTap: document\.getElementById\(\'bootTextTap\'\),', '', js)

old_boot_logic = r'''    if \(this\.ui\.telemetryBootScreen\).*?1500\);\n      \}\);\n    \}'''
js = re.sub(old_boot_logic, '', js, flags=re.DOTALL)

with open(js_path, 'wb') as f:
    f.write(js.encode('utf-8'))
