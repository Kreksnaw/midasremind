'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Bell,
  Tag,
  Settings,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/reminders', label: 'Reminders', icon: Bell },
  { href: '/promotions', label: 'Promotions', icon: Tag },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#0f2744] flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-5 py-4 border-b border-white/10 shrink-0">
        <Image
          src="/midas-logo.svg"
          alt="Midas Auto Service"
          width={148}
          height={40}
          priority
          className="w-auto h-9"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-[#e8a020]' : 'text-blue-300 group-hover:text-blue-100'} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={14} className="text-white/40" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10 shrink-0">
        <p className="text-blue-400 text-xs">725 E El Camino Real</p>
        <p className="text-blue-400 text-xs">Sunnyvale, CA 94087</p>
        <p className="text-blue-300 text-xs mt-1 font-medium">(408) 498-7075</p>
      </div>
    </div>
  );
}
