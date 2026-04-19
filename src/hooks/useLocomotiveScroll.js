// src/hooks/useLocomotiveScroll.js
import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

export function useLocomotiveScroll() {
  const scrollRef     = useRef(null);
  const locomotiveRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    locomotiveRef.current = new LocomotiveScroll({
      el:           scrollRef.current,
      smooth:       true,
      smoothMobile: false,
      multiplier:   0.88,
      lerp:         0.07,
      class:        'is-inview',
    });

    // Expose globally so components can attach .on() listeners
    window.__locomotiveScroll = locomotiveRef.current;

    return () => {
      if (locomotiveRef.current) {
        locomotiveRef.current.destroy();
        window.__locomotiveScroll = null;
      }
    };
  }, []);

  return { scrollRef, scroll: locomotiveRef };
}
