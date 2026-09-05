// this component is responsible for rendering the email form and handling user input. 
// src/components/EmailForm.jsx
import { useState, useEffect } from 'react';
import { TONE_OPTIONS, EMAIL_REASONS, REASON_HINTS } from '../constants/formOptions';

export default function EmailForm({ onGenerate, isLoading, lang, t }) {
  const [form, setForm] = useState({
    studentName: '',
    studentId: '',
    professorName: '',
    courseName: '',
    reasonType: EMAIL_REASONS[lang][0],
    customDetails: '',
    tone: TONE_OPTIONS[lang][0].label,
  });

  // When language flips, update default dropdown selections to match
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      reasonType: EMAIL_REASONS[lang][0],
      tone: TONE_OPTIONS[lang][0].label,
    }));
  }, [lang]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ ...form, language: lang === 'ar' ? 'Arabic' : 'English' });
  };

  const handleReset = () => {
    setForm({
      studentName: '',
      studentId: '',
      professorName: '',
      courseName: '',
      reasonType: EMAIL_REASONS[lang][0],
      customDetails: '',
      tone: TONE_OPTIONS[lang][0].label,
    });
  };

  const inputStyles =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-brand focus:outline-hidden focus:ring-1 focus:ring-brand transition";

  const labelStyles = "block text-xs font-medium text-slate-700 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4"
    >
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-semibold text-slate-900">{t.formTitle}</h2>
        <p className="text-xs text-slate-500">{t.formSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="studentName" className={labelStyles}>{t.yourName}</label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            placeholder={t.namePlaceholder}
            value={form.studentName}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="studentId" className={labelStyles}>{t.studentId}</label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            placeholder={t.idPlaceholder}
            value={form.studentId}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="professorName" className={labelStyles}>{t.recipient}</label>
          <input
            id="professorName"
            name="professorName"
            type="text"
            placeholder={t.recipientPlaceholder}
            value={form.professorName}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="courseName" className={labelStyles}>{t.course}</label>
          <input
            id="courseName"
            name="courseName"
            type="text"
            placeholder={t.coursePlaceholder}
            value={form.courseName}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="reasonType" className={labelStyles}>{t.purpose}</label>
          <select
            id="reasonType"
            name="reasonType"
            value={form.reasonType}
            onChange={handleChange}
            className={inputStyles}
          >
            {EMAIL_REASONS[lang].map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tone" className={labelStyles}>{t.tone}</label>
          <select
            id="tone"
            name="tone"
            value={form.tone}
            onChange={handleChange}
            className={inputStyles}
          >
            {TONE_OPTIONS[lang].map((item) => (
              <option key={item.id} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="customDetails" className={labelStyles}>{t.context}</label>
        <textarea
          id="customDetails"
          name="customDetails"
          rows={4}
          placeholder={REASON_HINTS[lang][form.reasonType] || ''}
          value={form.customDetails}
          onChange={handleChange}
          required
          className={inputStyles}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
        >
          {t.resetBtn}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 rounded-md text-xs font-semibold text-white bg-brand hover:bg-brand-hover shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? t.generatingBtn : t.generateBtn}
        </button>
      </div>
    </form>
  );
}