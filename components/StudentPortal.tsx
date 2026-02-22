
import React, { useState } from 'react';
import { Quiz, Level } from '../types';
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  ChevronRight, 
  Database,
  ShieldAlert,
  LayoutGrid,
  List
} from 'lucide-react';

interface StudentPortalProps {
  quizzes: Quiz[];
  onStartQuiz: (quiz: Quiz, count: number) => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ quizzes, onStartQuiz }) => {
  const [levelFilter, setLevelFilter] = useState<Level | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questionChoice, setQuestionChoice] = useState<number>(20);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  const filteredQuizzes = quizzes.filter(q => {
    const matchesLevel = levelFilter === 'ALL' || q.level === levelFilter;
    const matchesSearch = q.subject.toLowerCase().includes(search.toLowerCase()) || 
                          q.topic.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  if (selectedQuiz) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
        <div className="bg-white rounded-[3rem] p-10 md:p-14 max-w-2xl w-full shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <GraduationCap size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 inline-block rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Examination Protocol</div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Configure Assessment</h2>
            <p className="text-slate-500 mb-12 font-medium">You are about to enter the <span className="font-black text-indigo-600 uppercase">{selectedQuiz.subject}</span> technical assessment for <span className="font-black text-slate-900">{selectedQuiz.topic}</span>.</p>
            
            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-1">Select Item Volume</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[20, 50, 70, 100].map(count => {
                    const available = selectedQuiz.questions.length;
                    const isDisabled = count > available && count !== 20;
                    return (
                      <button
                        key={count}
                        disabled={isDisabled && available < count}
                        onClick={() => setQuestionChoice(count)}
                        className={`py-6 rounded-2xl font-black transition-all border-2 flex flex-col items-center justify-center space-y-1 ${
                          questionChoice === count 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-600/10' 
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white'
                        } ${isDisabled && available < count ? 'opacity-20 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-xl">{count}</span>
                        <span className="text-[8px] uppercase tracking-widest">Items</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Database size={12} className="mr-2" />
                  Registry Capacity: {selectedQuiz.questions.length} Technical Items
                </div>
              </div>

              <div className="p-8 bg-slate-900 rounded-[2rem] flex items-start space-x-6 shadow-2xl shadow-indigo-900/20">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/20">
                  <ShieldAlert className="text-white" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Technical Grade Warning</p>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    This assessment contains rigorous technical problems. Ensure you have your workspace prepared for complex calculations and analysis.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button 
                  onClick={() => setSelectedQuiz(null)}
                  className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={() => onStartQuiz(selectedQuiz, Math.min(questionChoice, selectedQuiz.questions.length))}
                  className="flex-[2] py-6 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
                >
                  Initialize Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-fadeIn pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="px-3 py-1 bg-indigo-600 text-white inline-block rounded text-[10px] font-black uppercase tracking-[0.2em]">Student Portal</div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Academic Library</h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">Access the national curriculum examination bank and sharpen your technical skills for WAEC, JAMB, and BECE.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Subject or Topic..." 
              className="bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-8 shadow-sm focus:border-indigo-600 focus:outline-none transition-all w-full sm:w-80 font-bold text-slate-800"
            />
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {['ALL', Level.JSS, Level.SSS].map(lvl => (
              <button 
                key={lvl}
                onClick={() => setLevelFilter(lvl as any)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all tracking-widest uppercase ${levelFilter === lvl ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-600/5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode('GRID')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('LIST')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-100">
          <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-300 rotate-6">
            <BookOpen size={48} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Library Empty</h3>
          <p className="text-slate-400 max-w-sm mx-auto mt-4 font-medium">No technical assessments match your current search criteria or grade level.</p>
        </div>
      ) : (
        <div className={viewMode === 'GRID' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10" : "space-y-6"}>
          {filteredQuizzes.map(quiz => (
            viewMode === 'GRID' ? (
              <div 
                key={quiz.id} 
                className="group bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none group-hover:scale-125 duration-700">
                  <GraduationCap size={160} />
                </div>
                
                <div className="flex gap-2 mb-8">
                  <span className={`text-[9px] font-black tracking-[0.2em] uppercase px-4 py-2 rounded-xl ${quiz.level === Level.JSS ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-900 text-white'}`}>
                    {quiz.level} Tier
                  </span>
                  {quiz.department && (
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase px-4 py-2 rounded-xl bg-indigo-600 text-white">
                      {quiz.department}
                    </span>
                  )}
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors tracking-tighter uppercase leading-none">{quiz.subject}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 flex-grow">{quiz.topic}</p>
                
                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900 leading-none">{quiz.questions.length}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Items</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900 leading-none">High</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Difficulty</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedQuiz(quiz)}
                    className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-indigo-600/20 group/btn"
                  >
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                key={quiz.id}
                className="group bg-white rounded-3xl p-6 border border-slate-50 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-8"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${quiz.level === Level.JSS ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-900 text-white'}`}>
                  <BookOpen size={32} />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{quiz.level} Tier</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">•</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{quiz.department || 'General'}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{quiz.subject}</h3>
                  <p className="text-slate-500 text-sm font-medium">{quiz.topic}</p>
                </div>
                <div className="flex items-center gap-12 px-8">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">{quiz.questions.length}</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">Technical</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Grade</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedQuiz(quiz)}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-lg"
                >
                  Configure
                </button>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
