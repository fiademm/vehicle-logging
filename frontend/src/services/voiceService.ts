interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionError) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

interface VoiceRecognitionCallbacks {
  onStart: () => void;
  onEnd: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean;
  private listening = false;

  constructor() {
    const SpeechRecognitionImpl = (window as unknown as WindowWithSpeechRecognition).SpeechRecognition || (window as unknown as WindowWithSpeechRecognition).webkitSpeechRecognition;
    if (SpeechRecognitionImpl) {
      this.recognition = new SpeechRecognitionImpl();
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.isSupported = true;
    } else {
      this.isSupported = false;
    }
  }

  public supported(): boolean {
    return this.isSupported;
  }

  public isListening(): boolean {
    return this.listening;
  }

  public start(callbacks: VoiceRecognitionCallbacks): void {
    if (!this.isSupported || !this.recognition) {
      callbacks.onError('Speech recognition is not supported.');
      return;
    }

    this.recognition.onstart = () => {
      this.listening = true;
      callbacks.onStart();
    };
    this.recognition.onend = () => {
      this.listening = false;
      callbacks.onEnd();
    };
    this.recognition.onerror = (event: SpeechRecognitionError) => callbacks.onError(event.error);
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.trim();
      const isFinal = event.results[last].isFinal;
      callbacks.onResult(transcript, isFinal);
    };

    if (!this.listening) {
      this.recognition.start();
    }
  }

  public stop(): void {
    if (this.recognition && this.listening) {
      this.recognition.stop();
    }
  }
}

export const voiceService = new VoiceRecognitionService();