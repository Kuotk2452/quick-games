/**
 * Enemy Horde & Monster AI System for Wordle Survivor
 * Handles waves of alphabetic monsters, boss battles, and letter drops.
 */

import { wordEngine } from './dictionary.js';
import { particleSystem } from './particles.js';
import { soundEngine } from './audio.js';

let enemyIdCounter = 1;

export class Enemy {
  constructor(type, x, y, tier = 1) {
    this.id = enemyIdCounter++;
    this.type = type; // 'ALPHABAT', 'SKELETON', 'GOBLIN', 'SLIME', 'BOSS'
    this.x = x;
    this.y = y;
    this.alive = true;
    this.frozenTime = 0;
    this.flashHit = 0;

    // Type characteristics
    switch (type) {
      case 'ALPHABAT':
        this.radius = 14;
        this.maxHp = 25 * tier;
        this.hp = this.maxHp;
        this.speed = 140 + Math.random() * 20;
        this.color = '#c084fc';
        this.icon = '🦇';
        this.exp = 5;
        this.dropRate = 0.55;
        break;
      case 'SLIME':
        this.radius = 18;
        this.maxHp = 45 * tier;
        this.hp = this.maxHp;
        this.speed = 85;
        this.color = '#4ade80';
        this.icon = '🧪';
        this.exp = 8;
        this.dropRate = 0.70;
        this.isVowelSlime = true;
        break;
      case 'SKELETON':
        this.radius = 16;
        this.maxHp = 60 * tier;
        this.hp = this.maxHp;
        this.speed = 105;
        this.color = '#e2e8f0';
        this.icon = '💀';
        this.exp = 10;
        this.dropRate = 0.60;
        break;
      case 'GOBLIN':
        this.radius = 20;
        this.maxHp = 120 * tier;
        this.hp = this.maxHp;
        this.speed = 95;
        this.color = '#fbbf24';
        this.icon = '👺';
        this.exp = 18;
        this.dropRate = 0.80;
        break;
      case 'BOSS':
        this.radius = 42;
        this.maxHp = 900 * tier;
        this.hp = this.maxHp;
        this.speed = 65;
        this.color = '#f43f5e';
        this.icon = '👑';
        this.exp = 150;
        this.dropRate = 1.0;
        this.isBoss = true;
        break;
      default:
        this.radius = 15;
        this.maxHp = 30;
        this.hp = 30;
        this.speed = 100;
        this.color = '#94a3b8';
        this.icon = '👾';
        this.exp = 5;
        this.dropRate = 0.5;
    }
  }

  takeDamage(amount, color = '#ffffff', isCrit = false) {
    if (!this.alive) return;
    this.hp -= amount;
    this.flashHit = 0.12;
    particleSystem.addDamageText(this.x, this.y, amount, color, isCrit);

    if (this.hp <= 0) {
      this.alive = false;
      soundEngine.playMonsterDeath();
      particleSystem.emitMonsterDeathRune(this.x, this.y);
    }
  }

  freeze(duration = 3.0) {
    this.frozenTime = Math.max(this.frozenTime, duration);
  }

  update(dt, player, onDrop) {
    if (!this.alive) return;

    if (this.flashHit > 0) {
      this.flashHit = Math.max(0, this.flashHit - dt);
    }

    if (this.frozenTime > 0) {
      this.frozenTime = Math.max(0, this.frozenTime - dt);
      return; // Frozen! Can't move
    }

    // Move toward player
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    this.x += Math.cos(angle) * this.speed * dt;
    this.y += Math.sin(angle) * this.speed * dt;

    // Check collision with player
    const distToPlayer = Math.hypot(player.x - this.x, player.y - this.y);
    if (distToPlayer < this.radius + player.radius) {
      const damage = this.isBoss ? 25 : 10;
      player.takeDamage(damage);
    }
  }

