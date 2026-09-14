/**
 * Mecha Arena: Main State Machine, Workshop Controller & Game Loop
 */

import { mechaAudio } from './audio.js';
import { i18n } from './i18n.js';
import { CHASSIS_PARTS, WEAPON_PARTS, MODULE_PARTS, drawMecha } from './workshop.js';
import { MechaParticleEngine } from './particles.js';
import { ArenaStage } from './arena.js';
import { RobotEntity } from './combat.js';

export const TOURNAMENT_TIERS = [
  {
    tier: 1,
    name: { en: 'Bronze Scrap Rustbot', zh: '青铜废土机甲', es: 'Chatarra de Bronce', ja: 'ブロンズ・スクラップ' },
    chassisId: 'HOVER',
    weaponId: 'GATLING',
    moduleId: 'SHIELD',
    reward: 150
  },
  {
    tier: 2,
    name: { en: 'Silver Plasma Striker', zh: '白银等离子裁决者', es: 'Asaltante de Plata', ja: 'シルバー・プラズマ' },
    chassisId: 'SPIDER',
    weaponId: 'SAW',
    moduleId: 'NITRO',
    reward: 250
  },
  {
    tier: 3,
    name: { en: 'Gold Titanium Crusher', zh: '黄金钛金重装机甲', es: 'Triturador de Oro', ja: 'ゴールド・タイタン' },
    chassisId: 'TANK',
    weaponId: 'LASER',
    moduleId: 'SHIELD',
    reward: 400
  },
  {
    tier: 4,
    name: { en: 'Apex Juggernaut Behemoth', zh: '终极深渊主宰巨兽', es: 'Behemoth Apex', ja: '頂点獣エイペックス' },
    chassisId: 'TANK',
    weaponId: 'TESLA',
    moduleId: 'NITRO',
    reward: 800,
    isBoss: true
  }
];

