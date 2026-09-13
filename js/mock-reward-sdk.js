/**
 * Quick Games Studio — Monetag & Rewarded Ad Engine
 * 
 * Supports:
 * 1. Automatic Monetag MultiTag injection (OnClick / Vignette Banner / In-Page Push)
 * 2. High-converting Rewarded Ad flow (DirectLink / SmartLink & Interstitial Modal)
 * 3. Fallback & Anti-block Graceful Recovery (No game crash or dead-locks)
 */

window.QuickGamesAdConfig = {
  // Monetag MultiTag Zone ID & Script URL (Dedicated for quick-games-ez4.pages.dev)
  MONETAG_ZONE_ID: '280186',
  MONETAG_TAG_URL: 'https://quge5.com/88/tag.min.js',
  
  // Optional: Monetag DirectLink / SmartLink URL.
  // If set, clicking Rewarded Ad will open the sponsor offer in a new tab for maximum eCPM.
  MONETAG_DIRECT_LINK: '',
  
  // Enable auto-injection of Monetag tag.min.js
  ENABLE_MULTI_TAG: true
};

// 1. Auto-inject Monetag MultiTag (quge5.com CDN)
(function initMonetagMultiTag() {
  if (!window.QuickGamesAdConfig.ENABLE_MULTI_TAG) return;
  if (!window.QuickGamesAdConfig.MONETAG_ZONE_ID) return;
  
  // Check if tag is already injected
  if (document.querySelector('script[data-zone="' + window.QuickGamesAdConfig.MONETAG_ZONE_ID + '"]')) {
    return;
  }

  try {
    const s = document.createElement('script');
    s.dataset.zone = window.QuickGamesAdConfig.MONETAG_ZONE_ID;
    s.src = window.QuickGamesAdConfig.MONETAG_TAG_URL;
    s.async = true;
    s.setAttribute('data-cfasync', 'false');
    const target = document.body || document.documentElement;
    if (target) {
      target.appendChild(s);
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        (document.body || document.documentElement).appendChild(s);
      });
    }
    console.log('[QuickGamesAdSDK] Monetag MultiTag initialized (Zone: ' + window.QuickGamesAdConfig.MONETAG_ZONE_ID + ')');
  } catch (err) {
    console.warn('[QuickGamesAdSDK] MultiTag injection deferred:', err);
  }
})();

