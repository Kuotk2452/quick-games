/**
 * Emoji Craft: Infinite Fusion - Main Game Controller
 * Enhanced with Game Juice: Jelly Physics, Magnetic Snapping, Rare Screen Shake & Lo-Fi BGM
 */

import { INITIAL_ELEMENTS, findRecipe, getAllDiscoverableElements, enrichElement, RECIPES_DATA } from './recipes.js';
import { sounds } from './audio.js';
import { particles } from './particles.js';
import { monetization } from './monetization.js';
import { dailyQuest } from './daily.js';
import { i18n } from './i18n.js';

const RARE_CATEGORIES = new Set(['cosmic', 'fantasy']);
const RARE_IDS = new Set(['ai', 'agi', 'singularity', 'god', 'black_hole', 'alien', 'moon_landing', 'dragon', 'phoenix', 'detective_dog', 'cyber_cat']);

class GameApp {
  constructor() {
    this.unlockedIds = this.loadUnlockedIds();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.boardElements = [];
    this.nextUid = 1;
    this.dragOffset = { x: 0, y: 0 };
    this.shownHints = new Set();

    this.initDOM();
    this.applyTranslations();
    this.renderSidebar();
    this.updateStats();
    this.setupEventListeners();
  }

  loadUnlockedIds() {
    const saved = localStorage.getItem('emoji_craft_unlocked_ids');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_ELEMENTS.map(e => e.id);
  }

  saveUnlockedIds() {
    localStorage.setItem('emoji_craft_unlocked_ids', JSON.stringify(this.unlockedIds));
    this.updateStats();
  }

  getUnlockedElements() {
    const all = getAllDiscoverableElements();
    const idSet = new Set(this.unlockedIds);
    return all.filter(e => idSet.has(e.id));
  }

  initDOM() {
    this.factoryBootScreen = document.getElementById('factoryBootScreen');
    this.btnMainPower = document.getElementById('btnMainPower');
    this.boardEl = document.getElementById('crafting-board');
    this.sidebarEl = document.getElementById('elements-grid');
    this.canvasEl = document.getElementById('particle-canvas');
    this.statsCountEl = document.getElementById('stats-unlocked-count');
    this.statsTotalEl = document.getElementById('stats-total-count');
    this.dailyTargetEmojiEl = document.getElementById('daily-target-emoji');
    this.dailyTargetNameEl = document.getElementById('daily-target-name');
    this.mobileDailyEmoji = document.getElementById('mobile-daily-target-emoji');
    this.hintCountBadge = document.getElementById('hint-count-badge');
    this.vipBadgeEl = document.getElementById('vip-status-badge');
    this.langSelect = document.getElementById('language-select');
    this.bgmBtn = document.getElementById('btn-bgm');

    if (this.canvasEl) {
      particles.init(this.canvasEl);
    }

    if (this.langSelect) {
      this.langSelect.value = i18n.getLang();
      this.langSelect.addEventListener('change', (e) => {
        this.switchLanguage(e.target.value);
      });
    }

    this.updateDailyQuestUI();
    this.updateVipBadgeUI();
    this.updateHintBadge();
  }

