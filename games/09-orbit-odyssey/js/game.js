import { SpaceScene } from './space3d.js';
import { orbitAudio } from './audio.js';

class OrbitGame {
  constructor() {
    this.ui = {
      bootScreen: document.getElementById('bootScreen'),
      terminalText: document.getElementById('terminalText'),
      tutorialScreen: document.getElementById('tutorialScreen'),
      btnAckTutorial: document.getElementById('btnAckTutorial'),
      mainMenu: document.getElementById('mainMenu'),
      gameOverMenu: document.getElementById('gameOverMenu'),
      hud: document.getElementById('hud'),
      distanceCount: document.getElementById('distanceCount'),
      comboCount: document.getElementById('comboCount'),
      closeCallBanner: document.getElementById('closeCallBanner'),
      deathReason: document.getElementById('deathReason'),
      finalScore: document.getElementById('finalScore'),
      bestScore: document.getElementById('bestScore'),
      btnStart: document.getElementById('btnStart'),
      btnRestart: document.getElementById('btnRestart'),
      btnAdBoost: document.getElementById('btnAdBoost'),
      btnAdRevive: document.getElementById('btnAdRevive')
    };

    this.state = 'BOOT'; // BOOT, TUTORIAL, MENU, PLAYING, GAMEOVER
    this.space = new SpaceScene(document.getElementById('gameContainer'));
    
    // Run boot sequence
    this.runBootSequence();
    
    // Player State
    this.player = {
      x: 0,
      y: -50,
      vx: 0,
      vy: 60, // Initial upward velocity
      radius: 2,
      orbiting: false,
      targetPlanet: null
    };

    // World State
    this.distance = 0;
    this.maxDistance = 0;
    this.combo = 1;
    this.highScore = localStorage.getItem('orbit_highscore') || 0;
    this.ui.bestScore.textContent = this.highScore;

    this.planets = [];
    this.asteroids = [];
    this.blackholes = [];
    this.chunkY = 0; // Procedural generation tracker

    this.bindEvents();
    
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  triggerAdBoost() {
    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.startGame(300);
      });
    } else {
      console.warn("Ad SDK fallback triggered.");
      this.startGame(300);
    }
  }

  triggerAdRevive() {
    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.revivePlayer();
      });
    } else {
      console.warn("Ad SDK fallback triggered.");
      this.revivePlayer();
    }
  }

  runBootSequence() {
    const sequence = [
      "INITIATING HYPER-DRIVE OS...",
      "LOADING GRAVITY TETHER PROTOCOLS...",
      "CALIBRATING NAVIGATION SENSORS...",
      "SYSTEM ONLINE."
    ];
    let step = 0;
    
    const typeLine = () => {
      if (step < sequence.length) {
        this.ui.terminalText.textContent += sequence[step] + '\n';
        step++;
        setTimeout(typeLine, 300);
      } else {
        setTimeout(() => {
          this.ui.bootScreen.classList.add('hidden');
          this.ui.tutorialScreen.classList.remove('hidden');
          this.state = 'TUTORIAL';
        }, 600);
      }
    };
    
    setTimeout(typeLine, 200);
  }

  bindEvents() {
    this.ui.btnAckTutorial.addEventListener('click', () => {
      this.ui.tutorialScreen.classList.add('hidden');
      this.ui.mainMenu.classList.remove('hidden');
      this.state = 'MENU';
    });
    this.ui.btnStart.addEventListener('click', () => this.startGame());
    this.ui.btnRestart.addEventListener('click', () => this.startGame());
    if (this.ui.btnAdBoost) {
      this.ui.btnAdBoost.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.startGame(300);
          });
        } else {
          console.warn("Ad SDK not found (blocked by AdBlocker?). Proceeding with fallback.");
          this.startGame(300);
        }
      });
    }

    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        } else {
          console.warn("Ad SDK not found (blocked by AdBlocker?). Proceeding with fallback.");
          this.revivePlayer();
        }
      });
    }


    const handleInteractStart = (e) => {
      if (this.state !== 'PLAYING') return;
      if (e.target.closest('button, a')) return;
      e.preventDefault();
      this.attemptOrbit();
    };

    const handleInteractEnd = (e) => {
      if (this.state !== 'PLAYING') return;
      e.preventDefault();
      this.releaseOrbit();
    };

    window.addEventListener('mousedown', handleInteractStart);
    window.addEventListener('touchstart', handleInteractStart, { passive: false });
    window.addEventListener('mouseup', handleInteractEnd);
    window.addEventListener('touchend', handleInteractEnd);
  }

  startGame(startDistance = 0) {
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
  }

  spawnChunk(yOffset) {
    // Generate 1-2 planets per 200m chunk
    const numPlanets = 1 + Math.floor(Math.random() * 2);
    for(let i = 0; i < numPlanets; i++) {
      const radius = 15 + Math.random() * 15;
      const x = (Math.random() - 0.5) * 160;
      const y = yOffset + Math.random() * 100 + 50;
      
      const types = ['gas', 'lava', 'ice'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const mesh = this.space.createPlanet(x, y, radius, type);
      this.planets.push({ x, y, radius, mesh, orbitRadius: radius * 2.2 });
    }

    // Generate Asteroids based on distance
    const numAsteroids = Math.floor(this.maxDistance / 500) + 1;
    for(let i=0; i < numAsteroids; i++) {
      const r = 3 + Math.random() * 4;
      const x = (Math.random() - 0.5) * 200;
      const y = yOffset + Math.random() * 200;
      const vx = (Math.random() - 0.5) * 40;
      const vy = (Math.random() - 0.5) * 40;
      const mesh = this.space.createAsteroid(x, y, r);
      this.asteroids.push({ x, y, radius: r, mesh, vx, vy });
    }

    // Generate Black Holes (rare)
    if (this.maxDistance > 1000 && Math.random() < 0.3) {
      const r = 12;
      const x = (Math.random() - 0.5) * 120;
      const y = yOffset + Math.random() * 150 + 50;
      const { group, disk } = this.space.createBlackHole(x, y, r);
      this.blackholes.push({ x, y, radius: r, group, disk, pullRadius: r * 5 });
    }

    this.chunkY = yOffset + 200;
  }

  attemptOrbit() {
    if (this.player.orbiting) return;

    // Find nearest planet within range
    let nearest = null;
    let minDist = Infinity;
    
    this.planets.forEach(p => {
      const dx = p.x - this.player.x;
      const dy = p.y - this.player.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      // Can latch from slightly outside the visual orbit radius
      if (dist < p.orbitRadius * 1.8 && dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    });

    if (nearest) {
      this.player.orbiting = true;
      this.player.targetPlanet = nearest;
      
      // Calculate angular velocity based on current linear speed and radius
      const speed = Math.sqrt(this.player.vx**2 + this.player.vy**2);
      
      // Determine clockwise or counter-clockwise based on cross product
      const dx = this.player.x - nearest.x;
      const dy = this.player.y - nearest.y;
      const cross = dx * this.player.vy - dy * this.player.vx;
      this.player.orbitDirection = cross > 0 ? -1 : 1;
      
      orbitAudio.playTetherLock();
      
      // Perfect orbit bonus
      if (minDist < nearest.radius * 1.5) {
        this.scoreBonus(500, 'PERFECT ORBIT!');
        orbitAudio.playPerfectOrbit();
        this.combo++;
      }
    }
  }

  releaseOrbit() {
    if (this.player.orbiting) {
      this.player.orbiting = false;
      this.player.targetPlanet = null;
      orbitAudio.playSlingshot();
      
      // Boost speed slightly on release
      const currentSpeed = Math.sqrt(this.player.vx**2 + this.player.vy**2);
      const boost = Math.min(150, currentSpeed * 1.2);
      const angle = Math.atan2(this.player.vy, this.player.vx);
      this.player.vx = Math.cos(angle) * boost;
      this.player.vy = Math.sin(angle) * boost;
    }
  }

  scoreBonus(pts, text) {
    this.distance += pts;
    this.ui.closeCallBanner.textContent = text;
    this.ui.closeCallBanner.classList.remove('hidden');
    setTimeout(() => this.ui.closeCallBanner.classList.add('hidden'), 1000);
  }

  revivePlayer() {
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

  die(reason) {
    this.state = 'GAMEOVER';
    this.ui.hud.classList.add('hidden');
    this.ui.gameOverMenu.classList.remove('hidden');
    this.ui.deathReason.textContent = reason;
    this.ui.deathReason.setAttribute('data-text', reason);
    
    const final = Math.floor(this.maxDistance);
    this.ui.finalScore.textContent = final + ' LY';
    
    if (final > this.highScore) {
      this.highScore = final;
      localStorage.setItem('orbit_highscore', this.highScore);
    }
    this.ui.bestScore.textContent = this.highScore;
    
    orbitAudio.stopBGM();
    orbitAudio.playCrash();
    this.space.spawnExplosion(this.player.x, this.player.y);
    this.space.updateTether(0,0,0,0,false);
  }

  loop(time) {
    requestAnimationFrame(this.loop.bind(this));
    
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    if (this.state === 'PLAYING') {
      this.updatePhysics(dt);
      
      // Procedural Generation chunking
      if (this.player.y + 200 > this.chunkY) {
        this.spawnChunk(this.chunkY);
        this.cleanupOldEntities();
      }

      // Update UI
      if (this.player.y > this.maxDistance) {
        this.maxDistance = this.player.y;
        this.distance = this.maxDistance;
      }
      this.ui.distanceCount.textContent = Math.floor(this.distance);
      this.ui.comboCount.textContent = 'x' + this.combo;
      
      // Trail
      if (Math.random() < 0.3) {
        this.space.spawnTrailParticle(this.player.x, this.player.y);
      }
    }
    
    const angle = Math.atan2(this.player.vy, this.player.vx);
    this.space.update(dt, this.player.x, this.player.y, angle);
    this.space.render();
  }

  updatePhysics(dt) {
    if (this.player.orbiting && this.player.targetPlanet) {
      const p = this.player.targetPlanet;
      const dx = this.player.x - p.x;
      const dy = this.player.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Centripetal force logic
      // Target radius is the orbitRadius
      const targetR = p.orbitRadius;
      const rDiff = targetR - dist;
      
      // Pull player towards orbit radius smoothly
      const pullForce = 150 * dt;
      const nx = dx / dist;
      const ny = dy / dist;
      this.player.x += nx * rDiff * pullForce * dt;
      this.player.y += ny * rDiff * pullForce * dt;

      // Angular movement
      const speed = Math.min(100 + this.combo * 5, 200); // Orbit speed caps at 200
      const angularVel = (speed / targetR) * this.player.orbitDirection;
      
      let currentAngle = Math.atan2(dy, dx);
      currentAngle += angularVel * dt;
      
      this.player.x = p.x + Math.cos(currentAngle) * targetR;
      this.player.y = p.y + Math.sin(currentAngle) * targetR;
      
      // Update linear velocity to be tangential for when they release
      this.player.vx = -Math.sin(currentAngle) * speed * this.player.orbitDirection;
      this.player.vy = Math.cos(currentAngle) * speed * this.player.orbitDirection;

      this.space.updateTether(this.player.x, this.player.y, p.x, p.y, true);
    } else {
      // Free movement
      this.player.x += this.player.vx * dt;
      this.player.y += this.player.vy * dt;
      this.space.updateTether(0,0,0,0,false);
      
      // Slow down slightly over time
      this.player.vx *= (1 - 0.1 * dt);
      this.player.vy *= (1 - 0.1 * dt);
      
      // Minimum forward velocity to prevent stalling entirely, unless completely going backwards
      if (this.player.vy < 30 && this.player.vy > -10) {
         this.player.vy += 20 * dt; 
      }
    }

    // Black Hole Gravity
    this.blackholes.forEach(bh => {
      const dx = bh.x - this.player.x;
      const dy = bh.y - this.player.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Spin accretion disk
      bh.disk.rotation.z += dt;

      if (dist < bh.pullRadius) {
        const force = (bh.pullRadius - dist) * 2.0;
        this.player.vx += (dx / dist) * force * dt;
        this.player.vy += (dy / dist) * force * dt;
      }

      // Event Horizon Collision
      if (dist < bh.radius + this.player.radius) {
        this.die('EVENT HORIZON');
      }
    });

    // Asteroid logic
    this.asteroids.forEach(a => {
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.mesh.position.set(a.x, a.y, 0);
      
      // Collision
      const dx = a.x - this.player.x;
      const dy = a.y - this.player.y;
      if (Math.sqrt(dx*dx + dy*dy) < a.radius + this.player.radius) {
        this.die('HULL BREACH');
      }
    });

    // Planet Collision
    this.planets.forEach(p => {
      const dx = p.x - this.player.x;
      const dy = p.y - this.player.y;
      if (Math.sqrt(dx*dx + dy*dy) < p.radius + this.player.radius) {
        this.die('ATMOSPHERIC BURNUP');
      }
    });

    // Deep Space bounds
    if (this.player.x < -180 || this.player.x > 180 || this.player.y < this.maxDistance - 150) {
      this.die('LOST IN SPACE');
    }
  }

  cleanupOldEntities() {
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
  }
}

// Boot game
window.gameApp = new OrbitGame();
