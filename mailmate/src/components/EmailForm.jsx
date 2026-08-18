// this component is responsible for rendering the email form and handling user input. 
// src/components/EmailForm.jsx
import { useState } from 'react';
import { TONE_OPTIONS, EMAIL_REASONS, REASON_HINTS } from '../constants/formOptions';

const INITIAL_FORM = {
  studentName: '',
  studentId: '',
  professorName: '',
  courseName: '',
  reasonType: EMAIL_REASONS[0],
  customDetails: '',
  tone: TONE_OPTIONS[0].label,
};

export default function EmailForm({ onGenerate, isLoading }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(form);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
  };

  // Shared input style to keep code clean and uniform
 const inputStyles =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-brand focus:outline-hidden focus:ring-1 focus:ring-brand transition";

  const labelStyles = "block text-xs font-medium text-slate-700 mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-4"
    >
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-semibold text-slate-900">Email Parameters</h2>
        <p className="text-xs text-slate-500">Provide the required context for the draft.</p>
      </div>

      {/* Student Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="studentName" className={labelStyles}>Your Name</label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            placeholder="e.g., Sarah Ahmad"
            value={form.studentName}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="studentId" className={labelStyles}>Student ID</label>
          <input
            id="studentId"
            name="studentId"
            type="text"
            placeholder="e.g., 44102938"
            value={form.studentId}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>
      </div>

      {/* Recipient & Course */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="professorName" className={labelStyles}>Recipient / Professor</label>
          <input
            id="professorName"
            name="professorName"
            type="text"
            placeholder="e.g., Dr. Al-Mansoor"
            value={form.professorName}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="courseName" className={labelStyles}>Course Name / Code</label>
          <input
            id="courseName"
            name="courseName"
            type="text"
            placeholder="e.g., CS101 - Algorithms"
            value={form.courseName}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>
      </div>

      {/* Purpose & Tone Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="reasonType" className={labelStyles}>Purpose</label>
          <select
            id="reasonType"
            name="reasonType"
            value={form.reasonType}
            onChange={handleChange}
            className={inputStyles}
          >
            {EMAIL_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tone" className={labelStyles}>Tone</label>
          <select
            id="tone"
            name="tone"
            value={form.tone}
            onChange={handleChange}
            className={inputStyles}
          >
            {TONE_OPTIONS.map((item) => (
              <option key={item.id} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Context / Details */}
      <div>
        <label htmlFor="customDetails" className={labelStyles}>Specific Context</label>
        <textarea
          id="customDetails"
          name="customDetails"
          rows={4}
          placeholder={REASON_HINTS[form.reasonType] || "Enter specific details..."}
          value={form.customDetails}
          onChange={handleChange}
          required
          className={inputStyles}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
        >
          Reset
        </button>
        <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 rounded-md text-xs font-semibold text-white bg-brand hover:bg-brand-hover shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
            {isLoading ? 'Generating Draft...' : 'Generate Email'}
            </button>
      </div>
    </form>
  );
}