'use client';

import { useTheme } from 'next-themes';
import { Bell, Search, Sun, Moon, LogOut } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export function Topbar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const orgSlug = params.orgSlug as string;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api-proxy/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    logout();
    router.push('/auth/login');
  };

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : '??';

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center flex-1">
        {/* Breadcrumb could go here */}
        <div className="text-sm font-medium text-gray-500 dark:text-zinc-400">
          {orgSlug || 'Organization'} <span className="mx-2">/</span> Workspace
        </div>
      </div>

      <div className="flex items-center space-x-3 lg:space-x-4">
        {/* Search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center text-sm text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full px-3 py-1.5 w-64 hover:bg-gray-200 dark:hover:bg-zinc-800/80 transition-colors"
        >
          <Search size={14} className="mr-2" />
          Search...
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-zinc-400 opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        <button className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white" onClick={onOpenCommandPalette}>
          <Search size={18} />
        </button>

        <div className="relative">
          <button
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white relative"
            onClick={() => router.push(`/${orgSlug}/notifications`)}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* We will build out a separate NotificationDropdown component later, but this acts as the anchor point */}
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white text-sm font-medium cursor-pointer shadow-sm hover:opacity-90 transition-opacity"
          >
            {userInitials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg py-1 z-50">
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-zinc-400 border-b border-gray-100 dark:border-zinc-800 truncate">
                {user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
