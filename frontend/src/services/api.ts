import {
  UserProfile,
  AssessmentQuestion,
  AssessmentAttempt,
  PersonalizedRoadmap,
  PracticalProject,
  LearningResource,
  DashboardMetrics,
  SkillGapItem
} from '../types';
import { storageService } from './storageService';
import { calculateSkillGaps } from '../data/competencyFramework';
import { generateGeminiRoadmap, generateRuleBasedRoadmap } from './geminiService';

export interface BackendStatus {
  isConnected: boolean;
  endpointUrl: string;
  serverType: 'Spring Boot 3.x (Java 21)' | 'In-Browser Local Persistent Engine';
  statusMessage: string;
  checkedAt: string;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiService {
  private cachedBackendStatus: BackendStatus = {
    isConnected: false,
    endpointUrl: API_BASE_URL,
    serverType: 'In-Browser Local Persistent Engine',
    statusMessage: 'Spring Boot 3.x backend is not currently running on http://localhost:8080. Operating in Standalone Browser Mode using identical REST contract logic and deterministic scoring engine.',
    checkedAt: new Date().toISOString()
  };

  async checkBackendHealth(): Promise<BackendStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/actuator/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.cachedBackendStatus = {
          isConnected: true,
          endpointUrl: API_BASE_URL,
          serverType: 'Spring Boot 3.x (Java 21)',
          statusMessage: 'Successfully connected to live Java 21 Spring Boot 3.x backend.',
          checkedAt: new Date().toISOString()
        };
      } else {
        throw new Error(`Spring Boot responded with status ${res.status}`);
      }
    } catch {
      this.cachedBackendStatus = {
        isConnected: false,
        endpointUrl: API_BASE_URL,
        serverType: 'In-Browser Local Persistent Engine',
        statusMessage: 'Spring Boot server is offline at ' + API_BASE_URL + '. All operations execute locally with full persistence according to the exact REST API schema.',
        checkedAt: new Date().toISOString()
      };
    }
    return this.cachedBackendStatus;
  }

  getBackendStatus(): BackendStatus {
    return this.cachedBackendStatus;
  }

  // --- Profile Endpoints ---
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${userId}` }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    return storageService.getUserById(userId);
  }

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${profile.id}`
          },
          body: JSON.stringify(profile)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    storageService.saveUser(profile);
    storageService.setCurrentUser(profile);
    return profile;
  }

  // --- Assessments Endpoints ---
  async getEligibleQuestions(count: number = 10): Promise<AssessmentQuestion[]> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/assessments?count=${count}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    const published = storageService.getPublishedQuestions();
    // Shuffle and pick
    const shuffled = [...published].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, published.length));
  }

  async submitAssessment(
    userId: string,
    questionIds: string[],
    answers: Record<string, number>,
    timeSpentSeconds: number,
    maxTimeSeconds: number
  ): Promise<AssessmentAttempt> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/assessments/attempts/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userId}`
          },
          body: JSON.stringify({
            userId,
            questionIds,
            answers,
            timeSpentSeconds,
            maxTimeSeconds
          })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    return storageService.scoreAndSaveAssessment(
      userId,
      questionIds,
      answers,
      timeSpentSeconds,
      maxTimeSeconds
    );
  }

  async getAssessmentHistory(userId: string): Promise<AssessmentAttempt[]> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/assessments/history`, {
          headers: { Authorization: `Bearer ${userId}` }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    return storageService.getUserAttempts(userId);
  }

  async getAttemptById(attemptId: string): Promise<AssessmentAttempt | null> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/assessments/attempts/${attemptId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    return storageService.getAttemptById(attemptId);
  }

  // --- Skill-Gap Analysis ---
  async getSkillGaps(userId: string): Promise<SkillGapItem[]> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/skills/gaps`, {
          headers: { Authorization: `Bearer ${userId}` }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    const attempts = storageService.getUserAttempts(userId);
    const latestAttempt = attempts.length > 0 ? attempts[0] : null;
    return calculateSkillGaps(latestAttempt ? latestAttempt.topicScores : null);
  }

  // --- Roadmaps ---
  async getCurrentRoadmap(userId: string): Promise<PersonalizedRoadmap | null> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/roadmaps/current`, {
          headers: { Authorization: `Bearer ${userId}` }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    return storageService.getUserRoadmap(userId);
  }

  async generateRoadmap(userId: string, preferAI: boolean = true): Promise<PersonalizedRoadmap> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/roadmaps/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userId}`
          },
          body: JSON.stringify({ userId, preferAI })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }

    const user = storageService.getUserById(userId);
    if (!user) throw new Error('User not found');

    const attempts = storageService.getUserAttempts(userId);
    const latestAttempt = attempts.length > 0 ? attempts[0] : null;
    const existing = storageService.getUserRoadmap(userId);

    let roadmap: PersonalizedRoadmap;
    if (preferAI) {
      roadmap = await generateGeminiRoadmap(user, latestAttempt, existing);
    } else {
      roadmap = generateRuleBasedRoadmap(user, latestAttempt, existing);
    }

    storageService.saveUserRoadmap(roadmap);
    return roadmap;
  }

  async updateRoadmapTaskProgress(
    userId: string,
    taskId: string,
    status: 'not_started' | 'in_progress' | 'completed',
    hoursSpent?: number
  ): Promise<PersonalizedRoadmap | null> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/roadmaps/tasks/${taskId}/progress`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userId}`
          },
          body: JSON.stringify({ status, hoursSpent })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    return storageService.updateTaskStatus(userId, taskId, status, hoursSpent);
  }

  // --- Resources & Projects ---
  async getResources(): Promise<LearningResource[]> {
    return storageService.getAllResources().filter((r) => r.isPublished);
  }

  async getProjects(): Promise<PracticalProject[]> {
    return storageService.getUserProjects();
  }

  async updateProjectMilestone(projectId: string, milestoneId: string, isCompleted: boolean): Promise<PracticalProject[]> {
    return storageService.updateProjectMilestone(projectId, milestoneId, isCompleted);
  }

  // --- Dashboard Metrics ---
  async getDashboard(userId: string): Promise<DashboardMetrics> {
    if (this.cachedBackendStatus.isConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${userId}` }
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend call failed, using storage', e);
      }
    }
    return storageService.getDashboardMetrics(userId);
  }
}

export const apiService = new ApiService();
