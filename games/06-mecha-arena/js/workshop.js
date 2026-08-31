/**
 * Modular Mecha Workshop: Parts Definitions & 2D Canvas Procedural Rendering
 */

export const CHASSIS_PARTS = [
  {
    id: 'HOVER',
    name: { en: 'Hover Skimmer', zh: '悬浮高速底盘', es: 'Planeador Hover', ja: 'ホバー浮遊脚部' },
    icon: '🏎️',
    maxHp: 100,
    speed: 310,
    rotationSpeed: 4.8,
    recoilAbsorb: 0.2,
    baseColor: '#00f0ff',
    cost: 0,
    unlocked: true
  },
  {
    id: 'TANK',
    name: { en: 'Heavy Tread Tank', zh: '重装履带坦克', es: 'Tanque Oruga', ja: '重装キャタピラ' },
    icon: '🚜',
    maxHp: 240,
    speed: 185,
    rotationSpeed: 3.2,
    recoilAbsorb: 0.85,
    baseColor: '#f59e0b',
    cost: 300,
    unlocked: false
  },
  {
    id: 'SPIDER',
    name: { en: 'Spider Quad Legs', zh: '四足全地形蜘蛛', es: 'Cuadrúpedo Araña', ja: '4脚スパイダー' },
    icon: '🕷️',
    maxHp: 170,
    speed: 240,
    rotationSpeed: 4.0,
    recoilAbsorb: 0.55,
    baseColor: '#10b981',
    cost: 600,
    unlocked: false
  }
];

export const WEAPON_PARTS = [
  {
    id: 'GATLING',
    name: { en: 'Gatling Vulcan', zh: '六管加特林重机枪', es: 'Vulcan Gatling', ja: 'ガトリング重機関砲' },
    icon: '💥',
    type: 'BULLET',
    damage: 8,
    fireRate: 0.1, // seconds per shot (10 shots/sec)
    range: 300,
    color: '#facc15',
    recoil: 35,
    cost: 0,
    unlocked: true
  },
  {
    id: 'LASER',
    name: { en: 'Twin Pulse Laser', zh: '双联穿透激光炮', es: 'Láser de Pulso Doble', ja: 'ツインパルスレーザー' },
    icon: '🔫',
    type: 'BEAM',
    damage: 32,
    fireRate: 0.45,
    range: 380,
    color: '#00f0ff',
    recoil: 15,
    cost: 250,
    unlocked: false
  },
  {
    id: 'SAW',
    name: { en: 'Overclock Plasma Saw', zh: '超频等离子电锯', es: 'Sierra de Plasma', ja: 'プラズマ回転ノコギリ' },
    icon: '🪚',
    type: 'MELEE',
    damage: 18,
    fireRate: 0.12,
    range: 52,
    color: '#ef4444',
    recoil: 0,
    cost: 450,
    unlocked: false
  },
  {
    id: 'TESLA',
    name: { en: 'Tesla Arc Emitter', zh: '高压特斯拉电磁炮', es: 'Emisor de Arco Tesla', ja: 'テスラ高圧放電砲' },
    icon: '⚡',
    type: 'ELECTRIC',
    damage: 24,
    fireRate: 0.35,
    range: 240,
    color: '#a855f7',
    recoil: 20,
    cost: 700,
    unlocked: false
  }
];

export const MODULE_PARTS = [
  {
    id: 'SHIELD',
    name: { en: 'Kinetic Barrier', zh: '动能充能护盾', es: 'Barrera Cinética', ja: 'キネティックシールド' },
    icon: '🛡️',
    duration: 3.2,
    cooldown: 8.0,
    desc: 'Absorbs all incoming projectile damage for 3.2 seconds.',
    cost: 0,
    unlocked: true
  },
  {
    id: 'NITRO',
    name: { en: 'Nitro Ram Thruster', zh: '超载氮气冲刺', es: 'Propulsor Nitro', ja: 'ニトロダッシュラム' },
    icon: '🚀',
    duration: 0.5,
    dashSpeed: 520,
    cooldown: 5.5,
    desc: 'High-speed ramming dash that violently knocks back enemies.',
    cost: 350,
    unlocked: false
  },
  {
    id: 'MINE',
    name: { en: 'EMP Shock Mines', zh: '电磁破片地雷', es: 'Minas de Choque EMP', ja: 'EMP地雷散布' },
    icon: '💣',
    count: 3,
    cooldown: 7.0,
    desc: 'Deploys 3 explosive proximity mines behind you.',
    cost: 500,
    unlocked: false
  }
];

/**
 * Procedural 2D Mecha Canvas Renderer
 */
export function drawMecha(ctx, mecha, animTime = 0) {
  const { pos, angle, turretAngle, chassisId, weaponId, shieldActive } = mecha;
  const chassis = CHASSIS_PARTS.find(c => c.id === chassisId) || CHASSIS_PARTS[0];
  const weapon = WEAPON_PARTS.find(w => w.id === weaponId) || WEAPON_PARTS[0];

  ctx.save();
  ctx.translate(pos.x, pos.y);

  // 1. Draw Chassis Base (Rotated to body movement angle)
  ctx.save();
  ctx.rotate(angle);

  if (chassisId === 'HOVER') {
    // Glowing Hover Skimmer Ring
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = chassis.baseColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Thruster exhaust glow
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(-22, 0, 6 + Math.sin(animTime * 15) * 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (chassisId === 'TANK') {
    // Heavy Dual Tank Treads
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-22, -26, 44, 10);
    ctx.fillRect(-22, 16, 44, 10);
    ctx.fillStyle = '#64748b';
    for (let i = -18; i <= 18; i += 7) {
      ctx.fillRect(i, -26, 3, 10);
      ctx.fillRect(i, 16, 3, 10);
    }
    // Heavy Hull
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = chassis.baseColor;
    ctx.lineWidth = 3;
    ctx.fillRect(-18, -16, 36, 32);
    ctx.strokeRect(-18, -16, 36, 32);
  } else {
    // Spider 4 Legs
    ctx.strokeStyle = chassis.baseColor;
    ctx.lineWidth = 4;
    [[-18, -18, -28, -28], [18, -18, 28, -28], [-18, 18, -28, 28], [18, 18, 28, 28]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2 + Math.sin(animTime * 8) * 4, y2);
      ctx.stroke();
    });
    // Core body
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  // 2. Draw Mounted Weapon Turret (Rotated to Turret Aim Angle)
  ctx.save();
  ctx.rotate(turretAngle);

  // Armored Cockpit Dome
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Weapon Barrel / Saw System
  if (weapon.id === 'GATLING') {
    ctx.fillStyle = '#334155';
    ctx.fillRect(10, -5, 20, 10);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(30, -4, 4, 8);
  } else if (weapon.id === 'LASER') {
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(10, -7, 24, 4);
    ctx.fillRect(10, 3, 24, 4);
  } else if (weapon.id === 'SAW') {
    ctx.fillStyle = '#ef4444';
    ctx.save();
    ctx.translate(26, 0);
    ctx.rotate(animTime * 25);
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  } else if (weapon.id === 'TESLA') {
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(10, -4, 18, 8);
    ctx.strokeStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(28, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  // 3. Shield Dome if active
  if (shieldActive) {
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 4. Health Bar Above Robot
  const hpRatio = Math.max(0, mecha.hp / mecha.maxHp);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(-24, -36, 48, 6);
  ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : hpRatio > 0.25 ? '#facc15' : '#ef4444';
  ctx.fillRect(-23, -35, 46 * hpRatio, 4);

  ctx.restore();
}
