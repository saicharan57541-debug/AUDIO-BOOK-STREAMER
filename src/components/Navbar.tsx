import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Headphones, Bookmark, BarChart3, LogIn, LogOut, Compass, Library } from 'lucide-react';

interface NavbarProps {
  currentTab: 'discover' | 'browse' | 'library' | 'stats';
  setCurrentTab: (tab: 'discover' | 'browse' | 'library' | 'stats') => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setCurrentTab('discover')}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-stone-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Headphones className="w-4 h-4" />
          </div>
          <span className="font-serif text-xl tracking-tight">AuraBooks</span>
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-400">
          <button
            onClick={() => setCurrentTab('discover')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'discover'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-stone-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            Discover
          </button>
          
          <button
            onClick={() => setCurrentTab('browse')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'browse'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-stone-200'
            }`}
          >
            <Headphones className="w-4 h-4" />
            Browse Catalog
          </button>

          <button
            onClick={() => setCurrentTab('library')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'library'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-stone-200'
            }`}
          >
            <Library className="w-4 h-4" />
            My Library
          </button>

          <button
            onClick={() => setCurrentTab('stats')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'stats'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Listening Stats
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (User profile or Login) */}
        <div className="relative shrink-0 flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border border-stone-800 hover:border-stone-700 bg-stone-900/60 transition-all text-xs text-stone-200 cursor-pointer"
                aria-label="User account menu"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover border border-amber-500/40"
                  referrerPolicy="no-referrer"
                />
                <span className="max-w-[120px] truncate hidden sm:inline font-medium">
                  {user.name}
                </span>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-lg shadow-2xl p-1 z-50 text-xs"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-800 mb-1">
                    <p className="font-semibold text-stone-200 truncate">{user.name}</p>
                    <p className="text-stone-400 truncate text-[11px]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('library');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-stone-300 hover:text-white hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Library className="w-3.5 h-3.5 text-amber-400" />
                    Personal Library
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('stats');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-stone-300 hover:text-white hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                    Listening Stats
                  </button>
                  <div className="h-[1px] bg-stone-800 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-red-400 hover:text-red-300 hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-950"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

          {/* Mobile Tab Hamburger/Switch */}
          <div className="md:hidden flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-1">
            <button
              onClick={() => setCurrentTab('discover')}
              className={`p-1.5 rounded ${currentTab === 'discover' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'}`}
              title="Discover"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab('browse')}
              className={`p-1.5 rounded ${currentTab === 'browse' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'}`}
              title="Browse"
            >
              <Headphones className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab('library')}
              className={`p-1.5 rounded ${currentTab === 'library' ? 'bg-stone-800 text-amber-400' : 'text-stone-400'}`}
              title="Library"
            >
              <Library className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
