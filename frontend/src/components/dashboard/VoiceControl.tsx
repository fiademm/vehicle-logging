import React from 'react';
import VoiceUI from './VoiceUI';
import { useKeyPress } from '../../hooks/useKeyPress';
import { voiceService } from '../../services/voiceService';
import useHapticFeedback from '../../hooks/useHapticFeedback';

interface VoiceControlProps {
  onCommand: (command: string) => void;
  isSpeaking: boolean;
  isListening: boolean;
  wakeWordDetected: boolean;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ 
  isSpeaking, 
  isListening, 
  wakeWordDetected 
}) => {
  const triggerFeedback = useHapticFeedback();

  const handleToggleListening = () => {
    triggerFeedback();
    if (isListening) {
      voiceService.stop();
    } else {
      voiceService.start({});
    }
  };

  useKeyPress('v', handleToggleListening);

  return (
    <VoiceUI
      isListening={isListening}
      isSpeaking={isSpeaking}
      wakeWordDetected={wakeWordDetected}
      onToggleListen={handleToggleListening}
    />
  );
};

export default VoiceControl;