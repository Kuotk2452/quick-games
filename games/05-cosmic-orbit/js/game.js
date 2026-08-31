/**
 * Cosmic Orbit: Main Game Controller, Slingshot Input & Game Loop
 */

import { cosmicAudio } from './audio.js';
import { i18n } from './i18n.js';
import { CELESTIAL_TIERS, drawCelestialBody } from './celestial.js';
import { ParticleEngine } from './particles.js';
import { CosmicPhysicsWorld } from './physics.js';

export class CosmicOrbitGame {
  constructor() {
    this.canvas = document.getElementById('cosmicCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 600;
    this.height = 600;

    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    this.physics = new CosmicPhysicsWorld(this.centerX, this.centerY);
    this.particles = new ParticleEngine(this.canvas);

    this.score = 0;
    this.highScore = Number(localStorage.getItem('co_highscore') || 0);
    this.comboCount = 0;
    this.comboTimer = 0;
    this.currentTier = 1;
    this.nextTier = 1;
    this.isGameOver = false;
    this.isVictory = false;

    // Slingshot State
    this.isAiming = false;
    this.aimStartPos = { x: 0, y: 0 };
    this.aimCurrentPos = { x: 0, y: 0 };
    this.spawnPoint = { x: this.centerX, y: 45 };

    this.initDOM();
    this.initEvents();
    this.pickNextPlanet();
    this.pickNextPlanet();

    this.physics.onMergeCallback = (tier, x, y) => this.handleMerge(tier, x, y);

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initDOM() {
    this.ui = {
      scoreDisplay: document.getElementById('scoreDisplay'),
      highScoreDisplay: document.getElementById('highScoreDisplay'),
      nextPlanetIcon: document.getElementById('nextPlanetIcon'),
      nextPlanetName: document.getElementById('nextPlanetName'),
      comboDisplay: document.getElementById('comboDisplay'),
      horizonWarning: document.getElementById('horizonWarning'),
      startScreen: document.getElementById('startScreen'),
      btnStart: document.getElementById('btnStart'),
      endModal: document.getElementById('endModal'),
      endTitle: document.getElementById('endTitle'),
      endDesc: document.getElementById('endDesc'),
      finalScore: document.getElementById('finalScore'),
      btnPlayAgain: document.getElementById('btnPlayAgain'),
      btnShareScore: document.getElementById('btnShareScore'),
      audioToggleBtn: document.getElementById('audioToggleBtn'),
      langSelect: document.getElementById('langSelect'),
      btnPowerPulse: document.getElementById('btnPowerPulse'),
      btnPowerTwin: document.getElementById('btnPowerTwin')
    };
  }

  initEvents() {
    if (this.ui.btnStart) {
      this.ui.btnStart.addEventListener('click', () => this.startGame());
    }

    if (this.ui.btnPlayAgain) {
      this.ui.btnPlayAgain.addEventListener('click', () => this.startGame());
    }

    // Slingshot Pointer Events
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (this.width / rect.width),
        y: (clientY - rect.top) * (this.height / rect.height)
      };
    };

    if (this.canvas) {
      this.canvas.addEventListener('mousedown', (e) => {
        if (this.isGameOver) return;
        this.isAiming = true;
        const pos = getPos(e);
        this.aimStartPos = { x: this.spawnPoint.x, y: this.spawnPoint.y };
        this.aimCurrentPos = pos;
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isAiming) return;
        this.aimCurrentPos = getPos(e);
      });

      window.addEventListener('mouseup', (e) => {
        if (!this.isAiming) return;
        this.isAiming = false;
        this.launchPlanet();
      });

      this.canvas.addEventListener('touchstart', (e) => {
        if (this.isGameOver) return;
        this.isAiming = true;
        const pos = getPos(e);
        this.aimStartPos = { x: this.spawnPoint.x, y: this.spawnPoint.y };
        this.aimCurrentPos = pos;
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!this.isAiming) return;
        this.aimCurrentPos = getPos(e);
      }, { passive: true });

