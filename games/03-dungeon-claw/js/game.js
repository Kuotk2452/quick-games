/**
 * 3D Dungeon Claw: Main Three.js Controller & Turn State Machine
 * Renders 3D glass arcade cabinet, 3-prong animated crane, 3D physics items, and turn combat.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { PhysicsWorld3D } from './physics3d.js?v=8.3';
import { ITEM_DEFS, createItem3DMesh, calculateCombos } from './items.js?v=8.3';
import { MONSTER_ROSTER, Monster } from './monsters.js?v=8.3';
import { CLAW_UPGRADES, ITEM_SHOP_OFFERS } from './shop.js?v=8.3';
import { soundEngine } from './audio.js?v=8.3';
import { i18n } from './i18n.js?v=8.3';

export class DungeonClawGame {
  constructor() {
    this.container = document.getElementById('webglContainer');
    this.physics = new PhysicsWorld3D();

    // Player Combat State
    this.hp = 80;
    this.maxHp = 80;
    this.armor = 0;
    this.energy = 3;
    this.maxEnergy = 3;
    this.gold = 0;
    this.floorIndex = 0;
    this.currentMonster = null;
    this.cameraMode = 'FRONT'; // 'FRONT' | 'TOP'

    this.gameState = 'START'; // 'START' | 'PLAYER_TURN' | 'CLAW_ACTIVE' | 'ENEMY_TURN' | 'SHOP' | 'VICTORY' | 'GAME_OVER'
    this.keys = {};
    this.touchDrag = null;

    this.initThree();
    this.initCabinet();
    this.initClaw3D();
    this.initDOM();
    this.initEvents();
    this.populateInitialPit();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0c16);
    this.scene.fog = new THREE.FogExp2(0x0a0c16, 0.04);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.updateCameraTransform();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.4);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    // Neon accent lights inside cabinet
    const cyanLight = new THREE.PointLight(0x00f0ff, 2.0, 8);
    cyanLight.position.set(-2, 1, 0);
    this.scene.add(cyanLight);

    const pinkLight = new THREE.PointLight(0xec4899, 2.0, 8);
    pinkLight.position.set(2, 1, 0);
    this.scene.add(pinkLight);
  }

  initCabinet() {
    this.cabinetGroup = new THREE.Group();

    // Floor of the pit
    const floorGeo = new THREE.BoxGeometry(5.2, 0.3, 3.6);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, metalness: 0.2 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -2.15;
    floor.receiveShadow = true;
    this.cabinetGroup.add(floor);

    // Transparent Glass Cabinet
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      opacity: 0.25,
      transparent: true,
      roughness: 0.1,
      metalness: 0.3
    });

    // Glass Walls
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.8, 0.1), glassMat);
    backWall.position.set(0, 0.2, -1.8);
    this.cabinetGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.8, 3.6), glassMat);
    leftWall.position.set(-2.6, 0.2, 0);
    this.cabinetGroup.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.8, 3.6), glassMat);
    rightWall.position.set(2.6, 0.2, 0);
    this.cabinetGroup.add(rightWall);

    // Glowing Neon Frame Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6 });
    [-2.6, 2.6].forEach((px) => {
      [-1.8, 1.8].forEach((pz) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.8, 8), pillarMat);
        pillar.position.set(px, 0.2, pz);
        this.cabinetGroup.add(pillar);
      });
    });

    // Top Crane Rails
    const railMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const railX = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.15, 0.15), railMat);
    railX.position.set(0, 2.4, 0);
    this.cabinetGroup.add(railX);

    this.scene.add(this.cabinetGroup);
  }

  initClaw3D() {
    this.clawGroup = new THREE.Group();

    // Trolley Box
    const trolleyGeo = new THREE.BoxGeometry(0.7, 0.25, 0.7);
    const trolleyMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8, roughness: 0.2 });
    this.trolleyMesh = new THREE.Mesh(trolleyGeo, trolleyMat);
    this.clawGroup.add(this.trolleyMesh);

    // Vertical Cable
    const cableGeo = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
    this.cableMesh = new THREE.Mesh(cableGeo, cableMat);
    this.clawGroup.add(this.cableMesh);

    // Claw Hub Assembly
    this.clawHub = new THREE.Group();
    const hubGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 12);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, metalness: 0.8 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    this.clawHub.add(hub);

    // 3 Articulated Claw Prongs
    this.prongs = [];
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const prongGroup = new THREE.Group();
      prongGroup.position.set(Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2);
      prongGroup.rotation.y = -angle;

      // Upper arm
      const upperGeo = new THREE.BoxGeometry(0.08, 0.45, 0.08);
      const upperMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
      const upper = new THREE.Mesh(upperGeo, upperMat);
      upper.position.y = -0.22;
      upper.rotation.z = -0.3;
      prongGroup.add(upper);

      // Claw Tip Hook
      const tipGeo = new THREE.BoxGeometry(0.08, 0.25, 0.08);
      const tip = new THREE.Mesh(tipGeo, upperMat);
      tip.position.set(0.12, -0.42, 0);
      tip.rotation.z = 0.6;
      prongGroup.add(tip);

      this.clawHub.add(prongGroup);
      this.prongs.push(prongGroup);
    }

    this.clawGroup.add(this.clawHub);
    this.scene.add(this.clawGroup);
    this.physics.claw.meshGroup = this.clawGroup;

    // Delivery Callback
    this.physics.onDeliveryCallback = (deliveredItems) => {
      this.handleDeliveredLoot(deliveredItems);
    };
  }

  initDOM() {
    this.ui = {
      startScreen: document.getElementById('startScreen'),
      btnStart: document.getElementById('btnStart'),
      btnMoveLeft: document.getElementById('btnMoveLeft'),
      btnMoveRight: document.getElementById('btnMoveRight'),
      btnDropClaw: document.getElementById('btnDropClaw'),
      btnEndTurn: document.getElementById('btnEndTurn'),
      btnToggleView: document.getElementById('btnToggleView'),
      hpDisplay: document.getElementById('hpDisplay'),
      hpBarFill: document.getElementById('hpBarFill'),
      armorDisplay: document.getElementById('armorDisplay'),
      energyDisplay: document.getElementById('energyDisplay'),
      goldDisplay: document.getElementById('goldDisplay'),
      floorDisplay: document.getElementById('floorDisplay'),
      monsterName: document.getElementById('monsterName'),
      monsterHpDisplay: document.getElementById('monsterHpDisplay'),
      monsterHpBarFill: document.getElementById('monsterHpBarFill'),
      monsterIntentDisplay: document.getElementById('monsterIntentDisplay'),
      comboBanner: document.getElementById('comboBanner'),
      shopModal: document.getElementById('shopModal'),
      shopItemsContainer: document.getElementById('shopItemsContainer'),
      btnLeaveShop: document.getElementById('btnLeaveShop'),
      gameOverModal: document.getElementById('gameOverModal'),
      btnPlayAgain: document.getElementById('btnPlayAgain'),
      btnExtraLife: document.getElementById('btnExtraLife'),
      btnShareScore: document.getElementById('btnShareScore'),
      audioToggleBtn: document.getElementById('audioToggleBtn'),
      langSelect: document.getElementById('langSelect'),
      turnHintText: document.getElementById('turnHintText')
    };

  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (window.isArcadeBooting) return;
      this.keys[e.key.toLowerCase()] = true;
      if (
        (e.code === 'Space' || e.code === 'Enter' || e.key === 's' || e.key === 'ArrowDown')
        && this.gameState === 'PLAYER_TURN'
      ) {
        e.preventDefault();
        this.triggerDrop();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      soundEngine.stopMotorSound();
    });

    // Raycast Click-to-Aim & Direct Dragging for Crane
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const targetPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const aimAtScreenPos = (clientX, clientY) => {
      if (this.gameState !== 'PLAYER_TURN' || this.physics.claw.state !== 'IDLE') return;
      mouse.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(targetPlane, hit)) {
        this.physics.claw.x = THREE.MathUtils.clamp(hit.x, this.physics.bounds.minX + 0.3, this.physics.bounds.maxX - 0.3);
        this.physics.claw.z = THREE.MathUtils.clamp(hit.z, this.physics.bounds.minZ + 0.3, this.physics.bounds.maxZ - 0.3);
        soundEngine.startMotorSound();
      }
    };

    let isDragging = false;
    let pointerStartX = 0;
    let pointerStartY = 0;

    const onPointerDown = (clientX, clientY) => {
      if (this.gameState === 'PLAYER_TURN' && this.physics.claw.state === 'IDLE') {
        isDragging = true;
        pointerStartX = clientX;
        pointerStartY = clientY;
        aimAtScreenPos(clientX, clientY);
      }
    };

    const onPointerMove = (clientX, clientY) => {
      if (!isDragging) return;
      aimAtScreenPos(clientX, clientY);
    };

    const onPointerUp = (clientX, clientY) => {
      if (isDragging && this.gameState === 'PLAYER_TURN' && this.physics.claw.state === 'IDLE') {
        if (clientX !== undefined && clientY !== undefined) {
          aimAtScreenPos(clientX, clientY);
        }
        // Instant drop on tap/click anywhere in the 3D scene!
        this.triggerDrop();
      }
      isDragging = false;
      soundEngine.stopMotorSound();
    };

    this.renderer.domElement.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', (e) => onPointerUp(e.clientX, e.clientY));

    this.renderer.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touch = e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : null;
      onPointerUp(touch ? touch.clientX : undefined, touch ? touch.clientY : undefined);
    });

    // On-Screen Arcade Steering Buttons (Hold or Click)
    let steerInterval = null;
    const startSteer = (dx, dz) => {
      if (this.gameState !== 'PLAYER_TURN') return;
      this.physics.moveClaw(dx, dz, 0.05);
      soundEngine.startMotorSound();
      if (steerInterval) clearInterval(steerInterval);
      steerInterval = setInterval(() => {
        if (this.gameState === 'PLAYER_TURN') {
          this.physics.moveClaw(dx, dz, 0.03);
        } else {
          stopSteer();
        }
      }, 30);
    };

    const stopSteer = () => {
      if (steerInterval) {
        clearInterval(steerInterval);
        steerInterval = null;
      }
      soundEngine.stopMotorSound();
    };

    if (this.ui.btnMoveLeft) {
      this.ui.btnMoveLeft.addEventListener('pointerdown', (e) => { e.preventDefault(); startSteer(-1, 0); });
      this.ui.btnMoveLeft.addEventListener('pointerup', stopSteer);
      this.ui.btnMoveLeft.addEventListener('pointerleave', stopSteer);
      this.ui.btnMoveLeft.addEventListener('click', (e) => { e.preventDefault(); this.physics.moveClaw(-0.8, 0, 0.1); });
    }

    if (this.ui.btnMoveRight) {
      this.ui.btnMoveRight.addEventListener('pointerdown', (e) => { e.preventDefault(); startSteer(1, 0); });
      this.ui.btnMoveRight.addEventListener('pointerup', stopSteer);
      this.ui.btnMoveRight.addEventListener('pointerleave', stopSteer);
      this.ui.btnMoveRight.addEventListener('click', (e) => { e.preventDefault(); this.physics.moveClaw(0.8, 0, 0.1); });
    }

    // UI Buttons
    if (this.ui.btnStart) this.ui.btnStart.addEventListener('click', () => this.startGame());
    if (this.ui.btnDropClaw) {
      this.ui.btnDropClaw.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.triggerDrop();
      });
      this.ui.btnDropClaw.addEventListener('click', (e) => {
        e.preventDefault();
        this.triggerDrop();
      });
    }
    if (this.ui.btnEndTurn) this.ui.btnEndTurn.addEventListener('click', () => this.executeMonsterTurn());

    if (this.ui.btnToggleView) {
      this.ui.btnToggleView.addEventListener('click', () => {
        this.cameraMode = this.cameraMode === 'FRONT' ? 'TOP' : 'FRONT';
        this.updateCameraTransform();
        this.ui.btnToggleView.innerText = this.cameraMode === 'FRONT' ? i18n.t('viewToggleFront') : i18n.t('viewToggleTop');
      });
    }

    if (this.ui.btnLeaveShop) {
      this.ui.btnLeaveShop.addEventListener('click', () => {
        this.ui.shopModal.style.display = 'none';
        this.nextFloor();
      });
    }

    if (this.ui.btnPlayAgain) this.ui.btnPlayAgain.addEventListener('click', () => this.startGame());

    if (this.ui.btnExtraLife) {
      this.ui.btnExtraLife.addEventListener('click', () => {
        if (window.QuickGamesAdSDK) {
          window.QuickGamesAdSDK.showRewardedVideo(() => {
            this.revivePlayer();
          });
        }
      });
    }

    if (this.ui.btnShareScore) {
      this.ui.btnShareScore.addEventListener('click', () => {
        const text = `🕹️ Dungeon Claw 3D — Floor ${this.floorIndex + 1}
👑 Boss Defeated: ${this.currentMonster?.def.name.en || 'None'}
💰 Gold: ${this.gold}
❤️ HP: ${this.hp}/${this.maxHp}

Play free on web:
👉 https://quick-games-ez4.pages.dev/games/03-dungeon-claw/`;
        navigator.clipboard.writeText(text).then(() => alert(i18n.t('copiedAlert'))).catch(() => prompt('Score:', text));
      });
    }

    if (this.ui.audioToggleBtn) {
      this.ui.audioToggleBtn.addEventListener('click', () => {
        const muted = soundEngine.toggleMute();
        this.ui.audioToggleBtn.innerText = muted ? '🔇' : '🔊';
      });
    }

    if (this.ui.langSelect) {
      this.ui.langSelect.value = i18n.currentLang;
      this.ui.langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        this.updateHUD();
      });
    }
  }

  updateCameraTransform() {
    if (this.cameraMode === 'FRONT') {
      this.camera.position.set(0, 1.2, 7.2);
      this.camera.lookAt(0, 0.4, 0);
    } else {
      // Top Down View directly looking into pit
      this.camera.position.set(0, 6.8, 1.2);
      this.camera.lookAt(0, -1.0, 0);
    }
  }

  populateInitialPit() {
    const itemPool = [
      ITEM_DEFS.SWORD, ITEM_DEFS.SWORD, ITEM_DEFS.SWORD,
      ITEM_DEFS.SHIELD, ITEM_DEFS.SHIELD,
      ITEM_DEFS.POTION,
      ITEM_DEFS.BOMB,
      ITEM_DEFS.THUNDER_ORB,
      ITEM_DEFS.COIN, ITEM_DEFS.COIN
    ];

    itemPool.forEach((def) => {
      const mesh = createItem3DMesh(def);
      this.scene.add(mesh);
      const x = (Math.random() - 0.5) * 3.6;
      const y = -0.5 + Math.random() * 1.5;
      const z = (Math.random() - 0.5) * 2.4;
      this.physics.addItem(mesh, def, x, y, z);
    });
  }

  startGame() {
    this.hp = 80;
    this.maxHp = 80;
    this.armor = 0;
    this.energy = 3;
    this.maxEnergy = 3;
    this.hasRevived = false;
    this.gold = 0;
    this.floorIndex = 0;

    if (this.clawSafetyTimer) {
      clearTimeout(this.clawSafetyTimer);
      this.clawSafetyTimer = null;
    }

    // Clean up old items from scene
    if (this.physics && this.physics.items) {
      this.physics.items.forEach(item => {
        if (item.mesh) this.scene.remove(item.mesh);
      });
      this.physics.reset();
    }

    // Reset Claw
    this.physics.claw.state = 'IDLE';
    this.physics.claw.x = 0;
    this.physics.claw.z = 0;
    this.physics.claw.y = this.physics.claw.baseY;
    this.physics.claw.grabbedItems = [];
    this.physics.claw.targetAngle = this.physics.claw.openAngle;

    // Repopulate fresh items into pit
    this.populateInitialPit();

    if (this.ui.startScreen) this.ui.startScreen.style.display = 'none';
    if (this.ui.gameOverModal) this.ui.gameOverModal.style.display = 'none';
    if (this.ui.shopModal) this.ui.shopModal.style.display = 'none';

    soundEngine.ensureContext();
    this.spawnFloorMonster();
    this.gameState = 'PLAYER_TURN';
    this.updateHUD();
  }

  spawnFloorMonster() {
    if (this.currentMonster && this.currentMonster.mesh) {
      this.scene.remove(this.currentMonster.mesh);
    }

    const rosterIndex = Math.min(this.floorIndex, MONSTER_ROSTER.length - 1);
    this.currentMonster = new Monster(MONSTER_ROSTER[rosterIndex]);
    this.scene.add(this.currentMonster.mesh);
    this.energy = this.maxEnergy;
    this.armor = 0;
  }

  triggerDrop() {
    if (this.gameState !== 'PLAYER_TURN' || this.energy <= 0) return;

    // Ensure claw is ready for drop
    if (this.physics.claw.state !== 'IDLE') {
      this.physics.claw.state = 'IDLE';
      this.physics.claw.y = this.physics.claw.baseY;
      this.physics.claw.grabbedItems = [];
    }

    const dropped = this.physics.triggerDrop();
    if (dropped) {
      this.energy--;
      this.gameState = 'CLAW_ACTIVE';
      this.updateHUD();

      // Watchdog safety timer: force recover after 3.2s if claw ever gets stuck
      if (this.clawSafetyTimer) clearTimeout(this.clawSafetyTimer);
      this.clawSafetyTimer = setTimeout(() => {
        if (this.gameState === 'CLAW_ACTIVE') {
          console.warn('Safety watchdog: recovering claw state');
          const delivered = [...this.physics.claw.grabbedItems];
          this.physics.claw.grabbedItems = [];
          this.physics.claw.state = 'IDLE';
          this.physics.claw.y = this.physics.claw.baseY;
          this.physics.claw.targetAngle = this.physics.claw.openAngle;
          this.handleDeliveredLoot(delivered);
        }
      }, 3200);
    }
  }

  handleDeliveredLoot(deliveredItems) {
    if (this.clawSafetyTimer) {
      clearTimeout(this.clawSafetyTimer);
      this.clawSafetyTimer = null;
    }
    this.physics.claw.state = 'IDLE';
    this.physics.claw.y = this.physics.claw.baseY;

    if (deliveredItems.length === 0) {
      this.showComboBanner('💨 Missed! No items grabbed');
      this.checkTurnEnd();
      return;
    }

    try {
      const defs = deliveredItems.map(i => i.def);
      const combo = calculateCombos(defs);

      // Apply Effects
      defs.forEach(d => soundEngine.playItemEffect(d.id || d.type));

      // Deal Damage to Monster
      if (combo.totalDamage > 0) {
        this.currentMonster.takeDamage(combo.totalDamage);
      }

      // Apply Armor & Heal & Gold
      this.armor += combo.totalArmor;
      this.hp = Math.min(this.maxHp, this.hp + combo.totalHeal);
      this.gold += combo.totalGold;

      // Show Combo text
      const lootIcons = defs.map(d => d.icon).join(' ');
      const desc = combo.comboText ? ` [${combo.comboText}]` : '';
      this.showComboBanner(`✨ Grabbed: ${lootIcons}${desc} (+${combo.totalDamage} DMG, +${combo.totalArmor} Armor)`);

      // Remove delivered items from scene and respawn new items into pit
      deliveredItems.forEach(item => {
        this.scene.remove(item.mesh);
        this.physics.removeItem(item);

        // Respawn replacement item into pit
        const randomDef = Object.values(ITEM_DEFS)[Math.floor(Math.random() * (Object.values(ITEM_DEFS).length - 1))];
        const newMesh = createItem3DMesh(randomDef);
        this.scene.add(newMesh);
        this.physics.addItem(newMesh, randomDef, (Math.random() - 0.5) * 3, 0.5, (Math.random() - 0.5) * 2);
      });
    } catch (err) {
      console.error('Error handling loot:', err);
    }

    this.updateHUD();

    // Check if monster defeated
    if (this.currentMonster.hp <= 0) {
      soundEngine.playVictory();
      this.showComboBanner(`🎉 ${this.currentMonster.def.name[i18n.currentLang] || this.currentMonster.def.name.en} Defeated!`);
      setTimeout(() => this.openShop(), 1200);
    } else {
      this.checkTurnEnd();
    }
  }

  checkTurnEnd() {
    if (this.clawSafetyTimer) {
      clearTimeout(this.clawSafetyTimer);
      this.clawSafetyTimer = null;
    }
    this.physics.claw.state = 'IDLE';
    this.physics.claw.y = this.physics.claw.baseY;

    if (this.energy > 0) {
      this.gameState = 'PLAYER_TURN';
      this.updateHUD();
    } else {
      this.showComboBanner('⏳ Energy Depleted! Monster attacking...');
      setTimeout(() => this.executeMonsterTurn(), 900);
    }
  }

  executeMonsterTurn() {
    if (this.gameState === 'GAME_OVER' || this.currentMonster.hp <= 0) return;
    this.gameState = 'ENEMY_TURN';

    const intent = this.currentMonster.getCurrentIntent();

    // Monster Animation Jump
    const startY = this.currentMonster.mesh.position.y;
    this.currentMonster.mesh.position.y += 0.4;
    setTimeout(() => {
      this.currentMonster.mesh.position.y = startY;
    }, 200);

    if (intent.type === 'ATTACK') {
      let unblocked = intent.value;
      if (this.armor > 0) {
        if (this.armor >= unblocked) {
          this.armor -= unblocked;
          unblocked = 0;
        } else {
          unblocked -= this.armor;
          this.armor = 0;
        }
      }
      this.hp = Math.max(0, this.hp - unblocked);
      this.showComboBanner(`👾 Monster Attacked for ${intent.value} DMG (${unblocked} unblocked)`);
    } else if (intent.type === 'DEFEND') {
      this.currentMonster.armor += intent.value;
      this.showComboBanner(`🛡️ Monster gained +${intent.value} Armor`);
    } else if (intent.type === 'CURSE') {
      // Monster drops Cursed Skulls into player's pit!
      for (let i = 0; i < intent.value; i++) {
        const skullMesh = createItem3DMesh(ITEM_DEFS.SKULL);
        this.scene.add(skullMesh);
        this.physics.addItem(skullMesh, ITEM_DEFS.SKULL, (Math.random() - 0.5) * 3, 1.8, (Math.random() - 0.5) * 2);
      }
      this.showComboBanner(`☠️ Monster dropped ${intent.value} Cursed Skulls into your pit!`);
    }

    this.currentMonster.nextTurn();

    if (this.hp <= 0) {
      this.showGameOver();
    } else {
      this.energy = this.maxEnergy;
      this.armor = 0;
      this.gameState = 'PLAYER_TURN';
      this.physics.claw.state = 'IDLE';
      this.physics.claw.y = this.physics.claw.baseY;
    }
    this.updateHUD();
  }

  openShop() {
    this.gameState = 'SHOP';
    this.ui.shopItemsContainer.innerHTML = '';

    // Render Claw Upgrades
    CLAW_UPGRADES.forEach(upg => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      const lang = i18n.currentLang;
      card.innerHTML = `
        <div class="shop-icon">${upg.icon}</div>
        <div class="shop-info">
          <div class="shop-name">${upg.name[lang] || upg.name.en}</div>
          <div class="shop-desc">${upg.desc[lang] || upg.desc.en}</div>
        </div>
        <button class="buy-btn" ${this.gold < upg.cost ? 'disabled' : ''}>
          💰 ${upg.cost} Gold
        </button>
      `;
      const btn = card.querySelector('.buy-btn');
      btn.addEventListener('click', () => {
        if (this.gold >= upg.cost) {
          this.gold -= upg.cost;
          upg.apply(this);
          btn.disabled = true;
          btn.innerText = '✅ Purchased';
          this.updateHUD();
        }
      });
      this.ui.shopItemsContainer.appendChild(card);
    });

    this.ui.shopModal.style.display = 'flex';
  }

  nextFloor() {
    this.floorIndex++;
    if (this.floorIndex >= MONSTER_ROSTER.length) {
      this.showVictory();
    } else {
      this.spawnFloorMonster();
      this.energy = this.maxEnergy;
      this.armor = 0;
      this.gameState = 'PLAYER_TURN';
      this.physics.claw.state = 'IDLE';
      this.physics.claw.y = this.physics.claw.baseY;
      this.physics.claw.grabbedItems = [];
      this.physics.claw.targetAngle = this.physics.claw.openAngle;
      this.updateHUD();
    }
  }

  showComboBanner(text) {
    if (!this.ui.comboBanner) return;
    this.ui.comboBanner.innerText = text;
    this.ui.comboBanner.classList.add('active');
    setTimeout(() => {
      this.ui.comboBanner.classList.remove('active');
    }, 2500);
  }

  showGameOver() {
    this.gameState = 'GAME_OVER';
    soundEngine.playGameOver();
    const titleEl = document.getElementById('endgameTitle');
    if (titleEl) titleEl.innerText = i18n.t('defeatTitle');
    const fFloor = document.getElementById('finalFloor');
    if (fFloor) fFloor.innerText = `Floor ${this.floorIndex + 1}`;
    const fGold = document.getElementById('finalGold');
    if (fGold) fGold.innerText = `${this.gold} Gold`;
    
    if (this.ui.btnExtraLife) {
      this.ui.btnExtraLife.style.display = this.hasRevived ? 'none' : 'block';
    }
    
    if (this.ui.gameOverModal) this.ui.gameOverModal.style.display = 'flex';
  }

  revivePlayer() {
    this.hasRevived = true;
    this.hp = this.maxHp;
    this.energy = this.maxEnergy;
    this.armor = 0;
    this.gameState = 'PLAYER_TURN';
    this.physics.claw.state = 'IDLE';
    this.physics.claw.y = this.physics.claw.baseY;
    if (this.ui.gameOverModal) this.ui.gameOverModal.style.display = 'none';
    this.updateHUD();
  }

  showVictory() {
    this.gameState = 'VICTORY';
    soundEngine.playVictory();
    const titleEl = document.getElementById('endgameTitle');
    if (titleEl) titleEl.innerText = i18n.t('victoryTitle');
    const fFloor = document.getElementById('finalFloor');
    if (fFloor) fFloor.innerText = `Floor ${this.floorIndex + 1} (ALL CLEARED!)`;
    const fGold = document.getElementById('finalGold');
    if (fGold) fGold.innerText = `${this.gold} Gold`;
    if (this.ui.gameOverModal) this.ui.gameOverModal.style.display = 'flex';
  }

  updateHUD() {
    if (this.ui.hpDisplay) this.ui.hpDisplay.innerText = `${this.hp}/${this.maxHp}`;
    if (this.ui.hpBarFill) this.ui.hpBarFill.style.width = `${Math.max(0, (this.hp / this.maxHp) * 100)}%`;
    if (this.ui.armorDisplay) this.ui.armorDisplay.innerText = this.armor;
    if (this.ui.energyDisplay) this.ui.energyDisplay.innerText = `${this.energy}/${this.maxEnergy}`;
    if (this.ui.goldDisplay) this.ui.goldDisplay.innerText = this.gold;
    if (this.ui.floorDisplay) this.ui.floorDisplay.innerText = this.floorIndex + 1;

    if (this.currentMonster) {
      const lang = i18n.currentLang;
      if (this.ui.monsterName) this.ui.monsterName.innerText = this.currentMonster.def.name[lang] || this.currentMonster.def.name.en;
      if (this.ui.monsterHpDisplay) this.ui.monsterHpDisplay.innerText = `${this.currentMonster.hp}/${this.currentMonster.maxHp} HP (${this.currentMonster.armor} Armor)`;
      if (this.ui.monsterHpBarFill) this.ui.monsterHpBarFill.style.width = `${Math.max(0, (this.currentMonster.hp / this.currentMonster.maxHp) * 100)}%`;
      const intent = this.currentMonster.getCurrentIntent();
      if (this.ui.monsterIntentDisplay) this.ui.monsterIntentDisplay.innerText = intent.icon;
    }

    if (this.ui.turnHintText) {
      if (this.gameState === 'PLAYER_TURN') {
        this.ui.turnHintText.innerText = `🟢 YOUR TURN: Tap [◀️ LEFT / RIGHT ▶️] or [A/D] / Click to aim, then press [⬇️ DROP CLAW / Space / ⬇️]! (Energy: ${this.energy}/${this.maxEnergy})`;
        this.ui.turnHintText.style.color = '#38bdf8';
      } else if (this.gameState === 'CLAW_ACTIVE') {
        this.ui.turnHintText.innerText = '🤖 Crane lowering & lifting loot...';
        this.ui.turnHintText.style.color = '#facc15';
      } else if (this.gameState === 'ENEMY_TURN') {
        this.ui.turnHintText.innerText = '👾 Monster is attacking...';
        this.ui.turnHintText.style.color = '#f87171';
      }
    }

    const canControl = (this.gameState === 'PLAYER_TURN' && this.energy > 0);
    if (this.ui.btnMoveLeft) this.ui.btnMoveLeft.disabled = !canControl;
    if (this.ui.btnMoveRight) this.ui.btnMoveRight.disabled = !canControl;

    if (this.ui.btnDropClaw) {
      this.ui.btnDropClaw.disabled = !canControl;
      this.ui.btnDropClaw.innerText = canControl ? '⬇️ DROP CLAW (Space / ⬇️)' : (this.gameState === 'CLAW_ACTIVE' ? '⏳ Grabbing...' : '⌛ Waiting...');
    }
  }

  handleKeyboard(dt) {
    if (this.gameState !== 'PLAYER_TURN') return;
    let dx = 0;
    let dz = 0;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;
    if (this.keys['w'] || this.keys['arrowup']) dz -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dz += 1;

    if (dx !== 0 || dz !== 0) {
      this.physics.moveClaw(dx, dz, dt);
      soundEngine.startMotorSound();
    }
  }

  animate(time) {
    try {
      const dt = 0.016; // Stable 60fps delta

      this.handleKeyboard(dt);
      this.physics.update(dt);

      // Sync 3D Crane transforms
      const claw = this.physics.claw;
      if (this.trolleyMesh) this.trolleyMesh.position.set(claw.x, 2.4, claw.z);

      // Sync vertical cable scale & position
      const cableHeight = Math.max(0.1, 2.4 - claw.y);
      if (this.cableMesh) {
        this.cableMesh.scale.set(1, cableHeight, 1);
        this.cableMesh.position.set(claw.x, 2.4 - cableHeight / 2, claw.z);
      }

      if (this.clawHub) this.clawHub.position.set(claw.x, claw.y, claw.z);

      // Articulate 3 Claw prongs
      if (this.prongs) {
        this.prongs.forEach((prong) => {
          prong.rotation.z = claw.currentAngle;
        });
      }

      // Gentle float animation for monster
      if (this.currentMonster && this.currentMonster.mesh) {
        this.currentMonster.mesh.rotation.y = Math.sin(time * 0.002) * 0.25;
        this.currentMonster.mesh.position.y = 1.2 + Math.sin(time * 0.004) * 0.15;
      }

      this.renderer.render(this.scene, this.camera);
    } catch (err) {
      console.warn('Render frame:', err);
    }
    requestAnimationFrame(this.animate);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new DungeonClawGame();
  i18n.applyTranslations();
});
