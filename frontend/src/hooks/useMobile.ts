import { useResponsive } from './useResponsive';

export const useMobile = (): boolean => {
  const breakpoint = useResponsive();
  return breakpoint === 'mobile';
};