/**
 * Circus Rush 3D: Carnival Workshop & Upgrade Store Manager
 */

export const UPGRADE_ITEMS = [
  {
    id: 'cloak',
    icon: '🦹‍♂️',
    nameKey: 'upgradeCloakName',
    descKey: 'upgradeCloakDesc',
    maxLevel: 3,
    baseCost: 800,
    costMultiplier: 2.2,
    effectValues: [0, 1, 2, 3] // Shield hits
  },
  {
    id: 'magnet',
    icon: '🧲',
    nameKey: 'upgradeMagnetName',
    descKey: 'upgradeMagnetDesc',
    maxLevel: 3,
    baseCost: 600,
    costMultiplier: 2.0,
    effectValues: [0, 4.0, 8.0, 14.0] // Magnet attraction distance (meters)
  },
  {
    id: 'boots',
    icon: '🚀',
    nameKey: 'upgradeBootsName',
    descKey: 'upgradeBootsDesc',
    maxLevel: 3,
    baseCost: 1000,
    costMultiplier: 2.4,
    effectValues: [0, 1.2, 2.0, 3.2] // Jetpack air glide seconds
  },
  {
    id: 'roar',
    icon: '🦁',
    nameKey: 'upgradeRoarName',
    descKey: 'upgradeRoarDesc',
    maxLevel: 3,
    baseCost: 750,
    costMultiplier: 2.1,
    effectValues: [3.5, 2.8, 2.2, 1.6] // Roar cooldown (seconds)
  }
];

class CarnivalWorkshopManager {
  constructor() {
    this.storageKey = 'circus_3d_upgrades_v1';
    this.coinsKey = 'circus_3d_bank_coins_v1';
    this.upgrades = this.loadUpgrades();
    this.coins = this.loadCoins();
  }

  loadUpgrades() {
    if (typeof localStorage === 'undefined') return { cloak: 0, magnet: 0, boots: 0, roar: 0 };
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : { cloak: 0, magnet: 0, boots: 0, roar: 0 };
    } catch {
      return { cloak: 0, magnet: 0, boots: 0, roar: 0 };
    }
  }

  saveUpgrades() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.upgrades));
    } catch (e) {
      console.error(e);
    }
  }

  loadCoins() {
    if (typeof localStorage === 'undefined') return 500; // Starting gift coins
    try {
      const c = localStorage.getItem(this.coinsKey);
      return c !== null ? parseInt(c, 10) : 500;
    } catch {
      return 500;
    }
  }

  saveCoins() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.coinsKey, this.coins.toString());
    } catch (e) {
      console.error(e);
    }
  }

  addCoins(amount) {
    this.coins += amount;
    this.saveCoins();
  }

  getLevel(itemId) {
    return this.upgrades[itemId] || 0;
  }

  getCost(item) {
    const lvl = this.getLevel(item.id);
    if (lvl >= item.maxLevel) return 0;
    return Math.floor(item.baseCost * Math.pow(item.costMultiplier, lvl));
  }

  getEffectValue(itemId) {
    const item = UPGRADE_ITEMS.find(u => u.id === itemId);
    if (!item) return 0;
    const lvl = this.getLevel(itemId);
    return item.effectValues[lvl] || item.effectValues[0];
  }

  buyUpgrade(itemId) {
    const item = UPGRADE_ITEMS.find(u => u.id === itemId);
    if (!item) return { success: false, reason: 'invalid_item' };

    const lvl = this.getLevel(itemId);
    if (lvl >= item.maxLevel) return { success: false, reason: 'max_level' };

    const cost = this.getCost(item);
    if (this.coins < cost) return { success: false, reason: 'not_enough_coins' };

    this.coins -= cost;
    this.upgrades[itemId] = lvl + 1;
    this.saveCoins();
    this.saveUpgrades();
    return { success: true, newLevel: this.upgrades[itemId] };
  }
}

export const workshop = new CarnivalWorkshopManager();
