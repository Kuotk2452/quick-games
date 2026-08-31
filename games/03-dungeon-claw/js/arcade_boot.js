
import { soundEngine } from './audio.js?v=8.2';

class ArcadeBootScreen {
  constructor() {
    this.screen = document.getElementById('arcadeBootScreen');
    this.text = document.querySelector('#arcadeBootScreen .boot-text');
    this.subtext = document.querySelector('#arcadeBootScreen .boot-subtext');
    
    if (!this.screen) return;
    
    window.isArcadeBooting = true;
    this.bindEvents();
  }
  
  bindEvents() {
    this.screen.addEventListener('click', () => {
      if (this.isBooting) return;
      this.isBooting = true;
      
      // Visual response to coin insert
      this.text.classList.remove('pulse');
      this.subtext.classList.add('hidden');
      this.text.style.color = '#ff3333';
      this.text.textContent = 'INITIALIZING CLAW MECHANISM...';
      
      // Audio Sequence
      soundEngine.playCoinDrop();
      
      setTimeout(() => {
        soundEngine.playPowerUp();
        this.screen.classList.add('shake');
        
        setTimeout(() => {
          this.screen.classList.add('flash');
          setTimeout(() => {
            this.screen.classList.remove('flash');
            this.screen.classList.remove('shake');
            this.screen.classList.add('opening');
            
            soundEngine.startBGM();
            
            setTimeout(() => {
              this.screen.classList.add('hidden');
              window.isArcadeBooting = false;
            }, 1200);
          }, 150);
        }, 1500);
      }, 800);
    });
  }
}

// Auto-init
if (document.getElementById('arcadeBootScreen')) {
  new ArcadeBootScreen();
}
