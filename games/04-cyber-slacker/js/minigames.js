/**
 * Desktop Retro Slacker Mini-Games (Pixel Runner & Corporate Gossip Chat)
 */

import { slackerAudio } from './audio.js';

export class RetroRunnerGame {
  constructor(canvas, onEarnXp) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.onEarnXp = onEarnXp;
    this.playerY = 0;
    this.playerVy = 0;
    this.isGrounded = true;
    this.gravity = 1200;
    this.jumpForce = -420;
    this.obstacles = [];
    this.speed = 220;
    this.score = 0;
    this.spawnTimer = 1.5;
    this.active = false;
  }

  jump() {
    if (this.isGrounded) {
      this.playerVy = this.jumpForce;
      this.isGrounded = false;
      slackerAudio.playKeyClick();
    }
  }

  update(dt) {
    if (!this.active || !this.ctx) return;

    // Player physics
    if (!this.isGrounded) {
      this.playerVy += this.gravity * dt;
      this.playerY += this.playerVy * dt;

      if (this.playerY >= 0) {
        this.playerY = 0;
        this.playerVy = 0;
        this.isGrounded = true;
      }
    }

    // Spawn obstacles
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.obstacles.push({
        x: this.canvas.width + 20,
        type: Math.random() > 0.4 ? 'COFFEE' : 'PRINTER',
        width: 24,
        height: 28,
        scored: false
      });
      this.spawnTimer = 1.2 + Math.random() * 1.5;
    }

    // Update obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.speed * dt;

      // Check jump over / collection once
      if (obs.x < 50 && obs.x > 20 && this.playerY < -15 && !obs.scored) {
        obs.scored = true;
        this.score += 25;
        if (this.onEarnXp) this.onEarnXp(25);
      }

      if (obs.x < -30) {
        this.obstacles.splice(i, 1);
      }
    }

    this.draw();
  }

  draw() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const groundY = height - 30;

    ctx.clearRect(0, 0, width, height);

    // Retro Grid Floor
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Draw Player (Pixel Slacker)
    const px = 40;
    const py = groundY - 32 + this.playerY;
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(px, py, 22, 32);

    // Slacker Head & Tie
    ctx.fillStyle = '#facc15';
    ctx.fillRect(px + 4, py + 4, 14, 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(px + 9, py + 14, 4, 12);

    // Draw Obstacles
    this.obstacles.forEach((obs) => {
      if (obs.type === 'COFFEE') {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(obs.x, groundY - 24, 20, 24);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.fillText('☕', obs.x + 2, groundY - 8);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(obs.x, groundY - 28, 24, 28);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.fillText('🖨️', obs.x + 4, groundY - 10);
      }
    });

    // Score overlay
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`SLACK RUN: ${this.score} XP`, 10, 20);
  }
}

export const GOSSIP_MESSAGES = [
  {
    sender: 'DevDave 💻',
    text: 'Did anyone see the CEO’s new golf shirt? Looking like an NPC today lol',
    replies: [
      { text: '🤣 Total NPC energy (+25 XP)', xp: 25 },
      { text: '📈 He bought the dip on Doge (+30 XP)', xp: 30 }
    ]
  },
  {
    sender: 'DesignDan 🎨',
    text: 'HR just announced a mandatory team-building seminar on Friday 💀',
    replies: [
      { text: '🤐 I have a sudden dental emergency (+35 XP)', xp: 35 },
      { text: '☕ Free donuts in the breakroom though (+20 XP)', xp: 20 }
    ]
  },
  {
    sender: 'Sarah Marketing 📊',
    text: 'Who ate my oat milk from the mini-fridge?! It had my name on it!',
    replies: [
      { text: '🤫 It was for the greater corporate good (+40 XP)', xp: 40 },
      { text: '🥛 Blame the intern (+25 XP)', xp: 25 }
    ]
  }
];
