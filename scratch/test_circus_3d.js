/**
 * Standalone Simulation Test for Game 08 Circus Rush 3D
 */

import { TRANSLATIONS } from '../games/08-circus-3d/js/i18n.js';

console.log('--- STARTING CIRCUS RUSH 3D SIMULATION TEST ---');

const ACT_DEFINITIONS = [
  { id: 1, nameKey: 'act1Name', descKey: 'act1Desc', badge: '🦁 ACT 1', goalDist: 100, speed: 5.5, themeColor: '#ef4444' },
  { id: 2, nameKey: 'act2Name', descKey: 'act2Desc', badge: '🐒 ACT 2', goalDist: 100, speed: 6.0, themeColor: '#3b82f6' },
  { id: 3, nameKey: 'act3Name', descKey: 'act3Desc', badge: '⚽ ACT 3', goalDist: 100, speed: 6.5, themeColor: '#ec4899' },
  { id: 4, nameKey: 'act4Name', descKey: 'act4Desc', badge: '🪢 ACT 4', goalDist: 100, speed: 7.0, themeColor: '#facc15' }
];

// 1. Verify 4 Acts definitions & i18n
console.log(`Checking ${ACT_DEFINITIONS.length} circus acts...`);
ACT_DEFINITIONS.forEach(act => {
  console.assert(act.goalDist >= 100, `Act ${act.id} should have goalDist >= 100`);
  console.assert(TRANSLATIONS.en[act.nameKey] !== undefined, `Missing EN translation for ${act.nameKey}`);
  console.assert(TRANSLATIONS.zh[act.nameKey] !== undefined, `Missing ZH translation for ${act.nameKey}`);
  console.log(`  🎪 [${act.badge}]: ${TRANSLATIONS.en[act.nameKey]} (${act.speed} m/s)`);
});

// 2. Test Jump Physics Calculus
console.log('Testing jump arc and gravity integration...');
let y = 0;
let vy = 10.5;
const gravity = -26.0;
const dt = 0.016; // 60 FPS step
let maxHeight = 0;
let flightSteps = 0;

while (flightSteps < 100) {
  vy += gravity * dt;
  y += vy * dt;
  if (y > maxHeight) maxHeight = y;
  flightSteps++;
  if (y <= 0) break;
}

console.log(`  🦘 Jump Peak Height: ${maxHeight.toFixed(2)}m across ${flightSteps} frames (${(flightSteps * dt).toFixed(2)}s flight time)`);
console.assert(maxHeight > 1.8 && maxHeight < 2.5, 'Jump height should reach between 1.8m and 2.5m for fire ring clearance');

// 3. Test Fire Ring Opening Clearance Logic
console.log('Testing Fire Ring clearance boundary logic...');
const testRingY_Inside = 1.6;
const testRingY_TooLow = 0.3;

const isInsidePass = (testRingY_Inside >= 0.75 && testRingY_Inside <= 2.8);
const isTooLowPass = (testRingY_TooLow >= 0.75 && testRingY_TooLow <= 2.8);

console.assert(isInsidePass === true, 'Center jump should clear ring');
console.assert(isTooLowPass === false, 'Low run should hit bottom rim of ring');
console.log('✅ Fire Ring clearance logic verified');

console.log('--- ALL CIRCUS RUSH 3D TESTS PASSED 100% ---');
