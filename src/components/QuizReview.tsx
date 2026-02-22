
import React from 'react';
import { Quiz } from '@/types.ts';

interface QuizReviewProps {
  quiz: Quiz;
  userAnswers: number[];
  score: number;
  onClose: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({ quiz, userAnswers, score, onClose }) => {
  const percentage = Math.round((score / quiz.questions.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-20">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 text-center relative">
        <div className="bg-slate-900 p-12 text-white relative">
          <div className="absolute top-4 left-4 flex items-center space-x-2 opacity-50">
            <i className="fas fa-landmark"></i>
            <span className="text-[10px] font-black tracking-widest uppercase">CITADEL CBT</span>
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">Examination Report</h2>
          <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">{quiz.title}</p>
        </div>
        
        <div className="p-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
            <div className="relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                <circle 
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={440} 
                  strokeDashoffset={440 - (440 * percentage) / 100} 
                  className="text-indigo-600" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900">{percentage}%</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</span>
              </div>
            </div>
            
            <div className="text-left space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Questions</p>
                  <p className="text-2xl font-black text-slate-800">{quiz.questions.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Correct Hits</p>
                  <p className="text-2xl font-black text-green-600">{score}</p>
                </div>
              </div>
              <div className="pt-4 border-t w-full">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Academic Status</p>
                <p className={`text-lg font-black uppercase tracking-tight ${percentage >= 50 ? 'text-indigo-600' : 'text-red-500'}`}>
                  {percentage >= 80 ? 'Exceptional Mastery' : percentage >= 60 ? 'Credit Performance' : percentage >= 40 ? 'Pass Rating' : 'Needs Reinforcement'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 no-print">
            <button
              onClick={handlePrint}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center"
            >
              <i className="fas fa-file-pdf mr-3"></i>
              Download PDF Report
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center justify-center"
            >
              <i className="fas fa-home mr-3"></i>
              Return to Hub
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8 print-container">
        <h3 className="text-2xl font-black text-slate-800 border-b-4 border-slate-900 pb-4 uppercase tracking-tighter">Detailed Analysis & Workings</h3>
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm page-break">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-widest">Item {idx + 1}</span>
              {userAnswers[idx] === q.correctAnswerIndex ? (
                <span className="flex items-center text-green-600 text-[10px] font-black uppercase tracking-widest">
                  <i className="fas fa-check-circle mr-2 text-sm"></i> Valid Response
                </span>
              ) : (
                <span className="flex items-center text-red-500 text-[10px] font-black uppercase tracking-widest">
                  <i className="fas fa-times-circle mr-2 text-sm"></i> Invalid Response
                </span>
              )}
            </div>
            
            <p className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">{q.text}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {q.options.map((opt, oIdx) => {
                const isCorrect = oIdx === q.correctAnswerIndex;
                const isUserChoice = oIdx === userAnswers[idx];
                let cardClass = 'bg-gray-50 border-gray-100 text-gray-500';
                if (isCorrect) cardClass = 'bg-green-50 border-green-500 text-green-700 font-bold';
                else if (isUserChoice) cardClass = 'bg-red-50 border-red-300 text-red-600';

                return (
                  <div key={oIdx} className={`p-4 rounded-xl border-2 flex items-center transition-all ${cardClass}`}>
                    <span className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center mr-4 font-black text-sm">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-grow">{opt}</span>
                    {isCorrect && <i className="fas fa-check-double ml-3"></i>}
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <i className="fas fa-microscope text-5xl"></i>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-4 flex items-center uppercase tracking-widest">
                <span className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center mr-2 text-[10px]">
                  <i className="fas fa-brain"></i>
                </span>
                Technical Solution Path
              </h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line bg-white/50 p-4 rounded-xl">
                {q.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="print-only hidden text-center pt-20 border-t mt-20">
        <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase">CITADEL CBT SYSTEM</p>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Official Academic Assessment Record</p>
        <p className="mt-4 text-[10px] text-gray-300">Generated on {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default QuizReview;
