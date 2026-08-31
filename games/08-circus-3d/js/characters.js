/**
 * Procedural 3D Characters, Bosses & Skeletal Animations for Circus Rush 3D
 * Generates 3D Lion & Charlie Acro-Rider, Mystic Elephant Boss, Phantom Juggler, Monkeys, and Spheres in Three.js
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

    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });

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

    // Roaring Mouth
    const mouthGeo = new THREE.BoxGeometry(0.3, 0.15, 0.35);
    const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.position.set(1.4, 0.92, 0);
    group.add(mouthMesh);

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
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde047 }); // Cute Yellow Skin
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

    // Flame Cloak (Shield Upgrade Mesh)
    const cloakMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.0 // Initially invisible, active when cloak upgraded
    });
    const cloakMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.7), cloakMat);
    cloakMesh.position.set(-0.1, 0.3, 0);
    riderGroup.add(cloakMesh);

    group.add(riderGroup);

    return {
      mesh: group,
      flLeg,
      frLeg,
      blLeg,
      brLeg,
      tailMesh,
      riderGroup,
      cloakMesh,
      mouthMesh
    };
  }

  // 2. Build 3D Mystic Elephant Boss (Act 1 Climax Boss)
  static createMysticElephant() {
    const group = new THREE.Group();

    const eleMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Slate Elephant Skin
      roughness: 0.6
    });
    const saddleMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Royal Circus Saddle
      emissive: 0x991b1b,
      emissiveIntensity: 0.3
    });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.6 });

    // Massive Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.6, 2.4), eleMat);
    body.position.y = 2.4;
    body.castShadow = true;
    group.add(body);

    // Royal Saddle Cloth
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 2.5), saddleMat);
    saddle.position.set(0, 3.75, 0);
    group.add(saddle);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 12), eleMat);
    head.position.set(-2.0, 3.2, 0);
    group.add(head);

    // Glowing Crimson Eyes
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), eyeMat);
    leftEye.position.set(-2.8, 3.6, 0.8);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), eyeMat);
    rightEye.position.set(-2.8, 3.6, -0.8);
    group.add(leftEye, rightEye);

    // Large Flapping Ears
    const earGeo = new THREE.CylinderGeometry(0.9, 0.7, 0.08, 10);
    const leftEar = new THREE.Mesh(earGeo, eleMat);
    leftEar.position.set(-1.8, 3.4, 1.6);
    leftEar.rotation.z = Math.PI / 6;
    const rightEar = new THREE.Mesh(earGeo, eleMat);
    rightEar.position.set(-1.8, 3.4, -1.6);
    rightEar.rotation.z = Math.PI / 6;
    group.add(leftEar, rightEar);

    // Curved Ivory Tusks
    const tuskMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const tuskGeo = new THREE.CylinderGeometry(0.08, 0.16, 1.4, 8);
    const leftTusk = new THREE.Mesh(tuskGeo, tuskMat);
    leftTusk.position.set(-3.1, 2.4, 0.6);
    leftTusk.rotation.x = Math.PI / 4;
    leftTusk.rotation.z = -Math.PI / 3;

    const rightTusk = new THREE.Mesh(tuskGeo, tuskMat);
    rightTusk.position.set(-3.1, 2.4, -0.6);
    rightTusk.rotation.x = -Math.PI / 4;
    rightTusk.rotation.z = -Math.PI / 3;
    group.add(leftTusk, rightTusk);

    // Articulated Trunk
    const trunkGroup = new THREE.Group();
    trunkGroup.position.set(-3.2, 3.0, 0);
    const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 1.2, 8), eleMat);
    trunk1.position.y = -0.5;
    trunk1.rotation.z = Math.PI / 6;
    const trunk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.14, 1.0, 8), eleMat);
    trunk2.position.set(-0.3, -1.2, 0);
    trunk2.rotation.z = -Math.PI / 4;
    trunkGroup.add(trunk1, trunk2);
    group.add(trunkGroup);

    // 4 Stomping Legs
    const legGeo = new THREE.CylinderGeometry(0.45, 0.5, 1.8, 10);
    const flLeg = new THREE.Mesh(legGeo, eleMat);
    flLeg.position.set(-1.1, 0.9, 0.9);
    const frLeg = new THREE.Mesh(legGeo, eleMat);
    frLeg.position.set(-1.1, 0.9, -0.9);
    const blLeg = new THREE.Mesh(legGeo, eleMat);
    blLeg.position.set(1.1, 0.9, 0.9);
    const brLeg = new THREE.Mesh(legGeo, eleMat);
    brLeg.position.set(1.1, 0.9, -0.9);
    group.add(flLeg, frLeg, blLeg, brLeg);

    return {
      group,
      flLeg,
      frLeg,
      blLeg,
      brLeg,
      trunkGroup,
      leftEar,
      rightEar
    };
  }

  // 3. Build 3D Phantom Juggler Magician Boss (Act 2 Climax Boss)
  static createPhantomJuggler() {
    const group = new THREE.Group();

    const suitMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed, // Royal Purple Magician Suit
      emissive: 0x4c1d95,
      emissiveIntensity: 0.4
    });
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White Jester Mask
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b }); // Dark Velvet Top Hat

    // Hovering Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 1.2, 8), suitMat);
    torso.position.y = 2.4;
    group.add(torso);

    // Mask Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 10), faceMat);
    head.position.set(0, 3.2, 0);
    group.add(head);

    // Tall Magician Top Hat
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.8, 10), hatMat);
    hat.position.set(0, 3.8, 0);
    group.add(hat);

    // Cape
    const cape = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.1), new THREE.MeshStandardMaterial({ color: 0xec4899 }));
    cape.position.set(0.3, 2.2, 0);
    cape.rotation.z = Math.PI / 12;
    group.add(cape);

    return { group };
  }

  // 4. Build 3D Acrobatic Monkey Mesh
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

  // 5. Build Giant Bouncy Circus Ball
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
