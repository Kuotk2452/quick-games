/**
 * Volatile Meme Coin & Stock Day-Trading Engine for Cyber Slacker
 * Real-time candlestick charts, price fluctuations, pump-and-dump events, and portfolio trading.
 */

import { slackerAudio } from './audio.js';

export const COIN_DEFS = {
  DOGE: {
    symbol: '$DOGE',
    name: 'Doge Corporate',
    icon: '🐕',
    basePrice: 1.20,
    volatility: 0.12,
    color: '#eab308'
  },
  PEPE: {
    symbol: '$PEPE',
    name: 'Pepe Moon Coin',
    icon: '🐸',
    basePrice: 0.05,
    volatility: 0.25,
    color: '#22c55e'
  },
  AI_CORP: {
    symbol: '$AICORP',
    name: 'Synergy AI Tech',
    icon: '🤖',
    basePrice: 45.0,
    volatility: 0.06,
    color: '#00f0ff'
  },
  COFFEE: {
    symbol: '$BEANS',
    name: 'Pantry Arabica Futures',
    icon: '☕',
    basePrice: 12.5,
    volatility: 0.08,
    color: '#b45309'
  }
};

export class CryptoTradingEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.selectedCoin = 'DOGE';
    this.prices = {};
    this.history = {}; // 30 recent candle points per coin
    this.portfolio = {}; // count owned
    this.cash = 500; // Starting money

    // Initialize market state
    for (const key of Object.keys(COIN_DEFS)) {
      const def = COIN_DEFS[key];
      this.prices[key] = def.basePrice;
      this.history[key] = [];
      this.portfolio[key] = 0;

      // Seed 20 historical bars
      let p = def.basePrice;
      for (let i = 0; i < 20; i++) {
        p = Math.max(0.01, p * (1 + (Math.random() - 0.49) * def.volatility));
        this.history[key].push({
          open: p,
          close: p * (1 + (Math.random() - 0.49) * (def.volatility * 0.5)),
          high: p * 1.05,
          low: p * 0.95
        });
      }
    }

    this.updateInterval = null;
    this.startMarketTicker();
  }

  startMarketTicker() {
    if (this.updateInterval) clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => {
      this.tickMarket();
      if (this.ctx) this.drawCandlestickChart();
    }, 1000);
  }

  stopMarketTicker() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  tickMarket() {
    for (const key of Object.keys(COIN_DEFS)) {
      const def = COIN_DEFS[key];
      const prevPrice = this.prices[key];

      // Random market drift with sudden pump/dump spikes
      let change = (Math.random() - 0.485) * def.volatility;
      if (Math.random() < 0.05) {
        // 5% chance of major pump or dump
        change = (Math.random() > 0.4 ? 1 : -1) * (0.35 + Math.random() * 0.4);
      }

      let newPrice = Math.max(0.01, prevPrice * (1 + change));
      this.prices[key] = Number(newPrice.toFixed(4));

      // Append Candle
      const candle = {
        open: prevPrice,
        close: newPrice,
        high: Math.max(prevPrice, newPrice) * (1 + Math.random() * 0.03),
        low: Math.min(prevPrice, newPrice) * (1 - Math.random() * 0.03)
      };

      this.history[key].push(candle);
      if (this.history[key].length > 25) {
        this.history[key].shift();
      }
    }
  }

  buy(coinKey, amountDollars) {
    const price = this.prices[coinKey];
    if (!price || this.cash < amountDollars || amountDollars <= 0) return false;

    const units = amountDollars / price;
    this.cash -= amountDollars;
    this.portfolio[coinKey] = (this.portfolio[coinKey] || 0) + units;

    slackerAudio.playKeyClick();
    slackerAudio.playCashRegister();
    return true;
  }

  sellAll(coinKey) {
    const units = this.portfolio[coinKey] || 0;
    const price = this.prices[coinKey];
    if (units <= 0 || !price) return 0;

    const returnCash = units * price;
    this.cash += returnCash;
    this.portfolio[coinKey] = 0;

    slackerAudio.playCashRegister();
    return returnCash;
  }

  getTotalNetWorth() {
    let total = this.cash;
    for (const key of Object.keys(this.portfolio)) {
      total += (this.portfolio[key] || 0) * (this.prices[key] || 0);
    }
    return Number(total.toFixed(2));
  }

  drawCandlestickChart() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const candles = this.history[this.selectedCoin] || [];

    ctx.clearRect(0, 0, width, height);

    // Background Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 20; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (candles.length === 0) return;

    let minVal = Math.min(...candles.map(c => c.low));
    let maxVal = Math.max(...candles.map(c => c.high));
    const range = Math.max(0.001, maxVal - minVal);

    const candleWidth = (width - 40) / candles.length;
    const padding = 15;

    candles.forEach((c, idx) => {
      const isGreen = c.close >= c.open;
      const color = isGreen ? '#22c55e' : '#ef4444';

      const x = padding + idx * candleWidth + candleWidth / 2;
      const highY = height - padding - ((c.high - minVal) / range) * (height - padding * 2);
      const lowY = height - padding - ((c.low - minVal) / range) * (height - padding * 2);
      const openY = height - padding - ((c.open - minVal) / range) * (height - padding * 2);
      const closeY = height - padding - ((c.close - minVal) / range) * (height - padding * 2);

      // Wick Line
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body Box
      const topY = Math.min(openY, closeY);
      const bodyH = Math.max(2, Math.abs(closeY - openY));
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth * 0.35, topY, candleWidth * 0.7, bodyH);
    });

    // Current Price Indicator Line
    const curPrice = this.prices[this.selectedCoin];
    const curY = height - padding - ((curPrice - minVal) / range) * (height - padding * 2);
    ctx.strokeStyle = '#00f0ff';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, curY);
    ctx.lineTo(width, curY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price Label
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`$${curPrice.toFixed(4)}`, width - 65, Math.max(15, curY - 4));
  }
}
