/**
 * Player Character Controller & Runic Spell Rack for Wordle Survivor
 * Manages player movement, auto-attack wand, EXP progression, and word composition rack.
 */

import { wordEngine } from './dictionary.js';
import { spellManager } from './spells.js';
import { particleSystem } from './particles.js';
import { soundEngine } from './audio.js';

export class Player {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.radius = 18;
    this.facingAngle = 0;
    this.invulnerableTimer = 0;

    // Base Stats & Progression
    this.stats = {
      hp: 100,
      maxHp: 100,
      speed: 210,
      magnetRadius: 110,
      spellPower: 1.0,
      sparkDamage: 18,
      attackRate: 0.65, // Seconds per basic wand spark
      rackCapacity: 6,
      vowelMagnet: false,
      multiCastChance: 0,
      prefixBurst: false,
      wordShield: false
    };

    // Progression Level & EXP
    this.level = 1;
    this.exp = 0;
    this.nextLevelExp = 25;
    this.kills = 0;
    this.wordsCastCount = 0;
    this.totalDamageDealt = 0;
    this.discoveredWords = new Set();

    // Runic Rack Inventory
    this.rack = [];
    this.selectedWord = null;
    this.availableWords = [];

    this.sparkTimer = 0;
    this.inputVector = { x: 0, y: 0 };
    this.onLevelUpCallback = null;
    this.onRackChangeCallback = null;
  }

  reset(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.stats.hp = 100;
    this.stats.maxHp = 100;
    this.stats.speed = 210;
    this.stats.magnetRadius = 110;
    this.stats.spellPower = 1.0;
    this.stats.sparkDamage = 18;
    this.stats.attackRate = 0.65;
    this.stats.rackCapacity = 6;
    this.stats.vowelMagnet = false;
    this.stats.multiCastChance = 0;
    this.stats.prefixBurst = false;
    this.stats.wordShield = false;

    this.level = 1;
    this.exp = 0;
    this.nextLevelExp = 25;
    this.kills = 0;
    this.wordsCastCount = 0;
    this.totalDamageDealt = 0;
    this.discoveredWords.clear();

    this.rack = ['F', 'I', 'R', 'E', 'A', 'T']; // Friendly starter rack!
    this.updateAvailableWords();
  }

  setInput(vx, vy) {
    const len = Math.hypot(vx, vy);
    if (len > 0) {
      this.inputVector.x = vx / len;
      this.inputVector.y = vy / len;
      this.facingAngle = Math.atan2(vy, vx);
    } else {
      this.inputVector.x = 0;
      this.inputVector.y = 0;
    }
  }

  takeDamage(amount) {
    if (this.invulnerableTimer > 0) return;
    this.stats.hp -= amount;
    this.invulnerableTimer = 0.6; // Brief invincibility frame
    soundEngine.playPlayerHit();
    particleSystem.triggerScreenShake(5);
    particleSystem.addDamageText(this.x, this.y, `-${amount}`, '#ef4444');

    if (this.stats.hp <= 0) {
      this.stats.hp = 0;
    }
  }

  heal(amount) {
    this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + amount);
  }

  addExp(amount) {
    this.exp += amount;
    if (this.exp >= this.nextLevelExp) {
      this.exp -= this.nextLevelExp;
      this.level++;
      this.nextLevelExp = Math.round(this.nextLevelExp * 1.45 + 15);
      soundEngine.playLevelUp();
      particleSystem.triggerScreenShake(8);
      if (this.onLevelUpCallback) {
        this.onLevelUpCallback(this.level);
      }
    }
  }

  collectLetter(letter) {
    if (this.rack.length >= this.stats.rackCapacity) {
      // Rack full: replace the oldest letter
      this.rack.shift();
    }
    this.rack.push(letter.toUpperCase());
    this.updateAvailableWords();
  }

  discardLetter(index) {
    if (index >= 0 && index < this.rack.length) {
      this.rack.splice(index, 1);
      this.updateAvailableWords();
    }
  }

  shuffleRack() {
    for (let i = this.rack.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.rack[i], this.rack[j]] = [this.rack[j], this.rack[i]];
    }
    this.updateAvailableWords();
  }

  clearRack() {
    this.rack = [];
    this.updateAvailableWords();
  }

  updateAvailableWords() {
    this.availableWords = wordEngine.findValidWordsFromRack(this.rack);
    if (this.onRackChangeCallback) {
      this.onRackChangeCallback(this.rack, this.availableWords);
    }
  }

  /**
   * Cast the highest scoring or selected word from the rack
   */
  castBestWord(enemies = []) {
    if (this.availableWords.length === 0) return false;

    const wordToCast = this.selectedWord || this.availableWords[0];
    const elemType = wordEngine.getElementType(wordToCast);
    const scoreData = wordEngine.getWordScore(wordToCast);

    // Consume used letters from rack
    const wordChars = wordToCast.split('');
    for (const char of wordChars) {
      const idx = this.rack.indexOf(char);
      if (idx !== -1) {
        this.rack.splice(idx, 1);
      }
    }

    // Cast spell
    spellManager.castWordSpell(wordToCast, elemType, scoreData, this, enemies);

    // Check Multi-Cast perk
    if (Math.random() < this.stats.multiCastChance) {
      setTimeout(() => {
        spellManager.castWordSpell(wordToCast, elemType, scoreData, this, enemies);
      }, 200);
    }

    // Update Stats
    this.wordsCastCount++;
    this.totalDamageDealt += scoreData.totalDamage;
    this.discoveredWords.add(wordToCast);

    // Particle floating word on cast
    particleSystem.addDamageText(this.x, this.y - 20, `✨ ${wordToCast}!`, '#00f0ff', scoreData.isCritical);

    this.selectedWord = null;
    this.updateAvailableWords();
    return true;
  }

  update(dt, enemies) {
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);
    }

    // Move player
    this.x += this.inputVector.x * this.stats.speed * dt;
    this.y += this.inputVector.y * this.stats.speed * dt;

    // Auto Wand Spark Attack
    this.sparkTimer += dt;
    if (this.sparkTimer >= this.stats.attackRate) {
      this.sparkTimer = 0;
      this.fireAutoSpark(enemies);
    }
  }

  fireAutoSpark(enemies) {
    if (enemies.length === 0) return;
    // Find closest enemy
    let closest = null;
    let minDist = Infinity;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = Math.hypot(e.x - this.x, e.y - this.y);
      if (d < minDist && d < 400) {
        minDist = d;
        closest = e;
      }
    }

    if (closest) {
      const angle = Math.atan2(closest.y - this.y, closest.x - this.x);
      spellManager.castBasicSpark(this, angle, this.stats.sparkDamage);
    }
  }

  draw(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    ctx.save();
    if (this.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Magnet Aura / Glow
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fill();

    // Wizard Body
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.shadowColor = '#818cf8';
    ctx.shadowBlur = 12;
    ctx.fill();

    // Wizard Robe & Hat Emoji Avatar
    ctx.font = '24px "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧙‍♂️', screenX, screenY);

    // Wand Aim Pointer
    const wandX = screenX + Math.cos(this.facingAngle) * 22;
    const wandY = screenY + Math.sin(this.facingAngle) * 22;
    ctx.beginPath();
    ctx.arc(wandX, wandY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.restore();
  }
}
