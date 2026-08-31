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

  // 10. Start Dynamic Music Sequencer
  startSong(songId, bpm) {
    this.stopSong();
    this.ensureContext();
    this.currentSongId = songId;
    this.bpm = bpm || 120;
    this.step = 0;
    this.isPlayingMusic = true;

    // 16th note interval
    const stepDurationMs = (60 / this.bpm / 4) * 1000;

    const bassNotes = [110, 110, 130.81, 146.83, 110, 110, 98, 110];
    const leadNotes = [440, 523.25, 659.25, 587.33, 783.99, 659.25, 523.25, 493.88];

    this.currentTrackInterval = setInterval(() => {
      if (!this.isPlayingMusic || !this.ctx) return;

      const beat16 = this.step % 16;
      const beat4 = Math.floor(this.step / 4) % 4;

      // 4/4 Kick on every quarter beat (0, 4, 8, 12)
      if (beat16 % 4 === 0) {
        this.playKick();
      }

      // Snare on 4 and 12 (Beats 2 and 4)
      if (beat16 === 4 || beat16 === 12) {
        this.playSnare();
      }

      // Hi-Hats on every 8th note
      if (beat16 % 2 === 0) {
        this.playHiHat();
      }

      // Synth Bassline on 16th notes
      if (beat16 % 2 === 0) {
        const noteIdx = Math.floor(this.step / 2) % bassNotes.length;
        this.playBass(bassNotes[noteIdx], null, stepDurationMs / 1000 * 1.5);
      }

      // Arpeggio Lead
      if (beat16 % 4 === 2) {
        const leadIdx = Math.floor(this.step / 4) % leadNotes.length;
        this.playLead(leadNotes[leadIdx], null, stepDurationMs / 1000 * 2.0);
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
