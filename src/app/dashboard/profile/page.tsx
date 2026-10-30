'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  User, Phone, GraduationCap, BookOpen, Save,
  ShieldCheck, Globe, LogOut, CheckCircle2, ChevronRight,
  Camera, Upload, Mail, Check, Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UNIVERSITIES } from '@/lib/seed-data';
import toast from 'react-hot-toast';
import AuthGuard from '@/components/ui/AuthGuard';

const YEARS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Postgraduate'];
const GENDERS = ['Male', 'Female', 'Other'];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
];

function ProfileContent() {
  const { user, updateUserProfile, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || 'Biruk Tadesse');
  const [email, setEmail] = useState(user?.email || 'student@aau.edu.et');
  const [phone, setPhone] = useState(user?.phone || '+251 99 721 895');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [universityId, setUniversityId] = useState(user?.university_id || 'aau');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [year, setYear] = useState(user?.year?.toString() || 'Year 2');
  const [saving, setSaving] = useState(false);

  // Sync state if user changes in context
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.gender) setGender(user.gender);
      if (user.avatar_url) setAvatarUrl(user.avatar_url);
      if (user.university_id) setUniversityId(user.university_id);
      if (user.department) setDepartment(user.department);
      if (user.year) {
        setYear(typeof user.year === 'number' ? `Year ${user.year}` : user.year.toString());
      }
    }
  }, [user]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        toast.success('Profile picture updated! Click Save to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const selectedUni = UNIVERSITIES.find(u => u.id === universityId) || UNIVERSITIES[0];

  const handleSave = async () => {
    setSaving(true);
    const yearNum = parseInt(year.replace(/\D/g, '')) || 2;
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('251')
      ? '+' + cleanPhone
      : '+251' + (cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone);

    const success = await updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: formattedPhone,
      gender,
      avatar_url: avatarUrl || undefined,
      university_id: universityId,
      department: department.trim(),
      year: yearNum,
    });

    setSaving(false);
    if (success) {
      toast.success('Student profile saved successfully! ✅');
    } else {
      toast.error('Could not save profile updates.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-xs text-gray-400 hover:text-green">Dashboard</Link>
            <span className="text-xs text-gray-300">/</span>
            <span className="text-xs font-bold text-ink">My Account & Profile</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-ink">Student Profile & Credentials</h1>
          <p className="text-xs md:text-sm text-gray-500">
            View and manage your personal identity, university department, and phone number.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100 space-y-6">
          {/* Avatar and basic badge */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100 text-center sm:text-left">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-gold to-amber-400 text-ink flex items-center justify-center font-black text-2xl shadow-md overflow-hidden">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={22} className="text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-black text-ink">{name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedUni.name} • {department} • {year}</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-slate-50 text-xs font-bold text-ink hover:bg-slate-100 flex items-center gap-1.5 self-center sm:self-auto cursor-pointer"
                >
                  <Upload size={13} /> Change Photo
                </button>
              </div>

              {/* Avatar presets */}
              <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Preset avatars:</span>
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${
                        avatarUrl === url ? 'border-green ring-2 ring-green/20' : 'border-transparent'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-[10px] text-red-500 hover:underline font-medium ml-1"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Phone Number (Telebirr / CBE)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Gender</label>
              <div className="grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      gender === g
                        ? 'border-green bg-green text-white shadow-xs'
                        : 'border-gray-200 bg-slate-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">University / College</label>
              <select
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-green cursor-pointer"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.short}) - {u.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Department / Major</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-green cursor-pointer"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-xs text-red-500 font-bold hover:text-red-700 transition-colors cursor-pointer"
            >
              <LogOut size={14} /> Log Out
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>

        {/* Security & Honor Card */}
        <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-gold">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white mb-1">Tibeb Academic Integrity Protection</h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Your profile is authenticated and tied to your university records. All downloaded exams are embedded with dynamic student watermarks to safeguard your academic credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
