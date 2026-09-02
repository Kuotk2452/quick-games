import os

def update_monetization():
    file_path = "games/01-emoji-craft/js/monetization.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update claimDailyDoubleReward
    old_claim = """  claimDailyDoubleReward() {
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
  }"""

    new_claim = """  claimDailyDoubleReward() {
    const btn = document.getElementById('btn-daily-ad-double');
    if (btn && btn.disabled) return; // Anti-spam: Ignore if already disabled

    if (this.isVIP) {
      if (btn) {
        btn.innerHTML = `<span>👑 ${i18n.t('rewardClaimed') || 'VIP Instant 2x Claimed!'}</span>`;
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-default');
      }
      this.addFreeHint(3);
      if (window.gameApp) window.gameApp.updateHintBadge();
      return;
    }

    // Pre-disable to prevent rapid clicking spam
    if (btn) {
      btn.disabled = true;
      btn.classList.add('opacity-75', 'cursor-default');
    }

    const successText = `<span>✅ ${i18n.t('rewardClaimed') || 'Double Rewards Claimed'} (+3 💡)</span>`;

    if (window.QuickGamesAdSDK) {
      window.QuickGamesAdSDK.showRewardedVideo(() => {
        if (btn) {
          btn.innerHTML = successText;
        }
        this.addFreeHint(3);
        if (window.gameApp) window.gameApp.updateHintBadge();
      });
    } else {
      this.showRewardedVideo(i18n.t('hint') || 'Double Daily Gems', () => {
        if (btn) {
          btn.innerHTML = successText;
        }
        this.addFreeHint(3);
        if (window.gameApp) window.gameApp.updateHintBadge();
      });
    }
  }"""
    content = content.replace(old_claim, new_claim)
    
    # 2. Update closeAdModal to re-enable button if cancelled
    old_close = """  closeAdModal() {
    const modal = document.getElementById('rewarded-ad-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    if (this.adTimer) clearInterval(this.adTimer);
  }"""

    new_close = """  closeAdModal() {
    const modal = document.getElementById('rewarded-ad-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
    if (this.adTimer) clearInterval(this.adTimer);
    
    // Re-enable double reward button if the ad was closed before claiming
    const btn = document.getElementById('btn-daily-ad-double');
    if (btn && btn.disabled && !btn.innerHTML.includes('✅') && !btn.innerHTML.includes('👑')) {
      btn.disabled = false;
      btn.classList.remove('opacity-75', 'cursor-default');
    }
    this.onRewardCallback = null;
  }"""
    content = content.replace(old_close, new_close)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)


def update_game():
    file_path = "games/01-emoji-craft/js/game.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    old_constructor = """  constructor() {
    this.unlockedIds = this.loadUnlockedIds();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.boardElements = [];
    this.nextUid = 1;
    this.dragOffset = { x: 0, y: 0 };"""
    new_constructor = """  constructor() {
    this.unlockedIds = this.loadUnlockedIds();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.boardElements = [];
    this.nextUid = 1;
    this.dragOffset = { x: 0, y: 0 };
    this.shownHints = new Set();"""
    content = content.replace(old_constructor, new_constructor)

    old_reveal = """  revealOneHint() {
    const unlockedIds = new Set(this.unlockedIds);
    
    const availableRecipes = RECIPES_DATA.filter(r => 
      unlockedIds.has(r.a) && unlockedIds.has(r.b) && !unlockedIds.has(r.result.id)
    );

    if (availableRecipes.length > 0) {
      const hint = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
      const elA = enrichElement({ id: hint.a });
      const elB = enrichElement({ id: hint.b });
      this.showHintModal(i18n.t('hintMessage', { a: `${elA.emoji} ${elA.name}`, b: `${elB.emoji} ${elB.name}` }));
      sounds.playSuccess();
    } else {
      this.showHintModal(i18n.t('allUnlocked'));
    }
  }"""
    
    new_reveal = """  revealOneHint() {
    const unlockedIds = new Set(this.unlockedIds);
    
    const availableRecipes = RECIPES_DATA.filter(r => 
      unlockedIds.has(r.a) && unlockedIds.has(r.b) && !unlockedIds.has(r.result.id)
    );

    if (availableRecipes.length > 0) {
      let unseenRecipes = availableRecipes.filter(r => !this.shownHints.has(`${r.a}_${r.b}`));
      
      // Reset hints if all possible combinations have been shown
      if (unseenRecipes.length === 0) {
        this.shownHints.clear();
        unseenRecipes = availableRecipes;
      }
      
      const hint = unseenRecipes[Math.floor(Math.random() * unseenRecipes.length)];
      this.shownHints.add(`${hint.a}_${hint.b}`);
      
      const elA = enrichElement({ id: hint.a });
      const elB = enrichElement({ id: hint.b });
      this.showHintModal(i18n.t('hintMessage', { a: `${elA.emoji} ${elA.name}`, b: `${elB.emoji} ${elB.name}` }));
      sounds.playSuccess();
    } else {
      this.showHintModal(i18n.t('allUnlocked'));
    }
  }"""
    content = content.replace(old_reveal, new_reveal)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)


def update_i18n():
    file_path = "games/01-emoji-craft/js/i18n.js"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add rewardClaimed to en
    content = content.replace(
      'footerVersion: "Emoji Craft v1.0.0 · Instant Free Browser Play",',
      'rewardClaimed: "Double Rewards Claimed",\n    footerVersion: "Emoji Craft v1.0.0 · Instant Free Browser Play",'
    )
    # Add to zh
    content = content.replace(
      'footerVersion: "Emoji Craft v1.0.0 · 零门槛即开即玩",',
      'rewardClaimed: "双倍奖励已领取",\n    footerVersion: "Emoji Craft v1.0.0 · 零门槛即开即玩",'
    )
    # Add to es
    content = content.replace(
      'footerVersion: "Emoji Craft v1.0.0 · Juego Instantáneo en Navegador",',
      'rewardClaimed: "Recompensas Dobles Reclamadas",\n    footerVersion: "Emoji Craft v1.0.0 · Juego Instantáneo en Navegador",'
    )
    # Add to ja
    content = content.replace(
      'footerVersion: "Emoji Craft v1.0.0 · ブラウザで遊べる無料ゲーム",',
      'rewardClaimed: "2倍の報酬を獲得しました",\n    footerVersion: "Emoji Craft v1.0.0 · ブラウザで遊べる無料ゲーム",'
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_monetization()
    update_game()
    try:
        update_i18n()
    except Exception as e:
        print(f"Error updating i18n: {e}")
