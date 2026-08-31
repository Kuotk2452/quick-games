
import { slackerAudio } from './audio.js';

class BossBootScreen {
  constructor() {
    this.screen = document.getElementById('bossBootScreen');
    this.container = document.getElementById('bossCanvasContainer');
    this.tapText = document.getElementById('bossBootTap');
    this.flash = document.getElementById('whiteFlash');
    
    if (!this.screen) return;
    
    window.isBossBooting = true;
    this.initThreeJS();
    this.bindEvents();
    
    slackerAudio.playTickTock();
  }
  
  initThreeJS() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 6;
    this.camera.position.y = 1;
    
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    this.scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 10, 5);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    this.scene.add(spotLight);
    
    // Boss Group
    this.bossGroup = new THREE.Group();
    this.scene.add(this.bossGroup);
    
    // Suit (Box)
    const suitGeo = new THREE.BoxGeometry(1.6, 2.2, 1);
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const suit = new THREE.Mesh(suitGeo, suitMat);
    suit.position.y = -0.5;
    this.bossGroup.add(suit);
    
    // Tie (Plane)
    const tieGeo = new THREE.PlaneGeometry(0.2, 1.2);
    const tieMat = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, -0.2, 0.51);
    this.bossGroup.add(tie);
    
    // Head (Sphere)
    const headGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa, roughness: 0.5 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.3;
    this.bossGroup.add(head);
    
    // Hair (Side ring)
    const hairGeo = new THREE.TorusGeometry(0.55, 0.1, 8, 24, Math.PI);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.3;
    hair.rotation.x = Math.PI / 2;
    this.bossGroup.add(hair);
    
    // Eyes (Angry)
    const eyeGeo = new THREE.BoxGeometry(0.2, 0.05, 0.1);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.25, 1.45, 0.55);
    leftEye.rotation.z = -0.2;
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.25, 1.45, 0.55);
    rightEye.rotation.z = 0.2;
    this.bossGroup.add(leftEye);
    this.bossGroup.add(rightEye);
    
    // Foot tapping
    this.footGeo = new THREE.BoxGeometry(0.4, 0.2, 0.6);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    this.rightFoot = new THREE.Mesh(this.footGeo, footMat);
    this.rightFoot.position.set(0.4, -1.7, 0.2);
    this.bossGroup.add(this.rightFoot);
    
    this.leftFoot = new THREE.Mesh(this.footGeo, footMat);
    this.leftFoot.position.set(-0.4, -1.7, 0.2);
    this.bossGroup.add(this.leftFoot);
    
    this.clock = new THREE.Clock();
    this.animate();
  }
  
  animate = () => {
    if (!this.renderer) return;
    this.animFrame = requestAnimationFrame(this.animate);
    
    const t = this.clock.getElapsedTime();
    
    if (!this.isWalkingAway) {
      // Tap foot impatiently
      this.rightFoot.rotation.x = (Math.sin(t * 15) > 0) ? -0.3 : 0;
    } else {
      // Walking away
      this.bossGroup.position.z -= 0.1;
      this.bossGroup.position.y = Math.sin(t * 20) * 0.1;
    }
    
    this.renderer.render(this.scene, this.camera);
  };
  
  bindEvents() {
    // Bind to the entire screen for better UX, not just the text button
    this.screen.addEventListener('click', () => {
      if (!window.isBossBooting) return; // Prevent multiple clicks
      window.isBossBooting = false; // Flag to prevent multiple clicks, but keep the visual boot active
      this.isWalkingAway = true; // Trigger walk away animation
      
      this.tapText.classList.remove('pulse');
      this.tapText.classList.add('hidden');
      
      slackerAudio.stopTickTock();
      
      // Boss turns around
      let turnProgress = 0;
      const turnAnim = () => {
        turnProgress += 0.1;
        if (turnProgress <= Math.PI) {
          this.bossGroup.rotation.y = turnProgress;
          requestAnimationFrame(turnAnim);
        }
      };
      turnAnim();
      
      setTimeout(() => {
        slackerAudio.playWin95Boot();
        this.flash.classList.add('active');
        
        setTimeout(() => {
          this.cleanup();
        }, 800);
      }, 1000);
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
    this.flash.classList.remove('active');
    cancelAnimationFrame(this.animFrame);
    if (this.renderer) {
      this.renderer.dispose();
      this.container.innerHTML = '';
    }
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    window.isBossBooting = false;
  }
}

// Auto-init
if (document.getElementById('bossBootScreen')) {
  new BossBootScreen();
}
