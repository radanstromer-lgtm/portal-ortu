// app/components/splash-screen.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Cek apakah splashscreen sudah pernah muncul dalam sesi ini
    const hasShown = sessionStorage.getItem('pwa_splash_shown');
    if (hasShown) {
      setShow(false);
      return;
    }

    // Mulai animasi fade-out pada 1.2 detik
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 1200);

    // Sembunyikan elemen secara permanen setelah 1.6 detik
    const timer2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('pwa_splash_shown', 'true');
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 text-white transition-opacity duration-500 pointer-events-none select-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated Logo Badge */}
        <div className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-emerald-950/80 mb-6 animate-pulse">
          <Image
            src="/logo.png"
            alt="Rumah Belajar L 253"
            width={120}
            height={120}
            priority
            unoptimized
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
          Portal Orang Tua
        </h1>
        <p className="text-xs sm:text-sm text-emerald-300/80 mt-1 font-medium tracking-wide">
          Rumah Belajar L 253
        </p>

        {/* Loading Indicator */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="w-36 h-1.5 bg-white/15 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
            <div className="h-full w-full bg-emerald-500/40 rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] text-emerald-200/60 uppercase tracking-widest font-semibold mt-1">
            Memuat Portal...
          </span>
        </div>
      </div>

      <p className="absolute bottom-6 text-[10px] text-white/30 tracking-wider font-medium">
        © 2026 Rumah Belajar L 253
      </p>
    </div>
  );
}
