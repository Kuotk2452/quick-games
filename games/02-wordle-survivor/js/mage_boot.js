
import { soundEngine } from './audio.js';

class MageBootScreen {
  constructor() {
    this.screen = document.getElementById('mageBootScreen');
    this.container = document.getElementById('mageCanvasContainer');
    this.tapText = document.getElementById('mageBootTap');
    this.flash = document.getElementById('whiteFlash');
    
    if (!this.screen) return;
    window.isBooting = true;
    this.initThreeJS();
    this.bindEvents();
    
    soundEngine.playMagicalHum();
  }
  
  initThreeJS() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 8;
    
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x222244);
    this.scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0x66ccff, 1);
    spotLight.position.set(0, 10, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    this.scene.add(spotLight);
    
    // Mage Group
    this.mageGroup = new THREE.Group();
    this.scene.add(this.mageGroup);
    
    // Robe (Cylinder)
    const robeGeo = new THREE.CylinderGeometry(0.2, 1.2, 3, 8);
    const robeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a3a, roughness: 0.8 });
    const robe = new THREE.Mesh(robeGeo, robeMat);
    robe.position.y = -0.5;
    this.mageGroup.add(robe);
    
    // Head (Sphere) - Skin tone
    const headGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffddbb, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.2;
    this.mageGroup.add(head);

    // White Hair (Back of head)
    const hairGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.2, -0.15);
    this.mageGroup.add(hair);

    // White Beard (Cone)
    const beardGeo = new THREE.ConeGeometry(0.35, 1.0, 4);
    const beard = new THREE.Mesh(beardGeo, hairMat);
    beard.position.set(0, 0.8, 0.35);
    beard.rotation.x = 0.2;
    this.mageGroup.add(beard);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.06, 4, 4);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 1.3, 0.4);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 1.3, 0.4);
    this.mageGroup.add(leftEye);
    this.mageGroup.add(rightEye);
    
    // Hat (Cone)
    const hatGeo = new THREE.ConeGeometry(0.8, 1.5, 8);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x222255, roughness: 0.9 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 1.9;
    hat.rotation.x = -0.1;
    hat.rotation.z = 0.1;
    this.mageGroup.add(hat);
    
    // Staff (Cylinder)
    this.staffGroup = new THREE.Group();
    this.staffGroup.position.set(1.2, 0, 0.5);
    this.mageGroup.add(this.staffGroup);
    
    const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.5, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x332211 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    this.staffGroup.add(pole);
    
    // Magic Gem (Sphere)
    const gemGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const gemMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    this.gem = new THREE.Mesh(gemGeo, gemMat);
    this.gem.position.y = 1.8;
    this.staffGroup.add(this.gem);
    
    // Gem Light
    this.gemLight = new THREE.PointLight(0x00ffff, 1, 5);
    this.gemLight.position.y = 1.8;
    this.staffGroup.add(this.gemLight);
    
    this.clock = new THREE.Clock();
    this.animate();
  }
  
  animate = () => {
    if (!this.renderer) return;
    this.animFrame = requestAnimationFrame(this.animate);
    
    const t = this.clock.getElapsedTime();
    
    // Floating and rotating
    this.mageGroup.position.y = Math.sin(t * 1.5) * 0.2;
    this.mageGroup.rotation.y = Math.sin(t * 0.5) * 0.3;
    
    // Gem pulsing
    const pulse = (Math.sin(t * 5) + 1) / 2;
    this.gemLight.intensity = 1 + pulse * 1.5;
    
    this.renderer.render(this.scene, this.camera);
  };
  
  bindEvents() {
    this.screen.addEventListener('click', () => {
      if (this.isBooting) return;
      this.isBooting = true;
      
      this.tapText.classList.remove('pulse');
      this.tapText.classList.add('hidden');
      
      // Raise staff
      const startRot = this.staffGroup.rotation.z;
      const targetRot = -Math.PI / 3;
      const startLight = this.gemLight.intensity;
      const targetLight = 20;
      
      let startTime = null;
      const duration = 500;
      
      const animateCast = (time) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        
        this.staffGroup.rotation.z = startRot + (targetRot - startRot) * progress;
        this.gemLight.intensity = startLight + (targetLight - startLight) * progress;
        
        if (progress < 1) {
          requestAnimationFrame(animateCast);
        } else {
          // Spell Cast!
          soundEngine.stopMagicalHum();
          soundEngine.playSpellCast();
          this.flash.classList.add('active');
          
          setTimeout(() => {
            this.cleanup();
          }, 800);
        }
      };
      
      requestAnimationFrame(animateCast);
    });
    
    window.addEventListener('resize', () => {
      if (!this.camera) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  cleanup() {
    this.screen.classList.add('hidden');
    cancelAnimationFrame(this.animFrame);
    if (this.renderer) {
      this.renderer.dispose();
      this.container.innerHTML = '';
    }
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    window.isBooting = false;
    if(window.gameInstance) window.gameInstance.startGame();
  }
}

// Auto-init
if (document.getElementById('mageBootScreen')) {
  new MageBootScreen();
}
