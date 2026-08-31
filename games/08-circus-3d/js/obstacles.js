/**
 * 3D Obstacles & Item Generators for Circus Rush 3D
 * Generates Blazing Fire Rings, Coin Jars, Tightrope Monkeys, and Trampolines in Three.js
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class ObstacleFactory3D {
  // 1. Blazing Fire Ring (Torus with flame particle aura)
  static createFireRing(radius = 1.4, tube = 0.08, isDouble = false) {
    const group = new THREE.Group();

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xff5500,
      emissiveIntensity: 0.8,
      roughness: 0.3
    });

    const ringGeo = new THREE.TorusGeometry(radius, tube, 12, 24);
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.y = Math.PI / 2; // Face forward down the runway
    ringMesh.position.y = radius + 0.3;
    group.add(ringMesh);

    // Stand base holding the ring
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const standGeo = new THREE.CylinderGeometry(0.06, 0.08, radius + 0.3, 8);
    const standMesh = new THREE.Mesh(standGeo, standMat);
    standMesh.position.set(0, (radius + 0.3) / 2, 0);
    group.add(standMesh);

    // Rotating flame particles around the ring
    const flameCount = 14;
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const flames = [];

    for (let i = 0; i < flameCount; i++) {
      const angle = (i / flameCount) * Math.PI * 2;
      const flameGeo = new THREE.SphereGeometry(0.12, 6, 6);
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(
        0,
        radius + 0.3 + Math.sin(angle) * radius,
        Math.cos(angle) * radius
      );
      group.add(flame);
      flames.push({ mesh: flame, angle, radius });
    }

    return {
      group,
      radius,
      flames,
      isDouble
    };
  }

  // 2. Gold Coin Jar (Pot of Gold)
  static createCoinJar() {
    const group = new THREE.Group();

    const potMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Clay / Bronze Jar
      roughness: 0.6
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xca8a04,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2
    });

    // Jar Body
    const potGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.6, 10);
    const potMesh = new THREE.Mesh(potGeo, potMat);
    potMesh.position.y = 0.3;
    potMesh.castShadow = true;
    group.add(potMesh);

    // Floating Glowing Gold Coin on top
    const coinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 12);
    const coinMesh = new THREE.Mesh(coinGeo, goldMat);
    coinMesh.rotation.x = Math.PI / 2;
    coinMesh.position.y = 0.85;
    group.add(coinMesh);

    return {
      group,
      coinMesh
    };
  }

  // 3. Circus Trampoline Springboard
  static createTrampoline() {
    const group = new THREE.Group();

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.5 });
    const matMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.8 });

    // Base ring
    const ringGeo = new THREE.TorusGeometry(0.9, 0.08, 8, 16);
    const ringMesh = new THREE.Mesh(ringGeo, frameMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.4;
    group.add(ringMesh);

    // Bouncing Pad
    const padGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.05, 16);
    const padMesh = new THREE.Mesh(padGeo, matMat);
    padMesh.position.y = 0.4;
    group.add(padMesh);

    // 4 Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6);
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const leg = new THREE.Mesh(legGeo, frameMat);
      leg.position.set(Math.cos(angle) * 0.8, 0.2, Math.sin(angle) * 0.8);
      group.add(leg);
    }

    return group;
  }
}
