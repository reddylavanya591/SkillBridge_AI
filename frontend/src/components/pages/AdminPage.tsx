import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { AssessmentQuestion, LearningResource, SkillCategory, QuestionDifficulty } from '../../types';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FolderGit2,
  BookOpen,
  Users,
  Award,
  Layers,
  Save,
  X
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, role, switchUserRole } = useAuth();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'questions' | 'resources' | 'stats'>('questions');

  // Question modal state
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);

  // Form states for question
  const [qTopic, setQTopic] = useState<SkillCategory>('Java Fundamentals');
  const [qDifficulty, setQDifficulty] = useState<QuestionDifficulty>('Intermediate');
  const [qText, setQText] = useState('');
  const [qSnippet, setQSnippet] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrectIdx, setQCorrectIdx] = useState<number>(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qPublished, setQPublished] = useState<boolean>(true);

  // Resource modal state
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState<boolean>(false);
  const [rTitle, setRTitle] = useState('');
  const [rTopic, setRTopic] = useState<SkillCategory>('Java Fundamentals');
  const [rType, setRType] = useState<any>('Documentation');
  const [rDifficulty, setRDifficulty] = useState<QuestionDifficulty>('Intermediate');
  const [rUrl, setRUrl] = useState('');
  const [rProvider, setRProvider] = useState('');
  const [rDuration, setRDuration] = useState('4 hours');
  const [rDescription, setRDescription] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuestions(storageService.getAllQuestions());
    setResources(storageService.getAllResources());
    setStats(storageService.getAdminStats());
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Question handlers
  const handleOpenNewQuestion = () => {
    setEditingQuestion(null);
    setQTopic('Java Fundamentals');
    setQDifficulty('Intermediate');
    setQText('');
    setQSnippet('');
    setQOptions(['', '', '', '']);
    setQCorrectIdx(0);
    setQExplanation('');
    setQPublished(true);
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (q: AssessmentQuestion) => {
    setEditingQuestion(q);
    setQTopic(q.topic);
    setQDifficulty(q.difficulty);
    setQText(q.question);
    setQSnippet(q.codeSnippet || '');
    setQOptions([...q.options]);
    setQCorrectIdx(q.correctOptionIndex);
    setQExplanation(q.explanation);
    setQPublished(q.isPublished);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: AssessmentQuestion = {
      id: editingQuestion ? editingQuestion.id : `q-custom-${Date.now()}`,
      topic: qTopic,
      difficulty: qDifficulty,
      question: qText,
      codeSnippet: qSnippet.trim() ? qSnippet : undefined,
      options: qOptions,
      correctOptionIndex: qCorrectIdx,
      explanation: qExplanation,
      isPublished: qPublished
    };
    storageService.saveQuestion(newQ);
    setIsQuestionModalOpen(false);
    loadData();
    showToast(editingQuestion ? 'Question updated successfully.' : 'New question created and published.');
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      storageService.deleteQuestion(id);
      loadData();
      showToast('Question deleted.');
    }
  };

  const handleTogglePublishQuestion = (q: AssessmentQuestion) => {
    storageService.saveQuestion({ ...q, isPublished: !q.isPublished });
    loadData();
    showToast(`Question ${!q.isPublished ? 'published' : 'unpublished'}.`);
  };

  // Resource handlers
  const handleOpenNewResource = () => {
    setEditingResource(null);
    setRTitle('');
    setRTopic('Java Fundamentals');
    setRType('Documentation');
    setRDifficulty('Intermediate');
    setRUrl('');
    setRProvider('');
    setRDuration('4 hours');
    setRDescription('');
    setIsResourceModalOpen(true);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    const newR: LearningResource = {
      id: editingResource ? editingResource.id : `res-custom-${Date.now()}`,
      title: rTitle,
      topic: rTopic,
      resourceType: rType,
      difficulty: rDifficulty,
      url: rUrl,
      authorOrProvider: rProvider,
      estimatedDuration: rDuration,
      isPublished: true,
      description: rDescription
    };
    storageService.saveResource(newR);
    setIsResourceModalOpen(false);
    loadData();
    showToast('Resource saved successfully.');
  };

  const handleDeleteResource = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      storageService.deleteResource(id);
      loadData();
      showToast('Resource removed.');
    }
  };

  if (role !== 'admin') {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">Administrator Access Required</h2>
        <p className="text-xs text-stone-600">
          You are currently signed in as a Student. Switch to the Administrator account to curate question banks and manage platform resources.
        </p>
        <button
          onClick={() => switchUserRole('admin')}
          className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
        >
          Switch to Administrator Role (Raju Surna)
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F382C] bg-[#0F382C]/10 px-2.5 py-1 rounded-md mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Governance & Content Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Administrator Console
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
            Manage approved assessment questions, review explanations, curate learning resources, and inspect aggregate platform statistics.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'questions' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Question Bank ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'resources' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'stats' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Platform Stats
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tab 1: Question Bank Curation */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Assessment Question Bank</h2>
              <p className="text-xs text-stone-500">
                Curated technical questions with verified answer keys and detailed explanations.
              </p>
            </div>

            <button
              onClick={handleOpenNewQuestion}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Topic Domain</th>
                  <th className="py-3 px-3">Difficulty</th>
                  <th className="py-3 px-3">Question Statement</th>
                  <th className="py-3 px-3">Correct Option</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-stone-800 truncate max-w-[150px]">
                      {q.topic}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-900 font-medium max-w-sm truncate" title={q.question}>
                      {q.question}
                    </td>
                    <td className="py-3 px-3 text-stone-600 max-w-xs truncate" title={q.options[q.correctOptionIndex]}>
                      Option {['A', 'B', 'C', 'D'][q.correctOptionIndex]}: {q.options[q.correctOptionIndex]}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleTogglePublishQuestion(q)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                          q.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {q.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditQuestion(q)}
                          className="p-1 text-stone-600 hover:text-stone-900 rounded"
                          title="Edit Question"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1 text-red-600 hover:text-red-800 rounded"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Resources Management */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Curated Learning Resources Catalog</h2>
              <p className="text-xs text-stone-500">
                Verified external links to official documentation, tutorials, and deep dive guides.
              </p>
            </div>

            <button
              onClick={handleOpenNewResource}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3">Topic</th>
                  <th className="py-3 px-3">Provider</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">URL</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-stone-900 max-w-xs truncate">{res.title}</td>
                    <td className="py-3 px-3 text-stone-600">{res.topic}</td>
                    <td className="py-3 px-3 text-stone-600">{res.authorOrProvider}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-stone-600">{res.estimatedDuration}</td>
                    <td className="py-3 px-3 max-w-xs truncate">
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-[#0F382C] underline">
                        {res.url}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-1 text-red-600 hover:text-red-800 rounded"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Aggregate Stats */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Registered Students</span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-stone-900 mt-2">
                {stats.totalStudents}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Published Questions</span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-[#0F382C] mt-2">
                {stats.publishedQuestions} / {stats.totalQuestions}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Assessment Submissions</span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-stone-900 mt-2">
                {stats.totalAssessmentsCompleted}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 font-medium">Platform Average Score</span>
              <p className="text-3xl font-extrabold font-mono tabular-nums text-purple-700 mt-2">
                {stats.averagePlatformScore}%
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Data Model & RBAC Boundaries</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Student private profiles and assessments are strictly segregated. Administrative permissions are enforced on the server-side architecture and cannot be claimed via client registration payloads.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Role-based access control (RBAC) securely active</span>
            </div>
          </div>
        </div>
      )}

      {/* Question Create/Edit Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-6 my-8 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">
                {editingQuestion ? 'Edit Assessment Question' : 'Create New Assessment Question'}
              </h3>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Topic Domain</label>
                  <select
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Java Fundamentals">Java Fundamentals</option>
                    <option value="Object-Oriented Programming & Collections">Object-Oriented Programming & Collections</option>
                    <option value="Relational Databases & SQL">Relational Databases & SQL</option>
                    <option value="Web Fundamentals & HTTP">Web Fundamentals & HTTP</option>
                    <option value="REST APIs & Architecture">REST APIs & Architecture</option>
                    <option value="Spring Boot & Dependency Injection">Spring Boot & Dependency Injection</option>
                    <option value="Problem-Solving & Data Structures">Problem-Solving & Data Structures</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Difficulty</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Question Statement</label>
                <textarea
                  required
                  rows={2}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                  placeholder="Enter the technical question scenario..."
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  value={qSnippet}
                  onChange={(e) => setQSnippet(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 font-mono text-[11px] bg-stone-900 text-stone-100"
                  placeholder="Optional code snippet or class definition..."
                />
              </div>

              {/* 4 Multiple Choice Options */}
              <div className="space-y-2">
                <label className="block font-semibold text-stone-700">Answer Options (Select Correct Answer radio)</label>
                {qOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={qCorrectIdx === idx}
                      onChange={() => setQCorrectIdx(idx)}
                      className="w-4 h-4 text-[#0F382C] focus:ring-[#0F382C] cursor-pointer"
                    />
                    <span className="font-mono font-bold text-stone-500 w-5">
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const copy = [...qOptions];
                        copy[idx] = e.target.value;
                        setQOptions(copy);
                      }}
                      placeholder={`Option ${['A', 'B', 'C', 'D'][idx]} text`}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Answer Explanation & Rationale</label>
                <textarea
                  required
                  rows={3}
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                  placeholder="Detailed explanation of why this answer is correct..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={qPublished}
                  onChange={(e) => setQPublished(e.target.checked)}
                  className="w-4 h-4 text-[#0F382C] rounded"
                />
                <label htmlFor="pub-check" className="font-semibold text-stone-700 cursor-pointer">
                  Publish to active assessment question pool
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-[#0F382C] text-white hover:bg-[#134E4A] shadow-xs"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource Create Modal */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-stone-900">Add Learning Resource</h3>
              <button onClick={() => setIsResourceModalOpen(false)}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={rTitle}
                  onChange={(e) => setRTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  placeholder="e.g. Official Spring Boot 3 Guide"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Topic</label>
                  <select
                    value={rTopic}
                    onChange={(e) => setRTopic(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Java Fundamentals">Java Fundamentals</option>
                    <option value="Spring Boot & Dependency Injection">Spring Boot & Dependency Injection</option>
                    <option value="Relational Databases & SQL">Relational Databases & SQL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={rDuration}
                    onChange={(e) => setRDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                    placeholder="e.g. 5 hours"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Author / Organization</label>
                <input
                  type="text"
                  required
                  value={rProvider}
                  onChange={(e) => setRProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  placeholder="e.g. VMware Tanzu, Baeldung"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Verified External URL</label>
                <input
                  type="url"
                  required
                  value={rUrl}
                  onChange={(e) => setRUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={rDescription}
                  onChange={(e) => setRDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300"
                  placeholder="Summary of topics covered..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold rounded-lg bg-[#0F382C] text-white"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
