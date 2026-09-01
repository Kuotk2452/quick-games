with open('games/04-cyber-slacker/css/style.css', 'a', encoding='utf-8') as f:
    f.write('''
.ad-btn {
  width: 100%;
  padding: 14px;
  background: var(--circus-gold);
  color: #111;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  margin-bottom: 12px;
  transition: transform 0.1s ease;
  box-shadow: 0 0 12px rgba(250, 204, 21, 0.4);
}
.ad-btn:active {
  transform: scale(0.95);
}
''')
