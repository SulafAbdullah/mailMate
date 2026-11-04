// src/components/Header.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Mail, 
  Clock, 
  Menu, 
  X, 
  Globe, 
  LogOut, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';

export default function Header({ 
  lang, 
  onToggleLanguage, 
  t, 
  session, 
  profile,
  onOpenAuth, 
  onOpenHistory, 
  onSignOut 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Derived user display attributes
  const userInitial = profile?.full_name?.trim()?.charAt(0) 
    || session?.user?.email?.charAt(0)?.toUpperCase() 
    || 'U';

  const displayName = profile?.full_name?.trim() 
    || session?.user?.email?.split('@')[0] 
    || 'User';

  // Dismiss dropdowns on outside click or Escape key
  const handleDismissDropdowns = useCallback((e) => {
    if (e.type === 'keydown' && e.key === 'Escape') {
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
      return;
    }
    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
      setIsUserMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleDismissDropdowns);
    document.addEventListener('keydown', handleDismissDropdowns);
    return () => {
      document.removeEventListener('mousedown', handleDismissDropdowns);
      document.removeEventListener('keydown', handleDismissDropdowns);
    };
  }, [handleDismissDropdowns]);

  return (
    <header className="border-b border-slate-200 bg-white py-3 px-6 mb-8 shadow-xs relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* --- Branding with Mail Icon on the Same Line --- */}
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-brand leading-none">
              {t?.appTitle || 'Mailmate'}
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-none">
            {t?.appSubtitle || 'Academic Email Assistant'}
          </p>
        </div>

        {/* --- Desktop Action Bar --- */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Badge */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-brand bg-brand-light px-3 py-1.5 rounded-full border border-brand/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>

          {/* Language Switch */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:border-brand hover:text-brand hover:bg-brand-light/30 shadow-xs transition-colors duration-150 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* History Button (When authenticated) */}
          {session && (
            <button 
              type="button"
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:border-brand hover:text-brand hover:bg-brand-light/30 shadow-xs transition-colors duration-150 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'ar' ? 'السجل' : 'History'}</span>
            </button>
          )}

          {/* User Account / Sign In */}
          {session ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all duration-150 cursor-pointer shadow-xs group"
              >
                <span className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                  {userInitial}
                </span>

                <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate group-hover:text-brand transition-colors">
                  {displayName}
                </span>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Account Dropdown Panel */}
              {isUserMenuOpen && (
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {session.user.email}
                    </p>
                  </div>

                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 transition-colors duration-150 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-md bg-brand text-white hover:bg-brand/90 active:scale-[0.98] transition-all duration-150 shadow-xs cursor-pointer"
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          )}
        </div>

        {/* --- Mobile Menu Button --- */}
        <div className="flex sm:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:border-brand hover:text-brand hover:bg-brand-light/20 transition-colors duration-150 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* --- Mobile Dropdown Panel --- */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-3 pt-3 border-t border-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {session && (
            <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-bold text-slate-800">{displayName}</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{session.user.email}</p>
            </div>
          )}

          {session && (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenHistory();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-brand hover:text-brand hover:bg-brand-light/20 transition-colors duration-150"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                {lang === 'ar' ? 'السجل' : 'History'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleLanguage}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-brand hover:text-brand hover:bg-brand-light/20 transition-colors duration-150"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              {lang === 'en' ? 'تغيير اللغة' : 'Change Language'}
            </span>
            <span className="text-slate-400 font-normal">
              {lang === 'en' ? 'العربية' : 'English'}
            </span>
          </button>

          {session ? (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-brand text-white hover:bg-brand/90 transition-colors duration-150 shadow-xs text-center"
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          )}
        </div>
      )}
    </header>
  );
}