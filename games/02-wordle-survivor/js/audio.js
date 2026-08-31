/**
 * Web Audio API Retro & Neo-Chiptune Synthesizer for Wordle Survivor
 * Zero external audio assets required; 100% synthesized in real time.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmNode = null;
    this.initContext();
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

  playMagicalHum() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    
    // Very low drone
    const drone = this.ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 60;
    
    // High choir-like tone
    const choir = this.ctx.createOscillator();
    choir.type = 'triangle';
    choir.frequency.value = 400;
    
    // LFO for modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.5; // slow throb
    
    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0.1;
    
    const choirGain = this.ctx.createGain();
    choirGain.gain.value = 0; // modulated by LFO
    
    lfo.connect(choirGain.gain);
    
    drone.connect(droneGain);
    droneGain.connect(this.ctx.destination);
    
    choir.connect(choirGain);
    choirGain.connect(this.ctx.destination);
    
    drone.start();
    choir.start();
    lfo.start();
    
    this.magicalHumNodes = [drone, choir, lfo, droneGain, choirGain];
  }

  stopMagicalHum() {
    if (this.magicalHumNodes) {
      const now = this.ctx.currentTime;
      this.magicalHumNodes.forEach(node => {
        if (node.stop) node.stop(now + 0.5);
        if (node.gain) node.gain.linearRampToValueAtTime(0, now + 0.5);
      });
      this.magicalHumNodes = null;
    }
  }

  playSpellCast() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    
    const now = this.ctx.currentTime;
    const dur = 2.0;
    
    // Impact blast (noise)
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(8000, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, now + dur);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + dur);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
    
    // Magical Sweep (Chime)
    const sweep = this.ctx.createOscillator();
    sweep.type = 'sine';
    sweep.frequency.setValueAtTime(800, now);
    sweep.frequency.exponentialRampToValueAtTime(200, now + 1.0);
    
    const sweepGain = this.ctx.createGain();
    sweepGain.gain.setValueAtTime(0.5, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
    
    sweep.connect(sweepGain);
    sweepGain.connect(this.ctx.destination);
    sweep.start(now);
    sweep.stop(now + 1.1);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.bgmPlaying) {
      this.stopBGM();
    } else if (!this.muted && !this.bgmPlaying) {
      this.startBGM();
    }
    return this.muted;
  }

  playLetterPickup() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.08); // G5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playSpellCast(elementType = 'ARCANE', isCrit = false) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.connect(this.ctx.destination);

    if (elementType === 'FIRE') {
      // Fire whoosh & boom
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (elementType === 'ICE') {
      // Ice crystal chime
      [880, 1174.66, 1760].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        oscGain.gain.setValueAtTime(0.2, now + i * 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.4);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.4);
      });
    } else if (elementType === 'LIGHTNING') {
      // Lightning electric zap
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (elementType === 'HOLY') {
      // Holy radiant bells
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        g.gain.setValueAtTime(0.2, now + idx * 0.04);
        g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.04 + 0.5);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.5);
      });
    } else if (elementType === 'VOID') {
      // Dark void sub-bass
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (elementType === 'BLADE') {
      // Metallic sword slash
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      // Arcane magic sparkle
      [440, 660, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        g.gain.setValueAtTime(0.18, now + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.3);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.3);
      });
    }

    if (isCrit) {
      // Extra explosive chime for critical hits
      setTimeout(() => {
        if (!this.ctx || this.muted) return;
        const cNow = this.ctx.currentTime;
        const cOsc = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        cOsc.type = 'sine';
        cOsc.frequency.setValueAtTime(1760, cNow);
        cOsc.frequency.exponentialRampToValueAtTime(880, cNow + 0.3);
        cGain.gain.setValueAtTime(0.25, cNow);
        cGain.gain.exponentialRampToValueAtTime(0.01, cNow + 0.3);
        cOsc.connect(cGain);
        cGain.connect(this.ctx.destination);
        cOsc.start(cNow);
        cOsc.stop(cNow + 0.3);
      }, 50);
    }
  }

  playMonsterDeath() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.09);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  playPlayerHit() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playLevelUp() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880]; // A major fanfare
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  playGameOver() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [440, 415.3, 392, 349.23];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.2, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.35);
    });
  }

  startBGM() {
    // Dynamic synth bass arpeggio
    if (this.muted || this.bgmPlaying) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    const baseFreqs = [110, 130.81, 146.83, 164.81]; // A minor groove
    let step = 0;

    const tick = () => {
      if (!this.bgmPlaying || this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreqs[step % baseFreqs.length], now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);

      step++;
      this.bgmTimer = setTimeout(tick, 250);
    };

    tick();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();
