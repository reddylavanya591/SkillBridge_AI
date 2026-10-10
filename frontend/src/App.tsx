import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { LandingPage } from './components/pages/LandingPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AssessmentListPage } from './components/pages/AssessmentListPage';
import { AssessmentTakePage } from './components/pages/AssessmentTakePage';
import { AssessmentResultPage } from './components/pages/AssessmentResultPage';
import { SkillGapPage } from './components/pages/SkillGapPage';
import { RoadmapPage } from './components/pages/RoadmapPage';
import { ResourcesProjectsPage } from './components/pages/ResourcesProjectsPage';
import { ProgressAnalyticsPage } from './components/pages/ProgressAnalyticsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { AdminPage } from './components/pages/AdminPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { DsaEditorPage } from './components/dsa/DsaEditorPage';
import { DsaChallengesPage } from './components/pages/DsaChallengesPage';
import { StreakPlatformsPage } from './components/pages/StreakPlatformsPage';
import { AiGuideDrawer } from './components/ai/AiGuideDrawer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiGuideOpen, setAiGuideOpen] = useState(false);
  const [aiGuideContext, setAiGuideContext] = useState<string | undefined>(undefined);

  const handleOpenAiGuide = (context?: string) => {
    setAiGuideContext(context);
    setAiGuideOpen(true);
  };

  const isLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isTakingAssessment = location.pathname.startsWith('/assessment/take');

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenAiGuide={() => handleOpenAiGuide('General Platform Guidance')}
      />

      {/* Main Body */}
      <div className="flex-1 flex w-full">
        {/* Sidebar only on authenticated app pages (not landing or auth or full-screen test) */}
        {!isLanding && !isAuthPage && !isTakingAssessment && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpenAiGuide={() => handleOpenAiGuide('General Career & DSA Guidance')}
          />
        )}

        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Student Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dsa-editor"
              element={
                <ProtectedRoute>
                  <DsaEditorPage onOpenAiGuide={handleOpenAiGuide} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dsa"
              element={
                <ProtectedRoute>
                  <DsaEditorPage onOpenAiGuide={handleOpenAiGuide} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <DsaChallengesPage onOpenAiGuide={handleOpenAiGuide} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dsa-challenges"
              element={
                <ProtectedRoute>
                  <DsaChallengesPage onOpenAiGuide={handleOpenAiGuide} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/streak-platforms"
              element={
                <ProtectedRoute>
                  <StreakPlatformsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/streak"
              element={
                <ProtectedRoute>
                  <StreakPlatformsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <ProtectedRoute>
                  <AssessmentListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/take"
              element={
                <ProtectedRoute>
                  <AssessmentTakePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/results/:attemptId"
              element={
                <ProtectedRoute>
                  <AssessmentResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/skill-gap"
              element={
                <ProtectedRoute>
                  <SkillGapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <RoadmapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources-projects"
              element={
                <ProtectedRoute>
                  <ResourcesProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <ProgressAnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* AI Guide & Career/DSA Mentor Drawer */}
      <AiGuideDrawer
        isOpen={aiGuideOpen}
        onClose={() => setAiGuideOpen(false)}
        contextHint={aiGuideContext}
      />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
