import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { cn, getInitials } from '../../lib/utils';
import type { UserProfile } from '../../types';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import {
  User,
  Save,
  Camera,
  GraduationCap,
  MapPin,
  Building,
  Phone,
  FileText,
  CheckCircle2,
  Shield,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [form, setForm] = useState<UserProfile>({
    age: user?.profile?.age,
    university: user?.profile?.university || '',
    state: user?.profile?.state || '',
    college: user?.profile?.college || '',
    phone: user?.profile?.phone || '',
  });
  
  const [name, setName] = useState(user?.name || '');
  
  // 🟢 Bio is now managed as a root-level field, pulled directly from user.bio
  const [bio, setBio] = useState((user as any)?.bio || '');

  // 🟢 Word Counter Logic
  const bioWordCount = bio.trim() ? bio.trim().split(/\s+/).length : 0;

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // 1. File the amendment to the Firestore Database
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        name: name,
        bio: bio, // 🟢 Saved directly to the root 'bio' field in Firestore
        profile: form,
        updatedAt: Date.now() 
      });

      // 2. Update the local Zustand store so the UI updates immediately
      updateUser({
        name,
        bio, // 🟢 Update local state
        profile: form,
      } as any);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Motion denied: Failed to save profile. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const subscription = user?.subscription || 'basic';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal information and account details
        </p>
      </div>

      {/* Avatar & Quick Info */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            {/* Conditional Rendering for Google Profile Picture */}
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user?.name || 'Profile'} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100 dark:border-navy-800 shadow-sm"
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="w-20 h-20 bg-navy-100 dark:bg-navy-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-navy-800">
                <span className="text-2xl font-bold text-navy-600 dark:text-gray-300">
                  {getInitials(user?.name || 'Atty.')}
                </span>
              </div>
            )}
            
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-gold-500 rounded-lg flex items-center justify-center shadow-lg hover:bg-gold-400 transition-colors">
              <Camera className="w-3.5 h-3.5 text-navy-900" />
            </button>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Atty. {user?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={cn(
                'badge',
                subscription === 'premium'
                  ? 'bg-gold-100 text-gold-800 dark:bg-gold-500/10 dark:text-gold-400'
                  : 'bg-navy-100 text-navy-700 dark:bg-navy-500/10 dark:text-navy-300'
              )}>
                <Shield className="w-3 h-3 mr-1" />
                {subscription === 'premium' ? 'Premium (₱399/mo)' : 'Basic (₱159/mo)'}
              </span>
              <span className="badge-green">Active</span>
              <span className="text-xs text-gray-400">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information Form */}
      <div className="card p-6 space-y-5">
        <h3 className="section-title flex items-center gap-2">
          <User className="w-5 h-5 text-navy-600 dark:text-gold-400" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Atty. Juan Dela Cruz"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-field opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Age
            </label>
            <input
              type="number"
              value={form.age || ''}
              onChange={e => setForm(f => ({ ...f, age: e.target.value ? parseInt(e.target.value) : undefined }))}
              placeholder="e.g., 25"
              min={18}
              max={100}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+63 9XX XXX XXXX"
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <GraduationCap className="w-4 h-4 inline mr-1" />
            University / School
          </label>
          <input
            type="text"
            value={form.university}
            onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
            placeholder="e.g., University of the Philippines"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <MapPin className="w-4 h-4 inline mr-1" />
              State / Province
            </label>
            <input
              type="text"
              value={form.state}
              onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
              placeholder="e.g., Metro Manila"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Building className="w-4 h-4 inline mr-1" />
              College / Faculty
            </label>
            <input
              type="text"
              value={form.college}
              onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
              placeholder="e.g., College of Law"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="flex justify-between items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <span>
              <FileText className="w-4 h-4 inline mr-1" />
              Bio / About
            </span>
            {/* 🟢 Live Word Counter */}
            <span className={cn("text-xs font-bold", bioWordCount >= 100 ? "text-red-500" : "text-gray-400")}>
              {bioWordCount}/100 words
            </span>
          </label>
          <textarea
            value={bio}
            onChange={e => {
              const text = e.target.value;
              const words = text.trim() ? text.trim().split(/\s+/) : [];
              
              // 🟢 Stop them from typing if they exceed 100 words, UNLESS they are deleting text (backspace)
              if (words.length <= 100 || text.length < bio.length) {
                setBio(text);
              }
            }}
            placeholder="Tell us about yourself, Atty..."
            rows={3}
            className={cn("input-field resize-y transition-colors", bioWordCount >= 100 && "border-red-300 focus:border-red-500 focus:ring-red-500/20")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Profile saved successfully
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;