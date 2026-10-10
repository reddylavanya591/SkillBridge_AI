export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  educationLevel: string;
  course: string;
  targetRole: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  weeklyHours: number;
  preferredLearningFormat: 'Hands-on Projects' | 'Video Tutorials' | 'Reading & Docs' | 'Interactive Exercises';
  currentSkills: string[];
  learningGoals: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SkillCategory = 
  | 'Java Fundamentals'
  | 'Object-Oriented Programming & Collections'
  | 'Relational Databases & SQL'
  | 'Web Fundamentals & HTTP'
  | 'REST APIs & Architecture'
  | 'Spring Boot & Dependency Injection'
  | 'Problem-Solving & Data Structures';

export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AssessmentQuestion {
  id: string;
  topic: SkillCategory;
  difficulty: QuestionDifficulty;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  isPublished: boolean;
}

export interface AssessmentAnswerRecord {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export interface AssessmentAttempt {
  id: string;
  userId: string;
  domain: string; // e.g. "Java Full Stack Developer"
  totalQuestions: number;
  correctAnswersCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  maxTimeSeconds: number;
  startedAt: string;
  completedAt: string;
  answers: AssessmentAnswerRecord[];
  topicScores: Record<SkillCategory, { total: number; correct: number; percentage: number }>;
  weakTopics: SkillCategory[];
  strongTopics: SkillCategory[];
}

export type GapStatus = 'Not Assessed' | 'Needs Improvement' | 'Developing' | 'Proficient' | 'Strong';

export interface SkillGapItem {
  skillName: SkillCategory;
  demonstratedScore: number | null; // 0-100 or null if unassessed
  currentStatus: GapStatus;
  targetStatus: GapStatus;
  evidence: string;
  priorityLevel: 'High' | 'Medium' | 'Low' | 'Achieved';
  recommendedAction: string;
}

export interface RoadmapTask {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  skillCategory: SkillCategory;
  estimatedHours: number;
  actualHoursSpent?: number;
  status: 'not_started' | 'in_progress' | 'completed';
  prerequisites?: string[];
  practiceExercise: string;
  completionCriteria: string;
  resourceUrls: { title: string; url: string; type: string }[];
  completedAt?: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  estimatedWeeks: number;
  tasks: RoadmapTask[];
}

export interface PersonalizedRoadmap {
  id: string;
  userId: string;
  careerRole: string;
  createdAt: string;
  updatedAt: string;
  generatedBy: 'gemini-ai' | 'rule-engine-fallback';
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  estimatedWeeks: number;
  weeklyHoursCommitted: number;
  phases: RoadmapPhase[];
  rationale: string;
}

export interface LearningResource {
  id: string;
  title: string;
  topic: SkillCategory;
  resourceType: 'Documentation' | 'Interactive Tutorial' | 'Course' | 'Article' | 'Reference Guide';
  difficulty: QuestionDifficulty;
  url: string;
  authorOrProvider: string;
  estimatedDuration: string;
  isPublished: boolean;
  description: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface PracticalProject {
  id: string;
  title: string;
  difficulty: QuestionDifficulty;
  problemStatement: string;
  targetRole: string;
  requiredSkills: SkillCategory[];
  suggestedTechStack: string[];
  milestones: ProjectMilestone[];
  completionChecklist: string[];
  userStatus: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  notes?: string;
}

export interface LearningActivityLog {
  id: string;
  userId: string;
  date: string;
  hoursSpent: number;
  activityType: 'assessment' | 'roadmap_task' | 'project' | 'resource_study';
  description: string;
}

export interface DashboardMetrics {
  targetCareer: string;
  latestAssessmentScore: number | null;
  previousAssessmentScore: number | null;
  totalAssessmentsTaken: number;
  skillsAssessedCount: number;
  totalSkillsCount: number;
  roadmapCompletionPercentage: number;
  totalRoadmapTasks: number;
  completedRoadmapTasks: number;
  currentStreakDays: number;
  totalHoursLearned: number;
  weeklyHoursLogged: number;
  weakestSkillAreas: SkillCategory[];
  recommendedNextTask: RoadmapTask | null;
  recentAttempts: AssessmentAttempt[];
}

export type DsaDifficulty = 'Easy' | 'Medium' | 'Hard';

export type DsaCategory =
  | 'Arrays & Hashing'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Stack & Queue'
  | 'Binary Search'
  | 'Linked List'
  | 'Trees & Recursion'
  | 'Trees'
  | 'Dynamic Programming';

export interface DsaTestCase {
  id: string;
  inputDisplay: string;
  expectedDisplay: string;
  inputRaw: any;
  expectedRaw: any;
}

export interface ExternalPlatformLink {
  platform: 'LeetCode' | 'HackerRank' | 'GeeksforGeeks' | 'CodeChef' | 'NeetCode';
  name: string;
  url: string;
  problemIdOrSlug: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: DsaDifficulty;
  category: DsaCategory;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    java: string;
    javascript: string;
    python: string;
  };
  testCases: DsaTestCase[];
  externalLinks: ExternalPlatformLink[];
  hints: string[];
  leetcodeNumber?: number;
  acceptanceRate?: string;
  curatedLists?: string[];
  frequency?: 'High' | 'Very High' | 'Medium';
}

export interface DsaSubmission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: 'java' | 'javascript' | 'python';
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error';
  testsPassed: number;
  totalTests: number;
  outputLog?: string;
  submittedAt: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  codeSnippet?: string;
  contextTag?: 'DSA Help' | 'Career Advice' | 'Roadmap Query' | 'Code Review';
  timestamp: string;
}

export interface PlatformProfile {
  platform: 'LeetCode' | 'HackerRank' | 'GeeksforGeeks' | 'CodeChef';
  username: string;
  profileUrl: string;
  problemsSolved: number;
  connected: boolean;
  lastSynced?: string;
}

