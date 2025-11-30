'use client';

import { Search, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showSignIn?: boolean;
}

export function Header({ 
  title = '星火', 
  showSearch = true, 
  showSignIn = true 
}: HeaderProps) {
  const { toggleSearch, toggleDailySign } = useUIStore();
  const { userInfo } = useUserStore();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-neutral-100">
      <div className="flex items-center justify-between h-14 px-4 md:px-6 md:ml-64">
        {/* Title */}
        <h1 className="text-lg font-bold text-neutral-900 md:hidden">
          {title}
        </h1>
        
        {/* Desktop Title */}
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="text-neutral-600 hover:text-neutral-900"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
          
          {showSignIn && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDailySign}
              className="text-neutral-600 hover:text-neutral-900"
            >
              <Calendar className="w-5 h-5" />
            </Button>
          )}
          
          <Avatar className="w-8 h-8 border-2 border-neutral-100">
            <AvatarImage src={userInfo.avatarUrl} alt={userInfo.nickName} />
            <AvatarFallback className="bg-red-100 text-red-600 text-xs">
              {userInfo.nickName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default Header;
