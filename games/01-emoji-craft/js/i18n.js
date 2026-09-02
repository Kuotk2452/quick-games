/**
 * Emoji Craft: Infinite Fusion - Internationalization (i18n) Engine
 * Supported Languages: English (en, default), Chinese (zh), Spanish (es), Japanese (ja)
 */

export const TRANSLATIONS = {
  en: {
    gameTitle: "Emoji Craft: Infinite Fusion",
    gameSubtitle: "Infinite Alchemy & Daily Quests",
    codex: "Codex",
    hint: "Hint",
    mute: "Mute",
    unmute: "Unmute",
    clearBoard: "Clear Board",
    boardTip: "💡 Tip: Drag two elements together to fuse. Double-click an element to clone it.",
    searchPlaceholder: "🔍 Search unlocked elements...",
    dailyQuest: "Daily Quest",
    dailyWordleMode: "Daily Mode",
    statsDiscovered: "Discovered",
    upgradeVip: "💎 Upgrade VIP",
    vipBadge: "👑 VIP Alchemist",
    
    // Categories
    cat_all: "All",
    cat_basic: "🌀 Basic",
    cat_nature: "🌿 Nature",
    cat_life: "🐾 Life",
    cat_food: "🍔 Food",
    cat_tech: "💻 Tech",
    cat_meme: "🤡 Memes",
    cat_fantasy: "🔮 Fantasy",
    cat_cosmic: "🌌 Cosmic",

    // Daily Victory Modal
    victoryTitle: "Daily Target Synthesized!",
    victorySubtitle: "You conquered today's alchemy challenge",
    victorySteps: "Steps Taken:",
    victoryPercentile: "Better than {percent}% of alchemists worldwide!",
    copyShareCard: "📋 Copy Result (Wordle-style)",
    continueExploring: "Continue Endless Mode",
    copiedSuccess: "📋 Result card copied to clipboard! Share it with friends on Twitter/X or Discord!",

    // Hint Dialog
    ancientScroll: "Alchemist's Clue",
    hintMessage: "💡 Secret Formula Clue: Try fusing 【{a}】 and 【{b}】 together! Something magical will happen.",
    allUnlocked: "🎉 Incredible! You have discovered all possible 2-element combos with your current inventory!",
    gotIt: "Got it! Let me try!",

    // Ad Modal
    adTitle: "Sponsored Reward Video",
    adDesc: "Watch a short video to unlock: 【{reward}】",
    adPlaying: "Playing Ad ({time}s)",
    adClaim: "🎉 Ad finished! Click to Claim Reward",
    adCancel: "Skip & Close",

    // VIP Modal
    vipPassBadge: "👑 Micro-SaaS Lifetime Pass",
    vipPassTitle: "Emoji Craft VIP Pass",
    vipPassSubtitle: "Ad-free pure gameplay & unlimited formula sight",
    vipFeature1Title: "100% Ad-Free Forever",
    vipFeature1Desc: "Zero banners, popups, or rewarded video interruptions",
    vipFeature2Title: "Unlimited Recipe Sight & Hints",
    vipFeature2Desc: "Inspect hidden recipes for any element whenever you want",
    vipFeature3Title: "Exclusive VIP Golden Badge",
    vipFeature3Desc: "Show off your golden crown on daily Wordle-style share cards",
    vipPriceTag: "Limited Offer Lifetime Deal",
    vipPrice: "$1.99",
    vipPriceSub: "/ One-time payment (Lifetime Access)",
    vipPaymentDesc: "Secure checkout via Apple Pay / Stripe / Google Pay",
    vipBtn: "Unlock VIP Access Instantly",
    vipLater: "Maybe Later",
    vipSuccessAlert: "🎉 Congratulations! You are now an Emoji Craft VIP Alchemist! Enjoy ad-free and unlimited hints!",

    // Toast
    firstDiscovery: "✨ New Discovery: {emoji} {name}!",
    rewardClaimed: "Double Rewards Claimed",
    footerVersion: "Emoji Craft v1.0.0 · Instant Free Browser Play",
    footerRemoveAds: "Remove Ads / Support Us"
  },

  zh: {
    gameTitle: "Emoji Craft: 灵感大炼金",
    gameSubtitle: "无限合成与每日悬赏挑战",
    codex: "图鉴",
    hint: "提示",
    mute: "静音",
    unmute: "开启音效",
    clearBoard: "清空桌面",
    boardTip: "💡 提示：拖动两个元素重叠合成；双击元素可快速复制",
    searchPlaceholder: "🔍 搜索已解锁元素...",
    dailyQuest: "今日悬赏",
    dailyWordleMode: "每日Wordle模式",
    statsDiscovered: "已解锁",
    upgradeVip: "💎 升级 VIP",
    vipBadge: "👑 VIP 会员",

    cat_all: "全部",
    cat_basic: "🌀 基础",
    cat_nature: "🌿 自然",
    cat_life: "🐾 生命",
    cat_food: "🍔 美食",
    cat_tech: "💻 科技",
    cat_meme: "🤡 梗王",
    cat_fantasy: "🔮 神话",
    cat_cosmic: "🌌 宇宙",

    victoryTitle: "今日悬赏目标达成！",
    victorySubtitle: "你已成功合成了今日终极目标",
    victorySteps: "消耗步数:",
    victoryPercentile: "超越了全网 {percent}% 的炼金术士！",
    copyShareCard: "📋 复制战绩卡片 (Wordle风)",
    continueExploring: "继续无限沙盒探索",
    copiedSuccess: "📋 战绩卡片已成功复制到剪贴板！快去分享给好友吧！",

    ancientScroll: "炼金古卷指引",
    hintMessage: "💡 绝密配方线索：尝试把【{a}】与【{b}】放在一起！会合成出神奇事物！",
    allUnlocked: "🎉 太棒了！在当前的元素库中，所有可能的二元配方已被你全部掌握！",
    gotIt: "我知道了，马上去试！",

    adTitle: "商业激励广告展示区",
    adDesc: "观看视频广告，即可免费解锁【{reward}】",
    adPlaying: "播放中 ({time}s)",
    adClaim: "🎉 广告播放完毕，点击领取奖励！",
    adCancel: "放弃奖励关闭",

    vipPassBadge: "👑 Micro-SaaS 终身通行证",
    vipPassTitle: "Emoji Craft 终身 VIP",
    vipPassSubtitle: "告别所有广告，畅享极致纯净与自由探索",
    vipFeature1Title: "永久去广告",
    vipFeature1Desc: "没有任何插屏、横幅或激励广告打扰",
    vipFeature2Title: "无限配方透视与提示",
    vipFeature2Desc: "任意查看任何元素的完整合成路径",
    vipFeature3Title: "尊贵金色专属称号",
    vipFeature3Desc: "成绩分享卡片附带专属 VIP 宗师印章",
    vipPriceTag: "限时尝鲜买断价",
    vipPrice: "$1.99 / ¥6.00",
    vipPriceSub: "/ 永久买断",
    vipPaymentDesc: "支持 Stripe / Apple Pay / 微信 / 支付宝接入",
    vipBtn: "立即一键解锁 VIP 体验",
    vipLater: "稍后再说",
    vipSuccessAlert: "🎉 恭喜您已升级为 Emoji Craft 终身 VIP 尊贵玩家！享受永久免广告与无限配方提示！",

    firstDiscovery: "✨ 首次解锁新元素：{emoji} {name}！",
    rewardClaimed: "双倍奖励已领取",
    footerVersion: "Emoji Craft v1.0.0 · 零门槛即开即玩",
    footerRemoveAds: "去除广告 / 支持作者"
  },

  es: {
    gameTitle: "Emoji Craft: Fusión Infinita",
    gameSubtitle: "Alquimia Infinita y Misiones Diarias",
    codex: "Códice",
    hint: "Pista",
    mute: "Silenciar",
    unmute: "Sonido",
    clearBoard: "Limpiar Mesa",
    boardTip: "💡 Pista: Arrastra dos elementos juntos para fusionar. Doble clic para clonar.",
    searchPlaceholder: "🔍 Buscar elementos...",
    dailyQuest: "Misión Diaria",
    dailyWordleMode: "Modo Diario",
    statsDiscovered: "Descubiertos",
    upgradeVip: "💎 Pase VIP",
    vipBadge: "👑 Alquimista VIP",

    cat_all: "Todos",
    cat_basic: "🌀 Básicos",
    cat_nature: "🌿 Naturaleza",
    cat_life: "🐾 Vida",
    cat_food: "🍔 Comida",
    cat_tech: "💻 Tecnología",
    cat_meme: "🤡 Memes",
    cat_fantasy: "🔮 Fantasía",
    cat_cosmic: "🌌 Cósmico",

    victoryTitle: "¡Objetivo Diario Completado!",
    victorySubtitle: "Has conquistado el reto de alquimia de hoy",
    victorySteps: "Pasos usados:",
    victoryPercentile: "¡Superaste al {percent}% de los jugadores del mundo!",
    copyShareCard: "📋 Copiar Resultado (Estilo Wordle)",
    continueExploring: "Continuar Explorando",
    copiedSuccess: "📋 ¡Tarjeta copiada al portapapeles! Compártela con tus amigos.",

    ancientScroll: "Pista de Alquimia",
    hintMessage: "💡 Pista Secreta: ¡Intenta fusionar 【{a}】 y 【{b}】 para una sorpresa!",
    allUnlocked: "🎉 ¡Increíble! ¡Has descubierto todas las combinaciones posibles!",
    gotIt: "¡Entendido! ¡A probarlo!",

    adTitle: "Anuncio de Recompensa",
    adDesc: "Mira un anuncio corto para desbloquear: 【{reward}】",
    adPlaying: "Reproduciendo ({time}s)",
    adClaim: "🎉 ¡Listo! Haz clic para reclamar recompensa",
    adCancel: "Cerrar",

    vipPassBadge: "👑 Pase VIP de por vida",
    vipPassTitle: "Pase VIP Emoji Craft",
    vipPassSubtitle: "Sin anuncios, pistas ilimitadas y corona dorada",
    vipFeature1Title: "100% Sin Anuncios",
    vipFeature1Desc: "Disfruta sin interrupciones",
    vipFeature2Title: "Pistas y Recetas Ilimitadas",
    vipFeature2Desc: "Descubre cualquier receta cuando quieras",
    vipFeature3Title: "Insignia Dorada VIP",
    vipFeature3Desc: "Muestra tu estatus en las tarjetas de resultados",
    vipPriceTag: "Oferta Única de por Vida",
    vipPrice: "$1.99 USD",
    vipPriceSub: "/ Pago único",
    vipPaymentDesc: "Pago seguro con Apple Pay / Stripe / Tarjeta",
    vipBtn: "Desbloquear VIP Ahora",
    vipLater: "Más tarde",
    vipSuccessAlert: "🎉 ¡Felicidades! ¡Ahora eres miembro VIP de por vida!",

    firstDiscovery: "✨ ¡Nuevo Descubrimiento: {emoji} {name}!",
    rewardClaimed: "Recompensas Dobles Reclamadas",
    footerVersion: "Emoji Craft v1.0.0 · Juego Instantáneo en Navegador",
    footerRemoveAds: "Quitar Anuncios / Apoyar"
  },

  ja: {
    gameTitle: "Emoji Craft: 無限フュージョン",
    gameSubtitle: "絵文字錬金術とデイリークエスト",
    codex: "図鑑",
    hint: "ヒント",
    mute: "ミュート",
    unmute: "サウンドON",
    clearBoard: "デスクをクリア",
    boardTip: "💡 ヒント: 2つの要素を重ねて合体！ダブルクリックで複製できます",
    searchPlaceholder: "🔍 解放済み要素を検索...",
    dailyQuest: "今日のクエスト",
    dailyWordleMode: "デイリーモード",
    statsDiscovered: "発見数",
    upgradeVip: "💎 VIPに昇格",
    vipBadge: "👑 VIP 錬金術師",

    cat_all: "すべて",
    cat_basic: "🌀 基本",
    cat_nature: "🌿 自然",
    cat_life: "🐾 生命",
    cat_food: "🍔 料理",
    cat_tech: "💻 テック",
    cat_meme: "🤡 ネタ/ミーム",
    cat_fantasy: "🔮 ファンタジー",
    cat_cosmic: "🌌 宇宙",

    victoryTitle: "今日のターゲット達成！",
    victorySubtitle: "本日の錬金クエストをクリアしました",
    victorySteps: "クリア手数:",
    victoryPercentile: "世界中のプレイヤーの {percent}% より優秀です！",
    copyShareCard: "📋 結果をコピー (Wordle風)",
    continueExploring: "エンドレスモードを続ける",
    copiedSuccess: "📋 クリップボードにコピーしました！SNSでシェアしよう！",

    ancientScroll: "錬金術のヒント",
    hintMessage: "💡 秘密のレシピヒント: 【{a}】と【{b}】を合体させてみよう！",
    allUnlocked: "🎉 すべての組み合わせを発見しました！",
    gotIt: "了解！試してみる！",

    adTitle: "リワード広告",
    adDesc: "動画広告を視聴して【{reward}】を無料でゲット！",
    adPlaying: "再生中 ({time}秒)",
    adClaim: "🎉 視聴完了！クリックして報酬を受け取る",
    adCancel: "閉じる",

    vipPassBadge: "👑 永久VIPパス",
    vipPassTitle: "Emoji Craft 永久 VIP パス",
    vipPassSubtitle: "完全広告なし＆無制限ヒント＆黄金の王冠",
    vipFeature1Title: "永久広告オフ",
    vipFeature1Desc: "邪魔な広告一切なしで快適プレイ",
    vipFeature2Title: "無制限ヒント＆レシピ透視",
    vipFeature2Desc: "いつでもレシピのヒントを見放題",
    vipFeature3Title: "VIP限定ゴールドバッジ",
    vipFeature3Desc: "シェアカードにVIP王冠が表示されます",
    vipPriceTag: "買い切り特別価格",
    vipPrice: "$1.99 / ¥300",
    vipPriceSub: "/ 永久利用可能",
    vipPaymentDesc: "Apple Pay / Stripe / クレジットカード対応",
    vipBtn: "今すぐVIPをアンロック",
    vipLater: "あとで",
    vipSuccessAlert: "🎉 おめでとうございます！Emoji Craft 永久VIPになりました！",

    firstDiscovery: "✨ 新発見: {emoji} {name}！",
    footerVersion: "Emoji Craft v1.0.0 · インストール不要のWebゲーム",
    footerRemoveAds: "広告を削除 / 開発者を支援"
  }
};

