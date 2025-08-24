
import { useCallback } from 'react';

const useHapticFeedback = () => {
  const triggerFeedback = useCallback((pattern: VibratePattern = 200) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.error('Haptic feedback failed:', error);
      }
    }
  }, []);

  return triggerFeedback;
};

export default useHapticFeedback;