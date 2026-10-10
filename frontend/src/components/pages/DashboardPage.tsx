import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storageService';
import { DashboardMetrics, RoadmapTask } from '../../types';
import {
  Award,
  TrendingUp,
  Map,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Calendar,
  Code2,
  Trash2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quickLogHours, setQuickLogHours] = useState<number>(1);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;
    setIsLoading(false);
    const data = await apiService.getDashboard(user.id);
    setMetrics(data);
  };

  const handleCompleteNextTask = async (task: RoadmapTask) => {
    if (!user) return;
    await apiService.updateRoadmapTaskProgress(user.id, task.id, 'completed', 2);
    setLogSuccess(`Completed task "${task.title}" and recorded 2 hours of study!`);
    setTimeout(() => setLogSuccess(null), 4000);
    loadDashboard();
  };

  const handleQuickLogTime = () => {
    if (!user) return;
    storageService.logActivity({
      id: `act-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      hoursSpent: quickLogHours,
      activityType: 'resource_study',
      description: `Self-directed study on ${user.targetRole || 'Java Full Stack Developer'}`
    });
    setLogSuccess(`Successfully logged ${quickLogHours} hour(s) of focused study!`);
    setTimeout(() => setLogSuccess(null), 3000);
    loadDashboard();
  };

  if (!user) {
    return (
      <div className="p-8 text-center text-xs text-stone-500">
        Please sign in to view the student dashboard.
      </div>
    );
  }

  // Activity data for chart
  const userActivities = storageService.getUserActivities(user.id);
  const chartData = [
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 }
  ];

  // Distribute recent activities across days
  userActivities.slice(0, 10).forEach((act) => {
    const d = new Date(act.date);
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    const entry = chartData.find((c) => c.day === dayName);
    if (entry) {
      entry.hours = Number((entry.hours + (act.hoursSpent || 1)).toFixed(1));
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/images/avatar_student_user_1791618658940.jpg"
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0F382C]/20 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">Welcome back, {user.name}</h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Target Role: <strong className="text-[#0F382C] font-semibold">{user.targetRole || 'Java Full Stack Developer'}</strong>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{user.educationLevel || 'Undergraduate'} ({user.course || 'Computer Science'})</span>
            </p>
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/dsa-editor"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-xs"
          >
            <Code2 className="w-4 h-4" />
            <span>DSA Code Editor</span>
          </Link>

          <Link
            to="/streak-platforms"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100 transition-colors shadow-xs"
          >
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
            <span>Daily Streak Hub</span>
          </Link>

          <Link
            to="/assessment"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
          >
            <Award className="w-4 h-4" />
            <span>Take Assessment</span>
          </Link>

          <button
            onClick={() => {
              if (confirm('Wipe any previous test data and reset this profile to a clean slate for real evaluation?')) {
                storageService.resetUserData(user.id);
                loadDashboard();
                setLogSuccess('Account reset to clean baseline! Ready for your real data.');
                setTimeout(() => setLogSuccess(null), 4000);
              }
            }}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-xl transition-colors"
            title="Reset to Fresh Clean Account (Wipe Test Data)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {logSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{logSuccess}</span>
        </div>
      )}

      {/* Strict Learning Streak Banner */}
      {(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const hasStudiedToday = userActivities.some((a) => a.date.startsWith(todayStr));
        const streakDays = metrics?.currentStreakDays || 0;

        return (
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
            hasStudiedToday
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : streakDays > 0
              ? 'bg-amber-50/80 border-amber-300 text-amber-950 animate-pulse'
              : 'bg-orange-50/70 border-orange-200 text-orange-950'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                hasStudiedToday ? 'bg-emerald-600 text-white' : 'bg-orange-500 text-white'
              }`}>
                <Flame className="w-5 h-5 fill-amber-300 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {hasStudiedToday
                      ? `Streak Active: ${streakDays} Day(s)`
                      : streakDays > 0
                      ? `⚠️ Streak At Risk: ${streakDays} Day(s)`
                      : 'Daily Learning Streak'}
                  </span>
                  {hasStudiedToday && (
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.2 rounded-full font-bold">
                      Protected for Tomorrow
                    </span>
                  )}
                </div>
                <p className="text-stone-600 mt-0.5 text-xs">
                  {hasStudiedToday
                    ? 'Great work! You completed learning activity today. Your streak is secure.'
                    : streakDays > 0
                    ? 'You haven’t solved a problem or logged study today yet! Solve 1 DSA problem before midnight to avoid losing your streak.'
                    : 'Consistency is key to landing your target software engineering role. Solve 1 DSA problem to ignite your streak!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/dsa-editor"
                className="px-3.5 py-1.5 font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
              >
                Solve in DSA Editor
              </Link>
              <Link
                to="/streak-platforms"
                className="px-3 py-1.5 font-bold rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors"
              >
                Streak Hub
              </Link>
            </div>
          </div>
        );
      })()}

      {/* Primary KPI Grid (Tabular Numerals) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Latest Assessment Score */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Latest Assessment</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
              {metrics?.latestAssessmentScore !== null ? `${metrics?.latestAssessmentScore}%` : '—'}
            </span>
            {metrics && metrics.previousAssessmentScore !== null && metrics.latestAssessmentScore !== null && (
              <span className={`text-xs font-semibold font-mono tabular-nums ${
                metrics.latestAssessmentScore >= metrics.previousAssessmentScore
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}>
                {metrics.latestAssessmentScore >= metrics.previousAssessmentScore ? '+' : ''}
                {metrics.latestAssessmentScore - metrics.previousAssessmentScore}%
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {metrics?.totalAssessmentsTaken ? `${metrics.totalAssessmentsTaken} completed attempt(s)` : 'No attempts yet'}
          </p>
        </div>

        {/* Metric 2: Roadmap Progress */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Roadmap Completion</span>
            <Map className="w-4 h-4 text-[#0F382C]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-[#0F382C]">
              {metrics?.roadmapCompletionPercentage || 0}%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            <span className="font-mono tabular-nums">{metrics?.completedRoadmapTasks || 0}</span> of{' '}
            <span className="font-mono tabular-nums">{metrics?.totalRoadmapTasks || 0}</span> tasks completed
          </p>
        </div>

        {/* Metric 3: Active Study Streak */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
              {metrics?.currentStreakDays || 0}
            </span>
            <span className="text-xs text-stone-500 font-medium">day(s)</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Calculated from real daily activity logs
          </p>
        </div>

        {/* Metric 4: Weekly Hours Logged */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
            <span>Weekly Study Progress</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
              {metrics?.weeklyHoursLogged || 0}
            </span>
            <span className="text-xs text-stone-500 font-medium">/ {user.weeklyHours || 12}h goal</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Total lifetime: <span className="font-mono tabular-nums font-semibold">{metrics?.totalHoursLearned || 0}h</span>
          </p>
        </div>
      </div>

      {/* Featured Daily DSA Problem Challenge */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 rounded-2xl border border-stone-800 p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Problem of the Day</span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Easy · Arrays & Hashing
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Two Sum — Master O(N) Hash Map Lookup
          </h2>
          <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
            The foundation of technical coding interviews. Solve it in our interactive multi-language editor or log your LeetCode solution to maintain your daily streak!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dsa-editor?problem=two-sum"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:scale-102 transition-all"
          >
            <Code2 className="w-4 h-4" />
            <span>Solve in DSA Workspace</span>
          </Link>
          <Link
            to="/dsa-editor"
            className="px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition-colors"
          >
            Browse Tracks
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recommended Task & Weakest Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recommended Next Learning Task */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Recommended Next Learning Task</span>
              </h2>
              <Link to="/roadmap" className="text-xs text-[#0F382C] font-semibold hover:underline">
                View All Tasks
              </Link>
            </div>

            {metrics?.recommendedNextTask ? (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-stone-500">
                    {metrics.recommendedNextTask.skillCategory}
                  </span>
                  <span className="text-[11px] font-mono tabular-nums text-stone-600">
                    ~{metrics.recommendedNextTask.estimatedHours} hrs
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900">
                  {metrics.recommendedNextTask.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {metrics.recommendedNextTask.description}
                </p>

                <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs">
                  <p className="font-semibold text-stone-800">Practice Goal:</p>
                  <p className="text-stone-600 mt-0.5">{metrics.recommendedNextTask.practiceExercise}</p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleCompleteNextTask(metrics.recommendedNextTask!)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Task Completed</span>
                  </button>

                  <Link
                    to="/roadmap"
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Open in Roadmap →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#0F382C] mx-auto" />
                <p className="text-xs font-semibold text-stone-800">No Pending Tasks</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  You haven't generated a personalized roadmap yet or have finished all tasks. Take an assessment to generate your personalized path.
                </p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#0F382C] text-white"
                >
                  <span>Start Assessment</span>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Study Hours Logger */}
          <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-stone-700">Quick Log Study Time:</span>
            <div className="flex items-center gap-2">
              <select
                value={quickLogHours}
                onChange={(e) => setQuickLogHours(Number(e.target.value))}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              >
                <option value={0.5}>0.5 Hour</option>
                <option value={1}>1.0 Hour</option>
                <option value={2}>2.0 Hours</option>
                <option value={3}>3.0 Hours</option>
              </select>
              <button
                onClick={handleQuickLogTime}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 text-white hover:bg-stone-900 transition-colors"
              >
                Log Hours
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Weakest Skill Areas & Skill Gap Preview */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Priority Focus Areas (Gaps)</span>
              </h2>
              <Link to="/skill-gap" className="text-xs text-[#0F382C] font-semibold hover:underline">
                View Full Matrix
              </Link>
            </div>

            {metrics?.weakestSkillAreas && metrics.weakestSkillAreas.length > 0 ? (
              <div className="space-y-3">
                {metrics.weakestSkillAreas.map((skill, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950">{skill}</span>
                      <span className="text-[11px] font-semibold text-amber-700 uppercase">Needs Focus</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Identified by diagnostic assessment results. Roadmap Phase contains targeted exercises.
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-xs font-semibold text-stone-700">No Critical Gaps Detected</p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Complete a 15-question diagnostic assessment to evaluate competencies across Java, SQL, and Spring Boot.
                </p>
                <Link
                  to="/assessment"
                  className="inline-block mt-3 text-xs font-bold text-[#0F382C] hover:underline"
                >
                  Take Assessment Now →
                </Link>
              </div>
            )}
          </div>

          {/* Quick study activity chart preview */}
          <div className="mt-6 pt-4 border-t border-stone-200">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              Weekly Activity (Hours)
            </p>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="day" stroke="#a8a29e" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a8a29e" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="hours" stroke="#0F382C" fill="#0F382C" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assessment Attempts Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Recent Assessment History</h2>
            <p className="text-xs text-stone-500">Immutable records of diagnostic and reassessment test attempts.</p>
          </div>
          <Link
            to="/assessment"
            className="text-xs font-bold text-[#0F382C] hover:underline flex items-center gap-1"
          >
            <span>Take New Attempt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {metrics?.recentAttempts && metrics.recentAttempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Correct Answers</th>
                  <th className="py-2.5 px-3">Time Spent</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {metrics.recentAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-3 font-mono tabular-nums text-stone-600">
                      {new Date(attempt.completedAt).toLocaleDateString()} {new Date(attempt.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 font-medium text-stone-900">{attempt.domain}</td>
                    <td className="py-3 px-3 font-mono tabular-nums font-bold text-stone-900">
                      <span className={`px-2 py-0.5 rounded ${
                        attempt.scorePercentage >= 75
                          ? 'bg-emerald-100 text-emerald-800'
                          : attempt.scorePercentage >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attempt.scorePercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-stone-600">
                      {attempt.correctAnswersCount} / {attempt.totalQuestions}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-stone-600">
                      {Math.round(attempt.timeSpentSeconds / 60)} min {attempt.timeSpentSeconds % 60}s
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/assessment/results/${attempt.id}`}
                        className="text-xs font-semibold text-[#0F382C] hover:underline"
                      >
                        Review Breakdown →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-stone-500">
            No assessment attempts recorded yet. Take your first diagnostic exam to calculate your baseline scores.
          </div>
        )}
      </div>
    </div>
  );
};
