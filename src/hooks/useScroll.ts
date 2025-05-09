// src/hooks/useScroll.ts
/**
 * Purpose: Tracks the vertical scroll position of the window and provides that value as a state variable.
 * Author: AI Assistant
 * Creation Date: June 27, 2024
 * Last Modification Date: June 27, 2024
 */

import { useState, useEffect, useCallback } from 'react';

interface UseScrollOptions {
  debounce?: number;
}

/**
 * useScroll Hook
 * Tracks the vertical scroll position of the window with debouncing.
 * @param options - Configuration options for the hook.
 * @returns The current vertical scroll position.
 */
export const useScroll = (options: UseScrollOptions = {}): number => {
  const { debounce = 100 } = options;
  const [scrollPosition, setScrollPosition] = useState(0);

  const updateScrollPosition = useCallback(() => {
    if (typeof window !== 'undefined') {
      let maxScrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      maxScrollHeight = maxScrollHeight < 0 ? 0 : maxScrollHeight;
      setScrollPosition(Math.max(0, Math.min(window.scrollY, maxScrollHeight)));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const debouncedUpdateScrollPosition = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        updateScrollPosition();
      }, debounce);
    };

    const handleScroll = () => {
      debouncedUpdateScrollPosition();
    };

    const handleResize = () => {
      updateScrollPosition();
    };

    // Initial calculation in case the component is already scrolled
    updateScrollPosition();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [debounce, updateScrollPosition]);

  return scrollPosition;
};