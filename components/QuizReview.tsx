import React from 'react';
import { Quiz } from '../types';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  Printer, 
  BookOpen, 
  Target,
  Award,
  BarChart3,
  ArrowLeft
} from 'lucide-react';

interface QuizReviewProps {
  quiz: Quiz;
  userAnswers: number[];
  score: number;
  onClose: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({ quiz, userAnswers, score, onClose }) => {
  const percentage = Math.round((score / quiz.questions.length) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { label: 'Distinction', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (percentage >= 70) return { label: 'Merit', color: 'text-indigo-600', bg: 'bg-indigo-50' };
    if (percentage >= 50) return { label: 'Pass', color: 'text-blue-600', bg: 'bg-blue-50' };
    return { label: 'Unsuccessful', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const grade = getGrade();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fadeIn">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100 px-8 py-6 sticky top-0 z-50 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center space-x-3 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase tracking-widest text-[10px]"
          >
            <ArrowLeft size={18} />
            <span>Return to Hub</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.print()}
              className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-indigo-600"
            >
              <Printer size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 pt-12 space-y-12">
        {/* Result Card */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
            <Trophy size={300} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 bg-slate-900 p-12 text-white flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-600/20">
                <Award size={48} />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Performance</h1>
              <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-10">Technical Assessment Report</p>
              
              <div className="relative mb-8">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                  <circle 
                    cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={527} 
                    strokeDashoffset={527 - (527 * percentage) / 100} 
                    className="text-indigo-500 transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black tracking-tighter">{percentage}%</span>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Final Grade</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 p-12 md:p-16 flex flex-col justify-center">
              <div className="space-y-2 mb-12">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exam Title</span>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{quiz.subject}</h2>
                <p className="text-slate-500 font-medium">{quiz.topic} • {quiz.level}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Target size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Accuracy</span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">{score} / {quiz.questions.length}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <BarChart3 size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                  </div>
                  <div className={`inline-flex px-3 py-1 rounded-lg ${grade.bg} ${grade.color} text-[10px] font-black uppercase tracking-widest`}>
                    {grade.label}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  This report serves as a formal record of your technical proficiency in <span className="font-black text-slate-900">{quiz.subject}</span>. Detailed item analysis is provided below for review.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Item Analysis</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correct</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incorrect</span>
              </div>
            </div>
          </div>

          {quiz.questions.map((q, idx) => {
            const isCorrect = userAnswers[idx] === q.correctAnswer;
            return (
              <div key={idx} className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-2 h-full ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-4">
                    <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Technical Item</span>
                  </div>
                  {isCorrect ? (
                    <div className="flex items-center space-x-2 text-emerald-600">
                      <CheckCircle2 size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Valid Response</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-500">
                      <XCircle size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Invalid Response</span>
                    </div>
                  )}
                </div>

                <h4 className="text-2xl font-black text-slate-900 mb-10 leading-tight tracking-tight">
                  {q.text}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {q.options.map((opt, oIdx) => {
                    const isCorrectOption = oIdx === q.correctAnswer;
                    const isUserChoice = oIdx === userAnswers[idx];
                    
                    let stateClass = 'bg-slate-50 border-slate-50 text-slate-400';
                    if (isCorrectOption) stateClass = 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-lg shadow-emerald-500/5';
                    else if (isUserChoice) stateClass = 'bg-red-50 border-red-100 text-red-600';

                    return (
                      <div key={oIdx} className={`p-6 rounded-2xl border-2 flex items-center transition-all ${stateClass}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs mr-4 ${
                          isCorrectOption ? 'bg-emerald-500 text-white' : isUserChoice ? 'bg-red-500 text-white' : 'bg-white text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="font-bold text-sm">{opt}</span>
                        {isCorrectOption && <CheckCircle2 className="ml-auto text-emerald-500" size={18} />}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <BookOpen size={80} />
                  </div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center">
                      <BookOpen size={12} />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Technical Explanation</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-12 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Citadel CBT • Academic Integrity Protocol</p>
          <p className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Report ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizReview;
