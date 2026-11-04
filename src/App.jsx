import { useState, useEffect } from 'react';
import Header from './components/Header';
import EmailForm from './components/EmailForm';
import DraftPreview from './components/DraftPreview';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HistoryDrawer from './components/HistoryDrawer';
import { generateAcademicEmail } from './services/llm';
import { supabase } from './services/supabaseClient'; 
import { fetchUserGenerations, deleteGeneration } from './services/history';
import { TRANSLATIONS } from './constants/translations';

export default function App() {
  // UI & Content States 
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 

  // Supabase Authentication & Profile States
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  // Direction & Language Handler 
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Fetch History whenever session changes
  useEffect(() => {
    if (session?.user) {
      fetchUserGenerations().then(setHistory).catch(console.error);
    } else {
      setHistory([]);
    }
  }, [session?.user]);

  // Supabase Session Listener 
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Profile Details 
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

  // Authentication Handlers 
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  // Generation & Database Save Handler 
  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Generate email draft via LLM service
      const generatedDraft = await generateAcademicEmail(formData);
      setDraft(generatedDraft);

      // 2. Save generation to database and update history immediately
      if (session?.user) {
        const { data: newRow, error: insertError } = await supabase
          .from('generations')
          .insert([
            {
              user_id: session.user.id,
              recipient: formData.recipient || formData.recipientName || formData.professorName,
              course_name: formData.courseName || formData.course,
              purpose: formData.purpose || formData.reasonType,
              tone: formData.tone,
              specific_context: formData.specificContext || formData.context || formData.customDetails,
              generated_draft: generatedDraft,
            },
          ])
          .select()
          .single();

        if (!insertError && newRow) {
          setHistory((prev) => [newRow, ...prev]);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error generating email draft.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-200">
      {/* Top Navigation Bar with Language Toggle & Auth Buttons */}
      <Header 
        lang={lang} 
        onToggleLanguage={toggleLanguage} 
        t={t} 
        session={session}
        profile={profile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Form & Live Preview Area */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <EmailForm 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
            lang={lang} 
            t={t} 
            profile={profile}
          />
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

      {/* History Drawer */}
      <HistoryDrawer
      isOpen={isHistoryOpen}
      onClose={() => setIsHistoryOpen(false)}
      history={history}
      lang={lang}
      onSelectDraft={(item) => {
        setDraft(item.generated_draft);
      }}
      onDeleteDraft={async (id) => {
        try {
          await deleteGeneration(id);
          setHistory((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
          console.error('Failed to delete draft:', err);
        }
      }}
    />
    </div>
  );
}