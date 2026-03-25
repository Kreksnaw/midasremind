'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Wrench } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer whenever the route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="flex h-full">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex shrink-0 h-full">
        <Sidebar />
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button inside drawer */}
        <div className="absolute top-3.5 right-0 translate-x-full pr-0">
          <button
            onClick={() => setDrawerOpen(false)}
            className="bg-[#0f2744] text-white rounded-r-lg p-2.5 shadow-lg"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <Sidebar onNavClick={() => setDrawerOpen(false)} />
      </aside>

      {/* ── Content column ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 bg-[#0f2744] safe-top flex items-center px-4 gap-3 shrink-0 shadow-md" style={{ minHeight: '56px' }}>
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-white/80 hover:text-white transition-colors -ml-1 p-1"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-[#e8a020] rounded-md p-1">
              <Wrench size={15} className="text-white" />
            </div>
            <p className="text-white font-semibold text-sm">MidasRemind</p>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
