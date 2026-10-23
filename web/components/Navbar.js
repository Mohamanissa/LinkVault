'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path) =>
    pathname === path ? 'text-red-500' : 'text-neutral-400 hover:text-white';

  return (
    <nav className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl"></span>
          <span className="font-bold text-lg tracking-tight">LinkVault</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className={isActive('/')}>Accueil</Link>
          <Link href="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
