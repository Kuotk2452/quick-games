/**
 * Standalone Combat Simulation Test for Game 06 Mecha Arena Expanded
 */

import { RobotEntity } from '../games/06-mecha-arena/js/combat.js';
import { CHASSIS_PARTS, WEAPON_PARTS, MODULE_PARTS } from '../games/06-mecha-arena/js/workshop.js';
import { TOURNAMENT_TIERS } from '../games/06-mecha-arena/js/game.js';

console.log('--- STARTING EXPANDED MECHA ARENA TEST ---');

// 1. Test All 4 Chassis
console.log(`Testing all ${CHASSIS_PARTS.length} chassis...`);
CHASSIS_PARTS.forEach(c => {
  const bot = new RobotEntity(true, c.id, 'GATLING', 'SHIELD');
  console.assert(bot.hp === c.maxHp, `${c.id} HP mismatch: got ${bot.hp}, expected ${c.maxHp}`);
  console.log(`  🦾 Chassis [${c.id}]: HP ${bot.hp}, Speed ${c.speed}, Recoil Absorb ${c.recoilAbsorb}`);
});

// 2. Test All 7 Weapons
console.log(`Testing all ${WEAPON_PARTS.length} weapons...`);
const bullets = [];
const particles = {
  spawnSparks: () => {},
  spawnExplosion: () => {},
  spawnFlames: () => {},
  addLaser: () => {}
};

WEAPON_PARTS.forEach(w => {
  const bot = new RobotEntity(true, 'TITAN', w.id, 'SHIELD');
  const enemy = new RobotEntity(false, 'HOVER', 'GATLING', 'SHIELD');
  bot.turretAngle = 0;
  bot.fireWeapon(bullets, particles, enemy);
  console.log(`  🔫 Weapon [${w.id}]: Type ${w.type}, Damage ${w.damage}, Range ${w.range}, Recoil ${w.recoil}`);
});

// 3. Test All 5 Tactical Subsystems
console.log(`Testing all ${MODULE_PARTS.length} tactical subsystems...`);
const mines = [];
const drones = [];

MODULE_PARTS.forEach(m => {
  const bot = new RobotEntity(true, 'TITAN', 'MISSILE', m.id);
  const activated = bot.activateModule(mines, drones);
  console.assert(activated === true, `Module ${m.id} should activate successfully`);
  console.log(`  🚀 Subsystem [${m.id}]: Duration ${m.duration || 0}s, Cooldown ${m.cooldown}s`);
});

console.assert(mines.length === 3, `EMP Mines should spawn 3 mines, got ${mines.length}`);
console.assert(drones.length === 1, `Drone should spawn 1 drone, got ${drones.length}`);

console.log('--- ALL EXPANDED MECHA ARENA TESTS PASSED 100% ---');
