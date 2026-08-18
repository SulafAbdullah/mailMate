// this is the header component for the MailMate application. 
// src/components/Header.jsx
export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white py-4 px-6 mb-8 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand">
            MailMate
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic Email Assistant for Students
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-brand bg-brand-light px-3 py-1.5 rounded-full border border-brand/20">
          <span>Standard Academic Format</span>
        </div>
      </div>
    </header>
  );
}