/**
 * Neon Beat: 3D Perspective Projection, Dual Blade Slicer & Physics Block Splitting
 */

export class BladeSlicer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;

    // Trail points for Red and Blue Sabers
    this.blueTrail = [];
    this.redTrail = [];

    // Cut half-blocks physics simulation
    this.splitBlocks = [];

    // Current pointer pos
    this.pointerPos = { x: 340, y: 440 };
  }

  // Add trail position
  addPoint(x, y, isBlue = true) {
    const trail = isBlue ? this.blueTrail : this.redTrail;
    trail.unshift({ x, y, alpha: 1.0, time: performance.now() });
    if (trail.length > 14) trail.pop();
  }

  update(dt) {
    // Fade trails
    [this.blueTrail, this.redTrail].forEach(trail => {
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].alpha -= dt * 4.5;
        if (trail[i].alpha <= 0) trail.splice(i, 1);
      }
    });

    // Update Split Blocks Physics
    for (let i = this.splitBlocks.length - 1; i >= 0; i--) {
      const b = this.splitBlocks[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.vy += 800 * dt; // Gravity
      b.rotation += b.vRot * dt;
      b.alpha -= dt * 1.5;

      if (b.alpha <= 0 || b.y > 600) {
        this.splitBlocks.splice(i, 1);
      }
    }
  }

  // Spawn two splitting block halves
  spawnSplitBlock(x, y, size, color, cutAngle = 0) {
    // Left half
    this.splitBlocks.push({
      x: x - size * 0.25,
      y,
      size: size * 0.5,
      vx: -120 + Math.random() * -80,
      vy: -150 - Math.random() * 100,
      rotation: cutAngle,
      vRot: -6 + Math.random() * -4,
      color,
      alpha: 1.0
    });

    // Right half
    this.splitBlocks.push({
      x: x + size * 0.25,
      y,
      size: size * 0.5,
      vx: 120 + Math.random() * 80,
      vy: -150 - Math.random() * 100,
      rotation: cutAngle,
      vRot: 6 + Math.random() * 4,
      color,
      alpha: 1.0
    });
  }

  // Check line segment collision with note box
  checkSlice(x1, y1, x2, y2, noteX, noteY, radius) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(noteX - x1, noteY - y1) < radius;

    const t = Math.max(0, Math.min(1, ((noteX - x1) * dx + (noteY - y1) * dy) / lenSq));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;

    return Math.hypot(noteX - projX, noteY - projY) < radius;
  }

  // Draw Blade Trails and Sliced Block Halves
  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // 1. Draw Sliced Block Halves
    this.splitBlocks.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);
      ctx.fillStyle = b.color;
      ctx.globalAlpha = b.alpha;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.rect(-b.size / 2, -b.size, b.size, b.size * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    });

    // 2. Draw Cyan / Blue Blade Trail
    this.drawTrail(this.blueTrail, '#00f0ff');

    // 3. Draw Magenta / Red Blade Trail
    this.drawTrail(this.redTrail, '#ec4899');

    ctx.globalAlpha = 1.0;
  }

  drawTrail(trail, color) {
    if (trail.length < 2) return;
    const ctx = this.ctx;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < trail.length - 1; i++) {
      const p1 = trail[i];
      const p2 = trail[i + 1];
      ctx.globalAlpha = p1.alpha * 0.8;
      ctx.lineWidth = 14 * p1.alpha;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.restore();
  }
}
