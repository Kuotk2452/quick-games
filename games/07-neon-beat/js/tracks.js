/**
 * Track Definitions & Beatmap Generator for Neon Beat
 */

export const TRACK_LIST = [
  {
    id: 'cyber_highway',
    title: { en: 'Cyber Highway', zh: '赛博极速公路', es: 'Autopista Cyber', ja: 'サイバー・ハイウェイ' },
    bpm: 120,
    difficulty: { en: 'EASY', zh: '简单', es: 'FÁCIL', ja: '初級' },
    diffLevel: 1,
    duration: 50,
    themeColor: '#00f0ff',
    badge: '🟢 LV.1'
  },
  {
    id: 'neon_tokyo',
    title: { en: 'Neon Tokyo 2099', zh: '东京霓虹幻境', es: 'Tokio Neón 2099', ja: 'ネオン・トウキョウ' },
    bpm: 140,
    difficulty: { en: 'MEDIUM', zh: '中等', es: 'MEDIO', ja: '中級' },
    diffLevel: 2,
    duration: 55,
    themeColor: '#ec4899',
    badge: '🟡 LV.2'
  },
  {
    id: 'overdrive_rush',
    title: { en: 'Overdrive Rush', zh: '超载狂飙音速', es: 'Carrera Overdrive', ja: 'オーバードライブ' },
    bpm: 160,
    difficulty: { en: 'HARD', zh: '困难', es: 'DIFÍCIL', ja: '上級' },
    diffLevel: 3,
    duration: 60,
    themeColor: '#a855f7',
    badge: '🔴 LV.3'
  },
  {
    id: 'apex_singularity',
    title: { en: 'Apex Singularity', zh: '终极奇点超频', es: 'Singularidad Apex', ja: '特異点エイペックス' },
    bpm: 175,
    difficulty: { en: 'EXPERT', zh: '极限大师', es: 'EXPERTO', ja: '皆伝' },
    diffLevel: 4,
    duration: 65,
    themeColor: '#facc15',
    badge: '🔥 LV.4'
  }
];

/**
 * Procedural Beatmap Generator based on song BPM and Duration
 */
export function generateBeatmap(song) {
  const notes = [];
  const beatInterval = 60 / song.bpm;
  const totalBeats = Math.floor(song.duration / beatInterval);

  // Density factor based on difficulty
  const density = song.diffLevel === 1 ? 0.6 : song.diffLevel === 2 ? 0.85 : song.diffLevel === 3 ? 1.15 : 1.45;

  let currentBeat = 4; // Intro 4-beat buffer

  while (currentBeat < totalBeats - 4) {
    const time = currentBeat * beatInterval;
    const isBomb = Math.random() < (song.diffLevel > 1 ? 0.08 : 0);

    if (isBomb) {
      notes.push({
        id: `note_${notes.length}`,
        time,
        lane: Math.floor(Math.random() * 4), // 0, 1, 2, 3
        type: 'BOMB',
        hit: false,
        missed: false
      });
    } else {
      // 50% Blue (Left Lanes 0,1), 50% Red (Right Lanes 2,3)
      const isBlue = Math.random() > 0.5;
      const lane = isBlue ? (Math.random() > 0.5 ? 0 : 1) : (Math.random() > 0.5 ? 2 : 3);

      notes.push({
        id: `note_${notes.length}`,
        time,
        lane,
        type: isBlue ? 'BLUE' : 'RED',
        hit: false,
        missed: false
      });

      // On higher difficulties, spawn simultaneous double hits on downbeats
      if (song.diffLevel >= 3 && Math.random() < 0.25 && currentBeat % 2 === 0) {
        const dualLane = isBlue ? 2 : 0;
        notes.push({
          id: `note_${notes.length}`,
          time,
          lane: dualLane,
          type: isBlue ? 'RED' : 'BLUE',
          hit: false,
          missed: false
        });
      }
    }

    // Step forward in beats (1 beat, half beat, or 1.5 beats)
    const stepOptions = song.diffLevel === 1 ? [1, 2] : song.diffLevel === 2 ? [0.5, 1] : [0.5, 0.5, 1];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    currentBeat += step;
  }

  // Sort notes chronologically
  return notes.sort((a, b) => a.time - b.time);
}
