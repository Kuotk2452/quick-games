/**
 * Web Audio API Sound Synthesizer for 3D Dungeon Claw
 * 100% synthesized arcade crane motor whirs, metal clangs, magic blasts, and combat audio.
 */

class ClawSoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.motorOsc = null;
    this.motorGain = null;
  }

  initContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && !this.ctx) {
      this.ctx = new AudioCtx();
    }
  }

  ensureContext() {
    if (!this.ctx) this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCoinDrop() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Quick metallic pings
    const freqs = [1200, 1600, 800];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.8, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  }

  playPowerUp() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Low mechanical generator spooling up
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(10, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 1.5);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.exponentialRampToValueAtTime(1000, now + 1.5);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.6);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 1.7);
  }

  startBGM() {
    this.ensureContext();
    if (this.muted || !this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    
    // Play a continuous dark ambient drone (audible on laptop speakers)
    const playDrone = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Base note (A2 = ~110Hz, A3 = 220Hz, E3 = 164.8Hz)
      const freqs = [110, 164.81, 220];
      
      freqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        // Slight detune wobble
        osc.frequency.linearRampToValueAtTime(freq + 1, now + 4);
        osc.frequency.linearRampToValueAtTime(freq, now + 8);
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.linearRampToValueAtTime(800, now + 4);
        filter.frequency.linearRampToValueAtTime(400, now + 8);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        // Fade in and out per cycle
        gain.gain.linearRampToValueAtTime(0.08, now + 2);
        gain.gain.linearRampToValueAtTime(0.04, now + 6);
        gain.gain.linearRampToValueAtTime(0, now + 8.1); // Slightly overlap to prevent clicks
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + 8.1);
      });
    };
    
    playDrone();
    this.bgmInterval = setInterval(playDrone, 8000);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Crane motor sound when moving X/Z
  startMotorSound() {
    if (this.muted || this.motorOsc) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.motorOsc = this.ctx.createOscillator();
    this.motorGain = this.ctx.createGain();

    this.motorOsc.type = 'sawtooth';
    this.motorOsc.frequency.setValueAtTime(110, this.ctx.currentTime);
    this.motorGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.motorOsc.connect(this.motorGain);
    this.motorGain.connect(this.ctx.destination);
    this.motorOsc.start();
  }

  stopMotorSound() {
    if (this.motorOsc) {
      try {
        this.motorOsc.stop();
        this.motorOsc.disconnect();
      } catch (e) {}
      this.motorOsc = null;
      this.motorGain = null;
    }
  }

  playClawDrop() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.4);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playClawGrab() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Metallic clamp snap
    [520, 260].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      gain.gain.setValueAtTime(0.2, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.04 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.15);
    });
  }

  playItemEffect(type) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (type === 'SWORD' || type === 'FIRE_SWORD') {
      // Blade slash sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'SHIELD' || type === 'GOLD_SHIELD') {
      // Heavy iron block clang
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'BOMB') {
      // Big explosion boom
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'POTION') {
      // Sparkling elixir jingle
      [659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } else if (type === 'COIN') {
      // Golden coin bell
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.06);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Default magic chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  playVictory() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.25, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.09 + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.45);
    });
  }

  playGameOver() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [392, 349.23, 311.13, 261.63].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0.2, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.14 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.4);
    });
  }
}

export const soundEngine = new ClawSoundEngine();
