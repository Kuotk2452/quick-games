with open('games/08-circus-3d/css/style.css', 'a', encoding='utf-8') as f:
    f.write('''
@media (max-height: 500px) and (orientation: landscape) {
  .touch-action { height: 38px !important; padding: 0 10px !important; }
  .touch-jump { height: 44px !important; padding: 0 16px !important; }
}
''')
