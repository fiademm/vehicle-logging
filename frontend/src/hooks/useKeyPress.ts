import { useEffect } from 'react';

/**
 * A custom hook for handling key press events.
 * @param targetKey The key to listen for.
 * @param callback The callback function to execute when the key is pressed.
 */
export const useKeyPress = (targetKey: string, callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetKey, callback]);
};