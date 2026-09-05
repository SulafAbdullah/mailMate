
// import { useState } from 'react';
// import Header from './components/Header';
// import EmailForm from './components/EmailForm';
// import DraftPreview from './components/DraftPreview';

// export default function App() {
//   const [draft, setDraft] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleGenerate = async (formData) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       const generatedText = `Subject: [${formData.courseName}] ${formData.reasonType} - ${formData.studentName} (${formData.studentId})

// Dear Professor ${formData.professorName},

// I hope this email finds you well.

// My name is ${formData.studentName} (Student ID: ${formData.studentId}), and I am a student in your ${formData.courseName} course.

// I am writing to respectfully inquire regarding: ${formData.customDetails}

// Thank you for your time and guidance.

// Sincerely,
// ${formData.studentName}
// Student ID: ${formData.studentId}`;

//       setDraft(generatedText);
//     } catch (err) {
//       setError('An error occurred while generating the email draft.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <Header />
//       <main className="max-w-6xl mx-auto px-4 pb-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
//           <EmailForm onGenerate={handleGenerate} isLoading={isLoading} />
//           <DraftPreview draft={draft} isLoading={isLoading} error={error} />
//         </div>
//       </main>
//     </div>
//   );
// }

// src/App.jsx
import { useState, useEffect } from 'react';
import Header from './components/Header';
import EmailForm from './components/EmailForm';
import DraftPreview from './components/DraftPreview';
import { generateAcademicEmail } from './services/llm';
import { TRANSLATIONS } from './constants/translations';

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = TRANSLATIONS[lang];

  // Dynamically set HTML document direction (LTR for EN, RTL for AR)
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const generatedDraft = await generateAcademicEmail(formData);
      setDraft(generatedDraft);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error generating email draft.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-200">
      <Header lang={lang} onToggleLanguage={toggleLanguage} t={t} />
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <EmailForm onGenerate={handleGenerate} isLoading={isLoading} lang={lang} t={t} />
          <DraftPreview draft={draft} isLoading={isLoading} error={error} t={t} />
        </div>
      </main>
    </div>
  );
}