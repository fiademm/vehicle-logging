
import React, { useEffect, useRef } from 'react';

interface MicTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  micStream: MediaStream | null;
}

const MicTestModal: React.FC<MicTestModalProps> = ({ isOpen, onClose, micStream }) => {
  const visualizerRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const visualize = () => {
    if (!analyserRef.current || !visualizerRef.current) return;
    const analyser = analyserRef.current;
    const canvas = visualizerRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isOpen) return;
      animationFrameId.current = requestAnimationFrame(draw);
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
    if (isOpen && micStream) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(micStream);
      source.connect(analyserRef.current);
      visualize();
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isOpen, micStream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Microphone Test</h3>
        <canvas ref={visualizerRef} width="300" height="100" className="border rounded-md"></canvas>
        <button 
          onClick={onClose}
          className="w-full px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MicTestModal;