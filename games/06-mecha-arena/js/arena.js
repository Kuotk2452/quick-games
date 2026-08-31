/**
 * Arena Stage Hazards, Laser Boundaries & Power-Up Drops
 */

export class ArenaStage {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.padding = 35;
    this.hazards = [
      { x: 100, y: 100, radius: 24, rotation: 0 },
      { x: width - 100, y: height - 100, radius: 24, rotation: 0 }
    ];
    this.crates = []; // { x, y, type: 'HEAL', radius: 14 }
    this.crateSpawnTimer = 8.0;
  }

  update(dt) {
    // 1. Rotate Hazards
    this.hazards.forEach(h => {
      h.rotation += dt * 8;
    });

    // 2. Spawn Repair / Power-up Crates
    this.crateSpawnTimer -= dt;
    if (this.crateSpawnTimer <= 0 && this.crates.length < 2) {
      this.crates.push({
        x: this.padding + 60 + Math.random() * (this.width - this.padding * 2 - 120),
        y: this.padding + 60 + Math.random() * (this.height - this.padding * 2 - 120),
        type: 'HEAL',
        radius: 14
      });
      this.crateSpawnTimer = 10.0;
    }
  }

  // Constrain robot inside arena perimeter and deal laser wall bounce damage
  constrainBot(bot) {
    const minX = this.padding + 24;
    const maxX = this.width - this.padding - 24;
    const minY = this.padding + 24;
    const maxY = this.height - this.padding - 24;

    if (bot.pos.x < minX) { bot.pos.x = minX; bot.vel.x = Math.abs(bot.vel.x) * 0.5; }
    if (bot.pos.x > maxX) { bot.pos.x = maxX; bot.vel.x = -Math.abs(bot.vel.x) * 0.5; }
    if (bot.pos.y < minY) { bot.pos.y = minY; bot.vel.y = Math.abs(bot.vel.y) * 0.5; }
    if (bot.pos.y > maxY) { bot.pos.y = maxY; bot.vel.y = -Math.abs(bot.vel.y) * 0.5; }
  }

  draw(ctx, animTime) {
    // 1. Arena Cyber Grid Floor
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = this.padding; x <= this.width - this.padding; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, this.padding);
      ctx.lineTo(x, this.height - this.padding);
      ctx.stroke();
    }
    for (let y = this.padding; y <= this.height - this.padding; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(this.padding, y);
      ctx.lineTo(this.width - this.padding, y);
      ctx.stroke();
    }

    // 2. Center Ring Decal
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.width / 2, this.height / 2, 90, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Pulsing Neon Laser Perimeter Wall
    const wallGlow = 0.5 + 0.5 * Math.sin(animTime * 4);
    ctx.strokeStyle = `rgba(239, 68, 68, ${wallGlow * 0.8})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(this.padding, this.padding, this.width - this.padding * 2, this.height - this.padding * 2);

    // 4. Corner Warning Stripes
    ctx.fillStyle = '#facc15';
    [[this.padding, this.padding], [this.width - this.padding - 20, this.padding], [this.padding, this.height - this.padding - 20], [this.width - this.padding - 20, this.height - this.padding - 20]].forEach(([cx, cy]) => {
      ctx.fillRect(cx, cy, 20, 20);
    });

    // 5. Spinning Saw Floor Hazards
    this.hazards.forEach(h => {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, h.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 6. Repair Crates
    this.crates.forEach(c => {
      ctx.fillStyle = '#10b981';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.fillRect(c.x - c.radius, c.y - c.radius, c.radius * 2, c.radius * 2);
      ctx.strokeRect(c.x - c.radius, c.y - c.radius, c.radius * 2, c.radius * 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('➕', c.x, c.y + 1);
    });
  }
}
