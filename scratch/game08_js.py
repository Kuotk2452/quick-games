import os

filepath = 'games/08-circus-3d/js/game.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

# Add to initDOM
js = js.replace("closeCallBanner: document.getElementById('closeCallBanner'),", "closeCallBanner: document.getElementById('closeCallBanner'),\n      perfectJumpBanner: document.getElementById('perfectJumpBanner'),")

# Replace FIRE_RING clearance logic
old_logic = '''          // Check Ring Clearance
          if (!obs.cleared && Math.abs(this.player.x - obs.x) < 0.6) {
            if (this.player.y > 0.7 && this.player.y < 2.5) {
              obs.cleared = true;
              this.score += 200 * this.multiplier;
            } else {
              this.handleObstacleHit(obs);
            }
          }'''

new_logic = '''          // Check Ring Clearance
          if (!obs.cleared && Math.abs(this.player.x - obs.x) < 0.6) {
            if (this.player.y > 0.7 && this.player.y < 2.5) {
              obs.cleared = true;
              
              // PERFECT JUMP (Center is roughly 1.6)
              if (Math.abs(this.player.y - 1.6) < 0.3) {
                this.score += 800 * this.multiplier;
                this.bulletTimeTimer = 1.0; // 1.0s slow motion
                circusAudio.playPerfectCheer();
                
                if (this.ui.perfectJumpBanner) {
                  this.ui.perfectJumpBanner.style.display = 'block';
                  setTimeout(() => {
                    if (this.ui.perfectJumpBanner) this.ui.perfectJumpBanner.style.display = 'none';
                  }, 1200);
                }
              } else {
                this.score += 200 * this.multiplier;
              }
            } else {
              this.handleObstacleHit(obs);
            }
          }'''

js = js.replace(old_logic, new_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
