
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, Quiz, Level, Department } from '@/types';
import Layout from '@/components/Layout';
import AdminPanel from '@/components/AdminPanel';
import StudentPortal from '@/components/StudentPortal';
import QuizPlayer from '@/components/QuizPlayer';
import QuizReview from '@/components/QuizReview';
import AuthForm from '@/components/AuthForm';
import Footer from '@/components/Footer';
import { auth } from '@/services/firebase';
import { fetchQuizzesFromFirestore, deleteQuizFromFirestore } from '@/services/dbService';

type AppState = 'HOME' | 'ADMIN_LOGIN' | 'STUDENT_AUTH' | 'DASHBOARD' | 'QUIZ' | 'REVIEW' | 'ABOUT' | 'CONTACT' | 'FEATURES';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppState>('HOME');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [reviewData, setReviewData] = useState<{ quiz: Quiz; answers: number[]; score: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchQuizzesFromFirestore();
      setQuizzes(data);
    } catch (e: any) {
      console.error("Firestore Load Error:", e);
      if (e.message?.toLowerCase().includes("permission")) {
        setErrorMsg("Firestore Security Alert: Your database rules are either too restrictive or insecurely public. For a secure production environment, please go to the Firebase Console > Firestore Database > Rules and use a structured policy. \n\nRecommended Secure Rules:\nservice cloud.firestore { match /databases/{database}/documents { match /quizzes/{quiz} { allow read: if true; allow write: if request.auth != null; } } }");
      } else {
        setErrorMsg(`Failed to sync data: ${e.message || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ 
          role: 'student', 
          name: firebaseUser.displayName || firebaseUser.email || 'Student' 
        });
        setView('DASHBOARD');
      }
    });
    
    loadData();
    return () => unsubscribe();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credentials updated to Citadelcbt and citadel1
    if (adminUsername === 'Citadelcbt' && adminPassword === 'citadel1') {
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
      try {
        await deleteQuizFromFirestore(id);
        setQuizzes(quizzes.filter(q => q.id !== id));
      } catch (e: any) {
        alert(`Delete failed: ${e.message || "Insufficient permissions."}`);
      }
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
          <i className="fas fa-circle-notch fa-spin text-4xl text-indigo-500"></i>
          <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Preparing Your Learning Experience...</p>
        </div>
      </div>
    );
  }

  const renderPublicView = (content: React.ReactNode) => (
    <div className="min-h-screen bg-slate-900 flex flex-col text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
      </div>
      
      <nav className="relative z-20 px-6 py-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div onClick={() => setView('HOME')} className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl shadow-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <i className="fas fa-landmark"></i>
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">CITADEL <span className="text-indigo-500">CBT</span></h1>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-xs font-black uppercase tracking-widest">
          <button onClick={() => setView('FEATURES')} className="hover:text-indigo-400 transition-colors">Features</button>
          <button onClick={() => setView('ABOUT')} className="hover:text-indigo-400 transition-colors">About</button>
          <button onClick={() => setView('CONTACT')} className="hover:text-indigo-400 transition-colors">Contact</button>
          {user ? (
            <button onClick={() => setView('DASHBOARD')} className="bg-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Dashboard</button>
          ) : (
            <button onClick={() => setView('STUDENT_AUTH')} className="bg-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Get Started</button>
          )}
        </div>
        <button onClick={() => setView(user ? 'DASHBOARD' : 'STUDENT_AUTH')} className="md:hidden w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
          <i className={`fas ${user ? 'fa-th-large' : 'fa-sign-in-alt'}`}></i>
        </button>
      </nav>

      <div className="relative z-10 flex-grow">
        {content}
      </div>

      <Footer onNavigate={setView} />
    </div>
  );

  if (view === 'HOME') {
    return renderPublicView(
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center space-y-16">
        <div className="space-y-6 animate-fadeIn">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <i className="fas fa-star mr-2"></i> The #1 Choice for Nigerian Students
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl">
            Master Your Exams with <span className="text-indigo-500">Precision</span> & Confidence
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
            Experience the most advanced computer-based testing environment designed to help you excel in WAEC, JAMB, and BECE examinations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={() => setView('STUDENT_AUTH')}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:-translate-y-1 shadow-2xl shadow-indigo-600/40"
            >
              Start Practicing Now
            </button>
            <button 
              onClick={() => setView('FEATURES')}
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-sm transition-all"
            >
              Explore Features
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: 'fa-bolt', title: 'Real Simulation', desc: 'Experience the exact interface and timing of national examinations.' },
            { icon: 'fa-chart-line', title: 'Deep Analytics', desc: 'Understand your strengths and weaknesses with detailed performance reports.' },
            { icon: 'fa-book-open', title: 'Expert Content', desc: 'Access thousands of questions curated by top academic professionals.' }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl text-left space-y-4 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center text-xl">
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="w-full bg-indigo-600 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="text-left space-y-6 max-w-xl">
            <h3 className="text-3xl md:text-5xl font-black leading-tight">Ready to join the elite?</h3>
            <p className="text-indigo-100 text-lg opacity-80">
              Join thousands of students who have transformed their academic results using the Citadel CBT platform.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    <img src={`https://picsum.photos/seed/${i+10}/100/100`} className="w-full h-full rounded-full object-cover" alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Joined by 5,000+ Students</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button 
              onClick={() => setView('STUDENT_AUTH')}
              className="px-12 py-6 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl"
            >
              Create Free Account
            </button>
            <button 
              onClick={() => setView('ADMIN_LOGIN')}
              className="text-indigo-200 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Administrator Access <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'FEATURES') {
    return renderPublicView(
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-5xl font-black uppercase tracking-tighter">Advanced <span className="text-indigo-500">Features</span></h2>
          <p className="text-slate-400 text-lg">Everything you need to succeed in your examinations, built into a single powerful platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { icon: 'fa-clock', title: 'Timed Simulations', desc: 'Practice under real exam conditions with our precise timing engine that mimics WAEC and JAMB standards.' },
            { icon: 'fa-list-check', title: 'Curriculum Aligned', desc: 'Our question bank is strictly aligned with the latest Nigerian educational curriculum for Junior and Senior Secondary schools.' },
            { icon: 'fa-magnifying-glass-chart', title: 'Instant Feedback', desc: 'Get your results immediately after completion with detailed explanations for every single question.' },
            { icon: 'fa-shield-check', title: 'Secure Environment', desc: 'A distraction-free, secure testing environment that helps you focus entirely on your performance.' },
            { icon: 'fa-mobile-screen', title: 'Multi-Device Access', desc: 'Practice on your laptop, tablet, or smartphone. Your progress is synced across all your devices.' },
            { icon: 'fa-users-gear', title: 'Personalized Learning', desc: 'The system identifies your weak areas and suggests specific topics for you to focus on more.' }
          ].map((feature, i) => (
            <div key={i} className="flex gap-6 p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all">
              <div className="shrink-0 w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/20">
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'ABOUT') {
    return renderPublicView(
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight">Our Mission for <span className="text-indigo-500">Excellence</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Citadel CBT was founded with a single vision: to bridge the gap between traditional learning and the modern digital examination landscape in Nigeria.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                  <i className="fas fa-check text-[10px]"></i>
                </div>
                <p className="text-slate-300 font-medium">Providing accessible, high-quality practice materials for all students.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                  <i className="fas fa-check text-[10px]"></i>
                </div>
                <p className="text-slate-300 font-medium">Empowering educators with tools to track and improve student performance.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                  <i className="fas fa-check text-[10px]"></i>
                </div>
                <p className="text-slate-300 font-medium">Standardizing examination preparation across the federation.</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-600/20 border-8 border-white/5">
              <img src="https://picsum.photos/seed/citadel-about/800/800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Citadel Campus" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-indigo-600 p-8 rounded-3xl shadow-2xl hidden md:block">
              <p className="text-4xl font-black">10+</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Years of Excellence</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-[3rem] p-12 md:p-20 text-center space-y-12 border border-white/10">
          <h3 className="text-3xl font-black uppercase tracking-tight">The Citadel Standard</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Students Helped', value: '50k+' },
              { label: 'Exams Passed', value: '120k+' },
              { label: 'Question Bank', value: '25k+' },
              { label: 'Success Rate', value: '98%' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl font-black text-indigo-500">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'CONTACT') {
    return renderPublicView(
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-black uppercase tracking-tighter">Get in <span className="text-indigo-500">Touch</span></h2>
              <p className="text-slate-400 text-lg">Have questions or need technical assistance? Our dedicated support team is here to help you succeed.</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 transition-colors">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email Us</p>
                  <p className="text-xl font-bold">support@citadelcbt.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 transition-colors">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Call Us</p>
                  <p className="text-xl font-bold">+234 800 CITADEL</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-600 transition-colors">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Visit Us</p>
                  <p className="text-xl font-bold">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-10 text-slate-900 shadow-2xl">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-bold" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-bold" placeholder="john@example.com" required />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-bold" placeholder="How can we help?" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message</label>
                <textarea rows={4} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-bold resize-none" placeholder="Your message here..." required></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-indigo-500 transition-all hover:-translate-y-1">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'STUDENT_AUTH') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
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
    <Layout user={user!} onLogout={logout} onNavigate={setView}>
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
                  <p className="text-gray-500 font-medium">Manage WAEC, JAMB, and BECE standard technical examinations.</p>
                </div>
              </div>
              
              <AdminPanel onQuizCreated={(q) => setQuizzes([q, ...quizzes])} />

              <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center">
                    <i className="fas fa-folder-open text-indigo-600 mr-3"></i>
                    Examination Bank ({quizzes.length})
                  </h2>
                  <button onClick={loadData} className="text-indigo-600 hover:rotate-180 transition-transform duration-500 p-2">
                    <i className="fas fa-sync-alt"></i>
                  </button>
                </div>

                {errorMsg && (
                  <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-start">
                    <i className="fas fa-exclamation-circle mt-1 mr-4 text-xl"></i>
                    <div>
                      <p className="uppercase tracking-widest mb-1">Sync Error Detected</p>
                      <p className="font-medium opacity-80">{errorMsg}</p>
                    </div>
                  </div>
                )}

                {quizzes.length === 0 && !errorMsg ? (
                  <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 italic font-medium">Examination bank is currently empty. Use the Generator above.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-gray-400 text-[10px] font-black uppercase tracking-widest">
                          <th className="py-4 px-6">Curriculum Domain</th>
                          <th className="py-4 px-6">Standard Tier</th>
                          <th className="py-4 px-6 text-center">Question Vol.</th>
                          <th className="py-4 px-6 text-right">Actions</th>
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
                                title="Remove from Bank"
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
