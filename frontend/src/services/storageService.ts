import {
  UserProfile,
  AssessmentQuestion,
  AssessmentAttempt,
  AssessmentAnswerRecord,
  PersonalizedRoadmap,
  PracticalProject,
  LearningResource,
  LearningActivityLog,
  SkillCategory,
  DashboardMetrics
} from '../types';
import { STARTER_QUESTION_BANK } from '../data/questionBank';
import { CURATED_LEARNING_RESOURCES, PRACTICAL_PROJECTS } from '../data/resourcesAndProjects';

const KEYS = {
  USERS: 'skillbridge_users_db',
  CURRENT_USER: 'skillbridge_current_user',
  QUESTIONS: 'skillbridge_question_bank',
  ATTEMPTS: 'skillbridge_assessment_attempts',
  ROADMAPS: 'skillbridge_roadmaps',
  PROJECTS: 'skillbridge_user_projects',
  RESOURCES: 'skillbridge_resources',
  ACTIVITY_LOGS: 'skillbridge_activity_logs',
  DSA_SUBMISSIONS: 'skillbridge_dsa_submissions',
  LINKED_PLATFORMS: 'skillbridge_linked_platforms'
};


class StorageService {
  constructor() {
    this.evictFakeSeedUsers();
    this.initDefaults();
  }

  /** One-time migration: remove old fake demo users seeded in earlier builds. */
  private evictFakeSeedUsers() {
    const FAKE_EMAILS = ['student@skillbridge.io', 'rajusurna18@gmail.com'];
    const FAKE_IDS = ['user-student-default', 'user-admin-default'];

    const raw = localStorage.getItem(KEYS.USERS);
    if (raw) {
      const users: UserProfile[] = JSON.parse(raw);
      const cleaned = users.filter(
        (u) => !FAKE_EMAILS.includes(u.email.toLowerCase()) && !FAKE_IDS.includes(u.id)
      );
      if (cleaned.length !== users.length) {
        localStorage.setItem(KEYS.USERS, JSON.stringify(cleaned));
      }
    }

    // Also clear current session if it was a fake account
    const currentRaw = localStorage.getItem(KEYS.CURRENT_USER);
    if (currentRaw) {
      const current: UserProfile = JSON.parse(currentRaw);
      if (FAKE_EMAILS.includes(current.email.toLowerCase()) || FAKE_IDS.includes(current.id)) {
        localStorage.removeItem(KEYS.CURRENT_USER);
      }
    }
  }


