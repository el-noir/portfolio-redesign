import { useEffect, useRef, useState } from 'react';
import { Navbar, type NavItem } from './components/Navbar';
import { StatsArc } from './components/StatsArc';
import { ReserveModal, type ModalMode } from './components/ReserveModal';
import { computeGridParallaxTarget, lerp } from './utils/arcGeometry';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_125121_afb71ce9-9c64-4c54-90b5-c89c0764c052.png&w=1920&q=85';

const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_135737_0da59642-725b-451a-997b-b0283d95a42a.png&w=1280&q=85';

const SPOTLIGHT_RADIUS = 260;
const MASK_CANVAS_SCALE = 0.25;

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('Module');
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);
  const patternRef = useRef<SVGPatternElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const revealEl = revealRef.current;
    const patternEl = patternRef.current;
    if (!canvas || !revealEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetMouse = { x: -999, y: -999 };
    const smoothMouse = { x: -999, y: -999 };
    const targetGrid = { x: 0, y: 0 };
    const smoothGrid = { x: 0, y: 0 };

    let needsMaskUpdate = true;
    let lastMaskX = -999;
    let lastMaskY = -999;
    let rafId = 0;

    const syncCanvasSize = () => {
      const width = Math.max(1, Math.round(window.innerWidth * MASK_CANVAS_SCALE));
      const height = Math.max(1, Math.round(window.innerHeight * MASK_CANVAS_SCALE));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        needsMaskUpdate = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetGrid.x = computeGridParallaxTarget(e.clientX / w, 16);
      targetGrid.y = computeGridParallaxTarget(e.clientY / h, 16);
    };

    const handleResize = () => {
      syncCanvasSize();
    };

    syncCanvasSize();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    const renderFrame = () => {
      smoothMouse.x = lerp(smoothMouse.x, targetMouse.x, 0.1);
      smoothMouse.y = lerp(smoothMouse.y, targetMouse.y, 0.1);
      smoothGrid.x = lerp(smoothGrid.x, targetGrid.x, 0.06);
      smoothGrid.y = lerp(smoothGrid.y, targetGrid.y, 0.06);

      if (patternEl) {
        patternEl.setAttribute('x', smoothGrid.x.toFixed(2));
        patternEl.setAttribute('y', smoothGrid.y.toFixed(2));
      }

      const movedEnough =
        Math.abs(smoothMouse.x - lastMaskX) > 0.5 ||
        Math.abs(smoothMouse.y - lastMaskY) > 0.5;

      if (needsMaskUpdate || movedEnough) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = smoothMouse.x * MASK_CANVAS_SCALE;
        const cy = smoothMouse.y * MASK_CANVAS_SCALE;
        const r = SPOTLIGHT_RADIUS * MASK_CANVAS_SCALE;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
        grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
        grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        const dataUrl = canvas.toDataURL();
        revealEl.style.maskImage = `url(${dataUrl})`;
        revealEl.style.webkitMaskImage = `url(${dataUrl})`;

        lastMaskX = smoothMouse.x;
        lastMaskY = smoothMouse.y;
        needsMaskUpdate = false;
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <Navbar
        activeItem={activeNav}
        onSelectItem={setActiveNav}
        onConnectClick={() => setModalMode('connect')}
      />

      <main className="relative h-[100dvh] w-full overflow-hidden bg-[#180506]">
        {/* Hidden canvas used to generate the radial spotlight mask */}
        <canvas
          ref={canvasRef}
          data-testid="spotlight-canvas"
          className="hidden"
          aria-hidden="true"
        />

        {/* Layer 1 (z-0): Parallax 48px grid SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ opacity: 0.1 }}
          aria-hidden="true"
        >
          <defs>
            <pattern
              ref={patternRef}
              id="hero-grid-pattern"
              width={48}
              height={48}
              patternUnits="userSpaceOnUse"
              x={0}
              y={0}
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#64748b"
                strokeWidth={0.6}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
        </svg>

        {/* Layer 2 (z-10): Base red-tinted portrait with Ken Burns intro */}
        <div
          className="absolute inset-0 z-10 bg-center bg-cover ken-burns"
          style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
          aria-hidden="true"
        />

        {/* Layer 3 (z-30): Cursor spotlight reveal layer */}
        <div
          ref={revealRef}
          data-testid="spotlight-layer"
          className="absolute inset-0 z-30 bg-center bg-cover pointer-events-none"
          style={{
            backgroundImage: `url("${BG_IMAGE_2}")`,
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
          aria-hidden="true"
        />

        {/* Subtle bottom-left contrast scrim so white typography stays legible */}
        <div
          className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-tr from-black/65 via-black/25 to-transparent"
          aria-hidden="true"
        />

        {/* Layer 4 (z-50): Stats on fading circular arc */}
        <StatsArc />

        {/* Layer 5 (z-50): Hero text block */}
        <div className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-5 sm:left-8 md:left-12 max-w-[300px] sm:max-w-md z-50">
          <p
            className="text-[11px] sm:text-xs font-semibold tracking-[0.12em] text-white/90 hero-rise"
            style={{ animationDelay: '0.15s' }}
          >
            Gateway to your <span className="italic">augmented self</span>
          </p>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.08em] text-white font-normal mt-3 hero-rise"
            style={{ animationDelay: '0.3s' }}
          >
            A window
            <br />
            of coming
            <br />
            enhancements
          </h1>

          <p
            className="text-sm sm:text-base text-white/90 leading-relaxed mt-4 hero-rise"
            style={{ animationDelay: '0.5s' }}
          >
            A future where carbon fiber, titanium, and human instinct align. Not
            machine. Not human. Something wonderfully poised between.
          </p>

          <button
            type="button"
            onClick={() => setModalMode('reserve')}
            className="group relative overflow-hidden inline-flex items-center justify-center bg-white text-gray-900 text-sm font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg shadow-black/20 hover:scale-[1.04] active:scale-95 transition-transform duration-200 mt-6 cursor-pointer hero-rise focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ animationDelay: '0.7s' }}
          >
            <span className="relative z-10">Reserve Now</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />
          </button>
        </div>
      </main>

      <ReserveModal
        mode={modalMode}
        activeModule={activeNav}
        onClose={() => setModalMode(null)}
      />
    </div>
  );
}
