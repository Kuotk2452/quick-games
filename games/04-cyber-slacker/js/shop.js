/**
 * Desk Gadget & Slacker Black Market Upgrades for Cyber Slacker
 */

export const SLACKER_UPGRADES = [
  {
    id: 'REARVIEW_MIRROR',
    icon: '🪞',
    name: {
      en: 'Monitor Rearview Mirror',
      zh: '双显示器后视镜',
      es: 'Retrovisor de Monitor',
      ja: 'モニター用バックミラー'
    },
    desc: {
      en: 'Gives +1.5s extra visual and audio warning before boss enters your cubicle.',
      zh: '在老板踏入工位前提前 1.5 秒发出视觉与脚步预警。',
      es: 'Otorga +1.5s de advertencia antes de que el jefe entre.',
      ja: '上司が来る前に1.5秒早く足音と警告を表示。'
    },
    cost: 120,
    purchased: false,
    apply: (game) => {
      game.stealth.warningMultiplier += 0.45;
    }
  },
  {
    id: 'MECHANICAL_MACRO',
    icon: '⌨️',
    name: {
      en: 'Silent Auto-Typing Macro',
      zh: '静音自动敲键盘宏',
      es: 'Macro de Teclado Silencioso',
      ja: '自動タイピングマクロ'
    },
    desc: {
      en: 'Automatically generates typing sounds and +10 XP every 2 seconds.',
      zh: '自动产生打字白噪音，每 2 秒自动为你产生 +10 摸鱼点数。',
      es: 'Genera sonidos y +10 XP cada 2 segundos automáticamente.',
      ja: 'キーボード音を自動再生し、2秒ごとに+10 XPを獲得。'
    },
    cost: 200,
    purchased: false,
    apply: (game) => {
      game.autoXpPerSec += 5;
    }
  },
  {
    id: 'PRIVACY_SCREEN',
    icon: '🕶️',
    name: {
      en: 'Polarized Privacy Filter',
      zh: '偏光防窥贴膜',
      es: 'Filtro de Privacidad Polarizado',
      ja: 'プライバシー保護フィルム'
    },
    desc: {
      en: 'Slows boss suspicion accumulation rate by 50%.',
      zh: '大幅缩小可视角度，老板警戒值累积速度降低 50%。',
      es: 'Reduce la velocidad de sospecha del jefe en un 50%.',
      ja: '上司の警戒度上昇スピードを 50% 緩和。'
    },
    cost: 350,
    purchased: false,
    apply: (game) => {
      game.suspicionRateMultiplier *= 0.5;
    }
  },
  {
    id: 'COLD_BREW_IV',
    icon: '☕',
    name: {
      en: 'Nitro Cold Brew IV Drip',
      zh: '冷萃咖啡点滴架',
      es: 'Goteo de Café Frío IV',
      ja: '水出しアイスコーヒー点滴'
    },
    desc: {
      en: 'Increases all trading profits and slacking XP gain by +50%.',
      zh: '极大振奋神经，所有炒币收益与摸鱼经验获取永久提升 +50%。',
      es: 'Aumenta todas las ganancias y XP en un +50%.',
      ja: 'すべてのトレード利益と獲得XPが +50% 増加。'
    },
    cost: 500,
    purchased: false,
    apply: (game) => {
      game.xpMultiplier *= 1.5;
    }
  },
  {
    id: 'AI_ZOOM_CLONE',
    icon: '🤖',
    name: {
      en: 'AI Zoom Meeting Clone',
      zh: 'AI 替身开会机器人',
      es: 'Clon de Reunión Zoom IA',
      ja: 'AI身代わりオンライン会議ボット'
    },
    desc: {
      en: 'Grants +$1,000 corporate bonus whenever boss catches you disguised in Excel.',
      zh: '每次伪装骗过老板时额外获得 +$1,000 高管绩效红包！',
      es: 'Otorga +$1,000 adicionales al engañar al jefe.',
      ja: 'ボスを騙すたびに追加で +$1,000 の特別役員ボーナスを獲得！'
    },
    cost: 800,
    purchased: false,
    apply: (game) => {
      game.praiseBonus += 1000;
    }
  }
];
