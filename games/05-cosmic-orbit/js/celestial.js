/**
 * 11-Tier Celestial Bodies Definition & 2D Canvas Procedural Visualizer
 */

export const CELESTIAL_TIERS = [
  {
    tier: 1,
    name: { en: 'Meteorite', zh: '微型陨石', es: 'Meteorito', ja: '隕石' },
    icon: '☄️',
    radius: 12,
    mass: 1.0,
    baseColor: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.4)',
    score: 10
  },
  {
    tier: 2,
    name: { en: 'Lunar Moon', zh: '月球', es: 'Luna', ja: '月' },
    icon: '🌕',
    radius: 16,
    mass: 1.8,
    baseColor: '#cbd5e1',
    glowColor: 'rgba(203, 213, 225, 0.4)',
    score: 25
  },
  {
    tier: 3,
    name: { en: 'Mars', zh: '火星', es: 'Marte', ja: '火星' },
    icon: '🔴',
    radius: 20,
    mass: 3.2,
    baseColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    score: 50
  },
  {
    tier: 4,
    name: { en: 'Terra (Earth)', zh: '地球', es: 'Tierra', ja: '地球' },
    icon: '🌍',
    radius: 25,
    mass: 5.5,
    baseColor: '#0284c7',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    score: 100
  },
  {
    tier: 5,
    name: { en: 'Neptune', zh: '海王星', es: 'Neptuno', ja: '海王星' },
    icon: '🌊',
    radius: 30,
    mass: 9.0,
    baseColor: '#38bdf8',
    glowColor: 'rgba(14, 165, 233, 0.6)',
    score: 200
  },
  {
    tier: 6,
    name: { en: 'Saturn', zh: '土星 (光环)', es: 'Saturno', ja: '土星' },
    icon: '🪐',
    radius: 36,
    mass: 14.0,
    baseColor: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    hasRings: true,
    score: 400
  },
  {
    tier: 7,
    name: { en: 'Jupiter', zh: '木星', es: 'Júpiter', ja: '木星' },
    icon: '⚡',
    radius: 43,
    mass: 22.0,
    baseColor: '#fb923c',
    glowColor: 'rgba(251, 146, 60, 0.6)',
    hasBands: true,
    score: 800
  },
  {
    tier: 8,
    name: { en: 'Solar Star', zh: '恒星太阳', es: 'Sol', ja: '恒星（太陽）' },
    icon: '☀️',
    radius: 51,
    mass: 35.0,
    baseColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.8)',
    isStar: true,
    score: 1600
  },
  {
    tier: 9,
    name: { en: 'Blue Giant', zh: '蓝巨星', es: 'Gigante Azul', ja: '青色巨星' },
    icon: '💥',
    radius: 60,
    mass: 55.0,
    baseColor: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.85)',
    isStar: true,
    score: 3200
  },
  {
    tier: 10,
    name: { en: 'Supernova Pulsar', zh: '超新星脉冲星', es: 'Supernova', ja: 'パルサー超新星' },
    icon: '🌌',
    radius: 70,
    mass: 85.0,
    baseColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.9)',
    hasJets: true,
    score: 6400
  },
  {
    tier: 11,
    name: { en: 'Quasar Singularity', zh: '终极类星体黑洞', es: 'Singularidad Cuásar', ja: 'クエーサー特異点' },
    icon: '🕳️',
    radius: 82,
    mass: 150.0,
    baseColor: '#090d16',
    glowColor: 'rgba(236, 72, 153, 0.95)',
    isQuasar: true,
    score: 15000
  }
];

export function drawCelestialBody(ctx, body, animTime = 0) {
  const def = CELESTIAL_TIERS[body.tier - 1];
  const { x, y } = body.pos;
  const r = def.radius;

  ctx.save();
  ctx.translate(x, y);

  // 1. Atmosphere / Corona Glow
  const glowGrad = ctx.createRadialGradient(0, 0, r * 0.7, 0, 0, r * 1.6);
  glowGrad.addColorStop(0, def.glowColor);
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
  ctx.fill();

  // 2. Main Planet Sphere
  const sphereGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  if (def.isQuasar) {
    sphereGrad.addColorStop(0, '#ec4899');
    sphereGrad.addColorStop(0.3, '#3b0764');
    sphereGrad.addColorStop(0.8, '#05050a');
    sphereGrad.addColorStop(1, '#000000');
  } else if (def.isStar) {
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.4, def.baseColor);
    sphereGrad.addColorStop(1, '#9a3412');
  } else {
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.2, def.baseColor);
    sphereGrad.addColorStop(1, '#0f172a');
  }

  ctx.fillStyle = sphereGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // 3. Special Features (Rings / Bands / Solar Flares / Jets)
  if (def.hasRings) {
    // Saturn's Ring System
    ctx.save();
    ctx.rotate(0.35);
    ctx.scale(1.8, 0.45);
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (def.hasJets) {
    // Pulsar Gamma-Ray Beams
    ctx.save();
    ctx.rotate(animTime * 2.5);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -r * 2.2);
    ctx.lineTo(0, r * 2.2);
    ctx.stroke();
    ctx.restore();
  }

  if (def.isQuasar) {
    // Glowing Accretion Ring
    ctx.save();
    ctx.rotate(animTime * 3);
    ctx.strokeStyle = '#f43f5e';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 4. Planet Icon / Emoji center stamp
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.round(r * 0.7)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(def.icon, 0, 1);

  ctx.restore();
}
