/**
 * Cyber Slacker: Main Game Controller & State Machine
 */

import { slackerAudio } from './audio.js';
import { i18n } from './i18n.js';
import { CryptoTradingEngine, COIN_DEFS } from './crypto.js';
import { StealthPatrolSystem, BOSS_ROSTER } from './stealth.js';
import { RetroRunnerGame, GOSSIP_MESSAGES } from './minigames.js';
import { SLACKER_UPGRADES } from './shop.js';

export class CyberSlackerGame {
  constructor() {
    this.slackerXp = 0;
    this.shiftTimeRemaining = 60; // 60 seconds per shift
    this.shiftDuration = 60;
    this.shiftLevel = 1; // 1 to 4
    this.isDisguised = false; // False = Slacking (Crypto/Runner), True = Panic Excel
    this.isGameOver = false;
    this.isVictory = false;

    this.xpMultiplier = 1.0;
    this.autoXpPerSec = 0;
    this.suspicionRateMultiplier = 1.0;
    this.praiseBonus = 500;

    this.initDOM();
    this.crypto = new CryptoTradingEngine(this.ui.cryptoCanvas);
    this.runner = new RetroRunnerGame(this.ui.runnerCanvas, (xp) => this.addXp(xp));
    this.stealth = new StealthPatrolSystem(this);

    this.initEvents();
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initDOM() {
    this.ui = {
      startScreen: document.getElementById('startScreen'),
      btnStart: document.getElementById('btnStart'),
      panicOverlay: document.getElementById('panicOverlay'),
      btnPanicToggle: document.getElementById('btnPanicToggle'),
      workstationView: document.getElementById('workstationView'),

      // HUD Displays
      netWorthDisplay: document.getElementById('netWorthDisplay'),
      slackerXpDisplay: document.getElementById('slackerXpDisplay'),
      shiftClockDisplay: document.getElementById('shiftClockDisplay'),
      bossNameDisplay: document.getElementById('bossNameDisplay'),
      suspicionFill: document.getElementById('suspicionFill'),
      statusBadge: document.getElementById('statusBadge'),
      praiseBanner: document.getElementById('praiseBanner'),

      // Tabs
      tabCryptoBtn: document.getElementById('tabCryptoBtn'),
      tabRunnerBtn: document.getElementById('tabRunnerBtn'),
      tabGossipBtn: document.getElementById('tabGossipBtn'),
      tabShopBtn: document.getElementById('tabShopBtn'),

      panelCrypto: document.getElementById('panelCrypto'),
      panelRunner: document.getElementById('panelRunner'),
      panelGossip: document.getElementById('panelGossip'),
      panelShop: document.getElementById('panelShop'),

      // Canvases
      cryptoCanvas: document.getElementById('cryptoCanvas'),
      runnerCanvas: document.getElementById('runnerCanvas'),

      // Trading Controls
      coinSelectButtons: document.getElementById('coinSelectButtons'),
      btnBuy25: document.getElementById('btnBuy25'),
      btnBuy100: document.getElementById('btnBuy100'),
      btnSellAll: document.getElementById('btnSellAll'),
      cryptoPriceText: document.getElementById('cryptoPriceText'),
      cryptoHoldingsText: document.getElementById('cryptoHoldingsText'),

      // Modals
      endModal: document.getElementById('endModal'),
      endTitle: document.getElementById('endTitle'),
      endDesc: document.getElementById('endDesc'),
      finalNetWorth: document.getElementById('finalNetWorth'),
      finalXp: document.getElementById('finalXp'),
      btnPlayAgain: document.getElementById('btnPlayAgain'),
      btnAdRevive: document.getElementById('btnAdRevive'),
      btnShareScore: document.getElementById('btnShareScore'),
      audioToggleBtn: document.getElementById('audioToggleBtn'),
      langSelect: document.getElementById('langSelect'),

      // Shop & Gossip Containers
      shopCardsContainer: document.getElementById('shopCardsContainer'),
      gossipChatList: document.getElementById('gossipChatList')
    };
  }

  initEvents() {
    if (this.ui.btnStart) {
      this.ui.btnStart.addEventListener('click', () => this.startShift());
    }

    let lastPanicTime = 0;
    const safeTogglePanic = () => {
      if (window.isBossBooting) return;
      const now = performance.now();
      if (now - lastPanicTime < 150) return; // 150ms debounce
      lastPanicTime = now;
      this.togglePanicMode();
    };

    if (this.ui.btnPanicToggle) {
      this.ui.btnPanicToggle.addEventListener('click', (e) => {
        e.preventDefault();
        safeTogglePanic();
      });
    }

    // Clicking anywhere on the Excel sheet flips back to work/slacking
    if (this.ui.panicOverlay) {
      this.ui.panicOverlay.addEventListener('click', () => {
        if (this.isDisguised) {
          safeTogglePanic();
        }
      });
    }

    // Keyboard Hotkeys
    window.addEventListener('keydown', (e) => {
      if (window.isBossBooting) return;
      if (e.code === 'Space') {
        e.preventDefault();
        safeTogglePanic();
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (this.runner.active && !this.isDisguised) {
          e.preventDefault();
          this.runner.jump();
        }
      }
    });

    // Double tap canvas or background to quick panic
    if (this.ui.workstationView) {
      this.ui.workstationView.addEventListener('dblclick', () => safeTogglePanic());
    }

    // Runner Canvas Tap/Click to Jump
    if (this.ui.runnerCanvas) {
      this.ui.runnerCanvas.addEventListener('click', (e) => {
        if (window.isBossBooting) return;
        e.preventDefault();
        if (this.runner.active && !this.isDisguised) {
          this.runner.jump();
        }
      });
      this.ui.runnerCanvas.addEventListener('touchstart', (e) => {
        if (this.runner.active && !this.isDisguised) {
          e.preventDefault();
          this.runner.jump();
        }
      }, { passive: false });
    }

    // Tab Navigation
    const switchTab = (tabName) => {
      slackerAudio.playKeyClick();
      [this.ui.panelCrypto, this.ui.panelRunner, this.ui.panelGossip, this.ui.panelShop].forEach(p => {
        if (p) p.style.display = 'none';
      });
      [this.ui.tabCryptoBtn, this.ui.tabRunnerBtn, this.ui.tabGossipBtn, this.ui.tabShopBtn].forEach(b => {
        if (b) b.classList.remove('active');
      });

      this.runner.active = false;

      if (tabName === 'crypto') {
        if (this.ui.panelCrypto) this.ui.panelCrypto.style.display = 'block';
        if (this.ui.tabCryptoBtn) this.ui.tabCryptoBtn.classList.add('active');
        this.crypto.drawCandlestickChart();
      } else if (tabName === 'runner') {
        if (this.ui.panelRunner) this.ui.panelRunner.style.display = 'block';
        if (this.ui.tabRunnerBtn) this.ui.tabRunnerBtn.classList.add('active');
        this.runner.active = true;
      } else if (tabName === 'gossip') {
        if (this.ui.panelGossip) this.ui.panelGossip.style.display = 'block';
        if (this.ui.tabGossipBtn) this.ui.tabGossipBtn.classList.add('active');
      } else if (tabName === 'shop') {
        if (this.ui.panelShop) this.ui.panelShop.style.display = 'block';
        if (this.ui.tabShopBtn) this.ui.tabShopBtn.classList.add('active');
        this.renderShop();
      }
    };

    if (this.ui.tabCryptoBtn) this.ui.tabCryptoBtn.addEventListener('click', () => switchTab('crypto'));
    if (this.ui.tabRunnerBtn) this.ui.tabRunnerBtn.addEventListener('click', () => switchTab('runner'));
    if (this.ui.tabGossipBtn) this.ui.tabGossipBtn.addEventListener('click', () => switchTab('gossip'));
    if (this.ui.tabShopBtn) this.ui.tabShopBtn.addEventListener('click', () => switchTab('shop'));

    // Coin Selectors
    if (this.ui.coinSelectButtons) {
      this.ui.coinSelectButtons.querySelectorAll('.coin-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          this.ui.coinSelectButtons.querySelectorAll('.coin-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.crypto.selectedCoin = btn.getAttribute('data-coin');
          this.crypto.drawCandlestickChart();
          this.updateTradingHUD();
        });
      });
    }

    if (this.ui.btnBuy25) {
      this.ui.btnBuy25.addEventListener('click', () => {
        if (this.crypto.buy(this.crypto.selectedCoin, 25)) this.addXp(10);
      });
    }
    if (this.ui.btnBuy100) {
      this.ui.btnBuy100.addEventListener('click', () => {
        if (this.crypto.buy(this.crypto.selectedCoin, 100)) this.addXp(30);
      });
    }
    if (this.ui.btnSellAll) {
      this.ui.btnSellAll.addEventListener('click', () => {
        if (this.crypto.sellAll(this.crypto.selectedCoin) > 0) this.addXp(15);
      });
    }

    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        }
      });
    }

    if (this.ui.btnPlayAgain) {
      this.ui.btnPlayAgain.addEventListener('click', () => {
        this.slackerXp = 0;
        this.shiftLevel = 1;
        this.crypto.cash = 500;
        this.crypto.portfolio = {};
        SLACKER_UPGRADES.forEach(u => u.purchased = false);
        this.startShift();
      });
    }

    if (this.ui.btnShareScore) {
      this.ui.btnShareScore.addEventListener('click', () => {
        const text = `💼 Cyber Slacker: Office Battle Royale
💰 Net Worth: $${this.crypto.getTotalNetWorth()}
⭐ Slacker XP: ${Math.floor(this.slackerXp)}
🏢 Level: ${this.shiftLevel}/4 (Boss Evaded!)

Play Free:
👉 https://quick-games-ez4.pages.dev/games/04-cyber-slacker/`;
        navigator.clipboard.writeText(text).then(() => alert(i18n.t('copiedAlert'))).catch(() => prompt('Score:', text));
      });
    }

    if (this.ui.audioToggleBtn) {
      this.ui.audioToggleBtn.addEventListener('click', () => {
        const muted = slackerAudio.toggleMute();
        this.ui.audioToggleBtn.innerText = muted ? '🔇' : '🔊';
      });
    }

    if (this.ui.langSelect) {
      this.ui.langSelect.value = i18n.currentLang;
      this.ui.langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        this.renderShop();
      });
    }

    this.renderGossipChat();
    this.renderShop();
  }

  startShift() {
    this.isGameOver = false;
    this.hasRevived = false;
    this.isVictory = false;
    this.shiftTimeRemaining = 60;
    this.isDisguised = false;
    this.stealth.setBossLevel(this.shiftLevel - 1);

    if (this.ui.startScreen) this.ui.startScreen.style.display = 'none';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';
    if (this.ui.panicOverlay) this.ui.panicOverlay.style.display = 'none';

    slackerAudio.ensureContext();
    this.updateHUD();
  }

  togglePanicMode() {
    if (this.isGameOver || this.isVictory) return;
    this.isDisguised = !this.isDisguised;
    slackerAudio.playPanicWhoosh();

    if (this.ui.panicOverlay) {
      this.ui.panicOverlay.style.display = this.isDisguised ? 'flex' : 'none';
    }

    if (this.ui.btnPanicToggle) {
      this.ui.btnPanicToggle.classList.toggle('active', this.isDisguised);
      this.ui.btnPanicToggle.innerText = this.isDisguised ? i18n.t('panicActive') : i18n.t('panicBtn');
    }
  }

  addXp(amount) {
    this.slackerXp += amount * this.xpMultiplier;
  }

  handleBustedByBoss() {
    this.isGameOver = true;
    slackerAudio.playBustedSiren();
    if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('bustedTitle');
    if (this.ui.endDesc) this.ui.endDesc.innerText = i18n.t('bustedDesc');
    if (this.ui.finalNetWorth) this.ui.finalNetWorth.innerText = `$${this.crypto.getTotalNetWorth()}`;
    if (this.ui.finalXp) this.ui.finalXp.innerText = Math.floor(this.slackerXp);
    
    if (this.ui.btnAdRevive) {
      this.ui.btnAdRevive.style.display = this.hasRevived ? 'none' : 'flex';
      this.ui.btnAdRevive.style.width = '100%';
    }
    
    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
  }

  revivePlayer() {
    this.isGameOver = false;
    this.hasRevived = true;
    this.stealth.reset();
    
    // Reset boss position completely
    this.stealth.currentDist = 120;
    this.stealth.alertness = 0;
    this.stealth.isApproaching = false;
    
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';
  }

  handleBossInspectionPassed() {
    slackerAudio.playPraiseDing();
    this.crypto.cash += this.praiseBonus;
    this.addXp(100);

    if (this.ui.praiseBanner) {
      this.ui.praiseBanner.innerText = i18n.t('praiseBanner');
      this.ui.praiseBanner.classList.add('active');
      setTimeout(() => {
        if (this.ui.praiseBanner) this.ui.praiseBanner.classList.remove('active');
      }, 3000);
    }
  }

  renderGossipChat() {
    if (!this.ui.gossipChatList) return;
    this.ui.gossipChatList.innerHTML = '';
    GOSSIP_MESSAGES.forEach(msg => {
      const card = document.createElement('div');
      card.className = 'gossip-msg-card';
      card.innerHTML = `
        <div class="gossip-sender">${msg.sender}</div>
        <div class="gossip-text">${msg.text}</div>
        <div class="gossip-replies"></div>
      `;
      const repliesContainer = card.querySelector('.gossip-replies');
      msg.replies.forEach(r => {
        const btn = document.createElement('button');
        btn.className = 'reply-btn';
        btn.innerText = r.text;
        btn.addEventListener('click', () => {
          slackerAudio.playKeyClick();
          this.addXp(r.xp);
          btn.disabled = true;
          btn.style.opacity = '0.5';
        });
        repliesContainer.appendChild(btn);
      });
      this.ui.gossipChatList.appendChild(card);
    });
  }

  renderShop() {
    if (!this.ui.shopCardsContainer) return;
    this.ui.shopCardsContainer.innerHTML = '';
    const lang = i18n.currentLang;

    SLACKER_UPGRADES.forEach(upg => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-icon">${upg.icon}</div>
        <div class="shop-info">
          <div class="shop-name">${upg.name[lang] || upg.name.en}</div>
          <div class="shop-desc">${upg.desc[lang] || upg.desc.en}</div>
        </div>
        <button class="buy-btn" ${upg.purchased || this.crypto.cash < upg.cost ? 'disabled' : ''}>
          ${upg.purchased ? '✅ Owned' : `💰 $${upg.cost}`}
        </button>
      `;

      const btn = card.querySelector('.buy-btn');
      btn.addEventListener('click', () => {
        if (!upg.purchased && this.crypto.cash >= upg.cost) {
          this.crypto.cash -= upg.cost;
          upg.purchased = true;
          upg.apply(this);
          slackerAudio.playCashRegister();
          this.renderShop();
          this.updateHUD();
        }
      });
      this.ui.shopCardsContainer.appendChild(card);
    });
  }

  updateTradingHUD() {
    const coin = this.crypto.selectedCoin;
    const price = this.crypto.prices[coin] || 0;
    const units = this.crypto.portfolio[coin] || 0;
    if (this.ui.cryptoPriceText) this.ui.cryptoPriceText.innerText = `$${price.toFixed(4)}`;
    if (this.ui.cryptoHoldingsText) this.ui.cryptoHoldingsText.innerText = `${units.toFixed(2)} (${COIN_DEFS[coin].symbol})`;
  }

  updateHUD() {
    if (this.ui.netWorthDisplay) this.ui.netWorthDisplay.innerText = `$${this.crypto.getTotalNetWorth()}`;
    if (this.ui.slackerXpDisplay) this.ui.slackerXpDisplay.innerText = Math.floor(this.slackerXp);

    // Clock: 9:00 AM to 5:00 PM mapped across 60 seconds
    const elapsed = this.shiftDuration - this.shiftTimeRemaining;
    const hour = 9 + Math.floor((elapsed / this.shiftDuration) * 8);
    const minute = Math.floor(((elapsed / this.shiftDuration) * 480) % 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
    if (this.ui.shiftClockDisplay) this.ui.shiftClockDisplay.innerText = timeStr;

    if (this.ui.bossNameDisplay) this.ui.bossNameDisplay.innerText = `${this.stealth.currentBoss.icon} ${this.stealth.currentBoss.name}`;
    if (this.ui.suspicionFill) this.ui.suspicionFill.style.width = `${this.stealth.suspicion}%`;

    if (this.ui.statusBadge) {
      if (this.stealth.state === 'CLEAR' || this.stealth.state === 'LEAVING') {
        this.ui.statusBadge.innerText = i18n.t('statusSafe');
        this.ui.statusBadge.style.color = '#22c55e';
      } else if (this.stealth.state === 'APPROACHING') {
        this.ui.statusBadge.innerText = i18n.t('statusWarning');
        this.ui.statusBadge.style.color = '#facc15';
      } else if (this.stealth.state === 'INSPECTING') {
        this.ui.statusBadge.innerText = i18n.t('statusDanger');
        this.ui.statusBadge.style.color = '#ef4444';
      }
    }

    this.updateTradingHUD();
  }

  loop(timestamp) {
    const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    if (!this.isGameOver && !this.isVictory) {
      this.shiftTimeRemaining -= dt;
      this.stealth.update(dt);
      this.runner.update(dt);

      // Auto typing macro
      if (this.autoXpPerSec > 0) {
        this.addXp(this.autoXpPerSec * dt);
      }

      // Check shift completion
      if (this.shiftTimeRemaining <= 0) {
        if (this.shiftLevel < BOSS_ROSTER.length) {
          this.shiftLevel++;
          slackerAudio.playPromotion();
          alert(`🎉 SHIFT COMPLETED! Promoted to Level ${this.shiftLevel}! Boss is getting suspicious.`);
          this.startShift();
        } else {
          this.isVictory = true;
          slackerAudio.playPromotion();
          if (this.ui.endTitle) this.ui.endTitle.innerText = i18n.t('victoryTitle');
          if (this.ui.endDesc) this.ui.endDesc.innerText = i18n.t('victoryDesc');
          if (this.ui.finalNetWorth) this.ui.finalNetWorth.innerText = `$${this.crypto.getTotalNetWorth()}`;
          if (this.ui.finalXp) this.ui.finalXp.innerText = Math.floor(this.slackerXp);
          if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
        }
      }

      this.updateHUD();
    }

    requestAnimationFrame(this.loop);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new CyberSlackerGame();
  i18n.applyTranslations();
});
