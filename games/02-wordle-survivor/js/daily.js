/**
 * Daily Wordle Quest & Social Share Generator for Wordle Survivor
 * Provides a universal daily target word and Wordle-style score cards.
 */

const DAILY_TARGET_WORDS = [
  'WIZARD', 'DRAGON', 'KNIGHT', 'PHANTOM', 'SHADOW', 'METEOR', 'SPARK',
  'FREEZE', 'BLAST', 'SHIELD', 'BLIZZARD', 'GALAXY', 'COSMOS', 'TITAN',
  'CRYSTAL', 'LEGEND', 'VALLEY', 'SPIRIT', 'STRIKE', 'MYSTIC', 'AURORA'
];

export class DailyManager {
  constructor() {
    this.todayDateStr = this.getTodayDateString();
    this.targetWord = this.computeDailyWord(this.todayDateStr);
    this.targetCompleted = false;
  }

  getTodayDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  computeDailyWord(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % DAILY_TARGET_WORDS.length;
    return DAILY_TARGET_WORDS[index];
  }

  checkDailyWord(spelledWord) {
    if (spelledWord.toUpperCase() === this.targetWord) {
      this.targetCompleted = true;
      return true;
    }
    return false;
  }

  generateShareCard(stats) {
    const { timeSurvived, kills, highestWord, highestDamage, wordsSpelled } = stats;
    const targetStatus = this.targetCompleted
      ? '🟩🟩🟩🟩🟩🟩 (SOLVED!)'
      : '⬜🟨⬜🟩⬜🟨 (ALMOST)';

    return `🧙‍♂️ Wordle Survivor — Daily Quest (${this.todayDateStr})
⏱️ Time: ${timeSurvived}
💀 Kills: ${kills}
🎯 Daily Word [${this.targetWord}]: ${targetStatus}
🪄 Highest Word: ${highestWord || 'N/A'} (+${highestDamage} DMG)
📚 Words Cast: ${wordsSpelled}

Play free on web:
👉 https://quickgames.pages.dev/games/02-wordle-survivor/`;
  }
}

export const dailyManager = new DailyManager();