export class MechaArenaGame {
  constructor() {
    this.canvas = document.getElementById('arenaCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 680;
    this.height = 540;

    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    this.workshopCanvas = document.getElementById('workshopPreviewCanvas');
    this.workshopCtx = this.workshopCanvas ? this.workshopCanvas.getContext('2d') : null;
    if (this.workshopCanvas) {
      this.workshopCanvas.width = 240;
      this.workshopCanvas.height = 240;
    }

    this.scrapCash = typeof localStorage !== 'undefined' ? Number(localStorage.getItem('ma_scrap') || 100) : 100;
    this.currentTournamentTier = typeof localStorage !== 'undefined' ? Number(localStorage.getItem('ma_tier') || 1) : 1;

    // Player loadout (Persisted)
    this.playerChassisId = typeof localStorage !== 'undefined' ? (localStorage.getItem('ma_chassis') || 'HOVER') : 'HOVER';
    this.playerWeaponId = typeof localStorage !== 'undefined' ? (localStorage.getItem('ma_weapon') || 'GATLING') : 'GATLING';
    this.playerModuleId = typeof localStorage !== 'undefined' ? (localStorage.getItem('ma_module') || 'SHIELD') : 'SHIELD';

    this.state = 'BOOT_WAITING'; // 'BOOT_WAITING' | 'WORKSHOP' | 'ARENA'
    this.keys = {};
    this.mousePos = { x: this.width / 2, y: this.height / 2 };
    this.isMouseDown = false;
    this.joystickX = 0;
    this.joystickY = 0;
    this.joystickTouchId = null;
    this.aimTouchId = null;

    this.joystick = typeof document !== 'undefined' ? document.getElementById('virtualJoystick') : null;
    this.joystickKnob = typeof document !== 'undefined' ? document.getElementById('joystickKnob') : null;

    this.bullets = [];
    this.mines = [];
    this.drones = [];
    this.particles = new MechaParticleEngine(this.canvas);
    this.arena = new ArenaStage(this.width, this.height);

    this.player = null;
    this.enemy = null;

    this.initDOM();
    this.initEvents();
    this.renderWorkshopUI();

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resetControls() {
    this.keys = {};
    this.joystickX = 0;
    this.joystickY = 0;
    this.isMouseDown = false;
    this.joystickTouchId = null;
    this.aimTouchId = null;
    if (this.joystickKnob) {
      this.joystickKnob.style.transform = 'translate(-50%, -50%)';
    }
  }

  initDOM() {
    this.ui = {
      mechBootScreen: document.getElementById('mechBootScreen'),
      mechBootTerminal: document.getElementById('mechBootTerminal'),
      mechBootTap: document.getElementById('mechBootTap'),
      workshopView: document.getElementById('workshopView'),
      arenaView: document.getElementById('arenaView'),
      scrapCashDisplay: document.getElementById('scrapCashDisplay'),
      leagueDisplay: document.getElementById('leagueDisplay'),
      btnDeploy: document.getElementById('btnDeploy'),
      btnAdScrap: document.getElementById('btnAdScrap'),
      btnAdRevive: document.getElementById('btnAdRevive'),
      btnReturnWorkshop: document.getElementById('btnReturnWorkshop'),
      btnModalWorkshop: document.getElementById('btnModalWorkshop'),
      partsContainer: document.getElementById('partsContainer'),
      tabChassisBtn: document.getElementById('tabChassisBtn'),
      tabWeaponBtn: document.getElementById('tabWeaponBtn'),
      tabModuleBtn: document.getElementById('tabModuleBtn'),
      playerHpFill: document.getElementById('playerHpFill'),
      enemyHpFill: document.getElementById('enemyHpFill'),
      enemyNameDisplay: document.getElementById('enemyNameDisplay'),
      btnModuleAction: document.getElementById('btnModuleAction'),
      moduleActionIcon: document.getElementById('moduleActionIcon'),
      moduleActionText: document.getElementById('moduleActionText'),
      moduleCooldownOverlay: document.getElementById('moduleCooldownOverlay'),
      endModal: document.getElementById('endModal'),
      endTitle: document.getElementById('endTitle'),
      endDesc: document.getElementById('endDesc'),
      btnNextMatch: document.getElementById('btnNextMatch'),
      btnShareScore: document.getElementById('btnShareScore'),
      audioToggleBtn: document.getElementById('audioToggleBtn'),
      langSelect: document.getElementById('langSelect')
    };
  }

  initEvents() {
    if (this.ui.mechBootScreen) {
      this.ui.mechBootScreen.addEventListener('click', () => {
        if (this.state === 'BOOTING') return;
        this.state = 'BOOTING';
        
        this.ui.mechBootTap.classList.remove('pulse');
        this.ui.mechBootTap.classList.add('hidden');
        
        mechaAudio.playHydraulicPowerUp();
        
        // Show terminal texts sequentially via CSS animation
        this.ui.mechBootTerminal.classList.remove('hidden');
        this.ui.mechBootTerminal.classList.add('running');
        
        setTimeout(() => {
          mechaAudio.playMetallicClank();
          this.ui.mechBootScreen.classList.add('glitch');
          
          setTimeout(() => {
            this.state = 'WORKSHOP';
            // Start background hum for workshop
            mechaAudio.ensureContext();
          }, 300);
        }, 2500);
      });
    }

    
    if (this.ui.btnAdScrap) {
      this.ui.btnAdScrap.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.scrapCash += 500;
            localStorage.setItem('ma_scrap', this.scrapCash);
            this.renderWorkshopUI();
            mechaAudio.playMetallicClank();
          });
        }
      });
    }

    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            if (this.ui.endModal) this.ui.endModal.style.display = 'none';
            if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'none';
            this.revivePlayer();
          });
        }
      });
    }

    if (this.ui.btnDeploy) {
      this.ui.btnDeploy.addEventListener('click', () => this.startArenaMatch());
    }

    if (this.ui.btnReturnWorkshop) {
      this.ui.btnReturnWorkshop.addEventListener('click', () => this.returnToWorkshop());
    }

    if (this.ui.btnModalWorkshop) {
      this.ui.btnModalWorkshop.addEventListener('click', () => this.returnToWorkshop());
    }

    if (this.ui.btnNextMatch) {
      this.ui.btnNextMatch.addEventListener('click', () => {
        if (this.ui.endModal) this.ui.endModal.style.display = 'none';
        if (this.ui.btnNextMatch.dataset.action === 'reset_tourney') {
          this.currentTournamentTier = 1;
          localStorage.setItem('ma_tier', 1);
        }
        this.resetControls();
        this.startArenaMatch();
      });
    }

    // Workshop Tabs
    if (this.ui.tabChassisBtn) this.ui.tabChassisBtn.addEventListener('click', () => this.renderPartsCategory('CHASSIS'));
    if (this.ui.tabWeaponBtn) this.ui.tabWeaponBtn.addEventListener('click', () => this.renderPartsCategory('WEAPON'));
    if (this.ui.tabModuleBtn) this.ui.tabModuleBtn.addEventListener('click', () => this.renderPartsCategory('MODULE'));

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' && this.state === 'ARENA') {
        e.preventDefault();
        if (this.player) this.player.activateModule(this.mines, this.drones);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse & Touch Coordinates Helper
    const updateMousePos = (clientX, clientY) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos = {
        x: (clientX - rect.left) * (this.width / rect.width),
        y: (clientY - rect.top) * (this.height / rect.height)
      };
    };

    // 1. Mouse Aiming & Firing (Desktop)
    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        updateMousePos(e.clientX, e.clientY);
      });
      this.canvas.addEventListener('mousedown', (e) => {
        this.isMouseDown = true;
        updateMousePos(e.clientX, e.clientY);
      });
      window.addEventListener('mouseup', () => {
        this.isMouseDown = false;
      });
    }

    // 2. Multi-Touch Tracking (Tablets, iPads, Phones)
    const joystick = this.joystick;
    const joystickKnob = this.joystickKnob;

    if (joystick && joystickKnob) {
      let jRect = null;
      let jCenterX = 0;
      let jCenterY = 0;

      const handleJoystickMove = (clientX, clientY) => {
        if (!jRect) jRect = joystick.getBoundingClientRect();
        let dx = clientX - jCenterX;
        let dy = clientY - jCenterY;
        const maxDist = jRect.width / 2;
        const dist = Math.hypot(dx, dy);

        if (dist > maxDist) {
          dx = (dx / dist) * maxDist;
          dy = (dy / dist) * maxDist;
        }

        joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        this.joystickX = dx / maxDist;
        this.joystickY = dy / maxDist;
      };

      const resetJoystick = () => {
        this.joystickTouchId = null;
        this.joystickX = 0;
        this.joystickY = 0;
        if (joystickKnob) {
          joystickKnob.style.transform = 'translate(-50%, -50%)';
        }
      };

      joystick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Safety: verify if previous joystick touch still exists in active touches
        if (this.joystickTouchId !== null) {
          let exists = false;
          for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === this.joystickTouchId) {
              exists = true;
              break;
            }
          }
          if (!exists) this.joystickTouchId = null;
        }

        if (this.joystickTouchId === null && e.changedTouches.length > 0) {
          const touch = e.changedTouches[0];
          this.joystickTouchId = touch.identifier;
          jRect = joystick.getBoundingClientRect();
          jCenterX = jRect.left + jRect.width / 2;
          jCenterY = jRect.top + jRect.height / 2;
          handleJoystickMove(touch.clientX, touch.clientY);
        }
      }, { passive: false });

      // Window-level touchmove so dragging thumb outside the circle keeps steering
      window.addEventListener('touchmove', (e) => {
        if (this.joystickTouchId !== null) {
          for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === this.joystickTouchId) {
              handleJoystickMove(e.touches[i].clientX, e.touches[i].clientY);
              break;
            }
          }
        }
      }, { passive: false });

      const onJoystickTouchEnd = (e) => {
        if (e.touches.length === 0) {
          resetJoystick();
          return;
        }
        if (this.joystickTouchId !== null) {
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.joystickTouchId) {
              resetJoystick();
              break;
            }
          }
        }
      };

      window.addEventListener('touchend', onJoystickTouchEnd, { passive: false });
      window.addEventListener('touchcancel', onJoystickTouchEnd, { passive: false });
    }

    // 3. Canvas Aiming & Firing via Touch
    if (this.canvas) {
      this.canvas.addEventListener('touchstart', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier !== this.joystickTouchId) {
            this.aimTouchId = touch.identifier;
            this.isMouseDown = true;
            updateMousePos(touch.clientX, touch.clientY);
            break;
          }
        }
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        if (this.aimTouchId !== null) {
          for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === this.aimTouchId) {
              updateMousePos(e.touches[i].clientX, e.touches[i].clientY);
              break;
            }
          }
        }
      }, { passive: true });

      const onAimTouchEnd = (e) => {
        if (e.touches.length === 0) {
          this.aimTouchId = null;
          this.isMouseDown = false;
          return;
        }
        if (this.aimTouchId !== null) {
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.aimTouchId) {
              this.aimTouchId = null;
              this.isMouseDown = false;
              break;
            }
          }
        }
      };

      window.addEventListener('touchend', onAimTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onAimTouchEnd, { passive: true });
    }

    // Global Safety Unlatchers (on tab switch, blur, or when all touches lift)
    window.addEventListener('blur', () => this.resetControls());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.resetControls();
    });

    // 4. On-Screen Tactical Module Action Button (Shield / Space)
    if (this.ui.btnModuleAction) {
      const triggerModule = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (this.state === 'ARENA' && this.player) {
          this.player.activateModule(this.mines, this.drones);
        }
      };

      this.ui.btnModuleAction.addEventListener('pointerdown', triggerModule);
      this.ui.btnModuleAction.addEventListener('touchstart', triggerModule, { passive: false });
      this.ui.btnModuleAction.addEventListener('click', triggerModule);
    }

    if (this.ui.audioToggleBtn) {
      this.ui.audioToggleBtn.addEventListener('click', () => {
        const muted = mechaAudio.toggleMute();
        this.ui.audioToggleBtn.innerText = muted ? '🔇' : '🔊';
      });
    }

    if (this.ui.langSelect) {
      this.ui.langSelect.value = i18n.currentLang;
      this.ui.langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        this.renderWorkshopUI();
      });
    }

    if (this.ui.btnShareScore) {
      this.ui.btnShareScore.addEventListener('click', () => {
        const text = `🦾 Mecha Arena: Cyber BattleBots
🏆 League: Tier ${this.currentTournamentTier}/4
💰 Scrap Cash: $${this.scrapCash} SC
⚙️ Loadout: [${this.playerChassisId}] + [${this.playerWeaponId}] + [${this.playerModuleId}]

Play Free in Browser:
👉 https://quick-games-ez4.pages.dev/games/06-mecha-arena/`;
        navigator.clipboard.writeText(text).then(() => alert(i18n.t('copiedAlert'))).catch(() => prompt('Mecha Build:', text));
      });
    }
  }

  
  revivePlayer() {
    this.player = new RobotEntity(true, this.playerChassisId, this.playerWeaponId, this.playerModuleId);
    this.player.pos = { x: 140, y: this.height / 2 };
    this.player.vel = { x: 0, y: 0 };
    this.player.isDead = false;
    this.player.hp = this.player.maxHp;
    this.player.shieldActive = true;
    this.player.shieldTimer = 4.0; // 4s invulnerability bubble on revive
    this.resetControls();
    if (this.ui.playerHpFill) this.ui.playerHpFill.style.width = '100%';
    this.particles.spawnExplosion(this.player.pos.x, this.player.pos.y, 50);
    mechaAudio.playHydraulicPowerUp();
  }

  returnToWorkshop() {
    this.state = 'WORKSHOP';
    this.resetControls();
    if (this.ui.arenaView) this.ui.arenaView.style.display = 'none';
    if (this.ui.workshopView) this.ui.workshopView.style.display = 'flex';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';
    this.renderWorkshopUI();
  }

  startArenaMatch() {
    mechaAudio.ensureContext();
    this.state = 'ARENA';

    if (this.ui.workshopView) this.ui.workshopView.style.display = 'none';
    if (this.ui.arenaView) this.ui.arenaView.style.display = 'flex';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';

    // 1. Comprehensive input and control reset
    this.resetControls();

    // 2. Clear all projectile and deployed entity arrays
    this.bullets = [];
    this.mines = [];
    this.drones = [];
    this.particles = new MechaParticleEngine(this.canvas);
    this.arena = new ArenaStage(this.width, this.height);

    // 3. Spawn Fresh Player
    this.player = new RobotEntity(true, this.playerChassisId, this.playerWeaponId, this.playerModuleId);
    this.player.pos = { x: 140, y: this.height / 2 };
    this.player.vel = { x: 0, y: 0 };
    this.player.angle = 0;
    this.player.turretAngle = 0;
    this.player.isDead = false;
    this.player.hp = this.player.maxHp;

    // 4. Spawn Tournament Opponent
    const tierIndex = Math.min(this.currentTournamentTier - 1, TOURNAMENT_TIERS.length - 1);
    const tourneyTier = TOURNAMENT_TIERS[tierIndex];
    this.enemy = new RobotEntity(false, tourneyTier.chassisId, tourneyTier.weaponId, tourneyTier.moduleId);
    this.enemy.pos = { x: this.width - 140, y: this.height / 2 };
    this.enemy.vel = { x: 0, y: 0 };
    this.enemy.angle = Math.PI;
    this.enemy.turretAngle = Math.PI;
    this.enemy.isDead = false;
    this.enemy.hp = this.enemy.maxHp;

    // 5. Update All Top HUD and In-Match HUD elements immediately
    const lang = i18n.currentLang;
    if (this.ui.enemyNameDisplay) {
      this.ui.enemyNameDisplay.innerText = tourneyTier.name[lang] || tourneyTier.name.en;
    }
    if (this.ui.leagueDisplay) {
      this.ui.leagueDisplay.innerText = `Tier ${this.currentTournamentTier}/4`;
    }
    if (this.ui.scrapCashDisplay) {
      this.ui.scrapCashDisplay.innerText = this.scrapCash;
    }
    if (this.ui.playerHpFill) {
      this.ui.playerHpFill.style.width = '100%';
    }
    if (this.ui.enemyHpFill) {
      this.ui.enemyHpFill.style.width = '100%';
    }

    // 6. Initialize On-Screen Tactical Power Button (Shield / Space)
    const moduleInfo = {
      SHIELD: { icon: '🛡️', name: 'SHIELD' },
      NITRO: { icon: '⚡', name: 'NITRO' },
      MINE: { icon: '💣', name: 'MINES' },
      OVERCLOCK: { icon: '🔥', name: 'OVERCLOCK' },
      DRONE: { icon: '🛸', name: 'DRONE' }
    };
    const mod = moduleInfo[this.playerModuleId] || moduleInfo.SHIELD;
    if (this.ui.moduleActionIcon) this.ui.moduleActionIcon.innerText = mod.icon;
    if (this.ui.moduleActionText) this.ui.moduleActionText.innerText = mod.name;
    if (this.ui.btnModuleAction) {
      this.ui.btnModuleAction.classList.remove('cooldown', 'active-power');
    }
  }

  renderWorkshopUI() {
    if (this.ui.scrapCashDisplay) this.ui.scrapCashDisplay.innerText = this.scrapCash;
    if (this.ui.leagueDisplay) this.ui.leagueDisplay.innerText = `Tier ${this.currentTournamentTier}/4`;
    this.renderPartsCategory('CHASSIS');
  }

  renderPartsCategory(category) {
    if (!this.ui.partsContainer) return;
    this.ui.partsContainer.innerHTML = '';

    [this.ui.tabChassisBtn, this.ui.tabWeaponBtn, this.ui.tabModuleBtn].forEach(b => { if (b) b.classList.remove('active'); });

    let parts = [];
    let currentEquipped = '';

    if (category === 'CHASSIS') {
      if (this.ui.tabChassisBtn) this.ui.tabChassisBtn.classList.add('active');
      parts = CHASSIS_PARTS;
      currentEquipped = this.playerChassisId;
    } else if (category === 'WEAPON') {
      if (this.ui.tabWeaponBtn) this.ui.tabWeaponBtn.classList.add('active');
      parts = WEAPON_PARTS;
      currentEquipped = this.playerWeaponId;
    } else {
      if (this.ui.tabModuleBtn) this.ui.tabModuleBtn.classList.add('active');
      parts = MODULE_PARTS;
      currentEquipped = this.playerModuleId;
    }

    const lang = i18n.currentLang;

    parts.forEach(part => {
      const card = document.createElement('div');
      card.className = `part-card ${part.id === currentEquipped ? 'equipped' : ''}`;

      const isUnlocked = part.unlocked || part.cost === 0;

      card.innerHTML = `
        <div class="part-header">
          <span class="part-icon">${part.icon}</span>
          <div>
            <div class="part-name">${part.name[lang] || part.name.en}</div>
            <div class="part-cost">${isUnlocked ? '✅ UNLOCKED' : `💰 $${part.cost} SC`}</div>
          </div>
        </div>
        <button class="part-action-btn ${part.id === currentEquipped ? 'btn-active' : ''}">
          ${part.id === currentEquipped ? i18n.t('equipped') : isUnlocked ? i18n.t('equipBtn') : `Unlock ($${part.cost})`}
        </button>
      `;

      card.querySelector('.part-action-btn').addEventListener('click', () => {
        if (part.id === currentEquipped) return;

        if (isUnlocked) {
          if (category === 'CHASSIS') { this.playerChassisId = part.id; localStorage.setItem('ma_chassis', part.id); }
          else if (category === 'WEAPON') { this.playerWeaponId = part.id; localStorage.setItem('ma_weapon', part.id); }
          else { this.playerModuleId = part.id; localStorage.setItem('ma_module', part.id); }
          mechaAudio.playMetalImpact();
          this.renderPartsCategory(category);
        } else {
          if (this.scrapCash >= part.cost) {
            this.scrapCash -= part.cost;
            localStorage.setItem('ma_scrap', this.scrapCash);
            part.unlocked = true;
            if (category === 'CHASSIS') { this.playerChassisId = part.id; localStorage.setItem('ma_chassis', part.id); }
            else if (category === 'WEAPON') { this.playerWeaponId = part.id; localStorage.setItem('ma_weapon', part.id); }
            else { this.playerModuleId = part.id; localStorage.setItem('ma_module', part.id); }
            mechaAudio.playVictory();
            this.renderWorkshopUI();
          } else {
            alert('Not enough Scrap Cash! Win arena matches to earn more.');
          }
        }
      });

      this.ui.partsContainer.appendChild(card);
    });
  }

  handleArenaCombat(dt) {
    if (!this.player || !this.enemy) return;

    // 1. Player Input Steering
    let moveX = 0;
    let moveY = 0;
    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
    
    // Add virtual joystick
    if (Math.abs(this.joystickX) > 0.1) moveX += this.joystickX;
    if (Math.abs(this.joystickY) > 0.1) moveY += this.joystickY;
    
    // Clamp magnitude so diagonal + joystick doesn't go crazy
    const moveMag = Math.hypot(moveX, moveY);
    if (moveMag > 1) {
      moveX /= moveMag;
      moveY /= moveMag;
    }

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      this.player.vel.x += (moveX / len) * this.player.speed * dt * 3.5;
      this.player.vel.y += (moveY / len) * this.player.speed * dt * 3.5;
    }

    // Turret aiming towards mouse
    this.player.turretAngle = Math.atan2(this.mousePos.y - this.player.pos.y, this.mousePos.x - this.player.pos.x);

    // Player firing (Mouse Click/Hold OR Keyboard [J] / [F] / [Enter])
    const isShooting = this.isMouseDown || this.keys['KeyJ'] || this.keys['KeyF'] || this.keys['Enter'];
    if (isShooting && this.player.fireCooldown <= 0 && !this.player.isDead) {
      this.player.fireWeapon(this.bullets, this.particles, this.enemy);
    }

    // 2. Update Entities
    this.player.update(dt, this.enemy, this.particles, this.bullets);
    this.enemy.update(dt, this.player, this.particles, this.bullets);

    // Arena bounds
    this.arena.constrainBot(this.player);
    this.arena.constrainBot(this.enemy);
    this.arena.update(dt);

    // 3. Robot-to-Robot Collision Physics
    const dx = this.enemy.pos.x - this.player.pos.x;
    const dy = this.enemy.pos.y - this.player.pos.y;
    const dist = Math.hypot(dx, dy);
    const minDist = this.player.radius + this.enemy.radius;

    if (dist < minDist && dist > 0.001) {
      const overlap = minDist - dist;
      const nx = dx / dist;
      const ny = dy / dist;
      this.player.pos.x -= nx * overlap * 0.5;
      this.player.pos.y -= ny * overlap * 0.5;
      this.enemy.pos.x += nx * overlap * 0.5;
      this.enemy.pos.y += ny * overlap * 0.5;
    }

    // 4. Update Bullets & Projectile Collisions
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];

      // Homing missile steering
      if (b.isHoming && b.homingTarget && !b.homingTarget.isDead) {
        const targetAngle = Math.atan2(b.homingTarget.pos.y - b.y, b.homingTarget.pos.x - b.x);
        const currentAngle = Math.atan2(b.vy, b.vx);
        let diff = targetAngle - currentAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const newAngle = currentAngle + diff * 0.12;
        const speed = 420;
        b.vx = Math.cos(newAngle) * speed;
        b.vy = Math.sin(newAngle) * speed;
        if (Math.random() < 0.4) {
          this.particles.spawnSparks(b.x, b.y, 1, '#cbd5e1');
        }
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;

      const target = b.isPlayer ? this.enemy : this.player;

      if (!target.isDead) {
        const hitDist = Math.hypot(target.pos.x - b.x, target.pos.y - b.y);
        if (hitDist < target.radius + b.radius) {
          target.takeDamage(b.damage);
          this.particles.spawnSparks(b.x, b.y, 8, b.color);
          if (b.isHoming) {
            this.particles.spawnExplosion(b.x, b.y, 15);
          }
          this.bullets.splice(i, 1);
          continue;
        }
      }

      if (b.life <= 0) {
        this.bullets.splice(i, 1);
      }
    }

    // 4.5. Update Orbital Combat Drones
    for (let i = this.drones.length - 1; i >= 0; i--) {
      const drone = this.drones[i];
      drone.life -= dt;
      drone.orbitAngle += dt * 3.5;
      drone.x = drone.owner.pos.x + Math.cos(drone.orbitAngle) * drone.orbitDist;
      drone.y = drone.owner.pos.y + Math.sin(drone.orbitAngle) * drone.orbitDist;
      drone.fireCooldown -= dt;

      const target = drone.isPlayer ? this.enemy : this.player;
      if (drone.fireCooldown <= 0 && target && !target.isDead) {
        drone.fireCooldown = 0.5;
        const aimAngle = Math.atan2(target.pos.y - drone.y, target.pos.x - drone.x);
        this.bullets.push({
          x: drone.x,
          y: drone.y,
          vx: Math.cos(aimAngle) * 650,
          vy: Math.sin(aimAngle) * 650,
          damage: 10,
          isPlayer: drone.isPlayer,
          color: '#38bdf8',
          radius: 3,
          life: 0.5
        });
        this.particles.addLaser(drone.x, drone.y, drone.x + Math.cos(aimAngle) * 80, drone.y + Math.sin(aimAngle) * 80, '#38bdf8');
        mechaAudio.playDroneLaser();
      }

      if (drone.life <= 0 || drone.owner.isDead) {
        this.particles.spawnSparks(drone.x, drone.y, 6, '#38bdf8');
        this.drones.splice(i, 1);
      }
    }

    // 5. Check Hazard Collisions
    this.arena.hazards.forEach(h => {
      [this.player, this.enemy].forEach(bot => {
        if (!bot.isDead) {
          const hd = Math.hypot(bot.pos.x - h.x, bot.pos.y - h.y);
          if (hd < bot.radius + h.radius) {
            bot.takeDamage(15 * dt);
            this.particles.spawnSparks(bot.pos.x, bot.pos.y, 3, '#ef4444');
          }
        }
      });
    });

    // 6. Check Repair Crates Pickup
    for (let i = this.arena.crates.length - 1; i >= 0; i--) {
      const crate = this.arena.crates[i];
      [this.player, this.enemy].forEach(bot => {
        const cd = Math.hypot(bot.pos.x - crate.x, bot.pos.y - crate.y);
        if (cd < bot.radius + crate.radius) {
          bot.heal(40);
          this.particles.spawnSparks(crate.x, crate.y, 15, '#10b981');
          this.arena.crates.splice(i, 1);
        }
      });
    }

    // 6.5. Update EMP Mines
    for (let i = this.mines.length - 1; i >= 0; i--) {
      const mine = this.mines[i];
      if (mine.armTimer > 0) {
        mine.armTimer -= dt;
      } else {
        const target = mine.isPlayer ? this.enemy : this.player;
        if (!target.isDead) {
          const dist = Math.hypot(target.pos.x - mine.x, target.pos.y - mine.y);
          if (dist < target.radius + mine.radius) {
            target.takeDamage(mine.damage);
            this.particles.spawnExplosion(mine.x, mine.y, 25);
            this.particles.spawnSparks(mine.x, mine.y, 15, '#a855f7');
            this.mines.splice(i, 1);
            continue;
          }
        }
      }
    }

    // 7. Update HUD & Tactical Module Button
    if (this.ui.playerHpFill) {
      this.ui.playerHpFill.style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    }
    if (this.ui.enemyHpFill) {
      this.ui.enemyHpFill.style.width = `${(this.enemy.hp / this.enemy.maxHp) * 100}%`;
    }

    if (this.ui.btnModuleAction) {
      const moduleInfo = {
        SHIELD: { icon: '🛡️', name: 'SHIELD' },
        NITRO: { icon: '⚡', name: 'NITRO' },
        MINE: { icon: '💣', name: 'MINES' },
        OVERCLOCK: { icon: '🔥', name: 'OVERCLOCK' },
        DRONE: { icon: '🛸', name: 'DRONE' }
      };
      const mod = moduleInfo[this.playerModuleId] || moduleInfo.SHIELD;

      if (this.player.shieldActive || this.player.overclockTimer > 0) {
        this.ui.btnModuleAction.classList.remove('cooldown');
        this.ui.btnModuleAction.classList.add('active-power');
        if (this.ui.moduleActionText) this.ui.moduleActionText.innerText = 'ACTIVE!';
      } else if (this.player.moduleCooldown > 0) {
        this.ui.btnModuleAction.classList.remove('active-power');
        this.ui.btnModuleAction.classList.add('cooldown');
        if (this.ui.moduleActionText) {
          this.ui.moduleActionText.innerText = `${this.player.moduleCooldown.toFixed(1)}s`;
        }
      } else {
        this.ui.btnModuleAction.classList.remove('cooldown', 'active-power');
        if (this.ui.moduleActionText) this.ui.moduleActionText.innerText = mod.name;
      }
    }

    // 8. Match Result Conditions
    if (this.enemy.isDead && !this.player.isDead) {
      // Victory!
      this.resetControls();
      const tierIndex = Math.min(this.currentTournamentTier - 1, TOURNAMENT_TIERS.length - 1);
      const tourney = TOURNAMENT_TIERS[tierIndex];
      this.scrapCash += tourney.reward;
      localStorage.setItem('ma_scrap', this.scrapCash);

      const isFinalBoss = this.currentTournamentTier >= TOURNAMENT_TIERS.length;
      if (!isFinalBoss) {
        this.currentTournamentTier++;
        localStorage.setItem('ma_tier', this.currentTournamentTier);
      }

      mechaAudio.playVictory();
      this.particles.spawnExplosion(this.enemy.pos.x, this.enemy.pos.y, 40);

      if (this.ui.endTitle) {
        this.ui.endTitle.innerText = isFinalBoss ? i18n.t('championTitle') : i18n.t('victoryTitle');
      }
      if (this.ui.endDesc) {
        this.ui.endDesc.innerText = isFinalBoss 
          ? `${i18n.t('championDesc')} +$${tourney.reward} SC!` 
          : `${i18n.t('victoryDesc')} +$${tourney.reward} Scrap Cash!`;
      }
      if (this.ui.btnNextMatch) {
        this.ui.btnNextMatch.innerText = isFinalBoss 
          ? i18n.t('newTournamentBtn') 
          : `${i18n.t('nextMatchBtn')} (Tier ${this.currentTournamentTier}/4)`;
        this.ui.btnNextMatch.dataset.action = isFinalBoss ? 'reset_tourney' : 'next_match';
      }
      if (this.ui.leagueDisplay) {
        this.ui.leagueDisplay.innerText = `Tier ${this.currentTournamentTier}/4`;
      }
      if (this.ui.scrapCashDisplay) {
        this.ui.scrapCashDisplay.innerText = this.scrapCash;
      }
      if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
      if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'none';
      this.enemy = null;
    } else if (this.player.isDead) {
      // Defeat
      this.resetControls();
      if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('defeatTitle');
      if (this.ui.endDesc) this.ui.endDesc.innerText = i18n.t('defeatDesc');
      if (this.ui.btnNextMatch) {
        this.ui.btnNextMatch.innerText = `${i18n.t('retryMatchBtn')} (Tier ${this.currentTournamentTier}/4)`;
        this.ui.btnNextMatch.dataset.action = 'retry_match';
      }
      if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
      if (this.ui.btnAdRevive) this.ui.btnAdRevive.style.display = 'block';
      this.player = null;
    }
  }

  loop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    if (this.state === 'WORKSHOP') {
      // Draw 2D Robot Preview in Workshop
      if (this.workshopCtx) {
        this.workshopCtx.clearRect(0, 0, 240, 240);
        drawMecha(this.workshopCtx, {
          pos: { x: 120, y: 120 },
          angle: timestamp / 1000 * 0.8,
          turretAngle: timestamp / 1000 * 1.5,
          chassisId: this.playerChassisId,
          weaponId: this.playerWeaponId,
          shieldActive: false,
          hp: 100,
          maxHp: 100
        }, timestamp / 1000);
      }
    } else if (this.state === 'ARENA') {
      this.handleArenaCombat(dt);
      this.particles.update(dt);

      // Render Arena
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.arena.draw(this.ctx, timestamp / 1000);

        // Draw Mines
        this.mines.forEach(m => {
          this.ctx.fillStyle = '#1e293b';
          this.ctx.strokeStyle = '#a855f7';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.stroke();

          // Blinking LED
          this.ctx.fillStyle = Math.sin(timestamp / 1000 * 12) > 0 ? '#ef4444' : '#64748b';
          this.ctx.beginPath();
          this.ctx.arc(m.x, m.y, 4, 0, Math.PI * 2);
          this.ctx.fill();
        });

        // Draw Bullets
        this.bullets.forEach(b => {
          this.ctx.fillStyle = b.color;
          this.ctx.beginPath();
          this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          this.ctx.fill();
        });

        // Draw Orbital Drones
        this.drones.forEach(d => {
          this.ctx.fillStyle = '#0f172a';
          this.ctx.strokeStyle = '#38bdf8';
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(d.x, d.y, 8, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.stroke();

          // Mini Drone Core
          this.ctx.fillStyle = '#38bdf8';
          this.ctx.beginPath();
          this.ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
          this.ctx.fill();
        });

        // Draw Entities
        if (this.player && !this.player.isDead) {
          drawMecha(this.ctx, this.player, timestamp / 1000);
        }
        if (this.enemy && !this.enemy.isDead) {
          drawMecha(this.ctx, this.enemy, timestamp / 1000);
        }

        // Draw Particles
        this.particles.draw();
      }
    }

    requestAnimationFrame(this.loop);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.mechaGame = new MechaArenaGame();
    i18n.applyTranslations();
  });
}
