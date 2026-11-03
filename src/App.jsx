import { useState, useEffect } from 'react';
import Header from './components/Header';
import EmailForm from './components/EmailForm';
import DraftPreview from './components/DraftPreview';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { generateAcademicEmail } from './services/llm';
import { supabase } from './services/supabaseClient'; 
import { TRANSLATIONS } from './constants/translations';

export default function App() {
  // --- UI & Content States ---
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Supabase Authentication & Profile States ---
  const [session, setSession] = useState(null);         // Stores active user session
  const [profile, setProfile] = useState(null);         // Stores user profile (name, student ID)
  const [isAuthOpen, setIsAuthOpen] = useState(false);  // Controls login modal visibility

  const t = TRANSLATIONS[lang];

  // --- Direction & Language Handler ---
  // Updates document direction: LTR for English, RTL for Arabic
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // --- Supabase Session Listener ---
  // Checks active session on load and listens for sign-in / sign-out changes
  useEffect(() => {
    // 1. Initial session check on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    });

    // 2. Real-time auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null); // Clear profile when signed out
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Fetch Profile Details ---
  // Reads saved name and student ID to autofill form inputs
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, student_id')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  // --- Authentication Handlers ---
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  // --- Generation & Database Save Handler ---
  // Calls LLM to generate email and saves output to Supabase if logged in
  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Generate email draft via LLM service
      const generatedDraft = await generateAcademicEmail(formData);
      setDraft(generatedDraft);

      // 2. Save generation history to database if authenticated
      if (session?.user) {
        await supabase.from('generations').insert([
          {
            user_id: session.user.id,
            recipient: formData.recipient || formData.recipientName,
            course_name: formData.courseName || formData.course,
            purpose: formData.purpose,
            tone: formData.tone,
            specific_context: formData.specificContext || formData.context,
            generated_draft: generatedDraft,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error generating email draft.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Layout Render ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-200">
      {/* Top Navigation Bar with Language Toggle & Auth Buttons */}
      <Header 
        lang={lang} 
        onToggleLanguage={toggleLanguage} 
        t={t} 
        session={session}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Form & Live Preview Area */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Form on the left with autofilled user profile */}
          <EmailForm 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
            lang={lang} 
            t={t} 
            profile={profile}
          />
          {/* Draft preview on the right */}
          <DraftPreview 
            draft={draft} 
            isLoading={isLoading} 
            error={error} 
            t={t} 
          />
        </div>
      </main>

      {/* Page Footer */}
      <Footer t={t} />

      {/* Login / Registration Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        lang={lang}
      />
    </div>
  );
}