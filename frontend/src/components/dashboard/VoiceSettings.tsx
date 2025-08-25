import React, { useState, useEffect, useCallback } from 'react';
import { commandPatterns } from '../../config/voiceCommands';
import VoiceAnalytics from './VoiceAnalytics';
import useVoiceSettings from '../../hooks/useVoiceSettings';
import MicTestModal from './MicTestModal';

const VoiceSettings = () => {
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [isMicTestModalOpen, setIsMicTestModalOpen] = useState(false);
  const { continuousListening, toggleContinuousListening } = useVoiceSettings();

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setIsMicTestModalOpen(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your browser permissions.');
    }
  };

  const stopMicTest = useCallback(() => {
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
    }
    setMicStream(null);
    setIsMicTestModalOpen(false);
  }, [micStream]);

  useEffect(() => {
    return () => {
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [micStream]);

  const groupedCommands = commandPatterns.reduce((acc, cmd) => {
    const group = acc[cmd.intent] || [];
    group.push(cmd.pattern.source.replace(/\(\.\*\)/g, '[vehicle]'));
    acc[cmd.intent] = group;
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Voice Configuration</h3>
        <div className="flex items-center justify-between">
          <span>Continuous Listening (Wake Word)</span>
          <button 
            onClick={toggleContinuousListening}
            className={`px-4 py-2 rounded-full text-white font-semibold ${
              continuousListening ? 'bg-green-500' : 'bg-gray-400'
            }`}>
            {continuousListening ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Microphone Test</h3>
        <div className="flex items-center space-x-4">
          <button 
            onClick={startMicTest}
            className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
          >
            Test Microphone
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Available Voice Commands</h3>
        <div className="space-y-4">
          {Object.entries(groupedCommands).map(([intent, patterns]) => (
            <div key={intent}>
              <h4 className="font-semibold capitalize">{intent}</h4>
              <ul className="list-disc list-inside pl-4 text-gray-600">
                {patterns.map((pattern, index) => (
                  <li key={index} className="italic">"{pattern}"</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <VoiceAnalytics />

      <MicTestModal 
        isOpen={isMicTestModalOpen}
        onClose={stopMicTest}
        micStream={micStream}
      />
    </div>
  );
};

export default VoiceSettings;