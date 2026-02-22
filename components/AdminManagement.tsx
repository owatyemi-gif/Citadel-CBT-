
import React, { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { fetchAdminsFromFirestore, saveAdminToFirestore, deleteAdminFromFirestore } from '../services/dbService';
import { UserPlus, Trash2, Shield, User as UserIcon, Calendar } from 'lucide-react';

interface AdminManagementProps {
  currentUser: { name: string; username?: string };
}

const AdminManagement: React.FC<AdminManagementProps> = ({ currentUser }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminsFromFirestore();
      setAdmins(data);
    } catch (err) {
      setError('Failed to load administrator registry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newName) return;
    
    setIsAdding(true);
    setError('');
    
    try {
      const adminData: Omit<AdminUser, 'id'> = {
        username: newUsername.trim(),
        name: newName.trim(),
        addedBy: currentUser.username || currentUser.name,
        createdAt: Date.now()
      };
      
      await saveAdminToFirestore(adminData);
      setNewUsername('');
      setNewName('');
      loadAdmins();
    } catch (err) {
      setError('Failed to add administrator to registry.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAdmin = async (id: string, username: string) => {
    if (username === 'Citadelcbt') {
      alert('Master Administrator cannot be removed.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to revoke access for ${username}?`)) {
      try {
        await deleteAdminFromFirestore(id);
        loadAdmins();
      } catch (err) {
        setError('Failed to revoke administrator access.');
      }
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-12 shadow-2xl">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <UserPlus className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Register Administrator</h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Add new personnel to the academic command</p>
          </div>
        </div>

        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Administrator ID</label>
            <input 
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-6 py-4 bg-slate-800/50 border-2 border-slate-800 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-bold text-white"
              placeholder="e.g. CitadelAdmin01"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-6 py-4 bg-slate-800/50 border-2 border-slate-800 rounded-2xl focus:border-indigo-600 focus:outline-none transition-all font-bold text-white"
              placeholder="e.g. Dr. Sarah Johnson"
              required
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={isAdding}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all hover:-translate-y-1 disabled:opacity-50"
            >
              {isAdding ? 'Processing...' : 'Authorize Access'}
            </button>
          </div>
        </form>
        
        {error && <p className="mt-6 text-red-400 text-[10px] font-black uppercase tracking-widest text-center italic">{error}</p>}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Administrator Registry</h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Active personnel with command access</p>
            </div>
          </div>
          <button onClick={loadAdmins} className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <i className="fas fa-circle-notch fa-spin text-3xl text-indigo-600"></i>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="py-6 px-4">Administrator</th>
                  <th className="py-6 px-4">Registry ID</th>
                  <th className="py-6 px-4">Authorized By</th>
                  <th className="py-6 px-4">Date Added</th>
                  <th className="py-6 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Master Admin */}
                <tr className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <Shield size={18} />
                      </div>
                      <span className="font-black text-slate-900 uppercase tracking-tight">Academic Director</span>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">Citadelcbt</span>
                  </td>
                  <td className="py-6 px-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">System Root</td>
                  <td className="py-6 px-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Foundation</td>
                  <td className="py-6 px-4 text-right">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Master Access</span>
                  </td>
                </tr>
                
                {admins.map(admin => (
                  <tr key={admin.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-6 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <UserIcon size={18} />
                        </div>
                        <span className="font-black text-slate-900 uppercase tracking-tight">{admin.name}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-widest">{admin.username}</span>
                    </td>
                    <td className="py-6 px-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">{admin.addedBy}</td>
                    <td className="py-6 px-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-6 px-4 text-right">
                      <button 
                        onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                        className="w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center ml-auto group/del"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
