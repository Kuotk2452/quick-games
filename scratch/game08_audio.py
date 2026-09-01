import os

filepath = 'games/08-circus-3d/js/audio.js'
with open(filepath, 'r', encoding='utf-8') as f:
    js = f.read()

perfect_cheer = '''  playPerfectCheer() {
    this.ensureContext();
    if (this.muted || !this.ctx) return;
    
    // Procedural crowd cheer & whistle
    const duration = 1.5;
    const osc = this.ctx.createOscillator();
    const noise = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    // Pink noise for crowd cheer
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1500, this.ctx.currentTime + duration);
    
    // Whistle
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.8);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start(this.ctx.currentTime);
    osc.start(this.ctx.currentTime);
    noise.stop(this.ctx.currentTime + duration);
    osc.stop(this.ctx.currentTime + duration);
  }

  playSomersault() {'''

js = js.replace('  playSomersault() {', perfect_cheer)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(js)
