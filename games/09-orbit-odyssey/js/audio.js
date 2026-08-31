
/**
 * Game 09: Orbit Odyssey - Procedural Web Audio Synth & Sequencer
 */
class OrbitAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    
    // Sequencer state
    this.isPlayingBGM = false;
    this.bgmTimer = null;
    this.nextNoteTime = 0;
    this.currentStep = 0;
  }

  ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBGM() {
    this.ensureContext();
    this.stopBGM();
    this.isPlayingBGM = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.scheduleNote();
  }

  stopBGM() {
    this.isPlayingBGM = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
    }
  }

  scheduleNote() {
    if (!this.isPlayingBGM) return;

    const bpm = 135;
    const stepTime = (60 / bpm) / 4; // 16th note duration

    // Schedule ahead
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.playSequencerStep(this.currentStep, this.nextNoteTime);
      this.nextNoteTime += stepTime;
      this.currentStep = (this.currentStep + 1) % 16;
    }

    this.bgmTimer = setTimeout(() => this.scheduleNote(), 25);
  }

  playSequencerStep(step, time) {
    // Kick Drum (4-on-the-floor)
    if (step % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      
      kickOsc.type = 'sine';
      // Pitch drop
      kickOsc.frequency.setValueAtTime(150, time);
      kickOsc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
      
      // Volume envelope
      kickGain.gain.setValueAtTime(0.8, time);
      kickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
      
      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(time);
      kickOsc.stop(time + 0.5);
    }

    // Hi-hat (offbeats)
    if (step % 2 !== 0) {
      const bufferSize = this.ctx.sampleRate * 0.1;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 7000;
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.1, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(time);
    }

    // Synthwave Arpeggio / Bassline
    // Notes: A2, A3, C4, E4, G4 -> corresponding frequencies
    const fA2 = 110.0;
    const fA3 = 220.0;
    const fC4 = 261.63;
    const fE4 = 329.63;
    const fG4 = 392.00;
    
    const pattern = [
      fA2, 0, fA3, 0, fA2, 0, fC4, 0,
      fA2, 0, fE4, 0, fA2, 0, fG4, 0
    ];
    
    const freq = pattern[step];
    if (freq > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      // Filter envelope for plucky sound
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, time);
      filter.frequency.exponentialRampToValueAtTime(200, time + 0.15);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.15);
    }
  }

  playTetherShoot() {
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playTetherLock() {
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1600, this.ctx.currentTime + 0.1); // Arp up
    
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playSlingshot() {
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.4);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  playPerfectOrbit() {
    this.ensureContext();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    osc.frequency.setValueAtTime(1108.73, this.ctx.currentTime + 0.1); // C#6
    osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.2); // E6
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  playCrash() {
    this.ensureContext();
    
    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start();
  }
}

export const orbitAudio = new OrbitAudio();
