
import React, { useState } from 'react';
import { Quiz, Level } from '@/types.ts';

interface StudentPortalProps {
  quizzes: Quiz[];
  onStartQuiz: (quiz: Quiz, count: number) => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ quizzes, onStartQuiz }) => {
  const [levelFilter, setLevelFilter] = useState<Level | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questionChoice, setQuestionChoice] = useState<number>(20);

  const filteredQuizzes = quizzes.filter(q => {
    const matchesLevel = levelFilter === 'ALL' || q.level === levelFilter;
    const matchesSearch = q.subject.toLowerCase().includes(search.toLowerCase()) || 
                          q.topic.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  if (selectedQuiz) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
          <h2 className="text-2xl font-black text-slate-800 mb-2">Test Configuration</h2>
          <p className="text-gray-500 mb-8">Set your preferences for <span className="font-bold text-indigo-600">{selectedQuiz.subject}</span> exam.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Number of Questions to Attempt</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[20, 50, 70, 100].map(count => {
                  const available = selectedQuiz.questions.length;
                  const isDisabled = count > available && count !== 20; // Allow 20 even if less, but usually we generate 100
                  return (
                    <button
                      key={count}
                      disabled={isDisabled && available < count}
                      onClick={() => setQuestionChoice(count)}
                      className={`py-4 rounded-2xl font-black transition-all border-2 ${
                        questionChoice === count 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                      } ${isDisabled && available < count ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-gray-400 italic">Available in bank: {selectedQuiz.questions.length} questions</p>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl flex items-start space-x-3">
              <i className="fas fa-info-circle text-indigo-600 mt-1"></i>
              <p className="text-sm text-indigo-800 leading-relaxed font-medium">
                These questions are <span className="font-bold uppercase tracking-tighter">Technical Grade</span>. Ensure you have your writing materials ready for solving subjects.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setSelectedQuiz(null)}
                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => onStartQuiz(selectedQuiz, Math.min(questionChoice, selectedQuiz.questions.length))}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest"
              >
                Enter Examination
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Library</h1>
          <p className="text-gray-500 font-medium">Access technical assessments and sharpen your skills.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Subject/Topic..." 
              className="bg-white border-2 border-transparent border-gray-100 rounded-2xl py-3 pl-12 pr-6 shadow-sm focus:border-indigo-600 focus:outline-none transition-all w-64 lg:w-80"
            />
          </div>
          <div className="flex space-x-1 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            {['ALL', Level.JSS, Level.SSS].map(lvl => (
              <button 
                key={lvl}
                onClick={() => setLevelFilter(lvl as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all tracking-widest uppercase ${levelFilter === lvl ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-300">
            <i className="fas fa-book-reader text-4xl"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800">No Assessments Available</h3>
          <p className="text-gray-400 max-w-md mx-auto mt-2">Contact your administrator to generate technical quizzes for your grade level.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredQuizzes.map(quiz => (
            <div 
              key={quiz.id} 
              className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none group-hover:scale-110 duration-500">
                <i className="fas fa-file-signature text-7xl"></i>
              </div>
              
              <div className="flex gap-2 mb-6">
                <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg ${quiz.level === Level.JSS ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-900 text-white'}`}>
                  {quiz.level} Grade
                </span>
                {quiz.department && (
                  <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg bg-indigo-600 text-white">
                    {quiz.department}
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors tracking-tight">{quiz.subject}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-grow">{quiz.topic}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900">{quiz.questions.length}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Questions</span>
                  </div>
                  <div className="w-px h-6 bg-gray-100"></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900">Technical</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Difficulty</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedQuiz(quiz)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-100"
                >
                  Configure Test
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
