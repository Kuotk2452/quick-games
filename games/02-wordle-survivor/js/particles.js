/**
 * Particle & Visual Effects Engine for Wordle Survivor
 * Handles spell explosions, elemental bursts, damage numbers, and screen shake.
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.damageTexts = [];
    this.screenShake = 0;
  }

  triggerScreenShake(intensity = 8) {
    this.screenShake = Math.max(this.screenShake, intensity);
  }

  update(dt) {
    // Decay screen shake
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.shrink) {
        p.size = Math.max(0.1, p.initialSize * p.alpha);
      }
      if (p.spin) {
        p.angle = (p.angle || 0) + p.spin * dt;
      }
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating damage texts
    for (let i = this.damageTexts.length - 1; i >= 0; i--) {
      const t = this.damageTexts[i];
      t.y -= t.speedY * dt;
      t.life -= dt;
      t.alpha = Math.max(0, t.life / t.maxLife);
      if (t.life <= 0) {
        this.damageTexts.splice(i, 1);
      }
    }
  }

  draw(ctx, camera) {
    ctx.save();

    // Draw Particles
    for (const p of this.particles) {
      const screenX = p.x - camera.x;
      const screenY = p.y - camera.y;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.glow ? 12 : 0;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'ring') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.lineWidth || 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.shape === 'star') {
        ctx.translate(screenX, screenY);
        ctx.rotate(p.angle || 0);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      ctx.restore();
    }

    // Draw Floating Damage Numbers
    for (const t of this.damageTexts) {
      const screenX = t.x - camera.x;
      const screenY = t.y - camera.y;

      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.font = t.isCrit ? '900 20px "Segoe UI", sans-serif' : '700 15px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.isCrit ? '#ff0055' : '#000000';
      ctx.shadowBlur = t.isCrit ? 10 : 4;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(t.text, screenX, screenY);
      ctx.fillText(t.text, screenX, screenY);
      ctx.restore();
    }

    ctx.restore();
  }

  addDamageText(x, y, text, color = '#ffffff', isCrit = false) {
    this.damageTexts.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y - 10,
      text: isCrit ? `🔥 ${text}!` : text,
      color: isCrit ? '#ffdd00' : color,
      speedY: isCrit ? 60 : 40,
      life: isCrit ? 1.0 : 0.7,
      maxLife: isCrit ? 1.0 : 0.7,
      alpha: 1,
      isCrit
    });
  }

  // Spell-specific particle bursts
  emitFireBurst(x, y, radius = 60) {
    this.triggerScreenShake(6);
    // Shockwave ring
    this.particles.push({
      x, y, vx: 0, vy: 0,
      shape: 'ring', color: '#ff4400',
      size: 10, initialSize: 10, shrink: false,
      lineWidth: 4, life: 0.35, maxLife: 0.35, alpha: 1,
      glow: true
    });
    // Fire embers
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * radius * 3 + 50;
      const colors = ['#ff0033', '#ff6600', '#ffcc00', '#ffffff'];
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        shape: 'circle',
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 3,
        initialSize: 6,
        shrink: true,
        life: Math.random() * 0.4 + 0.2,
        maxLife: 0.6,
        alpha: 1,
        glow: true
      });
    }
  }

  emitIceBurst(x, y, radius = 80) {
    this.triggerScreenShake(4);
    // Frost ring
    this.particles.push({
      x, y, vx: 0, vy: 0,
      shape: 'ring', color: '#00ffff',
      size: 20, initialSize: 20, shrink: false,
      lineWidth: 3, life: 0.4, maxLife: 0.4, alpha: 1,
      glow: true
    });
    // Ice shards
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * radius * 2.5 + 40;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        shape: 'star',
        color: '#b3ffff',
        size: Math.random() * 6 + 3,
        initialSize: 8,
        spin: (Math.random() - 0.5) * 10,
        shrink: true,
        life: Math.random() * 0.5 + 0.3,
        maxLife: 0.8,
        alpha: 1,
        glow: true
      });
    }
  }

  emitLightningSparks(x, y, targetX, targetY) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const px = x + (targetX - x) * t + (Math.random() - 0.5) * 20;
      const py = y + (targetY - y) * t + (Math.random() - 0.5) * 20;
      this.particles.push({
        x: px, y: py,
        vx: (Math.random() - 0.5) * 80,
        vy: (Math.random() - 0.5) * 80,
        shape: 'circle',
        color: '#ffe600',
        size: Math.random() * 4 + 2,
        initialSize: 5,
        shrink: true,
        life: 0.25,
        maxLife: 0.25,
        alpha: 1,
        glow: true
      });
    }
  }

  emitVoidVortex(x, y) {
    this.triggerScreenShake(7);
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 120 + 30;
      const px = x + Math.cos(angle) * dist;
      const py = y + Math.sin(angle) * dist;
      // Inward pull velocity
      const vx = -Math.cos(angle) * 160 + (Math.random() - 0.5) * 50;
      const vy = -Math.sin(angle) * 160 + (Math.random() - 0.5) * 50;
      this.particles.push({
        x: px, y: py, vx, vy,
        shape: 'circle',
        color: Math.random() > 0.4 ? '#a300ff' : '#220033',
        size: Math.random() * 6 + 3,
        initialSize: 8,
        shrink: true,
        life: 0.6,
        maxLife: 0.6,
        alpha: 1,
        glow: true
      });
    }
  }

  emitHolyNova(x, y) {
    this.triggerScreenShake(5);
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const speed = 180;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        shape: 'star',
        color: '#fff37a',
        size: 8,
        initialSize: 8,
        spin: 6,
        shrink: true,
        life: 0.45,
        maxLife: 0.45,
        alpha: 1,
        glow: true
      });
    }
  }

  emitMonsterDeathRune(x, y, letter = '') {
    // Sparkles when letter drops
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 40 + 20;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        shape: 'circle',
        color: '#00ffcc',
        size: 3,
        initialSize: 3,
        shrink: true,
        life: 0.3,
        maxLife: 0.3,
        alpha: 1,
        glow: true
      });
    }
  }
}

export const particleSystem = new ParticleSystem();
