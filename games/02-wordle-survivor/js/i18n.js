/**
 * Internationalization (i18n) Engine for Wordle Survivor
 * Supports English (Default), Chinese, Spanish, Japanese.
 */

export const TRANSLATIONS = {
  en: {
    gameTitle: 'Wordle Survivor: Spell Roguelike',
    tagline: 'Vampire Survivors meets Wordle — Spell Words, Cast Spells, Survive the Horde!',
    startPrompt: 'Press [WASD / Arrows] to Move · [SPACE] to Cast Word Spell',
    castButton: '⚡ CAST SPELL',
    noWord: 'No Valid Word in Rack',
    readyWord: 'Ready: ',
    levelUpTitle: '✨ LEVEL UP! CHOOSE A PERK',
    timeLabel: 'TIME',
    killsLabel: 'KILLS',
    lvlLabel: 'LVL',
    hpLabel: 'HP',
    gameOverTitle: '💀 YOU WERE OVERWHELMED',
    survivedTime: 'Survival Time',
    totalKills: 'Monsters Vanquished',
    wordsCast: 'Words Cast',
    bestWord: 'Highest Scoring Word',
    playAgain: '🔄 Play Again',
    shareScore: '📋 Share Score Card',
    copiedAlert: 'Scorecard copied to clipboard! Share it with friends on Twitter / Discord!',
    dailyQuestTitle: '🎯 DAILY TARGET WORD:',
    discardTip: 'Tap letter in rack to discard · Letters auto-arrange into valid words',
    instructions: '1. Move your wizard to dodge monsters.\n2. Defeated monsters drop glowing letter runes.\n3. Form valid English words in your rack.\n4. Cast words to unleash devastating elemental spells!'
  },
  zh: {
    gameTitle: 'Wordle Survivor: 词灵幸存者',
    tagline: '吸血鬼幸存者 ✕ 单词魔法 — 拾取字母，构词施法，无双割草！',
    startPrompt: '使用 [WASD / 方向键] 移动 · [空格键] 释放单词魔法',
    castButton: '⚡ 释放魔法',
    noWord: '当前卡槽无有效单词',
    readyWord: '就绪魔法: ',
    levelUpTitle: '✨ 升级！选择一项肉鸽祝福',
    timeLabel: '生存时间',
    killsLabel: '击杀数',
    lvlLabel: '等级',
    hpLabel: '生命值',
    gameOverTitle: '💀 寡不敌众，法力竭尽',
    survivedTime: '生存时间',
    totalKills: '消灭怪物',
    wordsCast: '释放法术次数',
    bestWord: '最高分单词',
    playAgain: '🔄 重新开始',
    shareScore: '📋 分享战报卡片',
    copiedAlert: '战报已复制到剪贴板！快去分享给好友吧！',
    dailyQuestTitle: '🎯 今日每日目标词：',
    discardTip: '点击卡槽中的字母可弃牌 · 系统会自动识别并组合最强单词',
    instructions: '1. 走位风筝怪物，避免被围堵。\n2. 怪物死亡掉落发光的字母符文。\n3. 收集字母并在卡槽中组成有效英文单词。\n4. 释放单词召唤火球、冰冻、闪电、黑洞等超维魔法！'
  },
  es: {
    gameTitle: 'Wordle Survivor: Hechizo Roguelike',
    tagline: 'Vampire Survivors se une a Wordle: ¡forma palabras, lanza hechizos y sobrevive!',
    startPrompt: 'Usa [WASD / Flechas] para moverte · [ESPACIO] para lanzar hechizo',
    castButton: '⚡ LANZAR HECHIZO',
    noWord: 'No hay palabra válida',
    readyWord: 'Listo: ',
    levelUpTitle: '✨ ¡SUBISTE DE NIVEL! ELIGE UNA MEJORA',
    timeLabel: 'TIEMPO',
    killsLabel: 'BAJAS',
    lvlLabel: 'NIVEL',
    hpLabel: 'VIDA',
    gameOverTitle: '💀 HAS SIDO DERROTADO',
    survivedTime: 'Tiempo Sobrevivido',
    totalKills: 'Monstruos Eliminados',
    wordsCast: 'Hechizos Lanzados',
    bestWord: 'Mejor Palabra',
    playAgain: '🔄 Jugar de Nuevo',
    shareScore: '📋 Compartir Puntuación',
    copiedAlert: '¡Puntuación copiada al portapapeles!',
    dailyQuestTitle: '🎯 PALABRA OBJETIVO DIARIA:',
    discardTip: 'Toca una letra para descartarla',
    instructions: '1. Muévete para esquivar enemigos.\n2. Recoge las letras rúnicas.\n3. Forma palabras en inglés para lanzar magia elemental.'
  },
  ja: {
    gameTitle: 'Wordle Survivor: 言霊サバイバー',
    tagline: 'ヴァンサバ ✕ 英単語スペル — 文字を拾い、単語を紡ぎ、大魔法を放て！',
    startPrompt: '[WASD / 矢印キー] で移動 · [スペース] で魔法詠唱',
    castButton: '⚡ 呪文詠唱',
    noWord: '有効な単語がありません',
    readyWord: '詠唱可能: ',
    levelUpTitle: '✨ レベルアップ！パークを選択',
    timeLabel: '生存時間',
    killsLabel: '討伐数',
    lvlLabel: 'レベル',
    hpLabel: 'HP',
    gameOverTitle: '💀 力尽きてしまった...',
    survivedTime: '生存時間',
    totalKills: '討伐モンスター数',
    wordsCast: '詠唱した単語数',
    bestWord: '最高スコア単語',
    playAgain: '🔄 もう一度遊ぶ',
    shareScore: '📋 スコアを共有',
    copiedAlert: 'スコアカードをクリップボードにコピーしました！',
    dailyQuestTitle: '🎯 今日のデイリーターゲット単語：',
    discardTip: '文字をタップして破棄 · 有効な単語が自動構成されます',
    instructions: '1. 敵を避けて動き回ろう。\n2. 倒した敵からアルファベットを回収。\n3. 英単語を成立させて全画面魔法を発動！'
  }
};

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('ws_lang') || 'en';
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      localStorage.setItem('ws_lang', lang);
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
