
import React, { useState, useEffect } from 'react';
import { generateQuizQuestions, fetchCurriculumTopics } from '../services/geminiService';
import { saveQuizToFirestore } from '../services/dbService';
import { Level, Quiz, Question } from '../types';
import { JSS_SUBJECTS, ALL_SSS_SUBJECTS, GET_DEPT_FOR_SSS } from '../constants';

interface AdminPanelProps {
  onQuizCreated: (quiz: Quiz) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onQuizCreated }) => {
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <i className="fas fa-book-reader text-9xl"></i>
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center">
          <span className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-100">
            <i className="fas fa-microscope"></i>
          </span>
          Curriculum Research Engine
        </h2>
        <p className="text-gray-400 text-sm mb-8 font-medium">Research and pick specific WAEC, JAMB, or BECE topics for technical generation.</p>
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Grade Tier</label>
            <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setLevel(Level.JSS)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all tracking-widest uppercase ${level === Level.JSS ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
              >
                JSS
              </button>
              <button
                type="button"
                onClick={() => setLevel(Level.SSS)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all tracking-widest uppercase ${level === Level.SSS ? 'bg-white shadow-md text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
              >
                SSS
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-indigo-600 focus:outline-none font-bold text-slate-800 appearance-none cursor-pointer"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Curriculum Topic
              {isFetchingTopics && <i className="fas fa-spinner fa-spin ml-2 text-indigo-400"></i>}
            </label>
            <select
              value={selectedTopic}
              disabled={!subject || isFetchingTopics}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-indigo-600 focus:outline-none font-bold text-slate-800 appearance-none cursor-pointer ${(!subject || isFetchingTopics) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">{isFetchingTopics ? 'Searching Curriculum...' : 'Pick from Curriculum'}</option>
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Q-Volume</label>
            <input
              type="number"
              min="1"
              max="300"
              value={qCount}
              onChange={(e) => setQCount(parseInt(e.target.value) || 0)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-indigo-600 focus:outline-none font-black text-indigo-600 text-lg"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4 flex justify-end pt-4">
            <button
              type="submit"
              disabled={isGenerating || !selectedTopic}
              className={`px-12 py-5 rounded-2xl bg-slate-900 text-white font-black shadow-2xl hover:bg-slate-800 transition-all flex items-center uppercase tracking-widest text-sm ${isGenerating || !selectedTopic ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:scale-95 shadow-indigo-100'}`}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-microchip fa-spin mr-3 text-indigo-400"></i>
                  Engine Thinking...
                </>
              ) : (
                <>
                  <i className="fas fa-bolt mr-3 text-indigo-400"></i>
                  Generate Topic-Based Exam
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-5 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-r-xl flex items-center animate-fadeIn">
            <i className="fas fa-shield-virus mr-3 text-lg"></i>
            <span className="font-bold text-sm">{error}</span>
          </div>
        )}
      </div>

      {generatedQuestions.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-indigo-100/10">
            <div>
              <h3 className="text-xl font-black flex items-center">
                <i className="fas fa-layer-group text-indigo-400 mr-3"></i>
                Technical Assessment Prepared
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Target: {selectedTopic}
              </p>
            </div>
            <button 
              onClick={handleSaveQuiz}
              disabled={isGenerating}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {isGenerating ? 'Saving to Cloud...' : 'Commit to Library'}
            </button>
          </div>

          <div className="max-h-[700px] overflow-y-auto pr-3 space-y-6 custom-scrollbar pb-10">
            {generatedQuestions.map((q, idx) => (
              <div key={q.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-50">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Technical Item</span>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-full">Technical Rank</span>
                </div>
                
                <p className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">{q.text}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={oIdx} 
                      className={`p-4 rounded-2xl border-2 flex items-center transition-all ${oIdx === q.correctAnswerIndex ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'bg-gray-50 border-transparent text-gray-500'}`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-black text-sm border-2 ${oIdx === q.correctAnswerIndex ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-slate-400'}`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-slate-50 border border-indigo-50 rounded-2xl shadow-inner group">
                  <div className="flex items-center mb-4 text-indigo-600">
                    <i className="fas fa-microscope mr-2"></i>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Solution Path & Analysis</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">{q.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
