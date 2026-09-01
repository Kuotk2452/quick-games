import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

header_replacement = '''  <header>
    <div style="position: absolute; top: 20px; right: 20px; z-index: 999;">
      <select id="portalLangSelect" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 5px 10px; border-radius: 6px; font-family: inherit; font-size: 14px; cursor: pointer; outline: none; backdrop-filter: blur(5px);">
        <option value="en">English</option>
        <option value="zh">繁體中文</option>
        <option value="es">Español</option>
        <option value="ja">日本語</option>
      </select>
    </div>
    <div class="logo-badge">
      <span data-i18n="badge">⚡ QUICK GAMES STUDIO</span>
    </div>
    <h1 data-i18n="title">Indie Game Arcade</h1>
    <p class="subtitle" data-i18n="subtitle">Zero-install, high-retention browser games ready for global players, web portals, and mobile.</p>
  </header>'''

c = re.sub(r'<header>.*?</header>', header_replacement, c, flags=re.DOTALL)

game_replacements = [
    (r'<h2 class="game-title">Dungeon Claw 3D:.*?</h2>', '<h2 class="game-title" data-i18n="g3_title">Dungeon Claw 3D</h2>'),
    (r'<div class="game-genre">3D Physics Crane Claw .*?</div>', '<div class="game-genre" data-i18n="g3_genre">3D Physics Crane Claw &times; Dungeon Roguelike</div>'),
    (r'<p class="game-desc">\s*Full 3D WebGL Crane Machine!.*?</p>', '<p class="game-desc" data-i18n="g3_desc">Full 3D WebGL Crane Machine! Position your 3D mechanical claw, drop into the physics loot pit, chain multi-item combos (🗡️ Swords, 🛡️ Shields, 💣 Bombs), and conquer dungeon bosses!</p>'),

    (r'<h2 class="game-title">Wordle Survivor:.*?</h2>', '<h2 class="game-title" data-i18n="g2_title">Wordle Survivor</h2>'),
    (r'<div class="game-genre">Roguelike Bullet Heaven .*?</div>', '<div class="game-genre" data-i18n="g2_genre">Roguelike Bullet Heaven &times; Word Magic</div>'),
    (r'<p class="game-desc">\s*Vampire Survivors meets Wordle.*?</p>', '<p class="game-desc" data-i18n="g2_desc">Vampire Survivors meets Wordle. Slay monster hordes, harvest runic letters, spell 5000+ words to trigger massive elemental screen-wipes, and level up with 15+ perks!</p>'),

    (r'<h2 class="game-title">Emoji Craft:.*?</h2>', '<h2 class="game-title" data-i18n="g1_title">Emoji Craft: Infinite Fusion</h2>'),
    (r'<div class="game-genre">Endless Alchemy .*?</div>', '<div class="game-genre" data-i18n="g1_genre">Endless Alchemy &times; Daily Quests</div>'),
    (r'<p class="game-desc">\s*Combine basic elements into 150\+.*?recipes\.</p>', '<p class="game-desc" data-i18n="g1_desc">Combine basic elements into 150+ meme and science discoveries. Complete the Daily Codex challenge, share your emoji score card, and unlock recipes.</p>'),

    (r'<h2 class="game-title">Cyber Slacker:.*?</h2>', '<h2 class="game-title" data-i18n="g4_title">Cyber Slacker</h2>'),
    (r'<div class="game-genre">Workplace Stealth .*?</div>', '<div class="game-genre" data-i18n="g4_genre">Workplace Stealth &times; Panic Button Clicker</div>'),
    (r'<p class="game-desc">\s*Trade volatile meme coins.*?in 0\.05s!</p>', '<p class="game-desc" data-i18n="g4_desc">Trade volatile meme coins and slack off on the job while dodging the boss and HR. Hit the instant panic button to flip to an ultra-realistic Excel sheet in 0.05s!</p>'),

    (r'<h2 class="game-title">Cosmic Orbit:.*?</h2>', '<h2 class="game-title" data-i18n="g5_title">Cosmic Orbit</h2>'),
    (r'<div class="game-genre">Orbital Gravity Physics .*?</div>', '<div class="game-genre" data-i18n="g5_genre">Orbital Gravity Physics &times; Suika Merge</div>'),
    (r'<p class="game-desc">\s*Slingshot planets into a central black hole.*?particle bursts!</p>', '<p class="game-desc" data-i18n="g5_desc">Slingshot planets into a central black hole gravitational field. Merge celestial bodies from meteorites to supernovas with harmonic synthwave particle bursts!</p>'),

    (r'<h2 class="game-title">Mecha Arena:.*?</h2>', '<h2 class="game-title" data-i18n="g6_title">Mecha Arena</h2>'),
    (r'<div class="game-genre">Modular Mech Crafting .*?</div>', '<div class="game-genre" data-i18n="g6_genre">Modular Mech Crafting &times; Arena Combat</div>'),
    (r'<p class="game-desc">\s*Assemble hovercraft/treads.*?Apex Behemoth Boss!</p>', '<p class="game-desc" data-i18n="g6_desc">Assemble hovercraft/treads, plasma saws, twin lasers, and kinetic shields to dominate AI rivals and crush the Apex Behemoth Boss!</p>'),

    (r'<h2 class="game-title">Neon Beat:.*?</h2>', '<h2 class="game-title" data-i18n="g7_title">Neon Beat</h2>'),
    (r'<div class="game-genre">Rhythm Beat Slicer .*?</div>', '<div class="game-genre" data-i18n="g7_genre">Rhythm Beat Slicer &times; Synthwave Action</div>'),
    (r'<p class="game-desc">\s*Slice oncoming neon rhythm beats.*?synth tracks!</p>', '<p class="game-desc" data-i18n="g7_desc">Slice oncoming neon rhythm beats with dual Red & Blue energy blades to 4 procedural electronic synth tracks!</p>'),

    (r'<h2 class="game-title">Circus Rush 3D:.*?</h2>', '<h2 class="game-title" data-i18n="g8_title">Circus Rush 3D</h2>'),
    (r'<div class="game-genre">3D Circus Acrobatics .*?</div>', '<div class="game-genre" data-i18n="g8_genre">3D Circus Acrobatics &times; Retro Homage</div>'),
    (r'<p class="game-desc">\s*Ride the mighty lion through blazing.*?in full 3D!</p>', '<p class="game-desc" data-i18n="g8_desc">Ride the mighty lion through blazing fire rings, walk tightropes, and vault over giant bouncy spheres in full 3D!</p>'),

    (r'<h2 class="game-title">Orbit Odyssey:.*?</h2>', '<h2 class="game-title" data-i18n="g9_title">Orbit Odyssey</h2>'),
    (r'<div class="game-genre">Gravity Slingshot .*?</div>', '<div class="game-genre" data-i18n="g9_genre">Gravity Slingshot &times; Deep Space Runner</div>'),
    (r'<p class="game-desc">\s*Pilot your interstellar starship.*?procedural 2\.5D galaxy\.</p>', '<p class="game-desc" data-i18n="g9_desc">Pilot your interstellar starship through planetary gravity slingshots, asteroid belts, and avoid black holes in a procedural 2.5D galaxy.</p>'),
    
    (r'Play 3D Game <span class="arrow">.*?</span>', '<span data-i18n="play">Play Game</span> <span class="arrow">→</span>'),
    (r'Play Game <span class="arrow">.*?</span>', '<span data-i18n="play">Play Game</span> <span class="arrow">→</span>'),
    (r'PLAY <span style="font-size: 10px;">.*?</span>', '<span data-i18n="play">Play Game</span> <span class="arrow">→</span>'),
    (r'EN / 中文 / ES / JA &middot; 3D WebGL', '<span data-i18n="langs">EN / ZH / ES / JA</span> &middot; 3D WebGL'),
    (r'EN / 繁體 / ES / JA &middot; 3D WebGL', '<span data-i18n="langs">EN / ZH / ES / JA</span> &middot; 3D WebGL'),
    (r'EN / 中文 / ES / JA', '<span data-i18n="langs">EN / ZH / ES / JA</span>')
]

for pat, repl in game_replacements:
    c = re.sub(pat, repl, c, flags=re.DOTALL)

if '<script type="module" src="js/portal_i18n.js"></script>' not in c:
    c = c.replace('</body>', '  <script type="module" src="js/portal_i18n.js"></script>\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)
