/**
 * Procedural Web Audio API Synthesizer for Neon Beat
 * Generates 100% procedural EDM / Synthwave tracks with drums, bass, leads, and interactive slicing SFX.
 */

class NeonAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.currentTrackInterval = null;
    this.bpm = 120;
    this.step = 0;
    this.isPlayingMusic = false;
    this.currentSongId = 'cyber_highway';
  }

  initContext() {
    if (typeof window === 'undefined') return;
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

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // 1. Kick Drum
  playKick(time) {
    if (this.muted || !this.ctx) return;
    const now = time || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 2. Snare / Clap
  playSnare(time) {
    if (this.muted || !this.ctx) return;
    const now = time || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 3. Hi-Hat
  playHiHat(time) {
    if (this.muted || !this.ctx) return;
    const now = time || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.03);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  // 4. Synth Bass Note
  playBass(freq, time, duration = 0.15) {
    if (this.muted || !this.ctx) return;
    const now = time || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 5. Synth Lead Note
  playLead(freq, time, duration = 0.2) {
    if (this.muted || !this.ctx) return;
    const now = time || this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 6. Interactive Slice Sound (Cyan / Blue Blade)
  playSliceBlue() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.08); // D6

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 7. Interactive Slice Sound (Magenta / Red Blade)
  playSliceRed() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440.00, now); // A4
    osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.08); // A5

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 8. Miss Sound (Dull Thud)
  playMiss() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 9. Fever Mode Fanfare
  playFeverChime() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.25);
    });
  }

  // 10. Start Dynamic Music Sequencer with 4 Unique Compositions
  startSong(songId, bpm) {
    this.stopSong();
    this.ensureContext();
    this.currentSongId = songId || 'cyber_highway';
    this.bpm = bpm || 120;
    this.step = 0;
    this.isPlayingMusic = true;

    // 16th note interval
    const stepDurationMs = (60 / this.bpm / 4) * 1000;

    // 4 Distinct Track Profiles (Melody, Bass, Drum Pattern, Synth Timbre)
    const PROFILES = {
      // 1. Cyber Highway (Chill Synthwave / Outrun - A Minor)
      cyber_highway: {
        bass: [110, 110, 87.31, 87.31, 130.81, 130.81, 98.00, 110],
        lead: [440, 523.25, 659.25, 587.33, 523.25, 493.88, 392.00, 440, 659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25, 440],
        leadType: 'sine',
        leadGain: 0.16,
        isDnB: false,
        isHardcore: false
      },
      // 2. Neon Tokyo 2099 (Japanese Future Cyberpunk - D Minor Pentatonic)
      neon_tokyo: {
        bass: [73.42, 98.00, 87.31, 110.00, 73.42, 130.81, 110.00, 73.42],
        lead: [587.33, 698.46, 880.00, 783.99, 587.33, 523.25, 587.33, 698.46, 783.99, 880.00, 1046.50, 880.00, 698.46, 587.33, 523.25, 587.33],
        leadType: 'square',
        leadGain: 0.12,
        isDnB: false,
        isHardcore: false
      },
      // 3. Overdrive Rush (Fast Drum & Bass - F# Minor)
      overdrive_rush: {
        bass: [46.25, 46.25, 73.42, 73.42, 82.41, 82.41, 69.30, 92.50],
        lead: [739.99, 880.00, 1108.73, 987.77, 880.00, 830.61, 739.99, 659.25, 739.99, 987.77, 1108.73, 1318.51, 1108.73, 987.77, 880.00, 739.99],
        leadType: 'sawtooth',
        leadGain: 0.14,
        isDnB: true,
        isHardcore: false
      },
      // 4. Apex Singularity (Dark Hardcore Trance - C Minor Phrygian)
      apex_singularity: {
        bass: [65.41, 65.41, 51.91, 51.91, 58.27, 58.27, 77.78, 65.41],
        lead: [523.25, 622.25, 783.99, 932.33, 1046.50, 932.33, 830.61, 783.99, 698.46, 622.25, 587.33, 523.25, 783.99, 1046.50, 1244.51, 1046.50],
        leadType: 'sawtooth',
        leadGain: 0.18,
        isDnB: false,
        isHardcore: true
      }
    };

    const trackProfile = PROFILES[this.currentSongId] || PROFILES.cyber_highway;

    this.currentTrackInterval = setInterval(() => {
      if (!this.isPlayingMusic || !this.ctx) return;

      const beat16 = this.step % 16;
      const beat32 = this.step % 32;

      // 1. Dynamic Drum Patterns
      if (trackProfile.isDnB) {
        // Drum & Bass Beat: Kick on 0 & 10, Snare on 4 & 12
        if (beat16 === 0 || beat16 === 10) this.playKick();
        if (beat16 === 4 || beat16 === 12) this.playSnare();
        if (beat16 % 2 === 0) this.playHiHat();
      } else if (trackProfile.isHardcore) {
        // Hardcore 4-on-the-floor relentless kicks on every quarter beat with double claps
        if (beat16 % 4 === 0) this.playKick();
        if (beat16 === 4 || beat16 === 12) this.playSnare();
        this.playHiHat(); // 16th note galloping hi-hats
      } else {
        // Standard EDM / Synthwave 4/4
        if (beat16 % 4 === 0) this.playKick();
        if (beat16 === 4 || beat16 === 12) this.playSnare();
        if (beat16 % 2 === 0) this.playHiHat();
      }

      // 2. Unique Bassline Progression
      if (beat16 % 2 === 0) {
        const bassIdx = Math.floor(this.step / 2) % trackProfile.bass.length;
        this.playBass(trackProfile.bass[bassIdx], null, stepDurationMs / 1000 * 1.8);
      }

      // 3. Unique Melodic Synth Lead Progression
      if (beat16 % 2 === 0 || trackProfile.isHardcore) {
        const leadIdx = Math.floor(this.step / 2) % trackProfile.lead.length;
        const noteFreq = trackProfile.lead[leadIdx];

        // Synthesize Lead with distinct timbre
        if (!this.muted && this.ctx) {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = trackProfile.leadType;
          osc.frequency.setValueAtTime(noteFreq, now);

          gain.gain.setValueAtTime(trackProfile.leadGain, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (stepDurationMs / 1000 * 1.6));

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + (stepDurationMs / 1000 * 1.6));
        }
      }

      this.step++;
    }, stepDurationMs);
  }

  stopSong() {
    this.isPlayingMusic = false;
    if (this.currentTrackInterval) {
      clearInterval(this.currentTrackInterval);
      this.currentTrackInterval = null;
    }
  }
}

export const neonAudio = new NeonAudioEngine();
