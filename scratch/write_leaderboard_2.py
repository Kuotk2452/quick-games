import os

filepath = 'games/04-cyber-slacker/js/leaderboard.js'
js = """export class LeaderboardManager {
  constructor() {
    // We bind close button event dynamically when showing, or just attach to window
  }

  show(playerScore) {
    this.modal = document.getElementById('leaderboardModal');
    this.list = document.getElementById('leaderboardList');
    this.btnClose = document.getElementById('btnCloseLeaderboard');
    
    if (this.btnClose && !this.btnCloseBound) {
      this.btnClose.addEventListener('click', () => this.hide());
      this.btnCloseBound = true;
    }
    
    if (!this.modal || !this.list) {
      console.error("Leaderboard modal elements missing");
      return;
    }
    
    this.names = [
      'CryptoKing99', 'SlackMaster', 'QuietQuitter', 'CoffeeBreakPro', 
      'WFH_Hero', 'DogeHodler', 'ToiletGamer', 'TabSwitcher',
      'MinMaxer', 'BoredEmployee', 'AltTabbing', 'SneakyPeaky'
    ];
    
    const entries = [];
    
    // Ensure playerScore is a valid number
    const validScore = (typeof playerScore === 'number' && !isNaN(playerScore)) ? playerScore : 0;
    
    for (let i = 0; i < 9; i++) {
      const variance = (Math.random() - 0.5) * 500;
      let score = Math.max(0, validScore + variance);
      if (i < 3) score = validScore + 100 + Math.random() * 1000;
      
      entries.push({
        name: this.names[Math.floor(Math.random() * this.names.length)] + Math.floor(Math.random() * 100),
        score: score,
        isPlayer: false
      });
    }
    
    entries.push({
      name: 'YOU',
      score: validScore,
      isPlayer: true
    });
    
    entries.sort((a, b) => b.score - a.score);
    
    this.list.innerHTML = '';
    entries.forEach((entry, idx) => {
      const el = document.createElement('div');
      el.style.display = 'flex';
      el.style.justifyContent = 'space-between';
      el.style.padding = '8px';
      el.style.borderRadius = '4px';
      el.style.fontFamily = 'monospace';
      
      if (entry.isPlayer) {
        el.style.background = 'rgba(234, 179, 8, 0.2)';
        el.style.border = '1px solid #eab308';
        el.style.fontWeight = 'bold';
        el.style.color = '#eab308';
      } else {
        el.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      }
      
      const rankColor = idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : '#fff';
      
      el.innerHTML = `
        <span><span style="color: ${rankColor}; display: inline-block; width: 25px;">#${idx + 1}</span> ${entry.name}</span>
        <span>$${entry.score.toFixed(2)}</span>
      `;
      this.list.appendChild(el);
    });
    
    this.modal.style.display = 'flex';
  }
  
  hide() {
    if (this.modal) this.modal.style.display = 'none';
  }
}

window.leaderboardManager = new LeaderboardManager();
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
