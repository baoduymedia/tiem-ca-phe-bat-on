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
}

export const SoundManager = new SoundEngine();
