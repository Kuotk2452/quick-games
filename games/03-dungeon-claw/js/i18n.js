/**
 * Internationalization (i18n) Engine for 3D Dungeon Claw
 * Supports English (Default), Chinese, Spanish, Japanese.
 */

export const TRANSLATIONS = {
  en: {
    gameTitle: 'Dungeon Claw: 3D Roguelike',
    tagline: 'Physics Claw Machine ✕ Dungeon Deckbuilder — Grab Swords, Trigger Combos & Slay Bosses!',
    startPrompt: '▶ CLICK TO ENTER THE DUNGEON',
    dropClaw: '👇 DROP CLAW (SPACE)',
    endTurn: '⏩ END TURN',
    viewToggleFront: '🎥 Front View',
    viewToggleTop: '🛰️ Top-Down View',
    energyLabel: 'CLAW ENERGY',
    goldLabel: 'GOLD',
    floorLabel: 'FLOOR',
    hpLabel: 'HP',
    armorLabel: 'ARMOR',
    intentLabel: 'Next Enemy Action:',
    shopTitle: '🛒 BLACK MARKET & FORGE',
    continueDungeon: '⚔️ Descend to Next Floor',
    victoryTitle: '🏆 DUNGEON CONQUERED!',
    defeatTitle: '💀 YOU DIED IN THE DUNGEON',
    playAgain: '🔄 Play Again',
    shareScore: '📋 Share Score Card',
    copiedAlert: 'Score card copied to clipboard!',
    instructions: '1. Use [A/D / Arrows / Touch Drag] to position the 3D crane claw.\n2. Press [SPACE] or tap [DROP CLAW] to grab items from the physics pit.\n3. Grabbed swords attack, shields add armor, potions heal, and bombs deal massive AOE!\n4. Defeat bosses and spend Gold in the Black Market to upgrade your crane!'
  },
  zh: {
    gameTitle: 'Dungeon Claw: 3D抓娃娃地牢',
    tagline: '3D物理抓娃娃机 ✕ 地牢爬塔肉鸽 — 机械抓爪，战利品连携，爆锤Boss！',
    startPrompt: '▶ 点击进入 3D 抓娃娃地牢',
    dropClaw: '👇 释放抓爪 (空格键)',
    endTurn: '⏩ 结束回合',
    viewToggleFront: '🎥 正面视角',
    viewToggleTop: '🛰️ 俯视天眼视角',
    energyLabel: '抓爪能量',
    goldLabel: '金币',
    floorLabel: '层数',
    hpLabel: '生命值',
    armorLabel: '护甲',
    intentLabel: '敌人下回合意图：',
    shopTitle: '🛒 地牢黑市与铁匠铺',
    continueDungeon: '⚔️ 前往下一层地牢',
    victoryTitle: '🏆 恭喜通关！地牢霸主！',
    defeatTitle: '💀 命丧地牢，抓爪崩毁',
    playAgain: '🔄 重新挑战',
    shareScore: '📋 分享战报卡片',
    copiedAlert: '战报已复制到剪贴板！快去分享给好友吧！',
    instructions: '1. 使用 [A/D / 方向键 / 屏幕触摸拖拽] 移动 3D 机械爪。\n2. 按 [空格键] 或点击 [释放抓爪] 下放抓取战利品球池。\n3. 抓到宝剑发起斩击、盾牌格挡护甲、药水回血、炸弹轰炸全屏！\n4. 战胜怪物后可在黑市升级抓力、增加抓爪能量、购买神级遗物！'
  },
  es: {
    gameTitle: 'Dungeon Claw: 3D Roguelike',
    tagline: 'Máquina de Garra 3D ✕ Mazmorras Roguelike — ¡Atrapa armas y derrota jefes!',
    startPrompt: '▶ HAZ CLIC PARA ENTRAR A LA MAZMORRA',
    dropClaw: '👇 SOLTAR GARRA (ESPACIO)',
    endTurn: '⏩ FIN DEL TURNO',
    viewToggleFront: '🎥 Vista Frontal',
    viewToggleTop: '🛰️ Vista Cenital',
    energyLabel: 'ENERGÍA',
    goldLabel: 'ORO',
    floorLabel: 'PISO',
    hpLabel: 'VIDA',
    armorLabel: 'ARMADURA',
    intentLabel: 'Acción del enemigo:',
    shopTitle: '🛒 MERCADO NEGRO',
    continueDungeon: '⚔️ Siguiente Piso',
    victoryTitle: '🏆 ¡MAZMORRA CONQUISTADA!',
    defeatTitle: '💀 HAS MUERTO',
    playAgain: '🔄 Jugar de Nuevo',
    shareScore: '📋 Compartir Puntuación',
    copiedAlert: '¡Puntuación copiada al portapapeles!',
    instructions: '1. Mueve la garra 3D con [A/D o arrastrando].\n2. Presiona [ESPACIO] o toca [SOLTAR GARRA] para atrapar objetos.\n3. ¡Las espadas atacan, escudos protegen y bombas explotan!'
  },
  ja: {
    gameTitle: 'Dungeon Claw: 3Dクレーン地牢',
    tagline: '3Dクレーンゲーム ✕ ローグライク地牢 — 剣を掴み、連撃を放ち、ボスを討て！',
    startPrompt: '▶ タップしてダンジョンへ突入',
    dropClaw: '👇 クレーン投下 (スペース)',
    endTurn: '⏩ ターン終了',
    viewToggleFront: '🎥 正面視点',
    viewToggleTop: '🛰️ 見下ろし天眼視点',
    energyLabel: 'クレーンエネルギー',
    goldLabel: 'ゴールド',
    floorLabel: 'フロア',
    hpLabel: 'HP',
    armorLabel: 'アーマー',
    intentLabel: '敵の次の行動：',
    shopTitle: '🛒 闇市＆鍛冶屋',
    continueDungeon: '⚔️ 次のフロアへ進む',
    victoryTitle: '🏆 ダンジョン完全制覇！',
    defeatTitle: '💀 力尽きてしまった...',
    playAgain: '🔄 もう一度遊ぶ',
    shareScore: '📋 スコアを共有',
    copiedAlert: 'スコアカードをコピーしました！',
    instructions: '1. [A/D / 矢印 / タッチドラッグ] で3Dクレーンを操作。\n2. [スペース] または [クレーン投下] でアイテムをキャッチ！\n3. 剣で攻撃、盾で防御、爆弾で全体攻撃を発動！'
  }
};

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('dc_lang') || 'en';
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      localStorage.setItem('dc_lang', lang);
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
