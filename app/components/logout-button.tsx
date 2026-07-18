// app/components/logout-button.tsx
'use client';

import { logout } from '@/app/actions/auth';

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="p-2 rounded-lg bg-blue-500/30 hover:bg-blue-500/50 transition-colors"
      title="Keluar"
    >
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
      </svg>
    </button>
  );
}
