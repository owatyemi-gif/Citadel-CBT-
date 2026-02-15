
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, Quiz, Level, Department } from './types';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import StudentPortal from './components/StudentPortal';
import QuizPlayer from './components/QuizPlayer';
import QuizReview from './components/QuizReview';
import AuthForm from './components/AuthForm';
import { auth } from './services/firebase';
import { fetchQuizzesFromFirestore, deleteQuizFromFirestore } from './services/dbService';

type AppState = 'HOME' | 'ADMIN_LOGIN' | 'STUDENT_AUTH' | 'DASHBOARD' | 'QUIZ' | 'REVIEW';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppState>('HOME');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [reviewData, setReviewData] = useState<{ quiz: Quiz; answers: number[]; score: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Admin Login State (Local override for admin role)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Fetch quizzes from Firestore
  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchQuizzesFromFirestore();
    setQuizzes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // If it's a student (logged in via Firebase)
        setUser({ 
          role: 'student', 
          name: firebaseUser.displayName || firebaseUser.email || 'Student' 
        });
        setView('DASHBOARD');
      }
      setIsLoading(false);
    });
    
    loadData();
    return () => unsubscribe();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'Citadelcbt' && adminPassword === 'Citadel@1') {
      setUser({ role: 'admin', name: 'Academic Director' });
      setView('DASHBOARD');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Credentials');
    }
  };

  const handleStartQuiz = (quiz: Quiz, count: number) => {
    const slicedQuestions = [...quiz.questions].sort(() => 0.5 - Math.random()).slice(0, count);
    setActiveQuiz({ ...quiz, questions: slicedQuestions });
    setView('QUIZ');
  };

  const handleCompleteQuiz = (score: number, answers: number[]) => {
    if (activeQuiz) {
      setReviewData({ quiz: activeQuiz, answers, score });
      setView('REVIEW');
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm('Confirm purging this exam from the cloud registry?')) {
      await deleteQuizFromFirestore(id);
      setQuizzes(quizzes.filter(q => q.id !== id));
    }
  };

  const logout = async () => {
    if (user?.role === 'student') {
      await signOut(auth);
    }
    setUser(null);
    setView('HOME');
    setAdminUsername('');
    setAdminPassword('');
    setActiveQuiz(null);
    setReviewData(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <i className="fas fa-atom fa-spin text-4xl text-indigo-500"></i>
          <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Initializing Neural Links...</p>
        </div>
      </div>
    );
  }

  if (view === 'HOME') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4 animate-fadeIn">
            <div className="inline-flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center text-3xl">
                <i className="fas fa-landmark"></i>
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase">CITADEL <span className="text-indigo-500">CBT</span></h1>
            </div>
            <h2 className="text-3xl font-light text-slate-400">Advanced Academic Assessment Infrastructure</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              A premium technical testing environment powered by artificial intelligence, engineered for the Nigerian BECE, WAEC, and JAMB curriculum standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={() => setView('STUDENT_AUTH')}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 p-10 rounded-3xl transition-all hover:-translate-y-2 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Student Portal</h3>
              <p className="text-slate-500 text-sm">Sign in to access technical exams and review expert solution paths.</p>
            </button>

            <button 
              onClick={() => setView('ADMIN_LOGIN')}
              className="group bg-indigo-600 hover:bg-indigo-500 p-10 rounded-3xl transition-all hover:-translate-y-2 flex flex-col items-center text-center space-y-4 shadow-2xl shadow-indigo-600/20"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                <i className="fas fa-shield-halved"></i>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Admin Access</h3>
              <p className="text-indigo-200 text-sm">Manage curriculum banks and generate technical assessments.</p>
            </button>
          </div>

          <div className="pt-10 flex items-center justify-center space-x-12 opacity-30 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-2"><i className="fas fa-database"></i> <span className="text-[10px] font-black uppercase tracking-widest">Cloud Database</span></div>
            <div className="flex items-center space-x-2"><i className="fas fa-brain"></i> <span className="text-[10px] font-black uppercase tracking-widest">AI Matrix</span></div>
            <div className="flex items-center space-x-2"><i className="fas fa-lock"></i> <span className="text-[10px] font-black uppercase tracking-widest">Secure Auth</span></div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'STUDENT_AUTH') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <AuthForm 
          onSuccess={(u) => { 
            setUser({ role: 'student', name: u.displayName || u.email }); 
            setView('DASHBOARD');
            loadData();
          }} 
          onBack={() => setView('HOME')} 
        />
      </div>
    );
  }

  if (view === 'ADMIN_LOGIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full animate-fadeIn">
          <button onClick={() => setView('HOME')} className="text-slate-400 hover:text-slate-600 mb-8 flex items-center text-sm font-bold">
            <i className="fas fa-arrow-left mr-2"></i> Back to Home
          </button>
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-shield-halved text-3xl"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Admin Login</h1>
            <p className="text-gray-500 text-sm">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Administrator ID</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-bold"
                  placeholder="Username"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Security Key</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-bold"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center italic">{loginError}</p>}
            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1"
            >
              Verify Credentials
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user!} onLogout={logout}>
      {view === 'QUIZ' && activeQuiz ? (
        <QuizPlayer 
          quiz={activeQuiz} 
          onComplete={handleCompleteQuiz}
          onCancel={() => setView('DASHBOARD')}
        />
      ) : view === 'REVIEW' && reviewData ? (
        <QuizReview 
          quiz={reviewData.quiz}
          userAnswers={reviewData.answers}
          score={reviewData.score}
          onClose={() => setView('DASHBOARD')}
        />
      ) : (
        <div className="animate-fadeIn">
          {user?.role === 'admin' ? (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-10 gap-6">
                <div className="space-y-2">
                  <div className="px-3 py-1 bg-indigo-600 text-white inline-block rounded text-[10px] font-black uppercase tracking-widest mb-2">Citadel Central Command</div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Academic Dashboard</h1>
                  <p className="text-gray-500 font-medium">Manage WAEC, JAMB, and BECE standard technical examinations (Synced to Firestore).</p>
                </div>
              </div>
              
              <AdminPanel onQuizCreated={(q) => setQuizzes([q, ...quizzes])} />

              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center">
                    <i className="fas fa-database text-indigo-600 mr-3"></i>
                    Cloud Registry ({quizzes.length})
                  </h2>
                  <button onClick={loadData} className="text-indigo-600 hover:rotate-180 transition-transform duration-500">
                    <i className="fas fa-sync-alt"></i>
                  </button>
                </div>
                {quizzes.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 italic font-medium">Registry is currently empty. Use the Research Engine above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-gray-400 text-[10px] font-black uppercase tracking-widest">
                          <th className="py-4 px-6">Curriculum Domain</th>
                          <th className="py-4 px-6">Standard Tier</th>
                          <th className="py-4 px-6 text-center">Question Vol.</th>
                          <th className="py-4 px-6 text-right">Registry Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizzes.map(q => (
                          <tr key={q.id} className="border-b hover:bg-slate-50 transition-colors group">
                            <td className="py-6 px-6">
                              <p className="font-black text-slate-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{q.subject}</p>
                              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{q.topic}</p>
                            </td>
                            <td className="py-6 px-6">
                              <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm">
                                {q.level} • {q.department ? q.department : 'General'}
                              </span>
                            </td>
                            <td className="py-6 px-6 text-center">
                              <span className="font-black text-slate-800 bg-gray-100 px-3 py-1 rounded-full text-sm">{q.questions.length}</span>
                            </td>
                            <td className="py-6 px-6 text-right">
                              <button 
                                onClick={() => handleDeleteQuiz(q.id)}
                                className="w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center mx-auto md:ml-auto group/del shadow-sm hover:shadow-red-200"
                                title="Purge from Registry"
                              >
                                <i className="fas fa-trash-alt group-hover/del:animate-pulse"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <StudentPortal quizzes={quizzes} onStartQuiz={handleStartQuiz} />
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
