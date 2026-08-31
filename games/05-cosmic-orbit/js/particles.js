/**
 * High-Performance Particle Engine for Cosmic Orbit
 * Renders 60fps cosmic starfields, orbital stardust trails, shockwave rings, and supernova bursts.
 */

export class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.shockwaves = [];
    this.stars = [];
    this.initStarfield();
  }

  initStarfield() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * 800,
        y: Math.random() * 800,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 2 + 1
      });
    }
  }

  // Spawn supernova / merge burst
  spawnMergeBurst(x, y, color = '#00f0ff', count = 35) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 180;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: Math.random() * 3.5 + 1.5,
        alpha: 1.0,
        decay: Math.random() * 1.2 + 0.8
      });
    }

    // Add Shockwave Ring
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: 90,
      color,
      alpha: 0.9,
      speed: 160
    });
  }

  update(dt) {
    // 1. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= p.decay * dt;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 2. Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * dt;
      sw.alpha = Math.max(0, 1 - (sw.radius / sw.maxRadius));

      if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  drawStarfield(time) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Draw twinkling background stars
    this.stars.forEach((star) => {
      const a = star.alpha * (0.6 + 0.4 * Math.sin(time * star.twinkleSpeed));
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.beginPath();
      ctx.arc((star.x / 800) * width, (star.y / 800) * height, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  draw(time) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // 1. Draw Shockwave Rings
    this.shockwaves.forEach((sw) => {
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 2. Draw Stardust Particles
    this.particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
  }
}
