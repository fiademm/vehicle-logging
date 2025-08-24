import { useState, useEffect } from 'react';

const useVoiceSettings = () => {
  const [continuousListening, setContinuousListening] = useState(() => {
    const saved = localStorage.getItem('continuousListening');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('continuousListening', JSON.stringify(continuousListening));
  }, [continuousListening]);

  const toggleContinuousListening = () => {
    setContinuousListening((prev: boolean) => !prev);
  };

  return { continuousListening, toggleContinuousListening };
};

export default useVoiceSettings;