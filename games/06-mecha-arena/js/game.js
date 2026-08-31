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

    this.state = 'WORKSHOP'; // 'WORKSHOP' | 'ARENA'
    this.keys = {};
    this.mousePos = { x: this.width / 2, y: this.height / 2 };
    this.isMouseDown = false;

    this.bullets = [];
    this.mines = [];
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

  initDOM() {
    this.ui = {
      workshopView: document.getElementById('workshopView'),
      arenaView: document.getElementById('arenaView'),
      scrapCashDisplay: document.getElementById('scrapCashDisplay'),
      leagueDisplay: document.getElementById('leagueDisplay'),
      btnDeploy: document.getElementById('btnDeploy'),
      btnReturnWorkshop: document.getElementById('btnReturnWorkshop'),
      partsContainer: document.getElementById('partsContainer'),
      tabChassisBtn: document.getElementById('tabChassisBtn'),
      tabWeaponBtn: document.getElementById('tabWeaponBtn'),
      tabModuleBtn: document.getElementById('tabModuleBtn'),
      playerHpFill: document.getElementById('playerHpFill'),
      enemyHpFill: document.getElementById('enemyHpFill'),
      enemyNameDisplay: document.getElementById('enemyNameDisplay'),
      btnModuleAction: document.getElementById('btnModuleAction'),
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
    if (this.ui.btnDeploy) {
      this.ui.btnDeploy.addEventListener('click', () => this.startArenaMatch());
    }

    if (this.ui.btnReturnWorkshop) {
      this.ui.btnReturnWorkshop.addEventListener('click', () => this.returnToWorkshop());
    }

    if (this.ui.btnNextMatch) {
      this.ui.btnNextMatch.addEventListener('click', () => {
        if (this.ui.endModal) this.ui.endModal.style.display = 'none';
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
        if (this.player) this.player.activateModule(this.mines);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse / Touch Aiming & Firing
    const updateMouse = (e) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.mousePos = {
        x: (clientX - rect.left) * (this.width / rect.width),
        y: (clientY - rect.top) * (this.height / rect.height)
      };
    };

    if (this.canvas) {
      this.canvas.addEventListener('mousemove', updateMouse);
      this.canvas.addEventListener('mousedown', (e) => {
        this.isMouseDown = true;
        updateMouse(e);
      });
      window.addEventListener('mouseup', () => { this.isMouseDown = false; });

      this.canvas.addEventListener('touchmove', updateMouse, { passive: true });
      this.canvas.addEventListener('touchstart', (e) => {
        this.isMouseDown = true;
        updateMouse(e);
      }, { passive: true });
      window.addEventListener('touchend', () => { this.isMouseDown = false; });
    }

    if (this.ui.btnModuleAction) {
      this.ui.btnModuleAction.addEventListener('click', () => {
        if (this.player) this.player.activateModule(this.mines);
      });
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

  returnToWorkshop() {
    this.state = 'WORKSHOP';
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

    // Spawn Player
    this.player = new RobotEntity(true, this.playerChassisId, this.playerWeaponId, this.playerModuleId);
    this.player.pos = { x: 140, y: this.height / 2 };

    // Spawn Tournament Opponent
    const tourneyTier = TOURNAMENT_TIERS[Math.min(this.currentTournamentTier - 1, TOURNAMENT_TIERS.length - 1)];
    this.enemy = new RobotEntity(false, tourneyTier.chassisId, tourneyTier.weaponId, tourneyTier.moduleId);
    this.enemy.pos = { x: this.width - 140, y: this.height / 2 };

    const lang = i18n.currentLang;
    if (this.ui.enemyNameDisplay) {
      this.ui.enemyNameDisplay.innerText = tourneyTier.name[lang] || tourneyTier.name.en;
    }

    this.bullets = [];
    this.arena = new ArenaStage(this.width, this.height);
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
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;

      const target = b.isPlayer ? this.enemy : this.player;

      if (!target.isDead) {
        const hitDist = Math.hypot(target.pos.x - b.x, target.pos.y - b.y);
        if (hitDist < target.radius + b.radius) {
          target.takeDamage(b.damage);
          this.particles.spawnSparks(b.x, b.y, 8, b.color);
          this.bullets.splice(i, 1);
          continue;
        }
      }

      if (b.life <= 0) {
        this.bullets.splice(i, 1);
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

    // 7. Update HUD
    if (this.ui.playerHpFill) {
      this.ui.playerHpFill.style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    }
    if (this.ui.enemyHpFill) {
      this.ui.enemyHpFill.style.width = `${(this.enemy.hp / this.enemy.maxHp) * 100}%`;
    }

    // 8. Match Result Conditions
    if (this.enemy.isDead && !this.player.isDead) {
      // Victory!
      const tourney = TOURNAMENT_TIERS[Math.min(this.currentTournamentTier - 1, TOURNAMENT_TIERS.length - 1)];
      this.scrapCash += tourney.reward;
      localStorage.setItem('ma_scrap', this.scrapCash);

      if (this.currentTournamentTier < TOURNAMENT_TIERS.length) {
        this.currentTournamentTier++;
        localStorage.setItem('ma_tier', this.currentTournamentTier);
      }

      mechaAudio.playVictory();
      this.particles.spawnExplosion(this.enemy.pos.x, this.enemy.pos.y, 40);

      if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('victoryTitle');
      if (this.ui.endDesc) this.ui.endDesc.innerText = `Reward: +$${tourney.reward} Scrap Cash!`;
      if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
      this.enemy = null;
    } else if (this.player.isDead) {
      // Defeat
      if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('defeatTitle');
      if (this.ui.endDesc) this.ui.endDesc.innerText = i18n.t('defeatDesc');
      if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
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
    new MechaArenaGame();
    i18n.applyTranslations();
  });
}
