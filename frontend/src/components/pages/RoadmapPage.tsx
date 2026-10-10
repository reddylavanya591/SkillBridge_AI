import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { PersonalizedRoadmap, RoadmapPhase, RoadmapTask } from '../../types';
import {
  Map,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Play
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRoadmap();
    }
  }, [user]);

  const loadRoadmap = async () => {
    if (!user) return;
    setIsLoading(true);
    let current = await apiService.getCurrentRoadmap(user.id);
    if (!current) {
      // Auto-generate initial rule-based roadmap so user isn't stuck
      current = await apiService.generateRoadmap(user.id, false);
    }
    setRoadmap(current);

    // Expand the first phase by default
    if (current && current.phases.length > 0) {
      setExpandedPhases({ [current.phases[0].id]: true });
    }
    setIsLoading(false);
  };

  const handleGenerate = async (preferAI: boolean) => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const generated = await apiService.generateRoadmap(user.id, preferAI);
      setRoadmap(generated);
      setActionSuccess(
        preferAI 
          ? `Personalized Roadmap updated via ${generated.generatedBy === 'gemini-ai' ? 'Google Gemini AI' : 'Deterministic Rule Engine'}`
          : 'Deterministic Rule-Based Roadmap refreshed!'
      );
      setTimeout(() => setActionSuccess(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    if (!user) return;
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';
    const updated = await apiService.updateRoadmapTaskProgress(
      user.id,
      taskId,
      newStatus,
      newStatus === 'completed' ? 2 : 0
    );
    if (updated) {
      setRoadmap(updated);
      setActionSuccess(`Updated task status to ${newStatus.replace('_', ' ')}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-[#0F382C] rounded-full animate-spin" />
        <p className="text-xs text-stone-500">Loading Personalized Career Roadmap...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header & Generator Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Personalized Career Progression
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                roadmap?.generatedBy === 'gemini-ai'
                  ? 'bg-purple-100 text-purple-900 border-purple-200'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}>
                {roadmap?.generatedBy === 'gemini-ai' ? 'Google Gemini AI Powered' : 'Rule-Based Engine (Fallback)'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {roadmap?.careerRole || 'Java Full Stack Developer'} Roadmap
            </h1>

            <p className="text-xs text-stone-600 max-w-2xl mt-1 leading-relaxed">
              {roadmap?.rationale}
            </p>
          </div>

          {/* Generator Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleGenerate(true)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>{isGenerating ? 'Synthesizing with AI...' : 'Regenerate via Gemini AI'}</span>
            </button>

            <button
              onClick={() => handleGenerate(false)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset to Standard Rules</span>
            </button>
          </div>
        </div>

        {/* Progress Metric Bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-500">Progress:</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono tabular-nums text-[#0F382C]">
                {roadmap?.completionPercentage || 0}%
              </span>
              <span className="text-stone-500">completed</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2">
              <div
                className="bg-[#0F382C] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${roadmap?.completionPercentage || 0}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-stone-500">Tasks Completed:</span>
            <p className="text-2xl font-extrabold font-mono tabular-nums text-stone-900 mt-1">
              {roadmap?.completedTasks || 0} / {roadmap?.totalTasks || 0}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Across {roadmap?.phases.length || 0} phases</p>
          </div>

          <div>
            <span className="text-stone-500">Estimated Duration:</span>
            <p className="text-2xl font-extrabold font-mono tabular-nums text-stone-900 mt-1">
              {roadmap?.estimatedWeeks || 14} Weeks
            </p>
            <p className="text-[11px] text-stone-400 mt-1">At {roadmap?.weeklyHoursCommitted || 12}h/week</p>
          </div>

          <div>
            <span className="text-stone-500">Progress Preservation:</span>
            <p className="text-xs font-semibold text-stone-800 mt-1">Active</p>
            <p className="text-[11px] text-stone-500 mt-1">Completed tasks remain preserved during regenerations</p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Sequential Phase Modules */}
      <div className="space-y-6">
        {roadmap?.phases.map((phase) => {
          const isExpanded = expandedPhases[phase.id] ?? true;
          const completedInPhase = phase.tasks.filter((t) => t.status === 'completed').length;
          const isPhaseDone = completedInPhase === phase.tasks.length && phase.tasks.length > 0;

          return (
            <div
              key={phase.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs ${
                isPhaseDone ? 'border-emerald-200 bg-emerald-50/10' : 'border-stone-200'
              }`}
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(phase.id)}
                className="p-5 sm:p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isPhaseDone ? 'bg-emerald-600 text-white' : 'bg-[#0F382C] text-white'
                  }`}>
                    {phase.phaseNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-stone-900">
                        {phase.title}
                      </h2>
                      {isPhaseDone && (
                        <span className="text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Phase Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block text-xs">
                    <p className="font-mono tabular-nums font-bold text-stone-900">
                      {completedInPhase} / {phase.tasks.length} Completed
                    </p>
                    <p className="text-[11px] text-stone-500">~{phase.estimatedWeeks} Weeks</p>
                  </div>

                  <button className="p-1 text-stone-400 hover:text-stone-700">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phase Tasks List */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-stone-100 space-y-4">
                  {phase.tasks.map((task) => {
                    const isCompleted = task.status === 'completed';

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border transition-all text-xs space-y-3 ${
                          isCompleted
                            ? 'bg-stone-50 border-stone-200 opacity-85'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleToggleTaskStatus(task.id, task.status)}
                              className="w-4 h-4 rounded text-[#0F382C] focus:ring-[#0F382C] mt-0.5 cursor-pointer accent-[#0F382C]"
                              id={`check-${task.id}`}
                            />
                            <div>
                              <label
                                htmlFor={`check-${task.id}`}
                                className={`font-bold cursor-pointer text-sm ${
                                  isCompleted ? 'line-through text-stone-500' : 'text-stone-900'
                                }`}
                              >
                                {task.title}
                              </label>
                              <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                                <span>{task.skillCategory}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">~{task.estimatedHours} hrs</span>
                                {task.completedAt && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>Completed {new Date(task.completedAt).toLocaleDateString()}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleTaskStatus(task.id, task.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                              isCompleted
                                ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                                : 'bg-[#0F382C] text-white hover:bg-[#134E4A]'
                            }`}
                          >
                            {isCompleted ? 'Reopen Task' : 'Mark Complete'}
                          </button>
                        </div>

                        <p className="text-stone-600 leading-relaxed pl-7">
                          {task.description}
                        </p>

                        <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                            <p className="font-bold text-stone-800">Practice Exercise:</p>
                            <p className="text-stone-600 mt-0.5">{task.practiceExercise}</p>
                          </div>

                          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200">
                            <p className="font-bold text-stone-800">Completion Criteria:</p>
                            <p className="text-stone-600 mt-0.5">{task.completionCriteria}</p>
                          </div>
                        </div>

                        {/* Curated Resources */}
                        {task.resourceUrls && task.resourceUrls.length > 0 && (
                          <div className="pl-7 pt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-semibold text-stone-500">Recommended Guide:</span>
                            {task.resourceUrls.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F382C] hover:underline"
                              >
                                <span>{res.title}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
