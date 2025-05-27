import { useEffect, useRef } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  enabled?: boolean;
}

export const PerformanceMonitor = ({ componentName, enabled = false }: PerformanceMonitorProps) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    if (!enabled) return;
    
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (renderCount.current > 1) {
      //console.log(`🔄 ${componentName} rendered ${renderCount.current} times. Time since last render: ${timeSinceLastRender}ms`);
    }
    
    lastRenderTime.current = now;
  });

  return null;
}; 