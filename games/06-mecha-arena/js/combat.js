/**
 * Combat Simulation: Player & AI Robot Physics, Weapon Systems & Projectiles
 */

import { CHASSIS_PARTS, WEAPON_PARTS } from './workshop.js';
import { mechaAudio } from './audio.js';

export class RobotEntity {
  constructor(isPlayer = false, chassisId = 'HOVER', weaponId = 'GATLING', moduleId = 'SHIELD') {
    this.isPlayer = isPlayer;
    this.chassisId = chassisId;
    this.weaponId = weaponId;
    this.moduleId = moduleId;

    const chassis = CHASSIS_PARTS.find(c => c.id === chassisId) || CHASSIS_PARTS[0];
    this.maxHp = chassis.maxHp;
    this.hp = this.maxHp;
    this.speed = chassis.speed;
    this.recoilAbsorb = chassis.recoilAbsorb;

    this.pos = { x: 200, y: 300 };
    this.vel = { x: 0, y: 0 };
    this.angle = 0;
    this.turretAngle = 0;
    this.radius = 24;

    this.fireCooldown = 0;
    this.shieldActive = false;
    this.shieldTimer = 0;
    this.moduleCooldown = 0;
    this.isDead = false;

    // AI state
    this.aiState = 'CHASE'; // 'CHASE' | 'KITE' | 'RAM'
    this.aiTimer = 0;
  }

  takeDamage(amount) {
    if (this.shieldActive) {
      mechaAudio.playShieldHit();
      return 0;
    }
    this.hp -= amount;
    mechaAudio.playMetalImpact();
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      mechaAudio.playExplosion();
    }
    return amount;
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  activateModule(mines = []) {
    if (this.moduleCooldown > 0) return false;

    if (this.moduleId === 'SHIELD') {
      this.shieldActive = true;
      this.shieldTimer = 3.2;
      this.moduleCooldown = 8.0;
      mechaAudio.playShieldHit();
      return true;
    } else if (this.moduleId === 'NITRO') {
      this.vel.x += Math.cos(this.angle) * 480;
      this.vel.y += Math.sin(this.angle) * 480;
      this.moduleCooldown = 5.5;
      mechaAudio.playNitroDash();
      return true;
    } else if (this.moduleId === 'MINE') {
      [-25, 0, 25].forEach(offset => {
        const backAngle = this.angle + Math.PI + (offset * Math.PI / 180);
        mines.push({
          x: this.pos.x + Math.cos(backAngle) * 35,
          y: this.pos.y + Math.sin(backAngle) * 35,
          radius: 12,
          damage: 40,
          isPlayer: this.isPlayer,
          armTimer: 0.5
        });
      });
      this.moduleCooldown = 7.0;
      mechaAudio.playTeslaZap();
      return true;
    }
    return false;
  }

  update(dt, target, particles, bullets) {
    if (this.isDead) return;

    // 1. Module Timer
    if (this.shieldTimer > 0) {
      this.shieldTimer -= dt;
      if (this.shieldTimer <= 0) {
        this.shieldActive = false;
      }
    }
    if (this.moduleCooldown > 0) {
      this.moduleCooldown -= dt;
    }
    if (this.fireCooldown > 0) {
      this.fireCooldown -= dt;
    }

    // 2. Physics Movement Integration
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.vel.x *= 0.92;
    this.vel.y *= 0.92;

    // Update body rotation to movement direction if moving
    if (Math.hypot(this.vel.x, this.vel.y) > 20) {
      this.angle = Math.atan2(this.vel.y, this.vel.x);
    }

    // 3. AI Behavior (If not player)
    if (!this.isPlayer && target && !target.isDead) {
      const dx = target.pos.x - this.pos.x;
      const dy = target.pos.y - this.pos.y;
      const dist = Math.hypot(dx, dy);

      this.turretAngle = Math.atan2(dy, dx);

      // AI Movement Logic based on weapon
      if (this.weaponId === 'SAW') {
        // Charge directly at target
        this.vel.x += (dx / dist) * this.speed * dt * 2.5;
        this.vel.y += (dy / dist) * this.speed * dt * 2.5;
      } else if (this.weaponId === 'LASER') {
        // Keep distance (Kite)
        if (dist < 180) {
          this.vel.x -= (dx / dist) * this.speed * dt * 2;
          this.vel.y -= (dy / dist) * this.speed * dt * 2;
        } else if (dist > 280) {
          this.vel.x += (dx / dist) * this.speed * dt * 2;
          this.vel.y += (dy / dist) * this.speed * dt * 2;
        }
      } else {
        // Circling approach
        const perpX = -dy / dist;
        const perpY = dx / dist;
        this.vel.x += ((dx / dist) * 0.7 + perpX * 0.7) * this.speed * dt * 2;
        this.vel.y += ((dy / dist) * 0.7 + perpY * 0.7) * this.speed * dt * 2;
      }

      // AI Fire Weapon
      if (dist < 340 && this.fireCooldown <= 0) {
        this.fireWeapon(bullets, particles, target);
      }

      // AI Use Module occasionally
      if (this.moduleCooldown <= 0 && dist < 120 && Math.random() < 0.05) {
        this.activateModule();
      }
    }
  }

