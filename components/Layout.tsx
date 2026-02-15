
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-slate-900 text-white shadow-xl sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <i className="fas fa-landmark text-xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">CITADEL <span className="text-indigo-500">CBT</span></span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:block text-right border-r pr-6 border-slate-700">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Signed in as</p>
              <p className="text-sm font-bold text-white">{user.name} <span className="ml-2 px-2 py-0.5 bg-slate-800 rounded text-[10px] text-indigo-400">{user.role}</span></p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all p-2 rounded-xl h-10 w-10 flex items-center justify-center border border-red-500/20"
              title="Logout"
            >
              <i className="fas fa-power-off"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      <footer className="bg-white border-t py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 text-slate-400 grayscale">
            <i className="fas fa-landmark"></i>
            <span className="font-bold text-sm tracking-tighter uppercase">CITADEL CBT</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CITADEL CBT System. Developed for Citadel Educational Institutions.
          </p>
          <div className="flex space-x-4 text-gray-400">
            <i className="fab fa-facebook-f hover:text-indigo-600 cursor-pointer"></i>
            <i className="fab fa-twitter hover:text-indigo-600 cursor-pointer"></i>
            <i className="fab fa-instagram hover:text-indigo-600 cursor-pointer"></i>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
