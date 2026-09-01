with open('games/08-circus-3d/css/style.css', 'a', encoding='utf-8') as f:
    f.write('''

/* Landscape Mobile Fixes */
@media (max-height: 500px) and (orientation: landscape) {
  .hud-top-bar {
    padding: 2px 10px;
    background: rgba(26, 16, 44, 0.4); /* Make it more transparent */
    border: none;
    border-radius: 0 0 12px 12px;
  }
  .hud-card {
    gap: 2px;
  }
  .hud-value {
    font-size: 11px;
  }
  .hud-label {
    display: none; /* Hide text labels to save space */
  }
  .touch-controls-bar {
    padding-bottom: 2px;
  }
  .touch-btn {
    font-size: 10px;
    height: 38px;
    border-radius: 8px;
  }
  .touch-dir {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
  .gameplay-hud-overlay {
    max-width: 100%;
  }
}
''')
