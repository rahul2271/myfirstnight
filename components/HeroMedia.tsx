'use client';

import { useEffect, useRef, useState } from 'react';

const DESKTOP = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '';
const MOBILE = process.env.NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL || '';

// Cinematic hero: autoplaying muted loop when a video URL is configured.
// Falls back to the still image for reduced-motion, data-saver and slow connections.
export function HeroMedia({ poster = '/home-banner.png', alt = 'MyFirstNight luxury intimates' }: { poster?: string; alt?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!DESKTOP) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn: any = (navigator as any).connection;
    const slow = conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''));
    setAllowVideo(!reduced && !slow);
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={alt} className="absolute inset-0 w-full h-full object-cover opacity-70 animate-ken-burns origin-center" />
      {allowVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={() => setLoaded(true)}
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ${loaded ? 'opacity-70' : 'opacity-0'}`}
        >
          {MOBILE && <source src={MOBILE} media="(max-width: 767px)" type="video/mp4" />}
          <source src={DESKTOP} type={DESKTOP.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      )}
      {allowVideo && loaded && (
        <button
          onClick={toggle}
          aria-label={paused ? 'Play background video' : 'Pause background video'}
          className="absolute left-6 md:left-16 bottom-6 z-20 text-[8px] uppercase tracking-[0.4em] text-mfn-silk/60 hover:text-mfn-silk transition-colors"
        >
          {paused ? '▶ Play' : '❚❚ Pause'}
        </button>
      )}
    </>
  );
}
