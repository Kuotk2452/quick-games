/**
 * Radial Newtonian Gravity Physics & Celestial Merge Simulation
 */

import { CELESTIAL_TIERS } from './celestial.js';

export class CosmicPhysicsWorld {
  constructor(centerX, centerY) {
    this.center = { x: centerX, y: centerY };
    this.bodies = []; // { id, tier, pos: {x,y}, vel: {vx,vy}, radius, mass }
    this.nextId = 1;
    this.gravityConstant = 32000;
    this.blackHoleMass = 120;
    this.eventHorizonRadius = 265; // Outer boundary limit
    this.singularityRadius = 22; // Inner black hole core
    this.onMergeCallback = null;
    this.overflowWarningTime = 0;
  }

  addBody(tier, x, y, vx = 0, vy = 0) {
    const def = CELESTIAL_TIERS[tier - 1];
    const body = {
      id: this.nextId++,
      tier,
      pos: { x, y },
      vel: { vx, vy },
      radius: def.radius,
      mass: def.mass,
      overflowTimer: 0
    };
    this.bodies.push(body);
    return body;
  }

  removeBody(body) {
    const idx = this.bodies.indexOf(body);
    if (idx !== -1) {
      this.bodies.splice(idx, 1);
    }
  }

  // Trajectory Prediction for Slingshot Aim
  predictTrajectory(startX, startY, initVx, initVy, steps = 30) {
    const points = [];
    let x = startX;
    let y = startY;
    let vx = initVx;
    let vy = initVy;
    const dt = 0.035;

    for (let s = 0; s < steps; s++) {
      const dx = this.center.x - x;
      const dy = this.center.y - y;
      const distSq = Math.max(900, dx * dx + dy * dy);
      const dist = Math.sqrt(distSq);

      const force = (this.gravityConstant * this.blackHoleMass) / distSq;
      const ax = (dx / dist) * force;
      const ay = (dy / dist) * force;

      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;

      points.push({ x, y });
    }
    return points;
  }

  // Apply Special Power: Gravity Pulse (inward/outward impulse)
  applyGravityPulse(forceMagnitude = 250) {
    this.bodies.forEach(b => {
      const dx = this.center.x - b.pos.x;
      const dy = this.center.y - b.pos.y;
      const dist = Math.hypot(dx, dy) || 1;
      b.vel.vx += (dx / dist) * forceMagnitude;
      b.vel.vy += (dy / dist) * forceMagnitude;
    });
  }

  // Apply Special Power: Twin Pull (attract matching twin tiers)
  applyTwinPull() {
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const a = this.bodies[i];
        const b = this.bodies[j];
        if (a.tier === b.tier) {
          const dx = b.pos.x - a.pos.x;
          const dy = b.pos.y - a.pos.y;
          const dist = Math.hypot(dx, dy) || 1;
          a.vel.vx += (dx / dist) * 180;
          a.vel.vy += (dy / dist) * 180;
          b.vel.vx -= (dx / dist) * 180;
          b.vel.vy -= (dy / dist) * 180;
        }
      }
    }
  }

  update(dt) {
    const subSteps = 3;
    const subDt = dt / subSteps;

    let isOverflowing = false;

    for (let step = 0; step < subSteps; step++) {
      // 1. Radial Newtonian Gravity & Damping
      for (const b of this.bodies) {
        const dx = this.center.x - b.pos.x;
        const dy = this.center.y - b.pos.y;
        const distSq = Math.max(900, dx * dx + dy * dy);
        const dist = Math.sqrt(distSq);

        const force = (this.gravityConstant * this.blackHoleMass) / distSq;
        b.vel.vx += (dx / dist) * force * subDt;
        b.vel.vy += (dy / dist) * force * subDt;

        // Position integration
        b.pos.x += b.vel.vx * subDt;
        b.pos.y += b.vel.vy * subDt;

        // Very slight cosmic friction for smooth orbital settling
        b.vel.vx *= 0.999;
        b.vel.vy *= 0.999;

        // Central Singularity Bounce / Repulsion
        const minCenterDist = this.singularityRadius + b.radius;
        if (dist < minCenterDist) {
          const overlap = minCenterDist - dist;
          b.pos.x -= (dx / dist) * overlap;
          b.pos.y -= (dy / dist) * overlap;
          b.vel.vx = -(dx / dist) * 80;
          b.vel.vy = -(dy / dist) * 80;
        }

        // Outer Event Horizon Check
        if (dist + b.radius > this.eventHorizonRadius) {
          isOverflowing = true;
        }
      }

      // 2. Inter-Planet Collisions & Merging
      const mergedBodies = new Set();

      for (let i = 0; i < this.bodies.length; i++) {
        const a = this.bodies[i];
        if (mergedBodies.has(a)) continue;

        for (let j = i + 1; j < this.bodies.length; j++) {
          const b = this.bodies[j];
          if (mergedBodies.has(b)) continue;

          const dx = b.pos.x - a.pos.x;
          const dy = b.pos.y - a.pos.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.radius + b.radius;

          if (dist < minDist && dist > 0.001) {
            // Check identical tier merge
            if (a.tier === b.tier && a.tier < CELESTIAL_TIERS.length) {
              mergedBodies.add(a);
              mergedBodies.add(b);

              const nextTier = a.tier + 1;
              const mergeX = (a.pos.x + b.pos.x) / 2;
              const mergeY = (a.pos.y + b.pos.y) / 2;
              const mergeVx = (a.vel.vx + b.vel.vx) / 2;
              const mergeVy = (a.vel.vy + b.vel.vy) / 2;

              this.removeBody(a);
              this.removeBody(b);

              const newBody = this.addBody(nextTier, mergeX, mergeY, mergeVx, mergeVy);

              if (this.onMergeCallback) {
                this.onMergeCallback(nextTier, mergeX, mergeY);
              }
              break;
            } else {
              // Elastic collision
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = minDist - dist;

              a.pos.x -= nx * overlap * 0.5;
              a.pos.y -= ny * overlap * 0.5;
              b.pos.x += nx * overlap * 0.5;
              b.pos.y += ny * overlap * 0.5;

              const normalVel = (b.vel.vx - a.vel.vx) * nx + (b.vel.vy - a.vel.vy) * ny;
              if (normalVel < 0) {
                const impulse = -(1 + 0.45) * normalVel / (1 / a.mass + 1 / b.mass);
                a.vel.vx -= (impulse / a.mass) * nx;
                a.vel.vy -= (impulse / a.mass) * ny;
                b.vel.vx += (impulse / b.mass) * nx;
                b.vel.vy += (impulse / b.mass) * ny;
              }
            }
          }
        }
      }
    }

    if (isOverflowing) {
      this.overflowWarningTime += dt;
    } else {
      this.overflowWarningTime = Math.max(0, this.overflowWarningTime - dt * 2);
    }
  }
}
