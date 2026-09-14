/**
 * 3D Physics Simulation & Articulated Crane Claw Mechanics for Dungeon Claw
 * Real-time 3D rigid body dynamics, bounding pit collisions, and multi-prong grasping.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { soundEngine } from './audio.js';

export class PhysicsWorld3D {
  constructor() {
    this.items = []; // Array of { mesh, def, pos, vel, radius, mass, isGrabbed }
    this.bounds = {
      minX: -2.4, maxX: 2.4,
      minZ: -1.6, maxZ: 1.6,
      floorY: -2.0, ceilingY: 3.5
    };
    this.gravity = -12.0;

    // Crane Claw State
    this.claw = {
      x: 0,
      z: 0,
      y: 2.2, // Cable height
      targetY: 2.2,
      baseY: 2.2,
      minY: -1.90, // Lowest drop reach directly onto floor
      speed: 6.0,
      dropSpeed: 7.5,
      liftSpeed: 6.5,
      state: 'IDLE', // 'IDLE' | 'MOVING' | 'DROPPING' | 'GRABBING' | 'LIFTING' | 'DELIVERING'
      openAngle: 0.70, // Prongs open wide
      currentAngle: 0.70,
      targetAngle: 0.70,
      gripStrength: 1.0,
      grabbedItems: [],
      meshGroup: null
    };

    this.onDeliveryCallback = null;
  }

  reset() {
    this.items = [];
    this.claw.x = 0;
    this.claw.z = 0;
    this.claw.y = this.claw.baseY;
    this.claw.state = 'IDLE';
    this.claw.currentAngle = this.claw.openAngle;
    this.claw.grabbedItems = [];
  }

  addItem(mesh, def, x, y, z) {
    const item = {
      mesh,
      def,
      pos: new THREE.Vector3(x, y, z),
      vel: new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 2, (Math.random() - 0.5) * 1.5),
      rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      rotVel: new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3),
      radius: def.radius || 0.45,
      mass: def.weight || 1.0,
      isGrabbed: false
    };
    mesh.position.copy(item.pos);
    this.items.push(item);
  }

  removeItem(item) {
    const idx = this.items.indexOf(item);
    if (idx !== -1) {
      this.items.splice(idx, 1);
    }
  }

  moveClaw(dx, dz, dt) {
    if (this.claw.state !== 'IDLE') return;

    const moveX = dx * this.claw.speed * dt;
    const moveZ = dz * this.claw.speed * dt;

    this.claw.x = THREE.MathUtils.clamp(this.claw.x + moveX, this.bounds.minX + 0.3, this.bounds.maxX - 0.3);
    this.claw.z = THREE.MathUtils.clamp(this.claw.z + moveZ, this.bounds.minZ + 0.3, this.bounds.maxZ - 0.3);
  }

  triggerDrop() {
    this.claw.state = 'DROPPING';
    this.claw.targetAngle = this.claw.openAngle; // Open wide
    soundEngine.playClawDrop();
    return true;
  }

  update(dt) {
    this.updateClaw(dt);
    this.updateItemPhysics(dt);
  }

  updateClaw(dt) {
    // Smooth angle transition for claw prongs
    this.claw.currentAngle += (this.claw.targetAngle - this.claw.currentAngle) * dt * 8;

    if (this.claw.state === 'DROPPING') {
      this.claw.y -= this.claw.dropSpeed * dt;

      // Plunge directly to pit floor to fully envelope items
      if (this.claw.y <= this.claw.minY) {
        this.claw.y = this.claw.minY;
        this.claw.state = 'GRABBING';
        this.claw.targetAngle = 0.05; // Close prongs tightly
        soundEngine.playClawGrab();
        this.grabTimer = 0.35;
      }
    } else if (this.claw.state === 'GRABBING') {
      this.grabTimer -= dt;

      // Gently corral nearby items toward claw center and damp velocities so they do not bounce away
      for (const item of this.items) {
        if (item.isGrabbed) continue;
        const dx = this.claw.x - item.pos.x;
        const dz = this.claw.z - item.pos.z;
        const distXZ = Math.hypot(dx, dz);
        if (distXZ < 2.5) {
          item.vel.x = dx * 1.5;
          item.vel.z = dz * 1.5;
        }
      }

      if (this.grabTimer <= 0) {
        // Detect and latch items
        this.performGraspDetection();
        this.claw.state = 'LIFTING';
      }
    } else if (this.claw.state === 'LIFTING') {
      this.claw.y += this.claw.liftSpeed * dt;

      // Update positions of grabbed items to follow claw securely inside the basket
      for (const item of this.claw.grabbedItems) {
        item.pos.set(
          this.claw.x + item.grabOffset.x,
          this.claw.y + item.grabOffset.y,
          this.claw.z + item.grabOffset.z
        );
        item.vel.set(0, 0, 0);
      }

      if (this.claw.y >= this.claw.baseY) {
        this.claw.y = this.claw.baseY;
        this.claw.state = 'DELIVERING';
        this.deliverTimer = 0.30;
      }
    } else if (this.claw.state === 'DELIVERING') {
      this.deliverTimer -= dt;
      if (this.deliverTimer <= 0) {
        const delivered = [...this.claw.grabbedItems];
        this.claw.targetAngle = this.claw.openAngle; // Release
        this.claw.grabbedItems = [];
        this.claw.state = 'IDLE';
        this.claw.y = this.claw.baseY;

        if (this.onDeliveryCallback) {
          this.onDeliveryCallback(delivered);
        }
      }
    }
  }

  performGraspDetection() {
    this.claw.grabbedItems = [];
    const grabRadius = 2.6 * this.claw.gripStrength; // Ultra-generous arcade grasp
    const candidates = [];

    for (const item of this.items) {
      const distXZ = Math.hypot(item.pos.x - this.claw.x, item.pos.z - this.claw.z);
      if (distXZ < grabRadius) {
        candidates.push({ item, distXZ });
      }
    }

    // Sort by proximity to claw center
    candidates.sort((a, b) => a.distXZ - b.distXZ);

    // Grab up to 3 items comfortably within the 3-prong articulation
    const toGrab = candidates.slice(0, 3);

    // 100% Guaranteed Magnetic Scoop: Never let a drop return empty!
    // If fewer than 2 items were within reach, pull the closest items from anywhere in the pit to guarantee 2-3 items every drop!
    if (toGrab.length < 2 && this.items.length > 0) {
      const alreadyGrabbed = new Set(toGrab.map(t => t.item));
      const remaining = this.items.filter(item => !alreadyGrabbed.has(item));
      remaining.sort((a, b) => {
        const da = Math.hypot(a.pos.x - this.claw.x, a.pos.z - this.claw.z);
        const db = Math.hypot(b.pos.x - this.claw.x, b.pos.z - this.claw.z);
        return da - db;
      });
      const needed = Math.min(remaining.length, 3 - toGrab.length);
      for (let i = 0; i < needed; i++) {
        toGrab.push({ item: remaining[i], distXZ: Math.hypot(remaining[i].pos.x - this.claw.x, remaining[i].pos.z - this.claw.z) });
      }
    }

    toGrab.forEach(({ item }, index) => {
      item.isGrabbed = true;
      const angle = (index / Math.max(1, toGrab.length)) * Math.PI * 2;
      const offsetRadius = toGrab.length > 1 ? 0.22 : 0.05;
      item.grabOffset = {
        x: Math.cos(angle) * offsetRadius,
        y: -0.30,
        z: Math.sin(angle) * offsetRadius
      };
      this.claw.grabbedItems.push(item);
    });

    return this.claw.grabbedItems;
  }

  updateItemPhysics(dt) {
    // Sub-step physics integration for stability
    const subSteps = 2;
    const subDt = dt / subSteps;

    for (let step = 0; step < subSteps; step++) {
      // 1. Apply gravity & velocities
      for (const item of this.items) {
        if (item.isGrabbed) continue;

        item.vel.y += this.gravity * subDt;
        item.pos.addScaledVector(item.vel, subDt);

        item.rot.x += item.rotVel.x * subDt;
        item.rot.y += item.rotVel.y * subDt;
        item.rot.z += item.rotVel.z * subDt;

        // Damping
        item.vel.multiplyScalar(0.985);
        item.rotVel.multiplyScalar(0.98);

        // 2. Wall Collisions
        if (item.pos.x - item.radius < this.bounds.minX) {
          item.pos.x = this.bounds.minX + item.radius;
          item.vel.x = -item.vel.x * 0.5;
        } else if (item.pos.x + item.radius > this.bounds.maxX) {
          item.pos.x = this.bounds.maxX - item.radius;
          item.vel.x = -item.vel.x * 0.5;
        }

        if (item.pos.z - item.radius < this.bounds.minZ) {
          item.pos.z = this.bounds.minZ + item.radius;
          item.vel.z = -item.vel.z * 0.5;
        } else if (item.pos.z + item.radius > this.bounds.maxZ) {
          item.pos.z = this.bounds.maxZ - item.radius;
          item.vel.z = -item.vel.z * 0.5;
        }

        if (item.pos.y - item.radius < this.bounds.floorY) {
          item.pos.y = this.bounds.floorY + item.radius;
          item.vel.y = -item.vel.y * 0.35;
          // Floor friction
          item.vel.x *= 0.85;
          item.vel.z *= 0.85;
        }
      }

      // 3. Item-to-Item Spherical Collisions
      for (let i = 0; i < this.items.length; i++) {
        const a = this.items[i];
        if (a.isGrabbed) continue;

        for (let j = i + 1; j < this.items.length; j++) {
          const b = this.items[j];
          if (b.isGrabbed) continue;

          const delta = new THREE.Vector3().subVectors(b.pos, a.pos);
          const dist = delta.length();
          const minDist = a.radius + b.radius;

          if (dist < minDist && dist > 0.001) {
            const normal = delta.normalize();
            const overlap = minDist - dist;

            // Separate overlapping bodies
            a.pos.addScaledVector(normal, -overlap * 0.5);
            b.pos.addScaledVector(normal, overlap * 0.5);

            // Elastic impulse
            const normalVel = (b.vel.x - a.vel.x) * normal.x +
                              (b.vel.y - a.vel.y) * normal.y +
                              (b.vel.z - a.vel.z) * normal.z;

            if (normalVel < 0) {
              const impulse = -(1 + 0.5) * normalVel / (1 / a.mass + 1 / b.mass);
              a.vel.addScaledVector(normal, -impulse / a.mass);
              b.vel.addScaledVector(normal, impulse / b.mass);
            }
          }
        }
      }
    }

    // Sync mesh transforms
    for (const item of this.items) {
      item.mesh.position.copy(item.pos);
      item.mesh.rotation.copy(item.rot);
    }
  }
}
