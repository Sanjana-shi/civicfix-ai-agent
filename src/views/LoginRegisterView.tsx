import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { loginUser, registerUser } from '../services/api.ts';
import { ShieldCheck, Mail, Lock, User as UserIcon, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginRegisterViewProps {
  onLoginSuccess: () => void;
}

export const LoginRegisterView: React.FC<LoginRegisterViewProps> = ({ onLoginSuccess }) => {
  const { setCurrentUser, setIsAuthenticated, switchDemoUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(email);
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await registerUser({
        name: name.trim(),
        email: email.trim(),
        city: 'Bengaluru',
        preferredLanguage: 'English',
        role: 'citizen',
      });
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'citizen' | 'admin') => {
    setError('');
    setLoading(true);
    try {
      await switchDemoUser(role);
      onLoginSuccess();
    } catch (err: any) {
      setError('Failed to switch demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-700 text-white shadow-md mb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            CivicFix AI
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Autonomous Multi-Agent Public Infrastructure Grievance Resolution
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-medium text-emerald-400">
            <Sparkles className="w-3 h-3" />
            <span>Stage 1 of 5: Citizen Authentication</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            id="tab-login-btn"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-3.5 text-center transition-all ${
              mode === 'login'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="tab-register-btn"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-3.5 text-center transition-all ${
              mode === 'register'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Citizen Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Demo Login Option for Judges */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Hackathon Judge 1-Click Demo Login</span>
            </div>
            <p className="text-[11px] text-emerald-800/90 mb-3 leading-relaxed">
              Skip typing credentials. Log in immediately and jump directly into the 5-stage citizen workflow:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                id="demo-citizen-btn"
                onClick={() => handleQuickDemoLogin('citizen')}
                disabled={loading}
                className="w-full text-left p-2.5 rounded-xl bg-white border border-emerald-300 hover:border-emerald-600 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                    Rahul Sharma
                  </span>
                  <span className="text-[10px] text-slate-500 block">Citizen Reporter</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                id="demo-admin-btn"
                onClick={() => handleQuickDemoLogin('admin')}
                disabled={loading}
                className="w-full text-left p-2.5 rounded-xl bg-white border border-purple-200 hover:border-purple-500 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-900 group-hover:text-purple-700">
                    Officer Priya Verma
                  </span>
                  <span className="text-[10px] text-slate-500 block">Municipal Admin</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or with email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    id="login-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@civicfix.org"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    id="login-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Demo mode: any password is accepted
                </span>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In & Continue to Report'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    id="register-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    id="register-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul.citizen@civicfix.org"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    id="register-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:bg-white outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="register-submit-btn"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Creating Account...' : 'Register & Start Reporting'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Privacy & Trust Badge */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Clean authentication only. No Aadhaar or PAN required.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
