import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CheckCircle2,
  TrendingUp,
  Map,
  BookOpen,
  LineChart,
  UserCheck,
  Shield,
  FolderGit2,
  Code2,
  Flame,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenAiGuide }) => {
  const { user, role } = useAuth();

  const studentNavItems = [
    { to: '/dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { to: '/dsa-editor', label: 'DSA Code Editor', icon: Code2, badge: 'Interactive' },
    { to: '/streak-platforms', label: 'Daily Streak & Platforms', icon: Flame, isStreak: true },
    { to: '/assessment', label: 'Skill Assessments', icon: CheckCircle2 },
    { to: '/skill-gap', label: 'Skill-Gap Matrix', icon: TrendingUp },
    { to: '/roadmap', label: 'Learning Roadmap', icon: Map },
    { to: '/resources-projects', label: 'Resources & Projects', icon: BookOpen },
    { to: '/analytics', label: 'Progress & Analytics', icon: LineChart },
    { to: '/profile', label: 'Student Profile', icon: UserCheck }
  ];

  const adminNavItems = [
    { to: '/admin', label: 'Admin Overview', icon: Shield },
    { to: '/admin?tab=questions', label: 'Question Bank Curation', icon: CheckCircle2 },
    { to: '/admin?tab=resources', label: 'Learning Resources', icon: BookOpen },
    { to: '/admin?tab=stats', label: 'Platform Metrics', icon: LineChart }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[61px] left-0 z-40 h-full md:h-[calc(100vh-61px)] w-64 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Target Role Indicator */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Target Career</p>
            <p className="text-xs font-bold text-[#0F382C] mt-0.5 truncate">
              {user?.targetRole || 'Java Full Stack Developer'}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-2">
              <span className="font-mono tabular-nums font-medium text-stone-700">
                {user?.weeklyHours || 12}h/wk
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{user?.experienceLevel || 'Intermediate'}</span>
            </div>
          </div>

          {/* Student Navigation */}
          <div>
            <p className="px-2 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Career Path
            </p>
            <nav className="space-y-0.5">
              {studentNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#0F382C] text-white shadow-xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${item.isStreak ? 'text-orange-500 fill-orange-500/20' : ''}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* AI Guide Quick Launch Banner */}
          {onOpenAiGuide && (
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-2">
              <div className="flex items-center gap-2 text-purple-900">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
                <span className="text-xs font-bold">SkillBridge AI Guide</span>
              </div>
              <p className="text-[11px] text-purple-800/90 leading-relaxed">
                Need a DSA hint, Spring Boot explanation, or study roadmap advice?
              </p>
              <button
                onClick={() => {
                  onOpenAiGuide();
                  if (window.innerWidth < 768) onClose();
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-purple-200" />
                <span>Ask AI Guide</span>
              </button>
            </div>
          )}

          {/* Admin Management Section */}
          {role === 'admin' && (
            <div>
              <p className="px-2 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Administration
              </p>
              <nav className="space-y-0.5">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => {
                        if (window.innerWidth < 768) onClose();
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#134E4A] text-white shadow-xs font-semibold'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/50">
          <div className="text-[11px] text-stone-500">
            <p className="font-bold text-[#0F382C]">SkillBridge AI</p>
            <p className="text-stone-400 mt-0.5">Career Readiness & DSA Workspace</p>
          </div>
        </div>
      </aside>
    </>
  );
};