  draw(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    ctx.save();
    if (this.flashHit > 0) {
      ctx.filter = 'brightness(2.5)';
    }

    // Ice frozen tint
    if (this.frozenTime > 0) {
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
    }

    // Enemy body circle
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.frozenTime > 0 ? '#38bdf8' : this.color;
    ctx.fill();

    // Emoji/Icon avatar
    ctx.font = `${Math.round(this.radius * 1.3)}px "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.icon, screenX, screenY);

    // HP Bar for Boss / Tough Goblins
    if (this.isBoss || this.maxHp > 80) {
      const barWidth = this.radius * 2;
      const barHeight = 4;
      const hpRatio = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(screenX - barWidth / 2, screenY - this.radius - 8, barWidth, barHeight);
      ctx.fillStyle = this.isBoss ? '#ef4444' : '#22c55e';
      ctx.fillRect(screenX - barWidth / 2, screenY - this.radius - 8, barWidth * hpRatio, barHeight);
    }

    ctx.restore();
  }
}

/**
 * Letter Runes & EXP dropped on map
 */
export class DropItem {
  constructor(x, y, type = 'LETTER', letter = 'A', exp = 10) {
    this.x = x + (Math.random() - 0.5) * 20;
    this.y = y + (Math.random() - 0.5) * 20;
    this.type = type; // 'LETTER' or 'EXP'
    this.letter = letter;
    this.exp = exp;
    this.radius = 16;
    this.bobAngle = Math.random() * Math.PI * 2;
    this.life = 60; // Despawns after 60s
  }

  update(dt, player) {
    this.bobAngle += dt * 3;
    this.life -= dt;

    // Check magnet pull toward player
    const dist = Math.hypot(player.x - this.x, player.y - this.y);
    const magnetRadius = (this.type === 'LETTER' && player.stats.vowelMagnet && ['A','E','I','O','U'].includes(this.letter))
      ? player.stats.magnetRadius * 2
      : player.stats.magnetRadius;

    if (dist < magnetRadius) {
      const speed = 400 + (1 - dist / magnetRadius) * 300;
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      this.x += Math.cos(angle) * speed * dt;
      this.y += Math.sin(angle) * speed * dt;
    }

    // Check collected
    if (dist < this.radius + player.radius) {
      if (this.type === 'LETTER') {
        player.collectLetter(this.letter);
        soundEngine.playLetterPickup();
      } else {
        player.addExp(this.exp);
      }
      return true; // Collected!
    }
    return this.life <= 0;
  }

  draw(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y + Math.sin(this.bobAngle) * 3;

    ctx.save();
    if (this.type === 'LETTER') {
      // Glowing Runic Tile
      const isRare = ['Q', 'Z', 'X', 'J'].includes(this.letter);
      ctx.shadowColor = isRare ? '#ff0055' : '#00e5ff';
      ctx.shadowBlur = 10;

      ctx.fillStyle = isRare ? '#ffe4e6' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(screenX - 12, screenY - 14, 24, 28, 5);
      ctx.fill();

      ctx.strokeStyle = isRare ? '#e11d48' : '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isRare ? '#e11d48' : '#0f172a';
      ctx.font = 'bold 15px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.letter, screenX, screenY);
    } else {
      // EXP Gem
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(screenX, screenY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export class HordeManager {
  constructor() {
    this.enemies = [];
    this.drops = [];
    this.spawnTimer = 0;
    this.waveTime = 0;
    this.bossTimer = 60; // Spawn boss every 60s
  }

  reset() {
    this.enemies = [];
    this.drops = [];
    this.spawnTimer = 0;
    this.waveTime = 0;
    this.bossTimer = 60;
  }

  update(dt, player, onLevelUp) {
    this.waveTime += dt;
    this.spawnTimer += dt;
    this.bossTimer -= dt;

    // Difficulty scaling factor
    const tier = 1 + Math.floor(this.waveTime / 45) * 0.35;
    const spawnInterval = Math.max(0.35, 1.4 - (this.waveTime / 120));

    // Spawn regular enemy waves around player
    if (this.spawnTimer >= spawnInterval && this.enemies.length < 120) {
      this.spawnTimer = 0;
      this.spawnRandomEnemy(player, tier);
    }

    // Spawn Boss wave
    if (this.bossTimer <= 0) {
      this.bossTimer = 75;
      this.spawnBoss(player, tier * 1.5);
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, player);

      if (!enemy.alive) {
        // Drop EXP & Letter
        this.drops.push(new DropItem(enemy.x, enemy.y, 'EXP', '', enemy.exp));
        if (Math.random() < enemy.dropRate || enemy.isBoss) {
          const bonusVowel = enemy.isVowelSlime;
          const letter = wordEngine.getRandomLetter(bonusVowel);
          this.drops.push(new DropItem(enemy.x, enemy.y, 'LETTER', letter));
        }
        this.enemies.splice(i, 1);
      }
    }

    // Update drops
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const drop = this.drops[i];
      const collectedOrDead = drop.update(dt, player);
      if (collectedOrDead) {
        this.drops.splice(i, 1);
      }
    }
  }

  spawnRandomEnemy(player, tier) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 480 + Math.random() * 80;
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;

    const r = Math.random();
    let type = 'ALPHABAT';
    if (this.waveTime > 20 && r < 0.35) type = 'SLIME';
    else if (this.waveTime > 40 && r < 0.65) type = 'SKELETON';
    else if (this.waveTime > 75 && r < 0.85) type = 'GOBLIN';

    this.enemies.push(new Enemy(type, x, y, tier));
  }

  spawnBoss(player, tier) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 520;
    const x = player.x + Math.cos(angle) * dist;
    const y = player.y + Math.sin(angle) * dist;
    this.enemies.push(new Enemy('BOSS', x, y, tier));
    particleSystem.triggerScreenShake(12);
  }

  draw(ctx, camera) {
    // Draw Drops first (below monsters)
    for (const drop of this.drops) {
      drop.draw(ctx, camera);
    }
    // Draw Enemies
    for (const enemy of this.enemies) {
      enemy.draw(ctx, camera);
    }
  }
}

export const hordeManager = new HordeManager();
