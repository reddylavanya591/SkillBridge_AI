import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storageService';
import { AssessmentAttempt, AssessmentQuestion, SkillCategory } from '../../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Map as MapIcon
} from 'lucide-react';

export const AssessmentResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [questionsMap, setQuestionsMap] = useState<Map<string, AssessmentQuestion>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (attemptId) {
      loadAttempt(attemptId);
    }
  }, [attemptId]);

  const loadAttempt = async (id: string) => {
    setIsLoading(true);
    const att = await apiService.getAttemptById(id);
    if (att) {
      setAttempt(att);
      const allQ = storageService.getAllQuestions();
      const map = new Map(allQ.map((q) => [q.id, q]));
      setQuestionsMap(map);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-[#0F382C] rounded-full animate-spin" />
        <p className="text-xs text-stone-500">Calculating Deterministic Score Breakdown...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="p-8 text-center text-xs text-stone-500">
        Assessment attempt not found. <Link to="/assessment" className="text-[#0F382C] underline">Return to assessments.</Link>
      </div>
    );
  }

  const isProficient = attempt.scorePercentage >= 75;
  const isDeveloping = attempt.scorePercentage >= 50 && attempt.scorePercentage < 75;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8">
      {/* Results Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Assessment Results · {attempt.domain}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Diagnostic Performance Report
            </h1>
            <p className="text-xs text-stone-500">
              Completed on {new Date(attempt.completedAt).toLocaleString()} · Time spent:{' '}
              <span className="font-mono tabular-nums font-medium text-stone-700">
                {Math.round(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
              </span>
            </p>
          </div>

          {/* Large Score Capsule */}
          <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 shrink-0">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-mono font-extrabold text-2xl tabular-nums shadow-xs ${
              isProficient
                ? 'bg-emerald-600 text-white'
                : isDeveloping
                ? 'bg-amber-600 text-white'
                : 'bg-red-600 text-white'
            }`}>
              {attempt.scorePercentage}%
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                {isProficient ? 'Proficient Mastery' : isDeveloping ? 'Developing Competency' : 'Needs Improvement'}
              </p>
              <p className="text-[11px] text-stone-500 font-mono tabular-nums">
                {attempt.correctAnswersCount} of {attempt.totalQuestions} questions correct
              </p>
            </div>
          </div>
        </div>

        {/* Action CTAs based on performance */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/roadmap"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs flex items-center gap-2"
            >
              <MapIcon className="w-4 h-4" />
              <span>Update My Roadmap with Results</span>
            </Link>

            <Link
              to="/skill-gap"
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors shadow-xs flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-purple-700" />
              <span>View Updated Skill-Gap Matrix</span>
            </Link>
          </div>

          <Link
            to="/assessment"
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Another Attempt</span>
          </Link>
        </div>
      </div>

      {/* Topic-Wise Breakdown Grid */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Topic-Wise Competency Breakdown
          </h2>
          <p className="text-xs text-stone-500">
            Real performance across each core software engineering domain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(attempt.topicScores).map(([topicName, stats]) => {
            const isWeak = attempt.weakTopics.includes(topicName as SkillCategory);
            const isStrong = attempt.strongTopics.includes(topicName as SkillCategory);

            return (
              <div
                key={topicName}
                className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                  isWeak
                    ? 'bg-red-50/50 border-red-200'
                    : isStrong
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 truncate max-w-[200px]" title={topicName}>
                    {topicName}
                  </span>
                  <span className={`font-mono tabular-nums font-bold text-xs ${
                    isWeak ? 'text-red-700' : isStrong ? 'text-emerald-700' : 'text-stone-700'
                  }`}>
                    {stats.percentage}%
                  </span>
                </div>

                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isWeak ? 'bg-red-600' : isStrong ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-stone-500">
                  <span className="font-mono tabular-nums">{stats.correct} / {stats.total} correct</span>
                  <span className="font-semibold uppercase text-[10px]">
                    {isWeak ? 'Needs Improvement' : isStrong ? 'Strong' : 'Developing'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question-By-Question Detailed Answers Review */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-stone-900">
            Question Review & Technical Explanations
          </h2>
          <p className="text-xs text-stone-500">
            Review correct answers and rationale to build deep understanding.
          </p>
        </div>

        <div className="space-y-4">
          {attempt.answers.map((ans, idx) => {
            const q = questionsMap.get(ans.questionId);
            if (!q) return null;

            const isExpanded = expandedQuestion === q.id || !ans.isCorrect;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <div
                key={ans.questionId}
                className={`rounded-xl border transition-all ${
                  ans.isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-red-200 bg-red-50/20'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                  className="p-4 cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        Question {idx + 1} · {q.topic}
                      </p>
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  <button className="text-stone-400 hover:text-stone-700 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-stone-200/60 space-y-4 text-xs">
                    {q.codeSnippet && (
                      <pre className="p-3.5 rounded-lg bg-stone-900 text-stone-100 font-mono text-[11px] overflow-x-auto">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    )}

                    {/* Options list */}
                    <div className="space-y-2">
                      {q.options.map((optText, optIdx) => {
                        const isStudentChoice = ans.selectedOptionIndex === optIdx;
                        const isCorrectChoice = q.correctOptionIndex === optIdx;

                        let style = 'bg-stone-50 border-stone-200 text-stone-700';
                        if (isCorrectChoice) style = 'bg-emerald-100 border-emerald-300 font-bold text-emerald-950';
                        else if (isStudentChoice && !ans.isCorrect) style = 'bg-red-100 border-red-300 text-red-950 font-bold';

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 ${style}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] bg-white/70">
                                {letters[optIdx]}
                              </span>
                              <span>{optText}</span>
                            </div>
                            <div className="text-[11px] shrink-0 font-semibold">
                              {isCorrectChoice && <span className="text-emerald-800">✓ Correct Answer</span>}
                              {isStudentChoice && !isCorrectChoice && <span className="text-red-800">✗ Your Selection</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Technical Explanation */}
                    <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                      <p className="font-bold text-stone-900 mb-1">Technical Rationale & Explanation:</p>
                      <p className="text-stone-600 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
