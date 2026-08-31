/**
 * Particle Effects Engine for Mecha Arena
 * Renders metal sparks, armor chips, laser beams, smoke trails, and explosive bursts.
 */

export class MechaParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.lasers = [];
    this.sparks = [];
  }

  // Spawn metal sparks on impact / saw grind
  spawnSparks(x, y, count = 12, color = '#facc15') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 180;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: Math.random() * 2.5 + 1.0,
        alpha: 1.0,
        decay: Math.random() * 2.5 + 1.5
      });
    }
  }

  // Spawn explosive shockwave burst
  spawnExplosion(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 220;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.4 ? '#ef4444' : '#fb923c',
        radius: Math.random() * 4 + 2,
        alpha: 1.0,
        decay: Math.random() * 1.5 + 1.0
      });
    }
  }

  // Add Laser Beam Line
  addLaser(x1, y1, x2, y2, color = '#00f0ff') {
    this.lasers.push({
      x1, y1, x2, y2, color, alpha: 1.0
    });
  }

  update(dt) {
    // 1. Update Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vx *= 0.95;
      s.vy *= 0.95;
      s.alpha -= s.decay * dt;

      if (s.alpha <= 0) {
        this.sparks.splice(i, 1);
      }
    }

    // 2. Update Explosion Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.alpha -= p.decay * dt;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 3. Update Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.alpha -= dt * 6.0;
      if (l.alpha <= 0) {
        this.lasers.splice(i, 1);
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Draw Lasers
    this.lasers.forEach(l => {
      ctx.save();
      ctx.strokeStyle = l.color;
      ctx.globalAlpha = l.alpha;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
      ctx.restore();
    });

    // Draw Sparks
    this.sparks.forEach(s => {
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Explosions
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
  }
}
