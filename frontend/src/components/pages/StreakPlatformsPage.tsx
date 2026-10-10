import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { DSA_PROBLEMS } from '../../data/dsaProblems';
import {
  Flame,
  Award,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Plus,
  Link as LinkIcon,
  Code2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface PlatformAccount {
  platform: 'LeetCode' | 'HackerRank' | 'GeeksforGeeks' | 'CodeChef';
  username: string;
  profileUrl: string;
  problemsSolved: number;
  connected: boolean;
}

export const StreakPlatformsPage: React.FC = () => {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [platforms, setPlatforms] = useState<PlatformAccount[]>([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [todayProblemTitle, setTodayProblemTitle] = useState<string>('');
  const [todayPlatform, setTodayPlatform] = useState<string>('LeetCode');
  const [streakLoggedMsg, setStreakLoggedMsg] = useState<string | null>(null);

  // Edit platform modal/form state
  const [editingPlatform, setEditingPlatform] = useState<PlatformAccount | null>(null);
  const [inputUsername, setInputUsername] = useState<string>('');
  const [inputProblemsCount, setInputProblemsCount] = useState<number>(0);

  useEffect(() => {
    if (user) {
      loadStreakAndPlatforms();
    }
  }, [user]);

  const loadStreakAndPlatforms = () => {
    if (!user) return;
    const streak = storageService.calculateLearningStreak(user.id);
    setCurrentStreak(streak);
    const linked = storageService.getLinkedPlatforms(user.id);
    setPlatforms(linked);
    setSolvedProblemIds(storageService.getSolvedProblemIds(user.id));
  };

  const handleLogExternalProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !todayProblemTitle.trim()) return;

    storageService.maintainStreakToday(
      user.id,
      `Solved on ${todayPlatform}: "${todayProblemTitle.trim()}"`
    );

    // Update problem count on platform
    const updated = platforms.map((p) => {
      if (p.platform === todayPlatform) {
        return { ...p, problemsSolved: p.problemsSolved + 1, connected: true };
      }
      return p;
    });
    setPlatforms(updated);
    storageService.saveLinkedPlatforms(user.id, updated);

    setTodayProblemTitle('');
    loadStreakAndPlatforms();
    setStreakLoggedMsg(`Streak extended! Solved "${todayProblemTitle}" on ${todayPlatform} 🔥`);
    setTimeout(() => setStreakLoggedMsg(null), 4000);
  };

  const handleSavePlatformConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingPlatform) return;

    const updated = platforms.map((p) => {
      if (p.platform === editingPlatform.platform) {
        const username = inputUsername.trim();
        const baseUrls: Record<string, string> = {
          LeetCode: `https://leetcode.com/u/${username}`,
          HackerRank: `https://www.hackerrank.com/profile/${username}`,
          GeeksforGeeks: `https://auth.geeksforgeeks.org/user/${username}`,
          CodeChef: `https://www.codechef.com/users/${username}`
        };
        return {
          ...p,
          username,
          profileUrl: username ? baseUrls[p.platform] : p.profileUrl,
          problemsSolved: inputProblemsCount,
          connected: !!username
        };
      }
      return p;
    });

    setPlatforms(updated);
    storageService.saveLinkedPlatforms(user.id, updated);
    setEditingPlatform(null);
  };

  // Generate 28-day activity heatmap simulation
  const today = new Date().toISOString().split('T')[0];
  const userActivities = user ? storageService.getUserActivities(user.id) : [];
  const activeDates = new Set(userActivities.map((a) => a.date.split('T')[0]));
  const isStreakActiveToday = activeDates.has(today);

  const pastDays = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date(Date.now() - (27 - i) * 86400000);
    const str = d.toISOString().split('T')[0];
    return {
      date: str,
      dayNum: d.getDate(),
      month: d.toLocaleDateString([], { month: 'short' }),
      isActive: activeDates.has(str)
    };
  });

  const CURATED_PLATFORM_SHEETS = [
    {
      title: 'LeetCode Top Interview 150',
      platform: 'LeetCode',
      badge: 'Gold Standard',
      description: 'The 150 essential questions required for FAANG and Fortune 500 technical coding rounds.',
      url: 'https://leetcode.com/studyplan/top-interview-150/'
    },
    {
      title: 'NeetCode 150 Structured Roadmap',
      platform: 'NeetCode',
      badge: 'Visual Tree',
      description: 'Categorized practice path from Arrays to Dynamic Programming with video solutions.',
      url: 'https://neetcode.io/practice'
    },
    {
      title: 'Striver’s A2Z DSA Sheet',
      platform: 'GeeksforGeeks / TakeUForward',
      badge: 'Comprehensive',
      description: 'Step-by-step 450+ curated DSA sheet from basics to advanced graphs.',
      url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/'
    },
    {
      title: 'HackerRank Java 10 Days of Practice',
      platform: 'HackerRank',
      badge: 'Language Foundations',
      description: 'Targeted Java syntax, OOP inheritance, regex, and exception handling challenges.',
      url: 'https://www.hackerrank.com/domains/java'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-900 bg-orange-100 px-2.5 py-1 rounded-md mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
            <span>Daily Streak & Practice Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Maintain Your Streak & Link Platforms
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Consistency is the single biggest predictor of landing a software engineering role. Solve daily problems either inside our built-in DSA editor or log your external LeetCode / HackerRank submissions to keep your streak burning!
          </p>
        </div>

        <Link
          to="/dsa-editor"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md hover:scale-102 transition-all shrink-0"
        >
          <Code2 className="w-4 h-4" />
          <span>Open DSA Editor</span>
        </Link>
      </div>

      {streakLoggedMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{streakLoggedMsg}</span>
        </div>
      )}

      {/* Streak Dashboard Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-5">
            <div className={`w-18 h-18 rounded-2xl flex items-center justify-center shadow-md ${
              currentStreak > 0 ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-400'
            }`}>
              <Flame className={`w-10 h-10 ${currentStreak > 0 ? 'fill-amber-300 text-amber-100 animate-pulse' : ''}`} />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-mono tabular-nums text-stone-900">
                  {currentStreak}
                </span>
                <span className="text-sm font-bold text-stone-600">Day Streak</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {isStreakActiveToday ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active today! Streak protected for tomorrow.</span>
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold">
                    Pending today! Solve 1 DSA problem or log an activity to maintain your streak.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="text-right flex items-center gap-6 text-xs">
            <div>
              <span className="text-stone-400 block font-medium">Problems Solved Here</span>
              <span className="text-xl font-bold font-mono tabular-nums text-[#0F382C]">
                {solvedProblemIds.length}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Total Lifetime Hours</span>
              <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
                {userActivities.reduce((acc, a) => acc + (a.hoursSpent || 0), 0).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>

        {/* 28-Day Streak Heatmap Calendar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900 uppercase tracking-wider">
              28-Day Consistency Heatmap
            </span>
            <span className="text-stone-400 text-[11px]">Last 4 Weeks</span>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-14 lg:grid-cols-28 gap-2">
            {pastDays.map((day) => (
              <div
                key={day.date}
                className={`h-11 rounded-lg border flex flex-col items-center justify-center text-[10px] font-mono transition-colors ${
                  day.isActive
                    ? 'bg-orange-500 border-orange-600 text-white font-bold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
                title={`${day.date}: ${day.isActive ? 'Active Study Logged' : 'No activity logged'}`}
              >
                <span>{day.dayNum}</span>
                {day.isActive && <Flame className="w-2.5 h-2.5 fill-amber-300 text-amber-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Log Form to maintain streak from external platform */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-600" />
            <h3 className="text-xs font-bold text-stone-900">
              Solved a problem elsewhere today? Log it here to maintain your streak:
            </h3>
          </div>

          <form onSubmit={handleLogExternalProblem} className="flex flex-wrap items-center gap-3 text-xs">
            <select
              value={todayPlatform}
              onChange={(e) => setTodayPlatform(e.target.value)}
              className="px-3 py-2 rounded-lg border border-stone-300 bg-white font-semibold"
            >
              <option value="LeetCode">LeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="GeeksforGeeks">GeeksforGeeks</option>
              <option value="CodeChef">CodeChef</option>
            </select>

            <input
              type="text"
              required
              value={todayProblemTitle}
              onChange={(e) => setTodayProblemTitle(e.target.value)}
              placeholder="Problem Name (e.g. Valid Anagram, Course Schedule)"
              className="flex-1 min-w-[240px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20"
            />

            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-[#0F382C] hover:bg-[#134E4A] rounded-lg transition-colors shadow-xs"
            >
              Log & Keep Streak
            </button>
          </form>

          {/* Quick preset suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-stone-200/60 text-xs">
            <span className="text-[11px] text-stone-500 font-semibold">Quick picks:</span>
            {[
              { title: 'LeetCode #1: Two Sum', platform: 'LeetCode' },
              { title: 'LeetCode #20: Valid Parentheses', platform: 'LeetCode' },
              { title: 'LeetCode #121: Best Time to Buy Stock', platform: 'LeetCode' },
              { title: 'HackerRank: Java 1D Array', platform: 'HackerRank' },
              { title: 'GFG: Key Pair', platform: 'GeeksforGeeks' }
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setTodayProblemTitle(item.title);
                  setTodayPlatform(item.platform);
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-stone-200 hover:border-orange-300 hover:text-orange-900 text-stone-600 text-[11px] transition-colors shadow-2xs font-medium"
              >
                + {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Linked Coding Platforms Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900">Connected Coding Platforms</h2>
          <p className="text-xs text-stone-500">
            Link your personal coding profiles to showcase your external problem stats alongside SkillBridge AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((p) => (
            <div
              key={p.platform}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{p.platform}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    p.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {p.connected ? 'Connected' : 'Not Linked'}
                  </span>
                </div>

                {p.connected ? (
                  <div className="space-y-1 text-xs">
                    <p className="font-mono text-stone-600 truncate">@{p.username}</p>
                    <p className="text-stone-500 text-[11px]">
                      Solved: <strong className="font-mono tabular-nums text-stone-900">{p.problemsSolved}</strong> problems
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400">Add your handle to connect this profile.</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                {p.connected ? (
                  <a
                    href={p.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#0F382C] hover:underline"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span />
                )}

                <button
                  onClick={() => {
                    setEditingPlatform(p);
                    setInputUsername(p.username);
                    setInputProblemsCount(p.problemsSolved);
                  }}
                  className="font-bold text-stone-700 hover:text-stone-900"
                >
                  {p.connected ? 'Edit' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated External DSA Platform Curriculums */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900">
            Recommended External DSA Curriculums & Problem Sheets
          </h2>
          <p className="text-xs text-stone-500">
            Handpicked industry sheets to practice alongside your personalized SkillBridge roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CURATED_PLATFORM_SHEETS.map((sheet, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    {sheet.platform}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {sheet.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900">{sheet.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{sheet.description}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={sheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F382C] hover:underline"
                >
                  <span>Explore Problem Set</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Platform Modal */}
      {editingPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-stone-900">
              Connect {editingPlatform.platform} Account
            </h3>

            <form onSubmit={handleSavePlatformConnection} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {editingPlatform.platform} Username / Handle
                </label>
                <input
                  type="text"
                  required
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder={`e.g. ${user?.name.toLowerCase().replace(/\s+/g, '') || 'coder123'}`}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Total Problems Solved on {editingPlatform.platform}
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputProblemsCount}
                  onChange={(e) => setInputProblemsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingPlatform(null)}
                  className="px-4 py-2 rounded-lg border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold rounded-lg bg-[#0F382C] text-white shadow-xs"
                >
                  Save Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
