import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DSA_PROBLEMS } from '../../data/dsaProblems';
import { storageService } from '../../services/storageService';
import { DsaDifficulty, DsaProblem } from '../../types';
import {
  Code2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Flame,
  Sparkles,
  Shuffle,
  Search,
  Filter,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  LayoutGrid,
  List,
  Check,
  Zap,
  Target,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react';

interface DsaChallengesPageProps {
  onOpenAiGuide?: (context?: string) => void;
}

export const DsaChallengesPage: React.FC<DsaChallengesPageProps> = ({ onOpenAiGuide }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Unsolved'>('All');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showRecentSubmissions, setShowRecentSubmissions] = useState<boolean>(false);

  // User solved problems and submissions
  const solvedProblemIds = useMemo(() => {
    return user ? storageService.getSolvedProblemIds(user.id) : [];
  }, [user]);

  const recentSubmissions = useMemo(() => {
    return user ? storageService.getDsaSubmissions(user.id).slice(0, 8) : [];
  }, [user]);

  const currentStreak = useMemo(() => {
    return user ? storageService.calculateLearningStreak(user.id) : 0;
  }, [user]);

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(DSA_PROBLEMS.map((p) => p.category)));
    return ['All', ...cats];
  }, []);

  // Curated Tracks
  const curatedTracks = [
    { id: 'All', name: 'All Problems', description: 'Complete problem repository' },
    { id: 'Blind 75', name: 'Blind 75 Essentials', description: 'Core 75 FAANG interview pattern questions' },
    { id: 'NeetCode 150', name: 'NeetCode 150 Core', description: 'Structured mastery roadmap' },
    { id: 'Top Interview 50', name: 'Top Interview 50', description: 'Most frequently asked in tech screens' },
    { id: 'Daily Challenge', name: 'Daily Picks', description: 'Hand-picked problems for streak maintenance' }
  ];

  // Difficulty stats computation
  const stats = useMemo(() => {
    const total = DSA_PROBLEMS.length;
    const solvedTotal = solvedProblemIds.length;

    const easyProblems = DSA_PROBLEMS.filter((p) => p.difficulty === 'Easy');
    const easySolved = easyProblems.filter((p) => solvedProblemIds.includes(p.id)).length;

    const mediumProblems = DSA_PROBLEMS.filter((p) => p.difficulty === 'Medium');
    const mediumSolved = mediumProblems.filter((p) => solvedProblemIds.includes(p.id)).length;

    const hardProblems = DSA_PROBLEMS.filter((p) => p.difficulty === 'Hard');
    const hardSolved = hardProblems.filter((p) => solvedProblemIds.includes(p.id)).length;

    // Weighted readiness score (Easy=1x, Med=2.5x, Hard=5x)
    const maxWeight = easyProblems.length * 1 + mediumProblems.length * 2.5 + hardProblems.length * 5;
    const currentWeight = easySolved * 1 + mediumSolved * 2.5 + hardSolved * 5;
    const readinessPercent = maxWeight > 0 ? Math.round((currentWeight / maxWeight) * 100) : 0;

    let readinessTier = 'Novice Explorer';
    if (readinessPercent >= 85) readinessTier = 'FAANG Interview Ready';
    else if (readinessPercent >= 60) readinessTier = 'Advanced Contender';
    else if (readinessPercent >= 35) readinessTier = 'Intermediate Solver';
    else if (readinessPercent > 0) readinessTier = 'Active Learner';

    return {
      total,
      solvedTotal,
      overallPercent: total > 0 ? Math.round((solvedTotal / total) * 100) : 0,
      easy: {
        total: easyProblems.length,
        solved: easySolved,
        percent: easyProblems.length > 0 ? Math.round((easySolved / easyProblems.length) * 100) : 0
      },
      medium: {
        total: mediumProblems.length,
        solved: mediumSolved,
        percent: mediumProblems.length > 0 ? Math.round((mediumSolved / mediumProblems.length) * 100) : 0
      },
      hard: {
        total: hardProblems.length,
        solved: hardSolved,
        percent: hardProblems.length > 0 ? Math.round((hardSolved / hardProblems.length) * 100) : 0
      },
      readinessPercent,
      readinessTier
    };
  }, [solvedProblemIds]);

  // Topic distribution stats
  const topicStats = useMemo(() => {
    const map: Record<string, { total: number; solved: number }> = {};
    DSA_PROBLEMS.forEach((p) => {
      if (!map[p.category]) {
        map[p.category] = { total: 0, solved: 0 };
      }
      map[p.category].total += 1;
      if (solvedProblemIds.includes(p.id)) {
        map[p.category].solved += 1;
      }
    });
    return map;
  }, [solvedProblemIds]);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return DSA_PROBLEMS.filter((prob) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prob.title.toLowerCase().includes(q);
        const matchesCategory = prob.category.toLowerCase().includes(q);
        const matchesSlug = prob.slug.toLowerCase().includes(q);
        const matchesLcNum = prob.leetcodeNumber && prob.leetcodeNumber.toString().includes(q.replace('#', ''));
        if (!matchesTitle && !matchesCategory && !matchesSlug && !matchesLcNum) {
          return false;
        }
      }

      // Difficulty
      if (selectedDifficulty !== 'All' && prob.difficulty !== selectedDifficulty) {
        return false;
      }

      // Category
      if (selectedCategory !== 'All' && prob.category !== selectedCategory) {
        return false;
      }

      // Status
      const isSolved = solvedProblemIds.includes(prob.id);
      if (selectedStatus === 'Solved' && !isSolved) return false;
      if (selectedStatus === 'Unsolved' && isSolved) return false;

      // Curated Track
      if (selectedTrack !== 'All') {
        if (!prob.curatedLists || !prob.curatedLists.includes(selectedTrack)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedDifficulty, selectedCategory, selectedStatus, selectedTrack, solvedProblemIds]);

  // Handle pick random challenge
  const handlePickRandom = () => {
    // Prefer unsolved
    const unsolved = DSA_PROBLEMS.filter((p) => !solvedProblemIds.includes(p.id));
    const pool = unsolved.length > 0 ? unsolved : DSA_PROBLEMS;
    const randomPick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/dsa-editor?problem=${randomPick.slug}`);
  };

  const getDifficultyColor = (diff: DsaDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Hard':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-stone-700 bg-stone-50 border-stone-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#0F382C]/10 via-[#134E4A]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0F382C]/10 text-[#0F382C]">
                <Layers className="w-3.5 h-3.5" />
                LeetCode Curated Sets
              </span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-xs font-medium text-stone-500">
                {DSA_PROBLEMS.length} Curated Challenges Available
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              DSA Problem Sets & Difficulty Tracker
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              Curated LeetCode-style problem tracks across core data structures and algorithmic patterns. Track your difficulty completion, test implementations in real-time, and preserve your daily streak.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handlePickRandom}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
              title="Pick a random unsolved problem"
            >
              <Shuffle className="w-4 h-4 text-stone-600" />
              <span>Random Challenge</span>
            </button>

            <Link
              to="/dsa-editor"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F382C] hover:bg-[#134E4A] text-white text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <Code2 className="w-4 h-4" />
              <span>Open Code Editor</span>
            </Link>

            <Link
              to="/streak-platforms"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-orange-900 text-xs font-bold transition-colors shadow-2xs"
              title="Daily Coding Streak"
            >
              <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-pulse" />
              <span>Streak: {currentStreak}d</span>
            </Link>

            {onOpenAiGuide && (
              <button
                onClick={() => onOpenAiGuide('DSA Problem Sets & LeetCode Strategy')}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition-colors shadow-2xs"
                title="Consult AI DSA Mentor"
              >
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>AI Coach</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Difficulty Tracking Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Completion Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Overall Solved</span>
              <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <Target className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900">{stats.solvedTotal}</span>
              <span className="text-sm font-semibold text-stone-400">/ {stats.total} Problems</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-medium text-stone-600 mb-1.5">
              <span>Progress Rate</span>
              <span className="font-bold text-[#0F382C]">{stats.overallPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0F382C] to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.overallPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Easy Progress Card */}
        <div className="bg-white rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/20 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Easy Tier</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {stats.easy.percent}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900">{stats.easy.solved}</span>
              <span className="text-sm font-semibold text-stone-400">/ {stats.easy.total} Solved</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100/60">
            <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.easy.percent}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              Fundamental arrays, maps, recursion base cases
            </p>
          </div>
        </div>

        {/* Medium Progress Card */}
        <div className="bg-white rounded-2xl border border-amber-100 bg-gradient-to-b from-white to-amber-50/20 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Medium Tier</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
                {stats.medium.percent}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900">{stats.medium.solved}</span>
              <span className="text-sm font-semibold text-stone-400">/ {stats.medium.total} Solved</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100/60">
            <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.medium.percent}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              Two pointers, sliding window, prefix sums, DP
            </p>
          </div>
        </div>

        {/* Hard Progress Card / Readiness */}
        <div className="bg-white rounded-2xl border border-rose-100 bg-gradient-to-b from-white to-rose-50/20 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Hard Tier</span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800">
                {stats.hard.percent}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900">{stats.hard.solved}</span>
              <span className="text-sm font-semibold text-stone-400">/ {stats.hard.total} Solved</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100/60">
            <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.hard.percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] font-bold text-stone-700">Interview Readiness</span>
              <span className="text-[11px] font-extrabold text-stone-900">{stats.readinessPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Mastery Grid */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0F382C]" />
            <h3 className="text-sm font-bold text-stone-900">Topic & Pattern Mastery</h3>
          </div>
          <span className="text-xs text-stone-500">
            Click any category to filter problem list
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(topicStats).map(([category, topic]) => {
            const pct = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(isSelected ? 'All' : category)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#0F382C] bg-[#0F382C]/5 ring-2 ring-[#0F382C]/20'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-semibold text-stone-800 truncate mb-1" title={category}>
                  {category}
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
                  <span>{topic.solved} / {topic.total}</span>
                  <span className="font-bold text-stone-700">{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-[#0F382C]' : 'bg-transparent'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curated Track Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {curatedTracks.map((track) => {
          const isActive = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                isActive
                  ? 'bg-[#0F382C] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{track.name}</span>
              {track.id !== 'All' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {DSA_PROBLEMS.filter((p) => p.curatedLists?.includes(track.id)).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem title, #number, or tag..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#0F382C] focus:ring-1 focus:ring-[#0F382C]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns and View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#0F382C]"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#0F382C]"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved ({stats.solvedTotal})</option>
              <option value="Unsolved">Unsolved ({stats.total - stats.solvedTotal})</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#0F382C] max-w-[150px]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Topics' : c}
                </option>
              ))}
            </select>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-0.5">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'cards' ? 'bg-white shadow-2xs text-[#0F382C] font-bold' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-2xs text-[#0F382C] font-bold' : 'text-stone-500 hover:text-stone-800'
                }`}
                title="LeetCode Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary & Active Badges */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div>
            Showing <strong className="text-stone-800">{filteredProblems.length}</strong> of {DSA_PROBLEMS.length} challenges
            {selectedTrack !== 'All' && <span> in <strong>{selectedTrack}</strong></span>}
          </div>

          {(selectedDifficulty !== 'All' || selectedCategory !== 'All' || selectedStatus !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDifficulty('All');
                setSelectedCategory('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#0F382C] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Problem Content Rendering: Card Grid or LeetCode Table */}
      {filteredProblems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">No matching challenges found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              We couldn't find any problem matching your search criteria. Try clearing filters or searching with different keywords.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('All');
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSelectedTrack('All');
            }}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProblems.map((problem) => {
            const isSolved = solvedProblemIds.includes(problem.id);

            return (
              <div
                key={problem.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Solved Status, LC Number & Difficulty */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {isSolved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Solved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                          <Circle className="w-3 h-3 text-stone-400" />
                          <span>Todo</span>
                        </span>
                      )}

                      {problem.leetcodeNumber && (
                        <span className="text-[11px] font-mono font-bold text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200">
                          #{problem.leetcodeNumber}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Title and Category */}
                  <div className="mb-2">
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-[#0F382C] transition-colors leading-snug">
                      {problem.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-stone-500">
                        {problem.category}
                      </span>
                      {problem.acceptanceRate && (
                        <>
                          <span className="text-stone-300">•</span>
                          <span className="text-[11px] text-stone-500 font-medium">
                            Acc: {problem.acceptanceRate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {problem.description.replace(/`|\*\*|\*/g, '')}
                  </p>

                  {/* Curated Track tags */}
                  {problem.curatedLists && problem.curatedLists.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {problem.curatedLists.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: External links & Solve CTA */}
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  {/* Platform links */}
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Links:</span>
                    {problem.externalLinks.slice(0, 2).map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-stone-600 hover:text-[#0F382C] hover:underline font-medium"
                      >
                        <span>{link.platform}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>

                  {/* Direct Launch Editor Button */}
                  <button
                    onClick={() => navigate(`/dsa-editor?problem=${problem.slug}`)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0F382C] hover:bg-[#134E4A] text-white text-xs font-bold transition-all shadow-2xs group-hover:shadow-xs active:scale-[0.99]"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{isSolved ? 'Re-solve in Editor' : 'Solve Challenge'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LeetCode Classic Table View */
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-4 w-16">#</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Acceptance</th>
                  <th className="py-3.5 px-4">Curated Sets</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProblems.map((problem) => {
                  const isSolved = solvedProblemIds.includes(problem.id);

                  return (
                    <tr
                      key={problem.id}
                      className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/dsa-editor?problem=${problem.slug}`)}
                    >
                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-300 mx-auto" />
                        )}
                      </td>

                      {/* LeetCode # */}
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-500">
                        {problem.leetcodeNumber ? `#${problem.leetcodeNumber}` : '—'}
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 group-hover:text-[#0F382C] transition-colors">
                          {problem.title}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-stone-600 font-medium">
                        {problem.category}
                      </td>

                      {/* Difficulty */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>

                      {/* Acceptance Rate */}
                      <td className="py-3.5 px-4 text-stone-600 font-medium">
                        {problem.acceptanceRate || '50.0%'}
                      </td>

                      {/* Curated sets */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {problem.curatedLists?.slice(0, 2).map((list) => (
                            <span
                              key={list}
                              className="text-[10px] font-semibold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded"
                            >
                              {list}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dsa-editor?problem=${problem.slug}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0F382C] hover:bg-[#134E4A] text-white text-[11px] font-bold transition-all shadow-2xs inline-flex items-center gap-1.5"
                        >
                          <span>Solve</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity / Solved Submissions */}
      {recentSubmissions.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F382C]" />
              <h3 className="text-sm font-bold text-stone-900">Your Recent Challenge Submissions</h3>
            </div>
            <button
              onClick={() => setShowRecentSubmissions(!showRecentSubmissions)}
              className="text-xs font-semibold text-[#0F382C] hover:underline"
            >
              {showRecentSubmissions ? 'Hide Records' : `View Recent (${recentSubmissions.length})`}
            </button>
          </div>

          {showRecentSubmissions && (
            <div className="space-y-2 pt-2 border-t border-stone-100">
              {recentSubmissions.map((sub: any) => {
                const prob = DSA_PROBLEMS.find((p) => p.id === sub.problemId);
                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50/70 border border-stone-200 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-stone-900">
                          {sub.problemTitle || prob?.title || sub.problemId}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Language: <span className="font-mono uppercase font-semibold">{sub.language}</span> • Tests passed: {sub.testsPassed}/{sub.totalTests}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-stone-400">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                      {prob && (
                        <button
                          onClick={() => navigate(`/dsa-editor?problem=${prob.slug}`)}
                          className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-[11px] transition-colors"
                        >
                          Open Code
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
