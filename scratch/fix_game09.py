import re

def update_space3d():
    file_path = "games/09-orbit-odyssey/js/space3d.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add disposeObject method
    dispose_code = """  disposeObject(obj) {
    if (!obj) return;
    this.scene.remove(obj);
    obj.traverse(child => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }

  updateTether(startX, startY, endX, endY, active) {"""
    
    content = content.replace("  updateTether(startX, startY, endX, endY, active) {", dispose_code)

    # 2. Add particle geometry and material disposal
    old_particle_remove = """      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
      }"""
    new_particle_remove = """      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        if (p.mesh.material) p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }"""
    content = content.replace(old_particle_remove, new_particle_remove)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)


def update_game():
    file_path = "games/09-orbit-odyssey/js/game.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update btnAdBoost to use startGame(300)
    old_boost = """    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.startGame();
            this.player.y = 300;
            this.maxDistance = 300;
            this.distance = 300;
            this.chunkY = 300;
            this.spawnChunk(this.chunkY);
            this.space.spawnExplosion(this.player.x, this.player.y);
          });
        }
      });
    }"""

    new_boost = """    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.startGame(300);
          });
        }
      });
    }"""
    content = content.replace(old_boost, new_boost)

    # 2. Update startGame to accept startDistance
    old_start = """  startGame() {
    orbitAudio.ensureContext();
    orbitAudio.playBGM();

    this.state = 'PLAYING';
    this.ui.mainMenu.classList.add('hidden');
    this.ui.gameOverMenu.classList.add('hidden');
    this.ui.hud.classList.remove('hidden');

    this.player.x = 0;
    this.player.y = -50;
    this.player.vx = 0;
    this.player.vy = 80;
    this.player.orbiting = false;
    this.player.targetPlanet = null;
    
    this.distance = 0;
    this.maxDistance = 0;
    this.combo = 1;
    this.chunkY = 0;

    // Clear world
    this.planets.forEach(p => this.space.scene.remove(p.mesh));
    this.asteroids.forEach(a => this.space.scene.remove(a.mesh));
    this.blackholes.forEach(b => this.space.scene.remove(b.group));
    this.planets = [];
    this.asteroids = [];
    this.blackholes = [];

    // Initial spawn
    this.spawnChunk(0);
    this.spawnChunk(200);
  }"""

    new_start = """  startGame(startDistance = 0) {
    orbitAudio.ensureContext();
    orbitAudio.playBGM();

    this.state = 'PLAYING';
    this.ui.mainMenu.classList.add('hidden');
    this.ui.gameOverMenu.classList.add('hidden');
    this.ui.hud.classList.remove('hidden');

    this.player.x = 0;
    this.player.y = startDistance > 0 ? startDistance : -50;
    this.player.vx = 0;
    this.player.vy = 80;
    this.player.orbiting = false;
    this.player.targetPlanet = null;
    
    this.distance = startDistance;
    this.maxDistance = startDistance;
    this.combo = 1;
    this.chunkY = startDistance;

    // Clear world with GPU memory disposal
    this.planets.forEach(p => this.space.disposeObject(p.mesh));
    this.asteroids.forEach(a => this.space.disposeObject(a.mesh));
    this.blackholes.forEach(b => this.space.disposeObject(b.group));
    this.planets = [];
    this.asteroids = [];
    this.blackholes = [];

    // Initial spawn
    this.spawnChunk(this.chunkY);
    this.spawnChunk(this.chunkY + 200);

    if (startDistance > 0) {
      this.space.spawnExplosion(this.player.x, this.player.y);
      this.scoreBonus(0, `🚀 WARP JUMP TO ${startDistance}LY!`);
    }
  }"""
    content = content.replace(old_start, new_start)

    # 3. Add revivePlayer method before die()
    revive_code = """  revivePlayer() {
    this.state = 'PLAYING';
    this.ui.gameOverMenu.classList.add('hidden');
    this.ui.hud.classList.remove('hidden');

    // Reset player velocity & flight state
    this.player.vx = 0;
    this.player.vy = 80;
    this.player.orbiting = false;
    this.player.targetPlanet = null;

    // Clear nearby threats within 70 units so player does not die immediately
    const safeRadius = 70;
    
    this.asteroids = this.asteroids.filter(a => {
      const dx = a.x - this.player.x;
      const dy = a.y - this.player.y;
      if (Math.sqrt(dx*dx + dy*dy) < safeRadius + a.radius) {
        this.space.disposeObject(a.mesh);
        return false;
      }
      return true;
    });

    this.blackholes = this.blackholes.filter(b => {
      const dx = b.x - this.player.x;
      const dy = b.y - this.player.y;
      if (Math.sqrt(dx*dx + dy*dy) < safeRadius + b.radius) {
        this.space.disposeObject(b.group);
        return false;
      }
      return true;
    });

    // Resume BGM & audio context
    orbitAudio.ensureContext();
    orbitAudio.playBGM();

    // Visual effect
    this.space.spawnExplosion(this.player.x, this.player.y);
    this.space.updateTether(0, 0, 0, 0, false);
    
    this.scoreBonus(0, '⚡ QUANTUM REVIVE ACTIVE!');
  }

  die(reason) {"""
    content = content.replace("  die(reason) {", revive_code)

    # 4. Update cleanupOldEntities with disposeObject
    old_cleanup = """  cleanupOldEntities() {
    const thresholdY = this.player.y - 300;
    
    this.planets = this.planets.filter(p => {
      if (p.y < thresholdY) { this.space.scene.remove(p.mesh); return false; }
      return true;
    });
    this.asteroids = this.asteroids.filter(a => {
      if (a.y < thresholdY) { this.space.scene.remove(a.mesh); return false; }
      return true;
    });
    this.blackholes = this.blackholes.filter(b => {
      if (b.y < thresholdY) { this.space.scene.remove(b.group); return false; }
      return true;
    });
  }"""

    new_cleanup = """  cleanupOldEntities() {
    const thresholdY = this.player.y - 300;
    
    this.planets = this.planets.filter(p => {
      if (p.y < thresholdY) { this.space.disposeObject(p.mesh); return false; }
      return true;
    });
    this.asteroids = this.asteroids.filter(a => {
      if (a.y < thresholdY) { this.space.disposeObject(a.mesh); return false; }
      return true;
    });
    this.blackholes = this.blackholes.filter(b => {
      if (b.y < thresholdY) { this.space.disposeObject(b.group); return false; }
      return true;
    });
  }"""
    content = content.replace(old_cleanup, new_cleanup)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_space3d()
    update_game()
    print("Successfully fixed Game 09!")
