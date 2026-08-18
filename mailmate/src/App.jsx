
import { useState } from 'react';
import Header from './components/Header';
import EmailForm from './components/EmailForm';
import DraftPreview from './components/DraftPreview';

export default function App() {
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const generatedText = `Subject: [${formData.courseName}] ${formData.reasonType} - ${formData.studentName} (${formData.studentId})

Dear Professor ${formData.professorName},

I hope this email finds you well.

My name is ${formData.studentName} (Student ID: ${formData.studentId}), and I am a student in your ${formData.courseName} course.

I am writing to respectfully inquire regarding: ${formData.customDetails}

Thank you for your time and guidance.

Sincerely,
${formData.studentName}
Student ID: ${formData.studentId}`;

      setDraft(generatedText);
    } catch (err) {
      setError('An error occurred while generating the email draft.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <EmailForm onGenerate={handleGenerate} isLoading={isLoading} />
          <DraftPreview draft={draft} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
}


