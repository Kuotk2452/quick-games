import os
import re

html_path = 'games/05-cosmic-orbit/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

arcade_html = '''  <!-- Arcade Boot Sequence -->
  <div id="arcadeBootScreen" class="arcade-boot-screen active">
    <div class="crt-overlay"></div>
    <div class="boot-text pulse">INSERT COIN TO ORBIT</div>
    <div class="boot-subtext">[ TAP TO START ]</div>
    <!-- Gates for transition -->
    <div class="iron-gate top-gate"></div>
    <div class="iron-gate bottom-gate"></div>
  </div>'''

# Replace telemetry
html = re.sub(
    r'<!-- Telemetry Boot Sequence -->\s*<div id="telemetryBootScreen".*?</div>\s*</div>',
    arcade_html,
    html,
    flags=re.DOTALL
)

html = html.replace('js/game.js?v=2.2', 'js/game.js?v=2.3')
html = html.replace('</script>\n</body>', '</script>\n  <script type="module" src="js/arcade_boot.js?v=1.1"></script>\n</body>')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
