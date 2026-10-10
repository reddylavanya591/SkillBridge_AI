import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  Map, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Code2, 
  Flame,
  Layers, 
  Terminal,
  ExternalLink
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 border-b border-stone-200 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F382C] bg-[#0F382C]/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#0F382C]" />
                <span>Full-Stack AI Career Readiness & DSA Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.12] text-balance">
                Assess Skills. Find Gaps. <span className="text-[#0F382C]">Build the Right Roadmap.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                SkillBridge AI bridges the gap between university education and real-world tech industry expectations. Take diagnostic assessments, pinpoint competency gaps, solve real DSA problems in an interactive editor, and maintain your daily streak!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={user ? "/assessment" : "/register"}
                  className="px-6 py-3.5 text-sm font-bold rounded-xl bg-[#0F382C] text-white hover:bg-[#134E4A] hover:scale-102 transition-all shadow-md flex items-center gap-2"
                >
                  <span>Start Free Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={user ? "/dsa-editor" : "/dsa-editor"}
                  className="px-6 py-3.5 text-sm font-bold rounded-xl bg-purple-700 text-white hover:bg-purple-800 hover:scale-102 transition-all shadow-md flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Interactive DSA Editor</span>
                </Link>

                <Link
                  to={user ? "/dashboard" : "/login"}
                  className="px-5 py-3.5 text-xs font-semibold rounded-xl bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 transition-all shadow-2xs"
                >
                  <span>Student Dashboard</span>
                </Link>
              </div>

              {/* Mechanism-to-Outcome Proof Points */}
              <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-xs text-stone-600">
                <div>
                  <p className="text-2xl font-bold font-mono tabular-nums text-stone-900">100%</p>
                  <p className="mt-0.5 text-stone-500 font-medium">Deterministic Scoring</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono tabular-nums text-[#0F382C]">9+ Tracks</p>
                  <p className="mt-0.5 text-stone-500 font-medium">Curated DSA Problems</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono tabular-nums text-orange-600">Strict</p>
                  <p className="mt-0.5 text-stone-500 font-medium">Daily Streak Tracking</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 bg-white group">
                <img
                  src="/src/assets/images/hero_career_workspace_1791618644636.jpg"
                  alt="Modern Software Engineering Workspace and Java Architecture"
                  className="w-full h-auto object-cover aspect-[16/10] group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white/95 border-t border-stone-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900">Target Role Benchmark</span>
                    <span className="text-[#0F382C] font-semibold">Java Full Stack Developer</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 mt-2">
                    <div className="bg-[#0F382C] h-2 rounded-full w-[78%]"></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-500 mt-1.5">
                    <span>Baseline Competency</span>
                    <span className="font-mono tabular-nums font-medium">78% Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Visual Career Readiness Workflow */}
      <section className="py-16 md:py-24 border-b border-stone-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-[#0F382C] uppercase tracking-wider mb-2">
              Actionable Progression
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              How SkillBridge AI Prepares You for Real Careers
            </h3>
            <p className="text-sm text-stone-600 mt-2">
              No generic tutorials or artificial scoreboards. Every step uses verified assessment evidence and industry frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F382C] text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h4 className="text-base font-bold text-stone-900">Diagnostic Assessment</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Take a timed 10-to-15 question exam spanning Java memory models, OOP, SQL JOINs, REST semantics, and Spring Boot.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h4 className="text-base font-bold text-stone-900">Skill-Gap Analysis</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                The engine evaluates demonstrated answers against the Java Full Stack competency matrix, categorizing skills from Needs Improvement to Strong.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h4 className="text-base font-bold text-stone-900">AI Personalized Roadmap</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Gemini structures a phased learning curriculum customized to your weak topics, weekly hours, and learning preferences, with rule fallback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h4 className="text-base font-bold text-stone-900">Practical Projects & Reassessment</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Build real enterprise milestones with Spring Data JPA and JWT security. Retake assessments to track verifiable score growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Focus Section: Java Full Stack */}
      <section className="py-16 md:py-24 bg-[#FBFBFA]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <img
                src="/src/assets/images/roadmap_milestone_tree_1791618683478.jpg"
                alt="Personalized Learning Milestone Tree"
                className="rounded-2xl border border-stone-200 shadow-xl object-cover w-full aspect-[4/3]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-xs font-bold text-[#0F382C] uppercase tracking-wider">
                Target Role Competency Framework
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                Rigorous Curriculum Aligned with Real Industry Demands
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Instead of superficial trivia, our question bank and learning modules cover what hiring managers actually test in technical interviews:
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#0F382C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Modern Java 21 & Virtual Threads:</strong>
                    <span className="text-stone-600 ml-1">Understand lightweight threads, Records, memory efficiency, and the JVM execution model.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#0F382C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Relational SQL & ACID Transactions:</strong>
                    <span className="text-stone-600 ml-1">Multi-table complex JOINs, indexing, grouping, and solving Hibernate N+1 query traps.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-200">
                  <CheckCircle2 className="w-4 h-4 text-[#0F382C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900">Spring Boot 3 & Security 6:</strong>
                    <span className="text-stone-600 ml-1">Constructor dependency injection, OncePerRequestFilter stateless JWT authentication, and centralized DTO validation.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold text-white bg-[#0F382C] hover:bg-[#134E4A] rounded-xl transition-all shadow-xs"
                >
                  <span>Start Java Full Stack Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-stone-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F382C]">SkillBridge AI</span>
            <span>— Assess Skills. Find Gaps. Build the Right Roadmap.</span>
          </div>
          <div>
            <span>Built with React, TypeScript, Spring Boot 3.x, Cloud Firestore, and Google Gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
