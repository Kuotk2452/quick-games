/**
 * Circus Rush 3D: Main Game Controller & 3D Physics Loop
 */

import { circusAudio } from './audio.js';
import { i18n } from './i18n.js';
import { CharacterFactory3D } from './characters.js';
import { ObstacleFactory3D } from './obstacles.js';
import { CircusStage3D } from './stage3d.js';

export const ACT_DEFINITIONS = [
  {
    id: 1,
    nameKey: 'act1Name',
    descKey: 'act1Desc',
    badge: '🦁 ACT 1',
    goalDist: 100,
    speed: 5.5,
    themeColor: '#ef4444'
  },
  {
    id: 2,
    nameKey: 'act2Name',
    descKey: 'act2Desc',
    badge: '🐒 ACT 2',
    goalDist: 100,
    speed: 6.0,
    themeColor: '#3b82f6'
  },
  {
    id: 3,
    nameKey: 'act3Name',
    descKey: 'act3Desc',
    badge: '⚽ ACT 3',
    goalDist: 100,
    speed: 6.5,
    themeColor: '#ec4899'
  },
  {
    id: 4,
    nameKey: 'act4Name',
    descKey: 'act4Desc',
    badge: '🪢 ACT 4',
    goalDist: 100,
    speed: 7.0,
    themeColor: '#facc15'
  }
];

export class CircusGame {
  constructor() {
    this.container = document.getElementById('webglContainer');
    this.stage = new CircusStage3D(this.container);

    this.state = 'ACT_SELECT'; // 'ACT_SELECT' | 'PLAYING' | 'STAGE_CLEAR' | 'GAME_OVER'
    this.currentActIdx = 0;

    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.multiplier = 1;
    this.bulletTimeTimer = 0;

    // Player Physics State
    this.player = {
      x: 0,
      y: 0,
      z: 0,
      vx: 5.5,
      vy: 0,
      isGrounded: true,
      canDoubleJump: true,
      jumpRotation: 0,
      meshData: null
    };

    this.obstacles = []; // Array of obstacle objects
    this.keys = { left: false, right: false, jump: false };

    this.initPlayer();
    this.initDOM();
    this.initEvents();
    this.renderActSelection();

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initPlayer() {
    this.player.meshData = CharacterFactory3D.createLionRider();
    this.stage.scene.add(this.player.meshData.mesh);
  }

  initDOM() {
    this.ui = {
      actSelectView: document.getElementById('actSelectView'),
      gameplayHUD: document.getElementById('gameplayHUD'),
      actCardsContainer: document.getElementById('actCardsContainer'),
      scoreDisplay: document.getElementById('scoreDisplay'),
      coinsDisplay: document.getElementById('coinsDisplay'),
      distDisplay: document.getElementById('distDisplay'),
      livesDisplay: document.getElementById('livesDisplay'),
      multiplierDisplay: document.getElementById('multiplierDisplay'),
      bulletTimeBanner: document.getElementById('bulletTimeBanner'),
      endModal: document.getElementById('endModal'),
      modalTitle: document.getElementById('modalTitle'),
      modalDesc: document.getElementById('modalDesc'),
      resultScore: document.getElementById('resultScore'),
      resultCoins: document.getElementById('resultCoins'),
      btnNextAct: document.getElementById('btnNextAct'),
      btnRetry: document.getElementById('btnRetry'),
      btnSelectAct: document.getElementById('btnSelectAct'),
      btnShareScore: document.getElementById('btnShareScore'),
      audioToggleBtn: document.getElementById('audioToggleBtn'),
      langSelect: document.getElementById('langSelect'),
      touchJumpBtn: document.getElementById('touchJumpBtn'),
      touchLeftBtn: document.getElementById('touchLeftBtn'),
      touchRightBtn: document.getElementById('touchRightBtn')
    };
  }

  initEvents() {
    window.addEventListener('resize', () => this.stage.handleResize());

    // Audio & Language
    if (this.ui.audioToggleBtn) {
      this.ui.audioToggleBtn.addEventListener('click', () => {
        const muted = circusAudio.toggleMute();
        this.ui.audioToggleBtn.innerText = muted ? '🔇' : '🔊';
      });
    }

    if (this.ui.langSelect) {
      this.ui.langSelect.value = i18n.currentLang;
      this.ui.langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        this.renderActSelection();
      });
    }

