/**
 * Boss & HR Stealth Patrol AI System for Cyber Slacker
 * Handles footsteps, doorway shadows, suspicion buildup, and inspection trigger logic.
 */

import { slackerAudio } from './audio.js';

export const BOSS_ROSTER = [
  {
    id: 'BOB',
    name: 'Bob (Team Lead)',
    icon: '👨‍💼',
    warningDuration: 3.8, // Seconds of warning before inspecting
    inspectDuration: 2.8, // Seconds boss stands behind you
    intervalMin: 10,
    intervalMax: 16
  },
  {
    id: 'KAREN',
    name: 'Karen (Department Manager)',
    icon: '👩‍💼',
    warningDuration: 2.8,
    inspectDuration: 3.2,
    intervalMin: 8,
    intervalMax: 14
  },
  {
    id: 'LINDA',
    name: 'Linda (HR Compliance Director)',
    icon: '🕵️‍♀️',
    warningDuration: 2.2,
    inspectDuration: 3.5,
    intervalMin: 7,
    intervalMax: 12
  },
  {
    id: 'CEO',
    name: 'Big Boss (Executive CEO)',
    icon: '👑',
    warningDuration: 1.8,
    inspectDuration: 4.0,
    intervalMin: 6,
    intervalMax: 10
  }
];

export class StealthPatrolSystem {
  constructor(gameState) {
    this.game = gameState;
    this.state = 'CLEAR'; // 'CLEAR' | 'APPROACHING' | 'INSPECTING' | 'LEAVING'
    this.bossIndex = 0;
    this.currentBoss = BOSS_ROSTER[0];
    this.timer = 8; // countdown to next event
    this.suspicion = 0; // 0 to 100%
    this.warningTimeRemaining = 0;
    this.inspectTimeRemaining = 0;
    this.warningMultiplier = 1.0; // modified by Rearview Mirror
  }

  setBossLevel(levelIndex) {
    const idx = Math.min(levelIndex, BOSS_ROSTER.length - 1);
    this.bossIndex = idx;
    this.currentBoss = BOSS_ROSTER[idx];
    this.resetTimer();
  }

  resetTimer() {
    this.state = 'CLEAR';
    this.timer = this.currentBoss.intervalMin + Math.random() * (this.currentBoss.intervalMax - this.currentBoss.intervalMin);
    slackerAudio.stopFootsteps();
  }

  update(dt) {
    if (this.game.isGameOver || this.game.isVictory) return;

    if (this.state === 'CLEAR') {
      this.timer -= dt;
      if (this.timer <= 0) {
        // Trigger Approaching Warning!
        this.state = 'APPROACHING';
        this.warningTimeRemaining = this.currentBoss.warningDuration * this.warningMultiplier;
        slackerAudio.startFootsteps(this.bossIndex >= 2 ? 300 : 450);
        slackerAudio.playBossAlert();
      }
    } else if (this.state === 'APPROACHING') {
      this.warningTimeRemaining -= dt;

      // If player is slacking while boss is approaching, slowly build suspicion
      if (!this.game.isDisguised) {
        const mult = this.game ? this.game.suspicionRateMultiplier : 1.0;
        this.suspicion = Math.min(100, this.suspicion + dt * 15 * mult);
      }

      if (this.warningTimeRemaining <= 0) {
        // Boss arrives at cubicle!
        this.state = 'INSPECTING';
        this.inspectTimeRemaining = this.currentBoss.inspectDuration;
        slackerAudio.stopFootsteps();
        slackerAudio.playBossAlert();
      }
    } else if (this.state === 'INSPECTING') {
      this.inspectTimeRemaining -= dt;

      if (!this.game.isDisguised) {
        // CAUGHT SLACKING!
        this.suspicion = 100;
        this.game.handleBustedByBoss();
        return;
      }

      // If safely disguised
      if (this.inspectTimeRemaining <= 0) {
        // Boss leaves pleased
        this.state = 'LEAVING';
        this.suspicion = 0;
        this.game.handleBossInspectionPassed();
        setTimeout(() => {
          this.resetTimer();
        }, 1000);
      }
    }
  }
}
