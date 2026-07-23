// app/components/pwa-install-prompt.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
        .catch((err) => console.log('PWA Service Worker registration failed:', err));
    }

    // 2. Check if already installed / standalone
    if (typeof window !== 'undefined') {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      // Check iOS Safari
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIos(isIosDevice);

      // Don't show if already installed or dismissed in current session
      const isDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
      if (isStandaloneMode || isDismissed) {
        return;
      }

      // 3. Listen for beforeinstallprompt event (Android / Chrome / Edge)
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowPrompt(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // For iOS, show guidance banner if not standalone and not dismissed
      if (isIosDevice && !isStandaloneMode) {
        setShowPrompt(true);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none animate-[slideUp_0.3s_ease-out]">
      <div className="w-full max-w-md bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 border border-emerald-500/30 rounded-2xl p-4 text-white shadow-2xl shadow-emerald-950/80 pointer-events-auto backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative z-10">
          {/* App Logo Icon */}
          <div className="w-12 h-12 rounded-xl bg-white/10 p-1.5 border border-white/15 shadow-md flex-shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo Portal Ortu"
              width={48}
              height={48}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-white tracking-tight">
                Install Aplikasi Portal Ortu
              </h4>
              <button
                onClick={handleDismiss}
                className="text-white/40 hover:text-white p-1 transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-[11px] text-emerald-200/80 mt-0.5 leading-tight">
              {isIos
                ? 'Pasang di layar utama: Ketuk tombol Bagikan ➔ "Tambahkan ke Layar Utama"'
                : 'Pasang aplikasi di HP Anda untuk akses cepat & tampilan penuh tanpa browser.'}
            </p>

            {!isIos && deferredPrompt && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-700/30 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Install Sekarang
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs rounded-lg transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            )}

            {isIos && (
              <div className="mt-2.5">
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-emerald-200 text-[11px] rounded-lg transition-colors"
                >
                  Saya Mengerti
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
