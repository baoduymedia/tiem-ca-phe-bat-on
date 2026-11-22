/**
 * SoundManager — Synthesized Web Audio Engine for Tiệm Cà Phê Bất Ổn
 * 100% Offline, Zero Network Latency, Lightweight & Authentic
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
    } else {
      this.playBGM();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // ==========================================
  // 1. LO-FI SAIGON AMBIENT BGM (Warm Chords)
  // ==========================================
  public playBGM() {
    if (this.isMuted || this.isBgmPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isBgmPlaying = true;
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.06, ctx.currentTime);
    this.bgmGain.connect(ctx.destination);

    // Warm Lo-Fi chord progression (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
    const chords = [
      [349.23, 440.0, 523.25, 659.25], // Fmaj7
      [329.63, 392.0, 493.88, 587.33], // Em7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
    ];

    let chordIdx = 0;
    const loopChord = () => {
      if (!this.isBgmPlaying || !this.bgmGain || !this.ctx) return;

      const currentChord = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      currentChord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle'; // warm vintage tone
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

        osc.connect(gain);
        gain.connect(this.bgmGain!);
        osc.start();
        osc.stop(ctx.currentTime + 4.0);
        this.bgmOscillators.push(osc);
      });

      if (this.isBgmPlaying) {
        setTimeout(loopChord, 3600);
      }
    };

    loopChord();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    this.bgmOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.bgmOscillators = [];
    if (this.bgmGain) {
      try {
        this.bgmGain.disconnect();
      } catch {
        // ignore
      }
      this.bgmGain = null;
    }
  }

  // ==========================================
  // 2. STREET & VEHICLE SOUNDS
  // ==========================================
  /** Vintage Honda Cub / Dream "Tin Tin" Horn */
  public playHonk() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  /** Alias for street vendor chime */
  public playStreetVendor() {
    this.playStreetChime();
  }

  /** Street Megaphone Announcement Chime */
  public playStreetChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
    });
  }

  // ==========================================
  // 3. ASMR COFFEE BREWING SOUNDS
  // ==========================================
  /** Boiling Water Kettle Steam & Hiss */
  public playBoilingWater() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // white noise
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to sound like steaming kettle
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  /** Alias for boiling kettle sound */
  public playKettleBoil() {
    this.playBoilingWater();
  }

  /** Alias for water pour sound */
  public playWaterPour() {
    this.playBoilingWater();
  }

  /** Coffee Phin Dripping Drop "Tách..." */
  public playCoffeeDrip() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  /** Ice Cubes Clinking in Glass */
  public playIceClink() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    [2400, 3100, 3800].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.14);
    });
  }

  /** Spoon Stirring Inside Glass */
  public playSpoonStir() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(2200, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  /** Coin Ting "Ting Ting!" */
  public playCoinTing() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    [987.77, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0.14, ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + idx * 0.09 + 0.5);
    });
  }

  /** Camera Polaroid Shutter Click */
  public playCameraShutter() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // ==========================================
  // 4. ASMR PHASE 2 / GD2 PROCEDURAL SYNTHESIS
  // ==========================================

  /**
   * Cocktail / Tea Shaker Shaking ASMR (Trà chanh giã tay & trà đào)
   * Procedural rhythmic pulses of ice tumbling inside metal shaker
   */
  public playShakerShake() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // 4 quick rhythmic shake strokes
    const strokeOffsets = [0, 0.08, 0.16, 0.25];
    strokeOffsets.forEach((offset, idx) => {
      const startTime = ctx.currentTime + offset;
      const duration = 0.07;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for crisp ice against stainless steel
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(idx % 2 === 0 ? 1800 : 2200, startTime);
      filter.Q.setValueAtTime(3.5, startTime);

      // Metal container resonant clank
      const clankOsc = ctx.createOscillator();
      clankOsc.type = 'triangle';
      clankOsc.frequency.setValueAtTime(idx % 2 === 0 ? 620 : 740, startTime);
      clankOsc.frequency.exponentialRampToValueAtTime(280, startTime + duration);

      const clankGain = ctx.createGain();
      clankGain.gain.setValueAtTime(0.08, startTime);
      clankGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      clankOsc.connect(clankGain);
      clankGain.connect(ctx.destination);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(startTime);
      clankOsc.start(startTime);
      clankOsc.stop(startTime + duration);
    });
  }

  /**
   * Automatic Cup Sealing Machine ASMR (Máy dập màng ép ly)
   * Mechanical motor down-press, hot film sealing sizzle, and release click
   */
  public playCupSealer() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // 1. Mechanical motor press downward clunk
    const motorOsc = ctx.createOscillator();
    const motorGain = ctx.createGain();
    motorOsc.type = 'sawtooth';
    motorOsc.frequency.setValueAtTime(280, t);
    motorOsc.frequency.exponentialRampToValueAtTime(110, t + 0.18);

    motorGain.gain.setValueAtTime(0.14, t);
    motorGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    motorOsc.connect(motorGain);
    motorGain.connect(ctx.destination);
    motorOsc.start(t);
    motorOsc.stop(t + 0.22);

    // 2. Hot heating film sealing sizzle (filtered noise burst)
    const sizzleDuration = 0.28;
    const bufferSize = Math.floor(ctx.sampleRate * sizzleDuration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const sizzleFilter = ctx.createBiquadFilter();
    sizzleFilter.type = 'bandpass';
    sizzleFilter.frequency.setValueAtTime(3200, t + 0.12);
    sizzleFilter.Q.setValueAtTime(4.0, t + 0.12);

    const sizzleGain = ctx.createGain();
    sizzleGain.gain.setValueAtTime(0.001, t + 0.12);
    sizzleGain.gain.linearRampToValueAtTime(0.15, t + 0.18);
    sizzleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12 + sizzleDuration);

    noise.connect(sizzleFilter);
    sizzleFilter.connect(sizzleGain);
    sizzleGain.connect(ctx.destination);
    noise.start(t + 0.12);

    // 3. Release lever snap click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(1400, t + 0.38);
    clickOsc.frequency.setValueAtTime(320, t + 0.42);

    clickGain.gain.setValueAtTime(0.12, t + 0.38);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.46);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(t + 0.38);
    clickOsc.stop(t + 0.48);
  }

  /**
   * Electric Cream Whisk / Frother ASMR (Đánh bông kem muối béo)
   * Rapid soft swooshes & bubbling emulsion sound
   */
  public playCreamWhisk() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const duration = 0.55;

    // 1. Motor hum
    const motorOsc = ctx.createOscillator();
    const motorGain = ctx.createGain();
    motorOsc.type = 'triangle';
    motorOsc.frequency.setValueAtTime(160, t);
    motorOsc.frequency.linearRampToValueAtTime(220, t + 0.15);
    motorOsc.frequency.linearRampToValueAtTime(180, t + duration);

    motorGain.gain.setValueAtTime(0.05, t);
    motorGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    motorOsc.connect(motorGain);
    motorGain.connect(ctx.destination);
    motorOsc.start(t);
    motorOsc.stop(t + duration);

    // 2. Thick emulsion swirling noise with rapid modulation
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.6;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(850, t);
    lowpass.Q.setValueAtTime(3.0, t);

    // Tremolo LFO for swirling whirring bubbles
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(14, t);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    lfo.connect(noiseGain.gain);
    noise.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(t);
    lfo.start(t);
    lfo.stop(t + duration);
  }

  /**
   * Urban Order / Police Patrol Siren Alert (Còi xe trật tự đô thị)
   * Alternating two-tone pitch sweep warning
   */
  public playSirenAlert() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, t);

    // Sweeping siren frequencies
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.linearRampToValueAtTime(960, t + 0.3);
    osc.frequency.linearRampToValueAtTime(650, t + 0.6);
    osc.frequency.linearRampToValueAtTime(960, t + 0.9);
    osc.frequency.linearRampToValueAtTime(650, t + 1.2);
    osc.frequency.linearRampToValueAtTime(960, t + 1.5);
    osc.frequency.linearRampToValueAtTime(500, t + 1.8);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.1);
    gain.gain.setValueAtTime(0.14, t + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 1.9);
  }
}

export const SoundManager = new SoundEngine();
