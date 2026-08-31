/**
 * Web Audio API Sound Synthesizer for Cosmic Orbit
 * 100% procedurally synthesized celestial chords, orbital launches, harmonic merges, and supernova blasts.
 */

class CosmicAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.gravityHumOsc = null;
    this.gravityHumGain = null;
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

  playTelemetryBeeps() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    
    const playBeep = (timeOffset, freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime + timeOffset);
      gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + timeOffset + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + timeOffset + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + timeOffset);
      osc.stop(this.ctx.currentTime + timeOffset + 0.2);
    };

    // Sequential data beeps
    playBeep(0.0, 1800);
    playBeep(0.2, 1900);
    playBeep(0.5, 1750);
    playBeep(0.8, 2000);
    playBeep(0.95, 2000);
    
    // Background low rumble
    const rumble = this.ctx.createOscillator();
    const rumbleGain = this.ctx.createGain();
    rumble.type = 'sawtooth';
    rumble.frequency.value = 60;
    
    rumbleGain.gain.setValueAtTime(0, this.ctx.currentTime);
    rumbleGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.5);
    rumbleGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 100;
    
    rumble.connect(filter);
    filter.connect(rumbleGain);
    rumbleGain.connect(this.ctx.destination);
    
    rumble.start();
    rumble.stop(this.ctx.currentTime + 1.5);
  }

  playAirlockSwoosh() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    
    const dur = 1.0;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(5000, this.ctx.currentTime + 0.3);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + dur);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Slingshot Aim & Launch Whoosh
  playLaunchWhoosh(power = 1.0) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(450 * Math.max(0.5, power), now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Harmonic Celestial Merge Chords (Pitches up with tier 1-11)
  playMergeChime(tier = 1) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Harmonic frequencies
    const baseFreqs = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1318.51];
    const base = baseFreqs[Math.min(tier, baseFreqs.length - 1)];

    // Play fundamental + fifth + octave harmonic chord
    [base, base * 1.5, base * 2.0].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = tier >= 8 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);

      const vol = (0.22 / (idx + 1));
      gain.gain.setValueAtTime(vol, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.45);
    });
  }

  // Gravitational Pulse Wave (Special Power)
  playGravityPulse() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Supernova / Quasar Merge Explosion
  playSupernovaBlast() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Sub-bass thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.8);

    // High sparkle fanfare
    [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, now + i * 0.08);
      g.gain.setValueAtTime(0.2, now + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now + i * 0.08);
      o.stop(now + i * 0.08 + 0.5);
    });
  }

  // Event Horizon Overflow / Game Over Collapse
  playBlackHoleCollapse() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 1.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }
}

export const cosmicAudio = new CosmicAudioEngine();
