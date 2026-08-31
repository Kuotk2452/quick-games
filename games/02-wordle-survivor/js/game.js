/**
 * Wordle Survivor: Spell Roguelike — Main Game Controller
 * Manages game loop, canvas rendering pipeline, user inputs, HUD and UI states.
 */

import { wordEngine } from './dictionary.js';
import { soundEngine } from './audio.js';
import { particleSystem } from './particles.js';
import { spellManager } from './spells.js';
import { hordeManager } from './enemies.js';
import { Player } from './player.js';
import { getRandomPerks } from './perks.js';
import { dailyManager } from './daily.js';
import { i18n } from './i18n.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    this.player = new Player(0, 0);
    this.camera = { x: 0, y: 0 };
    this.gameState = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'LEVEL_UP' | 'GAME_OVER'

    this.gameTime = 0;
    this.highestWord = '';
    this.highestDamage = 0;
    this.keys = {};

    // Touch / Joystick state
    this.touchStartPos = null;
    this.touchCurrentPos = null;

    this.initDOM();
    this.initEvents();
    this.resizeCanvas();
  }

  initDOM() {
    this.ui = {
      startScreen: document.getElementById('startScreen'),
      levelUpModal: document.getElementById('levelUpModal'),
      gameOverModal: document.getElementById('gameOverModal'),
      perkCardsContainer: document.getElementById('perkCardsContainer'),
      rackContainer: document.getElementById('rackContainer'),
      castBtn: document.getElementById('castBtn'),
      readyWordBadge: document.getElementById('readyWordBadge'),
      timerEl: document.getElementById('timerDisplay'),
      killsEl: document.getElementById('killsDisplay'),
      lvlEl: document.getElementById('lvlDisplay'),
      hpBarFill: document.getElementById('hpBarFill'),
      expBarFill: document.getElementById('expBarFill'),
      dailyTargetWord: document.getElementById('dailyTargetWord'),
      dailyQuestBanner: document.getElementById('dailyQuestBanner'),
      highestWordDisplay: document.getElementById('highestWordDisplay'),
      btnPlayAgain: document.getElementById('btnPlayAgain'),
      btnShareScore: document.getElementById('btnShareScore'),
      langSelect: document.getElementById('langSelect'),
      audioToggleBtn: document.getElementById('audioToggleBtn')
    };

    if (this.ui.dailyTargetWord) {
      this.ui.dailyTargetWord.innerText = dailyManager.targetWord;
    }
  }

  initEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.gameState === 'PLAYING') {
          this.triggerCast();
        } else if (this.gameState === 'START') {
          this.startGame();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Touch joystick
    this.canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.touchStartPos = { x: touch.clientX, y: touch.clientY };
      this.touchCurrentPos = { x: touch.clientX, y: touch.clientY };
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.touchStartPos) return;
      const touch = e.touches[0];
      this.touchCurrentPos = { x: touch.clientX, y: touch.clientY };
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      this.touchStartPos = null;
      this.touchCurrentPos = null;
      this.player.setInput(0, 0);
    });

    // Cast button click
    if (this.ui.castBtn) {
      this.ui.castBtn.addEventListener('click', () => {
        if (this.gameState === 'PLAYING') {
          this.triggerCast();
        }
      });
    }

    // Play again
    if (this.ui.btnPlayAgain) {
      this.ui.btnPlayAgain.addEventListener('click', () => {
        this.startGame();
      });
    }

    // Share Score Card
    if (this.ui.btnShareScore) {
      this.ui.btnShareScore.addEventListener('click', () => {
        const text = dailyManager.generateShareCard({
          timeSurvived: this.formatTime(this.gameTime),
          kills: this.player.kills,
          highestWord: this.highestWord,
          highestDamage: this.highestDamage,
          wordsSpelled: this.player.wordsCastCount
        });

        navigator.clipboard.writeText(text).then(() => {
          alert(i18n.t('copiedAlert'));
        }).catch(() => {
          prompt('Copy scorecard:', text);
        });
      });
    }

    // Language selection
    if (this.ui.langSelect) {
      this.ui.langSelect.value = i18n.currentLang;
      this.ui.langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        this.renderRack();
      });
    }

    // Audio toggle
    if (this.ui.audioToggleBtn) {
      this.ui.audioToggleBtn.addEventListener('click', () => {
        const muted = soundEngine.toggleMute();
        this.ui.audioToggleBtn.innerText = muted ? '🔇' : '🔊';
      });
    }

    // Player Callbacks
    this.player.onLevelUpCallback = (lvl) => {
      this.showLevelUpModal();
    };

    this.player.onRackChangeCallback = () => {
      this.renderRack();
    };

    // Start Screen Click
    if (this.ui.startScreen) {
      this.ui.startScreen.addEventListener('click', () => {
        this.startGame();
      });
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startGame() {
    this.player.reset(0, 0);
    hordeManager.reset();
    spellManager.reset();
    this.gameTime = 0;
    this.highestWord = '';
    this.highestDamage = 0;
    this.gameState = 'PLAYING';

    if (this.ui.startScreen) this.ui.startScreen.style.display = 'none';
    if (this.ui.gameOverModal) this.ui.gameOverModal.style.display = 'none';
    if (this.ui.levelUpModal) this.ui.levelUpModal.style.display = 'none';

    soundEngine.ensureContext();
    soundEngine.startBGM();
    this.renderRack();
  }

  triggerCast() {
    if (this.player.availableWords.length > 0) {
      const word = this.player.selectedWord || this.player.availableWords[0];
      const scoreData = wordEngine.getWordScore(word);

      // Check daily quest word
      dailyManager.checkDailyWord(word);

      if (scoreData.totalDamage > this.highestDamage) {
        this.highestDamage = scoreData.totalDamage;
        this.highestWord = word;
      }

      this.player.castBestWord(hordeManager.enemies);
    }
  }

  showLevelUpModal() {
    this.gameState = 'LEVEL_UP';
    const perks = getRandomPerks(3);
    this.ui.perkCardsContainer.innerHTML = '';

    perks.forEach((perk) => {
      const card = document.createElement('div');
      card.className = 'perk-card';
      const lang = i18n.currentLang;
      card.innerHTML = `
        <div class="perk-icon">${perk.icon}</div>
        <div class="perk-title">${perk.title[lang] || perk.title.en}</div>
        <div class="perk-desc">${perk.desc[lang] || perk.desc.en}</div>
      `;
      card.addEventListener('click', () => {
        perk.apply(this.player);
        this.ui.levelUpModal.style.display = 'none';
        this.gameState = 'PLAYING';
      });
      this.ui.perkCardsContainer.appendChild(card);
    });

    this.ui.levelUpModal.style.display = 'flex';
  }

  showGameOver() {
    this.gameState = 'GAME_OVER';
    soundEngine.stopBGM();
    soundEngine.playGameOver();

    document.getElementById('finalTime').innerText = this.formatTime(this.gameTime);
    document.getElementById('finalKills').innerText = this.player.kills;
    document.getElementById('finalWords').innerText = this.player.wordsCastCount;
    document.getElementById('finalBestWord').innerText = this.highestWord ? `${this.highestWord} (+${this.highestDamage} DMG)` : 'None';

    if (this.ui.gameOverModal) {
      this.ui.gameOverModal.style.display = 'flex';
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  renderRack() {
    if (!this.ui.rackContainer) return;
    this.ui.rackContainer.innerHTML = '';

    // Render Letter tiles
    this.player.rack.forEach((letter, idx) => {
      const tile = document.createElement('div');
      const isRare = ['Q', 'Z', 'X', 'J'].includes(letter);
      tile.className = `rack-tile ${isRare ? 'rare' : ''}`;
      tile.innerHTML = `
        <span class="letter">${letter}</span>
        <span class="score">${wordEngine.getWordScore(letter).baseScore}</span>
      `;
      tile.title = 'Click to discard';
      tile.addEventListener('click', () => {
        this.player.discardLetter(idx);
      });
      this.ui.rackContainer.appendChild(tile);
    });

    // Update Ready Word Badge & Cast Button
    if (this.player.availableWords.length > 0) {
      const best = this.player.selectedWord || this.player.availableWords[0];
      const elem = wordEngine.getElementType(best);
      const score = wordEngine.getWordScore(best);
      const elemIcon = {
        FIRE: '🔥', ICE: '❄️', LIGHTNING: '⚡', HOLY: '✨', VOID: '🌌', BLADE: '⚔️', ARCANE: '🔮'
      }[elem] || '🔮';

      this.ui.readyWordBadge.innerText = `${elemIcon} ${best} (+${score.totalDamage} DMG)`;
      this.ui.readyWordBadge.className = `ready-badge active elem-${elem.toLowerCase()}`;
      this.ui.castBtn.disabled = false;
      this.ui.castBtn.classList.add('glow');
    } else {
      this.ui.readyWordBadge.innerText = i18n.t('noWord');
      this.ui.readyWordBadge.className = 'ready-badge';
      this.ui.castBtn.disabled = true;
      this.ui.castBtn.classList.remove('glow');
    }
  }

  handleInput() {
    let vx = 0;
    let vy = 0;

    if (this.keys['w'] || this.keys['arrowup']) vy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) vy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) vx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) vx += 1;

    // Handle touch joystick
    if (this.touchStartPos && this.touchCurrentPos) {
      const dx = this.touchCurrentPos.x - this.touchStartPos.x;
      const dy = this.touchCurrentPos.y - this.touchStartPos.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 10) {
        vx = dx / dist;
        vy = dy / dist;
      }
    }

    this.player.setInput(vx, vy);
  }

  update(dt) {
    if (this.gameState !== 'PLAYING') return;

    this.gameTime += dt;
    this.handleInput();

    // Update Player
    this.player.update(dt, hordeManager.enemies);

    // Update Horde (Enemies & Drops)
    hordeManager.update(dt, this.player);

    // Update Spells
    spellManager.update(dt, hordeManager.enemies, this.player);

    // Update Particles
    particleSystem.update(dt);

    // Update Camera (smooth track player)
    const targetCamX = this.player.x - this.canvas.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.15;
    this.camera.y += (targetCamY - this.camera.y) * 0.15;

    // Check Game Over
    if (this.player.stats.hp <= 0) {
      this.showGameOver();
    }

    // Update HUD DOM
    this.ui.timerEl.innerText = this.formatTime(this.gameTime);
    this.ui.killsEl.innerText = this.player.kills;
    this.ui.lvlEl.innerText = this.player.level;

    const hpRatio = Math.max(0, this.player.stats.hp / this.player.stats.maxHp);
    this.ui.hpBarFill.style.width = `${hpRatio * 100}%`;

    const expRatio = Math.min(1, this.player.exp / this.player.nextLevelExp);
    this.ui.expBarFill.style.width = `${expRatio * 100}%`;
  }

  drawGrid() {
    const gridSize = 80;
    const startX = -(this.camera.x % gridSize);
    const startY = -(this.camera.y % gridSize);

    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    this.ctx.lineWidth = 1;

    for (let x = startX; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = startY; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply Screen Shake
    this.ctx.save();
    if (particleSystem.screenShake > 0) {
      const rx = (Math.random() - 0.5) * particleSystem.screenShake;
      const ry = (Math.random() - 0.5) * particleSystem.screenShake;
      this.ctx.translate(rx, ry);
    }

    // Background Arena Grid
    this.drawGrid();

    // Render Horde & Items
    hordeManager.draw(this.ctx, this.camera);

    // Render Spells
    spellManager.draw(this.ctx, this.camera);

    // Render Player
    this.player.draw(this.ctx, this.camera);

    // Render Particles & Floaters
    particleSystem.draw(this.ctx, this.camera);

    // Render Touch Virtual Joystick
    if (this.touchStartPos && this.touchCurrentPos) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(this.touchStartPos.x, this.touchStartPos.y, 45, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(this.touchCurrentPos.x, this.touchCurrentPos.y, 22, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      this.ctx.fill();
      this.ctx.restore();
    }

    this.ctx.restore();
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  start() {
    requestAnimationFrame((t) => this.loop(t));
    i18n.applyTranslations();
  }
}

// Instantiate and start game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.start();
});
