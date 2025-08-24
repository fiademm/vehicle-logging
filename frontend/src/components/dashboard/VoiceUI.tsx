import React from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';

interface VoiceUIProps {
  isListening: boolean;
  isSpeaking: boolean;
  wakeWordDetected: boolean;
  onToggleListen: () => void;
}

const VoiceUI: React.FC<VoiceUIProps> = ({ 
  isListening, 
  isSpeaking, 
  wakeWordDetected, 
  onToggleListen 
}) => {
  const getButtonClass = () => {
    if (wakeWordDetected) {
      return 'bg-green-500';
    }
    if (isListening) {
      return 'bg-red-500';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleListen}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-colors duration-300 ${getButtonClass()} text-white shadow-lg hover:bg-opacity-90`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? <FiMicOff size={32} /> : <FiMic size={32} />}
          {isListening && !wakeWordDetected && (
            <div
              className={`absolute inset-0 rounded-full bg-red-400 animate-pulse`}
              style={{ animationDuration: '1.5s' }}
            />
          )}
          {wakeWordDetected && (
            <div
              className={`absolute inset-0 rounded-full bg-green-400 animate-pulse`}
              style={{ animationDuration: '1s' }}
            />
          )}
          {isSpeaking && (
            <div
              className={`absolute inset-0 rounded-full border-4 border-blue-400 animate-ping`}
              style={{ animationDuration: '1.2s' }}
            />
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500">Press 'v' to toggle mic</p>
    </div>
  );
};

export default VoiceUI;