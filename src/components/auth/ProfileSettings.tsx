import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, User, Camera, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const { user, updateUserDisplayName, updateUserProfilePhoto } = useAuth();
  
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    
    try {
      if (name !== user?.displayName) {
        await updateUserDisplayName(name);
      }
      if (photoURL !== user?.photoURL) {
        await updateUserProfilePhoto(photoURL);
      }
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md overflow-hidden bg-bg-card rounded-[28px] shadow-2xl border border-border-color"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border-color">
            <h2 className="text-xl font-bold text-text-primary">Profile Settings</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-bg-primary border-4 border-white dark:border-slate-700 shadow-sm flex items-center justify-center group">
                {photoURL ? (
                  <img src={photoURL} alt="User Profile Details Settings Photo" title="Profile Avatar" loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-700 dark:text-slate-300" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Display Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-color rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Photo URL</label>
                <div className="relative flex items-center">
                  <Camera className="absolute left-3.5 w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <input
                     type="url"
                     value={photoURL}
                     onChange={(e) => setPhotoURL(e.target.value)}
                     placeholder="https://example.com/avatar.png"
                     className="w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-color rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-center font-medium">
                {successMsg}
              </div>
            )}

            <button
               type="submit"
               disabled={isLoading}
               className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold  rounded-full shadow-sm text-sm transition-all focus:ring-4 focus:ring-indigo-500/50 flex justify-center items-center h-12"
            >
               {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