  fireWeapon(bullets, particles, target) {
    const weapon = WEAPON_PARTS.find(w => w.id === this.weaponId) || WEAPON_PARTS[0];
    this.fireCooldown = weapon.fireRate;

    const muzzleX = this.pos.x + Math.cos(this.turretAngle) * 30;
    const muzzleY = this.pos.y + Math.sin(this.turretAngle) * 30;

    // Recoil
    const recoilForce = weapon.recoil * (1 - this.recoilAbsorb);
    this.vel.x -= Math.cos(this.turretAngle) * recoilForce;
    this.vel.y -= Math.sin(this.turretAngle) * recoilForce;

    if (weapon.id === 'GATLING') {
      mechaAudio.playGatlingShot();
      const spread = (Math.random() - 0.5) * 0.12;
      bullets.push({
        x: muzzleX,
        y: muzzleY,
        vx: Math.cos(this.turretAngle + spread) * 620,
        vy: Math.sin(this.turretAngle + spread) * 620,
        damage: weapon.damage,
        isPlayer: this.isPlayer,
        color: weapon.color,
        radius: 4,
        life: 0.6
      });
      particles.spawnSparks(muzzleX, muzzleY, 3, '#facc15');
    } else if (weapon.id === 'LASER') {
      mechaAudio.playLaserZap();
      bullets.push({
        x: muzzleX,
        y: muzzleY,
        vx: Math.cos(this.turretAngle) * 850,
        vy: Math.sin(this.turretAngle) * 850,
        damage: weapon.damage,
        isPlayer: this.isPlayer,
        color: weapon.color,
        radius: 6,
        life: 0.5
      });
      particles.addLaser(muzzleX, muzzleY, muzzleX + Math.cos(this.turretAngle) * 380, muzzleY + Math.sin(this.turretAngle) * 380);
    } else if (weapon.id === 'SAW') {
      mechaAudio.playSawHit();
      // Melee check
      if (target && !target.isDead) {
        const dist = Math.hypot(target.pos.x - this.pos.x, target.pos.y - this.pos.y);
        if (dist < weapon.range + target.radius) {
          target.takeDamage(weapon.damage);
          particles.spawnSparks(target.pos.x, target.pos.y, 8, '#ef4444');
        }
      }
    } else if (weapon.id === 'TESLA') {
      mechaAudio.playTeslaZap();
      if (target && !target.isDead) {
        const dist = Math.hypot(target.pos.x - this.pos.x, target.pos.y - this.pos.y);
        if (dist < weapon.range) {
          target.takeDamage(weapon.damage);
          particles.addLaser(muzzleX, muzzleY, target.pos.x, target.pos.y, '#c084fc');
          particles.spawnSparks(target.pos.x, target.pos.y, 8, '#a855f7');
        }
      }
    }
  }
}
