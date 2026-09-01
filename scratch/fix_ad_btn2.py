import re

with open('games/04-cyber-slacker/index.html', 'r', encoding='utf-8') as f:
    c2 = f.read()

# I see the exact HTML from the cat command, let's target it specifically.
old_html = '''        <div class=\"modal-actions\">
          <button id=\"btnAdRevive\" class=\"ad-btn\" style=\"display: none; background: #eab308; color: #111;\">&#127909; Watch Ad to Bribe HR</button>
          <button id=\"btnPlayAgain\" class=\"primary-start-btn\" data-i18n=\"playAgain\">dY\", New Workday</button>
          <button id=\"btnShareScore\" class=\"secondary-btn\" data-i18n=\"shareScore\">dY\"< Share Review</button>
        </div>'''

new_html = '''        <div class=\"modal-actions\" style=\"flex-direction: column; gap: 8px;\">
          <button id=\"btnAdRevive\" class=\"ad-btn\" style=\"display: none; justify-content: center; align-items: center; background: #eab308; color: #111; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; padding: 12px; font-size: 16px;\">&#127909; Watch Ad to Bribe HR</button>
          <div style=\"display: flex; gap: 8px; width: 100%;\">
            <button id=\"btnPlayAgain\" class=\"primary-start-btn\" style=\"flex: 1;\" data-i18n=\"playAgain\">dY\", New Workday</button>
            <button id=\"btnShareScore\" class=\"secondary-btn\" style=\"flex: 1;\" data-i18n=\"shareScore\">dY\"< Share Review</button>
          </div>
        </div>'''

# Try simple replace first
c2 = c2.replace(old_html, new_html)

# If it didn't work, use regex to just nuke and replace the modal-actions div
c2 = re.sub(r'<div class=\"modal-actions\">.*?</div>', new_html, c2, flags=re.DOTALL)

with open('games/04-cyber-slacker/index.html', 'w', encoding='utf-8') as f:
    f.write(c2)
