import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  ShieldAlert,
  PlusCircle,
  LayoutDashboard,
  FileSearch,
  BotMessageSquare,
  Building,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  Info,
  Layers,
  ArrowRightLeft,
  BrainCircuit,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, reportId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, switchDemoUser, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const citizenNavLinks = [
    { id: 'report', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { id: 'ai-assistant', label: 'AI Assistant', icon: BrainCircuit },
    { id: 'solution', label: 'Solution', icon: Layers },
    { id: 'tracking', label: 'Tracking', icon: FileSearch },
    { id: 'my-reports', label: 'All Reports', icon: LayoutDashboard },
    { id: 'admin', label: 'Admin Portal', icon: Building },
  ];

  const handleNav = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('login');
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="nav-logo"
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-emerald-800 transition-colors">
              <ShieldAlert className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  CivicFix
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                  AI Agent
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Public Issue Resolution Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {citizenNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    id={`nav-${link.id}`}
                    onClick={() => handleNav(link.id)}
                    className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm transition-all hover:shadow cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </button>
                );
              }
              return (
                <button
                  key={link.id}
                  id={`nav-${link.id}`}
                  onClick={() => handleNav(link.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User / Demo Role Switcher & Logout */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Fast Demo Role Switcher */}
            <div className="relative">
              <button
                id="role-switcher-btn"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
                title="Switch demo role (Citizen or Municipal Admin)"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-slate-300"
                />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div
                  id="role-dropdown-menu"
                  className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs text-slate-700 divide-y divide-slate-100"
                >
                  <div className="px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Current Profile
                    </p>
                    <p className="font-semibold text-slate-800">{currentUser.name}</p>
                    <p className="text-slate-500 truncate">{currentUser.email}</p>
                    <p className="text-slate-500">{currentUser.city} • {currentUser.preferredLanguage}</p>
                  </div>

                  <div className="p-1">
                    <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Demo One-Click Switch
                    </div>
                    <button
                      id="switch-to-citizen-btn"
                      onClick={() => {
                        switchDemoUser('citizen');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentUser.role === 'citizen' ? 'bg-emerald-50 text-emerald-900 font-semibold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <div>
                          <span>Rahul Sharma</span>
                          <span className="block text-[10px] text-slate-400">Citizen Reporter</span>
                        </div>
                      </div>
                      {currentUser.role === 'citizen' && (
                        <span className="text-[10px] text-emerald-600 font-bold">Active</span>
                      )}
                    </button>

                    <button
                      id="switch-to-admin-btn"
                      onClick={() => {
                        switchDemoUser('admin');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentUser.role === 'admin' ? 'bg-purple-50 text-purple-900 font-semibold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-purple-600" />
                        <div>
                          <span>Officer Priya Verma</span>
                          <span className="block text-[10px] text-slate-400">Municipal Admin</span>
                        </div>
                      </div>
                      {currentUser.role === 'admin' && (
                        <span className="text-[10px] text-purple-600 font-bold">Active</span>
                      )}
                    </button>
                  </div>

                  <div className="p-1">
                    <button
                      id="navbar-logout-dropdown-btn"
                      onClick={handleLogout}
                      className="w-full text-left px-2.5 py-1.5 rounded-md text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-rose-500" />
                      Logout & Switch Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Logout Button */}
            <button
              id="navbar-direct-logout-btn"
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Sign out"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-report-btn"
              onClick={() => handleNav('report')}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {citizenNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                {link.label}
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Logout & Return to Login Screen
            </button>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100">
            <div className="text-xs text-slate-500 font-medium px-2 mb-2">Active Profile</div>
            <div className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{currentUser.role} • {currentUser.city}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  switchDemoUser(currentUser.role === 'admin' ? 'citizen' : 'admin');
                }}
                className="text-[11px] font-semibold text-emerald-700 px-2 py-1 rounded bg-emerald-100"
              >
                Switch to {currentUser.role === 'admin' ? 'Citizen' : 'Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
