// src/components/HistoryDrawer.jsx
import React, { useState } from 'react';
import { X, Copy, Check, Trash2, Clock, ArrowRight } from 'lucide-react';

export default function HistoryDrawer({ 
  isOpen, 
  onClose, 
  history, 
  onSelectDraft, 
  onDeleteDraft,
  lang = 'en'
}) {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-xl border-l border-slate-200 flex flex-col p-6 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-brand-light text-brand">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-800">
              {lang === 'ar' ? 'سجل الرسائل السابقة' : 'Saved Generations'}
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'لا يوجد سجل رسائل حتى الآن.' : 'No generation history found yet.'}
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-brand/40 hover:shadow-sm transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-light text-brand border border-brand/15">
                      {item.purpose || (lang === 'ar' ? 'عام' : 'General')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.generated_draft)}
                      title={lang === 'ar' ? 'نسخ المسودة' : 'Copy Draft'}
                      className="p-1.5 rounded-md text-slate-400 hover:text-brand hover:bg-brand-light/30 transition-colors duration-150 cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {onDeleteDraft && (
                      <button
                        type="button"
                        onClick={() => onDeleteDraft(item.id)}
                        title={lang === 'ar' ? 'حذف' : 'Delete'}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-150 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-700 truncate mb-1">
                  {item.recipient || (lang === 'ar' ? 'عضو هيئة التدريس' : 'Professor')} • {item.course_name || (lang === 'ar' ? 'المقرر' : 'Course')}
                </p>

                <p className="text-xs text-slate-500 line-clamp-2 italic mb-3 bg-slate-50 p-2 rounded-md border border-slate-100">
                  "{item.generated_draft}"
                </p>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectDraft(item);
                    onClose();
                  }}
                  className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-brand hover:text-white hover:border-brand shadow-xs transition-colors duration-150 flex items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <span>{lang === 'ar' ? 'عرض في المعاينة' : 'Load into Editor'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}