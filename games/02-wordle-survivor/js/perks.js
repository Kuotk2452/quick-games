/**
 * Roguelike Upgrade Perks System for Wordle Survivor
 * Provides level-up perks, synergies, and stat modifications.
 */

export const PERK_POOL = [
  {
    id: 'VOWEL_MAGNET',
    icon: '🧲',
    title: { en: 'Vowel Magnet', zh: '元音磁铁', es: 'Imán de Vocales', ja: '母音マグネット' },
    desc: {
      en: 'Vowels (A, E, I, O, U) are attracted from 2x farther away.',
      zh: '元音字母 (A, E, I, O, U) 吸收范围翻倍。',
      es: 'Las vocales se atraen desde el doble de distancia.',
      ja: '母音（A, E, I, O, U）の引き寄せ範囲が2倍になります。'
    },
    apply: (player) => {
      player.stats.vowelMagnet = true;
    }
  },
  {
    id: 'RACK_EXPANSION',
    icon: '📦',
    title: { en: 'Rack Expansion', zh: '词槽扩充', es: 'Expansión de Letras', ja: '文字スロット拡張' },
    desc: {
      en: 'Increases Spell Rack capacity by +1 (holds more letters).',
      zh: '拼字卡槽容量 +1，可容纳更多字母组合长单词。',
      es: 'Aumenta la capacidad del estante de letras en +1.',
      ja: '呪文スロットの上限が +1 増加します。'
    },
    apply: (player) => {
      player.stats.rackCapacity = Math.min(8, player.stats.rackCapacity + 1);
    }
  },
  {
    id: 'SPELL_AMPLIFIER',
    icon: '🔮',
    title: { en: 'Arcane Focus', zh: '秘法专注', es: 'Enfoque Arcano', ja: '秘術の集中' },
    desc: {
      en: 'Increases all word spell damage by +30%.',
      zh: '所有单词魔法伤害提升 +30%。',
      es: 'Aumenta el daño de todos los hechizos de palabras un +30%.',
      ja: 'すべての単語呪文の威力が +30% 増加します。'
    },
    apply: (player) => {
      player.stats.spellPower += 0.30;
    }
  },
  {
    id: 'HERMES_BOOTS',
    icon: '👟',
    title: { en: 'Hermes Boots', zh: '赫尔墨斯之靴', es: 'Botas de Hermes', ja: 'ヘルメスの靴' },
    desc: {
      en: 'Increases move speed by +20%.',
      zh: '玩家移动速度提升 +20%。',
      es: 'Aumenta la velocidad de movimiento un +20%.',
      ja: '移動速度が +20% 上昇します。'
    },
    apply: (player) => {
      player.stats.speed += 42;
    }
  },
  {
    id: 'SPARK_OVERCHARGE',
    icon: '⚡',
    title: { en: 'Wand Overcharge', zh: '法杖过载', es: 'Sobrecarga de Varita', ja: '杖の過充電' },
    desc: {
      en: 'Basic wand spark attack fires 35% faster and deals +50% damage.',
      zh: '基础魔杖射速提升 35%，伤害提升 +50%。',
      es: 'El ataque básico de varita dispara un 35% más rápido y causa un +50% de daño.',
      ja: '通常攻撃の射撃速度が35%向上し、威力が +50% 増加します。'
    },
    apply: (player) => {
      player.stats.sparkDamage = Math.round(player.stats.sparkDamage * 1.5);
      player.stats.attackRate = Math.max(0.2, player.stats.attackRate * 0.65);
    }
  },
  {
    id: 'MULTI_CAST',
    icon: '🪄',
    title: { en: 'Echo Wand', zh: '回响法杖', es: 'Varita de Eco', ja: 'エコーワンド' },
    desc: {
      en: 'Grants a 30% chance to cast every word spell twice.',
      zh: '每次释放单词魔法时有 30% 概率触发双重施法。',
      es: 'Otorga un 30% de probabilidad de lanzar cada hechizo dos veces.',
      ja: '呪文を唱えた時、30%の確率で2回連続発動します。'
    },
    apply: (player) => {
      player.stats.multiCastChance += 0.30;
    }
  },
  {
    id: 'SCRABBLE_JACKPOT',
    icon: '💎',
    title: { en: 'Scrabble Jackpot', zh: '稀有高分暴击', es: 'Bote de Scrabble', ja: 'スクラブル・ジャックポット' },
    desc: {
      en: 'Words containing Q, Z, X, J deal +100% Critical Overload damage.',
      zh: '包含高分稀有字母 (Q, Z, X, J) 的单词造成 +100% 超载暴击伤害。',
      es: 'Las palabras con Q, Z, X, J causan un +100% de daño crítico.',
      ja: '高難度文字（Q, Z, X, J）を含む単語のクリティカルダメージが +100% 増加。'
    },
    apply: (player) => {
      player.stats.spellPower += 0.2;
    }
  },
  {
    id: 'VITALITY_HEART',
    icon: '❤️',
    title: { en: 'Titan Heart', zh: '泰坦之心', es: 'Corazón de Titán', ja: 'タイタンの心臓' },
    desc: {
      en: '+50 Max HP and immediately restore full health.',
      zh: '最大生命值 +50，并立即回满全部生命值。',
      es: '+50 PS máximos y restaura toda la salud inmediatamente.',
      ja: '最大HPが +50 増加し、HPが全回復します。'
    },
    apply: (player) => {
      player.stats.maxHp += 50;
      player.stats.hp = player.stats.maxHp;
    }
  },
  {
    id: 'MAGNET_RING',
    icon: '💍',
    title: { en: 'Magnetic Ring', zh: '引力指环', es: 'Anillo Magnético', ja: '磁力リング' },
    desc: {
      en: '+60% item and letter collection pickup radius.',
      zh: '全物品与字母掉落物拾取范围提升 +60%。',
      es: '+60% de radio de recolección de objetos y letras.',
      ja: 'アイテムや文字の回収範囲が +60% 広がります。'
    },
    apply: (player) => {
      player.stats.magnetRadius += 65;
    }
  }
];

export function getRandomPerks(count = 3) {
  const shuffled = [...PERK_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