      window.addEventListener('touchend', () => {
        if (!this.isAiming) return;
        this.isAiming = false;
        this.launchPlanet();
      });
    }

    // Cosmic Powers
    if (this.ui.btnPowerPulse) {
      this.ui.btnPowerPulse.addEventListener('click', () => {
        cosmicAudio.playGravityPulse();
        this.physics.applyGravityPulse(220);
        this.particles.spawnMergeBurst(this.centerX, this.centerY, '#00f0ff', 40);
      });
    }

    if (this.ui.btnPowerTwin) {
      this.ui.btnPowerTwin.addEventListener('click', () => {
        cosmicAudio.playGravityPulse();
        this.physics.applyTwinPull();
        this.particles.spawnMergeBurst(this.centerX, this.centerY, '#ec4899', 40);
      });
    }

    if (this.ui.btnShareScore) {
      this.ui.btnShareScore.addEventListener('click', () => {
        const text = `🪐 Cosmic Orbit: Gravitational Merge
🌌 Cosmic Score: ${this.score}
⭐ Discovery Record: ${this.highScore}

Play Free in Browser:
👉 https://quick-games-ez4.pages.dev/games/05-cosmic-orbit/`;
        navigator.clipboard.writeText(text).then(() => alert(i18n.t('copiedAlert'))).catch(() => prompt('Score:', text));
      });
    }

    if (this.ui.audioToggleBtn) {
      this.ui.audioToggleBtn.addEventListener('click', () => {
        const muted = cosmicAudio.toggleMute();
        this.ui.audioToggleBtn.innerText = muted ? '🔇' : '🔊';
      });
    }

    if (this.ui.langSelect) {
      this.ui.langSelect.value = i18n.currentLang;
      this.ui.langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        this.updateHUD();
      });
    }
  }

  startGame() {
    this.score = 0;
    this.comboCount = 0;
    this.isGameOver = false;
    this.isVictory = false;
    this.physics.bodies = [];
    this.physics.overflowWarningTime = 0;

    if (this.ui.startScreen) this.ui.startScreen.style.display = 'none';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';

    cosmicAudio.ensureContext();
    this.pickNextPlanet();
    this.pickNextPlanet();
    this.updateHUD();
  }

  pickNextPlanet() {
    this.currentTier = this.nextTier;
    // Tiers 1-3 only for launcher
    this.nextTier = Math.floor(Math.random() * 3) + 1;
    this.updateHUD();
  }

  launchPlanet() {
    const dx = this.aimStartPos.x - this.aimCurrentPos.x;
    const dy = this.aimStartPos.y - this.aimCurrentPos.y;
    const power = Math.min(320, Math.hypot(dx, dy) * 1.6);
    const angle = Math.atan2(dy, dx);

    // Tangential launch velocity
    let vx = Math.cos(angle) * power;
    let vy = Math.sin(angle) * power;

    // Default gentle orbital push if tapped without drag
    if (power < 15) {
      vx = 140;
      vy = 0;
    }

    this.physics.addBody(this.currentTier, this.spawnPoint.x, this.spawnPoint.y, vx, vy);
    cosmicAudio.playLaunchWhoosh(power / 200);

    this.pickNextPlanet();
  }

  handleMerge(nextTier, x, y) {
    const def = CELESTIAL_TIERS[nextTier - 1];
    cosmicAudio.playMergeChime(nextTier);

    this.comboCount++;
    this.comboTimer = 2.5;

    const points = def.score * Math.max(1, this.comboCount);
    this.score += points;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('co_highscore', this.highScore);
    }

    this.particles.spawnMergeBurst(x, y, def.baseColor, 30 + nextTier * 3);

    // Tier 11 Quasar Victory Check
    if (nextTier === 11) {
      cosmicAudio.playSupernovaBlast();
      this.score += 15000;
      this.isVictory = true;
      if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('victorySupernova');
      if (this.ui.endDesc) this.ui.endDesc.innerText = 'You successfully merged the ultimate Singularity Quasar!';
      if (this.ui.finalScore) this.ui.finalScore.innerText = `${this.score} pts`;
      if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
    }

    this.updateHUD();
  }

  updateHUD() {
    if (this.ui.scoreDisplay) this.ui.scoreDisplay.innerText = this.score;
    if (this.ui.highScoreDisplay) this.ui.highScoreDisplay.innerText = this.highScore;

    const nextDef = CELESTIAL_TIERS[this.nextTier - 1];
    if (this.ui.nextPlanetIcon) this.ui.nextPlanetIcon.innerText = nextDef.icon;
    if (this.ui.nextPlanetName) {
      const lang = i18n.currentLang;
      this.ui.nextPlanetName.innerText = nextDef.name[lang] || nextDef.name.en;
    }

    if (this.ui.comboDisplay) {
      if (this.comboCount > 1) {
        this.ui.comboDisplay.innerText = `🔥 x${this.comboCount} COMBO!`;
        this.ui.comboDisplay.style.opacity = '1';
      } else {
        this.ui.comboDisplay.style.opacity = '0';
      }
    }

    if (this.ui.horizonWarning) {
      this.ui.horizonWarning.style.display = this.physics.overflowWarningTime > 1.2 ? 'block' : 'none';
    }
  }

  render(time) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // 1. Clear with Deep Space Nebula Gradient
    const bgGrad = ctx.createRadialGradient(this.centerX, this.centerY, 10, this.centerX, this.centerY, 360);
    bgGrad.addColorStop(0, '#0a0918');
    bgGrad.addColorStop(0.5, '#05050f');
    bgGrad.addColorStop(1, '#020205');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // 2. Starfield
    this.particles.drawStarfield(time);

    // 3. Central Pulsating Black Hole (Singularity)
    const holeRadius = this.physics.singularityRadius;
    const pulse = Math.sin(time * 3) * 2;

    // Gravitational Lensing Halo
    const lensGrad = ctx.createRadialGradient(this.centerX, this.centerY, holeRadius * 0.5, this.centerX, this.centerY, holeRadius * 2.8);
    lensGrad.addColorStop(0, '#ec4899');
    lensGrad.addColorStop(0.35, '#8b5cf6');
    lensGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.25)');
    lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lensGrad;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, (holeRadius * 2.8) + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Dark Core
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, holeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Event Horizon Outer Boundary Circle
    ctx.strokeStyle = this.physics.overflowWarningTime > 1.0 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 240, 255, 0.2)';
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.physics.eventHorizonRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Trajectory Preview while Aiming
    if (this.isAiming) {
      const dx = this.aimStartPos.x - this.aimCurrentPos.x;
      const dy = this.aimStartPos.y - this.aimCurrentPos.y;
      const power = Math.min(320, Math.hypot(dx, dy) * 1.6);
      const angle = Math.atan2(dy, dx);
      const vx = Math.cos(angle) * power;
      const vy = Math.sin(angle) * power;

      const trajectory = this.physics.predictTrajectory(this.spawnPoint.x, this.spawnPoint.y, vx, vy, 35);

      ctx.fillStyle = '#00f0ff';
      trajectory.forEach((pt, idx) => {
        const dotAlpha = 1 - (idx / trajectory.length);
        ctx.fillStyle = `rgba(0, 240, 255, ${dotAlpha})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, 3.5 - idx * 0.08), 0, Math.PI * 2);
        ctx.fill();
      });

      // Drag line
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.spawnPoint.x, this.spawnPoint.y);
      ctx.lineTo(this.aimCurrentPos.x, this.aimCurrentPos.y);
      ctx.stroke();
    }

    // 5. Draw Celestial Bodies in Orbit
    this.physics.bodies.forEach(b => {
      drawCelestialBody(ctx, b, time);
    });

    // 6. Draw Spawning Ready Planet at top
    const curDef = CELESTIAL_TIERS[this.currentTier - 1];
    drawCelestialBody(ctx, { tier: this.currentTier, pos: this.spawnPoint }, time);

    // 7. Draw Particles & Shockwaves
    this.particles.draw(time);
  }

  loop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    if (!this.isGameOver && !this.isVictory) {
      this.physics.update(dt);
      this.particles.update(dt);

      if (this.comboTimer > 0) {
        this.comboTimer -= dt;
        if (this.comboTimer <= 0) this.comboCount = 0;
      }

      // Overflow Game Over check
      if (this.physics.overflowWarningTime >= 4.0) {
        this.isGameOver = true;
        cosmicAudio.playBlackHoleCollapse();
        if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('gameOverTitle');
        if (this.ui.endDesc) this.ui.endDesc.innerText = i18n.t('gameOverDesc');
        if (this.ui.finalScore) this.ui.finalScore.innerText = `${this.score} pts`;
        if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
      }

      this.updateHUD();
    }

    this.render(timestamp / 1000);
    requestAnimationFrame(this.loop);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new CosmicOrbitGame();
  i18n.applyTranslations();
});
