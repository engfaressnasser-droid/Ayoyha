import React, { useEffect, useRef } from 'react';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'star' | 'heart' | 'ribbon' | 'circle';
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  opacity: number;
  decay: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface RomanticCelebrationCanvasProps {
  triggerKey: number; // Incrementing this key re-triggers a burst
}

const CELEBRATION_COLORS = [
  '#f43f5e', // rose-500
  '#fb7185', // rose-400
  '#f472b6', // pink-400
  '#fbbf24', // amber-400 gold
  '#f59e0b', // amber-500 deep gold
  '#fcd34d', // yellow-300 bright gold
  '#c084fc', // purple-400
  '#ffffff', // diamond sparkle
  '#fda4af', // rose-300
  '#e11d48', // rose-600 ruby
];

export const RomanticCelebrationCanvas: React.FC<RomanticCelebrationCanvasProps> = ({
  triggerKey,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!triggerKey) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: ConfettiParticle[] = [];
    const centerX = width / 2;
    const centerY = height * 0.45; // Burst around the center/envelope

    const particleCount = Math.min(130, Math.floor(width / 7));

    for (let i = 0; i < particleCount; i++) {
      // Upward fan burst angle (between -160 deg and -20 deg)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.85;
      const speed = 7 + Math.random() * 14;

      const shapeRand = Math.random();
      const shape: 'star' | 'heart' | 'ribbon' | 'circle' =
        shapeRand < 0.35
          ? 'star'
          : shapeRand < 0.6
          ? 'ribbon'
          : shapeRand < 0.85
          ? 'heart'
          : 'circle';

      particles.push({
        x: centerX + (Math.random() - 0.5) * 60,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed - 2,
        size: shape === 'star' ? 10 + Math.random() * 12 : shape === 'heart' ? 12 + Math.random() * 14 : shape === 'ribbon' ? 7 + Math.random() * 10 : 4 + Math.random() * 5,
        color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: 0.05 + Math.random() * 0.1,
        opacity: 1,
        decay: 0.003 + Math.random() * 0.004,
        twinkleSpeed: 0.06 + Math.random() * 0.1,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Secondary delayed mini-burst for rich layering
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
        const speed = 5 + Math.random() * 11;
        particles.push({
          x: centerX + (Math.random() - 0.5) * 80,
          y: centerY + 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 8 + Math.random() * 10,
          color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
          shape: Math.random() > 0.5 ? 'star' : 'heart',
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          tiltAngle: Math.random() * Math.PI * 2,
          tiltSpeed: 0.08,
          opacity: 1,
          decay: 0.004,
          twinkleSpeed: 0.1,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }, 280);

    // Drawing helper: 4-pointed shimmering star
    const drawStar = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.32;
      let rot = (Math.PI / 2) * 3;
      let x = 0;
      let y = 0;
      const step = Math.PI / spikes;

      c.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(0, -outerRadius);
      c.closePath();
      c.fill();
    };

    // Drawing helper: Romantic Heart
    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
      c.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
    };

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics: gravity + air resistance
        p.vx *= 0.985;
        p.vy += 0.22; // gravity pulling down
        p.vy *= 0.988;

        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.rotationSpeed;
        p.tiltAngle += p.tiltSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // 3D tilt scale for fluttering ribbon
        const scaleY = Math.cos(p.tiltAngle);
        ctx.scale(1, scaleY);

        // Twinkle factor for stars
        let currentOpacity = p.opacity;
        if (p.shape === 'star') {
          const twinkle = (Math.sin(frame * p.twinkleSpeed + p.twinklePhase) + 1) / 2;
          currentOpacity = Math.min(1, p.opacity * (0.6 + twinkle * 0.5));
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, currentOpacity);

        if (p.shape === 'star') {
          drawStar(ctx, p.size);
        } else if (p.shape === 'heart') {
          drawHeart(ctx, p.size);
        } else if (p.shape === 'ribbon') {
          // Metallic confetti rectangle
          ctx.fillRect(-p.size / 2, -p.size * 0.75, p.size, p.size * 1.5);
        } else {
          // Sparkling circular glint
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      aria-hidden="true"
    />
  );
};
