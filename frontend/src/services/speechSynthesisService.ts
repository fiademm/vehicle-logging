class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
  }

  public speak(text: string, onStart?: () => void, onEnd?: () => void): void {
    if (!this.synth) {
      console.error("Speech synthesis not supported.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = this.voices.find(voice => voice.name.includes('Google') && voice.lang.startsWith('en'));
    utterance.voice = selectedVoice || this.voices[0];
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (onStart) {
        onStart();
      }
    };

    utterance.onend = () => {
      if (onEnd) {
        onEnd();
      }
    };

    this.synth.speak(utterance);
  }

  public cancel(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechSynthesisService = new SpeechSynthesisService();