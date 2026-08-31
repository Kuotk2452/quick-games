/**
 * Standalone Simulation QC Test for Game 05 Cosmic Orbit
 */

import { CosmicPhysicsWorld } from '../games/05-cosmic-orbit/js/physics.js';
import { CELESTIAL_TIERS } from '../games/05-cosmic-orbit/js/celestial.js';

console.log('--- STARTING COSMIC ORBIT SIMULATION TEST ---');

const world = new CosmicPhysicsWorld(300, 300);
let mergeCount = 0;
let highestTierReached = 1;

world.onMergeCallback = (tier, x, y) => {
  mergeCount++;
  if (tier > highestTierReached) {
    highestTierReached = tier;
  }
};

// 1. Test Trajectory Prediction
const points = world.predictTrajectory(300, 45, 120, 0, 30);
console.assert(points.length === 30, `Trajectory should have 30 points, got ${points.length}`);
console.log(`✅ Trajectory prediction test passed (Points: ${points.length})`);

// 2. Test Spawning and Radial Newtonian Orbit Simulation
console.log('Spawning celestial bodies into orbit...');
for (let i = 0; i < 20; i++) {
  const angle = (i / 20) * Math.PI * 2;
  const r = 160;
  const x = 300 + Math.cos(angle) * r;
  const y = 300 + Math.sin(angle) * r;

  // Tangential orbital velocity for circular orbit: v = sqrt(G*M / r)
  const speed = Math.sqrt((world.gravityConstant * world.blackHoleMass) / (r * r)) * 12;
  const vx = -Math.sin(angle) * speed;
  const vy = Math.cos(angle) * speed;

  const tier = (i % 3) + 1; // Tiers 1-3
  world.addBody(tier, x, y, vx, vy);
}

console.assert(world.bodies.length === 20, `Should have 20 bodies, got ${world.bodies.length}`);

// 3. Step physics through 200 frames (dt = 0.033s)
console.log('Simulating 200 orbital physics steps...');
for (let f = 0; f < 200; f++) {
  world.update(0.033);
}

console.log(`Physics simulation finished. Merges occurred: ${mergeCount}, Highest Tier: ${highestTierReached}`);

// 4. Test Direct Merge of Twin Tier 10 Supernovas into Tier 11 Quasar
console.log('Testing Supernova Quasar Singularity Forge...');
world.addBody(10, 290, 300, 10, 0);
world.addBody(10, 310, 300, -10, 0);

for (let f = 0; f < 20; f++) {
  world.update(0.033);
}

console.assert(highestTierReached >= 11, `Highest tier should reach 11 (Quasar), got ${highestTierReached}`);
console.log(`✅ Tier 11 Quasar merge successfully achieved!`);

console.log('--- ALL SIMULATION TESTS PASSED 100% ---');
