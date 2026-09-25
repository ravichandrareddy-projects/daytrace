import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

/**
 * Dynamic Multi-Color Fluid Ambient Stream
 * Actively circulates all 7 rainbow colors (or Northern Lights in Aurora mode)
 * across the screen perimeter continuously.
 */
export default function RainbowShaderCanvas() {
  const canvasRef = useRef(null);
  const { state } = useApp();
  const theme = state?.settings?.theme || 'aurora';
  const isAurora = theme === 'aurora' || theme === 'aurora_night';
  const isPlain = theme === 'plain_black' || theme === 'plain_white' || theme === 'black' || theme === 'white';

  useEffect(() => {
    if (isPlain) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;

    function resize() {
      width = window.innerWidth || 412;
      height = window.innerHeight || 884;
      canvas.width = width;
      canvas.height = height;
    }
    resize();
    window.addEventListener('resize', resize);

    // 7 Spectrum colors for Rainbow mode
    const rainbowColors = [
      '#ff0055', // Red
      '#ff5400', // Orange
      '#ffd60a', // Yellow
      '#06d6a0', // Green
      '#00bbf9', // Cyan
      '#4361ee', // Blue
      '#7209b7'  // Violet
    ];

    // Aurora colors
    const auroraColors = [
      '#10b981', // Emerald
      '#06b6d4', // Cyan
      '#8b5cf6', // Violet
      '#ec4899', // Magenta
      '#10b981'  // Loop Emerald
    ];

    let t = 0;
    function render() {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      const colors = isAurora ? auroraColors : rainbowColors;
      const count = colors.length;
      const radius = Math.max(width, height) * 0.38;

      // Draw moving colored plasma light streams circulating the screen
      for (let i = 0; i < count; i++) {
        const offset = (i / count) * Math.PI * 2;
        const angle = t + offset;
        
        // Perimeter path (travels around left, top, right, bottom)
        const cx = (width / 2) + Math.cos(angle) * (width * 0.48);
        const cy = (height / 2) + Math.sin(angle * 1.2) * (height * 0.48);

        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
        grad.addColorStop(0, colors[i]);
        grad.addColorStop(0.5, colors[i] + (isAurora ? '66' : '55'));
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isAurora, isPlain]);

  if (isPlain) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{
          filter: 'blur(45px)',
          opacity: isAurora ? 0.85 : 0.70
        }}
      />
    </div>
  );
}







