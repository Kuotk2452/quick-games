import os
import re

# 1. Update index.html
html_path = 'games/01-emoji-craft/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Add SDK before module scripts
if 'mock-reward-sdk.js' not in html:
    html = html.replace('<!-- 脚本引入 -->', '<!-- 广告 SDK 引入 -->\n  <script src="../../js/mock-reward-sdk.js"></script>\n  <!-- 脚本引入 -->')

# Add Double reward button in victory modal if not present
double_reward_btn = '''        <button id="btn-daily-ad-double" onclick="window.monetization.claimDailyDoubleReward()" class="w-full py-3 px-4 rounded-xl font-black text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 shadow-lg shadow-amber-500/25 transition transform active:scale-95 flex items-center justify-center gap-2">
          <span>🎬 Watch Ad for 2x Daily Rewards & +3 Hints</span>
        </button>
        <button onclick="window.dailyQuest.generateShareText()"'''

if 'btn-daily-ad-double' not in html:
    html = html.replace('<button onclick="window.dailyQuest.generateShareText()"', double_reward_btn)

# Bump script versions
html = re.sub(r'js/monetization\.js(\?v=[\d\.]+)?', 'js/monetization.js?v=2.0', html)
html = re.sub(r'js/game\.js(\?v=[\d\.]+)?', 'js/game.js?v=2.0', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update monetization.js
monet_path = 'games/01-emoji-craft/js/monetization.js'
with open(monet_path, 'r', encoding='utf-8') as f:
    monet = f.read()

# Replace showRewardedVideo method
old_show_ad = '''  showRewardedVideo(rewardName = '1 Secret Recipe Clue', onReward) {
    if (this.isVIP) {
      if (onReward) onReward();
      return;
    }

    this.onRewardCallback = onReward;
    const modal = document.getElementById('rewarded-ad-modal');
    if (!modal) return;

    const rewardText = document.getElementById('ad-reward-desc');
    if (rewardText) {
      rewardText.textContent = i18n.t('adDesc', { reward: rewardName });
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    this.startAdCountdown(15);
  }'''

new_show_ad = '''  showRewardedVideo(rewardName = '1 Secret Recipe Clue', onReward) {
    if (this.isVIP) {
      if (onReward) onReward();
      return;
    }

    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        this.addFreeHint(1);
        if (onReward) onReward();
      });
      return;
    }

    this.onRewardCallback = onReward;
    const modal = document.getElementById('rewarded-ad-modal');
    if (!modal) return;

    const rewardText = document.getElementById('ad-reward-desc');
    if (rewardText) {
      rewardText.textContent = i18n.t('adDesc', { reward: rewardName });
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    this.startAdCountdown(15);
  }

  claimDailyDoubleReward() {
    if (this.isVIP) {
      const btn = document.getElementById('btn-daily-ad-double');
      if (btn) {
        btn.innerHTML = '<span>👑 VIP Instant 2x Claimed!</span>';
        btn.disabled = true;
      }
      this.addFreeHint(3);
      if (window.gameApp) window.gameApp.updateHintBadge();
      return;
    }

    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        const btn = document.getElementById('btn-daily-ad-double');
        if (btn) {
          btn.innerHTML = '<span>✅ Double Rewards Claimed (+3 💡 Hints)</span>';
          btn.disabled = true;
          btn.classList.add('opacity-75', 'cursor-default');
        }
        this.addFreeHint(3);
        if (window.gameApp) window.gameApp.updateHintBadge();
      });
    } else {
      this.showRewardedVideo('Double Daily Gems', () => {
        const btn = document.getElementById('btn-daily-ad-double');
        if (btn) {
          btn.innerHTML = '<span>✅ Double Rewards Claimed (+3 💡 Hints)</span>';
          btn.disabled = true;
          btn.classList.add('opacity-75', 'cursor-default');
        }
        this.addFreeHint(3);
        if (window.gameApp) window.gameApp.updateHintBadge();
      });
    }
  }'''

monet = monet.replace(old_show_ad, new_show_ad)

with open(monet_path, 'w', encoding='utf-8') as f:
    f.write(monet)

print("Game 01 updated successfully.")
