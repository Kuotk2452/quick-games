/**
 * 3D Item Models & Combat Logic for Dungeon Claw
 * Handles 3D procedural meshes, stats, effects, and combo synergies.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const ITEM_DEFS = {
  SWORD: {
    id: 'SWORD',
    name: { en: 'Iron Sword', zh: '铁剑', es: 'Espada de Hierro', ja: '鉄の剣' },
    type: 'ATTACK',
    icon: '🗡️',
    color: 0x94a3b8,
    radius: 0.45,
    weight: 1.0,
    value: 15, // Damage
    desc: { en: 'Deals 15 Physical Damage', zh: '造成 15 点物理伤害', es: 'Causa 15 de daño físico', ja: '15の物理ダメージを与える' }
  },
  FIRE_SWORD: {
    id: 'FIRE_SWORD',
    name: { en: 'Flame Greatsword', zh: '烈焰巨剑', es: 'Gran Espada de Fuego', ja: '炎の大剣' },
    type: 'ATTACK',
    icon: '🔥',
    color: 0xf97316,
    radius: 0.55,
    weight: 1.2,
    value: 32,
    desc: { en: 'Deals 32 Flaming Damage', zh: '造成 32 点烈焰暴击伤害', es: 'Causa 32 de daño ígneo', ja: '32の火炎ダメージを与える' }
  },
  SHIELD: {
    id: 'SHIELD',
    name: { en: 'Steel Shield', zh: '坚钢之盾', es: 'Escudo de Acero', ja: '鋼の盾' },
    type: 'DEFENSE',
    icon: '🛡️',
    color: 0x38bdf8,
    radius: 0.45,
    weight: 1.1,
    value: 14, // Armor block
    desc: { en: 'Grants +14 Armor', zh: '获得 +14 点护甲格挡', es: 'Otorga +14 de armadura', ja: 'アーマー +14 を獲得' }
  },
  GOLD_SHIELD: {
    id: 'GOLD_SHIELD',
    name: { en: 'Aegis of Radiance', zh: '圣光壁垒', es: 'Égida Radiante', ja: '聖なる盾' },
    type: 'DEFENSE',
    icon: '👑',
    color: 0xfacc15,
    radius: 0.55,
    weight: 1.3,
    value: 28,
    desc: { en: 'Grants +28 Armor', zh: '获得 +28 点强力护甲', es: 'Otorga +28 de armadura', ja: 'アーマー +28 を獲得' }
  },
  POTION: {
    id: 'POTION',
    name: { en: 'Health Elixir', zh: '生命药水', es: 'Elixir de Vida', ja: '回復ポーション' },
    type: 'HEAL',
    icon: '🧪',
    color: 0xef4444,
    radius: 0.4,
    weight: 0.8,
    value: 20, // Heal
    desc: { en: 'Restores +20 HP', zh: '恢复 +20 点生命值', es: 'Restaura +20 PS', ja: 'HPを +20 回復' }
  },
  BOMB: {
    id: 'BOMB',
    name: { en: 'Dungeon Bomb', zh: '地牢炸弹', es: 'Bomba de Mazmorra', ja: 'ダンジョン爆弾' },
    type: 'AOE_ATTACK',
    icon: '💣',
    color: 0x334155,
    radius: 0.5,
    weight: 1.5,
    value: 38,
    desc: { en: 'Deals 38 AOE Damage', zh: '造成 38 点巨额爆炸伤害', es: 'Causa 38 de daño en área', ja: '38の全体爆発ダメージ' }
  },
  THUNDER_ORB: {
    id: 'THUNDER_ORB',
    name: { en: 'Lightning Orb', zh: '雷霆法球', es: 'Orbe de Rayo', ja: '雷の宝珠' },
    type: 'STUN_ATTACK',
    icon: '⚡',
    color: 0xa855f7,
    radius: 0.42,
    weight: 0.9,
    value: 22,
    desc: { en: 'Deals 22 Damage & Stuns Enemy', zh: '造成 22 伤害并眩晕敌人 1 回合', es: 'Causa 22 de daño y aturde', ja: '22ダメージを与え敵を気絶' }
  },
  COIN: {
    id: 'COIN',
    name: { en: 'Gold Pouch', zh: '金币袋', es: 'Bolsa de Oro', ja: 'ゴールド袋' },
    type: 'GOLD',
    icon: '💰',
    color: 0xfbbf24,
    radius: 0.35,
    weight: 0.7,
    value: 12,
    desc: { en: 'Collect +12 Gold', zh: '收集 +12 枚金币', es: 'Recoge +12 de oro', ja: 'ゴールド +12 を獲得' }
  },
  SKULL: {
    id: 'SKULL',
    name: { en: 'Cursed Skull', zh: '诅咒头骨', es: 'Cráneo Maldito', ja: '呪いの頭骨' },
    type: 'CURSE',
    icon: '☠️',
    color: 0x881337,
    radius: 0.45,
    weight: 1.0,
    value: -12,
    desc: { en: 'Cursed! Deals 12 damage to YOU', zh: '诅咒物！对玩家自身造成 12 点伤害', es: '¡Maldición! Te causa 12 de daño', ja: '呪い！自分に12ダメージ' }
  }
};

/**
 * Creates 3D Procedural Mesh with Materials for Three.js
 */
