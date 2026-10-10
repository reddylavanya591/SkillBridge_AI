import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { AssessmentAttempt } from '../../types';
import { 
  Award, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Layers, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const AssessmentListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      apiService.getAssessmentHistory(user.id).then(setAttempts);
    }
  }, [user]);

  const handleStart = () => {
    setIsStarting(true);
    navigate(`/assessment/take?count=${questionCount}`);
  };

  const latestAttempt = attempts.length > 0 ? attempts[0] : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F382C] bg-[#0F382C]/10 px-2.5 py-1 rounded-md mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Diagnostic Assessment Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Java Full Stack Developer Competency Assessment
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Test your mastery of Java 21 fundamentals, Object-Oriented Principles, Collections, SQL, HTTP Web Protocols, REST API design, and Spring Boot 3 enterprise concepts.
        </p>
      </div>

      {/* Main Assessment Launcher Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Launcher details */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <h2 className="text-base font-bold text-stone-900">Assessment Parameters</h2>
              <p className="text-xs text-stone-500">Timed, deterministic scoring. Answer keys revealed upon submission.</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-700">Question Count:</span>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-mono font-medium text-stone-900 shadow-xs"
              >
                <option value={10}>10 Questions (~15 mins)</option>
                <option value={15}>15 Questions (~20 mins)</option>
                <option value={20}>20 Questions (~30 mins)</option>
              </select>
            </div>
          </div>

          {/* Topics Covered Grid */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              Core Competencies Assessed
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <strong className="text-stone-900">Java Fundamentals</strong>
                <p className="text-stone-600 mt-0.5">Stack vs heap, wrapper types, Records, Virtual Threads.</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <strong className="text-stone-900">OOP & Collections</strong>
                <p className="text-stone-600 mt-0.5">SOLID principles, equals/hashCode contract, ConcurrentHashMap.</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <strong className="text-stone-900">Relational Databases & SQL</strong>
                <p className="text-stone-600 mt-0.5">JOIN queries, indexing, ACID transactions, Hibernate N+1.</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <strong className="text-stone-900">Web & HTTP Semantics</strong>
                <p className="text-stone-600 mt-0.5">Status codes (401 vs 403), idempotency, CORS preflights.</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <strong className="text-stone-900">REST APIs & Architecture</strong>
                <p className="text-stone-600 mt-0.5">Resource URI naming, PUT vs PATCH, JWT authorization.</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <strong className="text-stone-900">Spring Boot & DI</strong>
                <p className="text-stone-600 mt-0.5">Constructor injection, @RestControllerAdvice, Security 6.</p>
              </div>
            </div>
          </div>

          {/* Assessment Protocol Rules */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2">
            <p className="font-bold text-stone-900">Engine Protocol & Ground Rules:</p>
            <ul className="list-disc list-inside space-y-1 text-stone-600">
              <li>Each question has exactly one correct choice.</li>
              <li>Questions can be flagged and navigated freely using the Question Navigator.</li>
              <li>Calculates scores deterministically on submission with full explanation breakdown.</li>
              <li>Your results will update your personalized Roadmap and Skill-Gap Matrix.</li>
            </ul>
          </div>

          {/* Start CTA */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>Time limit: <strong className="font-mono tabular-nums text-stone-700">{questionCount * 1.5} minutes</strong></span>
            </div>

            <button
              onClick={handleStart}
              disabled={isStarting}
              className="px-6 py-3 text-sm font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-all shadow-md flex items-center gap-2"
            >
              <span>{isStarting ? 'Preparing Exam...' : 'Start Assessment Attempt'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar: Latest attempt & readiness */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Diagnostic Status
            </h3>

            {latestAttempt ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">Latest Score</span>
                    <span className="text-xl font-extrabold font-mono tabular-nums text-emerald-800">
                      {latestAttempt.scorePercentage}%
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    {latestAttempt.correctAnswersCount} of {latestAttempt.totalQuestions} questions correct.
                  </p>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Attempted on {new Date(latestAttempt.completedAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  to={`/assessment/results/${latestAttempt.id}`}
                  className="block text-center w-full py-2 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
                >
                  View Last Attempt Details →
                </Link>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold text-stone-800">No Attempts Recorded</p>
                <p className="mt-1">Complete your first attempt to calculate baseline competencies.</p>
              </div>
            )}
          </div>

          {/* Past Attempts Summary */}
          {attempts.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Attempt History ({attempts.length})
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-stone-100 text-xs">
                {attempts.map((att, idx) => (
                  <div key={att.id} className="pt-2 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-stone-900">Attempt #{attempts.length - idx}</p>
                      <p className="text-[11px] text-stone-500 font-mono tabular-nums">
                        {new Date(att.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono tabular-nums font-bold text-stone-900">
                        {att.scorePercentage}%
                      </span>
                      <Link
                        to={`/assessment/results/${att.id}`}
                        className="block text-[11px] text-[#0F382C] font-semibold hover:underline"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
