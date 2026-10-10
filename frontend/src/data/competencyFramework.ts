import { SkillCategory, GapStatus, SkillGapItem } from '../types';

export interface CompetencyBenchmark {
  category: SkillCategory;
  targetProficiency: GapStatus;
  benchmarkPercentage: number; // e.g. 75% for proficient, 85% for strong
  importance: 'Critical' | 'High' | 'Medium';
  description: string;
  recommendedStudyHours: number;
}

export const JAVA_FULL_STACK_COMPETENCY_FRAMEWORK: Record<SkillCategory, CompetencyBenchmark> = {
  'Java Fundamentals': {
    category: 'Java Fundamentals',
    targetProficiency: 'Proficient',
    benchmarkPercentage: 75,
    importance: 'Critical',
    description: 'Mastery of Java syntax, data types, control flow, memory model (Stack vs Heap), and modern language features (Records, Pattern Matching, Virtual Threads).',
    recommendedStudyHours: 20
  },
  'Object-Oriented Programming & Collections': {
    category: 'Object-Oriented Programming & Collections',
    targetProficiency: 'Strong',
    benchmarkPercentage: 80,
    importance: 'Critical',
    description: 'Deep understanding of SOLID principles, polymorphism, Collections hierarchy (List, Set, Map, Queue), thread-safe structures, and equals/hashCode contracts.',
    recommendedStudyHours: 25
  },
  'Relational Databases & SQL': {
    category: 'Relational Databases & SQL',
    targetProficiency: 'Proficient',
    benchmarkPercentage: 75,
    importance: 'High',
    description: 'Relational schema design, complex JOINs, aggregation, indexing, ACID transactions, and ORM mapping (JPA/Hibernate) with N+1 mitigation.',
    recommendedStudyHours: 25
  },
  'Web Fundamentals & HTTP': {
    category: 'Web Fundamentals & HTTP',
    targetProficiency: 'Developing',
    benchmarkPercentage: 70,
    importance: 'High',
    description: 'HTTP protocol fundamentals (methods, status codes, headers, CORS), cookies vs tokens, and client-server communication lifecycle.',
    recommendedStudyHours: 15
  },
  'REST APIs & Architecture': {
    category: 'REST APIs & Architecture',
    targetProficiency: 'Proficient',
    benchmarkPercentage: 75,
    importance: 'Critical',
    description: 'RESTful resource modeling, request/response DTOs, versioning, idempotency, validation, and token-based stateless security.',
    recommendedStudyHours: 20
  },
  'Spring Boot & Dependency Injection': {
    category: 'Spring Boot & Dependency Injection',
    targetProficiency: 'Proficient',
    benchmarkPercentage: 75,
    importance: 'Critical',
    description: 'Spring Core IoC/DI, Spring Boot auto-configuration, Spring Data JPA, Spring Security filters, and centralized @RestControllerAdvice exception handling.',
    recommendedStudyHours: 35
  },
  'Problem-Solving & Data Structures': {
    category: 'Problem-Solving & Data Structures',
    targetProficiency: 'Developing',
    benchmarkPercentage: 70,
    importance: 'High',
    description: 'Time/space Big-O analysis, core data structures (arrays, hash tables, trees, heaps), and standard traversal/search algorithms.',
    recommendedStudyHours: 30
  }
};

export function calculateSkillGaps(
  topicScores: Record<SkillCategory, { total: number; correct: number; percentage: number }> | null
): SkillGapItem[] {
  const categories: SkillCategory[] = [
    'Java Fundamentals',
    'Object-Oriented Programming & Collections',
    'Relational Databases & SQL',
    'Web Fundamentals & HTTP',
    'REST APIs & Architecture',
    'Spring Boot & Dependency Injection',
    'Problem-Solving & Data Structures'
  ];

  return categories.map((cat) => {
    const benchmark = JAVA_FULL_STACK_COMPETENCY_FRAMEWORK[cat];
    const scoreData = topicScores ? topicScores[cat] : null;

    if (!scoreData || scoreData.total === 0) {
      return {
        skillName: cat,
        demonstratedScore: null,
        currentStatus: 'Not Assessed',
        targetStatus: benchmark.targetProficiency,
        evidence: 'No assessment questions completed for this topic yet.',
        priorityLevel: benchmark.importance === 'Critical' ? 'High' : 'Medium',
        recommendedAction: `Complete the ${cat} diagnostic assessment module to establish baseline score.`
      };
    }

    const pct = scoreData.percentage;
    let currentStatus: GapStatus = 'Needs Improvement';
    if (pct >= 85) currentStatus = 'Strong';
    else if (pct >= 70) currentStatus = 'Proficient';
    else if (pct >= 50) currentStatus = 'Developing';
    else currentStatus = 'Needs Improvement';

    const meetsBenchmark = pct >= benchmark.benchmarkPercentage;
    let priorityLevel: 'High' | 'Medium' | 'Low' | 'Achieved';

    if (meetsBenchmark) {
      priorityLevel = 'Achieved';
    } else if (benchmark.importance === 'Critical' || pct < 50) {
      priorityLevel = 'High';
    } else {
      priorityLevel = 'Medium';
    }

    let action = '';
    if (priorityLevel === 'Achieved') {
      action = `Demonstrated target competency (${pct}%). Maintain skill through advanced capstone integration.`;
    } else if (currentStatus === 'Needs Improvement') {
      action = `Critical gap detected (${scoreData.correct}/${scoreData.total} correct, ${pct}%). Prioritize Phase tasks in roadmap and review foundational core concepts.`;
    } else {
      action = `Approaching target (${pct}% vs target ${benchmark.benchmarkPercentage}%). Complete focused practice problems and targeted review.`;
    }

    return {
      skillName: cat,
      demonstratedScore: pct,
      currentStatus,
      targetStatus: benchmark.targetProficiency,
      evidence: `Assessed on ${scoreData.total} questions (${scoreData.correct} correct, score: ${pct}%).`,
      priorityLevel,
      recommendedAction: action
    };
  });
}
