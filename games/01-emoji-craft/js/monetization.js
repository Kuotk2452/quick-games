/**
 * Monetization System with i18n & US Market Optimization:
 * - Rewarded Video Ads (Simulated & Production SDK hooks for Poki / AdSense / Mini-programs)
 * - $1.99 USD Micro-SaaS VIP Pass (No Ads, Unlimited Hints, Golden Crown)
 * - Banner Ad Slots
 */

import { i18n } from './i18n.js';

class MonetizationEngine {
  constructor() {
    this.isVIP = localStorage.getItem('emoji_craft_vip') === 'true';
    this.freeHintsRemaining = parseInt(localStorage.getItem('emoji_craft_hints') || '3', 10);
    this.onRewardCallback = null;
    this.initUI();
  }

  initUI() {
    this.createAdModal();
    this.createVIPModal();
  }

  isUserVIP() {
    return this.isVIP;
  }

  getFreeHints() {
    return this.isVIP ? Infinity : this.freeHintsRemaining;
  }

  useHint() {
    if (this.isVIP) return true;
    if (this.freeHintsRemaining > 0) {
      this.freeHintsRemaining--;
      localStorage.setItem('emoji_craft_hints', this.freeHintsRemaining.toString());
      return true;
    }
    return false;
  }

  addFreeHint(count = 1) {
    this.freeHintsRemaining += count;
    localStorage.setItem('emoji_craft_hints', this.freeHintsRemaining.toString());
  }

  showRewardedVideo(rewardName = '1 Secret Recipe Clue', onReward) {
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
  }

  startAdCountdown(seconds = 15) {
    let timeLeft = seconds;
    const countEl = document.getElementById('ad-countdown');
    const claimBtn = document.getElementById('ad-claim-btn');
    const progressBar = document.getElementById('ad-progress');

    if (claimBtn) {
      claimBtn.disabled = true;
      claimBtn.classList.add('opacity-50', 'cursor-not-allowed');
      claimBtn.textContent = i18n.t('adPlaying', { time: timeLeft });
    }

    if (this.adTimer) clearInterval(this.adTimer);

    this.adTimer = setInterval(() => {
      timeLeft--;
      if (countEl) countEl.textContent = `${timeLeft}s`;
      if (progressBar) progressBar.style.width = `${((seconds - timeLeft) / seconds) * 100}%`;

      if (claimBtn) {
        claimBtn.textContent = i18n.t('adPlaying', { time: timeLeft });
      }

      if (timeLeft <= 0) {
        clearInterval(this.adTimer);
        if (claimBtn) {
          claimBtn.disabled = false;
          claimBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          claimBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-600', 'animate-pulse');
          claimBtn.textContent = i18n.t('adClaim');
        }
      }
    }, 1000);
  }