    // Modal Actions
    if (this.ui.btnRetry) {
      this.ui.btnRetry.addEventListener('click', () => {
        this.startAct(this.currentActIdx);
      });
    }

    if (this.ui.btnNextAct) {
      this.ui.btnNextAct.addEventListener('click', () => {
        const nextIdx = (this.currentActIdx + 1) % ACT_DEFINITIONS.length;
        this.startAct(nextIdx);
      });
    }

    if (this.ui.btnSelectAct) {
      this.ui.btnSelectAct.addEventListener('click', () => {
        this.showActSelect();
      });
    }

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (this.state !== 'PLAYING') return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.triggerJump();
        e.preventDefault();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = true;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
    });

    // Touch Controls
    if (this.ui.touchJumpBtn) {
      this.ui.touchJumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerJump();
      });
    }
    if (this.ui.touchLeftBtn) {
      this.ui.touchLeftBtn.addEventListener('touchstart', () => { this.keys.left = true; });
      this.ui.touchLeftBtn.addEventListener('touchend', () => { this.keys.left = false; });
      this.ui.touchLeftBtn.addEventListener('touchcancel', () => { this.keys.left = false; });
    }
    if (this.ui.touchRightBtn) {
      this.ui.touchRightBtn.addEventListener('touchstart', () => { this.keys.right = true; });
      this.ui.touchRightBtn.addEventListener('touchend', () => { this.keys.right = false; });
      this.ui.touchRightBtn.addEventListener('touchcancel', () => { this.keys.right = false; });
    }

    // Share Score
    if (this.ui.btnShareScore) {
      this.ui.btnShareScore.addEventListener('click', () => {
        const act = ACT_DEFINITIONS[this.currentActIdx];
        const text = `🎪 I scored ${this.score.toLocaleString()} points with ${this.coins} coins in [${i18n.t(act.nameKey)}] on Circus Rush 3D!
Play Free: https://quick-games-ez4.pages.dev/games/08-circus-3d/`;
        navigator.clipboard.writeText(text).then(() => alert(i18n.t('copiedAlert'))).catch(() => prompt('Score:', text));
      });
    }
  }

  renderActSelection() {
    if (!this.ui.actCardsContainer) return;
    this.ui.actCardsContainer.innerHTML = '';

    ACT_DEFINITIONS.forEach((act, idx) => {
      const best = typeof localStorage !== 'undefined' ? (localStorage.getItem(`cr_best_${act.id}`) || 0) : 0;
      const card = document.createElement('div');
      card.className = `act-card ${idx === this.currentActIdx ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="act-card-left">
          <span class="act-badge" style="background: ${act.themeColor}; color: white;">${act.badge}</span>
          <div>
            <div class="act-title">${i18n.t(act.nameKey)}</div>
            <div class="act-desc">${i18n.t(act.descKey)}</div>
          </div>
        </div>
        <div class="act-card-right">
          <div class="act-best">🏆 ${Number(best).toLocaleString()}</div>
          <button class="btn-start-act">${i18n.t('startActBtn')}</button>
        </div>
      `;

      // Click card to start
      card.addEventListener('click', (e) => {
        this.startAct(idx);
      });

      const btn = card.querySelector('.btn-start-act');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.startAct(idx);
        });
      }

      this.ui.actCardsContainer.appendChild(card);
    });
  }

  showActSelect() {
    this.state = 'ACT_SELECT';
    circusAudio.stopMusic();
    if (this.ui.actSelectView) this.ui.actSelectView.style.display = 'flex';
    if (this.ui.gameplayHUD) this.ui.gameplayHUD.style.display = 'none';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';
    this.renderActSelection();
  }

  startAct(actIdx) {
    circusAudio.ensureContext();
    this.currentActIdx = actIdx;
    const act = ACT_DEFINITIONS[actIdx];

    this.state = 'PLAYING';
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.multiplier = 1;
    this.bulletTimeTimer = 0;

    // Reset Player
    this.player.x = 0;
    this.player.y = 0;
    this.player.vx = act.speed;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.canDoubleJump = true;
    this.player.jumpRotation = 0;

    // Clear and build obstacles for this act
    this.clearObstacles();
    this.generateActObstacles(act);

    if (this.ui.actSelectView) this.ui.actSelectView.style.display = 'none';
    if (this.ui.gameplayHUD) this.ui.gameplayHUD.style.display = 'flex';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';

    this.updateHUD();
    circusAudio.startMusic(act.id);
  }

  clearObstacles() {
    this.obstacles.forEach(obs => {
      this.stage.scene.remove(obs.mesh);
    });
    this.obstacles = [];
  }

  generateActObstacles(act) {
    const goal = act.goalDist;

    if (act.id === 1) {
      // Act 1: Fire Rings & Coin Pots
      for (let x = 18; x < goal - 10; x += 16) {
        // Fire ring
        const isDouble = (x % 32 === 0);
        const ringData = ObstacleFactory3D.createFireRing(isDouble ? 1.8 : 1.4, 0.08, isDouble);
        ringData.group.position.set(x, 0, 0);
        this.stage.scene.add(ringData.group);
        this.obstacles.push({
          type: 'FIRE_RING',
          x,
          radius: ringData.radius,
          mesh: ringData.group,
          flames: ringData.flames,
          cleared: false
        });

        // Coin Pot between rings
        if (x + 8 < goal - 10) {
          const jarData = ObstacleFactory3D.createCoinJar();
          jarData.group.position.set(x + 8, 0, 0);
          this.stage.scene.add(jarData.group);
          this.obstacles.push({
            type: 'COIN_JAR',
            x: x + 8,
            mesh: jarData.group,
            coinMesh: jarData.coinMesh,
            collected: false
          });
        }
      }
    } else if (act.id === 2) {
      // Act 2: Highwire Monkeys
      for (let x = 16; x < goal - 10; x += 14) {
        const monkeyMesh = CharacterFactory3D.createMonkey();
        monkeyMesh.position.set(x, 0, 0);
        this.stage.scene.add(monkeyMesh);
        this.obstacles.push({
          type: 'MONKEY',
          x,
          mesh: monkeyMesh,
          cleared: false
        });
      }
    } else if (act.id === 3) {
      // Act 3: Bouncing Balls
      for (let x = 14; x < goal - 8; x += 12) {
        const ballMesh = CharacterFactory3D.createCircusBall(0.8);
        ballMesh.position.set(x, 0.8, 0);
        this.stage.scene.add(ballMesh);
        this.obstacles.push({
          type: 'BALL',
          x,
          mesh: ballMesh,
          cleared: false
        });
      }
    } else if (act.id === 4) {
      // Act 4: Combination Trapeze & Trampoline Leap
      for (let x = 16; x < goal - 10; x += 15) {
        const tramp = ObstacleFactory3D.createTrampoline();
        tramp.position.set(x, 0, 0);
        this.stage.scene.add(tramp);
        this.obstacles.push({
          type: 'TRAMPOLINE',
          x,
          mesh: tramp,
          cleared: false
        });
      }
    }

    // Finish Podium at the goal distance
    const podiumMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.6 });
    const podiumMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.6, 16), podiumMat);
    podiumMesh.position.set(goal, 0.3, 0);
    this.stage.scene.add(podiumMesh);
    this.obstacles.push({
      type: 'GOAL',
      x: goal,
      mesh: podiumMesh
    });
  }

  triggerJump() {
    if (this.player.isGrounded) {
      // Primary High Leap
      this.player.vy = 10.5;
      this.player.isGrounded = false;
      this.player.canDoubleJump = true;
      circusAudio.playJump();
    } else if (this.player.canDoubleJump) {
      // Double Jump & Air Somersault
      this.player.vy = 8.5;
      this.player.canDoubleJump = false;
      this.player.jumpRotation = Math.PI * 2;
      this.bulletTimeTimer = 0.6; // Trigger 0.6s of matrix bullet time
      this.score += 500 * this.multiplier;
      circusAudio.playTrick();
      if (this.ui.bulletTimeBanner) this.ui.bulletTimeBanner.style.display = 'block';
    }
  }

  updateHUD() {
    const act = ACT_DEFINITIONS[this.currentActIdx];
    const remainDist = Math.max(0, Math.ceil(act.goalDist - this.player.x));

    if (this.ui.scoreDisplay) this.ui.scoreDisplay.innerText = this.score.toLocaleString();
    if (this.ui.coinsDisplay) this.ui.coinsDisplay.innerText = this.coins;
    if (this.ui.distDisplay) this.ui.distDisplay.innerText = `${remainDist}m`;
    if (this.ui.livesDisplay) this.ui.livesDisplay.innerText = '❤️'.repeat(Math.max(0, this.lives));
    if (this.ui.multiplierDisplay) this.ui.multiplierDisplay.innerText = `x${this.multiplier}`;
  }

  handleObstacleHit(obs) {
    this.lives--;
    circusAudio.playFireHit();
    this.multiplier = 1;
    this.updateHUD();

    if (this.lives <= 0) {
      this.triggerDefeat();
    } else {
      // Stumble and knock player back slightly
      this.player.x = Math.max(0, this.player.x - 3.0);
      this.player.vy = 5.0;
    }
  }

  triggerDefeat() {
    this.state = 'GAME_OVER';
    circusAudio.stopMusic();

    if (this.ui.modalTitle) this.ui.modalTitle.innerText = i18n.t('defeatTitle');
    if (this.ui.modalDesc) this.ui.modalDesc.innerText = i18n.t('defeatDesc');
    if (this.ui.resultScore) this.ui.resultScore.innerText = this.score.toLocaleString();
    if (this.ui.resultCoins) this.ui.resultCoins.innerText = this.coins;
    if (this.ui.btnNextAct) this.ui.btnNextAct.style.display = 'none';

    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
  }

  triggerVictory() {
    this.state = 'STAGE_CLEAR';
    circusAudio.stopMusic();
    circusAudio.playVictory();
    circusAudio.playApplause();

    this.stage.spawnConfetti(this.player.x, 3.0, 0);

    // Save Personal Best
    const act = ACT_DEFINITIONS[this.currentActIdx];
    const saved = Number(localStorage.getItem(`cr_best_${act.id}`) || 0);
    if (this.score > saved) {
      localStorage.setItem(`cr_best_${act.id}`, this.score);
    }

    if (this.ui.modalTitle) this.ui.modalTitle.innerText = i18n.t('stageClearTitle');
    if (this.ui.modalDesc) this.ui.modalDesc.innerText = i18n.t('stageClearDesc');
    if (this.ui.resultScore) this.ui.resultScore.innerText = this.score.toLocaleString();
    if (this.ui.resultCoins) this.ui.resultCoins.innerText = this.coins;
    if (this.ui.btnNextAct) this.ui.btnNextAct.style.display = 'inline-block';

    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
  }

  loop(timestamp) {
    const rawDt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    let timeScale = 1.0;
    if (this.bulletTimeTimer > 0) {
      this.bulletTimeTimer -= rawDt;
      timeScale = 0.35; // Slow motion
      if (this.bulletTimeTimer <= 0 && this.ui.bulletTimeBanner) {
        this.ui.bulletTimeBanner.style.display = 'none';
      }
    }

    const dt = rawDt * timeScale;

    if (this.state === 'PLAYING') {
      const act = ACT_DEFINITIONS[this.currentActIdx];

      // Speed Adjustments via keys
      let currentSpeed = act.speed;
      if (this.keys.right) currentSpeed *= 1.4;
      if (this.keys.left) currentSpeed *= 0.6;

      // X Position Update
      this.player.x += currentSpeed * dt;

      // Gravity & Jump Physics
      this.player.vy -= 26.0 * dt; // Gravity
      this.player.y += this.player.vy * dt;

      if (this.player.y <= 0) {
        this.player.y = 0;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.jumpRotation = 0;
      }

      // Update Player Mesh Coordinates
      if (this.player.meshData) {
        const pMesh = this.player.meshData.mesh;
        pMesh.position.set(this.player.x, this.player.y, this.player.z);

        // Somresault Rotation
        if (this.player.jumpRotation > 0) {
          this.player.jumpRotation -= dt * 10.0;
          pMesh.rotation.z = this.player.jumpRotation;
        } else {
          pMesh.rotation.z = 0;
        }

        // Quadruped Gallop Gait
        if (this.player.isGrounded) {
          const runPhase = timestamp * 0.015 * currentSpeed;
          this.player.meshData.flLeg.rotation.z = Math.sin(runPhase) * 0.6;
          this.player.meshData.frLeg.rotation.z = -Math.sin(runPhase) * 0.6;
          this.player.meshData.blLeg.rotation.z = -Math.sin(runPhase) * 0.6;
          this.player.meshData.brLeg.rotation.z = Math.sin(runPhase) * 0.6;
          this.player.meshData.tailMesh.rotation.z = Math.PI / 4 + Math.sin(runPhase * 2) * 0.2;
        }
      }

      // Update Obstacles (Rotating Flames, Coins, Collision)
      this.obstacles.forEach(obs => {
        if (obs.type === 'FIRE_RING') {
          // Flame aura rotation
          if (obs.flames) {
            obs.flames.forEach(f => {
              f.angle += dt * 3.5;
              f.mesh.position.y = obs.radius + 0.3 + Math.sin(f.angle) * obs.radius;
              f.mesh.position.z = Math.cos(f.angle) * obs.radius;
            });
          }

          // Collision Check
          const distToRing = Math.abs(this.player.x - obs.x);
          if (distToRing < 0.6 && !obs.cleared) {
            // Player must be jumping inside the ring opening (y between 0.8 and 2.6)
            if (this.player.y >= 0.75 && this.player.y <= 2.8) {
              obs.cleared = true;
              this.score += 200 * this.multiplier;
              this.multiplier = Math.min(8, this.multiplier + 1);
              circusAudio.playTrick();
            } else {
              this.handleObstacleHit(obs);
            }
          }
        } else if (obs.type === 'COIN_JAR') {
          if (obs.coinMesh) {
            obs.coinMesh.rotation.y += dt * 4.0;
          }
          if (!obs.collected && Math.abs(this.player.x - obs.x) < 0.8 && this.player.y < 1.2) {
            obs.collected = true;
            this.coins++;
            this.score += 500 * this.multiplier;
            this.stage.scene.remove(obs.mesh);
            circusAudio.playCoin();
          }
        } else if (obs.type === 'MONKEY') {
          obs.mesh.rotation.x += dt * 4.0; // Cartwheel
          if (!obs.cleared && Math.abs(this.player.x - obs.x) < 0.7) {
            if (this.player.y > 0.8) {
              obs.cleared = true;
              this.score += 300 * this.multiplier;
            } else {
              this.handleObstacleHit(obs);
            }
          }
        } else if (obs.type === 'BALL') {
          obs.mesh.rotation.z -= dt * 4.0; // Rolling Ball rotation
          if (!obs.cleared && Math.abs(this.player.x - obs.x) < 0.8) {
            if (this.player.y > 0.9) {
              obs.cleared = true;
              this.score += 350 * this.multiplier;
            } else {
              this.handleObstacleHit(obs);
            }
          }
        } else if (obs.type === 'TRAMPOLINE') {
          if (Math.abs(this.player.x - obs.x) < 0.9 && this.player.y <= 0.4) {
            // Super bounce!
            this.player.vy = 14.0;
            this.player.isGrounded = false;
            this.score += 400 * this.multiplier;
            circusAudio.playJump();
          }
        } else if (obs.type === 'GOAL') {
          if (this.player.x >= obs.x) {
            this.triggerVictory();
          }
        }
      });

      this.updateHUD();
    }

    this.stage.update(dt, this.player.x);
    this.stage.render();

    requestAnimationFrame(this.loop);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    new CircusGame();
    i18n.applyTranslations();
  });
}
