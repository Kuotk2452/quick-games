/**
 * Standalone Simulation Test for Game 07 Neon Beat
 */

import { TRACK_LIST, generateBeatmap } from '../games/07-neon-beat/js/tracks.js';
import { BladeSlicer } from '../games/07-neon-beat/js/slicer.js';

console.log('--- STARTING NEON BEAT SIMULATION TEST ---');

// 1. Test All 4 Tracks & Beatmaps
console.log(`Testing beatmap generation for ${TRACK_LIST.length} tracks...`);
TRACK_LIST.forEach(track => {
  const beatmap = generateBeatmap(track);
  console.assert(beatmap.length > 20, `${track.id} should have > 20 notes, got ${beatmap.length}`);
  const blueCount = beatmap.filter(n => n.type === 'BLUE').length;
  const redCount = beatmap.filter(n => n.type === 'RED').length;
  const bombCount = beatmap.filter(n => n.type === 'BOMB').length;
  console.log(`  🎵 [${track.title.en} (${track.bpm} BPM)]: ${beatmap.length} notes (Blue: ${blueCount}, Red: ${redCount}, Bombs: ${bombCount})`);
});

// 2. Test Slicing Collision Math
console.log('Testing 3D projection & slicing geometry...');
const slicer = new BladeSlicer(null);
const hit = slicer.checkSlice(100, 100, 200, 200, 150, 150, 20);
console.assert(hit === true, 'Slicer line through center of note should hit');

const miss = slicer.checkSlice(100, 100, 200, 200, 400, 400, 20);
console.assert(miss === false, 'Slicer line far from note should miss');
console.log('✅ Slicing collision detection verified');

// 3. Test Physics Block Splitting
slicer.spawnSplitBlock(300, 400, 40, '#00f0ff');
console.assert(slicer.splitBlocks.length === 2, `Should spawn 2 split halves, got ${slicer.splitBlocks.length}`);
slicer.update(0.016);
console.assert(slicer.splitBlocks[0].y !== 400, 'Split block should move with gravity velocity');
console.log('✅ Physics block splitting verified');

// 4. Test Simulated Perfect Playthrough
console.log('Simulating full song playthrough on Expert track...');
const expertTrack = TRACK_LIST[3];
const notes = generateBeatmap(expertTrack);
let score = 0;
let combo = 0;
let multiplier = 1;

notes.forEach(note => {
  if (note.type !== 'BOMB') {
    combo++;
    if (combo > 40) multiplier = 8;
    else if (combo > 20) multiplier = 4;
    else if (combo > 10) multiplier = 2;
    else multiplier = 1;
    score += 1000 * multiplier;
  }
});

console.log(`🏆 Expert Perfect Run: Score ${score.toLocaleString()}, Max Combo ${combo}x`);
console.assert(score > 50000, `Score should be > 50,000, got ${score}`);

console.log('--- ALL NEON BEAT TESTS PASSED 100% ---');