  claimReward() {
    const modal = document.getElementById('rewarded-ad-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    if (this.adTimer) clearInterval(this.adTimer);

    this.addFreeHint(1);

    if (this.onRewardCallback) {
      this.onRewardCallback();
      this.onRewardCallback = null;
    }
  }

  closeAdModal() {
    const modal = document.getElementById('rewarded-ad-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    if (this.adTimer) clearInterval(this.adTimer);
  }

  showVIPModal() {
    this.updateVIPModalText();
    const modal = document.getElementById('vip-pass-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeVIPModal() {
    const modal = document.getElementById('vip-pass-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  upgradeToVIP() {
    this.isVIP = true;
    localStorage.setItem('emoji_craft_vip', 'true');
    this.closeVIPModal();
    alert(i18n.t('vipSuccessAlert'));
    window.location.reload();
  }

  updateVIPModalText() {
    const m = document.getElementById('vip-pass-modal');
    if (!m) return;
    m.querySelector('.vip-badge-tag').textContent = i18n.t('vipPassBadge');
    m.querySelector('.vip-title').textContent = i18n.t('vipPassTitle');
    m.querySelector('.vip-subtitle').textContent = i18n.t('vipPassSubtitle');
    m.querySelector('.feat-1-title').textContent = i18n.t('vipFeature1Title');
    m.querySelector('.feat-1-desc').textContent = i18n.t('vipFeature1Desc');
    m.querySelector('.feat-2-title').textContent = i18n.t('vipFeature2Title');
    m.querySelector('.feat-2-desc').textContent = i18n.t('vipFeature2Desc');
    m.querySelector('.feat-3-title').textContent = i18n.t('vipFeature3Title');
    m.querySelector('.feat-3-desc').textContent = i18n.t('vipFeature3Desc');
    m.querySelector('.vip-price-tag').textContent = i18n.t('vipPriceTag');
    m.querySelector('.vip-price').textContent = i18n.t('vipPrice');
    m.querySelector('.vip-price-sub').textContent = i18n.t('vipPriceSub');
    m.querySelector('.vip-pay-desc').textContent = i18n.t('vipPaymentDesc');
    m.querySelector('.vip-btn').textContent = i18n.t('vipBtn');
    m.querySelector('.vip-later').textContent = i18n.t('vipLater');
  }

  createAdModal() {
    const div = document.createElement('div');
    div.id = 'rewarded-ad-modal';
    div.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4';
    div.innerHTML = `
      <div class="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div id="ad-progress" class="h-full bg-gradient-to-r from-amber-400 to-emerald-400 w-0 transition-all duration-300"></div>
        </div>
        <div class="my-4 flex items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl animate-bounce">
            🎬
          </div>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">${i18n.t('adTitle')}</h3>
        <p id="ad-reward-desc" class="text-sm text-slate-300 mb-4"></p>
        
        <div class="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 mb-5 text-xs text-slate-400">
          <p class="font-semibold text-slate-200 mb-1">📢 Monetization Hook:</p>
          <p>Integrated lifecycle callbacks ready for Google AdSense / Poki SDK / Unity Ads in production.</p>
        </div>

        <div class="flex flex-col gap-3">
          <button id="ad-claim-btn" onclick="window.monetization.claimReward()" class="w-full py-3 px-4 rounded-xl font-bold text-white bg-slate-700 transition">
            Playing Ad (15s)
          </button>
          <button onclick="window.monetization.closeAdModal()" class="text-xs text-slate-400 hover:text-slate-200 underline">
            ${i18n.t('adCancel')}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(div);
  }

  createVIPModal() {
    const div = document.createElement('div');
    div.id = 'vip-pass-modal';
    div.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4';
    div.innerHTML = `
      <div class="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-amber-400/50 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden">
        <div class="vip-badge-tag inline-block px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold rounded-full mb-3">
          ${i18n.t('vipPassBadge')}
        </div>
        <h3 class="vip-title text-2xl font-black text-white mb-1">${i18n.t('vipPassTitle')}</h3>
        <p class="vip-subtitle text-xs text-slate-300 mb-5">${i18n.t('vipPassSubtitle')}</p>

        <div class="space-y-3 mb-6 text-left text-sm">
          <div class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
            <span class="text-xl">🚫</span>
            <div>
              <div class="feat-1-title font-bold text-white">${i18n.t('vipFeature1Title')}</div>
              <div class="feat-1-desc text-xs text-slate-400">${i18n.t('vipFeature1Desc')}</div>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
            <span class="text-xl">💡</span>
            <div>
              <div class="feat-2-title font-bold text-white">${i18n.t('vipFeature2Title')}</div>
              <div class="feat-2-desc text-xs text-slate-400">${i18n.t('vipFeature2Desc')}</div>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
            <span class="text-xl">👑</span>
            <div>
              <div class="feat-3-title font-bold text-white">${i18n.t('vipFeature3Title')}</div>
              <div class="feat-3-desc text-xs text-slate-400">${i18n.t('vipFeature3Desc')}</div>
            </div>
          </div>
        </div>

        <div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-5">
          <div class="vip-price-tag text-xs text-amber-300 font-medium">${i18n.t('vipPriceTag')}</div>
          <div class="text-3xl font-black text-amber-400 my-1"><span class="vip-price">${i18n.t('vipPrice')}</span> <span class="vip-price-sub text-sm font-normal text-slate-300">${i18n.t('vipPriceSub')}</span></div>
          <div class="vip-pay-desc text-[11px] text-slate-400">${i18n.t('vipPaymentDesc')}</div>
        </div>

        <div class="flex flex-col gap-2">
          <button onclick="window.monetization.upgradeToVIP()" class="vip-btn w-full py-3.5 px-4 rounded-xl font-black text-slate-900 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:from-amber-200 hover:to-yellow-400 shadow-lg shadow-amber-500/25 transition transform active:scale-95">
            ${i18n.t('vipBtn')}
          </button>
          <button onclick="window.monetization.closeVIPModal()" class="vip-later text-xs text-slate-400 hover:text-slate-200 py-1">
            ${i18n.t('vipLater')}
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(div);
  }
}

export const monetization = new MonetizationEngine();
window.monetization = monetization;
