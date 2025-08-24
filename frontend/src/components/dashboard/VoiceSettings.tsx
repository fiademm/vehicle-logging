import React, { useState, useEffect, useRef, useCallback } from 'react';
import { commandPatterns } from '../../config/voiceCommands';
import VoiceAnalytics from './VoiceAnalytics';
import useVoiceSettings from '../../hooks/useVoiceSettings';

const VoiceSettings = () => {
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const { continuousListening, toggleContinuousListening } = useVoiceSettings();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const visualizerRef = useRef<HTMLCanvasElement | null>(null);

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setIsTestingMic(true);
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      visualize();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your browser permissions.');
    }
  };

  const stopMicTest = useCallback(() => {
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setMicStream(null);
    setIsTestingMic(false);
  }, [micStream]);

  const visualize = () => {
    if (!analyserRef.current || !visualizerRef.current) return;
    const analyser = analyserRef.current;
    const canvas = visualizerRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isTestingMic) return;
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(243 244 246)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(34 197 94)';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, [stopMicTest]);

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
            onClick={isTestingMic ? stopMicTest : startMicTest}
            className={`px-4 py-2 rounded-md text-white ${
              isTestingMic ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}>
            {isTestingMic ? 'Stop Test' : 'Test Microphone'}
          </button>
          <canvas ref={visualizerRef} width="300" height="50" className={`border rounded-md ${isTestingMic ? '' : 'bg-gray-100'}`}></canvas>
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
    </div>
  );
};

export default VoiceSettings;