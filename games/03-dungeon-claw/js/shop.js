/**
 * Black Market Shop & Claw Upgrade System for Dungeon Claw
 * Handles between-floor rewards, claw stat upgrades, and item inventory purchases.
 */

import { ITEM_DEFS } from './items.js';

export const CLAW_UPGRADES = [
  {
    id: 'MAGNETIC_GRIP',
    icon: '🧲',
    name: { en: 'Magnetic Prongs', zh: '磁力吸爪', es: 'Pinzas Magnéticas', ja: 'マグネット爪' },
    desc: {
      en: '+30% Claw Grip Strength (less likely to slip, wider catch radius).',
      zh: '机械爪握力 +30%，更难滑脱，抓取范围更大。',
      es: '+30% de fuerza de agarre (menos deslizamiento, mayor radio).',
      ja: '爪のグリップ力 +30%（滑りにくく範囲拡大）。'
    },
    cost: 30,
    apply: (gameState) => {
      gameState.physics.claw.gripStrength += 0.3;
    }
  },
  {
    id: 'TURBO_WINCH',
    icon: '⚡',
    name: { en: 'Turbo Winch', zh: '涡轮液压绞盘', es: 'Cabrestante Turbo', ja: 'ターボウインチ' },
    desc: {
      en: '+35% Crane Lower & Lift Speed.',
      zh: '机械臂下放与收回速度提升 35%。',
      es: '+35% de velocidad de subida y bajada de la grúa.',
      ja: 'クレーンの昇降速度が 35% 向上。'
    },
    cost: 25,
    apply: (gameState) => {
      gameState.physics.claw.dropSpeed *= 1.35;
      gameState.physics.claw.liftSpeed *= 1.35;
    }
  },
  {
    id: 'EXTRA_ENERGY',
    icon: '🔋',
    name: { en: 'Hydraulic Battery', zh: '液压储能电池', es: 'Batería Hidráulica', ja: '拡張バッテリー' },
    desc: {
      en: '+1 Max Claw Drop per turn (total 4 grabs per round).',
      zh: '每回合最大抓取次数 +1（每回合可下爪 4 次）。',
      es: '+1 intento de garra por turno (total 4 por ronda).',
      ja: '1ターンあたりの最大爪回数 +1（計4回）。'
    },
    cost: 55,
    apply: (gameState) => {
      gameState.maxEnergy += 1;
      gameState.energy += 1;
    }
  },
  {
    id: 'TITAN_BLOOD',
    icon: '💖',
    name: { en: 'Titan Elixir', zh: '泰坦神药', es: 'Elixir de Titán', ja: '巨人の霊薬' },
    desc: {
      en: '+35 Max HP & immediately heal to 100%.',
      zh: '最大生命值 +35，并立即回满全部生命。',
      es: '+35 PS máximos y cura al 100% inmediatamente.',
      ja: '最大HP +35、HP全回復。'
    },
    cost: 35,
    apply: (gameState) => {
      gameState.maxHp += 35;
      gameState.hp = gameState.maxHp;
    }
  }
];

export const ITEM_SHOP_OFFERS = [
  { itemDef: ITEM_DEFS.FIRE_SWORD, cost: 22 },
  { itemDef: ITEM_DEFS.GOLD_SHIELD, cost: 20 },
  { itemDef: ITEM_DEFS.BOMB, cost: 18 },
  { itemDef: ITEM_DEFS.THUNDER_ORB, cost: 24 },
  { itemDef: ITEM_DEFS.POTION, cost: 15 }
];
