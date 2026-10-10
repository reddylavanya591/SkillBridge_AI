import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { AssessmentQuestion } from '../../types';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Flag,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const AssessmentTakePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedCount = Number(searchParams.get('count')) || 10;

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(requestedCount * 90);
  const [initialTimeSeconds] = useState<number>(requestedCount * 90);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadQuestions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isLoading, questions]);

  const loadQuestions = async () => {
    setIsLoading(true);
    const fetched = await apiService.getEligibleQuestions(requestedCount);
    // Sanitize: hide correctOptionIndex on the client taking screen
    const clientSafeQuestions = fetched.map((q) => ({
      ...q,
      correctOptionIndex: -1 // Hidden during active taking
    }));
    setQuestions(clientSafeQuestions);
    setIsLoading(false);
  };

  const handleSelectOption = (optionIndex: number) => {
    const q = questions[currentIndex];
    if (!q) return;
    setAnswers((prev) => ({
      ...prev,
      [q.id]: optionIndex
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlagged((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleAutoSubmit = async () => {
    if (isSubmitting || !user) return;
    setIsSubmitting(true);
    const timeSpent = initialTimeSeconds - timeLeftSeconds;
    const qIds = questions.map((q) => q.id);
    const attempt = await apiService.submitAssessment(
      user.id,
      qIds,
      answers,
      timeSpent,
      initialTimeSeconds
    );
    navigate(`/assessment/results/${attempt.id}`);
  };

  const handleManualSubmit = async () => {
    if (isSubmitting || !user) return;
    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = initialTimeSeconds - timeLeftSeconds;
    const qIds = questions.map((q) => q.id);
    const attempt = await apiService.submitAssessment(
      user.id,
      qIds,
      answers,
      timeSpent,
      initialTimeSeconds
    );
    navigate(`/assessment/results/${attempt.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#0F382C] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-stone-600">Loading Diagnostic Questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-stone-500">
        No eligible assessment questions found in the question bank. Please contact an administrator.
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const isUrgent = timeLeftSeconds < 120; // under 2 minutes
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6">
      {/* Top Floating Assessment Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F382C] text-white flex items-center justify-center font-bold text-xs">
            {currentIndex + 1}
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-[11px] text-stone-500">{currentQ.topic}</p>
          </div>
        </div>

        {/* Timer Display */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono tabular-nums text-xs font-bold transition-colors ${
          isUrgent
            ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
            : 'bg-stone-50 border-stone-200 text-stone-800'
        }`}>
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-600' : 'text-stone-500'}`} />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-stone-400 font-normal uppercase ml-1">remaining</span>
        </div>

        {/* Right Action: Submit Button */}
        <button
          onClick={() => setShowConfirmModal(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
        >
          Submit Assessment
        </button>
      </div>

      {/* Main Examination Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
              Difficulty: {currentQ.difficulty}
            </span>

            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
                flagged[currentQ.id]
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${flagged[currentQ.id] ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{flagged[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
            </button>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
              {currentQ.question}
            </h2>

            {currentQ.codeSnippet && (
              <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-[#0F382C] bg-[#0F382C]/5 text-stone-900 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-[#0F382C] text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {optionLetters[optIdx]}
                  </div>
                  <span className="leading-relaxed">{optionText}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 hover:bg-stone-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-stone-400 font-mono tabular-nums">
              {currentIndex + 1} / {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish & Submit</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Question Navigator Palette */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
              Question Navigator
            </h3>
            <p className="text-[11px] text-stone-500">
              Jump to any question or review flagged items.
            </p>
          </div>

          {/* Number Grid */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flagged[q.id];

              let bgClass = 'bg-stone-100 text-stone-700 hover:bg-stone-200';
              if (isAnswered) bgClass = 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300';
              if (isCurrent) bgClass = 'bg-[#0F382C] text-white font-bold ring-2 ring-[#0F382C]/30';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-10 rounded-lg text-xs font-mono transition-all flex items-center justify-center ${bgClass}`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300 shrink-0" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-stone-100 shrink-0" />
              <span>Unanswered ({unansweredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-amber-500 shrink-0" />
              <span>Flagged for review ({Object.values(flagged).filter(Boolean).length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F382C] text-white flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Confirm Submission</h3>
                <p className="text-xs text-stone-500">Deterministic scoring will be computed immediately.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Total Questions:</span>
                <span className="font-mono tabular-nums font-bold text-stone-900">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Answered:</span>
                <span className="font-mono tabular-nums font-bold text-emerald-700">{answeredCount}</span>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-amber-800">
                  <span>Unanswered questions:</span>
                  <span className="font-mono tabular-nums font-bold">{unansweredCount}</span>
                </div>
              )}
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-amber-700">
                Warning: You have {unansweredCount} unanswered question(s). Unanswered questions will receive zero points.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors"
              >
                Back to Exam
              </button>
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-[#0F382C] text-white hover:bg-[#134E4A] transition-colors shadow-xs"
              >
                {isSubmitting ? 'Scoring Answers...' : 'Confirm & View Results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
