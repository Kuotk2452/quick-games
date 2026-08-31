/**
 * Particle Effects & Synthwave Retro Grid Horizon for Neon Beat
 */

export class NeonParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.sparks = [];
    this.ratings = [];
    this.rings = [];
  }

  // Spawn slice sparks
  spawnSliceSparks(x, y, color = '#00f0ff', count = 18) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 260;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: Math.random() * 3 + 1.5,
        alpha: 1.0,
        decay: Math.random() * 2.5 + 2.0
      });
    }

    // Expanding shockwave ring
    this.rings.push({
      x,
      y,
      radius: 10,
      maxRadius: 65,
      color,
      alpha: 0.9
    });
  }

  // Spawn floating accuracy text popup
  spawnRating(x, y, text, color) {
    this.ratings.push({
      x,
      y,
      text,
      color,
      alpha: 1.0,
      scale: 1.4,
      vy: -60
    });
  }

  update(dt) {
    // 1. Update Sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vx *= 0.94;
      s.vy *= 0.94;
      s.alpha -= s.decay * dt;

      if (s.alpha <= 0) {
        this.sparks.splice(i, 1);
      }
    }

    // 2. Update Shockwave Rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.radius += (r.maxRadius - r.radius) * 14 * dt;
      r.alpha -= dt * 3.0;

      if (r.alpha <= 0 || r.radius >= r.maxRadius - 2) {
        this.rings.splice(i, 1);
      }
    }

    // 3. Update Rating Popups
    for (let i = this.ratings.length - 1; i >= 0; i--) {
      const rp = this.ratings[i];
      rp.y += rp.vy * dt;
      rp.scale = Math.max(1.0, rp.scale - dt * 2.0);
      rp.alpha -= dt * 1.6;

      if (rp.alpha <= 0) {
        this.ratings.splice(i, 1);
      }
    }
  }

  // Draw Synthwave Horizon Background Grid
  drawBackground(width, height, time = 0, isFever = false) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Horizon line Y
    const horizonY = height * 0.32;

    // Deep synthwave sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, '#05030a');
    skyGrad.addColorStop(1, isFever ? '#3b0764' : '#1e1b4b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, horizonY);

    // Glowing Synthwave Sun
    const sunGrad = ctx.createRadialGradient(width / 2, horizonY, 10, width / 2, horizonY, 90);
    sunGrad.addColorStop(0, '#facc15');
    sunGrad.addColorStop(0.5, '#ec4899');
    sunGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(width / 2, horizonY, 90, Math.PI, 0);
    ctx.fill();

    // Road floor
    const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    floorGrad.addColorStop(0, '#090514');
    floorGrad.addColorStop(1, '#020108');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    // 3D Perspective Road Grid Lines
    ctx.save();
    ctx.strokeStyle = isFever ? 'rgba(236, 72, 153, 0.4)' : 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 1.5;

    // Longitudinal Lane Lines (Vanish to center horizon)
    const lanes = [-280, -140, -40, 40, 140, 280];
    lanes.forEach(offset => {
      ctx.beginPath();
      ctx.moveTo(width / 2 + offset * 0.1, horizonY);
      ctx.lineTo(width / 2 + offset * 1.8, height);
      ctx.stroke();
    });

    // Horizontal Scrolling Grid Lines
    const speed = 160;
    const gridOffset = (time * speed) % 50;
    for (let y = horizonY + gridOffset; y < height; y += (y - horizonY) * 0.28 + 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw Particles, Rings & Rating Text
  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // 1. Draw Rings
    this.rings.forEach(r => {
      ctx.save();
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = r.alpha;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // 2. Draw Sparks
    this.sparks.forEach(s => {
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Draw Accuracy Ratings
    this.ratings.forEach(rp => {
      ctx.save();
      ctx.translate(rp.x, rp.y);
      ctx.scale(rp.scale, rp.scale);
      ctx.fillStyle = rp.color;
      ctx.globalAlpha = rp.alpha;
      ctx.font = '900 24px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = rp.color;
      ctx.shadowBlur = 12;
      ctx.fillText(rp.text, 0, 0);
      ctx.restore();
    });

    ctx.globalAlpha = 1.0;
  }
}
