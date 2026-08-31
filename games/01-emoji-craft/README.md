# 🧪 Emoji Craft: Infinite Fusion

> **A high-virality, zero-friction browser game featuring Endless Alchemy Fusion, Daily Wordle-style Quests, Multi-Language Support (EN/ZH/ES/JA), and a turn-key monetization stack.**

---

## 🌟 Highlights & Features

- **English-First & Multi-Language (i18n)**:
  - 🇺🇸 **English (Default - Optimized for US / Global Market)**
  - 🇨🇳 **Chinese (中文)**
  - 🇪🇸 **Spanish (Español)**
  - 🇯🇵 **Japanese (日本語)**
- **150+ Handcrafted Meme & Science Fusion Recipes**: Covers Nature, Animals, Food, Tech, Developer Humor, Fantasy, and Deep Space.
- **Game Modes**:
  1. **Endless Discovery Mode**: Unlock all 150+ elements and complete your Codex.
  2. **Daily Quest (Wordle Paradigm)**: Universal daily target challenge with one-click Emoji score card generator for social sharing on Twitter/X, Discord, and Reddit.
  3. **Visual Codex**: Pokedex-style recipe handbook.
- **Built-in Monetization Stack**:
  - 💡 **Rewarded Video Ads** (Watch video to inspect secret recipe clues)
  - 👑 **$1.99 USD Lifetime VIP Pass** (100% Ad-Free + Unlimited Clues + Golden Crown Badge)
  - 📢 **Standard Responsive Banner Slots** (Google AdSense / Poki / CrazyGames ready)

---

## 🚀 Play Locally

1. Open your browser and navigate to:
   👉 **`http://localhost:8080`**
2. Or simply double-click `index.html` from the project directory.

---

## 🌐 Deploy to Cloudflare Pages (Free Worldwide CDN in 60s)

1. Sign up at [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Compute (Workers & Pages)** $\to$ **Create application** $\to$ **Pages**.
3. Select **Direct Upload**, drop this `Quick Games` folder into Cloudflare, and click **Deploy**.
4. You instantly get an SSL-secured, unlimited-bandwidth URL (e.g. `https://emoji-craft.pages.dev`).

---

## 💰 Connecting Real Monetization (US / Global Payouts)

### 1. Rewarded Video Ads
In `js/monetization.js`, connect **Poki SDK** or **Google AdSense for Games**:
```javascript
PokiSDK.rewardedBreak().then((success) => {
  if (success) {
    this.claimReward();
  }
});
```

### 2. $1.99 USD VIP Payments (Stripe / LemonSqueezy)
In `js/monetization.js`, link the VIP button to your **Stripe Payment Link** or **LemonSqueezy** checkout:
```javascript
window.open('https://buy.stripe.com/your_payment_link', '_blank');
```

---

© 2026 Emoji Craft Studio · Made for the Global Web.
