/**
 * Spell Mechanics & Projectile Manager for Wordle Survivor
 * Manages active spells, collision detection with monsters, and spell rendering.
 */

import { particleSystem } from './particles.js';
import { soundEngine } from './audio.js';

export class SpellManager {
  constructor() {
    this.activeSpells = [];
  }

  reset() {
    this.activeSpells = [];
  }

  /**
   * Cast a spell based on word, element, damage, and player position
   */
  castWordSpell(word, elemType, scoreData, player, targetEnemies = []) {
    const { totalDamage, isCritical } = scoreData;
    const baseDamage = Math.round(totalDamage * (player.stats.spellPower || 1.0));

    soundEngine.playSpellCast(elemType, isCritical);

    switch (elemType) {
      case 'FIRE':
        this.castFireball(player, targetEnemies, baseDamage, isCritical);
        break;
      case 'ICE':
        this.castFrostNova(player, baseDamage, isCritical);
        break;
      case 'LIGHTNING':
        this.castChainLightning(player, targetEnemies, baseDamage, isCritical);
        break;
      case 'HOLY':
        this.castHolyGrace(player, baseDamage, isCritical);
        break;
      case 'VOID':
        this.castVoidVortex(player, targetEnemies, baseDamage, isCritical);
        break;
      case 'BLADE':
        this.castBladeStorm(player, baseDamage, isCritical);
        break;
      case 'ARCANE':
      default:
        this.castArcaneSupernova(player, baseDamage, isCritical);
        break;
    }
  }

