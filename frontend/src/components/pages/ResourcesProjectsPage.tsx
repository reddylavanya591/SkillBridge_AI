import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { LearningResource, PracticalProject, SkillCategory } from '../../types';
import {
  BookOpen,
  FolderGit2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';

export const ResourcesProjectsPage: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [projects, setProjects] = useState<PracticalProject[]>([]);
  const [activeTab, setActiveTab] = useState<'resources' | 'projects'>('projects');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [resList, projList] = await Promise.all([
      apiService.getResources(),
      apiService.getProjects()
    ]);
    setResources(resList);
    setProjects(projList);
    setIsLoading(false);
  };

  const handleToggleMilestone = async (projectId: string, milestoneId: string, currentStatus: boolean) => {
    const updated = await apiService.updateProjectMilestone(projectId, milestoneId, !currentStatus);
    setProjects(updated);
  };

  const filteredResources = selectedTopic === 'all'
    ? resources
    : resources.filter((r) => r.topic === selectedTopic);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F382C] bg-[#0F382C]/10 px-2.5 py-1 rounded-md mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Curated Curriculum & Capstone Work</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Learning Resources & Practical Projects
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Hands-on software development milestones and verified authoritative references from Oracle, VMware Spring, PostgreSQL, and Baeldung.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'projects'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Practical Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'resources'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Curated Resources ({resources.length})
          </button>
        </div>
      </div>

      {/* Practical Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {projects.map((proj) => {
            const completedCount = proj.milestones.filter((m) => m.isCompleted).length;

            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {proj.difficulty}
                      </span>
                      <span className="text-[11px] font-semibold text-[#0F382C]">
                        {proj.targetRole}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-stone-900">{proj.title}</h2>
                    <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                      {proj.problemStatement}
                    </p>
                  </div>

                  {/* Progress metric */}
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono tabular-nums text-[#0F382C]">
                        {proj.progressPercentage}%
                      </span>
                      <span className="text-xs text-stone-500">completed</span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-mono tabular-nums mt-0.5">
                      {completedCount} / {proj.milestones.length} milestones
                    </p>
                  </div>
                </div>

                {/* Suggested Tech Stack tags */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-stone-500">Tech Stack:</span>
                  {proj.suggestedTechStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-stone-50 border border-stone-200 font-mono text-[11px] text-stone-700 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Project Milestones & Implementation Tasks
                  </h3>

                  <div className="space-y-2">
                    {proj.milestones.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors text-xs ${
                          m.isCompleted ? 'bg-emerald-50/40 border-emerald-200' : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={m.isCompleted}
                          onChange={() => handleToggleMilestone(proj.id, m.id, m.isCompleted)}
                          className="w-4 h-4 rounded text-[#0F382C] focus:ring-[#0F382C] mt-0.5 cursor-pointer accent-[#0F382C]"
                          id={`milestone-${proj.id}-${m.id}`}
                        />
                        <div>
                          <label
                            htmlFor={`milestone-${proj.id}-${m.id}`}
                            className={`font-bold cursor-pointer ${
                              m.isCompleted ? 'line-through text-stone-500' : 'text-stone-900'
                            }`}
                          >
                            {m.title}
                          </label>
                          <p className="text-stone-600 mt-0.5 leading-relaxed">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Production Acceptance Checklist */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  <p className="font-bold text-stone-900">Definition of Done / Verification Checklist:</p>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    {proj.completionChecklist.map((item, cIdx) => (
                      <li key={cIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Curated Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Topic filter bar */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Topic:</span>
            </span>
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedTopic === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              All Topics
            </button>
            {['Java Fundamentals', 'Object-Oriented Programming & Collections', 'Relational Databases & SQL', 'Spring Boot & Dependency Injection'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTopic(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedTopic === cat
                    ? 'bg-[#0F382C] text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-semibold text-[#0F382C]">{res.topic}</span>
                    <span className="font-mono tabular-nums">{res.estimatedDuration}</span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 leading-snug">
                    {res.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <span>Provider: <strong className="text-stone-600">{res.authorOrProvider}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>{res.resourceType}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                    {res.difficulty}
                  </span>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0F382C] hover:underline"
                  >
                    <span>Open Documentation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
