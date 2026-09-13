import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { registerUser, loginUser } from '../services/api.ts';
import { X, UserCheck, ShieldCheck, Mail, Phone, MapPin, Globe, Sparkles, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setCurrentUser, switchDemoUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(email || 'citizen@civicfix.org');
      setCurrentUser(res.user);
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await registerUser({
        name,
        email,
        phone,
        city,
        preferredLanguage,
        role: 'citizen',
      });
      setCurrentUser(res.user);
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        id="auth-modal-container"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">
              {mode === 'login' ? 'Sign In to CivicFix AI' : 'Create Citizen Account'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'login'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors ${
              mode === 'register'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Citizen Profile
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          {/* One-click demo buttons */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Quick Demo Accounts (No password needed)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="demo-login-citizen"
                onClick={async () => {
                  await switchDemoUser('citizen');
                  closeAuthModal();
                }}
                className="py-1.5 px-2 bg-white hover:bg-emerald-100/50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-900 flex items-center justify-center gap-1 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                Citizen (Rahul)
              </button>
              <button
                type="button"
                id="demo-login-admin"
                onClick={async () => {
                  await switchDemoUser('admin');
                  closeAuthModal();
                }}
                className="py-1.5 px-2 bg-white hover:bg-purple-100/50 border border-purple-200 rounded-lg text-xs font-medium text-purple-900 flex items-center justify-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Admin (Officer Priya)
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@civicfix.org"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Any password accepted for prototype demonstration
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-800 transition-colors shadow-sm mt-2 disabled:opacity-60"
              >
                {loading ? 'Signing In...' : 'Sign In as Citizen'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765..."
                      className="w-full pl-8 pr-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    City *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full pl-8 pr-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Language
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
                🔒 We strictly respect your privacy. No Aadhaar, PAN, or government credentials are ever stored or requested.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-800 transition-colors shadow-sm disabled:opacity-60"
              >
                {loading ? 'Creating Profile...' : 'Save Profile & Continue'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
