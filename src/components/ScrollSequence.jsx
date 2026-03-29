import React, { useRef, useEffect } from 'react';

export default function ScrollSequence() {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const hintRef      = useRef(null);
  const imagesRef    = useRef([]);     // plain array ref — zero re-renders
  const frameCount   = 75;
  const rafPending   = useRef(false);  // deduplicate rAF calls

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    const hint      = hintRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    // ── 1. Sync canvas pixel size to its CSS layout size ────────────────────
    const syncSize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
      }
    };

    // ── 2. Cover-fill draw ───────────────────────────────────────────────────
    const drawFrame = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width,   ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale, sh = ih * scale;
      const ox = (cw - sw) / 2,  oy = (ch - sh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, ox, oy, sw, sh);
    };

    // ── 3. Scroll handler — NO React state, zero re-renders ─────────────────
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      if (rect.top > 0) return;

      const scrollable = rect.height - window.innerHeight;
      let fraction = -rect.top / scrollable;
      fraction = Math.min(1, Math.max(0, fraction));

      // Hint visibility via direct DOM manipulation — no setState
      if (hint) hint.style.opacity = fraction > 0.05 ? '0' : '1';

      const frameIndex = Math.min(frameCount - 1, Math.floor(fraction * frameCount));

      // Only one rAF queued at a time — prevents piling up during fast scrolls
      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(() => {
          drawFrame(imagesRef.current[frameIndex]);
          rafPending.current = false;
        });
      }
    };

    // ── 4. Resize: re-sync size then repaint current frame ──────────────────
    const handleResize = () => {
      syncSize();
      handleScroll();
    };

    // ── 5. Preload all frames, then attach listeners ─────────────────────────
    syncSize();

    const images = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/DevTinder/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Paint frame 1 as soon as it arrives so canvas isn't blank
        if (loadedCount === 1) drawFrame(images[0]);
      };
      images.push(img);
    }

    imagesRef.current = images;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize',  handleResize,  { passive: true });
    handleScroll(); // initial paint

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize',  handleResize);
    };
  }, []); // runs exactly once on mount

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '400vh' }}
    >
      {/* Sticky, viewport-pinned canvas */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Top gradient fade */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {/* Scroll hint — opacity controlled via direct DOM ref (no re-renders) */}
        <div
          ref={hintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-sm animate-bounce pointer-events-none select-none"
          style={{ transition: 'opacity 0.5s ease', opacity: 1 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Scroll to explore
        </div>
      </div>
    </div>
  );
}
