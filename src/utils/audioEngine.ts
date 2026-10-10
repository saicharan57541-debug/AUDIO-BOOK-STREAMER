// Client-side Audio Engine handling HTTP 206 streaming and procedural ambient sound generation

class AmbientSoundEngine {
  private audioCtx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private currentType: string = 'none';

  private init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setAmbient(type: 'none' | 'rain' | 'fireplace' | 'vinyl' | 'library', volume: number = 0.3) {
    if (type === this.currentType && type === 'none') return;
    this.stop();
    this.currentType = type;
    if (type === 'none') return;

    this.init();
    if (!this.audioCtx) return;

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    this.gainNode.connect(this.audioCtx.destination);

    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'rain') {
      // Pink/Brown noise with low-pass filter
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    } else if (type === 'fireplace') {
      // Crackle & low rumble
      for (let i = 0; i < bufferSize; i++) {
        const isCrackle = Math.random() < 0.003;
        data[i] = isCrackle ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 0.1 - 0.05);
      }
    } else if (type === 'vinyl') {
      // High-frequency subtle dust pops and warm hiss
      for (let i = 0; i < bufferSize; i++) {
        const isPop = Math.random() < 0.001;
        data[i] = isPop ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 0.03 - 0.015);
      }
    } else if (type === 'library') {
      // Very soft room tone / air circulation
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.005 * white) / 1.005;
        last = data[i];
        data[i] *= 2.0;
      }
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter to warm up sound
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = type === 'rain' ? 'lowpass' : type === 'fireplace' ? 'bandpass' : 'lowpass';
    filter.frequency.value = type === 'rain' ? 800 : type === 'fireplace' ? 400 : 1200;

    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();
    this.noiseNode = source;
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioCtx.currentTime);
    }
  }

  public stop() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch {
        // ignore if already stopped
      }
      this.noiseNode = null;
    }
    this.currentType = 'none';
  }
}

export const ambientEngine = new AmbientSoundEngine();
