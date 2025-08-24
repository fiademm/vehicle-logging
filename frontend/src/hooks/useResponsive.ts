import { useState, useEffect } from 'react';

const getDeviceConfig = (width: number) => {
  if (width < 768) {
    return 'mobile';
  }
  if (width >= 768 && width < 1024) {
    return 'tablet';
  }
  return 'desktop';
};

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState(() => getDeviceConfig(window.innerWidth));

  useEffect(() => {
    const calcInnerWidth = () => {
      setBreakpoint(getDeviceConfig(window.innerWidth));
    };

    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);

  return breakpoint;
};