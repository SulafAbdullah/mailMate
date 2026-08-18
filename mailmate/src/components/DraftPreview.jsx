// this component is responsible for rendering the draft preview.
// src/components/DraftPreview.jsx
import { useState, useEffect } from 'react';

export default function DraftPreview({ draft, isLoading, error }) {
  const [editableDraft, setEditableDraft] = useState(draft);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setEditableDraft(draft);
  }, [draft]);

  const handleCopy = async () => {
    if (!editableDraft) return;
    try {
      await navigator.clipboard.writeText(editableDraft);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col h-full min-h-[480px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Generated Draft</h2>
          <p className="text-xs text-slate-500">Review or edit before copying.</p>
        </div>

        {editableDraft && (
          <button
            type="button"
            onClick={handleCopy}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              isCopied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isCopied ? 'Copied to Clipboard' : 'Copy Email'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 py-12">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>          <p className="text-xs">Generating formal draft...</p>
        </div>
      ) : editableDraft ? (
        <textarea
        className="w-full flex-1 rounded-md border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 font-mono resize-none focus:outline-hidden focus:ring-1 focus:ring-brand"
        value={editableDraft}
        onChange={(e) => setEditableDraft(e.target.value)}
        rows={16}
        aria-label="Generated email draft"
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 border border-dashed border-slate-200 rounded-lg">
          <p className="text-xs max-w-xs">
            Fill in your email details on the left and click <strong>Generate Email</strong> to see your draft here.
          </p>
        </div>
      )}
    </section>
  );
}