  switchLanguage(lang) {
    i18n.setLanguage(lang);
    this.applyTranslations();
    this.renderSidebar();
    this.updateDailyQuestUI();
    this.updateVipBadgeUI();
    this.updateBoardItemTexts();
    sounds.playPop();
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = i18n.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = i18n.t(key);
    });
  }

  updateDailyQuestUI() {
    const target = dailyQuest.getTargetElement();
    if (this.dailyTargetEmojiEl) this.dailyTargetEmojiEl.textContent = target.emoji;
    if (this.dailyTargetNameEl) this.dailyTargetNameEl.textContent = target.name;
    if (this.mobileDailyEmoji) this.mobileDailyEmoji.textContent = target.emoji;
  }

  updateVipBadgeUI() {
    if (!this.vipBadgeEl) return;
    if (monetization.isUserVIP()) {
      this.vipBadgeEl.textContent = i18n.t('vipBadge');
      this.vipBadgeEl.className = 'px-2.5 py-1 text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full cursor-pointer';
    } else {
      this.vipBadgeEl.textContent = i18n.t('upgradeVip');
      this.vipBadgeEl.className = 'px-2.5 py-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full hover:bg-indigo-500/30 cursor-pointer transition';
    }
  }

  updateHintBadge() {
    if (!this.hintCountBadge) return;
    if (monetization.isUserVIP()) {
      this.hintCountBadge.textContent = '∞';
    } else {
      this.hintCountBadge.textContent = monetization.getFreeHints().toString();
    }
  }

  updateStats() {
    const allTotal = getAllDiscoverableElements().length;
    if (this.statsCountEl) this.statsCountEl.textContent = this.unlockedIds.length;
    if (this.statsTotalEl) this.statsTotalEl.textContent = allTotal;
  }

  updateBoardItemTexts() {
    this.boardElements.forEach(item => {
      const enriched = enrichElement(item);
      item.name = enriched.name;
      item.desc = enriched.desc;
      const textSpan = item.el.querySelector('.item-name');
      if (textSpan) textSpan.textContent = enriched.name;
    });
  }

  renderSidebar() {
    if (!this.sidebarEl) return;
    this.sidebarEl.innerHTML = '';

    let unlocked = this.getUnlockedElements();

    if (this.activeCategory !== 'all') {
      unlocked = unlocked.filter(el => el.category === this.activeCategory);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      unlocked = unlocked.filter(el => el.name.toLowerCase().includes(q) || el.emoji.includes(q));
    }

    unlocked.forEach(element => {
      const card = document.createElement('div');
      card.className = 'element-card flex items-center gap-2 p-2.5 bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 rounded-xl cursor-grab active:cursor-grabbing select-none transition-all transform hover:-translate-y-0.5 hover:shadow-lg hover:border-amber-400/40';
      card.innerHTML = `
        <span class="text-2xl">${element.emoji}</span>
        <span class="text-xs font-semibold text-slate-200 truncate">${element.name}</span>
      `;

      card.draggable = true;
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ id: element.id, emoji: element.emoji, category: element.category }));
        sounds.playPop();
      });

      card.addEventListener('click', () => {
        const boardRect = this.boardEl.getBoundingClientRect();
        const randX = boardRect.width / 2 + (Math.random() - 0.5) * 140;
        const randY = boardRect.height / 2 + (Math.random() - 0.5) * 140;
        this.spawnElementOnBoard(element, randX, randY);
        sounds.playPop();
      });

      this.sidebarEl.appendChild(card);
    });
  }

  spawnElementOnBoard(elementData, x, y, animate = true) {
    const enriched = enrichElement(elementData);
    const uid = this.nextUid++;
    const el = document.createElement('div');
    el.className = `board-item absolute flex items-center gap-2 px-3.5 py-2 bg-slate-800/90 border border-slate-600/80 rounded-2xl cursor-move shadow-xl select-none backdrop-blur-sm ${animate ? 'scale-in' : ''}`;
    el.innerHTML = `
      <span class="text-2xl">${enriched.emoji}</span>
      <span class="item-name text-xs font-bold text-white">${enriched.name}</span>
    `;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    const boardItem = {
      uid,
      id: enriched.id,
      name: enriched.name,
      emoji: enriched.emoji,
      category: enriched.category,
      desc: enriched.desc,
      x,
      y,
      el
    };

    this.boardElements.push(boardItem);
    this.boardEl.appendChild(el);

    this.bindBoardItemEvents(boardItem);
    return boardItem;
  }

  bindBoardItemEvents(item) {
    let isDragging = false;

    const onPointerDown = (e) => {
      isDragging = true;
      sounds.playPop();

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const rect = item.el.getBoundingClientRect();
      this.dragOffset.x = clientX - rect.left;
      this.dragOffset.y = clientY - rect.top;

      item.el.style.zIndex = '100';

      const onPointerMove = (moveEvent) => {
        if (!isDragging) return;
        const curX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
        const curY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);

        const boardRect = this.boardEl.getBoundingClientRect();
        let nextX = curX - boardRect.left - this.dragOffset.x;
        let nextY = curY - boardRect.top - this.dragOffset.y;

        nextX = Math.max(0, Math.min(boardRect.width - 90, nextX));
        nextY = Math.max(0, Math.min(boardRect.height - 45, nextY));

        item.x = nextX;
        item.y = nextY;
        item.el.style.left = `${nextX}px`;
        item.el.style.top = `${nextY}px`;

        // 磁力吸附与呼吸光晕检测 (Magnetic Glow Feedback)
        this.checkProximityGlow(item);
      };

      const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        item.el.style.zIndex = '10';

        this.clearAllGlow();

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);

        this.checkCombination(item);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    };

    item.el.addEventListener('pointerdown', onPointerDown);
    item.el.addEventListener('touchstart', onPointerDown, { passive: false });

    item.el.addEventListener('dblclick', () => {
      this.spawnElementOnBoard(item, item.x + 25, item.y + 25);
      sounds.playPop();
    });
  }

  checkProximityGlow(draggedItem) {
    const dragRect = draggedItem.el.getBoundingClientRect();
    const dragCenter = { x: dragRect.left + dragRect.width / 2, y: dragRect.top + dragRect.height / 2 };

    for (let target of this.boardElements) {
      if (target.uid === draggedItem.uid) continue;
      const tRect = target.el.getBoundingClientRect();
      const tCenter = { x: tRect.left + tRect.width / 2, y: tRect.top + tRect.height / 2 };
      const dist = Math.hypot(dragCenter.x - tCenter.x, dragCenter.y - tCenter.y);

      if (dist < 90) {
        target.el.classList.add('magnetic-glow');
        draggedItem.el.classList.add('magnetic-glow');
      } else {
        target.el.classList.remove('magnetic-glow');
      }
    }
  }

  clearAllGlow() {
    this.boardElements.forEach(item => {
      if (item.el) item.el.classList.remove('magnetic-glow');
    });
  }

  checkCombination(droppedItem) {
    const dropRect = droppedItem.el.getBoundingClientRect();
    const dropCenter = {
      x: dropRect.left + dropRect.width / 2,
      y: dropRect.top + dropRect.height / 2
    };

    for (let target of this.boardElements) {
      if (target.uid === droppedItem.uid) continue;

      const targetRect = target.el.getBoundingClientRect();
      const targetCenter = {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2
      };

      const distance = Math.hypot(dropCenter.x - targetCenter.x, dropCenter.y - targetCenter.y);

      if (distance < 55) {
        const recipeResult = findRecipe(droppedItem.id, target.id);

        if (recipeResult) {
          this.executeMerge(droppedItem, target, recipeResult);
        } else {
          sounds.playFail();
          droppedItem.el.classList.add('shake-fail');
          setTimeout(() => droppedItem.el.classList.remove('shake-fail'), 400);
        }
        return;
      }
    }
  }

  executeMerge(itemA, itemB, resultElement) {
    const spawnX = (itemA.x + itemB.x) / 2;
    const spawnY = (itemA.y + itemB.y) / 2;

    this.removeBoardItem(itemA);
    this.removeBoardItem(itemB);

    const newItem = this.spawnElementOnBoard(resultElement, spawnX, spawnY);
    const rect = newItem.el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 果冻形变动效
    newItem.el.classList.add('jelly-bounce');

    // 检查是否为稀有/神话史诗元素
    const isRare = RARE_CATEGORIES.has(resultElement.category) || RARE_IDS.has(resultElement.id);

    if (isRare) {
      // 史诗级特效：全屏震动 + 彩虹冲击波 + 空灵天籁
      sounds.playRareDiscovery();
      particles.epicBurstAt(centerX, centerY);
      particles.showFloatingText(centerX, centerY - 20, '🌟 EPIC FUSION!', '#f59e0b');

      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 450);
    } else {
      // 常规合成
      sounds.playSuccess();
      particles.burstAt(centerX, centerY);
      particles.showFloatingText(centerX, centerY - 15, '+1 Discovery', '#38bdf8');
    }

    const isNew = !this.unlockedIds.includes(resultElement.id);
    if (isNew) {
      this.unlockedIds.push(resultElement.id);
      this.saveUnlockedIds();
      this.renderSidebar();
      this.showToast(i18n.t('firstDiscovery', { emoji: resultElement.emoji, name: resultElement.name }), 'success');
    }

    dailyQuest.recordStep(resultElement);
  }

  removeBoardItem(item) {
    if (item.el && item.el.parentNode) {
      item.el.parentNode.removeChild(item.el);
    }
    this.boardElements = this.boardElements.filter(b => b.uid !== item.uid);
  }

  clearBoard() {
    this.boardElements.forEach(item => {
      if (item.el && item.el.parentNode) item.el.parentNode.removeChild(item.el);
    });
    this.boardElements = [];
    sounds.playPop();
  }

  giveHint() {
    const canUse = monetization.useHint();
    if (!canUse) {
      monetization.showRewardedVideo(i18n.t('hint'), () => {
        this.updateHintBadge();
        this.revealOneHint();
      });
      return;
    }

    this.updateHintBadge();
    this.revealOneHint();
  }

  revealOneHint() {
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
  }

  showHintModal(text) {
    const modal = document.getElementById('hint-dialog-modal');
    if (modal) {
      document.getElementById('hint-dialog-title').textContent = i18n.t('ancientScroll');
      document.getElementById('hint-dialog-content').textContent = text;
      document.getElementById('hint-dialog-btn').textContent = i18n.t('gotIt');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeHintModal() {
    const modal = document.getElementById('hint-dialog-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl backdrop-blur-md transition-all duration-300 ${
      type === 'success' 
        ? 'bg-emerald-500/90 text-white border border-emerald-300/40' 
        : 'bg-slate-800/90 text-white border border-slate-700/60'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  openCodexModal() {
    const modal = document.getElementById('codex-modal');
    const grid = document.getElementById('codex-grid');
    if (!modal || !grid) return;

    grid.innerHTML = '';
    const all = getAllDiscoverableElements();
    const unlockedSet = new Set(this.unlockedIds);

    all.forEach(item => {
      const isUnlocked = unlockedSet.has(item.id);
      const card = document.createElement('div');
      card.className = `p-3 rounded-xl border flex flex-col items-center justify-center text-center transition ${
        isUnlocked 
          ? 'bg-slate-800/90 border-slate-700 text-white shadow' 
          : 'bg-slate-900/60 border-slate-800/80 text-slate-500 opacity-60'
      }`;
      card.innerHTML = `
        <span class="text-3xl mb-1">${isUnlocked ? item.emoji : '❓'}</span>
        <span class="text-xs font-bold">${isUnlocked ? item.name : '???'}</span>
        <span class="text-[10px] text-slate-400 mt-0.5 line-clamp-1">${isUnlocked ? item.desc : '...'}</span>
      `;
      grid.appendChild(card);
    });

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  closeCodexModal() {
    const modal = document.getElementById('codex-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  setupEventListeners() {
    if (this.btnMainPower) {
      this.btnMainPower.addEventListener('click', () => {
        const bootEmoji = document.getElementById('bootEmoji');
        if (bootEmoji) {
          bootEmoji.textContent = '🤩';
          bootEmoji.classList.add('scale-125');
        }
        
        sounds.playPop();
        
        // Wait briefly for the 'waking up' expression, then chime and fade
        setTimeout(() => {
          sounds.playSuccess();
          this.factoryBootScreen.classList.add('opacity-0', 'pointer-events-none');
          
          // Optionally fade out instructions slightly faster
          const inst = document.getElementById('bootInstructions');
          if (inst) inst.classList.add('opacity-0', 'scale-95');

          sounds.startBGM(); 
        }, 500);
      });
    }

    this.boardEl.addEventListener('dragover', (e) => e.preventDefault());
    this.boardEl.addEventListener('drop', (e) => {
      e.preventDefault();
      const rawData = e.dataTransfer.getData('text/plain');
      if (rawData) {
        try {
          const element = JSON.parse(rawData);
          const boardRect = this.boardEl.getBoundingClientRect();
          const dropX = e.clientX - boardRect.left - 45;
          const dropY = e.clientY - boardRect.top - 20;
          this.spawnElementOnBoard(element, Math.max(0, dropX), Math.max(0, dropY));
        } catch (err) {}
      }
    });

    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-btn').forEach(b => {
          b.classList.remove('bg-amber-400', 'text-slate-900', 'font-bold');
          b.classList.add('text-slate-400', 'hover:bg-slate-800');
        });
        const target = e.currentTarget;
        target.classList.add('bg-amber-400', 'text-slate-900', 'font-bold');
        target.classList.remove('text-slate-400', 'hover:bg-slate-800');

        this.activeCategory = target.dataset.category;
        this.renderSidebar();
        sounds.playPop();
      });
    });

    const searchInput = document.getElementById('element-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderSidebar();
      });
    }

    const clearBtn = document.getElementById('btn-clear-board');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearBoard());
    }

    const hintBtn = document.getElementById('btn-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => this.giveHint());
    }

    // 静音/音效开关
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = sounds.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        muteBtn.title = isMuted ? i18n.t('unmute') : i18n.t('mute');
      });
    }

    // 治愈系 Lo-Fi 背景音乐开关
    if (this.bgmBtn) {
      this.bgmBtn.addEventListener('click', () => {
        const isPlaying = sounds.toggleBGM();
        if (isPlaying) {
          this.bgmBtn.classList.add('bg-amber-400/20', 'text-amber-300', 'border-amber-400/50', 'animate-pulse');
          this.bgmBtn.classList.remove('bg-slate-800', 'text-slate-400');
          this.showToast('🎵 Lo-Fi 治愈背景音乐已开启', 'info');
        } else {
          this.bgmBtn.classList.remove('bg-amber-400/20', 'text-amber-300', 'border-amber-400/50', 'animate-pulse');
          this.bgmBtn.classList.add('bg-slate-800', 'text-slate-400');
          this.showToast('🎵 背景音乐已暂停', 'info');
        }
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new GameApp();
});
