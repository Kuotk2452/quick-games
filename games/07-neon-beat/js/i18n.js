/**
 * Internationalization (i18n) Engine for Neon Beat
 * Supports English (Default), Chinese, Spanish, Japanese.
 */

export const TRANSLATIONS = {
  en: {
    gameTitle: 'Neon Beat: Cyber Blade Rhythm',
    tagline: 'Dual Cyber Sabers ✕ Synthwave Electronic Beats — Slice oncoming rhythm blocks to conquer the EDM chart!',
    selectTrackTitle: 'SELECT TRACK',
    scoreLabel: 'SCORE',
    comboLabel: 'COMBO',
    feverLabel: 'FEVER x8',
    multiplierLabel: 'MULTIPLIER',
    accuracyLabel: 'ACCURACY',
    startSongBtn: '▶ START TRACK',
    resultsTitle: '🏆 TRACK COMPLETE!',
    gradeRank: 'GRADE',
    maxCombo: 'Max Combo',
    perfectCount: 'PERFECT',
    greatCount: 'GREAT',
    goodCount: 'GOOD',
    missCount: 'MISS',
    restartBtn: '🔄 Retry Track',
    selectSongBtn: '🎵 Select Track',
    shareScore: '📋 Share Score',
    copiedAlert: 'Rhythm score copied to clipboard!'
  },
  zh: {
    gameTitle: 'Neon Beat: 赛博光刃音游',
    tagline: '红蓝双光刃切割 ✕ 赛博朋克合成波电音 —— 斩断迎面而来的霓虹节拍，冲击全连 SSS 评价！',
    selectTrackTitle: '选择曲目',
    scoreLabel: '得分',
    comboLabel: '连击数',
    feverLabel: '狂热加成 x8',
    multiplierLabel: '得分倍率',
    accuracyLabel: '命中精准度',
    startSongBtn: '▶ 开始演奏',
    resultsTitle: '🏆 演奏完成！',
    gradeRank: '评级',
    maxCombo: '最大连击',
    perfectCount: '完美 PERFECT',
    greatCount: '极佳 GREAT',
    goodCount: '命中 GOOD',
    missCount: '失误 MISS',
    restartBtn: '🔄 重新挑战',
    selectSongBtn: '🎵 返回选曲',
    shareScore: '📋 分享战绩',
    copiedAlert: '音游战报已复制到剪贴板！'
  },
  es: {
    gameTitle: 'Neon Beat: Ritmo de Espadas Cyber',
    tagline: 'Sables Láser Duales ✕ Ritmos Synthwave — ¡Corta los cubos de neón y domina la lista de éxitos!',
    selectTrackTitle: 'SELECCIONAR PISTA',
    scoreLabel: 'PUNTOS',
    comboLabel: 'COMBO',
    feverLabel: 'FIEBRE x8',
    multiplierLabel: 'MULTIPLICADOR',
    accuracyLabel: 'PRECISIÓN',
    startSongBtn: '▶ INICIAR PISTA',
    resultsTitle: '🏆 ¡PISTA COMPLETADA!',
    gradeRank: 'RANGO',
    maxCombo: 'Combo Máximo',
    perfectCount: 'PERFECTO',
    greatCount: 'GENIAL',
    goodCount: 'BIEN',
    missCount: 'FALLO',
    restartBtn: '🔄 Reintentar',
    selectSongBtn: '🎵 Elegir Pista',
    shareScore: '📋 Compartir Puntuación',
    copiedAlert: '¡Puntuación copiada al portapapeles!'
  },
  ja: {
    gameTitle: 'ネオン・ビート: サイバー光刃音ゲー',
    tagline: '紅青二刀流 ✕ シンセウェイブ電子音 — 迫り来るネオンキューブを一刀両断！',
    selectTrackTitle: '楽曲選択',
    scoreLabel: 'スコア',
    comboLabel: 'コンボ',
    feverLabel: 'フィーバー x8',
    multiplierLabel: '倍率',
    accuracyLabel: '精度',
    startSongBtn: '▶ 演奏スタート',
    resultsTitle: '🏆 ステージクリア！',
    gradeRank: '評価ランク',
    maxCombo: '最大コンボ',
    perfectCount: '完璧 PERFECT',
    greatCount: '素晴らしい GREAT',
    goodCount: '成功 GOOD',
    missCount: 'ミス MISS',
    restartBtn: '🔄 もう一度挑戦',
    selectSongBtn: '🎵 曲選択へ戻る',
    shareScore: '📋 スコアを共有',
    copiedAlert: 'リザルトをクリップボードにコピーしました！'
  }
};

class I18n {
  constructor() {
    this.currentLang = typeof localStorage !== 'undefined' ? (localStorage.getItem('nb_lang_v2') || 'en') : 'en';
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('nb_lang_v2', lang);
      }
      this.applyTranslations();
    }
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  applyTranslations() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.innerText = this.t(key);
      }
    });
  }
}

export const i18n = new I18n();
