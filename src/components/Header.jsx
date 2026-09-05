// this is the header component for the MailMate application. 
// src/components/Header.jsx
export default function Header({ lang, onToggleLanguage, t }) {
  return (
    <header className="border-b border-slate-200 bg-white py-4 px-6 mb-8 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand">
            {t.appTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.appSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-brand bg-brand-light px-3 py-1.5 rounded-full border border-brand/20">
            <span>{t.badge}</span>
          </div>

          {/* Language Switch Button */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer"
          >
            <span>{lang === 'en' ? ' العربية' : ' English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}