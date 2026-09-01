/**
 * Internationalization (i18n) Engine for Cosmic Orbit
 * Supports English (Default), Chinese, Spanish, Japanese.
 */

export const TRANSLATIONS = {
  en: {
    gameTitle: 'Cosmic Orbit: Gravitational Merge',
    tagline: 'Newtonian Orbital Mechanics ✕ Celestial Evolution Suika — Slingshot Planets into Orbit & Forge a Supernova!',
    startPrompt: '▶ LAUNCH CELESTIAL ORBIT',
    scoreLabel: 'COSMIC SCORE',
    highScoreLabel: 'BEST DISCOVERY',
    nextPlanetLabel: 'NEXT BODY',
    comboLabel: 'ORBITAL COMBO',
    eventHorizonWarning: '⚠️ EVENT HORIZON OVERFLOW WARNING!',
    powerGravityPulse: '🌀 Gravity Pulse',
    powerMagneticSingularity: '🧲 Twin Pull',
    powerCometLaser: '☄️ Laser Comet',
    gameOverTitle: '💥 COSMIC SINGULARITY COLLAPSE',
    gameOverDesc: 'The orbital gravity well overflowed the Event Horizon limit.',
    victorySupernova: '🌌 QUASAR SINGULARITY FORGED! (+15,000 Cosmic Score)',
    playAgain: '🔄 New Solar System',
    shareScore: '📋 Share Cosmic Discovery',
    copiedAlert: 'Cosmic discovery card copied to clipboard!'
  },
  zh: {
    gameTitle: 'Cosmic Orbit: 行星引力合成',
    tagline: '牛顿天体引力轨道 ✕ 行星合成进化大西瓜 —— 将天体弹射入公转轨道，合成终极超新星黑洞！',
    startPrompt: '▶ 开启宇宙引力公转',
    scoreLabel: '宇宙探索分',
    highScoreLabel: '历史最高纪录',
    nextPlanetLabel: '即将发射天体',
    comboLabel: '引力连击',
    eventHorizonWarning: '⚠️ 视界线引力失衡溢出预警！',
    powerGravityPulse: '🌀 引力脉冲波',
    powerMagneticSingularity: '🧲 双星磁吸',
    powerCometLaser: '☄️ 彗星激光',
    gameOverTitle: '💥 宇宙视界坍缩解体',
    gameOverDesc: '天体堆积过多并越过了外围事件视界警戒线。',
    victorySupernova: '🌌 成功创造终极类星体黑洞！(+15,000 积分)',
    playAgain: '🔄 重启宇宙星系',
    shareScore: '📋 分享宇宙成就卡',
    copiedAlert: '宇宙探索成就已复制到剪贴板！'
  },
  es: {
    gameTitle: 'Cosmic Orbit: Fusión Gravitatoria',
    tagline: 'Mecánica Orbital Newtoniana ✕ Fusión Suika — ¡Lanza planetas en órbita y forja una Supernova!',
    startPrompt: '▶ INICIAR ÓRBITA CÓSMICA',
    scoreLabel: 'PUNTOS CÓSMICOS',
    highScoreLabel: 'RÉCORD',
    nextPlanetLabel: 'SIGUIENTE CUERPO',
    comboLabel: 'COMBO ORBITAL',
    eventHorizonWarning: '⚠️ ¡DESBORDAMIENTO DEL HORIZONTE DE SUCESOS!',
    powerGravityPulse: '🌀 Pulso Gravitatorio',
    powerMagneticSingularity: '🧲 Atracción Doble',
    powerCometLaser: '☄️ Láser Cometa',
    gameOverTitle: '💥 COLAPSO DE SINGULARIDAD',
    gameOverDesc: 'Los cuerpos celestes sobrepasaron el límite de gravedad exterior.',
    victorySupernova: '🌌 ¡SINGULARIDAD CUÁSAR CREADA! (+15,000 Puntos)',
    playAgain: '🔄 Nuevo Sistema Solar',
    shareScore: '📋 Compartir Descubrimiento',
    copiedAlert: '¡Informe cósmico copiado al portapapeles!'
  },
  ja: {
    gameTitle: 'コズミック・オービット: 惑星引力合成',
    tagline: 'ニュートン軌道力学 ✕ 惑星スイカゲーム — 引力場に惑星を打ち上げ、超新星クエーサーを合成せよ！',
    startPrompt: '▶ 宇宙軌道シミュレーション開始',
    scoreLabel: 'コズミックスコア',
    highScoreLabel: 'ハイスコア',
    nextPlanetLabel: '次の天体',
    comboLabel: '軌道コンボ',
    eventHorizonWarning: '⚠️ 事象の地平面オーバーフロー警告！',
    powerGravityPulse: '🌀 重力パルス',
    powerMagneticSingularity: '🧲 連星磁気引力',
    powerCometLaser: '☄️ 彗星レーザー',
    gameOverTitle: '💥 重力崩壊・ブラックホール暴走',
    gameOverDesc: '軌道上の天体が限界線（事象の地平面）を越えて崩壊しました。',
    victorySupernova: '🌌 究極のクエーサー特異点を創造！ (+15,000点)',
    playAgain: '🔄 新しい星系を創生',
    shareScore: '📋 宇宙実績を共有',
    copiedAlert: '宇宙探査レポートをコピーしました！'
  }
};

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('co_lang_v2') || 'en';
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      localStorage.setItem('co_lang_v2', lang);
      this.applyTranslations();
    }
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.innerText = this.t(key);
      }
    });
  }
}

export const i18n = new I18n();