  castFireball(player, enemies, damage, isCrit) {
    const count = isCrit ? 5 : 3;
    const angleStep = 0.35;
    const baseAngle = player.facingAngle || 0;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - (count - 1) / 2) * angleStep;
      this.activeSpells.push({
        type: 'FIREBALL',
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 450,
        vy: Math.sin(angle) * 450,
        radius: isCrit ? 22 : 16,
        damage,
        isCrit,
        pierce: 3,
        life: 1.5,
        color: '#ff4500'
      });
    }
  }

  castFrostNova(player, damage, isCrit) {
    particleSystem.emitIceBurst(player.x, player.y, isCrit ? 180 : 120);
    this.activeSpells.push({
      type: 'FROST_NOVA',
      x: player.x,
      y: player.y,
      radius: 20,
      maxRadius: isCrit ? 280 : 200,
      growSpeed: 450,
      damage,
      isCrit,
      freezeDuration: isCrit ? 4.5 : 3.0,
      life: 0.6,
      color: '#00e5ff'
    });
  }

  castChainLightning(player, enemies, damage, isCrit) {
    if (enemies.length === 0) return;
    // Find closest enemies
    const sorted = [...enemies].sort((a, b) => {
      const distA = Math.hypot(a.x - player.x, a.y - player.y);
      const distB = Math.hypot(b.x - player.x, b.y - player.y);
      return distA - distB;
    });

    const chainCount = Math.min(sorted.length, isCrit ? 12 : 7);
    let prevX = player.x;
    let prevY = player.y;

    for (let i = 0; i < chainCount; i++) {
      const enemy = sorted[i];
      particleSystem.emitLightningSparks(prevX, prevY, enemy.x, enemy.y);
      enemy.takeDamage(damage, '#ffe600', isCrit);
      prevX = enemy.x;
      prevY = enemy.y;
    }
    particleSystem.triggerScreenShake(isCrit ? 8 : 4);
  }

  castHolyGrace(player, damage, isCrit) {
    // Heal player
    const healAmount = Math.round(player.stats.maxHp * (isCrit ? 0.35 : 0.20));
    player.heal(healAmount);
    particleSystem.emitHolyNova(player.x, player.y);
    particleSystem.addDamageText(player.x, player.y, `+${healAmount} HP`, '#44ff44');

    // Summon Holy Barrier orbs orbiting player
    const orbCount = isCrit ? 6 : 4;
    for (let i = 0; i < orbCount; i++) {
      this.activeSpells.push({
        type: 'HOLY_ORB',
        player,
        offsetAngle: (i / orbCount) * Math.PI * 2,
        dist: 70,
        rotateSpeed: 4,
        radius: 12,
        damage: Math.round(damage * 0.6),
        isCrit,
        life: 7.0,
        color: '#ffea00'
      });
    }
  }

  castVoidVortex(player, enemies, damage, isCrit) {
    // Spawn vortex near cursor or closest enemy group
    let targetX = player.x + Math.cos(player.facingAngle || 0) * 150;
    let targetY = player.y + Math.sin(player.facingAngle || 0) * 150;

    if (enemies.length > 0) {
      targetX = enemies[0].x;
      targetY = enemies[0].y;
    }

    particleSystem.emitVoidVortex(targetX, targetY);

    this.activeSpells.push({
      type: 'VOID_VORTEX',
      x: targetX,
      y: targetY,
      radius: isCrit ? 150 : 110,
      damagePerSec: damage * 1.5,
      pullSpeed: 220,
      life: 4.0,
      isCrit,
      color: '#9400d3'
    });
  }

  castBladeStorm(player, damage, isCrit) {
    const swordCount = isCrit ? 8 : 5;
    for (let i = 0; i < swordCount; i++) {
      this.activeSpells.push({
        type: 'SPECTRAL_BLADE',
        player,
        offsetAngle: (i / swordCount) * Math.PI * 2,
        dist: 90,
        rotateSpeed: 6.5,
        radius: 14,
        damage,
        isCrit,
        life: 8.0,
        color: '#e0e0e0'
      });
    }
  }

  castArcaneSupernova(player, damage, isCrit) {
    particleSystem.triggerScreenShake(isCrit ? 10 : 6);
    this.activeSpells.push({
      type: 'ARCANE_SUPERNOVA',
      x: player.x,
      y: player.y,
      radius: 10,
      maxRadius: isCrit ? 320 : 220,
      growSpeed: 600,
      damage,
      isCrit,
      life: 0.5,
      color: '#ff00aa'
    });
  }

  // Cast standard basic wand spark
  castBasicSpark(player, angle, damage) {
    this.activeSpells.push({
      type: 'BASIC_SPARK',
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * 550,
      vy: Math.sin(angle) * 550,
      radius: 6,
      damage,
      isCrit: false,
      pierce: 1,
      life: 0.9,
      color: '#00f0ff'
    });
  }

  update(dt, enemies, player) {
    for (let i = this.activeSpells.length - 1; i >= 0; i--) {
      const spell = this.activeSpells[i];
      spell.life -= dt;

      if (spell.type === 'FIREBALL' || spell.type === 'BASIC_SPARK') {
        spell.x += spell.vx * dt;
        spell.y += spell.vy * dt;

        // Check enemy hit
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          const dist = Math.hypot(enemy.x - spell.x, enemy.y - spell.y);
          if (dist < enemy.radius + spell.radius) {
            enemy.takeDamage(spell.damage, spell.color, spell.isCrit);
            if (spell.type === 'FIREBALL') {
              particleSystem.emitFireBurst(spell.x, spell.y, 40);
            }
            spell.pierce--;
            if (spell.pierce <= 0) {
              spell.life = 0;
              break;
            }
          }
        }
      } else if (spell.type === 'FROST_NOVA' || spell.type === 'ARCANE_SUPERNOVA') {
        spell.radius += spell.growSpeed * dt;
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          const dist = Math.hypot(enemy.x - spell.x, enemy.y - spell.y);
          if (dist < spell.radius && !spell.hitEnemies?.has(enemy.id)) {
            if (!spell.hitEnemies) spell.hitEnemies = new Set();
            spell.hitEnemies.add(enemy.id);
            enemy.takeDamage(spell.damage, spell.color, spell.isCrit);
            if (spell.type === 'FROST_NOVA' && spell.freezeDuration) {
              enemy.freeze(spell.freezeDuration);
            }
          }
        }
      } else if (spell.type === 'HOLY_ORB' || spell.type === 'SPECTRAL_BLADE') {
        spell.offsetAngle += spell.rotateSpeed * dt;
        spell.x = player.x + Math.cos(spell.offsetAngle) * spell.dist;
        spell.y = player.y + Math.sin(spell.offsetAngle) * spell.dist;

        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          const dist = Math.hypot(enemy.x - spell.x, enemy.y - spell.y);
          if (dist < enemy.radius + spell.radius) {
            enemy.takeDamage(Math.round(spell.damage * dt * 3.5), spell.color, spell.isCrit);
          }
        }
      } else if (spell.type === 'VOID_VORTEX') {
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          const dist = Math.hypot(enemy.x - spell.x, enemy.y - spell.y);
          if (dist < spell.radius) {
            // Pull inward
            const angle = Math.atan2(spell.y - enemy.y, spell.x - enemy.x);
            enemy.x += Math.cos(angle) * spell.pullSpeed * dt;
            enemy.y += Math.sin(angle) * spell.pullSpeed * dt;
            enemy.takeDamage(Math.round(spell.damagePerSec * dt), spell.color, spell.isCrit);
          }
        }
      }

      if (spell.life <= 0) {
        this.activeSpells.splice(i, 1);
      }
    }
  }

  draw(ctx, camera) {
    for (const spell of this.activeSpells) {
      const screenX = spell.x - camera.x;
      const screenY = spell.y - camera.y;

      ctx.save();
      ctx.fillStyle = spell.color;
      ctx.shadowColor = spell.color;
      ctx.shadowBlur = 12;

      if (spell.type === 'FIREBALL') {
        ctx.beginPath();
        ctx.arc(screenX, screenY, spell.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (spell.type === 'BASIC_SPARK') {
        ctx.beginPath();
        ctx.arc(screenX, screenY, spell.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (spell.type === 'FROST_NOVA' || spell.type === 'ARCANE_SUPERNOVA') {
        ctx.strokeStyle = spell.color;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(screenX, screenY, spell.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (spell.type === 'HOLY_ORB') {
        ctx.beginPath();
        ctx.arc(screenX, screenY, spell.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (spell.type === 'SPECTRAL_BLADE') {
        ctx.translate(screenX, screenY);
        ctx.rotate(spell.offsetAngle + Math.PI / 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-4, -spell.radius, 8, spell.radius * 2);
        ctx.fillStyle = spell.color;
        ctx.fillRect(-2, -spell.radius - 6, 4, 6);
      } else if (spell.type === 'VOID_VORTEX') {
        ctx.strokeStyle = spell.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(screenX, screenY, spell.radius * (0.8 + Math.sin(Date.now() * 0.01) * 0.2), 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }
}

export const spellManager = new SpellManager();
