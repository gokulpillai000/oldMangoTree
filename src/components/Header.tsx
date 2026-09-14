'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Moon, Sun, Menu, X, BookOpen, Radio, TrendingUp, User, PenTool, Film, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { getStoredSession, setStoredSession, getAuthHeaders } from '@/lib/clientAuth';

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }

    // 1. Instantly restore session from localStorage (eliminates mobile delay/flicker)
    const stored = getStoredSession();
    if (stored) {
      setSession(stored);
    }

    // 2. Sync with server in background
    const syncServerAuth = () => {
      fetch('/api/auth', {
        headers: getAuthHeaders(),
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.session) {
            setSession(data.session);
            setStoredSession(data.session);
          } else {
            // Only clear if server explicitly confirms no session
            const currentStored = getStoredSession();
            if (!currentStored) {
              setSession(null);
            }
          }
        })
        .catch(() => {});
    };

    syncServerAuth();

    // Listen for custom auth events across components
    const handleAuthChanged = () => {
      const updated = getStoredSession();
      setSession(updated);
    };

    window.addEventListener('omt-auth-changed', handleAuthChanged);
    return () => {
      window.removeEventListener('omt-auth-changed', handleAuthChanged);
    };
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const trendingTags = [
    { label: '#KeralaPolitics', query: 'Kerala' },
    { label: '#ThinkFootball', query: 'Football' },
    { label: '#Cinema', query: 'Cinema' },
    { label: '#Ecology', query: 'Ecology' },
    { label: '#Packet2', query: 'packet-2' },
    { label: '#Literature', query: 'Literature' },
  ];

  const categories = [
    { name: 'Webzine Packets', href: '/magazine', highlight: true },
    { name: 'Politics', href: '/politics' },
    { name: 'Cinema & Culture', href: '/cinema' },
    { name: 'Sports', href: '/sports' },
    { name: 'Literature', href: '/literature' },
    { name: 'Podcasts', href: '/podcasts' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-paper-light/95 dark:bg-paper-dark/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        {/* Pre-Header Bar with Trending Topic Pills (Truecopy Think Signature) */}
        <div className="bg-neutral-900 text-neutral-200 text-xs py-1.5 px-4 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none overscroll-x-contain py-0.5">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-neutral-300 uppercase tracking-wider shrink-0">
                <TrendingUp className="w-3 h-3 text-brand-400" /> Trending:
              </span>
              {trendingTags.map((tag) => (
                <Link
                  key={tag.label}
                  href={`/search?q=${encodeURIComponent(tag.query)}`}
                  className="shrink-0 px-2 py-0.5 rounded text-[11px] bg-neutral-800 hover:bg-brand-600 hover:text-white text-neutral-300 transition-colors"
                >
                  {tag.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0 text-[11px]">
              <Link
                href="/magazine/packet-2"
                className="hidden md:inline-flex items-center gap-1 text-neutral-300 hover:text-white font-bold"
              >
                <span>PACKET 2 LIVE</span> →
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Slogan Masthead */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-brand-700 flex items-center justify-center text-white font-serif text-lg sm:text-2xl font-bold shadow-md group-hover:scale-105 transition-transform">
                  OM
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
                    oldman<span className="text-brand-600 dark:text-brand-400">go</span>tree
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-neutral-500 dark:text-neutral-400">
                    Media &amp; Webzine
                  </span>
                </div>
              </Link>

              {/* Tagline Badge (Truecopy Think: Readers are Thinkers) */}
              <div className="hidden xl:block pl-3 border-l border-neutral-300 dark:border-neutral-700">
                <p className="font-serif text-xs font-bold text-neutral-700 dark:text-neutral-300 leading-tight">
                  Readers are Thinkers
                </p>
                <p className="font-sans text-[11px] text-neutral-500 dark:text-neutral-400">
                  വായിക്കുന്നവരാണ് ചിന്തിക്കുന്നവർ
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 font-medium text-xs xl:text-sm text-neutral-700 dark:text-neutral-300">
              <Link
                href="/podcasts"
                className={`flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                  pathname === '/podcasts' || pathname === '/app-podcasts' ? 'text-brand-600 font-bold' : ''
                }`}
              >
                <Radio className="w-4 h-4 text-brand-600" />
                Audio
              </Link>

              <Link
                href="/politics"
                className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                  pathname === '/politics' ? 'text-brand-600 font-bold' : ''
                }`}
              >
                Politics
              </Link>

              <Link
                href="/literature"
                className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                  pathname === '/literature' ? 'text-brand-600 font-bold' : ''
                }`}
              >
                Literature
              </Link>

              <Link
                href="/videos"
                className={`flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                  pathname === '/videos' ? 'text-brand-600 font-bold' : ''
                }`}
              >
                <Film className="w-4 h-4" />
                Videos
              </Link>

              <Link
                href="/magazine"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-colors ${
                  pathname.startsWith('/magazine') || pathname === '/magazine-archives'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-600 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Webzine
              </Link>

              <Link
                href="/series"
                className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                  pathname.startsWith('/series') ? 'text-brand-600 font-bold' : ''
                }`}
              >
                Series
              </Link>

              <Link
                href="/media"
                className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                  pathname === '/media' ? 'text-brand-600 font-bold' : ''
                }`}
              >
                Media
              </Link>

              <Link
                href="/entertainment"
                className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                  pathname === '/entertainment' ? 'text-brand-600 font-bold' : ''
                }`}
              >
                Entertainment
              </Link>

              <Link
                href="/latest"
                className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${
                  pathname === '/latest' ? 'text-brand-600 font-bold' : ''
                }`}
              >
                Latest
              </Link>

              {session && (
                <Link
                  href="/publisher"
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-brand-500 hover:text-brand-600 transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Desk</span>
                </Link>
              )}
            </nav>

            {/* Actions: Search, Sign In, & Theme Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {session && (
                <Link
                  href="/publisher"
                  className="lg:hidden flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800 shadow-xs"
                >
                  <PenTool className="w-3 h-3 text-brand-600" />
                  <span>Desk</span>
                </Link>
              )}

              <Link
                href="/search"
                className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              <button
                onClick={() => setIsAuthOpen(true)}
                className={`p-2 rounded-full transition-colors flex items-center gap-1 ${
                  session
                    ? 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                title={session ? `Signed in as ${session.name}` : 'Editorial Sign In'}
              >
                <User className="w-5 h-5" />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300"
                aria-label="Open Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Swipeable Category Chips for Mobile & Tablets */}
        <div className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 overflow-x-auto scrollbar-none overscroll-x-contain border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40">
          {categories.map((cat) => {
            const isActive = pathname === cat.href;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  cat.highlight
                    ? 'bg-brand-700 text-white shadow-sm'
                    : isActive
                    ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-800'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile & Tablet Full Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-paper-light dark:bg-paper-dark px-4 pt-3 pb-8 space-y-2.5 shadow-2xl max-h-[85vh] overflow-y-auto">
            {session && (
              <div className="p-3.5 mb-2 rounded-xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-brand-800 dark:text-brand-300">
                    Editorial Session • {session.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-700 text-white">
                    Publisher
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/publisher"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold shadow"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Open Editorial Desk</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="px-3 py-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium"
                  >
                    Manage
                  </button>
                </div>
              </div>
            )}

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-base font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-800"
            >
              Home (പ്രധാന പേജ്)
            </Link>
            <Link
              href="/podcasts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Audio (ഓഡിയോ &amp; പോഡ്‌കാസ്റ്റ്)
            </Link>
            <Link
              href="/politics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Politics (രാഷ്ട്രീയം)
            </Link>
            <Link
              href="/literature"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Literature (സാഹിത്യം)
            </Link>
            <Link
              href="/videos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Videos (വീഡിയോകൾ)
            </Link>
            <Link
              href="/magazine"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 border-b border-neutral-100 dark:border-neutral-800"
            >
              Webzine Archives &amp; Packets
            </Link>
            <Link
              href="/series"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Series (പ്രത്യേക പരമ്പരകൾ)
            </Link>
            <Link
              href="/media"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Media (മാധ്യമം)
            </Link>
            <Link
              href="/entertainment"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Entertainment (വിനോദം)
            </Link>
            <Link
              href="/cinema"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Cinema &amp; Film Studies
            </Link>
            <Link
              href="/sports"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Sports (സ്പോർട്സ് / ഫുട്ബോൾ)
            </Link>
            <Link
              href="/education"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Education (വിദ്യാഭ്യാസം)
            </Link>
            <Link
              href="/memoir"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Memoir (ഓർമ്മ)
            </Link>
            <Link
              href="/travel"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Travel (യാത്ര)
            </Link>
            <Link
              href="/economy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Economy (സമ്പദ്‌വ്യവസ്ഥ)
            </Link>
            <Link
              href="/science-and-technology"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Science &amp; Technology (ശാസ്ത്രം)
            </Link>
            <Link
              href="/society"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Society (സമൂഹം)
            </Link>
            <Link
              href="/environment"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Environment (പരിസ്ഥിതി)
            </Link>
            <Link
              href="/health"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              Health (ആരോഗ്യം)
            </Link>
            <Link
              href="/the-team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800"
            >
              The Team (എഡിറ്റോറിയൽ ടീം)
            </Link>
            <Link
              href="/latest"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 border-b border-neutral-100 dark:border-neutral-800"
            >
              Show More / Latest (എല്ലാ വാർത്തകളും)
            </Link>
            {session ? (
              <div className="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 font-medium truncate max-w-[200px]">Logged in: {session.email}</span>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="text-xs font-bold text-brand-700 dark:text-brand-300 hover:underline flex items-center gap-1"
                >
                  <span>Account &amp; Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthOpen(true);
                }}
                className="w-full text-left py-2.5 text-sm font-bold text-brand-700 dark:text-brand-300 flex items-center justify-between"
              >
                <span>Editorial Sign In / Sign Up</span>
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        session={session}
        onSessionChange={(newSession) => setSession(newSession)}
      />
    </>
  );
}
