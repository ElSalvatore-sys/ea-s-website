import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface HapticFeedback {
  trigger: (pattern?: HapticPattern) => void;
  triggerSequence: (patterns: number[]) => void;
  isSupported: boolean;
}

export const useHapticFeedback = (): HapticFeedback => {
  // Check if vibration API is supported
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  // Define haptic patterns
  const patterns: Record<HapticPattern, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 40,
    success: [10, 50, 10],
    warning: [20, 100, 20],
    error: [50, 100, 50, 100, 50],
    selection: 15
  };

  // Trigger haptic feedback
  const trigger = useCallback((pattern: HapticPattern = 'light') => {
    if (!isSupported) return;

    try {
      const vibrationPattern = patterns[pattern];
      navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, [isSupported]);

  // Trigger custom sequence
  const triggerSequence = useCallback((customPattern: number[]) => {
    if (!isSupported) return;

    try {
      navigator.vibrate(customPattern);
    } catch (error) {
      console.warn('Haptic feedback sequence failed:', error);
    }
  }, [isSupported]);

  return {
    trigger,
    triggerSequence,
    isSupported
  };
};

export default useHapticFeedback;