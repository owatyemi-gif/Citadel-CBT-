
import React, { useState, useEffect } from 'react';
import { Quiz, Question } from '../types';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  LayoutGrid,
  ShieldCheck,
  Flag
} from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number, answers: number[]) => void;
  onCancel: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(quiz.questions.length * 60); // 1 min per question
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz.questions[currentIdx];

  const handleSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score++;
      }
    });
    onComplete(score, answers);
  };

  const answeredCount = answers.filter(a => a !== -1).length;
  const progress = (answeredCount / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fadeIn">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setShowConfirm(true)}
              className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-red-500"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="h-10 w-px bg-slate-100"></div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest rounded">Technical Assessment</span>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{quiz.subject}</h1>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quiz.topic}</p>
            </div>
          </div>

          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-4 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl shadow-slate-900/10">
              <Timer size={20} className="text-indigo-400" />
              <span className="text-xl font-black font-mono tracking-widest">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-black text-slate-900">{answeredCount} / {quiz.questions.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Logged</span>
              </div>
              <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <button 
              onClick={() => setShowConfirm(true)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
            >
              Submit Assessment
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 p-10">
        {/* Question Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
              <ShieldCheck size={240} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center space-x-4">
                  <span className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xl">
                    {currentIdx + 1}
                  </span>
                  <div className="h-px w-12 bg-slate-100"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Technical Item</span>
                </div>
                <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                  <Flag size={20} />
                </button>
              </div>

              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-16 tracking-tight">
                {currentQuestion.text}
              </h2>

              <div className="grid grid-cols-1 gap-5">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`group flex items-center p-8 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden ${
                      answers[currentIdx] === idx
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-600/5'
                        : 'border-slate-50 bg-slate-50 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mr-6 transition-all ${
                      answers[currentIdx] === idx
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-white text-slate-400 group-hover:text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`text-lg font-bold transition-colors ${
                      answers[currentIdx] === idx ? 'text-indigo-900' : 'text-slate-600'
                    }`}>
                      {option}
                    </span>
                    {answers[currentIdx] === idx && (
                      <div className="absolute right-8">
                        <CheckCircle2 className="text-indigo-600" size={24} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-4">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center space-x-3 px-8 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] disabled:opacity-20 hover:text-slate-600 transition-all"
            >
              <ChevronLeft size={20} />
              <span>Previous Item</span>
            </button>
            <button
              onClick={() => setCurrentIdx(prev => Math.min(quiz.questions.length - 1, prev + 1))}
              disabled={currentIdx === quiz.questions.length - 1}
              className="flex items-center space-x-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] disabled:opacity-20 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10"
            >
              <span>Next Item</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Item Registry</h3>
              <LayoutGrid size={16} className="text-slate-300" />
            </div>
            <div className="grid grid-cols-5 gap-3">
              {quiz.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                    currentIdx === idx
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : answers[idx] !== -1
                      ? 'border-indigo-100 bg-indigo-50 text-indigo-600'
                      : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Items Attempted</span>
                <span className="text-indigo-600">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Items Remaining</span>
                <span className="text-slate-600">{quiz.questions.length - answeredCount}</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20">
            <ShieldCheck className="mb-6 opacity-50" size={32} />
            <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Integrity Protocol</h4>
            <p className="text-xs font-medium text-indigo-100 leading-relaxed">
              Your session is being monitored for technical integrity. Ensure all responses are your own original work.
            </p>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Final Submission</h2>
            <p className="text-slate-500 font-medium mb-12">
              You have completed <span className="font-black text-indigo-600">{answeredCount}</span> out of <span className="font-black text-slate-900">{quiz.questions.length}</span> items. Are you ready to finalize your technical grade?
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
              >
                Continue Solving
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
              >
                Finalize Grade
              </button>
            </div>
            <button 
              onClick={onCancel}
              className="mt-8 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
            >
              Terminate Session (No Save)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;
