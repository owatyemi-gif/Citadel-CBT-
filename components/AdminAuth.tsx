import React, { useState } from 'react';
import { Shield, User, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

interface AdminAuthProps {
  onLogin: (username: string) => Promise<void>;
  onCancel: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      await onLogin(username.trim());
    } catch (err: any) {
      setError(err.message || 'Access Denied: Terminal mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <Shield size={200} />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-indigo-600/20">
              <Shield className="text-white" size={32} />
            </div>

            <div className="space-y-2 mb-12">
              <div className="px-3 py-1 bg-indigo-50 text-indigo-600 inline-block rounded text-[10px] font-black uppercase tracking-[0.2em] mb-2">Secure Access</div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Admin Terminal</h1>
              <p className="text-slate-500 font-medium">Enter your authorized username to initialize the command center.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Token</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Authorized Username"
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-800 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-4 animate-shake">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-xs font-bold text-red-600 leading-relaxed uppercase tracking-wide">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Initialize Session
                      <ChevronRight className="ml-2" size={18} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-5 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
                >
                  Return to Portal
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <p className="text-center mt-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] opacity-50">
          Citadel CBT • Secure Infrastructure
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
