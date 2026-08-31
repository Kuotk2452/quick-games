/**
 * Circus Rush 3D: Overdrive Action Edition
 * Full 3D Physics Loop, Lion Roar, Low Slide, Boss Battles & Workshop Upgrades
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { circusAudio } from './audio.js';
import { i18n } from './i18n.js';
import { CharacterFactory3D } from './characters.js';
import { ObstacleFactory3D } from './obstacles.js';
import { CircusStage3D } from './stage3d.js';
import { workshop, UPGRADE_ITEMS } from './shop.js';

export const ACT_DEFINITIONS = [
  {
    id: 1,
    nameKey: 'act1Name',
    descKey: 'act1Desc',
    badge: '🦁 ACT 1',
    goalDist: 100,
    speed: 5.5,
    themeColor: '#ef4444',
    hasBoss: true,
    bossType: 'ELEPHANT'
  },
  {
    id: 2,
    nameKey: 'act2Name',
    descKey: 'act2Desc',
    badge: '🐒 ACT 2',
    goalDist: 100,
    speed: 6.0,
    themeColor: '#3b82f6',
    hasBoss: true,
    bossType: 'JUGGLER'
  },
  {
    id: 3,
    nameKey: 'act3Name',
    descKey: 'act3Desc',
    badge: '⚽ ACT 3',
    goalDist: 100,
    speed: 6.5,
    themeColor: '#ec4899',
    hasBoss: false
  },
  {
    id: 4,
    nameKey: 'act4Name',
    descKey: 'act4Desc',
    badge: '🪢 ACT 4',
    goalDist: 100,
    speed: 7.0,
    themeColor: '#facc15',
    hasBoss: false
  },
  {
    id: 5,
    nameKey: 'actEndlessName',
    descKey: 'actEndlessDesc',
    badge: '♾️ ENDLESS',
    goalDist: 99999,
    speed: 6.0,
    themeColor: '#10b981',
    isEndless: true
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

    // Skills & Upgrades
    this.lastRoarTime = -999;
    this.isSliding = false;
    this.slideTimer = 0;
    this.isGliding = false;
    this.glideTimer = 0;
    this.activeShields = 0;

    // Shockwaves & Projectiles
    this.playerShockwaves = [];
    this.bossProjectiles = [];

    // Boss State
    this.boss = null;

    // Player Physics State
    this.player = {
      x: 0,
      y: 0,
      vx: 5.5,
      vy: 0,
      gravity: -28.0,
      jumpForce: 11.2,
      isGrounded: true,
      canDoubleJump: true,
      jumpRotation: 0,
      meshData: null
    };

    // Obstacles
    this.obstacles = [];

    // Input States
    this.keys = {
      left: false,
      right: false,
      jumpHeld: false
    };

    this.initPlayer();
    this.initDOM();
    this.initEvents();
    this.renderActSelection();
    this.updateBankHeader();

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
      closeCallBanner: document.getElementById('closeCallBanner'),
      bossHUD: document.getElementById('bossHUD'),
      bossName: document.getElementById('bossName'),
      bossHpText: document.getElementById('bossHpText'),
      bossHpFill: document.getElementById('bossHpFill'),
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
      btnOpenWorkshop: document.getElementById('btnOpenWorkshop'),
      btnCloseWorkshop: document.getElementById('btnCloseWorkshop'),
      workshopModal: document.getElementById('workshopModal'),
      workshopCoinBalance: document.getElementById('workshopCoinBalance'),
      workshopUpgradesList: document.getElementById('workshopUpgradesList'),
      bankCoinsHeader: document.getElementById('bankCoinsHeader'),
      touchJumpBtn: document.getElementById('touchJumpBtn'),
      touchLeftBtn: document.getElementById('touchLeftBtn'),
      touchRightBtn: document.getElementById('touchRightBtn'),
      touchSlideBtn: document.getElementById('touchSlideBtn'),
      touchRoarBtn: document.getElementById('touchRoarBtn')
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
        this.renderWorkshop();
      });
    }

    // Workshop Modal
    if (this.ui.btnOpenWorkshop) {
      this.ui.btnOpenWorkshop.addEventListener('click', () => this.openWorkshop());
    }
    if (this.ui.btnCloseWorkshop) {
      this.ui.btnCloseWorkshop.addEventListener('click', () => this.closeWorkshop());
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
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.keys.jumpHeld = true;
        this.triggerJump();
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        e.preventDefault();
        this.triggerSlide();
      }
      if (e.code === 'KeyJ' || e.code === 'KeyK' || e.code === 'KeyF') {
        e.preventDefault();
        this.triggerRoar();
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.keys.jumpHeld = false;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = false;
      }
    });

    // Touch & On-Screen Buttons
    if (this.ui.touchJumpBtn) {
      this.ui.touchJumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.keys.jumpHeld = true;
        this.triggerJump();
      });
      this.ui.touchJumpBtn.addEventListener('touchend', () => { this.keys.jumpHeld = false; });
      this.ui.touchJumpBtn.addEventListener('mousedown', () => {
        this.keys.jumpHeld = true;
        this.triggerJump();
      });
      this.ui.touchJumpBtn.addEventListener('mouseup', () => { this.keys.jumpHeld = false; });
    }

    if (this.ui.touchSlideBtn) {
      this.ui.touchSlideBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerSlide();
      });
      this.ui.touchSlideBtn.addEventListener('click', () => this.triggerSlide());
    }

    if (this.ui.touchRoarBtn) {
      this.ui.touchRoarBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerRoar();
      });
      this.ui.touchRoarBtn.addEventListener('click', () => this.triggerRoar());
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

    // Pointer/Tap screen to jump
    window.addEventListener('pointerdown', (e) => {
      if (this.state === 'PLAYING') {
        if (!e.target.closest('button, select, a, .touch-btn, .portal-back-btn, .modal-content')) {
          this.triggerJump();
        }
      }
    });

    // Share Score
    if (this.ui.btnShareScore) {
      this.ui.btnShareScore.addEventListener('click', () => {
        const act = ACT_DEFINITIONS[this.currentActIdx];
        const text = `🎪 I scored ${this.score.toLocaleString()} points with ${this.coins} coins in [${i18n.t(act.nameKey)}] on Circus Rush 3D Overdrive!
Play Free: https://quick-games-ez4.pages.dev/games/08-circus-3d/`;
        navigator.clipboard.writeText(text).then(() => alert(i18n.t('copiedAlert'))).catch(() => prompt('Score:', text));
      });
    }
  }

  // --- WORKSHOP & STORE ---
  openWorkshop() {
    this.renderWorkshop();
    if (this.ui.workshopModal) this.ui.workshopModal.style.display = 'flex';
  }

  closeWorkshop() {
    if (this.ui.workshopModal) this.ui.workshopModal.style.display = 'none';
    this.updateBankHeader();
  }

  updateBankHeader() {
    if (this.ui.bankCoinsHeader) {
      this.ui.bankCoinsHeader.innerText = workshop.coins.toLocaleString();
    }
  }

  renderWorkshop() {
    if (!this.ui.workshopUpgradesList) return;
    this.ui.workshopCoinBalance.innerText = `🏺 ${workshop.coins.toLocaleString()}`;
    this.ui.workshopUpgradesList.innerHTML = '';

    UPGRADE_ITEMS.forEach(item => {
      const lvl = workshop.getLevel(item.id);
      const isMax = lvl >= item.maxLevel;
      const cost = workshop.getCost(item);
      const canAfford = workshop.coins >= cost;

      const card = document.createElement('div');
      card.className = 'workshop-item-card';

      let pillsHtml = '';
      for (let i = 1; i <= item.maxLevel; i++) {
        pillsHtml += `<div class="lvl-pill ${i <= lvl ? 'active' : ''}"></div>`;
      }

      card.innerHTML = `
        <div class="item-left">
          <div class="item-icon">${item.icon}</div>
          <div>
            <div class="item-title">${i18n.t(item.nameKey)} (Lv ${lvl}/${item.maxLevel})</div>
            <div class="item-desc">${i18n.t(item.descKey)}</div>
            <div class="item-level-pills">${pillsHtml}</div>
          </div>
        </div>
        <button class="btn-buy-upgrade" ${isMax || !canAfford ? 'disabled' : ''}>
          ${isMax ? i18n.t('maxLvl') : `🏺 ${cost.toLocaleString()} ${i18n.t('buyBtn')}`}
        </button>
      `;

      const btn = card.querySelector('.btn-buy-upgrade');
      if (btn && !isMax) {
        btn.addEventListener('click', () => {
          const res = workshop.buyUpgrade(item.id);
          if (res.success) {
            circusAudio.playUpgrade();
            this.renderWorkshop();
            this.updateBankHeader();
          }
        });
      }

      this.ui.workshopUpgradesList.appendChild(card);
    });
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

      card.addEventListener('click', () => {
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
    if (this.ui.bossHUD) this.ui.bossHUD.style.display = 'none';
    this.renderActSelection();
    this.updateBankHeader();
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
    this.isSliding = false;
    this.slideTimer = 0;
    this.isGliding = false;
    this.glideTimer = 0;

    // Load active shield upgrades
    this.activeShields = workshop.getEffectValue('cloak');
    if (this.player.meshData && this.player.meshData.cloakMesh) {
      this.player.meshData.cloakMesh.material.opacity = this.activeShields > 0 ? 0.6 : 0.0;
    }

    // Immediately hide act selection view and show HUD
    if (this.ui.actSelectView) this.ui.actSelectView.style.display = 'none';
    if (this.ui.gameplayHUD) this.ui.gameplayHUD.style.display = 'flex';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';
    if (this.ui.bossHUD) this.ui.bossHUD.style.display = 'none';

    // Reset Player
    this.player.x = 0;
    this.player.y = 0;
    this.player.vx = act.speed;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.canDoubleJump = true;
    this.player.jumpRotation = 0;

    // Clear and build obstacles for this act
    try {
      this.clearObstacles();
      this.generateActObstacles(act);
    } catch (err) {
      console.error('Error generating obstacles:', err);
    }

    this.updateHUD();
    circusAudio.startMusic(act.id, false);
  }

  clearObstacles() {
    this.obstacles.forEach(obs => {
      this.stage.scene.remove(obs.mesh);
    });
    this.obstacles = [];

    this.playerShockwaves.forEach(sw => this.stage.scene.remove(sw.mesh));
    this.playerShockwaves = [];

    this.bossProjectiles.forEach(p => this.stage.scene.remove(p.mesh));
    this.bossProjectiles = [];

    if (this.boss && this.boss.mesh) {
      this.stage.scene.remove(this.boss.mesh);
      this.boss = null;
    }
  }

  generateActObstacles(act) {
    const goal = act.goalDist;

    if (act.id === 1) {
      // Act 1: Fire Rings, Elevated Arches, Pots & Mystic Elephant Boss
      for (let x = 16; x < 75; x += 15) {
        if (x % 30 === 0) {
          // Elevated flame arch (requires slide)
          const arch = ObstacleFactory3D.createElevatedFlameArch();
          arch.group.position.set(x, 0, 0);
          this.stage.scene.add(arch.group);
          this.obstacles.push({
            type: 'ELEVATED_ARCH',
            x,
            mesh: arch.group,
            clearanceY: arch.clearanceY,
            cleared: false
          });
        } else {
          // Fire ring
          const ringData = ObstacleFactory3D.createFireRing(1.4, 0.08, false);
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
        }

        // Coin Pot
        const jarData = ObstacleFactory3D.createCoinJar();
        jarData.group.position.set(x + 7, 0, 0);
        this.stage.scene.add(jarData.group);
        this.obstacles.push({
          type: 'COIN_JAR',
          x: x + 7,
          mesh: jarData.group,
          coinMesh: jarData.coinMesh,
          collected: false
        });
      }

      // Mystic Elephant Boss at 85m
      const ele = CharacterFactory3D.createMysticElephant();
      ele.group.position.set(88, 0, 0);
      this.stage.scene.add(ele.group);
      this.boss = {
        type: 'ELEPHANT',
        mesh: ele.group,
        parts: ele,
        x: 88,
        hp: 100,
        maxHp: 100,
        attackTimer: 1.5,
        alive: true
      };

    } else if (act.id === 2) {
      // Act 2: Highwire Monkeys, Coin Jars & Phantom Juggler Boss
      for (let x = 16; x < 75; x += 14) {
        const monkeyMesh = CharacterFactory3D.createMonkey();
        monkeyMesh.position.set(x, 0, 0);
        this.stage.scene.add(monkeyMesh);
        this.obstacles.push({
          type: 'MONKEY',
          x,
          mesh: monkeyMesh,
          cleared: false
        });

        const jarData = ObstacleFactory3D.createCoinJar();
        jarData.group.position.set(x + 7, 0, 0);
        this.stage.scene.add(jarData.group);
        this.obstacles.push({
          type: 'COIN_JAR',
          x: x + 7,
          mesh: jarData.group,
          coinMesh: jarData.coinMesh,
          collected: false
        });
      }

      // Phantom Juggler Boss at 85m
      const juggler = CharacterFactory3D.createPhantomJuggler();
      juggler.group.position.set(88, 0, 0);
      this.stage.scene.add(juggler.group);
      this.boss = {
        type: 'JUGGLER',
        mesh: juggler.group,
        parts: juggler,
        x: 88,
        hp: 120,
        maxHp: 120,
        attackTimer: 1.2,
        alive: true
      };

    } else if (act.id === 3) {
      // Act 3: Bouncing Balls & Coin Pots
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

        if (x + 6 < goal - 8) {
          const jarData = ObstacleFactory3D.createCoinJar();
          jarData.group.position.set(x + 6, 0, 0);
          this.stage.scene.add(jarData.group);
          this.obstacles.push({
            type: 'COIN_JAR',
            x: x + 6,
            mesh: jarData.group,
            coinMesh: jarData.coinMesh,
            collected: false
          });
        }
      }
    } else if (act.id === 4) {
      // Act 4: Trampoline Springboards & Fire Arches
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

        const arch = ObstacleFactory3D.createElevatedFlameArch();
        arch.group.position.set(x + 7.5, 0, 0);
        this.stage.scene.add(arch.group);
        this.obstacles.push({
          type: 'ELEVATED_ARCH',
          x: x + 7.5,
          mesh: arch.group,
          clearanceY: arch.clearanceY,
          cleared: false
        });
      }
    } else if (act.isEndless) {
      // Endless spawner creates initial wave
      this.spawnEndlessWave(15, 60);
    }

    // Finish Podium if not endless
    if (!act.isEndless) {
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
  }

  spawnEndlessWave(fromX, toX) {
    for (let x = fromX; x < toX; x += 14) {
      const r = Math.random();
      if (r < 0.35) {
        const ringData = ObstacleFactory3D.createFireRing(1.4, 0.08, false);
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
      } else if (r < 0.65) {
        const arch = ObstacleFactory3D.createElevatedFlameArch();
        arch.group.position.set(x, 0, 0);
        this.stage.scene.add(arch.group);
        this.obstacles.push({
          type: 'ELEVATED_ARCH',
          x,
          mesh: arch.group,
          clearanceY: arch.clearanceY,
          cleared: false
        });
      } else {
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

      // Coin Jar
      const jarData = ObstacleFactory3D.createCoinJar();
      jarData.group.position.set(x + 7, 0, 0);
      this.stage.scene.add(jarData.group);
      this.obstacles.push({
        type: 'COIN_JAR',
        x: x + 7,
        mesh: jarData.group,
        coinMesh: jarData.coinMesh,
        collected: false
      });
    }
  }

  // --- ACTIONS & SKILLS ---
  triggerJump() {
    if (this.state !== 'PLAYING') return;

    if (this.player.isGrounded) {
      this.player.vy = this.player.jumpForce;
      this.player.isGrounded = false;
      this.player.canDoubleJump = true;
      this.isSliding = false;
      circusAudio.playJump();
    } else if (this.player.canDoubleJump) {
      // 360° Air Somersault + Bullet-Time
      this.player.vy = this.player.jumpForce * 0.95;
      this.player.canDoubleJump = false;
      this.player.jumpRotation = Math.PI * 2;
      this.bulletTimeTimer = 0.65; // 0.65s slow motion
      this.multiplier = Math.min(this.multiplier + 1, 8);
      this.score += 250 * this.multiplier;
      circusAudio.playSomersault();

      if (this.ui.bulletTimeBanner) {
        this.ui.bulletTimeBanner.style.display = 'block';
        setTimeout(() => {
          if (this.ui.bulletTimeBanner) this.ui.bulletTimeBanner.style.display = 'none';
        }, 1200);
      }
    }
  }

  triggerSlide() {
    if (this.state !== 'PLAYING' || !this.player.isGrounded || this.isSliding) return;
    this.isSliding = true;
    this.slideTimer = 0.7; // 0.7s slide duration
    circusAudio.playSlide();
  }

  triggerRoar() {
    if (this.state !== 'PLAYING') return;
    const cooldown = workshop.getEffectValue('roar');
    const now = performance.now() / 1000;
    if (now - this.lastRoarTime < cooldown) return;

    this.lastRoarTime = now;
    circusAudio.playRoar();

    // Spawn 3D Expanding Golden Shockwave
    const swGeo = new THREE.RingGeometry(0.5, 1.0, 16);
    const swMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const swMesh = new THREE.Mesh(swGeo, swMat);
    swMesh.rotation.y = Math.PI / 2;
    swMesh.position.set(this.player.x + 1.2, this.player.y + 0.9, 0);
    this.stage.scene.add(swMesh);

    this.playerShockwaves.push({
      mesh: swMesh,
      x: this.player.x + 1.2,
      scale: 1.0,
      life: 0.6
    });

    // Animate lion mouth
    if (this.player.meshData && this.player.meshData.mouthMesh) {
      this.player.meshData.mouthMesh.scale.set(1.5, 2.5, 1.5);
      setTimeout(() => {
        if (this.player.meshData && this.player.meshData.mouthMesh) {
          this.player.meshData.mouthMesh.scale.set(1, 1, 1);
        }
      }, 350);
    }
  }

  handleObstacleHit(obs) {
    if (this.activeShields > 0) {
      // Absorb with flame cloak
      this.activeShields--;
      this.coins += 5;
      this.score += 200;
      circusAudio.playCoin();
      if (this.player.meshData && this.player.meshData.cloakMesh) {
        this.player.meshData.cloakMesh.material.opacity = this.activeShields > 0 ? 0.6 : 0.0;
      }
      return;
    }

    this.lives--;
    this.multiplier = 1;
    circusAudio.playCrash();

    if (this.lives <= 0) {
      this.triggerGameOver();
    } else {
      // Knockback & Invulnerability blink
      this.player.x = Math.max(0, this.player.x - 3.5);
      this.player.y = 0;
      this.player.vy = 0;
      this.player.isGrounded = true;
    }
  }

  damageBoss(dmg) {
    if (!this.boss || !this.boss.alive) return;
    this.boss.hp = Math.max(0, this.boss.hp - dmg);
    circusAudio.playBossHit();

    if (this.ui.bossHpFill) {
      this.ui.bossHpFill.style.width = `${(this.boss.hp / this.boss.maxHp) * 100}%`;
    }
    if (this.ui.bossHpText) {
      this.ui.bossHpText.innerText = `${this.boss.hp} / ${this.boss.maxHp} HP`;
    }

    if (this.boss.hp <= 0) {
      this.boss.alive = false;
      this.score += 5000 * this.multiplier;
      this.stage.scene.remove(this.boss.mesh);
      this.boss = null;
      if (this.ui.bossHUD) this.ui.bossHUD.style.display = 'none';
      this.triggerVictory();
    }
  }

  triggerVictory() {
    this.state = 'STAGE_CLEAR';
    circusAudio.stopMusic();
    circusAudio.playFanfare();
    this.stage.spawnConfetti(this.player.x, 3.5, 0, 70);

    workshop.addCoins(this.coins);
    this.updateBankHeader();

    const act = ACT_DEFINITIONS[this.currentActIdx];
    const prevBest = localStorage.getItem(`cr_best_${act.id}`) || 0;
    if (this.score > prevBest) {
      localStorage.setItem(`cr_best_${act.id}`, this.score.toString());
    }

    if (this.ui.modalTitle) this.ui.modalTitle.innerText = i18n.t('stageClearTitle');
    if (this.ui.modalDesc) this.ui.modalDesc.innerText = i18n.t('stageClearDesc');
    if (this.ui.resultScore) this.ui.resultScore.innerText = this.score.toLocaleString();
    if (this.ui.resultCoins) this.ui.resultCoins.innerText = this.coins.toString();
    if (this.ui.btnNextAct) this.ui.btnNextAct.style.display = 'inline-block';
    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
  }

  triggerGameOver() {
    this.state = 'GAME_OVER';
    circusAudio.stopMusic();

    workshop.addCoins(this.coins);
    this.updateBankHeader();

    const act = ACT_DEFINITIONS[this.currentActIdx];
    const prevBest = localStorage.getItem(`cr_best_${act.id}`) || 0;
    if (this.score > prevBest) {
      localStorage.setItem(`cr_best_${act.id}`, this.score.toString());
    }

    if (this.ui.modalTitle) this.ui.modalTitle.innerText = i18n.t('gameOverTitle');
    if (this.ui.modalDesc) this.ui.modalDesc.innerText = i18n.t('gameOverDesc');
    if (this.ui.resultScore) this.ui.resultScore.innerText = this.score.toLocaleString();
    if (this.ui.resultCoins) this.ui.resultCoins.innerText = this.coins.toString();
    if (this.ui.btnNextAct) this.ui.btnNextAct.style.display = 'none';
    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
  }

  updateHUD() {
    if (this.ui.scoreDisplay) this.ui.scoreDisplay.innerText = this.score.toLocaleString();
    if (this.ui.coinsDisplay) this.ui.coinsDisplay.innerText = this.coins.toString();

    const act = ACT_DEFINITIONS[this.currentActIdx];
    if (this.ui.distDisplay) {
      if (act.isEndless) {
        this.ui.distDisplay.innerText = `${Math.floor(this.player.x)}m`;
      } else {
        const remaining = Math.max(0, Math.ceil(act.goalDist - this.player.x));
        this.ui.distDisplay.innerText = `${remaining}m`;
      }
    }

    if (this.ui.livesDisplay) {
      this.ui.livesDisplay.innerText = '❤️'.repeat(Math.max(0, this.lives));
    }
    if (this.ui.multiplierDisplay) {
      this.ui.multiplierDisplay.innerText = `x${this.multiplier}`;
    }
  }

  // --- MAIN PHYSICS & RENDER LOOP ---
  loop(time) {
    const rawDt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    // Bullet-Time calculation
    let dt = rawDt;
    if (this.bulletTimeTimer > 0) {
      this.bulletTimeTimer -= rawDt;
      dt = rawDt * 0.35; // 0.35x Matrix slow-motion
    }

    if (this.state === 'PLAYING') {
      const act = ACT_DEFINITIONS[this.currentActIdx];

      // Dynamic Speed with Direction Keys
      let targetVx = act.speed;
        
      if (this.boss && this.boss.alive && this.player.x >= this.boss.x - 7.5) {
        // Boss Arena mode: Stop auto-scroll, allow manual movement
        targetVx = 0;
        if (this.keys.left) targetVx = -4.0;
        if (this.keys.right) targetVx = 4.5;
      } else {
        // Normal auto-run mode
        if (this.keys.left) targetVx *= 0.55;
        if (this.keys.right) targetVx *= 1.45;
      }
        
      this.player.vx += (targetVx - this.player.vx) * 0.1;

      // Rocket Boots Air Glide
      const glideDuration = workshop.getEffectValue('boots');
      if (this.keys.jumpHeld && !this.player.isGrounded && this.player.vy < 0 && glideDuration > 0 && this.glideTimer < glideDuration) {
        this.player.vy = -1.2; // Gentle hover glide
        this.glideTimer += dt;
        this.score += 2;
      }

      // Slide Handling
      if (this.isSliding) {
        this.slideTimer -= dt;
        if (this.slideTimer <= 0) {
          this.isSliding = false;
        }
      }

      // Vertical Physics
      if (!this.player.isGrounded) {
        this.player.vy += this.player.gravity * dt;
        this.player.y += this.player.vy * dt;

        // Ground collision
        if (this.player.y <= 0) {
          this.player.y = 0;
          this.player.vy = 0;
          this.player.isGrounded = true;
          this.player.canDoubleJump = true;
          this.player.jumpRotation = 0;
          this.glideTimer = 0;
        }
      }

      // Forward Movement
      let oldX = this.player.x;
      this.player.x += this.player.vx * dt;
      
      // Prevent running past the boss
      if (this.boss && this.boss.alive) {
        if (this.player.x > this.boss.x - 0.5) {
          this.player.x = this.boss.x - 0.5;
        }
      }
      
      this.score += Math.floor(Math.max(0, this.player.x - oldX) * 8 * this.multiplier);

      // Endless Mode Continuous Spawner
      if (act.isEndless) {
        const furthestObs = this.obstacles.length > 0 ? this.obstacles[this.obstacles.length - 1].x : 0;
        if (furthestObs - this.player.x < 60) {
          this.spawnEndlessWave(furthestObs + 15, furthestObs + 75);
        }
      }

      // Update 3D Lion & Charlie Pose
      if (this.player.meshData) {
        const m = this.player.meshData;
        m.mesh.position.set(this.player.x, this.player.y, 0);

        if (this.isSliding) {
          // Low slide ducking deformation
          m.mesh.scale.set(1.3, 0.45, 1.0);
          m.mesh.position.y = 0.2;
        } else {
          m.mesh.scale.set(1.0, 1.0, 1.0);
        }

        // Running quadruped leg gait
        if (this.player.isGrounded && !this.isSliding) {
          const runPhase = time * 0.015 * (this.player.vx / 5);
          m.flLeg.rotation.z = Math.sin(runPhase) * 0.6;
          m.brLeg.rotation.z = Math.sin(runPhase) * 0.6;
          m.frLeg.rotation.z = -Math.sin(runPhase) * 0.6;
          m.blLeg.rotation.z = -Math.sin(runPhase) * 0.6;
          m.tailMesh.rotation.z = (Math.PI / 4) + Math.sin(runPhase * 2) * 0.3;
        }

        // Air Somersault 360° flip
        if (this.player.jumpRotation > 0) {
          this.player.jumpRotation -= dt * 10.0;
          m.mesh.rotation.z = this.player.jumpRotation;
        } else {
          m.mesh.rotation.z = 0;
        }
      }

      // Update Player Shockwaves
      for (let i = this.playerShockwaves.length - 1; i >= 0; i--) {
        const sw = this.playerShockwaves[i];
        sw.x += dt * 18.0;
        sw.scale += dt * 3.5;
        sw.life -= dt;
        sw.mesh.position.x = sw.x;
        sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
        sw.mesh.material.opacity = sw.life / 0.6;

        // Damage Boss
        if (this.boss && this.boss.alive && Math.abs(sw.x - this.boss.x) < 2.0) {
          this.damageBoss(25);
          this.stage.scene.remove(sw.mesh);
          this.playerShockwaves.splice(i, 1);
          continue;
        }

        // Destroy flying projectiles
        for (let j = this.bossProjectiles.length - 1; j >= 0; j--) {
          const p = this.bossProjectiles[j];
          if (Math.abs(sw.x - p.x) < 1.2) {
            this.stage.scene.remove(p.mesh);
            this.bossProjectiles.splice(j, 1);
            this.score += 200 * this.multiplier;
          }
        }

        if (sw.life <= 0) {
          this.stage.scene.remove(sw.mesh);
          this.playerShockwaves.splice(i, 1);
        }
      }

      // Update Boss Combat Loop
      if (this.boss && this.boss.alive) {
        // Trigger Boss HUD when near
        if (this.player.x >= 65 && this.ui.bossHUD && this.ui.bossHUD.style.display !== 'block') {
          this.ui.bossHUD.style.display = 'block';
          circusAudio.startMusic(act.id, true); // Intense boss music
        }

        this.boss.attackTimer -= dt;
        if (this.boss.attackTimer <= 0) {
          this.boss.attackTimer = 2.2;

          if (this.boss.type === 'ELEPHANT') {
            // Stomp Earthquake shockwave
            circusAudio.playStomp();
            const sw = ObstacleFactory3D.createGroundShockwave();
            sw.position.set(this.boss.x - 2.0, 0.08, 0);
            this.stage.scene.add(sw);
            this.bossProjectiles.push({
              type: 'GROUND_SHOCKWAVE',
              mesh: sw,
              x: this.boss.x - 2.0,
              vx: -8.0
            });
          } else if (this.boss.type === 'JUGGLER') {
            // Throw Flying Fireball
            const fb = ObstacleFactory3D.createFireball();
            fb.position.set(this.boss.x - 1.0, 1.8, 0);
            this.stage.scene.add(fb);
            this.bossProjectiles.push({
              type: 'FIREBALL',
              mesh: fb,
              x: this.boss.x - 1.0,
              y: 1.8,
              vx: -10.0
            });
          }
        }
      }

      // Update Boss Projectiles
      for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
        const p = this.bossProjectiles[i];
        p.x += p.vx * dt;
        p.mesh.position.x = p.x;

        // Collision with player
        if (Math.abs(p.x - this.player.x) < 0.8) {
          if (p.type === 'GROUND_SHOCKWAVE' && this.player.y < 0.6) {
            this.handleObstacleHit(p);
            this.stage.scene.remove(p.mesh);
            this.bossProjectiles.splice(i, 1);
            continue;
          } else if (p.type === 'FIREBALL' && (!this.isSliding || this.player.y > 0.4)) {
            this.handleObstacleHit(p);
            this.stage.scene.remove(p.mesh);
            this.bossProjectiles.splice(i, 1);
            continue;
          }
        }

        if (p.x < this.player.x - 15) {
          this.stage.scene.remove(p.mesh);
          this.bossProjectiles.splice(i, 1);
        }
      }

      // Coin Magnet Effect
      const magnetDist = workshop.getEffectValue('magnet');

      // Update Obstacles Collision
      this.obstacles.forEach(obs => {
        if (obs.type === 'FIRE_RING') {
          // Flame rotation
          obs.flames.forEach(f => {
            f.angle += dt * 4.0;
            f.mesh.position.y = f.centerY + Math.sin(f.angle) * f.radius;
            f.mesh.position.z = Math.cos(f.angle) * f.radius;
          });

          // Check Ring Clearance
          if (!obs.cleared && Math.abs(this.player.x - obs.x) < 0.6) {
            if (this.player.y > 0.7 && this.player.y < 2.5) {
              obs.cleared = true;
              this.score += 200 * this.multiplier;
            } else {
              this.handleObstacleHit(obs);
            }
          }
        } else if (obs.type === 'ELEVATED_ARCH') {
          // Check Slide Clearance
          if (!obs.cleared && Math.abs(this.player.x - obs.x) < 0.8) {
            if (this.isSliding) {
              obs.cleared = true;
              this.score += 300 * this.multiplier;
              if (this.ui.closeCallBanner) {
                this.ui.closeCallBanner.style.display = 'block';
                setTimeout(() => {
                  if (this.ui.closeCallBanner) this.ui.closeCallBanner.style.display = 'none';
                }, 800);
              }
            } else {
              this.handleObstacleHit(obs);
            }
          }
        } else if (obs.type === 'COIN_JAR') {
          obs.coinMesh.rotation.z += dt * 4.0;

          // Magnet Attraction
          if (!obs.collected && magnetDist > 0 && Math.abs(this.player.x - obs.x) < magnetDist) {
            obs.x += (this.player.x - obs.x) * dt * 5.0;
            obs.mesh.position.x = obs.x;
          }

          if (!obs.collected && Math.abs(this.player.x - obs.x) < 0.9) {
            obs.collected = true;
            this.coins += 5;
            this.score += 500 * this.multiplier;
            this.stage.scene.remove(obs.mesh);
            circusAudio.playCoin();
          }
        } else if (obs.type === 'MONKEY') {
          obs.mesh.rotation.x += dt * 4.0;
          if (!obs.cleared && Math.abs(this.player.x - obs.x) < 0.7) {
            if (this.player.y > 0.8) {
              obs.cleared = true;
              this.score += 300 * this.multiplier;
            } else {
              this.handleObstacleHit(obs);
            }
          }
        } else if (obs.type === 'BALL') {
          obs.mesh.rotation.z -= dt * 4.0;
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
            this.player.vy = 14.0;
            this.player.isGrounded = false;
            this.score += 400 * this.multiplier;
            circusAudio.playJump();
          }
        } else if (obs.type === 'GOAL') {
          if (this.player.x >= obs.x && (!this.boss || !this.boss.alive)) {
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