// 元素多语言名称与描述字典
export const ELEMENT_NAMES = {
  water: { en: 'Water', zh: '水', es: 'Agua', ja: '水', desc: { en: 'Source of all life', zh: '生命之源', es: 'Fuente de vida', ja: '命の源' } },
  fire: { en: 'Fire', zh: '火', es: 'Fuego', ja: '火', desc: { en: 'Energy and warmth', zh: '能量与热情', es: 'Energía y calor', ja: '熱とエネルギー' } },
  earth: { en: 'Earth', zh: '土', es: 'Tierra', ja: '土', desc: { en: 'Soil and foundation', zh: '大地与土壤', es: 'Suelo y base', ja: '大地と土壌' } },
  wind: { en: 'Wind', zh: '风', es: 'Viento', ja: '風', desc: { en: 'Breath of flow', zh: '流动之息', es: 'Aliento del aire', ja: '流れる息吹' } },
  steam: { en: 'Steam', zh: '蒸汽', es: 'Vapor', ja: '蒸気', desc: { en: 'Water meets fire', zh: '水与火的相遇', es: 'Agua con fuego', ja: '水と火の出会い' } },
  lava: { en: 'Lava', zh: '熔岩', es: 'Lava', ja: '溶岩', desc: { en: 'Molten earth', zh: '灼热的岩浆', es: 'Tierra ardiente', ja: '灼熱のマグマ' } },
  mud: { en: 'Mud', zh: '泥浆', es: 'Barro', ja: '泥', desc: { en: 'Wet soil', zh: '湿润的土壤', es: 'Tierra húmeda', ja: '湿った土' } },
  dust: { en: 'Dust', zh: '尘埃', es: 'Polvo', ja: '塵', desc: { en: 'Earth fragments', zh: '大地的碎屑', es: 'Fragmentos de tierra', ja: '大地のチリ' } },
  energy: { en: 'Energy', zh: '能量', es: 'Energía', ja: 'エネルギー', desc: { en: 'Spark of power', zh: '跃动的动力', es: 'Chispa de poder', ja: '力の源' } },
  wave: { en: 'Wave', zh: '海浪', es: 'Ola', ja: '波', desc: { en: 'Wind over water', zh: '风起云涌', es: 'Viento sobre agua', ja: '風と水' } },
  brick: { en: 'Brick', zh: '砖块', es: 'Ladrillo', ja: 'レンガ', desc: { en: 'Baked mud', zh: '坚固的基石', es: 'Barro cocido', ja: '建築の基礎' } },
  cloud: { en: 'Cloud', zh: '云朵', es: 'Nube', ja: '雲', desc: { en: 'Floating vapor', zh: '飘浮的水汽', es: 'Vapor flotante', ja: '浮かぶ水蒸気' } },
  rain: { en: 'Rain', zh: '雨水', es: 'Lluvia', ja: '雨', desc: { en: 'Gift from sky', zh: '天空的馈赠', es: 'Regalo del cielo', ja: '空の恵み' } },
  storm: { en: 'Storm', zh: '暴风雨', es: 'Tormenta', ja: '嵐', desc: { en: 'Thunder & rain', zh: '雷鸣电闪', es: 'Truenos y lluvia', ja: '雷鳴と大雨' } },
  ocean: { en: 'Ocean', zh: '海洋', es: 'Océano', ja: '大洋', desc: { en: 'Vast blue deep', zh: '广袤的深蓝', es: 'Inmenso mar azul', ja: '広大な深海' } },
  obsidian: { en: 'Obsidian', zh: '黑曜石', es: 'Obsidiana', ja: '黒曜石', desc: { en: 'Volcanic glass', zh: '火山玻璃', es: 'Vidrio volcánico', ja: '冷えたマグマ' } },
  volcano: { en: 'Volcano', zh: '火山', es: 'Volcán', ja: '火山', desc: { en: 'Fiery mountain', zh: '地底怒火', es: 'Montaña de fuego', ja: '火の山' } },
  gunpowder: { en: 'Gunpowder', zh: '火药', es: 'Pólvora', ja: '火薬', desc: { en: 'Explosive dust', zh: '危险易燃物', es: 'Polvo explosivo', ja: '爆発の粉' } },
  plant: { en: 'Plant', zh: '植物', es: 'Planta', ja: '植物', desc: { en: 'Sprouting green', zh: '绿意萌发', es: 'Verde brotante', ja: '緑の芽生え' } },
  life: { en: 'Life', zh: '生命', es: 'Vida', ja: '生命', desc: { en: 'Primordial miracle', zh: '原始汤奇迹', es: 'Milagro primordial', ja: '生命の奇跡' } },
  flower: { en: 'Flower', zh: '鲜花', es: 'Flor', ja: '花', desc: { en: 'Blooming petal', zh: '芬芳绽放', es: 'Pétalo floreciente', ja: '咲き誇る花' } },
  tree: { en: 'Tree', zh: '大树', es: 'Árbol', ja: '木', desc: { en: 'Ancient timber', zh: '岁月沉淀', es: 'Madera antigua', ja: '大樹' } },
  forest: { en: 'Forest', zh: '森林', es: 'Bosque', ja: '森', desc: { en: 'Realm of trees', zh: '生灵乐园', es: 'Reino de árboles', ja: '樹木の園' } },
  tobacco: { en: 'Herbs/Cigar', zh: '草药/烟草', es: 'Hierbas', ja: 'ハーブ', desc: { en: 'Aromatic herbs', zh: '神秘植物', es: 'Hierba aromática', ja: '薬草' } },
  wood: { en: 'Wood', zh: '木头', es: 'Madera', ja: '木材', desc: { en: 'Firewood', zh: '干柴与木炭', es: 'Leña y carbón', ja: '薪と木' } },
  fish: { en: 'Fish', zh: '鱼类', es: 'Pez', ja: '魚', desc: { en: 'Swimmer in deep', zh: '水中游弋', es: 'Nadador del agua', ja: '水中の生き物' } },
  animal: { en: 'Animal', zh: '动物', es: 'Animal', ja: '動物', desc: { en: 'Roaming creature', zh: '陆地奔跑', es: 'Criatura terrestre', ja: '生き物' } },
  bird: { en: 'Bird', zh: '飞鸟', es: 'Pájaro', ja: '鳥', desc: { en: 'Ruler of skies', zh: '翱翔天际', es: 'Rey del cielo', ja: '空を飛ぶ鳥' } },
  dog: { en: 'Dog', zh: '小狗', es: 'Perro', ja: 'イヌ', desc: { en: "Man's best friend", zh: '最忠诚的朋友', es: 'Mejor amigo del hombre', ja: '忠実な相棒' } },
  cat: { en: 'Cat', zh: '猫咪', es: 'Gato', ja: 'ネコ', desc: { en: 'Supreme ruler of home', zh: '高傲的小主子', es: 'Gatito curioso', ja: '自由気ままな主' } },
  frog: { en: 'Frog', zh: '青蛙', es: 'Rana', ja: 'カエル', desc: { en: 'Ribbit ribbit', zh: '两栖呱呱', es: 'Saltador verde', ja: '水辺の跳ね手' } },
  insect: { en: 'Insect', zh: '昆虫', es: 'Insecto', ja: '昆虫', desc: { en: 'Tiny crawler', zh: '微小生灵', es: 'Pequeño bichito', ja: '小さな虫' } },
  bee: { en: 'Bee', zh: '蜜蜂', es: 'Abeja', ja: 'ハチ', desc: { en: 'Busy pollinator', zh: '勤劳采蜜者', es: 'Trabajadora dulce', ja: '働き者' } },
  honey: { en: 'Honey', zh: '蜂蜜', es: 'Miel', ja: 'ハチミツ', desc: { en: 'Golden sweet', zh: '甜蜜结晶', es: 'Dulzura dorada', ja: '甘い黄金' } },
  human: { en: 'Human', zh: '人类', es: 'Humano', ja: '人間', desc: { en: 'Wisdom & creativity', zh: '智慧与创造力', es: 'Sabiduría y creación', ja: '知恵と創造' } },
  fruit: { en: 'Fruit', zh: '水果', es: 'Fruta', ja: 'フルーツ', desc: { en: 'Sweet and juicy', zh: '甜美多汁', es: 'Dulce y jugoso', ja: 'みずみずしい果物' } },
  tea: { en: 'Tea', zh: '茶', es: 'Té', ja: 'お茶', desc: { en: 'Calming brew', zh: '清雅养生', es: 'Bebida relajante', ja: '落ち着く一杯' } },
  coffee: { en: 'Coffee', zh: '咖啡', es: 'Café', ja: 'コーヒー', desc: { en: 'Potion of survival', zh: '续命神仙水', es: 'Elixir matutino', ja: '命の目覚まし薬' } },
  meat: { en: 'Meat', zh: '烤肉', es: 'Carne', ja: 'お肉', desc: { en: 'Delicious protein', zh: '脂肪香气', es: 'Proteína deliciosa', ja: '香ばしい肉' } },
  grain: { en: 'Wheat', zh: '小麦', es: 'Trigo', ja: '小麦', desc: { en: 'Agricultural dawn', zh: '农业的开端', es: 'Amanecer agrícola', ja: '農耕の始まり' } },
  bread: { en: 'Bread', zh: '面包', es: 'Pan', ja: 'パン', desc: { en: 'Staple of life', zh: '主食之王', es: 'Alimento básico', ja: '主食の王様' } },
  burger: { en: 'Burger', zh: '汉堡', es: 'Hamburguesa', ja: 'バーガー', desc: { en: 'Guilty pleasure', zh: '快乐肥宅餐', es: 'Comida rápida top', ja: 'ジャンクな幸せ' } },
  bbq: { en: 'BBQ', zh: '烧烤', es: 'Barbacoa', ja: 'BBQ', desc: { en: 'Grilled delight', zh: '深夜路边摊', es: 'Asado delicioso', ja: '香ばしい炭火焼き' } },
  juice: { en: 'Juice', zh: '果汁', es: 'Jugo', ja: 'ジュース', desc: { en: 'Vitamin rush', zh: '维C满满', es: 'Bebida frutal', ja: 'ビタミンたっぷり' } },
  wine: { en: 'Wine', zh: '美酒', es: 'Vino', ja: 'ワイン', desc: { en: 'Aged in time', zh: '时光发酵', es: 'Fermentado con tiempo', ja: '熟成の美酒' } },
  farmer: { en: 'Farmer', zh: '农夫', es: 'Granjero', ja: '農家', desc: { en: 'Working the soil', zh: '辛勤耕耘', es: 'Cultivador de tierra', ja: '大地の耕作者' } },
  house: { en: 'House', zh: '房屋', es: 'Casa', ja: '家', desc: { en: 'Cozy haven', zh: '温馨港湾', es: 'Hogar cálido', ja: '温かい我が家' } },
  city: { en: 'City', zh: '城市', es: 'Ciudad', ja: '都市', desc: { en: 'Steel jungle', zh: '钢铁森林', es: 'Jungla de concreto', ja: '摩天楼の街' } },
  metal: { en: 'Metal', zh: '金属', es: 'Metal', ja: '金属', desc: { en: 'Forged in fire', zh: '冶炼工艺', es: 'Forjado en fuego', ja: '精錬された鉱石' } },
  tool: { en: 'Tool', zh: '工具', es: 'Herramienta', ja: '道具', desc: { en: 'Extension of hand', zh: '改造世界', es: 'Extensión de la mano', ja: '手の延長' } },
  electricity: { en: 'Electricity', zh: '电力', es: 'Electricidad', ja: '電気', desc: { en: 'Lighting civilization', zh: '点亮文明', es: 'Luz de la civilización', ja: '文明を照らす力' } },
  computer: { en: 'Computer', zh: '电脑', es: 'Computadora', ja: 'パソコン', desc: { en: 'Silicon brain', zh: '硅基智慧', es: 'Cerebro de silicio', ja: 'シリコンの頭脳' } },
  programmer: { en: 'Programmer', zh: '程序员', es: 'Programador', ja: 'エンジニア', desc: { en: 'Turns coffee into code', zh: '代码与咖啡转换器', es: 'Convierte café en código', ja: 'カフェイン駆動開発' } },
  internet: { en: 'Internet', zh: '互联网', es: 'Internet', ja: 'インターネット', desc: { en: 'World Wide Web', zh: '信息之网', es: 'Red global', ja: '世界を繋ぐ網' } },
  smartphone: { en: 'Smartphone', zh: '智能手机', es: 'Smartphone', ja: 'スマホ', desc: { en: 'Digital limb', zh: '不可分割的器官', es: 'Dispositivo inseparable', ja: '現代人の分身' } },
  phone: { en: 'Telephone', zh: '电话', es: 'Teléfono', ja: '電話', desc: { en: 'Voice across miles', zh: '千里传音', es: 'Voz lejana', ja: '遠くの声を繋ぐ' } },
  lightbulb: { en: 'Eureka / Idea', zh: '灵感/灯泡', es: 'Idea / Foco', ja: 'ひらめき', desc: { en: 'Flash of genius', zh: '突如其来的妙想', es: 'Destello genial', ja: '天才の閃き' } },
  glass: { en: 'Glass', zh: '玻璃', es: 'Vidrio', ja: 'ガラス', desc: { en: 'Melted sand', zh: '沙子高温蜕变', es: 'Arena fundida', ja: '透明な砂' } },
  glasses: { en: 'Glasses', zh: '眼镜', es: 'Gafas', ja: 'メガネ', desc: { en: 'Clear vision', zh: '看清世界', es: 'Visión clara', ja: '視界くっきり' } },
  ai: { en: 'AI', zh: '人工智能', es: 'IA', ja: '人工知能 (AI)', desc: { en: 'Synthetic mind', zh: '数字生命觉醒', es: 'Mente sintética', ja: 'デジタル知能' } },
  agi: { en: 'AGI / Super AI', zh: '超级智能 AGI', es: 'AGI / Super IA', ja: '超知能 AGI', desc: { en: 'Beyond human intellect', zh: '超越人类极限', es: 'Superando la humanidad', ja: '人類を超える知性' } },
  bullet: { en: 'Bullet', zh: '子弹', es: 'Bala', ja: '銃弾', desc: { en: 'High velocity', zh: '致命弹药', es: 'Alta velocidad', ja: '高速の弾丸' } },
  gun: { en: 'Gun', zh: '枪械', es: 'Arma', ja: '銃', desc: { en: 'Firearm epoch', zh: '热兵器时代', es: 'Era de fuego', ja: '火器' } },
  car: { en: 'Car', zh: '汽车', es: 'Coche', ja: '自動車', desc: { en: 'Motor transport', zh: '代步工具', es: 'Transporte motorizado', ja: '文明の足' } },
  airplane: { en: 'Airplane', zh: '飞机', es: 'Avión', ja: '飛行機', desc: { en: 'Wings in sky', zh: '冲上云霄', es: 'Alas en el cielo', ja: '空駆ける翼' } },
  rocket: { en: 'Rocket', zh: '火箭', es: 'Cohete', ja: 'ロケット', desc: { en: 'To the stars', zh: '飞向星辰大海', es: 'Hacia las estrellas', ja: '宇宙への挑戦' } },
  overtime: { en: '996 Burnout', zh: '996/加班', es: 'Burnout Laboral', ja: '残業戦士', desc: { en: 'Caffeine and tears', zh: '学不死就往死里学', es: 'Cansancio extremo', ja: '過労の果て' } },
  bug: { en: 'Software Bug', zh: '恶性 Bug', es: 'Bug de Código', ja: '深刻なバグ', desc: { en: "It's a feature, not a bug", zh: '这不是缺陷是特异功能', es: 'Es una feature', ja: '仕様です' } },
  server_down: { en: 'Server Crash', zh: '服务器炸了', es: 'Caída de Servidor', ja: '鯖落ち', desc: { en: 'Run to production!', zh: '快跑！删库跑路！', es: '¡Todo se cayó!', ja: '本番サーバー炎上' } },
  bald: { en: 'Bald & Powerful', zh: '变秃变强', es: 'Calvo y Fuerte', ja: 'ハゲて覚醒', desc: { en: 'Lost hair, gained power', zh: '头发掉光，战力暴涨', es: 'Menos pelo, más poder', ja: '毛根と引き換えの力' } },
  detective_dog: { en: 'Detective Dog', zh: '侦探修勾', es: 'Perro Detective', ja: '名探偵ワンコ', desc: { en: 'Found a clue!', zh: '发现了不寻常的线索！', es: '¡Encontró la pista!', ja: '手がかりを発見！' } },
  cyber_cat: { en: 'Cyber Cat', zh: '赛博猫猫', es: 'Gato Cyberpunk', ja: 'サイバーにゃんこ', desc: { en: 'Elite hacker feline', zh: '全网最高黑客', es: 'Hacker felino supremo', ja: '最強の猫ハッカー' } },
  meme: { en: 'Meme Lord', zh: '网络梗王', es: 'Señor de los Memes', ja: 'ミームマスター', desc: { en: 'Viral internet humor', zh: '造梗狂魔', es: 'Humor viral puro', ja: 'ネットの覇者' } },
  capitalist: { en: 'Capitalist Boss', zh: '万恶资本家', es: 'Jefe Capitalista', ja: '資本主義のボス', desc: { en: 'Where is my profit?', zh: '挂在路灯上的那个', es: '¿Dónde está la ganancia?', ja: '利益最優先' } },
  gold: { en: 'Gold', zh: '黄金', es: 'Oro', ja: 'ゴールド', desc: { en: 'Symbol of wealth', zh: '财富象征', es: 'Símbolo de riqueza', ja: '輝く富' } },
  money: { en: 'Cash / Money', zh: '金钱', es: 'Dinero', ja: 'おカネ', desc: { en: 'Makes the world go round', zh: '万能通行证', es: 'Mueve el mundo', ja: '万能の通貨' } },
  salary: { en: 'Meager Paycheck', zh: '微薄工资', es: 'Sueldo Mínimo', ja: 'スズメの涙の給料', desc: { en: 'Gone in seconds', zh: '刚到手就没了', es: 'Se esfuma al instante', ja: '一瞬で消える' } },
  sleep: { en: 'Nap / Slacking', zh: '睡觉摸鱼', es: 'Siesta Feliz', ja: 'サボり/睡眠', desc: { en: 'True bliss', zh: '打工人的最爱', es: 'Paz absoluta', ja: '至福の二度寝' } },
  bed: { en: 'Bed', zh: '小床', es: 'Cama', ja: 'ベッド', desc: { en: 'Where dreams begin', zh: '梦开始的地方', es: 'Donde inician los sueños', ja: '夢の始まり' } },
  cloth: { en: 'Cloth', zh: '布料', es: 'Tela', ja: '布', desc: { en: 'Woven fabric', zh: '纺织的产物', es: 'Tejido suave', ja: '織られた布' } },
  dragon: { en: 'Dragon', zh: '巨龙', es: 'Dragón', ja: 'ドラゴン', desc: { en: 'Fire breathing beast', zh: '吐息烈焰的史诗生物', es: 'Bestia que escupe fuego', ja: '火を吹く伝説の竜' } },
  phoenix: { en: 'Phoenix', zh: '不死凤凰', es: 'Fénix', ja: 'フェニックス', desc: { en: 'Reborn from ashes', zh: '浴火重生', es: 'Renacido de las cenizas', ja: '灰から蘇る不死鳥' } },
  wizard: { en: 'Archmage / Wizard', zh: '大魔法师', es: 'Mago Supremo', ja: '大魔法使い', desc: { en: 'Master of elements', zh: '掌控元素之力', es: 'Maestro de elementos', ja: '元素の支配者' } },
  king: { en: 'King', zh: '国王', es: 'Rey', ja: '国王', desc: { en: 'Wears the crown', zh: '头戴王冠', es: 'Portador de corona', ja: '王冠を戴く者' } },
  god: { en: 'Deity / God', zh: '创世神明', es: 'Deidad Creadora', ja: '創造神', desc: { en: 'Origin of all', zh: '万物的起源与归宿', es: 'Origen de todo', ja: '万物の創造主' } },
  sword: { en: 'Excalibur', zh: '圣剑', es: 'Excalibur', ja: '聖剣エクスカリバー', desc: { en: 'Blade of legend', zh: '斩断虚妄', es: 'Espada legendaria', ja: '伝説の剣' } },
  hero: { en: 'Dragon Slayer Hero', zh: '屠龙勇者', es: 'Héroe Legendario', ja: '竜殺しの勇者', desc: { en: 'Adored by all', zh: '受万人敬仰', es: 'Adorado por multitudes', ja: '称賛される英雄' } },
  skeleton: { en: 'Skeleton', zh: '骷髅', es: 'Esqueleto', ja: 'ガイコツ', desc: { en: 'Echo of time', zh: '岁月的叹息', es: 'Eco del tiempo', ja: '時の名残' } },
  zombie: { en: 'Zombie', zh: '丧尸', es: 'Zombi', ja: 'ゾンビ', desc: { en: 'Apocalypse walker', zh: '生化危机来临', es: 'Caminante no-muerto', ja: '蘇った死者' } },
  sun: { en: 'Sun / Star', zh: '恒星/太阳', es: 'Sol / Estrella', ja: '太陽/恒星', desc: { en: 'Blazing beacon', zh: '照亮银河', es: 'Faro ardiente', ja: '輝く星' } },
  time: { en: 'Time', zh: '时间', es: 'Tiempo', ja: '時間', desc: { en: 'Rivers of moments', zh: '岁月流逝', es: 'Río de momentos', ja: '刻々と流れる時' } },
  moon: { en: 'Moon', zh: '月亮', es: 'Luna', ja: '月', desc: { en: 'Eye of the night', zh: '暗夜之眼', es: 'Ojo de la noche', ja: '夜を照らす月' } },
  eclipse: { en: 'Eclipse', zh: '日食/月食', es: 'Eclipse', ja: '日食/月食', desc: { en: 'Celestial shadow', zh: '天地异象', es: 'Sombra celestial', ja: '天体の交差' } },
  moon_landing: { en: 'Moon Landing', zh: '登月壮举', es: 'Alunizaje', ja: '月面着陸', desc: { en: 'Giant leap for mankind', zh: '人类的一小步', es: 'Gran salto de la humanidad', ja: '人類の偉大な一歩' } },
  space: { en: 'Deep Space', zh: '深空宇宙', es: 'Espacio Profundo', ja: '深宇宙', desc: { en: 'Endless frontier', zh: '无尽的星海', es: 'Frontera infinita', ja: '果てなき星海' } },
  alien: { en: 'Alien Civilization', zh: '外星文明', es: 'Alien / Extraterrestre', ja: '地球外生命体', desc: { en: 'Greetings from distant stars', zh: '来自遥远星系的问候', es: 'Saludos estelares', ja: '星からの訪問者' } },
  black_hole: { en: 'Black Hole', zh: '黑洞', es: 'Agujero Negro', ja: 'ブラックホール', desc: { en: 'Singularity of gravity', zh: '连光都无法逃逸', es: 'Gravedad infinita', ja: '光すら呑み込む特異点' } },
  singularity: { en: 'Singularity Ascent', zh: '赛博飞升/奇点', es: 'Singularidad Tecnológica', ja: 'シンギュラリティ昇天', desc: { en: 'Transcendent ultimate state', zh: '全知全能的终极形态', es: 'Estado supremo omnisciente', ja: '全知全能の終着点' } }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('emoji_craft_lang_v2') || 'en';
  }

  detectUserLanguage() {
    const navLang = (navigator.language || 'en').toLowerCase();
    if (navLang.startsWith('zh')) return 'zh';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('ja')) return 'ja';
    return 'en'; // Default to US English
  }

  setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
      this.currentLang = lang;
      localStorage.setItem('emoji_craft_lang_v2', lang);
      document.documentElement.lang = lang;
      return true;
    }
    return false;
  }

  getLang() {
    return this.currentLang;
  }

  t(key, params = {}) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return text;
  }

  getElementInfo(id) {
    const fallback = { en: id, zh: id, es: id, ja: id, desc: { en: '', zh: '', es: '', ja: '' } };
    const data = ELEMENT_NAMES[id] || fallback;
    const lang = this.currentLang;
    return {
      name: data[lang] || data.en || id,
      desc: (data.desc && data.desc[lang]) || (data.desc && data.desc.en) || ''
    };
  }
}

export const i18n = new I18nManager();
window.i18n = i18n;
