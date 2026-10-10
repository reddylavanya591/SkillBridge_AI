import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, SkillCategory } from '../../types';
import { 
  UserCheck, 
  Save, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles,
  Layers
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [educationLevel, setEducationLevel] = useState(user?.educationLevel || 'Undergraduate');
  const [course, setCourse] = useState(user?.course || 'Computer Science (B.S.)');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Java Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    user?.experienceLevel || 'Intermediate'
  );
  const [weeklyHours, setWeeklyHours] = useState<number>(user?.weeklyHours || 12);
  const [preferredLearningFormat, setPreferredLearningFormat] = useState<
    'Hands-on Projects' | 'Video Tutorials' | 'Reading & Docs' | 'Interactive Exercises'
  >(user?.preferredLearningFormat || 'Hands-on Projects');
  const [learningGoals, setLearningGoals] = useState(user?.learningGoals || '');
  const [currentSkills, setCurrentSkills] = useState<string[]>(user?.currentSkills || ['Java Fundamentals']);

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const availableSkillOptions = [
    'Java Fundamentals',
    'Object-Oriented Programming & Collections',
    'Relational Databases & SQL',
    'Web Fundamentals & HTTP',
    'REST APIs & Architecture',
    'Spring Boot & Dependency Injection',
    'Problem-Solving & Data Structures',
    'Docker & Containerization',
    'Git Version Control'
  ];

  const handleToggleSkill = (skill: string) => {
    if (currentSkills.includes(skill)) {
      setCurrentSkills(currentSkills.filter((s) => s !== skill));
    } else {
      setCurrentSkills([...currentSkills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        educationLevel,
        course,
        targetRole,
        experienceLevel,
        weeklyHours,
        preferredLearningFormat,
        learningGoals,
        currentSkills
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F382C] bg-[#0F382C]/10 px-2.5 py-1 rounded-md mb-2">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Student Career Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Student Profile & Career Goals
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Your profile parameters calibrate the personalized learning roadmap duration and difficulty pacing.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile successfully updated! Changes persisted to user storage.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Personal & Academic Background */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">
            Personal & Academic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Registered Email (Read-only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C] bg-white"
              >
                <option value="Undergraduate">Undergraduate (B.Tech / B.S. / B.E.)</option>
                <option value="Graduate">Graduate (M.Tech / M.S. / MCA)</option>
                <option value="Bootcamp Graduate">Bootcamp / Certificate Program</option>
                <option value="Self-Taught">Self-Taught Engineer</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Degree / Major</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Computer Science, Information Tech"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C]"
              />
            </div>
          </div>
        </div>

        {/* Career Target & Commitment */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">
            Career Targets & Commitment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C] bg-white"
              >
                <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                <option value="Java Backend Engineer">Java Backend Engineer</option>
                <option value="Spring Boot Cloud Developer">Spring Boot Cloud Developer</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Current Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C] bg-white"
              >
                <option value="Beginner">Beginner (0-1 yrs)</option>
                <option value="Intermediate">Intermediate (1-3 yrs)</option>
                <option value="Advanced">Advanced (3+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Weekly Learning Availability</label>
              <select
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C] bg-white font-mono"
              >
                <option value={8}>8 Hours / Week (Light)</option>
                <option value={12}>12 Hours / Week (Standard)</option>
                <option value={18}>18 Hours / Week (Intensive)</option>
                <option value={25}>25+ Hours / Week (Full-Time)</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-stone-700 mb-1">Preferred Learning Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'Hands-on Projects',
                'Interactive Exercises',
                'Reading & Docs',
                'Video Tutorials'
              ].map((format) => (
                <button
                  type="button"
                  key={format}
                  onClick={() => setPreferredLearningFormat(format as any)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    preferredLearningFormat === format
                      ? 'border-[#0F382C] bg-[#0F382C]/5 text-stone-900 shadow-xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Self-Reported Skills */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">
            Current Self-Reported Skills (Unverified Baseline)
          </h2>
          <p className="text-[11px] text-stone-500">
            Select the technologies you have encountered. Skills will be marked as "Not Assessed" in the gap matrix until verified through an actual assessment.
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {availableSkillOptions.map((skill) => {
              const isSelected = currentSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#0F382C] text-white border-[#0F382C]'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Long-Term Goals */}
        <div className="space-y-2 text-xs">
          <label className="block font-semibold text-stone-700">Learning Goals & Target Timeline</label>
          <textarea
            rows={3}
            value={learningGoals}
            onChange={(e) => setLearningGoals(e.target.value)}
            placeholder="e.g. Preparing for summer 2026 technical backend interviews, targeting companies using Spring Boot microservices."
            className="w-full p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F382C]/20 focus:border-[#0F382C]"
          />
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <p className="text-[11px] text-stone-500">
            All data is persisted safely in compliance with user data privacy standards.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-all shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Real Evaluation Baseline & Reset Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Real Student Account Baseline
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Want to start completely fresh without any previous assessment or demo test records? Resetting clears prior attempts and roadmap cache so you can test with your genuine real data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (user && confirm('Clear all test assessment attempts, DSA submissions, and roadmaps to test cleanly with your real data?')) {
              import('../../services/storageService').then(({ storageService }) => {
                storageService.resetUserData(user.id);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              });
            }
          }}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-red-300 text-red-700 hover:bg-red-50 transition-colors shrink-0"
        >
          Reset to Clean Real Baseline
        </button>
      </div>
    </div>
  );
};
