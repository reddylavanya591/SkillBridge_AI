import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storageService';
import { AssessmentAttempt, PersonalizedRoadmap, SkillCategory } from '../../types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw
} from 'lucide-react';

export const ProgressAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [compareAttemptA, setCompareAttemptA] = useState<string>('');
  const [compareAttemptB, setCompareAttemptB] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    const [attList, rm] = await Promise.all([
      apiService.getAssessmentHistory(user.id),
      apiService.getCurrentRoadmap(user.id)
    ]);
    setAttempts(attList);
    setRoadmap(rm);

    if (attList.length >= 2) {
      setCompareAttemptA(attList[1].id); // earlier attempt
      setCompareAttemptB(attList[0].id); // latest attempt
    } else if (attList.length === 1) {
      setCompareAttemptB(attList[0].id);
    }
    setIsLoading(false);
  };

  // Recharts data for score trajectory (chronological)
  const trajectoryData = [...attempts]
    .reverse()
    .map((att, idx) => ({
      name: `Attempt #${idx + 1}`,
      date: new Date(att.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      score: att.scorePercentage
    }));

  const attA = attempts.find((a) => a.id === compareAttemptA);
  const attB = attempts.find((a) => a.id === compareAttemptB);

  // Topic comparison data
  const topics: SkillCategory[] = [
    'Java Fundamentals',
    'Object-Oriented Programming & Collections',
    'Relational Databases & SQL',
    'Web Fundamentals & HTTP',
    'REST APIs & Architecture',
    'Spring Boot & Dependency Injection',
    'Problem-Solving & Data Structures'
  ];

  const comparisonData = topics.map((top) => {
    const scoreA = attA?.topicScores?.[top]?.percentage ?? null;
    const scoreB = attB?.topicScores?.[top]?.percentage ?? null;
    return {
      topic: top.split(' ')[0] + ' ' + (top.split(' ')[1] || ''),
      fullTopic: top,
      AttemptA: scoreA,
      AttemptB: scoreB
    };
  });

  const activities = user ? storageService.getUserActivities(user.id) : [];
  const totalHours = activities.reduce((sum, a) => sum + (a.hoursSpent || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F382C] bg-[#0F382C]/10 px-2.5 py-1 rounded-md mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Continuous Verification & Growth</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Progress Analytics & Reassessment Tracking
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Verifiable longitudinal performance comparisons across multiple diagnostic assessments. Measure how completing roadmap tasks directly elevates technical test scores.
        </p>
      </div>

      {/* Aggregate KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Completed Attempts</span>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-stone-900 mt-2">
            {attempts.length}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Immutable exam records</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Roadmap Completion</span>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-[#0F382C] mt-2">
            {roadmap?.completionPercentage || 0}%
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            {roadmap?.completedTasks || 0} of {roadmap?.totalTasks || 0} tasks done
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Study Logged</span>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-stone-900 mt-2">
            {totalHours.toFixed(1)}h
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Verified activity records</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Score Delta</span>
          {attA && attB ? (
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-stone-900">
                {attB.scorePercentage - attA.scorePercentage >= 0 ? '+' : ''}
                {attB.scorePercentage - attA.scorePercentage}%
              </span>
              {attB.scorePercentage >= attA.scorePercentage ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              )}
            </div>
          ) : (
            <p className="text-2xl font-bold font-mono text-stone-400 mt-2">—</p>
          )}
          <p className="text-[11px] text-stone-500 mt-1">Between compared attempts</p>
        </div>
      </div>

      {/* Assessment Trajectory Chart */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-stone-900">
            Score Progression Trajectory
          </h2>
          <p className="text-xs text-stone-500">
            Chronological growth curve across diagnostic assessment attempts.
          </p>
        </div>

        {trajectoryData.length >= 1 ? (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="name" stroke="#78716c" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#78716c" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Score']}
                  labelFormatter={(name) => `Exam ${name}`}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0F382C"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0F382C' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-stone-500">
            No assessment attempts yet. Complete your first diagnostic assessment to render your progress trajectory.
          </div>
        )}
      </div>

      {/* Side-By-Side Reassessment Comparison Engine */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-sm font-bold text-stone-900">
              Side-by-Side Reassessment Comparison
            </h2>
            <p className="text-xs text-stone-500">
              Compare any two historical attempts to measure domain-by-domain proficiency gains.
            </p>
          </div>

          {attempts.length >= 2 && (
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-stone-500 mr-1.5">Baseline:</span>
                <select
                  value={compareAttemptA}
                  onChange={(e) => setCompareAttemptA(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                >
                  {attempts.map((att, idx) => (
                    <option key={att.id} value={att.id}>
                      Attempt #{attempts.length - idx} ({att.scorePercentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-stone-500 mr-1.5">Latest:</span>
                <select
                  value={compareAttemptB}
                  onChange={(e) => setCompareAttemptB(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
                >
                  {attempts.map((att, idx) => (
                    <option key={att.id} value={att.id}>
                      Attempt #{attempts.length - idx} ({att.scorePercentage}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {attempts.length >= 2 && attA && attB ? (
          <div className="space-y-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis dataKey="topic" stroke="#78716c" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#78716c" fontSize={11} />
                  <Tooltip
                    formatter={(val: any) => [`${val ?? 0}%`, 'Score']}
                    labelFormatter={(val, items) => items[0]?.payload?.fullTopic || val}
                  />
                  <Legend />
                  <Bar dataKey="AttemptA" name="Baseline Attempt" fill="#a8a29e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="AttemptB" name="Latest Reassessment" fill="#0F382C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-stone-900">Baseline Attempt:</span>
                <p className="text-stone-600 mt-1">
                  Completed on {new Date(attA.completedAt).toLocaleDateString()} with overall score of{' '}
                  <strong className="font-mono tabular-nums">{attA.scorePercentage}%</strong>. Identified weak topics: {attA.weakTopics.join(', ') || 'None'}.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="font-bold text-emerald-950">Latest Reassessment:</span>
                <p className="text-stone-700 mt-1">
                  Completed on {new Date(attB.completedAt).toLocaleDateString()} with score of{' '}
                  <strong className="font-mono tabular-nums text-emerald-800">{attB.scorePercentage}%</strong>. Net change:{' '}
                  <strong className="font-mono tabular-nums">
                    {attB.scorePercentage - attA.scorePercentage >= 0 ? '+' : ''}
                    {attB.scorePercentage - attA.scorePercentage}%
                  </strong>.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-stone-500">
            {attempts.length === 1
              ? 'You have completed 1 assessment attempt so far. Retake the assessment after studying your roadmap to unlock side-by-side reassessment comparison.'
              : 'Complete multiple assessment attempts to compare performance.'}
          </div>
        )}
      </div>
    </div>
  );
};
