import json

with open('js/portal_i18n.js', 'r', encoding='utf-8') as f:
    c = f.read()

es = '''
  es: {
    badge: '⚡ QUICK GAMES STUDIO',
    title: 'Arcade de Juegos Indie',
    subtitle: 'Juegos de navegador sin instalación, de alta retención, listos para jugadores globales y móviles.',
    play: 'Jugar',
    langs: 'EN / ZH / ES / JA',
    
    g1_title: 'Emoji Craft: Fusión Infinita',
    g1_genre: 'Alquimia Sin Fin &times; Misiones Diarias',
    g1_desc: 'Combina elementos básicos en más de 150 descubrimientos de memes y ciencia. ¡Completa el desafío del Codex Diario y desbloquea recetas!',
    
    g2_title: 'Wordle Survivor',
    g2_genre: 'Roguelike Bullet Heaven &times; Magia de Palabras',
    g2_desc: 'Vampire Survivors se encuentra con Wordle. Elimina hordas de monstruos, cosecha letras, deletrea más de 5000 palabras para causar daño masivo y subir de nivel.',
    
    g3_title: 'Dungeon Claw 3D',
    g3_genre: 'Máquina de Garra 3D &times; Roguelike de Mazmorra',
    g3_desc: '¡Máquina de garra en 3D! Posiciona tu garra mecánica, sumérgete en el foso de botín físico, encadena combos de múltiples objetos y derrota a los jefes.',
    
    g4_title: 'Cyber Slacker',
    g4_genre: 'Sigilo en la Oficina &times; Botón de Pánico',
    g4_desc: 'Intercambia Meme Coins y holgazanea en el trabajo mientras esquivas al jefe y a Recursos Humanos. ¡Usa el botón de pánico para simular que trabajas en Excel!',
    
    g5_title: 'Cosmic Orbit',
    g5_genre: 'Física de Gravedad &times; Suika Merge',
    g5_desc: 'Lanza planetas hacia el campo gravitacional de un agujero negro central. Fusiona cuerpos celestes desde meteoritos hasta supernovas.',
    
    g6_title: 'Mecha Arena',
    g6_genre: 'Creación de Mechas &times; Combate en la Arena',
    g6_desc: 'Ensambla aerodeslizadores, sierras de plasma y escudos cinéticos para dominar a tus rivales y aplastar al jefe Behemoth Apex.',
    
    g7_title: 'Neon Beat',
    g7_genre: 'Corte de Ritmo &times; Acción Synthwave',
    g7_desc: '¡Corta los ritmos de neón con espadas de energía roja y azul en 4 pistas de música electrónica sintética generadas por procedimientos!',
    
    g8_title: 'Circus Rush 3D',
    g8_genre: 'Acrobacias de Circo 3D &times; Homenaje Retro',
    g8_desc: '¡Monta al poderoso león a través de anillos de fuego, camina por la cuerda floja y salta sobre esferas gigantes en 3D!',
    
    g9_title: 'Orbit Odyssey',
    g9_genre: 'Honda Gravitatoria &times; Carrera Espacial',
    g9_desc: 'Pilota tu nave estelar usando hondas gravitatorias planetarias, cinturones de asteroides y evita agujeros negros en una galaxia 2.5D.'
  },
  ja: {
    badge: '⚡ QUICK GAMES スタジオ',
    title: 'インディーゲームアーケード',
    subtitle: 'インストール不要！全世界のプレイヤーやモバイル向けの高リテンション・ブラウザゲーム。',
    play: 'プレイする',
    langs: '英語 / 中国語 / スペイン語 / 日本語',
    
    g1_title: 'Emoji Craft: 無限合成',
    g1_genre: 'エンドレス錬金術 &times; デイリークエスト',
    g1_desc: '基本要素を組み合わせて150以上のミームや科学的発見を生み出そう！毎日の図鑑チャレンジをクリアして、レシピをアンロックしよう。',
    
    g2_title: 'Wordle Survivor',
    g2_genre: 'ローグライク・弾幕 &times; ワードマジック',
    g2_desc: 'Vampire Survivors × Wordle！モンスターの群れを倒し、ルーン文字を収穫し、5000以上の単語を綴って大魔法を放ちレベルアップしよう！',
    
    g3_title: 'Dungeon Claw 3D: ダンジョンクロー',
    g3_genre: '3Dクレーンゲーム &times; ダンジョンローグライク',
    g3_desc: '完全3Dのクレーンゲーム！メカニカルクレーンを操作して物理演算の戦利品ピットに投下し、複数アイテムコンボを決めてボスを倒そう！',
    
    g4_title: 'サボりマスター',
    g4_genre: 'オフィスステルス &times; パニックボタン',
    g4_desc: '仕事中にミームコインを取引してサボろう！ボスや人事にバレそうになったら、0.05秒でリアルなExcel画面に切り替えるパニックボタンを押せ！',
    
    g5_title: 'Cosmic Orbit',
    g5_genre: '軌道引力物理 &times; スイカマージ',
    g5_desc: '惑星を中央のブラックホールの重力場へパチンコのように弾き飛ばせ！隕石から超新星まで、天体をマージして美しいパーティクルを咲かせよう。',
    
    g6_title: 'Mecha Arena',
    g6_genre: 'モジュラーメカクラフト &times; アリーナコンバット',
    g6_desc: 'ホバークラフト、プラズマノコギリ、ツインレーザーなどを組み立ててAIのライバルを圧倒し、頂点に立つ巨大ボスを打ち砕け！',
    
    g7_title: 'Neon Beat',
    g7_genre: 'リズムスライサー &times; シンセウェイヴアクション',
    g7_desc: '迫り来るネオンのリズムビートを、赤と青のエネルギーブレードで切り裂け！4つのプロシージャルな電子シンセトラックをクリアしよう。',
    
    g8_title: 'Circus Rush 3D',
    g8_genre: '3Dサーカスアクロバット &times; レトロオマージュ',
    g8_desc: '燃え盛る火の輪を潜るライオンに乗り、綱渡りをし、巨大なボールを跳び越える！フル3Dのサーカスアクション！',
    
    g9_title: 'Orbit Odyssey',
    g9_genre: '重力スリングショット &times; ディープスペースランナー',
    g9_desc: '星間宇宙船を操縦し、惑星の重力スリングショットや小惑星帯を抜け、自動生成される2.5Dの銀河でブラックホールを回避せよ！'
  }
};'''

c = c.replace('  }\n};', '  },\n' + es + '\n')

with open('js/portal_i18n.js', 'w', encoding='utf-8') as f:
    f.write(c)