// 2. Global Ad SDK implementation
window.QuickGamesAdSDK = {
  /**
   * Show Rewarded Ad
   * @param {Function} onSuccess Callback when reward is granted
   * @param {Function} onCancel Callback if user dismisses without reward
   */
  showRewardedVideo: function(onSuccess, onCancel) {
    let rewardClaimed = false;

    // Open DirectLink in new tab if configured
    if (window.QuickGamesAdConfig.MONETAG_DIRECT_LINK) {
      try {
        window.open(window.QuickGamesAdConfig.MONETAG_DIRECT_LINK, '_blank');
      } catch (e) {
        console.warn('[QuickGamesAdSDK] DirectLink popup blocked:', e);
      }
    }

    // Determine current language from page or html tag
    const lang = (document.documentElement.lang || navigator.language || 'en').toLowerCase();
    const isZh = lang.startsWith('zh');

    const txtTitle = isZh ? '赞助商广告 · 正在获取奖励' : 'SPONSORED ADVERTISEMENT';
    const txtNetwork = 'Powered by Monetag Ad Network';
    const txtWait = isZh ? '秒后可领取奖励...' : 's until reward...';
    const txtReady = isZh ? '🎉 奖励已就绪！' : '🎉 Reward Ready!';
    const txtClaim = isZh ? '立即领取奖励' : 'Claim Reward';
    const txtClose = isZh ? '放弃奖励' : 'Close';

    // Create Arcade Cyberpunk styled Ad Overlay
    const overlay = document.createElement('div');
    overlay.id = 'quick-games-ad-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(10, 15, 29, 0.96)';
    overlay.style.backdropFilter = 'blur(10px)';
    overlay.style.webkitBackdropFilter = 'blur(10px)';
    overlay.style.zIndex = '9999999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = '#fff';
    overlay.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    overlay.style.padding = '20px';
    overlay.style.boxSizing = 'border-box';
    overlay.style.userSelect = 'none';

    // Ad Box Container
    const box = document.createElement('div');
    box.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))';
    box.style.border = '1px solid rgba(250, 204, 21, 0.3)';
    box.style.boxShadow = '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(250, 204, 21, 0.15)';
    box.style.borderRadius = '20px';
    box.style.padding = '36px 32px';
    box.style.maxWidth = '440px';
    box.style.width = '90%';
    box.style.textAlign = 'center';
    box.style.position = 'relative';

    // Badge
    const badge = document.createElement('div');
    badge.innerText = '⚡ QUICK GAMES ARCADE';
    badge.style.fontSize = '11px';
    badge.style.letterSpacing = '2px';
    badge.style.color = '#facc15';
    badge.style.fontWeight = '800';
    badge.style.marginBottom = '12px';

    // Title
    const title = document.createElement('h3');
    title.innerText = txtTitle;
    title.style.margin = '0 0 8px 0';
    title.style.fontSize = '20px';
    title.style.fontWeight = '700';

    // Subtitle
    const subtitle = document.createElement('p');
    subtitle.innerText = txtNetwork;
    subtitle.style.margin = '0 0 24px 0';
    subtitle.style.fontSize = '12px';
    subtitle.style.color = '#94a3b8';

    // Visual Icon / Progress Ring simulation
    const iconAnim = document.createElement('div');
    iconAnim.innerText = '🎁';
    iconAnim.style.fontSize = '54px';
    iconAnim.style.marginBottom = '16px';
    iconAnim.style.transition = 'transform 0.3s ease';

    // Countdown Text
    let timeLeft = 3;
    const countdownText = document.createElement('div');
    countdownText.style.fontSize = '22px';
    countdownText.style.fontWeight = 'bold';
    countdownText.style.color = '#38bdf8';
    countdownText.style.marginBottom = '28px';
    countdownText.innerText = timeLeft + ' ' + txtWait;

    // Progress Bar Container
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '100%';
    progressContainer.style.height = '6px';
    progressContainer.style.background = 'rgba(255,255,255,0.1)';
    progressContainer.style.borderRadius = '3px';
    progressContainer.style.overflow = 'hidden';
    progressContainer.style.marginBottom = '24px';

    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #10b981)';
    progressBar.style.transition = 'width 1s linear';
    progressContainer.appendChild(progressBar);

    // Action Buttons Row
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '12px';
    btnRow.style.justifyContent = 'center';

    // Cancel / Close early button
    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = txtClose;
    cancelBtn.style.padding = '12px 20px';
    cancelBtn.style.fontSize = '14px';
    cancelBtn.style.background = 'transparent';
    cancelBtn.style.color = '#64748b';
    cancelBtn.style.border = '1px solid rgba(255,255,255,0.1)';
    cancelBtn.style.borderRadius = '10px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.onclick = () => {
      safeCloseOverlay();
      if (onCancel) onCancel();
    };

    // Claim Button (Active after countdown)
    const claimBtn = document.createElement('button');
    claimBtn.innerText = txtClaim;
    claimBtn.style.flex = '1';
    claimBtn.style.padding = '14px 24px';
    claimBtn.style.fontSize = '16px';
    claimBtn.style.fontWeight = '800';
    claimBtn.style.background = 'linear-gradient(135deg, #eab308, #ca8a04)';
    claimBtn.style.color = '#111827';
    claimBtn.style.border = 'none';
    claimBtn.style.borderRadius = '10px';
    claimBtn.style.cursor = 'pointer';
    claimBtn.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.4)';
    claimBtn.style.display = 'none'; // Initially hidden
    claimBtn.onclick = () => {
      rewardClaimed = true;
      safeCloseOverlay();
      if (onSuccess) onSuccess();
    };

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(claimBtn);

    box.appendChild(badge);
    box.appendChild(title);
    box.appendChild(subtitle);
    box.appendChild(iconAnim);
    box.appendChild(countdownText);
    box.appendChild(progressContainer);
    box.appendChild(btnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function safeCloseOverlay() {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }

    // Run Countdown timer
    progressBar.style.width = '33%';
    const timer = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        countdownText.innerText = timeLeft + ' ' + txtWait;
        progressBar.style.width = ((3 - timeLeft) / 3 * 100) + '%';
      } else {
        clearInterval(timer);
        progressBar.style.width = '100%';
        countdownText.innerText = txtReady;
        countdownText.style.color = '#10b981';
        iconAnim.style.transform = 'scale(1.25)';
        cancelBtn.style.display = 'none';
        claimBtn.style.display = 'block';

        // Auto-grant failsafe after 10s if player stays inactive
        setTimeout(() => {
          if (!rewardClaimed && overlay.parentNode) {
            rewardClaimed = true;
            safeCloseOverlay();
            if (onSuccess) onSuccess();
          }
        }, 10000);
      }
    }, 1000);
  }
};
