/**
 * Daily Quest Engine (Wordle-style Daily Target & Viral Social Share)
 * Fully localized with i18n
 */

import { RECIPES_DATA, enrichElement } from './recipes.js';
import { sounds } from './audio.js';
import { particles } from './particles.js';
import { monetization } from './monetization.js';
import { i18n } from './i18n.js';

class DailyQuestEngine {
  constructor() {
    this.todayStr = this.getTodayDateString();
    this.currentQuest = this.generateDailyTarget(this.todayStr);
    this.stepsTaken = 0;
    this.historySteps = [];
    this.isCompleted = localStorage.getItem(`emoji_daily_${this.todayStr}`) === 'true';
    this.bestSteps = parseInt(localStorage.getItem(`emoji_daily_steps_${this.todayStr}`) || '0', 10);
  }

  getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  generateDailyTarget(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);

    const candidateRecipes = RECIPES_DATA.filter(r => 
      ['tech', 'meme', 'fantasy', 'cosmic', 'food'].includes(r.result.category)
    );

    const selectedRecipe = candidateRecipes[positiveHash % candidateRecipes.length];
    return {
      date: dateStr,
      targetId: selectedRecipe.result.id,
      targetEmoji: selectedRecipe.result.emoji,
      parSteps: 6 + (positiveHash % 4)
    };
  }

  getTargetElement() {
    return enrichElement({ id: this.currentQuest.targetId, emoji: this.currentQuest.targetEmoji });
  }

  recordStep(elementResult) {
    if (this.isCompleted) return;
    this.stepsTaken++;
    this.historySteps.push(elementResult);

    if (elementResult.id === this.currentQuest.targetId) {
      this.completeDailyQuest();
    }
  }

  completeDailyQuest() {
    this.isCompleted = true;
    localStorage.setItem(`emoji_daily_${this.todayStr}`, 'true');
    localStorage.setItem(`emoji_daily_steps_${this.todayStr}`, this.stepsTaken.toString());

    sounds.playVictory();
    particles.confettiBurst();

    setTimeout(() => {
      this.showVictoryModal();
    }, 600);
  }

  showVictoryModal() {
    const modal = document.getElementById('daily-victory-modal');
    if (!modal) return;

    const target = this.getTargetElement();
    const targetEmoji = document.getElementById('victory-target-emoji');
    const targetName = document.getElementById('victory-target-name');
    const stepsEl = document.getElementById('victory-steps');
    const percentileEl = document.getElementById('victory-percentile');

    if (targetEmoji) targetEmoji.textContent = target.emoji;
    if (targetName) targetName.textContent = target.name;
    if (stepsEl) stepsEl.textContent = `${this.stepsTaken}`;

    const percentile = Math.min(99, Math.max(65, 100 - (this.stepsTaken - 4) * 5));
    if (percentileEl) {
      percentileEl.textContent = i18n.t('victoryPercentile', { percent: percentile });
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeVictoryModal() {
    const modal = document.getElementById('daily-victory-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  generateShareText() {
    const isVip = monetization.isUserVIP();
    const vipBadge = isVip ? '👑 VIP Alchemist' : '🧪 Alchemist';
    const target = this.getTargetElement();
    
    let matrix = '';
    const rows = Math.min(6, Math.ceil(this.stepsTaken / 2));
    for (let r = 0; r < rows; r++) {
      if (r === rows - 1) {
        matrix += '🟩🟩🟩🟩\n';
      } else {
        matrix += '🟨🟩🟨⬛\n';
      }
    }

    const shareText = 
`🧪 Emoji Craft #${this.todayStr}
🎯 Target: ${target.emoji} ${target.name}
⭐ Solved in: ${this.stepsTaken} steps (${vipBadge})
${matrix.trim()}
🔗 Play now: ${window.location.origin || 'https://emojicraft.game'}`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert(i18n.t('copiedSuccess'));
    }).catch(() => {
      prompt('Copy your score card:', shareText);
    });
  }
}

export const dailyQuest = new DailyQuestEngine();
window.dailyQuest = dailyQuest;
