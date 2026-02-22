
import React from 'react';

interface FooterProps {
  onNavigate: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <i className="fas fa-landmark text-sm"></i>
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">CITADEL CBT</span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering students with the ultimate testing environment for academic excellence in Nigerian national examinations.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => onNavigate('HOME')} className="hover:text-indigo-400 transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('FEATURES')} className="hover:text-indigo-400 transition-colors">Key Features</button></li>
              <li><button onClick={() => onNavigate('ABOUT')} className="hover:text-indigo-400 transition-colors">About Citadel</button></li>
              <li><button onClick={() => onNavigate('CONTACT')} className="hover:text-indigo-400 transition-colors">Contact Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Examination Tiers</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center"><i className="fas fa-check-circle text-indigo-500 mr-2 text-[10px]"></i> WAEC Standard</li>
              <li className="flex items-center"><i className="fas fa-check-circle text-indigo-500 mr-2 text-[10px]"></i> JAMB Preparation</li>
              <li className="flex items-center"><i className="fas fa-check-circle text-indigo-500 mr-2 text-[10px]"></i> BECE Assessment</li>
              <li className="flex items-center"><i className="fas fa-check-circle text-indigo-500 mr-2 text-[10px]"></i> Mock Simulations</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-indigo-500"></i>
                <span>Citadel Educational Center, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-indigo-500"></i>
                <span>support@citadelcbt.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-indigo-500"></i>
                <span>+234 800 CITADEL</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Citadel Educational Institutions. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
