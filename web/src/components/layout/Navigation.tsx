'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Flame, Gift, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: '首页' },
  { href: '/hero-gallery', icon: Users, label: '英雄' },
  { href: '/spark-prairie', icon: Flame, label: '学习' },
  { href: '/red-heritage', icon: Gift, label: '珍藏' },
  { href: '/profile', icon: User, label: '我的' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-neutral-200 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-16 h-full transition-colors',
                  isActive 
                    ? 'text-red-600' 
                    : 'text-neutral-500 hover:text-neutral-700'
                )}
              >
                <item.icon 
                  className={cn(
                    'w-5 h-5 mb-1 transition-transform',
                    isActive && 'scale-110'
                  )} 
                />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-red-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-neutral-200 flex-col z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">星火</h1>
            <p className="text-xs text-neutral-500">红色教育平台</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  isActive 
                    ? 'bg-red-50 text-red-600 font-medium' 
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-red-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400 text-center">
            © 2025 星火教育
          </p>
        </div>
      </aside>
    </>
  );
}

export default Navigation;
