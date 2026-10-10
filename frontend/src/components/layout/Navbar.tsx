import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { 
  Menu, 
  LogOut, 
  User, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles,
  Flame,
  Code2
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenAiGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenAiGuide }) => {
  const { user, role, logout, switchUserRole } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const currentStreak = user ? storageService.calculateLearningStreak(user.id) : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="flex items-center justify-between gap-6 px-4 sm:px-6 py-3 max-w-[1440px] mx-auto">
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#0F382C] group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F382C] to-[#134E4A] text-white flex items-center justify-center font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform">
              SB
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-[#0F382C] leading-none">SkillBridge</span>
              <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase mt-0.5">Career AI</span>
            </div>
          </Link>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <Link to="/dashboard" className="hover:text-[#0F382C] transition-colors py-1">
            Dashboard
          </Link>
          <Link to="/dsa-editor" className="flex items-center gap-1.5 text-purple-700 hover:text-purple-900 transition-colors py-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>DSA Workspace</span>
          </Link>
          <Link to="/assessment" className="hover:text-[#0F382C] transition-colors py-1">
            Assessments
          </Link>
          <Link to="/roadmap" className="hover:text-[#0F382C] transition-colors py-1">
            Roadmap
          </Link>
          <Link to="/streak-platforms" className="hover:text-[#0F382C] transition-colors py-1">
            Practice Hub
          </Link>
          {role === 'admin' && (
            <Link to="/admin" className="text-[#0F382C] hover:underline transition-colors py-1">
              Admin
            </Link>
          )}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Daily Streak Indicator */}
          {user && (
            <Link
              to="/streak-platforms"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                currentStreak > 0
                  ? 'border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100 hover:scale-102'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
              title="View Daily Streak Calendar & Linked Platforms"
            >
              <Flame className={`w-4 h-4 ${currentStreak > 0 ? 'text-orange-600 fill-orange-500 animate-pulse' : 'text-stone-400'}`} />
              <span className="font-mono tabular-nums">{currentStreak}d Streak</span>
            </Link>
          )}

          {/* AI Guide Trigger */}
          <button
            onClick={onOpenAiGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-900 transition-all hover:scale-102 shadow-2xs"
            title="Ask AI Career & DSA Mentor"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">AI Guide</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#0F382C] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[110px] truncate font-semibold">{user.name}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="font-bold text-stone-900 truncate">{user.name}</p>
                    <p className="text-stone-500 truncate text-[11px]">{user.email}</p>
                    <p className="text-[#0F382C] font-semibold mt-1 text-[11px]">Role: {user.role === 'admin' ? 'Administrator' : 'Student'}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50"
                    >
                      <User className="w-4 h-4 text-stone-500" />
                      <span>Student Profile</span>
                    </Link>

                    <Link
                      to="/streak-platforms"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50"
                    >
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>Streak & Platforms</span>
                    </Link>

                    {/* Role quick toggle for reviewers */}
                    <button
                      onClick={() => {
                        switchUserRole(user.role === 'admin' ? 'student' : 'admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50 text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-stone-500" />
                      <span>Switch to {user.role === 'admin' ? 'Student View' : 'Admin View'}</span>
                    </button>
                  </div>

                  <div className="border-t border-stone-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-white bg-[#0F382C] hover:bg-[#134E4A] rounded-xl transition-all shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
