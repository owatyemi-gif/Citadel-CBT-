
import React, { useState, useEffect } from 'react';
import { generateQuizQuestions, fetchCurriculumTopics } from '../services/geminiService';
import { saveQuizToFirestore } from '../services/dbService';
import { Level, Quiz, Question } from '../types';
import { JSS_SUBJECTS, ALL_SSS_SUBJECTS, GET_DEPT_FOR_SSS } from '../constants';
import AdminManagement from './AdminManagement';
import { 
  LayoutGrid, 
  PlusCircle, 
  Database, 
  Settings, 
  Search, 
  Zap, 
  Trash2, 
  RefreshCw,
  BookOpen,
  Microscope,
  Layers,
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface AdminPanelProps {
  onQuizCreated: (quiz: Quiz) => void;
  currentUser: { name: string; username?: string };
  quizzes: Quiz[];
  onDeleteQuiz: (id: string) => void;
  onRefresh: () => void;
  errorMsg: string | null;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onQuizCreated, 
  currentUser, 
  quizzes, 
  onDeleteQuiz, 
  onRefresh,
  errorMsg 
}) => {
  const [activeTab, setActiveTab] = useState<'GENERATOR' | 'REGISTRY' | 'ADMINS'>('GENERATOR');
  const [level, setLevel] = useState<Level>(Level.JSS);
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [qCount, setQCount] = useState(100);
  const [isFetchingTopics, setIsFetchingTopics] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');

  const subjects = level === Level.JSS ? JSS_SUBJECTS : ALL_SSS_SUBJECTS;

  useEffect(() => {
    if (subject) {
      handleFetchTopics();
    } else {
      setTopics([]);
      setSelectedTopic('');
    }
  }, [subject, level]);

  const handleFetchTopics = async () => {
    setError('');
    setIsFetchingTopics(true);
    setTopics([]);
    setSelectedTopic('');
    try {
      const curriculumTopics = await fetchCurriculumTopics(level, subject);
      setTopics(curriculumTopics);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch curriculum topics.');
    } finally {
      setIsFetchingTopics(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !selectedTopic) {
      setError('Please select both a subject and a specific curriculum topic.');
      return;
    }

    setError('');
    setIsGenerating(true);
    setGeneratedQuestions([]);

    try {
      const questions = await generateQuizQuestions(level, subject, selectedTopic, qCount);
      setGeneratedQuestions(questions);
    } catch (err) {
      console.error(err);
      setError('Failed to generate questions for the selected topic.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    setError('');
    setIsGenerating(true);
    try {
      const curriculumTitle = level === Level.SSS ? 'WAEC/JAMB Standard' : 'BECE (Junior WAEC) Standard';
      const newQuiz: Quiz = {
        id: '', // Firestore will assign this
        title: `${subject}: ${selectedTopic}`,
        subject,
        level,
        topic: selectedTopic,
        department: level === Level.SSS ? GET_DEPT_FOR_SSS(subject) : undefined,
        questions: generatedQuestions,
        createdAt: Date.now(),
      };
      
      const savedId = await saveQuizToFirestore(newQuiz);
      onQuizCreated({ ...newQuiz, id: savedId });
      
      setGeneratedQuestions([]);
      setSubject('');
      setSelectedTopic('');
    } catch (err) {
      setError('Failed to save quiz to cloud database.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Admin Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-10">
        <div className="space-y-2">
          <div className="px-3 py-1 bg-indigo-600 text-white inline-block rounded text-[10px] font-black uppercase tracking-[0.2em] mb-2">Citadel Central Command</div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Academic Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage WAEC, JAMB, and BECE standard technical examinations.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] self-start md:self-center">
          {[
            { id: 'GENERATOR', icon: PlusCircle, label: 'Generator' },
            { id: 'REGISTRY', icon: Database, label: 'Registry' },
            { id: 'ADMINS', icon: Settings, label: 'Access Control' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-600/5' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ADMINS' && <AdminManagement currentUser={currentUser} />}

      {activeTab === 'GENERATOR' && (
        <div className="space-y-12">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 md:p-16 border border-slate-50 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
              <Microscope size={320} />
            </div>
            
            <div className="relative z-10 max-w-4xl">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/20">
                  <Zap size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Content Architect</h2>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Build technical assessments from the national curriculum</p>
                </div>
              </div>
              
              <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Grade Tier</label>
                  <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button
                      type="button"
                      onClick={() => setLevel(Level.JSS)}
                      className={`flex-1 py-4 px-6 rounded-xl text-xs font-black transition-all tracking-widest uppercase ${level === Level.JSS ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                      Junior (JSS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevel(Level.SSS)}
                      className={`flex-1 py-4 px-6 rounded-xl text-xs font-black transition-all tracking-widest uppercase ${level === Level.SSS ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-500'}`}
                    >
                      Senior (SSS)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Subject Domain</label>
                  <div className="relative">
                    <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-5 focus:border-indigo-600 focus:bg-white focus:outline-none font-bold text-slate-800 appearance-none cursor-pointer transition-all"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Curriculum Topic
                    {isFetchingTopics && <RefreshCw className="inline-block ml-3 text-indigo-400 animate-spin" size={12} />}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <select
                      value={selectedTopic}
                      disabled={!subject || isFetchingTopics}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-5 focus:border-indigo-600 focus:bg-white focus:outline-none font-bold text-slate-800 appearance-none cursor-pointer transition-all ${(!subject || isFetchingTopics) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">{isFetchingTopics ? 'Scanning Curriculum...' : 'Pick Topic'}</option>
                      {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Item Volume</label>
                  <div className="relative">
                    <Layers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={qCount}
                      onChange={(e) => setQCount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-5 focus:border-indigo-600 focus:bg-white focus:outline-none font-black text-indigo-600 text-xl transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={isGenerating || !selectedTopic}
                    className={`px-16 py-6 rounded-2xl bg-slate-900 text-white font-black shadow-2xl hover:bg-slate-800 transition-all flex items-center uppercase tracking-[0.2em] text-xs ${isGenerating || !selectedTopic ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:scale-95 shadow-indigo-600/10'}`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-3 text-indigo-400 animate-spin" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-3 text-indigo-400" size={18} fill="currentColor" />
                        Build Assessment
                      </>
                    )}
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-10 p-6 bg-red-50 border border-red-100 text-red-600 rounded-[1.5rem] flex items-center animate-fadeIn">
                  <ShieldAlert className="mr-4" size={24} />
                  <span className="font-bold text-xs uppercase tracking-widest">{error}</span>
                </div>
              )}
            </div>
          </div>

          {generatedQuestions.length > 0 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/20">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black flex items-center uppercase tracking-tighter">
                    <CheckCircle2 className="text-indigo-400 mr-4" size={32} />
                    Assessment Staged
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Registry Target: {selectedTopic}
                  </p>
                </div>
                <button 
                  onClick={handleSaveQuiz}
                  disabled={isGenerating}
                  className="px-12 py-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isGenerating ? 'Archiving...' : 'Save to Library'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 pb-20">
                {generatedQuestions.map((q, idx) => (
                  <div key={q.id} className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center space-x-4">
                        <span className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-xl">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Technical Item Verified</span>
                      </div>
                      <div className="px-4 py-2 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                        Standard Tier
                      </div>
                    </div>
                    
                    <p className="text-2xl font-black text-slate-900 mb-12 leading-tight tracking-tight">{q.text}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      {q.options.map((opt, oIdx) => (
                        <div 
                          key={oIdx} 
                          className={`p-6 rounded-[1.5rem] border-2 flex items-center transition-all ${oIdx === q.correctAnswerIndex ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900' : 'bg-slate-50 border-transparent text-slate-500'}`}
                        >
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-5 font-black text-sm border-2 ${oIdx === q.correctAnswerIndex ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border-slate-200 text-slate-400'}`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-base font-bold tracking-tight">{opt}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-8 bg-slate-900 rounded-[2rem] shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 text-white">
                        <Microscope size={80} />
                      </div>
                      <div className="flex items-center mb-6 text-indigo-400 relative z-10">
                        <ChevronRight size={16} className="mr-2" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Technical Analysis & Solution</h4>
                      </div>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line font-medium text-sm relative z-10">{q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'REGISTRY' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-50 p-10 md:p-16 shadow-sm animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl">
                <Database className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Academic Registry</h2>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Manage active examination assets ({quizzes.length})</p>
              </div>
            </div>
            <button onClick={onRefresh} className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all group">
              <RefreshCw className="group-hover:rotate-180 transition-transform duration-700" size={20} />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-10 p-6 bg-red-50 border border-red-100 text-red-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center">
              <ShieldAlert className="mr-4" size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          {quizzes.length === 0 && !errorMsg ? (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                <BookOpen size={32} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Registry is currently empty. Use the Generator to build content.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="py-6 px-6">Curriculum Domain</th>
                    <th className="py-6 px-6">Standard Tier</th>
                    <th className="py-6 px-6 text-center">Item Count</th>
                    <th className="py-6 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {quizzes.map(q => (
                    <tr key={q.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                      <td className="py-8 px-6">
                        <p className="font-black text-slate-900 text-xl tracking-tighter group-hover:text-indigo-600 transition-colors uppercase">{q.subject}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{q.topic}</p>
                      </td>
                      <td className="py-8 px-6">
                        <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg shadow-slate-900/10">
                          {q.level} • {q.department ? q.department : 'General'}
                        </span>
                      </td>
                      <td className="py-8 px-6 text-center">
                        <span className="font-black text-slate-900 bg-slate-100 px-4 py-2 rounded-full text-xs">{q.questions.length}</span>
                      </td>
                      <td className="py-8 px-6 text-right">
                        <button 
                          onClick={() => onDeleteQuiz(q.id)}
                          className="w-12 h-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all flex items-center justify-center ml-auto group/del shadow-sm"
                          title="Remove from Registry"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
