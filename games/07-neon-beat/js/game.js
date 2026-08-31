/**
 * Neon Beat: Main Game Controller & Rhythmic Slicing Engine
 */

import { neonAudio } from './audio.js';
import { i18n } from './i18n.js';
import { TRACK_LIST, generateBeatmap } from './tracks.js';
import { BladeSlicer } from './slicer.js';
import { NeonParticleEngine } from './particles.js';

export class NeonBeatGame {
  constructor() {
    this.canvas = document.getElementById('beatCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 680;
    this.height = 540;

    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    this.state = 'BOOT_WAITING'; // 'BOOT_WAITING' | 'TRACK_SELECT' | 'PLAYING' | 'RESULTS'
    this.selectedTrackIndex = 0;

    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.multiplier = 1;
    this.feverGauge = 0; // 0 to 100

    this.stats = {
      perfect: 0,
      great: 0,
      good: 0,
      miss: 0,
      totalNotes: 0
    };

    this.songTime = 0;
    this.notes = [];

    this.slicer = new BladeSlicer(this.canvas);
    this.particles = new NeonParticleEngine(this.canvas);

    this.prevPointerPos = null;
    this.isPointerDown = false;

    this.initDOM();
    this.initEvents();
    this.renderTrackSelection();

    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  initDOM() {
    this.ui = {
      neonBootScreen: document.getElementById('neonBootScreen'),
      bootText: document.getElementById('bootText'),
      bootEq: document.getElementById('bootEq'),
      whiteFlash: document.getElementById('whiteFlash'),
      trackSelectView: document.getElementById('trackSelectView'),
      gameplayView: document.getElementById('gameplayView'),
      trackListContainer: document.getElementById('trackListContainer'),
      scoreDisplay: document.getElementById('scoreDisplay'),
      comboDisplay: document.getElementById('comboDisplay'),
      multiplierDisplay: document.getElementById('multiplierDisplay'),
      feverFill: document.getElementById('feverFill'),
      endModal: document.getElementById('endModal'),
      gradeDisplay: document.getElementById('gradeDisplay'),
      resultScore: document.getElementById('resultScore'),
      resultMaxCombo: document.getElementById('resultMaxCombo'),
      resultPerfect: document.getElementById('resultPerfect'),
      resultGreat: document.getElementById('resultGreat'),
      resultGood: document.getElementById('resultGood'),
      resultMiss: document.getElementById('resultMiss'),
      btnRetry: document.getElementById('btnRetry'),
      btnSelectTrack: document.getElementById('btnSelectTrack'),
      btnShareScore: document.getElementById('btnShareScore'),
      audioToggleBtn: document.getElementById('audioToggleBtn'),
      langSelect: document.getElementById('langSelect')
    };
  }

  initEvents() {
    if (this.ui.neonBootScreen) {
      this.ui.neonBootScreen.addEventListener('click', () => {
        if (this.state === 'BOOTING') return;
        this.state = 'BOOTING';
        
        this.ui.bootText.classList.remove('pulse');
        this.ui.bootText.classList.add('syncing');
        this.ui.bootText.textContent = "SYNCING AUDIO ENGINE...";
        this.ui.bootEq.classList.remove('hidden');
        
        neonAudio.playBootRiser();
        
        setTimeout(() => {
          this.ui.whiteFlash.classList.add('flash-active');
          neonAudio.playBassDrop();
          
          setTimeout(() => {
            this.ui.neonBootScreen.classList.add('hidden');
            this.showTrackSelect();
          }, 200);
        }, 2000);
      });
    }

    if (this.ui.btnRetry) {
      this.ui.btnRetry.addEventListener('click', () => {
        if (this.ui.endModal) this.ui.endModal.style.display = 'none';
        this.startTrack(this.selectedTrackIndex);
      });
    }

    if (this.ui.btnSelectTrack) {
      this.ui.btnSelectTrack.addEventListener('click', () => {
        if (this.ui.endModal) this.ui.endModal.style.display = 'none';
        this.showTrackSelect();
      });
    }

    if (this.ui.audioToggleBtn) {
      this.ui.audioToggleBtn.addEventListener('click', () => {
        const muted = neonAudio.toggleMute();
        this.ui.audioToggleBtn.innerText = muted ? '🔇' : '🔊';
      });
    }

    if (this.ui.langSelect) {
      this.ui.langSelect.value = i18n.currentLang;
      this.ui.langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        this.renderTrackSelection();
      });
    }

    // Keyboard Slicing (A/S/D for Blue Left, J/K/L for Red Right)
    window.addEventListener('keydown', (e) => {
      if (this.state !== 'PLAYING') return;

      const key = e.code;
      if (key === 'KeyA' || key === 'KeyS' || key === 'KeyD' || key === 'ArrowLeft') {
        // Trigger Left Blue Blade Slash
        this.triggerKeySlice('BLUE', key === 'KeyA' ? 0 : 1);
      } else if (key === 'KeyJ' || key === 'KeyK' || key === 'KeyL' || key === 'ArrowRight') {
        // Trigger Right Red Blade Slash
        this.triggerKeySlice('RED', key === 'KeyL' ? 3 : 2);
      }
    });

    // Mouse / Touch Motion Slicing
    const updatePointer = (e) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = (clientX - rect.left) * (this.width / rect.width);
      const y = (clientY - rect.top) * (this.height / rect.height);

      if (this.isPointerDown && this.prevPointerPos) {
        // Determine whether blade is left (Blue) or right (Red)
        const isBlue = x < this.width / 2;
        this.slicer.addPoint(x, y, isBlue);

        // Check slice across notes
        this.checkPointerSlice(this.prevPointerPos.x, this.prevPointerPos.y, x, y, isBlue);
      }

      this.prevPointerPos = { x, y };
    };

    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        this.isPointerDown = true;
        updatePointer(e);
      });
      this.canvas.addEventListener('mousedown', (e) => {
        this.isPointerDown = true;
        this.prevPointerPos = null;
        updatePointer(e);
      });
      window.addEventListener('mouseup', () => {
        this.prevPointerPos = null;
      });

      this.canvas.addEventListener('touchmove', (e) => {
        this.isPointerDown = true;
        updatePointer(e);
      }, { passive: true });
      this.canvas.addEventListener('touchstart', (e) => {
        this.isPointerDown = true;
        this.prevPointerPos = null;
        updatePointer(e);
      }, { passive: true });
      window.addEventListener('touchend', () => {
        this.prevPointerPos = null;
      });
    }

    // Share Score
    if (this.ui.btnShareScore) {
      this.ui.btnShareScore.addEventListener('click', () => {
        const track = TRACK_LIST[this.selectedTrackIndex];
        const lang = i18n.currentLang;
        const text = `🎵 I scored ${this.score.toLocaleString()} on [${track.title[lang] || track.title.en}] in Neon Beat!
🏆 Grade: ${this.calculateGrade()} | Max Combo: ${this.maxCombo}x
Play Free: https://quick-games-ez4.pages.dev/games/07-neon-beat/`;
        navigator.clipboard.writeText(text).then(() => alert(i18n.t('copiedAlert'))).catch(() => prompt('Score:', text));
      });
    }
  }

  renderTrackSelection() {
    if (!this.ui.trackListContainer) return;
    this.ui.trackListContainer.innerHTML = '';
    const lang = i18n.currentLang;

    TRACK_LIST.forEach((track, idx) => {
      const bestScore = typeof localStorage !== 'undefined' ? (localStorage.getItem(`nb_score_${track.id}`) || 0) : 0;
      const bestGrade = typeof localStorage !== 'undefined' ? (localStorage.getItem(`nb_grade_${track.id}`) || '—') : '—';

      const card = document.createElement('div');
      card.className = `track-card ${idx === this.selectedTrackIndex ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="track-info-left">
          <span class="track-badge" style="background: ${track.themeColor}; color: black;">${track.badge}</span>
          <div>
            <div class="track-title">${track.title[lang] || track.title.en}</div>
            <div class="track-meta">⚡ ${track.bpm} BPM · ⏱️ ${track.duration}s</div>
          </div>
        </div>
        <div class="track-info-right">
          <div class="track-best">🏆 ${Number(bestScore).toLocaleString()} (${bestGrade})</div>
          <button class="btn-play-track">${i18n.t('startSongBtn')}</button>
        </div>
      `;

      card.querySelector('.btn-play-track').addEventListener('click', () => {
        this.selectedTrackIndex = idx;
        this.startTrack(idx);
      });

      this.ui.trackListContainer.appendChild(card);
    });
  }

  showTrackSelect() {
    this.state = 'TRACK_SELECT';
    neonAudio.stopSong();
    if (this.ui.gameplayView) this.ui.gameplayView.style.display = 'none';
    if (this.ui.trackSelectView) this.ui.trackSelectView.style.display = 'flex';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';
    this.renderTrackSelection();
  }

  startTrack(idx) {
    neonAudio.ensureContext();
    this.selectedTrackIndex = idx;
    const track = TRACK_LIST[idx];

    this.state = 'PLAYING';
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.multiplier = 1;
    this.feverGauge = 0;
    this.songTime = 0;

    this.stats = { perfect: 0, great: 0, good: 0, miss: 0, totalNotes: 0 };
    this.notes = generateBeatmap(track);
    this.stats.totalNotes = this.notes.length;

    if (this.ui.trackSelectView) this.ui.trackSelectView.style.display = 'none';
    if (this.ui.gameplayView) this.ui.gameplayView.style.display = 'flex';
    if (this.ui.endModal) this.ui.endModal.style.display = 'none';

    this.updateHUD();
    neonAudio.startSong(track.id, track.bpm);
  }

  // Slicing via Keyboard Hotkey
  triggerKeySlice(bladeType, lane) {
    const isBlue = bladeType === 'BLUE';
    const hitZoneY = this.height * 0.78;
    const hitLaneX = this.getLaneX(lane, 1.0);

    // Add visual slice slash
    this.slicer.addPoint(hitLaneX - 40, hitZoneY + 20, isBlue);
    this.slicer.addPoint(hitLaneX + 40, hitZoneY - 20, isBlue);

    // Search closest note in lane near hit zone
    const targetNote = this.notes.find(n => !n.hit && !n.missed && n.lane === lane && Math.abs(n.time - this.songTime) < 0.25);
    if (targetNote) {
      this.judgeHit(targetNote, targetNote.time - this.songTime, hitLaneX, hitZoneY, isBlue);
    }
  }

  // Slicing via Mouse / Touch Drag
  checkPointerSlice(x1, y1, x2, y2, isBlue) {
    const hitZoneY = this.height * 0.78;

    this.notes.forEach(note => {
      if (note.hit || note.missed) return;

      const progress = 1.0 - (note.time - this.songTime) / 1.5;
      if (progress < 0.7 || progress > 1.25) return;

      const noteX = this.getLaneX(note.lane, progress);
      const noteY = this.getLaneY(progress);
      const noteSize = 20 + progress * 32;

      if (this.slicer.checkSlice(x1, y1, x2, y2, noteX, noteY, noteSize)) {
        if (note.type === 'BOMB') {
          // Hit a hazard bomb!
          note.hit = true;
          this.combo = 0;
          this.multiplier = 1;
          this.feverGauge = 0;
          neonAudio.playMiss();
          this.particles.spawnSliceSparks(noteX, noteY, '#ef4444', 25);
          this.particles.spawnRating(noteX, noteY, '💥 BOMB -500', '#ef4444');
          this.score = Math.max(0, this.score - 500);
          this.updateHUD();
        } else {
          const expectedType = note.type;
          const matchedBlade = (expectedType === 'BLUE' && isBlue) || (expectedType === 'RED' && !isBlue);
          if (matchedBlade) {
            const timeDiff = note.time - this.songTime;
            this.judgeHit(note, timeDiff, noteX, noteY, isBlue);
          }
        }
      }
    });
  }

  judgeHit(note, timeDiff, x, y, isBlue) {
    note.hit = true;
    const absDiff = Math.abs(timeDiff);

    let pts = 0;
    let text = 'GOOD';
    let color = '#38bdf8';

    if (absDiff < 0.08) {
      pts = 1000;
      text = 'PERFECT!';
      color = '#facc15';
      this.stats.perfect++;
    } else if (absDiff < 0.15) {
      pts = 600;
      text = 'GREAT!';
      color = '#00f0ff';
      this.stats.great++;
    } else {
      pts = 300;
      text = 'GOOD';
      color = '#38bdf8';
      this.stats.good++;
    }

    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;

    // Multipliers & Fever Meter
    if (this.combo > 40) {
      this.multiplier = 8;
      this.feverGauge = 100;
    } else if (this.combo > 20) {
      this.multiplier = 4;
      this.feverGauge = (this.combo / 40) * 100;
    } else if (this.combo > 10) {
      this.multiplier = 2;
      this.feverGauge = (this.combo / 40) * 100;
    } else {
      this.multiplier = 1;
      this.feverGauge = (this.combo / 40) * 100;
    }

    if (this.combo === 40) {
      neonAudio.playFeverChime();
    }

    this.score += pts * this.multiplier;

    // Play Sound & Spawn VFX
    if (isBlue) neonAudio.playSliceBlue();
    else neonAudio.playSliceRed();

    const noteColor = note.type === 'BLUE' ? '#00f0ff' : '#ec4899';
    this.slicer.spawnSplitBlock(x, y, 40, noteColor);
    this.particles.spawnSliceSparks(x, y, noteColor, 20);
    this.particles.spawnRating(x, y, `${text} +${pts * this.multiplier}`, color);

    this.updateHUD();
  }

  handleMiss(note) {
    note.missed = true;
    this.combo = 0;
    this.multiplier = 1;
    this.feverGauge = 0;
    this.stats.miss++;

    const noteX = this.getLaneX(note.lane, 1.1);
    const noteY = this.getLaneY(1.1);
    neonAudio.playMiss();
    this.particles.spawnRating(noteX, noteY, 'MISS', '#94a3b8');
    this.updateHUD();
  }

  getLaneX(lane, progress) {
    const horizonX = this.width / 2;
    const laneSpreads = [-220, -75, 75, 220];
    const baseOffset = laneSpreads[lane];
    return horizonX + baseOffset * progress;
  }

  getLaneY(progress) {
    const horizonY = this.height * 0.32;
    return horizonY + (this.height - horizonY) * progress;
  }

  updateHUD() {
    if (this.ui.scoreDisplay) this.ui.scoreDisplay.innerText = this.score.toLocaleString();
    if (this.ui.comboDisplay) this.ui.comboDisplay.innerText = `${this.combo}x`;
    if (this.ui.multiplierDisplay) this.ui.multiplierDisplay.innerText = `x${this.multiplier}`;
    if (this.ui.feverFill) this.ui.feverFill.style.width = `${Math.min(100, this.feverGauge)}%`;
  }

  calculateGrade() {
    const totalHit = this.stats.perfect + this.stats.great + this.stats.good;
    const accuracy = this.stats.totalNotes > 0 ? (totalHit / this.stats.totalNotes) * 100 : 0;

    if (accuracy >= 96 && this.stats.miss === 0) return 'SSS';
    if (accuracy >= 90) return 'S';
    if (accuracy >= 80) return 'A';
    if (accuracy >= 70) return 'B';
    return 'C';
  }

  finishTrack() {
    this.state = 'RESULTS';
    neonAudio.stopSong();

    const track = TRACK_LIST[this.selectedTrackIndex];
    const grade = this.calculateGrade();

    // Save High Score
    const savedBest = Number(localStorage.getItem(`nb_score_${track.id}`) || 0);
    if (this.score > savedBest) {
      localStorage.setItem(`nb_score_${track.id}`, this.score);
      localStorage.setItem(`nb_grade_${track.id}`, grade);
    }

    if (this.ui.gradeDisplay) this.ui.gradeDisplay.innerText = grade;
    if (this.ui.resultScore) this.ui.resultScore.innerText = this.score.toLocaleString();
    if (this.ui.resultMaxCombo) this.ui.resultMaxCombo.innerText = `${this.maxCombo}x`;
    if (this.ui.resultPerfect) this.ui.resultPerfect.innerText = this.stats.perfect;
    if (this.ui.resultGreat) this.ui.resultGreat.innerText = this.stats.great;
    if (this.ui.resultGood) this.ui.resultGood.innerText = this.stats.good;
    if (this.ui.resultMiss) this.ui.resultMiss.innerText = this.stats.miss;

    if (this.ui.endModal) this.ui.endModal.style.display = 'flex';
  }

  loop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    if (this.state === 'PLAYING') {
      this.songTime += dt;
      const track = TRACK_LIST[this.selectedTrackIndex];

      // Check track completion
      if (this.songTime >= track.duration + 2.0) {
        this.finishTrack();
      }

      this.slicer.update(dt);
      this.particles.update(dt);

      // Check missed notes
      this.notes.forEach(n => {
        if (!n.hit && !n.missed && n.type !== 'BOMB' && this.songTime - n.time > 0.35) {
          this.handleMiss(n);
        }
      });

      // Render Frame
      if (this.ctx) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        // 1. Synthwave Horizon & Grid
        this.particles.drawBackground(this.width, this.height, timestamp / 1000, this.multiplier >= 8);

        // 2. Hit Target Zone Guide Line
        const hitY = this.getLaneY(1.0);
        ctx.strokeStyle = this.multiplier >= 8 ? '#ec4899' : 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(30, hitY);
        ctx.lineTo(this.width - 30, hitY);
        ctx.stroke();

        // 3. Draw Approaching Rhythm Cubes
        this.notes.forEach(n => {
          if (n.hit || n.missed) return;

          const progress = 1.0 - (n.time - this.songTime) / 1.5;
          if (progress < 0.05 || progress > 1.25) return;

          const nx = this.getLaneX(n.lane, progress);
          const ny = this.getLaneY(progress);
          const size = 12 + progress * 32;

          ctx.save();
          ctx.translate(nx, ny);

          if (n.type === 'BOMB') {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.floor(size * 0.7)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💣', 0, 0);
          } else {
            const isBlue = n.type === 'BLUE';
            const color = isBlue ? '#00f0ff' : '#ec4899';
            ctx.fillStyle = color;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10 * progress;

            ctx.beginPath();
            ctx.roundRect(-size / 2, -size / 2, size, size, 6);
            ctx.fill();
            ctx.stroke();

            // Inner directional chevron
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.floor(size * 0.6)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isBlue ? '◀' : '▶', 0, 0);
          }

          ctx.restore();
        });

        // 4. Draw Blade Slicing Trails & Broken Block Halves
        this.slicer.draw();

        // 5. Draw Particles, Rings & Rating Popups
        this.particles.draw();
      }
    }

    requestAnimationFrame(this.loop);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    new NeonBeatGame();
    i18n.applyTranslations();
  });
}