export function createItem3DMesh(itemDef) {
  const group = new THREE.Group();

  if (itemDef.id === 'SWORD' || itemDef.id === 'FIRE_SWORD') {
    // 3D Sword Mesh
    const bladeGeo = new THREE.BoxGeometry(0.12, 0.7, 0.05);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: itemDef.id === 'FIRE_SWORD' ? 0xff4400 : 0xd1d5db,
      metalness: 0.9,
      roughness: 0.2,
      emissive: itemDef.id === 'FIRE_SWORD' ? 0xff2200 : 0x000000,
      emissiveIntensity: 0.5
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.2;
    group.add(blade);

    // Guard
    const guardGeo = new THREE.BoxGeometry(0.35, 0.06, 0.08);
    const guardMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, metalness: 0.8 });
    const guard = new THREE.Mesh(guardGeo, guardMat);
    guard.position.y = -0.15;
    group.add(guard);

    // Hilt
    const hiltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8);
    const hiltMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const hilt = new THREE.Mesh(hiltGeo, hiltMat);
    hilt.position.y = -0.28;
    group.add(hilt);
  } else if (itemDef.id === 'SHIELD' || itemDef.id === 'GOLD_SHIELD') {
    // 3D Shield Disc
    const geo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: itemDef.color,
      metalness: 0.8,
      roughness: 0.3,
      emissive: itemDef.id === 'GOLD_SHIELD' ? 0xca8a04 : 0x000000,
      emissiveIntensity: 0.3
    });
    const shield = new THREE.Mesh(geo, mat);
    shield.rotation.x = Math.PI / 2;
    group.add(shield);
  } else if (itemDef.id === 'POTION') {
    // 3D Flask Bottle
    const bodyGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      emissive: 0xef4444,
      emissiveIntensity: 0.4
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    const neckGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.18, 12);
    const neckMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.y = 0.3;
    group.add(neck);

    const corkGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.1, 8);
    const corkMat = new THREE.MeshStandardMaterial({ color: 0xa16207 });
    const cork = new THREE.Mesh(corkGeo, corkMat);
    cork.position.y = 0.42;
    group.add(cork);
  } else if (itemDef.id === 'BOMB') {
    // 3D Bomb Sphere
    const geo = new THREE.SphereGeometry(0.32, 16, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.4 });
    const sphere = new THREE.Mesh(geo, mat);
    group.add(sphere);

    const fuseGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8);
    const fuseMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xff0000, emissiveIntensity: 0.8 });
    const fuse = new THREE.Mesh(fuseGeo, fuseMat);
    fuse.position.y = 0.35;
    group.add(fuse);
  } else if (itemDef.id === 'THUNDER_ORB') {
    // Glowing Magic Orb
    const geo = new THREE.IcosahedronGeometry(0.32, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xa855f7,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      wireframe: false
    });
    const orb = new THREE.Mesh(geo, mat);
    group.add(orb);
  } else if (itemDef.id === 'COIN') {
    // Gold Coin
    const geo = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.95, roughness: 0.1 });
    const coin = new THREE.Mesh(geo, mat);
    coin.rotation.x = Math.PI / 4;
    group.add(coin);
  } else {
    // Cursed Skull Polyhedron
    const geo = new THREE.DodecahedronGeometry(0.32);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x4c0519,
      emissive: 0x9f1239,
      emissiveIntensity: 0.6,
      roughness: 0.7
    });
    const skull = new THREE.Mesh(geo, mat);
    group.add(skull);
  }

  group.castShadow = true;
  group.receiveShadow = true;
  group.userData = { def: itemDef };
  return group;
}

/**
 * Calculates Combo Synergies when multiple items are activated in one grab
 */
export function calculateCombos(grabbedItems) {
  let totalDamage = 0;
  let totalArmor = 0;
  let totalHeal = 0;
  let totalGold = 0;
  let stunsEnemy = false;
  let comboDescription = [];

  const counts = {};
  for (const item of grabbedItems) {
    counts[item.id] = (counts[item.id] || 0) + 1;
    if (item.type === 'ATTACK' || item.type === 'AOE_ATTACK') totalDamage += item.value;
    else if (item.type === 'DEFENSE') totalArmor += item.value;
    else if (item.type === 'HEAL') totalHeal += item.value;
    else if (item.type === 'GOLD') totalGold += item.value;
    else if (item.type === 'STUN_ATTACK') {
      totalDamage += item.value;
      stunsEnemy = true;
    } else if (item.type === 'CURSE') {
      totalHeal += item.value; // Negative damage to player
    }
  }

  // Dual Wield Synergy (2+ Swords)
  if ((counts['SWORD'] || 0) + (counts['FIRE_SWORD'] || 0) >= 2) {
    totalDamage = Math.round(totalDamage * 1.5);
    comboDescription.push('⚔️ Dual Wield Slash (+50% DMG)');
  }

  // Blade + Bomb (Explosive Blade)
  if ((counts['SWORD'] || counts['FIRE_SWORD']) && counts['BOMB']) {
    totalDamage += 20;
    comboDescription.push('💥 Explosive Blade (+20 AOE DMG)');
  }

  // Shield Wall (2+ Shields)
  if ((counts['SHIELD'] || 0) + (counts['GOLD_SHIELD'] || 0) >= 2) {
    totalArmor = Math.round(totalArmor * 1.5);
    comboDescription.push('🛡️ Iron Fortress (+50% Armor)');
  }

  return {
    totalDamage,
    totalArmor,
    totalHeal,
    totalGold,
    stunsEnemy,
    comboText: comboDescription.join(' · ')
  };
}
