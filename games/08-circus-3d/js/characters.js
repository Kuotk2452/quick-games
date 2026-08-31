/**
 * Procedural 3D Characters & Skeletal Animations for Circus Rush 3D
 * Generates 3D Lion & Charlie Acro-Rider, Monkey, and Circus Spheres using Three.js
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class CharacterFactory3D {
  // 1. Build Lion & Charlie Rider Mesh Group
  static createLionRider() {
    const group = new THREE.Group();

    // --- LION BODY ---
    const lionMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Warm golden fur
      roughness: 0.5,
      metalness: 0.1
    });

    const maneMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Dark orange mane
      roughness: 0.6,
      metalness: 0.0
    });

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827 });

    // Main Torso
    const bodyGeo = new THREE.BoxGeometry(1.6, 0.85, 0.9);
    const bodyMesh = new THREE.Mesh(bodyGeo, lionMat);
    bodyMesh.position.y = 0.85;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    // Lion Mane & Head
    const maneGeo = new THREE.SphereGeometry(0.65, 12, 12);
    const maneMesh = new THREE.Mesh(maneGeo, maneMat);
    maneMesh.position.set(0.9, 1.1, 0);
    maneMesh.castShadow = true;
    group.add(maneMesh);

    const snoutGeo = new THREE.BoxGeometry(0.5, 0.35, 0.45);
    const snoutMesh = new THREE.Mesh(snoutGeo, lionMat);
    snoutMesh.position.set(1.35, 1.05, 0);
    group.add(snoutMesh);

    // Nose
    const noseGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const noseMesh = new THREE.Mesh(noseGeo, blackMat);
    noseMesh.position.set(1.62, 1.15, 0);
    group.add(noseMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const leftEye = new THREE.Mesh(eyeGeo, blackMat);
    leftEye.position.set(1.2, 1.3, 0.25);
    const rightEye = new THREE.Mesh(eyeGeo, blackMat);
    rightEye.position.set(1.2, 1.3, -0.25);
    group.add(leftEye, rightEye);

    // 4 Articulated Legs
    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.65, 8);
    
    // Front Left
    const flLeg = new THREE.Mesh(legGeo, lionMat);
    flLeg.position.set(0.6, 0.35, 0.38);
    flLeg.castShadow = true;

    // Front Right
    const frLeg = new THREE.Mesh(legGeo, lionMat);
    frLeg.position.set(0.6, 0.35, -0.38);
    frLeg.castShadow = true;

    // Back Left
    const blLeg = new THREE.Mesh(legGeo, lionMat);
    blLeg.position.set(-0.6, 0.35, 0.38);
    blLeg.castShadow = true;

    // Back Right
    const brLeg = new THREE.Mesh(legGeo, lionMat);
    brLeg.position.set(-0.6, 0.35, -0.38);
    brLeg.castShadow = true;

    group.add(flLeg, frLeg, blLeg, brLeg);

    // Wagging Tail
    const tailGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.7, 6);
    const tailMesh = new THREE.Mesh(tailGeo, lionMat);
    tailMesh.position.set(-0.9, 0.9, 0);
    tailMesh.rotation.z = Math.PI / 4;
    group.add(tailMesh);

    // --- CHARLIE RIDER ---
    const riderGroup = new THREE.Group();
    riderGroup.position.set(-0.1, 1.35, 0);

    const suitMat = new THREE.MeshStandardMaterial({ color: 0xef4444 }); // Festive Red Suit
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde047 }); // Cute Yellow/Peach Skin
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 }); // Royal Blue Top Hat

    // Rider Torso
    const riderBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.45, 8), suitMat);
    riderBody.position.y = 0.22;
    riderGroup.add(riderBody);

    // Rider Head
    const riderHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), skinMat);
    riderHead.position.y = 0.55;
    riderGroup.add(riderHead);

    // Top Hat
    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 10), hatMat);
    hatBase.position.y = 0.72;
    const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 10), hatMat);
    hatCrown.position.y = 0.9;
    riderGroup.add(hatBase, hatCrown);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.35, 6);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(0.1, 0.32, 0.25);
    leftArm.rotation.x = Math.PI / 6;

    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(0.1, 0.32, -0.25);
    rightArm.rotation.x = -Math.PI / 6;
    riderGroup.add(leftArm, rightArm);

    group.add(riderGroup);

    return {
      mesh: group,
      flLeg,
      frLeg,
      blLeg,
      brLeg,
      tailMesh,
      riderGroup
    };
  }

  // 2. Build 3D Acrobatic Monkey Mesh
  static createMonkey() {
    const group = new THREE.Group();

    const monkeyMat = new THREE.MeshStandardMaterial({ color: 0x78350f }); // Brown fur
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xfef08a }); // Light face
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 }); // Circus Vest

    // Body
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), vestMat);
    body.position.y = 0.45;
    group.add(body);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), monkeyMat);
    head.position.set(0, 0.8, 0);
    group.add(head);

    // Face
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 6), faceMat);
    face.position.set(0.12, 0.78, 0);
    group.add(face);

    // Tail
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.6, 6), monkeyMat);
    tail.position.set(-0.25, 0.5, 0);
    tail.rotation.z = Math.PI / 3;
    group.add(tail);

    return group;
  }

  // 3. Build Giant Bouncy Circus Ball
  static createCircusBall(radius = 0.8) {
    const geo = new THREE.SphereGeometry(radius, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.3,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    return mesh;
  }
}
