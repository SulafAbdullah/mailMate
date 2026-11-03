// src/components/Header.jsx
export default function Header({ 
  lang, 
  onToggleLanguage, 
  t, 
  session, 
  onOpenAuth, 
  onSignOut 
}) {
  return (
    <header className="border-b border-slate-200 bg-white py-4 px-6 mb-8 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* --- Branding & Subtitle --- */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand">
            {t.appTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.appSubtitle}
          </p>
        </div>

        {/* --- Right Actions (Badge, Language, Auth) --- */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-brand bg-brand-light px-3 py-1.5 rounded-full border border-brand/20">
            <span>{t.badge}</span>
          </div>

          {/* Language Switch Button */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer"
          >
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* --- Authentication State --- */}
          {session ? (
            // Logged-in State: Show user email and Sign Out button
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs text-slate-600 max-w-[140px] truncate">
                {session.user.email}
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                {lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
              </button>
            </div>
          ) : (
            // Logged-out State: Show Sign In button
            <button
              type="button"
              onClick={onOpenAuth}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-md bg-brand text-white hover:bg-brand/90 transition shadow-xs cursor-pointer"
            >
              {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          )}

        </div>
      </div>
    </header>
  );
}