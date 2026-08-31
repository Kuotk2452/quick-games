/**
 * Circus Rush 3D: Three.js World, Camera, Circus Big-Top Tent & Lighting Environment
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class CircusStage3D {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 720;
    this.height = container.clientHeight || 480;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f0b1e); // Night circus ambiance
    this.scene.fog = new THREE.FogExp2(0x0f0b1e, 0.015);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 200);
    this.camera.position.set(-6.5, 4.5, 6.0);
    this.camera.lookAt(2.5, 1.2, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Confetti particles for victory
    this.confetti = [];

    this.initLighting();
    this.initEnvironment();
  }

  initLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.65);
    this.scene.add(ambientLight);

    // Main Circus Spotlight
    this.spotLight = new THREE.SpotLight(0xfff7ed, 2.5, 40, Math.PI / 4, 0.3, 1);
    this.spotLight.position.set(0, 15, 5);
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;
    this.scene.add(this.spotLight);

    // Colored Accent Rim Lights (Magenta & Cyan)
    this.rimLight1 = new THREE.PointLight(0xec4899, 1.8, 25);
    this.rimLight1.position.set(-5, 6, -6);
    this.scene.add(this.rimLight1);

    this.rimLight2 = new THREE.PointLight(0x00f0ff, 1.8, 25);
    this.rimLight2.position.set(15, 6, -6);
    this.scene.add(this.rimLight2);
  }

  initEnvironment() {
    // 1. Circus Sand Runway Floor
    const floorGeo = new THREE.PlaneGeometry(300, 14);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Golden Circus Sand
      roughness: 0.8
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.set(100, 0, 0);
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // 2. Circus Runway Curbs / Velvet Ropes
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    const leftCurb = new THREE.Mesh(new THREE.BoxGeometry(300, 0.3, 0.4), curbMat);
    leftCurb.position.set(100, 0.15, -4.5);
    const rightCurb = new THREE.Mesh(new THREE.BoxGeometry(300, 0.3, 0.4), curbMat);
    rightCurb.position.set(100, 0.15, 4.5);
    this.scene.add(leftCurb, rightCurb);

    // 3. Cheering Spectator Billboards along the back
    this.spectatorGroup = new THREE.Group();
    const spectatorColors = [0xef4444, 0x3b82f6, 0xfacc15, 0x10b981, 0xec4899, 0xa855f7];

    for (let x = -20; x < 150; x += 3.5) {
      const col = spectatorColors[Math.floor(Math.random() * spectatorColors.length)];
      const specGeo = new THREE.SphereGeometry(0.35, 6, 6);
      const specMat = new THREE.MeshStandardMaterial({ color: col });
      const spec = new THREE.Mesh(specGeo, specMat);
      spec.position.set(x, 1.2 + Math.sin(x * 3) * 0.2, -6.5);
      this.spectatorGroup.add(spec);
    }
    this.scene.add(this.spectatorGroup);

    // 4. Circus Big-Top Tent Dome Backdrop
    const tentGeo = new THREE.CylinderGeometry(40, 45, 25, 24, 1, true);
    const tentMat = new THREE.MeshBasicMaterial({
      color: 0x831843,
      side: THREE.BackSide
    });
    const tent = new THREE.Mesh(tentGeo, tentMat);
    tent.position.set(60, 10, 0);
    this.scene.add(tent);
  }

  // Trigger Victory Confetti Cannon
  spawnConfetti(posX, posY, posZ) {
    const colors = [0xfacc15, 0xec4899, 0x00f0ff, 0x10b981, 0xef4444];
    for (let i = 0; i < 80; i++) {
      const geo = new THREE.PlaneGeometry(0.12, 0.12);
      const mat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        posX + (Math.random() - 0.5) * 4,
        posY + Math.random() * 3,
        posZ + (Math.random() - 0.5) * 4
      );
      this.scene.add(mesh);
      this.confetti.push({
        mesh,
        vx: (Math.random() - 0.5) * 8,
        vy: 4 + Math.random() * 6,
        vz: (Math.random() - 0.5) * 8,
        rotX: Math.random() * 10,
        rotY: Math.random() * 10
      });
    }
  }

  update(dt, playerX = 0) {
    // Move Camera to follow player with smooth damping
    this.camera.position.x = playerX - 6.0;
    this.camera.lookAt(playerX + 2.5, 1.2, 0);
    this.spotLight.position.x = playerX + 1.0;
    this.spotLight.target.position.set(playerX + 2.0, 0.5, 0);
    this.spotLight.target.updateMatrixWorld();

    // Spectator cheering bounce
    if (this.spectatorGroup) {
      const time = performance.now() * 0.005;
      this.spectatorGroup.children.forEach((s, idx) => {
        s.position.y = 1.2 + Math.sin(time + idx * 0.8) * 0.2;
      });
    }

    // Update Confetti Particles
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.mesh.position.x += c.vx * dt;
      c.mesh.position.y += c.vy * dt;
      c.mesh.position.z += c.vz * dt;
      c.vy -= 9.8 * dt; // Gravity
      c.mesh.rotation.x += c.rotX * dt;
      c.mesh.rotation.y += c.rotY * dt;

      if (c.mesh.position.y < 0) {
        this.scene.remove(c.mesh);
        this.confetti.splice(i, 1);
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}
