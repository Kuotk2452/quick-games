/**
 * Internationalization (i18n) Engine for Mecha Arena
 * Supports English (Default), Chinese, Spanish, Japanese.
 */

export const TRANSLATIONS = {
  en: {
    gameTitle: 'Mecha Arena: Cyber BattleBots',
    tagline: 'Modular Robot Crafting ✕ Real-Time Physics Arena Combat — Assemble Your Mecha & Crush the Tournament!',
    startPrompt: '▶ ENTER WORKSHOP & ASSEMBLE',
    deployBtn: '⚔️ ENTER ARENA TOURNAMENT',
    scrapLabel: 'SCRAP CASH',
    leagueLabel: 'LEAGUE TIER',
    hpLabel: 'CHASSIS HULL',
    shieldLabel: 'ENERGY SHIELD',
    tabChassis: '🦿 Chassis',
    tabWeapon: '🔫 Weapons',
    tabModule: '🚀 Subsystems',
    tabTournament: '🏆 Tournament',
    statHp: 'Hull HP',
    statSpeed: 'Speed',
    statDps: 'Damage Output',
    statRecoil: 'Recoil Absorpt.',
    equipped: 'EQUIPPED',
    equipBtn: 'EQUIP',
    locked: 'LOCKED',
    victoryTitle: '🏆 TOURNAMENT VICTORY!',
    victoryDesc: 'Opponent mecha destroyed into scrap metal!',
    defeatTitle: '💥 CHASSIS CRITICALLY BREACHED',
    defeatDesc: 'Your mecha suffered catastrophic hull failure in the arena.',
    nextMatchBtn: '⚔️ Next Challenger',
    retryMatchBtn: '🔄 Retry Battle',
    championTitle: '👑 TOURNAMENT CHAMPION!',
    championDesc: 'You vanquished the Apex Juggernaut and conquered the Cyber Arena!',
    newTournamentBtn: '🏆 New Championship Run',
    repairReturnBtn: '🛠️ Return to Workshop',
    shareScore: '📋 Share Mecha Build',
    copiedAlert: 'Mecha battle build copied to clipboard!'
  },
  zh: {
    gameTitle: 'Mecha Arena: 赛博机甲工坊',
    tagline: '模块化机甲组装 ✕ 实时物理角斗场死斗 —— 自由改装武器底盘，登顶竞技场机甲之王！',
    startPrompt: '▶ 进入工坊组装机甲',
    deployBtn: '⚔️ 启动出击 · 进入竞技场',
    scrapLabel: '报废零件币',
    leagueLabel: '锦标赛段位',
    hpLabel: '机体装甲值',
    shieldLabel: '能量护盾',
    tabChassis: '🦿 底盘模块',
    tabWeapon: '🔫 主手武器',
    tabModule: '🚀 战术插件',
    tabTournament: '🏆 锦标赛程',
    statHp: '装甲耐久',
    statSpeed: '移动速度',
    statDps: '输出火力',
    statRecoil: '后坐力缓冲',
    equipped: '当前已装备',
    equipBtn: '改装装备',
    locked: '未解锁',
    victoryTitle: '🏆 擂台击破大获全胜！',
    victoryDesc: '敌方机甲已被彻底打碎成金属废料！',
    defeatTitle: '💥 机体核心被彻底击穿',
    defeatDesc: '你的机甲在角斗场中承受了灾难性结构损坏。',
    nextMatchBtn: '⚔️ 迎战下一位选手',
    retryMatchBtn: '🔄 再次挑战本关',
    championTitle: '👑 荣登锦标赛巅峰总冠军！',
    championDesc: '你成功击毁了深渊主宰巨兽，成为了赛博角斗场唯一的机甲霸主！',
    newTournamentBtn: '🏆 开启新一轮锦标赛',
    repairReturnBtn: '🛠️ 返回工坊维修改装',
    shareScore: '📋 分享机甲配置卡',
    copiedAlert: '机甲战报与配置已复制到剪贴板！'
  },
  es: {
    gameTitle: 'Mecha Arena: Cyber BattleBots',
    tagline: 'Construcción Modular de Robots ✕ Combate Físico en Arena — ¡Construye tu Mecha y Conquista el Torneo!',
    startPrompt: '▶ ENTRAR AL TALLER',
    deployBtn: '⚔️ ENTRAR A LA ARENA',
    scrapLabel: 'CHATARRA ($SC)',
    leagueLabel: 'LIGA',
    hpLabel: 'BLINDAJE',
    shieldLabel: 'ESCUDO',
    tabChassis: '🦿 Chasis',
    tabWeapon: '🔫 Armas',
    tabModule: '🚀 Módulos',
    tabTournament: '🏆 Torneo',
    statHp: 'Vida del Chasis',
    statSpeed: 'Velocidad',
    statDps: 'Potencia de Fuego',
    statRecoil: 'Absorción Retroceso',
    equipped: 'EQUIPADO',
    equipBtn: 'EQUIPAR',
    locked: 'BLOQUEADO',
    victoryTitle: '🏆 ¡VICTORIA EN EL TORNEO!',
    victoryDesc: '¡El mecha enemigo ha sido reducido a chatarra!',
    defeatTitle: '💥 CHASIS CRÍTICAMENTE DAÑADO',
    defeatDesc: 'Tu mecha sufrió un fallo catastrófico en la arena.',
    nextMatchBtn: '⚔️ Siguiente Rival',
    retryMatchBtn: '🔄 Reintentar Combate',
    championTitle: '👑 ¡CAMPEÓN DEL TORNEO!',
    championDesc: '¡Has derrotado al Behemoth Apex y dominado la Cyber Arena!',
    newTournamentBtn: '🏆 Nuevo Torneo',
    repairReturnBtn: '🛠️ Volver al Taller',
    shareScore: '📋 Compartir Configuración',
    copiedAlert: '¡Informe copiado al portapapeles!'
  },
  ja: {
    gameTitle: 'メカ・アリーナ: サイバーロボット工房',
    tagline: 'モジュール機体カスタマイズ ✕ 物理リアルタイムアリーナ死闘 — 最強ロボを組み立ててトーナメント制覇！',
    startPrompt: '▶ 工房で機体を組み立てる',
    deployBtn: '⚔️ アリーナ出撃開始',
    scrapLabel: 'スクラップ資金',
    leagueLabel: 'トーナメント階級',
    hpLabel: '装甲耐久度',
    shieldLabel: 'エネルギーシールド',
    tabChassis: '🦿 脚部・足回り',
    tabWeapon: '🔫 主兵装',
    tabModule: '🚀 戦術プラグイン',
    tabTournament: '🏆 大会戦績',
    statHp: '装甲値',
    statSpeed: '最高速度',
    statDps: '火力出力',
    statRecoil: '反動吸収率',
    equipped: '装備中',
    equipBtn: '換装する',
    locked: 'ロック中',
    victoryTitle: '🏆 敵機撃破！完全勝利！',
    victoryDesc: '対戦相手の機体を金属くずに粉砕しました！',
    defeatTitle: '💥 機体コア大破・作戦失敗',
    defeatDesc: 'アリーナ内で装甲が限界を迎え大破しました。',
    nextMatchBtn: '⚔️ 次の挑戦者と対戦',
    retryMatchBtn: '🔄 再挑戦する',
    championTitle: '👑 トーナメント完全制覇！',
    championDesc: '頂点獣エイペックスを撃破し、サイバーアリーナの頂点に君臨した！',
    newTournamentBtn: '🏆 新たなトーナメントへ',
    repairReturnBtn: '🛠️ 工房に戻り修理・強化',
    shareScore: '📋 機体構成を共有',
    copiedAlert: '機体スペックをクリップボードにコピーしました！'
  }
};

class I18n {
  constructor() {
    this.currentLang = typeof localStorage !== 'undefined' ? (localStorage.getItem('ma_lang_v2') || 'en') : 'en';
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ma_lang_v2', lang);
      }
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
