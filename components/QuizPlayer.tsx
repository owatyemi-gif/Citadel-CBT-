
import React, { useState, useEffect } from 'react';
import { Quiz, Question } from '../types';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (score: number, answers: number[]) => void;
  onCancel: () => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(quiz.questions.length * 60); // 1 min per question

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleFinish = () => {
    const score = answers.reduce((acc, ans, idx) => {
      return ans === quiz.questions[idx].correctAnswerIndex ? acc + 1 : acc;
    }, 0);
    onComplete(score, answers);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz.questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{quiz.title}</h2>
          <p className="text-sm text-gray-500">{quiz.level} • {quiz.subject}</p>
        </div>
        <div className={`text-xl font-mono font-bold px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-100 text-indigo-700'}`}>
          <i className="fas fa-clock mr-2"></i>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between mb-8 items-center">
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            QUESTION {currentIdx + 1} OF {quiz.questions.length}
          </span>
          <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <h3 className="text-xl font-medium text-gray-900 mb-8 leading-relaxed">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => {
                const newAnswers = [...answers];
                newAnswers[currentIdx] = idx;
                setAnswers(newAnswers);
              }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center group ${
                answers[currentIdx] === idx 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-100 hover:border-indigo-200 text-gray-600'
              }`}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-4 font-bold border-2 ${
                answers[currentIdx] === idx 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white border-gray-200 group-hover:border-indigo-200'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 font-semibold"
        >
          Previous
        </button>
        {currentIdx === quiz.questions.length - 1 ? (
          <button
            onClick={handleFinish}
            className="px-10 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-all"
          >
            Submit Exam
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Next Question
          </button>
        )}
      </div>

      <button
        onClick={onCancel}
        className="block mx-auto text-gray-400 text-sm hover:text-red-500 transition-colors"
      >
        Quit Test
      </button>
    </div>
  );
};

export default QuizPlayer;
