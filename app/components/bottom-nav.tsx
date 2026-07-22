'use client';

// app/components/bottom-nav.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Pembayaran',
      href: '/',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${active ? 'scale-110' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: 'Raport Siswa',
      href: '/raport',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${active ? 'scale-110' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className="w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg pointer-events-auto flex justify-around items-center h-16 px-4 rounded-t-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 relative ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon(isActive)}
              <span className="text-xs font-medium tracking-tight">{item.name}</span>

              {/* Indicator Garis Aktif Atas */}
              {isActive && (
                <span className="absolute top-0 w-12 h-1 bg-blue-600 rounded-b-full shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
