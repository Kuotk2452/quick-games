/**
 * 3D Monster Bosses & Dungeon Encounters for Dungeon Claw
 * Handles enemy stats, combat intents, 3D animated meshes, and floor progression.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const MONSTER_ROSTER = [
  {
    floor: 1,
    id: 'SLIME_KING',
    name: { en: 'Slime King', zh: '史莱姆之王', es: 'Rey Slime', ja: 'スライムキング' },
    maxHp: 65,
    icon: '👑🟢',
    color: 0x22c55e,
    actions: [
      { type: 'ATTACK', value: 10, icon: '⚔️ 10' },
      { type: 'DEFEND', value: 8, icon: '🛡️ +8' },
      { type: 'ATTACK', value: 14, icon: '⚔️ 14' }
    ]
  },
  {
    floor: 2,
    id: 'SKELETON_WARRIOR',
    name: { en: 'Skeleton Knight', zh: '骷髅骑士', es: 'Caballero Esqueleto', ja: 'ガイコツ騎士' },
    maxHp: 95,
    icon: '💀⚔️',
    color: 0xe2e8f0,
    actions: [
      { type: 'ATTACK', value: 14, icon: '⚔️ 14' },
      { type: 'CURSE', value: 1, icon: '☠️ +Skull' },
      { type: 'ATTACK', value: 18, icon: '⚔️ 18' }
    ]
  },
  {
    floor: 3,
    id: 'GOBLIN_SHAMAN',
    name: { en: 'Goblin Shaman', zh: '哥布林萨满', es: 'Chamán Goblin', ja: 'ゴブリンシャーマン' },
    maxHp: 130,
    icon: '👺🔮',
    color: 0xf59e0b,
    actions: [
      { type: 'ATTACK', value: 16, icon: '⚔️ 16' },
      { type: 'DEFEND', value: 14, icon: '🛡️ +14' },
      { type: 'CURSE', value: 2, icon: '☠️ +2 Skulls' }
    ]
  },
  {
    floor: 4,
    id: 'STONE_GOLEM',
    name: { en: 'Stone Golem', zh: '岩石傀儡', es: 'Gólem de Piedra', ja: 'ストーンゴーレム' },
    maxHp: 180,
    icon: '🪨',
    color: 0x78716c,
    actions: [
      { type: 'DEFEND', value: 22, icon: '🛡️ +22' },
      { type: 'ATTACK', value: 24, icon: '⚔️ 24' },
      { type: 'ATTACK', value: 28, icon: '⚔️ 28' }
    ]
  },
  {
    floor: 5,
    id: 'VAMPIRE_LORD',
    name: { en: 'Vampire Lord', zh: '吸血鬼领主', es: 'Señor Vampiro', ja: 'ヴァンパイアロード' },
    maxHp: 230,
    icon: '🦇🧛',
    color: 0x881337,
    actions: [
      { type: 'ATTACK', value: 20, icon: '⚔️ 20 (Drain)' },
      { type: 'CURSE', value: 2, icon: '☠️ Curse' },
      { type: 'ATTACK', value: 26, icon: '⚔️ 26' }
    ]
  },
  {
    floor: 6,
    id: 'ANCIENT_DRAGON',
    name: { en: 'Ancient Inferno Dragon', zh: '远古深渊红龙', es: 'Dragón del Infierno', ja: 'エンシェントドラゴン' },
    maxHp: 380,
    icon: '🐲🔥',
    color: 0xdc2626,
    isBoss: true,
    actions: [
      { type: 'ATTACK', value: 28, icon: '🔥 28 Breath' },
      { type: 'CURSE', value: 3, icon: '☠️ Hellfire' },
      { type: 'ATTACK', value: 36, icon: '🔥 36 Nuke' }
    ]
  }
];

export class Monster {
  constructor(rosterEntry) {
    this.def = rosterEntry;
    this.hp = rosterEntry.maxHp;
    this.maxHp = rosterEntry.maxHp;
    this.armor = 0;
    this.actionIndex = 0;
    this.mesh = this.create3DMesh();
  }

  getCurrentIntent() {
    return this.def.actions[this.actionIndex % this.def.actions.length];
  }

  takeDamage(amount) {
    let unblocked = amount;
    if (this.armor > 0) {
      if (this.armor >= unblocked) {
        this.armor -= unblocked;
        unblocked = 0;
      } else {
        unblocked -= this.armor;
        this.armor = 0;
      }
    }
    this.hp = Math.max(0, this.hp - unblocked);
    return unblocked;
  }

  nextTurn() {
    this.actionIndex++;
    this.armor = 0; // Reset armor at start of turn
  }

  create3DMesh() {
    const group = new THREE.Group();
    const isDragon = this.def.id === 'ANCIENT_DRAGON';

    // Core body mesh
    const geo = isDragon ? new THREE.DodecahedronGeometry(1.2, 1) : new THREE.IcosahedronGeometry(0.9, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: this.def.color,
      roughness: 0.3,
      metalness: 0.2,
      emissive: this.def.color,
      emissiveIntensity: 0.3
    });
    const body = new THREE.Mesh(geo, mat);
    body.castShadow = true;
    group.add(body);

    // Glowing Horns / Crown
    const hornGeo = new THREE.ConeGeometry(0.2, 0.6, 6);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.6 });

    const hornL = new THREE.Mesh(hornGeo, hornMat);
    hornL.position.set(-0.45, 0.9, 0);
    hornL.rotation.z = -0.3;
    group.add(hornL);

    const hornR = new THREE.Mesh(hornGeo, hornMat);
    hornR.position.set(0.45, 0.9, 0);
    hornR.rotation.z = 0.3;
    group.add(hornR);

    group.position.set(0, 1.2, -3.2);
    return group;
  }
}
