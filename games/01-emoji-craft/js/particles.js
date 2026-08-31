/**
 * Canvas Particle & Visual Effects Engine (Juice Pack)
 * - Gold/Neon Particle Explosions
 * - Rainbow Expanding Shockwaves
 * - Floating Text Popups (+1 Discovery, RARE DISCOVERY!)
 * - Victory Confetti
 */

class ParticleEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.shockwaves = [];
    this.floatingTexts = [];
    this.animationFrame = null;
  }

  init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop = this.loop.bind(this);
    this.loop();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // 1. 常规合成金色火花
  burstAt(x, y, color = '#f59e0b', count = 35) {
    const colors = [color, '#fbbf24', '#38bdf8', '#a855f7', '#ec4899', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      const size = Math.random() * 6 + 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        shape: Math.random() > 0.5 ? 'circle' : 'star'
      });
    }
  }

  // 2. 史诗/稀有元素合成：炫彩冲击波 + 巨量星芒
  epicBurstAt(x, y) {
    this.burstAt(x, y, '#ec4899', 70);
    this.shockwaves.push({
      x,
      y,
      radius: 10,
      maxRadius: 160,
      alpha: 1,
      color: '#38bdf8',
      lineWidth: 8
    });
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: 200,
      alpha: 0.8,
      color: '#f59e0b',
      lineWidth: 5
    });
  }

  // 3. 浮空弹跳文字提示 (Floating Text)
  showFloatingText(x, y, text, color = '#f59e0b') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      scale: 0.6,
      vy: -2.2
    });
  }

  // 4. 满屏五彩纸屑
  confettiBurst() {
    if (!this.canvas) return;
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 5 + 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.007 + 0.003,
        shape: 'rect',
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12
      });
    }
  }

  loop() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 渲染冲击波 (Shockwaves)
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += 6;
      sw.alpha -= 0.035;

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, sw.alpha);
      this.ctx.strokeStyle = sw.color;
      this.ctx.lineWidth = sw.lineWidth;
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // 渲染普通粒子 (Particles)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'rect') {
        this.ctx.translate(p.x, p.y);
        p.rotation = (p.rotation || 0) + (p.rotSpeed || 2);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    // 渲染浮空文本 (Floating Texts)
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.scale = Math.min(1.2, ft.scale + 0.08);
      ft.alpha -= 0.02;

      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      this.ctx.fillStyle = ft.color;
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      this.ctx.shadowBlur = 10;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    }

    this.animationFrame = requestAnimationFrame(this.loop);
  }
}

export const particles = new ParticleEngine();
