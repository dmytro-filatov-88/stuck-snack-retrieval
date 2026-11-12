/**
 * Stuck Snack Retrieval — Core Application Logic
 * Pure Vanilla JavaScript & Procedural Web Audio API
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. PROCEDURAL AUDIO ENGINE (Web Audio API)
  // ==========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isMuted = false;
      this.alarmOscs = [];
      this.alarmInterval = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(
          this.isMuted ? 0 : 0.6,
          this.ctx.currentTime,
          0.02
        );
      }
      return !this.isMuted;
    }

    // Helper: Noise Buffer Generator
    createNoiseBuffer(duration = 0.5) {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }

    // 1. Meaty Hip-Check Thud (Pitch Drop 808 + lowpass impact)
    playHipCheck() {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      // Sub-Bass Kick
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.35);

      oscGain.gain.setValueAtTime(1.0, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.4);

      // Thud Body Noise
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(0.2);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(t);
      noise.stop(t + 0.2);
    }

    // 2. Glass Palm Strike (Sharp high click + glass resonance)
    playPalmStrike() {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      // Glass Ping Osc
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);

      oscGain.gain.setValueAtTime(0.5, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.18);

      // Slap noise
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(0.08);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(3, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(t);
      noise.stop(t + 0.08);
    }

    // 3. Forward Tilt Mechanical Groan
    playTiltCreak() {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(85, t);
      osc.frequency.linearRampToValueAtTime(110, t + 0.25);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.55);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.55);
    }

    // 4. Coin Return Clink & Jiggle
    playJiggle() {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      // Play 3 rapid metallic bell pings
      const freqs = [3100, 4200, 5100];
      freqs.forEach((freq, idx) => {
        const offset = idx * 0.035;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 200 - 100), t + offset);

        gain.gain.setValueAtTime(0.35, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + offset);
        osc.stop(t + offset + 0.09);
      });
    }

    // 5. Foil Bag Crinkle
    playCrinkle() {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(0.12);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3500, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(t);
      noise.stop(t + 0.12);
    }

    // 6. Broom Poke
    playBroomPoke() {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.2);

      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.2);
    }

    // 7. Security Alarm Siren (WEE-WOO Warble)
    startAlarmSiren() {
      if (this.isMuted || !this.ctx || this.alarmInterval) return;

      let high = false;
      const playChirp = () => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const startFreq = high ? 650 : 920;
        const endFreq = high ? 920 : 650;
        high = !high;

        osc.frequency.setValueAtTime(startFreq, t);
        osc.frequency.linearRampToValueAtTime(endFreq, t + 0.24);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, t);

        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.05, t + 0.24);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.25);
      };

      playChirp();
      this.alarmInterval = setInterval(playChirp, 260);
    }

    stopAlarmSiren() {
      if (this.alarmInterval) {
        clearInterval(this.alarmInterval);
        this.alarmInterval = null;
      }
    }

    // 8. Steel Shutter Slam Down
    playShutterSlam() {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      // Heavy clang
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.5);

      gain.gain.setValueAtTime(0.9, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.5);

      // Crash noise
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(0.4);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(1.0, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(t);
      noise.stop(t + 0.4);
    }

    // 9. Triumphant Fanfare for Snack Liberation
    playVictory() {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [
        { f: 261.63, d: 0.12, off: 0 },    // C4
        { f: 329.63, d: 0.12, off: 0.12 }, // E4
        { f: 392.00, d: 0.12, off: 0.24 }, // G4
        { f: 523.25, d: 0.4,  off: 0.36 }, // C5
        { f: 659.25, d: 0.6,  off: 0.55 }, // E5
        { f: 783.99, d: 0.8,  off: 0.75 }  // G5
      ];

      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t + n.off);

        gain.gain.setValueAtTime(0.4, t + n.off);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.off + n.d);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t + n.off);
        osc.stop(t + n.off + n.d);
      });
    }

    // 10. Keypad Beep
    playKeypadBeep(freq = 1200) {
      if (this.isMuted || !this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.08);
    }
  }

  // ==========================================================================
  // 2. STATE & CONFIGURATION
  // ==========================================================================
  const sound = new SoundEngine();

  const state = {
    gripMm: 0.99,
    initialGripMm: 0.99,
    swayAngle: 0,
    swayVelocity: 0,
    seismicLevel: 0, // 0 to 100%
    isLockdown: false,
    lockdownTimer: 10,
    lockdownInterval: null,
    liberatedCount: parseInt(localStorage.getItem('bored_ai_liberated_snacks') || '0', 10),
    keypadBuffer: 'B3',
    snackName: "FLAMIN' JALAPEÑO CRISPS",
    snackArt: "🌶️🥔✨"
  };

  const SNACK_VARIANTS = [
    { name: "FLAMIN' JALAPEÑO CRISPS", art: "🌶️🥔✨", initialMm: 0.99, bagClass: "flamin-chips" },
    { name: "QUANTUM CHEESE PUFFS", art: "🧀⚛️✨", initialMm: 1.15, bagClass: "cheese-puffs" },
    { name: "SALTED DISAPPOINTMENT NUTS", art: "🥜😭✨", initialMm: 0.85, bagClass: "salted-nuts" },
    { name: "CRUNCHY EXISTENTIAL VOID", art: "🌌🍫✨", initialMm: 1.05, bagClass: "void-crunch" }
  ];

  // DOM Elements
  const el = {
    wrapper: document.getElementById('machine-wrapper'),
    glassCabinet: document.getElementById('glass-cabinet'),
    glassSmudges: document.getElementById('glass-smudges'),
    snackPhysicsRig: document.getElementById('snack-physics-rig'),
    stuckSnack: document.getElementById('stuck-snack'),
    fallingSnackClone: document.getElementById('falling-snack-clone'),
    deliveryFlap: document.getElementById('delivery-flap'),
    securityShutter: document.getElementById('security-shutter'),
    lockdownCountdown: document.getElementById('lockdown-countdown'),
    btnResetAlarm: document.getElementById('btn-reset-alarm'),
    lcdGrip: document.getElementById('lcd-grip'),
    lcdShock: document.getElementById('lcd-shock'),
    lcdStatus: document.getElementById('lcd-status'),
    lcdLog: document.getElementById('lcd-log'),
    gaugeNeedle: document.getElementById('gauge-needle'),
    seismicPercent: document.getElementById('seismic-percent'),
    securityBadge: document.getElementById('security-badge'),
    scoreLiberated: document.getElementById('score-liberated'),
    btnSound: document.getElementById('btn-sound'),
    soundLabel: document.getElementById('sound-label'),
    btnHelp: document.getElementById('btn-help'),
    helpModal: document.getElementById('help-modal'),
    btnCloseHelp: document.getElementById('btn-close-help'),
    btnGotIt: document.getElementById('btn-gotIt'),
    victoryModal: document.getElementById('victory-modal'),
    btnGrabMore: document.getElementById('btn-grab-more'),
    btnShareFlex: document.getElementById('btn-share-flex'),
    keypadDisplay: document.getElementById('keypad-display'),
    keyButtons: document.querySelectorAll('.key-btn'),
    btnHip: document.getElementById('btn-hip'),
    btnPalm: document.getElementById('btn-palm'),
    btnTilt: document.getElementById('btn-tilt'),
    btnJiggle: document.getElementById('btn-jiggle'),
    btnBroom: document.getElementById('btn-broom'),
    changePocket: document.getElementById('change-pocket'),
    ledPips: document.querySelectorAll('.led-pip')
  };

  // ==========================================================================
  // 3. PHYSICS & RENDERING LOOP
  // ==========================================================================
  let lastTime = performance.now();

  function updatePhysics(currentTime) {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    if (!state.isLockdown) {
      // 1. Natural Seismic Cooldown (~7% per second)
      if (state.seismicLevel > 0) {
        state.seismicLevel = Math.max(0, state.seismicLevel - 7.5 * dt);
      }

      // 2. Bag Pendulum Spring Physics
      const springK = 28.0;   // Restoring force
      const damping = 4.2;    // Air damping
      const acceleration = -springK * state.swayAngle - damping * state.swayVelocity;
      state.swayVelocity += acceleration * dt;
      state.swayAngle += state.swayVelocity * dt;

      // Render Bag Rotation
      if (el.snackPhysicsRig) {
        el.snackPhysicsRig.style.transform = `rotate(${state.swayAngle.toFixed(2)}deg)`;
      }
    }

    // 3. Update Gauge Needle (-55deg to +55deg)
    const normalizedSeismic = Math.min(100, Math.max(0, state.seismicLevel));
    const needleDeg = -55 + (normalizedSeismic / 100) * 110;
    if (el.gaugeNeedle) {
      el.gaugeNeedle.style.transform = `rotate(${needleDeg.toFixed(1)}deg)`;
    }
    if (el.seismicPercent) {
      el.seismicPercent.textContent = `${Math.round(normalizedSeismic)}%`;
    }

    // 4. Update LED Pips
    const activePipsCount = Math.round((normalizedSeismic / 100) * el.ledPips.length);
    el.ledPips.forEach((pip, idx) => {
      if (idx < activePipsCount) {
        pip.classList.add('active');
      } else {
        pip.classList.remove('active');
      }
    });

    requestAnimationFrame(updatePhysics);
  }

  // ==========================================================================
  // 4. INTERACTION TACTICS & GAME ACTIONS
  // ==========================================================================

  function addSeismicDisturbance(amount) {
    if (state.isLockdown) return;
    state.seismicLevel = Math.min(105, state.seismicLevel + amount);

    if (state.seismicLevel >= 100) {
      triggerLockdown();
    }
  }

  function reduceGrip(amount, actionName) {
    if (state.isLockdown || state.gripMm <= 0) return;

    sound.init();
    state.gripMm = Math.max(0, state.gripMm - amount);
    el.lcdGrip.textContent = `${state.gripMm.toFixed(2)} mm`;

    // Shock log feedback
    const shockG = (amount * 12 + Math.random() * 0.8).toFixed(1);
    el.lcdShock.textContent = `${shockG} G`;

    if (state.gripMm <= 0) {
      liberateSnack();
    } else {
      sound.playCrinkle();
      if (state.gripMm < 0.25) {
        el.lcdStatus.textContent = 'HANGING BY ATOM';
        el.lcdStatus.className = 'm-val text-red';
        logMsg(`> CRITICAL: Only ${state.gripMm.toFixed(2)}mm remaining!`);
      } else {
        logMsg(`> ${actionName}: loosened by ${amount.toFixed(2)}mm`);
      }
    }
  }

  function logMsg(text) {
    if (el.lcdLog) {
      el.lcdLog.textContent = text;
    }
  }

  // Action 1: Hip-Check
  function doHipCheck() {
    if (state.isLockdown || state.gripMm <= 0) return;
    sound.init();
    sound.playHipCheck();

    // Trigger Heavy Shake
    el.wrapper.classList.remove('shake-heavy', 'shake-light', 'machine-tilt');
    void el.wrapper.offsetWidth; // reflow
    el.wrapper.classList.add('shake-heavy');

    // Swing bag hard
    state.swayVelocity += (Math.random() > 0.5 ? 1 : -1) * (24 + Math.random() * 12);

    addSeismicDisturbance(28 + Math.random() * 8);
    reduceGrip(0.22 + Math.random() * 0.15, 'HIP-CHECK');
  }

  // Action 2: Palm Strike (on Glass)
  function doPalmStrike(clientX, clientY) {
    if (state.isLockdown || state.gripMm <= 0) return;
    sound.init();
    sound.playPalmStrike();

    // Light shake
    el.wrapper.classList.remove('shake-heavy', 'shake-light', 'machine-tilt');
    void el.wrapper.offsetWidth;
    el.wrapper.classList.add('shake-light');

    // Spawn finger smudge if coordinates given
    if (clientX && clientY && el.glassCabinet) {
      const rect = el.glassCabinet.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      spawnSmudge(x, y);
    } else {
      spawnSmudge(160 + Math.random() * 100, 180 + Math.random() * 100);
    }

    state.swayVelocity += (Math.random() > 0.5 ? 1 : -1) * (14 + Math.random() * 6);
    addSeismicDisturbance(12 + Math.random() * 5);
    reduceGrip(0.10 + Math.random() * 0.08, 'PALM STRIKE');
  }

  function spawnSmudge(x, y) {
    const mark = document.createElement('div');
    mark.className = 'smudge-mark';
    mark.style.left = `${x}px`;
    mark.style.top = `${y}px`;
    el.glassSmudges.appendChild(mark);
    setTimeout(() => {
      mark.remove();
    }, 2000);
  }

  // Action 3: Forward Machine Tilt
  function doForwardTilt() {
    if (state.isLockdown || state.gripMm <= 0) return;
    sound.init();
    sound.playTiltCreak();

    el.wrapper.classList.remove('shake-heavy', 'shake-light', 'machine-tilt');
    void el.wrapper.offsetWidth;
    el.wrapper.classList.add('machine-tilt');

    // Heavy forward surge
    state.swayVelocity += 35;
    addSeismicDisturbance(50 + Math.random() * 12); // High alarm penalty!
    reduceGrip(0.38 + Math.random() * 0.22, 'FORWARD TILT');
  }

  // Action 4: Coin Jiggle
  function doCoinJiggle() {
    if (state.isLockdown || state.gripMm <= 0) return;
    sound.init();
    sound.playJiggle();

    // Subtle vibration
    state.swayVelocity += (Math.random() > 0.5 ? 1 : -1) * 6;
    addSeismicDisturbance(4 + Math.random() * 3);
    reduceGrip(0.04 + Math.random() * 0.03, 'COIN JIGGLE');
  }

  // Easter Egg: Broom Poke
  function doBroomPoke() {
    if (state.isLockdown || state.gripMm <= 0) return;
    sound.init();
    sound.playBroomPoke();

    // Open flap slightly
    el.deliveryFlap.classList.add('flap-open');
    setTimeout(() => el.deliveryFlap.classList.remove('flap-open'), 400);

    state.swayVelocity += (Math.random() > 0.5 ? 1 : -1) * 16;
    addSeismicDisturbance(18 + Math.random() * 6);
    reduceGrip(0.18 + Math.random() * 0.12, 'BROOM POKE');
  }

  // ==========================================================================
  // 5. SECURITY LOCKDOWN SYSTEM
  // ==========================================================================
  function triggerLockdown() {
    state.isLockdown = true;
    sound.playShutterSlam();
    sound.startAlarmSiren();

    document.body.classList.add('alarm-active');
    el.securityShutter.classList.add('shutter-slammed');
    el.securityBadge.textContent = 'LOCKDOWN';
    el.securityBadge.className = 'stat-badge badge-red';
    el.lcdStatus.textContent = 'FACILITY ALARM!';
    el.lcdStatus.className = 'm-val text-red';
    logMsg('> ALARM TRIGGERED! POLICE EN ROUTE.');

    state.lockdownTimer = 10;
    el.lockdownCountdown.textContent = state.lockdownTimer;

    if (state.lockdownInterval) clearInterval(state.lockdownInterval);
    state.lockdownInterval = setInterval(() => {
      state.lockdownTimer--;
      el.lockdownCountdown.textContent = state.lockdownTimer;
      if (state.lockdownTimer <= 0) {
        resetLockdown();
      }
    }, 1000);
  }

  function resetLockdown() {
    if (state.lockdownInterval) clearInterval(state.lockdownInterval);
    state.lockdownInterval = null;
    sound.stopAlarmSiren();

    document.body.classList.remove('alarm-active');
    el.securityShutter.classList.remove('shutter-slammed');

    state.isLockdown = false;
    state.seismicLevel = 0;
    el.securityBadge.textContent = 'ARMED';
    el.securityBadge.className = 'stat-badge badge-green';
    el.lcdStatus.textContent = 'NOMINAL';
    el.lcdStatus.className = 'm-val text-yellow';
    logMsg('> BREAKER RESET. SYSTEM NORMALIZED.');
  }

  // ==========================================================================
  // 6. VICTORY & SNACK LIBERATION
  // ==========================================================================
  function liberateSnack() {
    state.gripMm = 0;
    el.lcdGrip.textContent = '0.00 mm';
    el.lcdStatus.textContent = 'DROPPING!';
    el.lcdStatus.className = 'm-val text-green';
    logMsg('> SNACK DISLODGED! IT IS FREE!');

    // Hide hanging bag
    if (el.stuckSnack) {
      el.stuckSnack.style.visibility = 'hidden';
    }

    // Trigger falling clone animation
    if (el.fallingSnackClone) {
      el.fallingSnackClone.classList.add('fall-animation');
    }

    // Flap pushes open
    setTimeout(() => {
      el.deliveryFlap.classList.add('flap-open');
    }, 450);

    setTimeout(() => {
      sound.playVictory();
      state.liberatedCount++;
      localStorage.setItem('bored_ai_liberated_snacks', state.liberatedCount.toString());
      el.scoreLiberated.textContent = state.liberatedCount;

      // Confetti burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.65 }
        });
      }

      // Show Victory Modal
      setTimeout(() => {
        el.victoryModal.classList.add('active');
      }, 700);

    }, 600);
  }

  function resetForNextSnack() {
    el.victoryModal.classList.remove('active');
    if (el.fallingSnackClone) {
      el.fallingSnackClone.classList.remove('fall-animation');
    }
    el.deliveryFlap.classList.remove('flap-open');

    // Pick a random snack variant
    const variant = SNACK_VARIANTS[Math.floor(Math.random() * SNACK_VARIANTS.length)];
    state.snackName = variant.name;
    state.snackArt = variant.art;
    state.gripMm = variant.initialMm;
    state.initialGripMm = variant.initialMm;
    state.seismicLevel = 0;
    state.swayAngle = 0;
    state.swayVelocity = 0;

    if (el.stuckSnack) {
      el.stuckSnack.style.visibility = 'visible';
    }

    el.lcdGrip.textContent = `${state.gripMm.toFixed(2)} mm`;
    el.lcdStatus.textContent = 'SNACK AGONY';
    el.lcdStatus.className = 'm-val text-yellow';
    logMsg(`> NEW TARGET: ${variant.name} loaded.`);
  }

  // ==========================================================================
  // 7. KEYPAD & EASTER EGGS
  // ==========================================================================
  function handleKeyPress(key) {
    sound.init();
    sound.playKeypadBeep(900 + Math.random() * 400);

    if (key === '#') {
      state.keypadBuffer = '';
    } else if (key === '*') {
      state.keypadBuffer = 'B3';
    } else {
      if (state.keypadBuffer.length >= 4) {
        state.keypadBuffer = key;
      } else {
        state.keypadBuffer += key;
      }
    }

    el.keypadDisplay.textContent = state.keypadBuffer || '---';

    // Easter Egg Codes
    const buf = state.keypadBuffer;
    if (buf === '69') {
      logMsg('> [69] NICE. BUT SNACK IS STILL STUCK.');
    } else if (buf === '420') {
      logMsg('> [420] ACTIVATING HERBAL CHIP VIBES.');
      document.body.style.filter = 'hue-rotate(90deg)';
      setTimeout(() => document.body.style.filter = '', 3000);
    } else if (buf === '1337') {
      logMsg('> [1337] HACKER OVERRIDE: 0.3mm LOOSENED!');
      reduceGrip(0.3, 'HACKER BYPASS');
    } else if (buf === 'B3') {
      logMsg('> [B3] ITEM SELECTED: FLAMIN CHIPS (STUCK)');
    }
  }

  // ==========================================================================
  // 8. EVENT LISTENERS & INITIALIZATION
  // ==========================================================================
  function initEvents() {
    // Action Buttons
    el.btnHip.addEventListener('click', () => doHipCheck());
    el.btnPalm.addEventListener('click', (e) => doPalmStrike(e.clientX, e.clientY));
    el.btnTilt.addEventListener('click', () => doForwardTilt());
    el.btnJiggle.addEventListener('click', () => doCoinJiggle());
    el.btnBroom.addEventListener('click', () => doBroomPoke());
    el.changePocket.addEventListener('click', () => doCoinJiggle());

    // Glass Cabinet Click / Tap directly sends Palm Strike
    el.glassCabinet.addEventListener('click', (e) => {
      // Don't trigger if clicking shutter
      if (state.isLockdown) return;
      doPalmStrike(e.clientX, e.clientY);
    });

    // Reset Alarm Breaker button
    el.btnResetAlarm.addEventListener('click', () => resetLockdown());

    // Sound Toggle
    el.btnSound.addEventListener('click', () => {
      sound.init();
      const unmuted = sound.toggleMute();
      el.soundLabel.textContent = unmuted ? 'Audio ON' : 'Audio MUTED';
      el.btnSound.title = unmuted ? 'Sound is currently ON' : 'Sound is MUTED';
    });

    // Help Modal
    el.btnHelp.addEventListener('click', () => {
      el.helpModal.classList.add('active');
    });
    el.btnCloseHelp.addEventListener('click', () => {
      el.helpModal.classList.remove('active');
    });
    if (el.btnGotIt) {
      el.btnGotIt.addEventListener('click', () => {
        el.helpModal.classList.remove('active');
      });
    }

    // Victory Actions
    el.btnGrabMore.addEventListener('click', () => resetForNextSnack());
    el.btnShareFlex.addEventListener('click', () => {
      const text = `I just liberated the stuck bag of chips on Bored AI Web with 0.00mm left! Total Liberated: ${state.liberatedCount} 🥨💥`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        el.btnShareFlex.textContent = '✅ COPIED RECEIPT!';
        setTimeout(() => el.btnShareFlex.textContent = '📋 COPY VICTORY RECEIPT', 2000);
      }
    });

    // Keypad Matrix
    el.keyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        handleKeyPress(btn.getAttribute('data-key'));
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (el.helpModal.classList.contains('active') && e.key === 'Escape') {
        el.helpModal.classList.remove('active');
        return;
      }
      if (el.victoryModal.classList.contains('active') && (e.key === 'Escape' || e.key === 'Enter')) {
        resetForNextSnack();
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'h':
          doHipCheck();
          break;
        case 'g':
          doPalmStrike();
          break;
        case 't':
          doForwardTilt();
          break;
        case 'j':
          doCoinJiggle();
          break;
        case 'e':
          doBroomPoke();
          break;
        case 'm':
          el.btnSound.click();
          break;
        case '?':
        case '/':
          el.helpModal.classList.toggle('active');
          break;
      }
    });

    // Score setup
    el.scoreLiberated.textContent = state.liberatedCount;

    // First user gesture unlocks Web Audio
    const unlockAudio = () => {
      sound.init();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
  }

  // Start Application
  initEvents();
  requestAnimationFrame(updatePhysics);

})();
