import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { SkillGapItem } from '../../types';
import {
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Map,
  ArrowRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { user } = useAuth();
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      loadGaps();
    }
  }, [user]);

  const loadGaps = async () => {
    if (!user) return;
    setIsLoading(true);
    const data = await apiService.getSkillGaps(user.id);
    setGaps(data);
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Strong':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Proficient':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Developing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Needs Improvement':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-300';
    }
  };

  const highPriorityGaps = gaps.filter((g) => g.priorityLevel === 'High');
  const achievedCompetencies = gaps.filter((g) => g.priorityLevel === 'Achieved');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F382C] bg-[#0F382C]/10 px-2.5 py-1 rounded-md mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Target Role Competency Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Skill-Gap Analysis & Prioritization
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Evaluates your actual demonstrated assessment scores against the industry benchmark for{' '}
            <strong className="text-stone-900">{user?.targetRole || 'Java Full Stack Developer'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/roadmap"
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs flex items-center gap-2"
          >
            <Map className="w-4 h-4" />
            <span>View Personalized Roadmap</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-stone-500">Critical Priority Gaps</p>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-red-700 mt-2">
            {highPriorityGaps.length}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Requires focused remediation</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-stone-500">Achieved Benchmarks</p>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-emerald-700 mt-2">
            {achievedCompetencies.length}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Meets target role expectations</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <p className="text-xs font-medium text-stone-500">Total Evaluated Skills</p>
          <p className="text-3xl font-extrabold font-mono tabular-nums text-stone-900 mt-2">
            {gaps.length}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Across 7 core architectural areas</p>
        </div>
      </div>

      {/* Evidence-Based Evaluation Note */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#0F382C] shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-900">Zero-Hypothesis Evaluation Standard:</strong>
          <span className="ml-1">
            Proficiency is never assumed based on self-reported profile entries. Unassessed skills are marked as "Not Assessed" until verified through diagnostic testing.
          </span>
        </div>
      </div>

      {/* Detailed Skill Matrix Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-sm font-bold text-stone-900">
            Competency Gap Matrix & Action Recommendations
          </h2>
          <p className="text-xs text-stone-500">
            Ranked by urgency to help you focus on high-impact learning tasks.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Skill Domain</th>
                <th className="py-3 px-4">Demonstrated Score</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Target Benchmark</th>
                <th className="py-3 px-4">Assessment Evidence</th>
                <th className="py-3 px-4">Recommended Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {gaps.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {item.skillName}
                  </td>

                  <td className="py-3.5 px-4 font-mono tabular-nums font-semibold">
                    {item.demonstratedScore !== null ? (
                      <span className={item.demonstratedScore >= 75 ? 'text-emerald-700' : 'text-stone-900'}>
                        {item.demonstratedScore}%
                      </span>
                    ) : (
                      <span className="text-stone-400 font-normal">Unassessed</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getStatusBadge(item.currentStatus)}`}>
                      {item.currentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-700">
                      {item.targetStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600 max-w-xs">
                    {item.evidence}
                  </td>

                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="text-stone-800 leading-relaxed font-medium">
                      {item.recommendedAction}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