  private initDefaults() {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.QUESTIONS)) {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(STARTER_QUESTION_BANK));
    }
    if (!localStorage.getItem(KEYS.RESOURCES)) {
      localStorage.setItem(KEYS.RESOURCES, JSON.stringify(CURATED_LEARNING_RESOURCES));
    }
    if (!localStorage.getItem(KEYS.PROJECTS)) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(PRACTICAL_PROJECTS));
    }
    if (!localStorage.getItem(KEYS.ATTEMPTS)) {
      localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.ROADMAPS)) {
      localStorage.setItem(KEYS.ROADMAPS, JSON.stringify({}));
    }
    if (!localStorage.getItem(KEYS.ACTIVITY_LOGS)) {
      localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify([]));
    }
  }

  // --- Users & Profiles ---
  getAllUsers(): UserProfile[] {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  }

  getUserById(userId: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find((u) => u.id === userId) || null;
  }

  getUserByEmail(email: string): UserProfile | null {
    const users = this.getAllUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  saveUser(user: UserProfile): void {
    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (!raw) return null;
    const user = JSON.parse(raw);
    // ensure latest version from users db
    return this.getUserById(user.id) || user;
  }

  setCurrentUser(user: UserProfile | null): void {
    if (!user) {
      localStorage.removeItem(KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }

  // --- Questions (Admin & Assessment Engine) ---
  getAllQuestions(): AssessmentQuestion[] {
    const raw = localStorage.getItem(KEYS.QUESTIONS);
    return raw ? JSON.parse(raw) : [];
  }

  getPublishedQuestions(): AssessmentQuestion[] {
    return this.getAllQuestions().filter((q) => q.isPublished);
  }

  saveQuestion(question: AssessmentQuestion): void {
    const questions = this.getAllQuestions();
    const index = questions.findIndex((q) => q.id === question.id);
    if (index >= 0) {
      questions[index] = question;
    } else {
      questions.push(question);
    }
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  }

  deleteQuestion(id: string): void {
    const questions = this.getAllQuestions().filter((q) => q.id !== id);
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions));
  }

  // --- Assessment Scoring & Attempts ---
  scoreAndSaveAssessment(
    userId: string,
    questionIds: string[],
    selectedAnswers: Record<string, number>, // questionId -> optionIndex
    timeSpentSeconds: number,
    maxTimeSeconds: number
  ): AssessmentAttempt {
    const allQuestions = this.getAllQuestions();
    const qMap = new Map(allQuestions.map((q) => [q.id, q]));

    const answerRecords: AssessmentAnswerRecord[] = [];
    const topicTracker: Record<SkillCategory, { total: number; correct: number }> = {
      'Java Fundamentals': { total: 0, correct: 0 },
      'Object-Oriented Programming & Collections': { total: 0, correct: 0 },
      'Relational Databases & SQL': { total: 0, correct: 0 },
      'Web Fundamentals & HTTP': { total: 0, correct: 0 },
      'REST APIs & Architecture': { total: 0, correct: 0 },
      'Spring Boot & Dependency Injection': { total: 0, correct: 0 },
      'Problem-Solving & Data Structures': { total: 0, correct: 0 }
    };

    let correctCount = 0;

    questionIds.forEach((qId) => {
      const q = qMap.get(qId);
      if (!q) return;

      const selected = selectedAnswers[qId] ?? -1;
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      answerRecords.push({
        questionId: qId,
        selectedOptionIndex: selected,
        isCorrect
      });

      const cat = q.topic;
      if (topicTracker[cat]) {
        topicTracker[cat].total += 1;
        if (isCorrect) topicTracker[cat].correct += 1;
      }
    });

    const totalQuestions = questionIds.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const topicScores: Record<SkillCategory, { total: number; correct: number; percentage: number }> = {} as any;
    const weakTopics: SkillCategory[] = [];
    const strongTopics: SkillCategory[] = [];

    (Object.keys(topicTracker) as SkillCategory[]).forEach((cat) => {
      const t = topicTracker[cat];
      const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
      topicScores[cat] = {
        total: t.total,
        correct: t.correct,
        percentage: pct
      };

      if (t.total > 0) {
        if (pct < 65) {
          weakTopics.push(cat);
        } else if (pct >= 80) {
          strongTopics.push(cat);
        }
      }
    });

    const attempt: AssessmentAttempt = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      domain: 'Java Full Stack Developer',
      totalQuestions,
      correctAnswersCount: correctCount,
      scorePercentage,
      timeSpentSeconds,
      maxTimeSeconds,
      startedAt: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      answers: answerRecords,
      topicScores,
      weakTopics,
      strongTopics
    };

    // Save immutable attempt
    const raw = localStorage.getItem(KEYS.ATTEMPTS);
    const attempts: AssessmentAttempt[] = raw ? JSON.parse(raw) : [];
    attempts.unshift(attempt); // latest first
    localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(attempts));

    // Log study activity
    this.logActivity({
      id: `act-${Date.now()}`,
      userId,
      date: new Date().toISOString(),
      hoursSpent: Math.max(0.25, Number((timeSpentSeconds / 3600).toFixed(2))),
      activityType: 'assessment',
      description: `Completed Java Full Stack diagnostic assessment with score ${scorePercentage}%.`
    });

    return attempt;
  }

  getUserAttempts(userId: string): AssessmentAttempt[] {
    const raw = localStorage.getItem(KEYS.ATTEMPTS);
    const attempts: AssessmentAttempt[] = raw ? JSON.parse(raw) : [];
    return attempts.filter((a) => a.userId === userId);
  }

  getAttemptById(attemptId: string): AssessmentAttempt | null {
    const raw = localStorage.getItem(KEYS.ATTEMPTS);
    const attempts: AssessmentAttempt[] = raw ? JSON.parse(raw) : [];
    return attempts.find((a) => a.id === attemptId) || null;
  }

  // --- Roadmaps & Tasks ---
  getUserRoadmap(userId: string): PersonalizedRoadmap | null {
    const raw = localStorage.getItem(KEYS.ROADMAPS);
    const roadmaps: Record<string, PersonalizedRoadmap> = raw ? JSON.parse(raw) : {};
    return roadmaps[userId] || null;
  }

  saveUserRoadmap(roadmap: PersonalizedRoadmap): void {
    const raw = localStorage.getItem(KEYS.ROADMAPS);
    const roadmaps: Record<string, PersonalizedRoadmap> = raw ? JSON.parse(raw) : {};
    roadmaps[roadmap.userId] = { ...roadmap, updatedAt: new Date().toISOString() };
    localStorage.setItem(KEYS.ROADMAPS, JSON.stringify(roadmaps));
  }

  updateTaskStatus(
    userId: string,
    taskId: string,
    newStatus: 'not_started' | 'in_progress' | 'completed',
    hoursSpent?: number
  ): PersonalizedRoadmap | null {
    const roadmap = this.getUserRoadmap(userId);
    if (!roadmap) return null;

    let foundTaskTitle = '';
    let total = 0;
    let completed = 0;

    roadmap.phases.forEach((phase) => {
      phase.tasks.forEach((task) => {
        total++;
        if (task.id === taskId) {
          task.status = newStatus;
          foundTaskTitle = task.title;
          if (newStatus === 'completed') {
            task.completedAt = new Date().toISOString();
          }
          if (hoursSpent !== undefined) {
            task.actualHoursSpent = (task.actualHoursSpent || 0) + hoursSpent;
          }
        }
        if (task.status === 'completed') {
          completed++;
        }
      });
    });

    roadmap.totalTasks = total;
    roadmap.completedTasks = completed;
    roadmap.completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    roadmap.updatedAt = new Date().toISOString();

    this.saveUserRoadmap(roadmap);

    if (newStatus === 'completed' && foundTaskTitle) {
      this.logActivity({
        id: `act-${Date.now()}`,
        userId,
        date: new Date().toISOString(),
        hoursSpent: hoursSpent || 2,
        activityType: 'roadmap_task',
        description: `Completed learning task: "${foundTaskTitle}".`
      });
    }

    return roadmap;
  }

  // --- Practical Projects ---
  getUserProjects(): PracticalProject[] {
    const raw = localStorage.getItem(KEYS.PROJECTS);
    return raw ? JSON.parse(raw) : [];
  }

  updateProjectMilestone(projectId: string, milestoneId: string, isCompleted: boolean): PracticalProject[] {
    const projects = this.getUserProjects();
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      const ms = proj.milestones.find((m) => m.id === milestoneId);
      if (ms) {
        ms.isCompleted = isCompleted;
      }
      const completedCount = proj.milestones.filter((m) => m.isCompleted).length;
      proj.progressPercentage = Math.round((completedCount / proj.milestones.length) * 100);
      if (proj.progressPercentage === 100) proj.userStatus = 'completed';
      else if (proj.progressPercentage > 0) proj.userStatus = 'in_progress';
      else proj.userStatus = 'not_started';
    }
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    return projects;
  }

  // --- Resources ---
  getAllResources(): LearningResource[] {
    const raw = localStorage.getItem(KEYS.RESOURCES);
    return raw ? JSON.parse(raw) : [];
  }

  saveResource(res: LearningResource): void {
    const resources = this.getAllResources();
    const index = resources.findIndex((r) => r.id === res.id);
    if (index >= 0) {
      resources[index] = res;
    } else {
      resources.push(res);
    }
    localStorage.setItem(KEYS.RESOURCES, JSON.stringify(resources));
  }

  deleteResource(id: string): void {
    const resources = this.getAllResources().filter((r) => r.id !== id);
    localStorage.setItem(KEYS.RESOURCES, JSON.stringify(resources));
  }

  // --- Activity Logs & Learning Streaks ---
  logActivity(log: LearningActivityLog): void {
    const raw = localStorage.getItem(KEYS.ACTIVITY_LOGS);
    const logs: LearningActivityLog[] = raw ? JSON.parse(raw) : [];
    logs.unshift(log);
    localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
  }

  getUserActivities(userId: string): LearningActivityLog[] {
    const raw = localStorage.getItem(KEYS.ACTIVITY_LOGS);
    const logs: LearningActivityLog[] = raw ? JSON.parse(raw) : [];
    return logs.filter((l) => l.userId === userId);
  }

  calculateLearningStreak(userId: string): number {
    const activities = this.getUserActivities(userId);
    if (activities.length === 0) return 0;

    const dates = Array.from(
      new Set(
        activities.map((a) => new Date(a.date).toISOString().split('T')[0])
      )
    ).sort().reverse();

    if (dates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If no activity today or yesterday, streak is broken
    if (dates[0] !== today && dates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diffDays = Math.round((current.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // --- Dashboard Aggregates ---
  getDashboardMetrics(userId: string): DashboardMetrics {
    const user = this.getUserById(userId);
    const attempts = this.getUserAttempts(userId);
    const roadmap = this.getUserRoadmap(userId);
    const activities = this.getUserActivities(userId);

    const latestAttempt = attempts.length > 0 ? attempts[0] : null;
    const prevAttempt = attempts.length > 1 ? attempts[1] : null;

    // Skills assessed
    const assessedTopics = new Set<string>();
    attempts.forEach((att) => {
      if (att.topicScores) {
        Object.keys(att.topicScores).forEach((topic) => {
          if (att.topicScores[topic as SkillCategory]?.total > 0) {
            assessedTopics.add(topic);
          }
        });
      }
    });

    const streak = this.calculateLearningStreak(userId);

    // Total hours logged
    const totalHours = activities.reduce((sum, act) => sum + (act.hoursSpent || 0), 0);

    // Weekly hours logged (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    const weeklyHours = activities
      .filter((a) => new Date(a.date).getTime() >= sevenDaysAgo)
      .reduce((sum, a) => sum + (a.hoursSpent || 0), 0);

    // Find recommended next task: first in_progress or first not_started in roadmap
    let nextTask = null;
    if (roadmap && roadmap.phases) {
      for (const phase of roadmap.phases) {
        const inProg = phase.tasks.find((t) => t.status === 'in_progress');
        if (inProg) {
          nextTask = inProg;
          break;
        }
      }
      if (!nextTask) {
        for (const phase of roadmap.phases) {
          const notStarted = phase.tasks.find((t) => t.status === 'not_started');
          if (notStarted) {
            nextTask = notStarted;
            break;
          }
        }
      }
    }

    return {
      targetCareer: user?.targetRole || 'Java Full Stack Developer',
      latestAssessmentScore: latestAttempt ? latestAttempt.scorePercentage : null,
      previousAssessmentScore: prevAttempt ? prevAttempt.scorePercentage : null,
      totalAssessmentsTaken: attempts.length,
      skillsAssessedCount: assessedTopics.size,
      totalSkillsCount: 7,
      roadmapCompletionPercentage: roadmap ? roadmap.completionPercentage : 0,
      totalRoadmapTasks: roadmap ? roadmap.totalTasks : 0,
      completedRoadmapTasks: roadmap ? roadmap.completedTasks : 0,
      currentStreakDays: streak,
      totalHoursLearned: Number(totalHours.toFixed(1)),
      weeklyHoursLogged: Number(weeklyHours.toFixed(1)),
      weakestSkillAreas: latestAttempt?.weakTopics || [],
      recommendedNextTask: nextTask,
      recentAttempts: attempts.slice(0, 5)
    };
  }

  // --- DSA Submissions & Problem Solving ---
  getDsaSubmissions(userId: string): any[] {
    const raw = localStorage.getItem(KEYS.DSA_SUBMISSIONS);
    const submissions: any[] = raw ? JSON.parse(raw) : [];
    return submissions.filter((s) => s.userId === userId);
  }

  saveDsaSubmission(submission: any): void {
    const raw = localStorage.getItem(KEYS.DSA_SUBMISSIONS);
    const submissions: any[] = raw ? JSON.parse(raw) : [];
    submissions.unshift(submission);
    localStorage.setItem(KEYS.DSA_SUBMISSIONS, JSON.stringify(submissions));

    // If accepted, maintain streak and log activity!
    if (submission.status === 'Accepted') {
      this.maintainStreakToday(submission.userId, `Solved DSA Problem: ${submission.problemTitle || submission.problemId}`);
    }
  }

  getSolvedProblemIds(userId: string): string[] {
    const subs = this.getDsaSubmissions(userId);
    const solvedSet = new Set<string>();
    subs.forEach((s) => {
      if (s.status === 'Accepted') solvedSet.add(s.problemId);
    });
    return Array.from(solvedSet);
  }

  // --- External Platforms Linked ---
  getLinkedPlatforms(userId: string): any[] {
    const raw = localStorage.getItem(KEYS.LINKED_PLATFORMS);
    const data: Record<string, any[]> = raw ? JSON.parse(raw) : {};
    return data[userId] || [
      { platform: 'LeetCode', username: '', profileUrl: 'https://leetcode.com', problemsSolved: 0, connected: false },
      { platform: 'HackerRank', username: '', profileUrl: 'https://hackerrank.com', problemsSolved: 0, connected: false },
      { platform: 'GeeksforGeeks', username: '', profileUrl: 'https://geeksforgeeks.org', problemsSolved: 0, connected: false },
      { platform: 'CodeChef', username: '', profileUrl: 'https://codechef.com', problemsSolved: 0, connected: false }
    ];
  }

  saveLinkedPlatforms(userId: string, platforms: any[]): void {
    const raw = localStorage.getItem(KEYS.LINKED_PLATFORMS);
    const data: Record<string, any[]> = raw ? JSON.parse(raw) : {};
    data[userId] = platforms;
    localStorage.setItem(KEYS.LINKED_PLATFORMS, JSON.stringify(data));
  }

  // --- Streak Maintenance ---
  maintainStreakToday(userId: string, reason: string): void {
    const today = new Date().toISOString().split('T')[0];
    const userActivities = this.getUserActivities(userId);
    const alreadyLoggedToday = userActivities.some((a) => a.date.startsWith(today));

    // Add activity record
    this.logActivity({
      id: `act-${Date.now()}`,
      userId,
      date: new Date().toISOString(),
      hoursSpent: 0.5,
      activityType: 'roadmap_task',
      description: reason
    });
  }

  // --- Reset User Data for Real Account Testing ---
  resetUserData(userId: string): void {
    // Remove attempts
    const rawAttempts = localStorage.getItem(KEYS.ATTEMPTS);
    if (rawAttempts) {
      const attempts: any[] = JSON.parse(rawAttempts);
      localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(attempts.filter((a) => a.userId !== userId)));
    }

    // Remove roadmap
    const rawRoadmaps = localStorage.getItem(KEYS.ROADMAPS);
    if (rawRoadmaps) {
      const roadmaps: Record<string, any> = JSON.parse(rawRoadmaps);
      delete roadmaps[userId];
      localStorage.setItem(KEYS.ROADMAPS, JSON.stringify(roadmaps));
    }

    // Remove activities
    const rawLogs = localStorage.getItem(KEYS.ACTIVITY_LOGS);
    if (rawLogs) {
      const logs: any[] = JSON.parse(rawLogs);
      localStorage.setItem(KEYS.ACTIVITY_LOGS, JSON.stringify(logs.filter((l) => l.userId !== userId)));
    }

    // Remove DSA submissions
    const rawSubs = localStorage.getItem(KEYS.DSA_SUBMISSIONS);
    if (rawSubs) {
      const subs: any[] = JSON.parse(rawSubs);
      localStorage.setItem(KEYS.DSA_SUBMISSIONS, JSON.stringify(subs.filter((s) => s.userId !== userId)));
    }
  }

  // --- Admin Statistics ---
  getAdminStats() {
    const allUsers = this.getAllUsers();
    const allQuestions = this.getAllQuestions();
    const allResources = this.getAllResources();
    const rawAttempts = localStorage.getItem(KEYS.ATTEMPTS);
    const attempts: AssessmentAttempt[] = rawAttempts ? JSON.parse(rawAttempts) : [];

    const studentCount = allUsers.filter((u) => u.role === 'student').length;
    const avgScore = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.scorePercentage, 0) / attempts.length) 
      : 0;

    return {
      totalStudents: studentCount,
      totalAdmins: allUsers.filter((u) => u.role === 'admin').length,
      totalQuestions: allQuestions.length,
      publishedQuestions: allQuestions.filter((q) => q.isPublished).length,
      totalResources: allResources.length,
      totalAssessmentsCompleted: attempts.length,
      averagePlatformScore: avgScore
    };
  }
}

export const storageService = new StorageService();
