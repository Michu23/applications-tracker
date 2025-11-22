'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2979FF] rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">Michi&apos;s UniTracker</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/')
                  ? 'bg-[#2979FF]/10 text-[#2979FF]'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/kanban"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/kanban')
                  ? 'bg-[#2979FF]/10 text-[#2979FF]'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Visualisation
            </Link>
            <Link
              href="/resources"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/resources')
                  ? 'bg-[#2979FF]/10 text-[#2979FF]'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Resources
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
