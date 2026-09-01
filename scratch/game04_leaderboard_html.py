import os
import re

filepath = 'games/04-cyber-slacker/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

leaderboard_modal = '''
  <!-- Leaderboard Modal -->
  <div id="leaderboardModal" class="modal-overlay" style="display: none; z-index: 10005;">
    <div class="modal-content" style="max-width: 400px; padding: 20px;">
      <h2 class="modal-title" style="color: #eab308; margin-bottom: 10px;">dY<+ GLOBAL SLACKERS</h2>
      <p class="modal-subtitle" style="margin-bottom: 20px;">Top Earners on Company Time</p>
      
      <div id="leaderboardList" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; max-height: 300px; overflow-y: auto; text-align: left; padding: 10px; background: rgba(0,0,0,0.4); border-radius: 8px;">
        <!-- Ranks injected here -->
      </div>
      
      <button id="btnCloseLeaderboard" class="secondary-btn" style="width: 100%;">CLOSE</button>
    </div>
  </div>
'''

html = html.replace('  <div id="endModal"', leaderboard_modal + '  <div id="endModal"')

# Add leaderboard button to endModal
btn_leaderboard = '''
          <button id="btnViewLeaderboard" class="secondary-btn" style="margin-bottom: 15px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;">dY<+ View Global Rank</button>
          <div style="display: flex; gap: 10px;">'''

html = html.replace('<div style="display: flex; gap: 10px;">', btn_leaderboard)

html = html.replace('</script>\n</body>', '</script>\n  <script type="module" src="js/leaderboard.js?v=1.0"></script>\n</body>')
html = html.replace('?v=1.4', '?v=1.5')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
