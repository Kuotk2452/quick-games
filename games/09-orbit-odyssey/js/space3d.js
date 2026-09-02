import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export class SpaceScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.scene = new THREE.Scene();
    
    // Top-down perspective camera
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 2000);
    this.camera.position.set(0, 0, 150); // Look down z-axis towards xy plane
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Dynamic Objects
    this.planets = [];
    this.asteroids = [];
    this.blackholes = [];
    this.particles = [];
    
    this.setupLighting();
    this.setupBackground();
    this.createPlayerShip();
    
    // Tether line
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6, linewidth: 2 });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
    this.tetherLine = new THREE.Line(lineGeo, lineMat);
    this.tetherLine.visible = false;
    this.scene.add(this.tetherLine);

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  setupLighting() {
    const ambient = new THREE.AmbientLight(0x202040, 1.5);
    this.scene.add(ambient);
    
    this.dirLight = new THREE.DirectionalLight(0xffffff, 2);
    this.dirLight.position.set(50, 50, 100);
    this.scene.add(this.dirLight);
  }

  setupBackground() {
    this.scene.background = new THREE.Color(0x050510);
    
    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1000;
    const pos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 1000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, transparent: true, opacity: 0.8 });
    this.starfield = new THREE.Points(starGeo, starMat);
    this.starfield.position.z = -200; // Far behind
    this.scene.add(this.starfield);
    
    // Deep Space Grid (helps with velocity perception)
    this.gridHelper = new THREE.GridHelper(2000, 40, 0x00f0ff, 0x111133);
    this.gridHelper.rotation.x = Math.PI / 2;
    this.gridHelper.position.z = -50;
    this.scene.add(this.gridHelper);
  }

  createPlayerShip() {
    this.playerGroup = new THREE.Group();
    
    // Ship hull
    const hullGeo = new THREE.ConeGeometry(3, 8, 4);
    hullGeo.rotateX(Math.PI / 2); // point along Y axis (forward in 2D space)
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    
    // Engine glow
    const engineGeo = new THREE.SphereGeometry(1.5, 8, 8);
    const engineMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    this.engineGlow = new THREE.Mesh(engineGeo, engineMat);
    this.engineGlow.position.y = -4; // Back of ship
    
    this.playerGroup.add(hull, this.engineGlow);
    this.scene.add(this.playerGroup);
  }

  createPlanet(x, y, radius, type) {
    let color, emissive;
    if (type === 'gas') {
      color = 0x8b5cf6; emissive = 0x4c1d95;
    } else if (type === 'lava') {
      color = 0xef4444; emissive = 0x991b1b;
    } else {
      color = 0x3b82f6; emissive = 0x1e3a8a;
    }

    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0.4, roughness: 0.7 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, 0);
    this.scene.add(mesh);

    // Gravity well indicator (ring)
    const ringGeo = new THREE.RingGeometry(radius * 2, radius * 2 + 1, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    mesh.add(ring);

    return mesh;
  }
  
  createAsteroid(x, y, radius) {
    const geo = new THREE.DodecahedronGeometry(radius, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, 0);
    
    // random rotation
    mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    this.scene.add(mesh);
    return mesh;
  }

  createBlackHole(x, y, radius) {
    const group = new THREE.Group();
    group.position.set(x, y, 0);

    // Dark center
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // Accretion disk
    const diskGeo = new THREE.RingGeometry(radius * 1.2, radius * 3, 32);
    const diskMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = Math.PI / 4;
    group.add(disk);

    this.scene.add(group);
    return { group, disk };
  }

  spawnTrailParticle(x, y) {
    const geo = new THREE.PlaneGeometry(1.5, 1.5);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, -2);
    this.scene.add(mesh);
    this.particles.push({ mesh, life: 1.0 });
  }
  
  spawnExplosion(x, y) {
    for(let i=0; i<30; i++) {
      const geo = new THREE.PlaneGeometry(2, 2);
      const color = Math.random() > 0.5 ? 0xff0055 : 0xffaa00;
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, 0);
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 40 + 10;
      this.scene.add(mesh);
      this.particles.push({
        mesh, life: 1.0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        isExplosion: true
      });
    }
  }

  disposeObject(obj) {
    if (!obj) return;
    this.scene.remove(obj);
    obj.traverse(child => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }

  updateTether(startX, startY, endX, endY, active) {
    this.tetherLine.visible = active;
    if (active) {
      const positions = this.tetherLine.geometry.attributes.position.array;
      positions[0] = startX; positions[1] = startY; positions[2] = 0;
      positions[3] = endX; positions[4] = endY; positions[5] = 0;
      this.tetherLine.geometry.attributes.position.needsUpdate = true;
    }
  }

  update(dt, playerX, playerY, angle) {
    // Smooth camera follow
    this.camera.position.x += (playerX - this.camera.position.x) * 5 * dt;
    this.camera.position.y += (playerY - this.camera.position.y) * 5 * dt;
    
    // Parallax background
    this.starfield.position.x = this.camera.position.x * 0.9;
    this.starfield.position.y = this.camera.position.y * 0.9;
    
    // Grid scrolling to keep it centered roughly
    const gridX = Math.floor(this.camera.position.x / 40) * 40;
    const gridY = Math.floor(this.camera.position.y / 40) * 40;
    this.gridHelper.position.x = gridX;
    this.gridHelper.position.y = gridY;

    // Update player ship
    this.playerGroup.position.set(playerX, playerY, 0);
    this.playerGroup.rotation.z = angle - Math.PI/2; // Rotate mesh to face velocity vector
    
    // Engine pulsation
    const time = performance.now() * 0.01;
    this.engineGlow.scale.setScalar(1.0 + Math.sin(time)*0.2);

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt * (p.isExplosion ? 1.5 : 2.0);
      
      if (p.isExplosion) {
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
      }
      
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        if (p.mesh.material) p.mesh.material.dispose();
        this.particles.splice(i, 1);
      } else {
        p.mesh.material.opacity = p.life;
        p.mesh.scale.setScalar(p.life);
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}
