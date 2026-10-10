import { GoogleGenAI, Type } from '@google/genai';
import { PersonalizedRoadmap, UserProfile, AssessmentAttempt, SkillCategory, RoadmapPhase, RoadmapTask } from '../types';

/**
 * Deterministic Rule-Based Roadmap Generator
 * Used when Gemini API key is not present or when network fails.
 * Explicitly labeled as 'rule-engine-fallback' in accordance with specification.
 */
export function generateRuleBasedRoadmap(
  profile: UserProfile,
  latestAttempt: AssessmentAttempt | null,
  existingRoadmap: PersonalizedRoadmap | null = null
): PersonalizedRoadmap {
  const weeklyHours = profile.weeklyHours || 12;
  const weakTopics = latestAttempt?.weakTopics || ['Relational Databases & SQL', 'Spring Boot & Dependency Injection'];
  const strongTopics = latestAttempt?.strongTopics || [];

  // Determine emphasis based on weak topics
  const isWeakJava = weakTopics.includes('Java Fundamentals');
  const isWeakOOP = weakTopics.includes('Object-Oriented Programming & Collections');
  const isWeakSQL = weakTopics.includes('Relational Databases & SQL');
  const isWeakSpring = weakTopics.includes('Spring Boot & Dependency Injection');
  const isWeakREST = weakTopics.includes('REST APIs & Architecture');

  const phases: RoadmapPhase[] = [
    {
      id: 'phase-1-foundations',
      phaseNumber: 1,
      title: 'Phase 1: Core Java Foundations & Memory Architecture',
      description: isWeakJava 
        ? 'Targeted remediation on Java 21 fundamentals, memory allocation (stack vs heap), type safety, and modern language features based on assessment gaps.'
        : 'Fast-track consolidation of modern Java 21 syntax, Records, Sealed classes, and Virtual Threads.',
      estimatedWeeks: isWeakJava ? 3 : 2,
      tasks: [
        {
          id: 'task-p1-1',
          phaseId: 'phase-1-foundations',
          title: 'Master Java Memory Model & Reference Types',
          description: 'Deep dive into Stack vs Heap execution, primitive wrapper autoboxing costs, and garbage collection mechanisms.',
          skillCategory: 'Java Fundamentals',
          estimatedHours: 6,
          status: 'not_started',
          practiceExercise: 'Write a benchmark utility comparing primitive int array vs Integer list memory allocations and iterate over 1M elements.',
          completionCriteria: 'Explain the difference between reference equality (==) and value equivalence (.equals) with proof code.',
          resourceUrls: [
            { title: 'Oracle Java 21 Language Spec', url: 'https://docs.oracle.com/en/java/javase/21/', type: 'Documentation' }
          ]
        },
        {
          id: 'task-p1-2',
          phaseId: 'phase-1-foundations',
          title: 'Implement Modern Java 17/21 Records & Pattern Matching',
          description: 'Transition from legacy boilerplate POJOs to immutable records and switch pattern matching for concise type deconstruction.',
          skillCategory: 'Java Fundamentals',
          estimatedHours: 5,
          status: 'not_started',
          practiceExercise: 'Refactor a legacy DTO class into a compact Java Record with custom validation in its canonical constructor.',
          completionCriteria: 'Code successfully passes unit tests verifying immutability and auto-generated accessors.',
          resourceUrls: [
            { title: 'Modern Java Features Guide', url: 'https://roadmap.sh/java', type: 'Reference Guide' }
          ]
        }
      ]
    },
    {
      id: 'phase-2-oop-collections',
      phaseNumber: 2,
      title: 'Phase 2: Object-Oriented Design & Collections Framework',
      description: isWeakOOP
        ? 'Deep remediation on SOLID principles, equals/hashCode contracts, and concurrent collection thread safety.'
        : 'Advanced object-oriented abstractions, stream pipelines, and data structure selection.',
      estimatedWeeks: isWeakOOP ? 3 : 2,
      tasks: [
        {
          id: 'task-p2-1',
          phaseId: 'phase-2-oop-collections',
          title: 'Audit & Implement equals() and hashCode() Contract',
          description: 'Enforce mathematical symmetry, reflexivity, and transitivity in domain entity comparison; understand hash collision handling.',
          skillCategory: 'Object-Oriented Programming & Collections',
          estimatedHours: 5,
          status: 'not_started',
          practiceExercise: 'Create a custom StudentId class and verify it functions correctly as a key in HashMap and HashSet.',
          completionCriteria: 'Unit tests confirm that equal objects produce identical hash codes and find elements reliably in hashed structures.',
          resourceUrls: [
            { title: 'Baeldung Collections Guide', url: 'https://www.baeldung.com/java-collections', type: 'Reference Guide' }
          ]
        },
        {
          id: 'task-p2-2',
          phaseId: 'phase-2-oop-collections',
          title: 'Concurrent Collections & Thread Safety',
          description: 'Compare ArrayList vs LinkedList and synchronize multi-threaded access using ConcurrentHashMap instead of global locks.',
          skillCategory: 'Object-Oriented Programming & Collections',
          estimatedHours: 7,
          status: 'not_started',
          practiceExercise: 'Simulate concurrent multi-threaded writes into a HashMap vs ConcurrentHashMap and observe race conditions.',
          completionCriteria: 'Demonstrate zero data corruption or infinite loop behavior under 10 concurrent threads.',
          resourceUrls: [
            { title: 'Concurrency in Java', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/', type: 'Tutorial' }
          ]
        }
      ]
    },
    {
      id: 'phase-3-database-sql',
      phaseNumber: 3,
      title: 'Phase 3: Relational Persistence, SQL & Hibernate JPA',
      description: isWeakSQL
        ? 'High-priority focus: Master relational modeling, SQL JOIN queries, transactions, and solving Hibernate N+1 query traps.'
        : 'Advanced JPA entity graphs, projection queries, and database transaction isolation.',
      estimatedWeeks: isWeakSQL ? 4 : 2,
      tasks: [
        {
          id: 'task-p3-1',
          phaseId: 'phase-3-database-sql',
          title: 'Relational Schema Design & Multi-Table Complex JOINs',
          description: 'Normalize schemas to 3NF, write INNER and LEFT JOINs, aggregate sales totals with GROUP BY and HAVING clauses.',
          skillCategory: 'Relational Databases & SQL',
          estimatedHours: 8,
          status: 'not_started',
          practiceExercise: 'Execute queries on a sample PostgreSQL e-commerce schema finding the top 5 customers with >$500 purchases.',
          completionCriteria: 'Queries return expected aggregate results without full-table scan bottlenecks.',
          resourceUrls: [
            { title: 'PostgreSQL Interactive Tutorial', url: 'https://www.postgresqltutorial.com/', type: 'Interactive Tutorial' }
          ]
        },
        {
          id: 'task-p3-2',
          phaseId: 'phase-3-database-sql',
          title: 'Mitigate Hibernate N+1 Queries with JOIN FETCH',
          description: 'Analyze SQL logs produced by lazy entity relations and eliminate N+1 roundtrips with JPQL JOIN FETCH and @EntityGraph.',
          skillCategory: 'Relational Databases & SQL',
          estimatedHours: 7,
          status: 'not_started',
          practiceExercise: 'Configure Hibernate SQL logging and refactor a findAllWithOrders query from N+1 down to 1 single JOIN query.',
          completionCriteria: 'Verify SQL execution count drops from N+1 to exactly 1 query in console logs.',
          resourceUrls: [
            { title: 'Vlad Mihalcea High-Performance Java Persistence', url: 'https://vladmihalcea.com/tutorials/hibernate/', type: 'Article' }
          ]
        }
      ]
    },
    {
      id: 'phase-4-web-rest',
      phaseNumber: 4,
      title: 'Phase 4: Web Fundamentals & RESTful Microservice Design',
      description: isWeakREST
        ? 'Intensive practice on HTTP status semantics, stateless REST architecture, and DTO validation.'
        : 'Enterprise API versioning, idempotency, and CORS security controls.',
      estimatedWeeks: isWeakREST ? 3 : 2,
      tasks: [
        {
          id: 'task-p4-1',
          phaseId: 'phase-4-web-rest',
          title: 'Design Clean RESTful Resource Hierarchies',
          description: 'Model nouns, handle HTTP status codes (201 Created, 204 No Content, 400 Bad Request, 404 Not Found), and parse query pagination.',
          skillCategory: 'REST APIs & Architecture',
          estimatedHours: 6,
          status: 'not_started',
          practiceExercise: 'Write an OpenAPI specification for a student enrollment service following Microsoft REST standards.',
          completionCriteria: 'All endpoints follow plural noun conventions and correct idempotent verb semantics.',
          resourceUrls: [
            { title: 'Microsoft REST Guidelines', url: 'https://github.com/microsoft/api-guidelines', type: 'Reference Guide' }
          ]
        },
        {
          id: 'task-p4-2',
          phaseId: 'phase-4-web-rest',
          title: 'Implement Centralized Exception Handling with ProblemDetails',
          description: 'Use Spring @RestControllerAdvice and RFC 7807 ProblemDetails to return consistent error payloads to API consumers.',
          skillCategory: 'REST APIs & Architecture',
          estimatedHours: 5,
          status: 'not_started',
          practiceExercise: 'Create a custom ResourceNotFoundException and wire it through @ExceptionHandler with timestamp and message.',
          completionCriteria: 'Invalid requests return structured 404 JSON instead of standard stack trace dumps.',
          resourceUrls: [
            { title: 'Spring Rest Error Handling Guide', url: 'https://spring.io/guides/gs/rest-service', type: 'Tutorial' }
          ]
        }
      ]
    },
    {
      id: 'phase-5-spring-boot',
      phaseNumber: 5,
      title: 'Phase 5: Spring Boot 3 Enterprise Framework & Security',
      description: isWeakSpring
        ? 'Core deep dive: IoC container, constructor injection, Spring Security 6 filter chains, and JWT authorization.'
        : 'Production configuration profiles, Actuator monitoring, and automated integration tests.',
      estimatedWeeks: isWeakSpring ? 4 : 2,
      tasks: [
        {
          id: 'task-p5-1',
          phaseId: 'phase-5-spring-boot',
          title: 'Spring Boot IoC, Constructor Injection & Bean Lifecycles',
          description: 'Replace field injection with final constructor parameters, wire services, and configure external application.yml properties.',
          skillCategory: 'Spring Boot & Dependency Injection',
          estimatedHours: 8,
          status: 'not_started',
          practiceExercise: 'Build a modular service layer utilizing Spring Profiles (dev, test, prod) with interface-based dependency injection.',
          completionCriteria: 'Unit tests run cleanly with Mockito without starting the heavy Spring application context.',
          resourceUrls: [
            { title: 'Spring Boot 3 Official Guides', url: 'https://spring.io/guides', type: 'Documentation' }
          ]
        },
        {
          id: 'task-p5-2',
          phaseId: 'phase-5-spring-boot',
          title: 'Spring Security 6 Stateless JWT Filter Implementation',
          description: 'Configure SecurityFilterChain, implement OncePerRequestFilter to parse Authorization Bearer tokens and populate SecurityContext.',
          skillCategory: 'Spring Boot & Dependency Injection',
          estimatedHours: 9,
          status: 'not_started',
          practiceExercise: 'Protect /api/v1/admin/** endpoints with ROLE_ADMIN while keeping /api/v1/auth/** public.',
          completionCriteria: 'Unauthorized requests return 401 Unauthorized; token-verified requests proceed seamlessly.',
          resourceUrls: [
            { title: 'Spring Security Architecture', url: 'https://www.baeldung.com/spring-security-registration-verification', type: 'Article' }
          ]
        }
      ]
    },
    {
      id: 'phase-6-capstone',
      phaseNumber: 6,
      title: 'Phase 6: Full-Stack Capstone Project & Production Deployment',
      description: 'Integrate your React frontend with the Spring Boot backend, containerize with Docker, and run automated integration test suites.',
      estimatedWeeks: 3,
      tasks: [
        {
          id: 'task-p6-1',
          phaseId: 'phase-6-capstone',
          title: 'Full-Stack Integration: Connect React SPA to Spring Boot REST API',
          description: 'Wire client-side API requests, handle CORS securely, manage authentication tokens, and render optimistic UI updates.',
          skillCategory: 'REST APIs & Architecture',
          estimatedHours: 10,
          status: 'not_started',
          practiceExercise: 'Wire the student profile and assessment endpoints to your live backend and handle token refresh.',
          completionCriteria: 'Frontend displays live data retrieved from Spring Boot with full error toast notifications.',
          resourceUrls: [
            { title: 'Full Stack Java & React Architecture', url: 'https://roadmap.sh/java', type: 'Reference Guide' }
          ]
        },
        {
          id: 'task-p6-2',
          phaseId: 'phase-6-capstone',
          title: 'End-to-End Test Suite with JUnit 5 and MockMvc',
          description: 'Write comprehensive integration tests verifying happy paths, edge case validation errors, and unauthorized token rejections.',
          skillCategory: 'Problem-Solving & Data Structures',
          estimatedHours: 8,
          status: 'not_started',
          practiceExercise: 'Write 5 MockMvc test methods for authentication, profile updates, and score submission.',
          completionCriteria: 'Test suite achieves 80%+ controller and service code coverage with passing assertions.',
          resourceUrls: [
            { title: 'Testing Spring Boot Applications', url: 'https://spring.io/guides/gs/testing-web', type: 'Tutorial' }
          ]
        }
      ]
    }
  ];

  // Preserve completed progress if regenerating
  if (existingRoadmap && existingRoadmap.phases) {
    const completedTaskIds = new Set<string>();
    existingRoadmap.phases.forEach((p) => {
      p.tasks.forEach((t) => {
        if (t.status === 'completed') {
          completedTaskIds.add(t.id);
        }
      });
    });

    phases.forEach((p) => {
      p.tasks.forEach((t) => {
        if (completedTaskIds.has(t.id)) {
          t.status = 'completed';
        }
      });
    });
  }

  // Calculate stats
  let totalTasks = 0;
  let completedTasks = 0;
  phases.forEach((p) => {
    p.tasks.forEach((t) => {
      totalTasks++;
      if (t.status === 'completed') completedTasks++;
    });
  });

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalWeeks = phases.reduce((acc, p) => acc + p.estimatedWeeks, 0);

  const rationale = latestAttempt 
    ? `Rule-Based Roadmap synthesized from assessment attempt (Score: ${latestAttempt.scorePercentage}%). Identified ${weakTopics.length} priority focus area(s): ${weakTopics.join(', ')}. Foundational phases are calibrated for ${weeklyHours} hours/week availability.`
    : `Standard baseline competency roadmap generated for ${profile.targetRole || 'Java Full Stack Developer'} calibrated for ${weeklyHours} hours/week commitment. Take an assessment to unlock dynamic personalization.`;

  return {
    id: existingRoadmap?.id || `roadmap-${Date.now()}`,
    userId: profile.id,
    careerRole: profile.targetRole || 'Java Full Stack Developer',
    createdAt: existingRoadmap?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    generatedBy: 'rule-engine-fallback',
    totalTasks,
    completedTasks,
    completionPercentage,
    estimatedWeeks: totalWeeks,
    weeklyHoursCommitted: weeklyHours,
    phases,
    rationale
  };
}

/**
 * AI Personalized Roadmap Generator using Gemini API
 * Strictly returns validated structured schema or falls back cleanly with honest labeling.
 */
export async function generateGeminiRoadmap(
  profile: UserProfile,
  latestAttempt: AssessmentAttempt | null,
  existingRoadmap: PersonalizedRoadmap | null = null,
  apiKey?: string
): Promise<PersonalizedRoadmap> {
  const effectiveKey = apiKey || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);

  if (!effectiveKey) {
    // Return rule-based fallback clearly labeled
    return generateRuleBasedRoadmap(profile, latestAttempt, existingRoadmap);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: effectiveKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const weakTopicsText = latestAttempt?.weakTopics?.join(', ') || 'None identified yet';
    const strongTopicsText = latestAttempt?.strongTopics?.join(', ') || 'None identified yet';
    const scoreText = latestAttempt ? `${latestAttempt.scorePercentage}%` : 'Unassessed';

    const prompt = `You are a Principal Software Engineering Career Architect. Generate a personalized, highly structured learning roadmap for an aspiring ${profile.targetRole || 'Java Full Stack Developer'}.
Student Context:
- Current Education/Background: ${profile.educationLevel} (${profile.course})
- Self-Reported Experience Level: ${profile.experienceLevel}
- Stated Skills: ${profile.currentSkills.join(', ') || 'General basics'}
- Diagnostic Assessment Score: ${scoreText}
- Identified Weak Topics (CRITICAL FOCUS): ${weakTopicsText}
- Identified Strong Topics: ${strongTopicsText}
- Available Weekly Hours: ${profile.weeklyHours || 12} hours
- Preferred Learning Format: ${profile.preferredLearningFormat}
- Goals: ${profile.learningGoals || 'Career job readiness'}

Requirements:
1. Provide 4 to 6 sequential phases.
2. If the student performed poorly or was weak in a topic, create intensive remediation tasks for that topic.
3. If they were strong in a topic, make that phase faster and advanced.
4. Each phase must contain 2 to 3 actionable tasks with measurable completion criteria, a practice exercise, and an estimated duration in hours.
5. Provide an insightful 2-sentence rationale summarizing how this roadmap is customized to their exact assessment results.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rationale: { type: Type.STRING },
            estimatedWeeks: { type: Type.INTEGER },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedWeeks: { type: Type.INTEGER },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        skillCategory: {
                          type: Type.STRING,
                          enum: [
                            'Java Fundamentals',
                            'Object-Oriented Programming & Collections',
                            'Relational Databases & SQL',
                            'Web Fundamentals & HTTP',
                            'REST APIs & Architecture',
                            'Spring Boot & Dependency Injection',
                            'Problem-Solving & Data Structures'
                          ]
                        },
                        estimatedHours: { type: Type.INTEGER },
                        practiceExercise: { type: Type.STRING },
                        completionCriteria: { type: Type.STRING },
                        resourceName: { type: Type.STRING },
                        resourceUrl: { type: Type.STRING }
                      },
                      required: ['title', 'description', 'skillCategory', 'estimatedHours', 'practiceExercise', 'completionCriteria']
                    }
                  }
                },
                required: ['phaseNumber', 'title', 'description', 'estimatedWeeks', 'tasks']
              }
            }
          },
          required: ['rationale', 'estimatedWeeks', 'phases']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.phases || !Array.isArray(parsed.phases) || parsed.phases.length === 0) {
      throw new Error('Malformed AI response schema');
    }

    // Preserve completed tasks
    const completedTaskTitles = new Set<string>();
    if (existingRoadmap?.phases) {
      existingRoadmap.phases.forEach((p) => {
        p.tasks.forEach((t) => {
          if (t.status === 'completed') completedTaskTitles.add(t.title.toLowerCase().trim());
        });
      });
    }

    let totalTasks = 0;
    let completedCount = 0;

    const formattedPhases: RoadmapPhase[] = parsed.phases.map((p: any, pIdx: number) => {
      const phaseId = `phase-ai-${pIdx + 1}`;
      const tasks: RoadmapTask[] = (p.tasks || []).map((t: any, tIdx: number) => {
        const taskId = `task-ai-${pIdx + 1}-${tIdx + 1}`;
        const isAlreadyCompleted = completedTaskTitles.has(t.title?.toLowerCase()?.trim() || '');
        totalTasks++;
        if (isAlreadyCompleted) completedCount++;

        return {
          id: taskId,
          phaseId,
          title: t.title,
          description: t.description,
          skillCategory: t.skillCategory as SkillCategory,
          estimatedHours: t.estimatedHours || 6,
          status: isAlreadyCompleted ? 'completed' : 'not_started',
          practiceExercise: t.practiceExercise,
          completionCriteria: t.completionCriteria,
          resourceUrls: [
            {
              title: t.resourceName || `${t.skillCategory} Official Guide`,
              url: t.resourceUrl || 'https://roadmap.sh/java',
              type: 'Documentation'
            }
          ]
        };
      });

      return {
        id: phaseId,
        phaseNumber: p.phaseNumber || pIdx + 1,
        title: p.title,
        description: p.description,
        estimatedWeeks: p.estimatedWeeks || 3,
        tasks
      };
    });

    return {
      id: existingRoadmap?.id || `roadmap-${Date.now()}`,
      userId: profile.id,
      careerRole: profile.targetRole || 'Java Full Stack Developer',
      createdAt: existingRoadmap?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generatedBy: 'gemini-ai',
      totalTasks,
      completedTasks: completedCount,
      completionPercentage: totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0,
      estimatedWeeks: parsed.estimatedWeeks || 14,
      weeklyHoursCommitted: profile.weeklyHours || 12,
      phases: formattedPhases,
      rationale: parsed.rationale
    };
  } catch (err) {
    console.warn('Gemini API call returned error, safely falling back to rule-based engine:', err);
    return generateRuleBasedRoadmap(profile, latestAttempt, existingRoadmap);
  }
}

/**
 * SkillBridge AI Interactive Guide & DSA Mentor
 * Provides intelligent guidance, DSA hints, code reviews, and career counseling.
 */
export async function askAiMentor(
  userQuery: string,
  context?: string,
  codeSnippet?: string,
  apiKey?: string
): Promise<{ answer: string; codeSuggestion?: string }> {
  const effectiveKey = apiKey || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);

  if (!effectiveKey) {
    // Deterministic, domain-smart fallback responses
    return getSmartOfflineMentorResponse(userQuery, context, codeSnippet);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: effectiveKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });

    const systemInstruction = `You are the SkillBridge AI Technical Career & DSA Mentor.
Your goal is to guide software engineering students through:
1. Data Structures & Algorithms (hints, edge case analysis, Big-O tradeoffs, clean Java/Python/JS solutions).
2. Code review and bug fixing without spoonfeeding; guide with conceptual clarity.
3. Java Full Stack concepts (Spring Boot 3, SQL, Collections, REST).
4. Career roadmap advice and study habits (maintaining streaks, interview readiness).
Keep responses clear, professional, structured with concise bullet points or code snippets.`;

    const fullPrompt = `Context: ${context || 'General Student Query'}
${codeSnippet ? `Student's Current Code:\n\`\`\`\n${codeSnippet}\n\`\`\`\n` : ''}
Student Question: ${userQuery}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const answer = response.text || 'I analyzed your query. Let me know if you would like step-by-step guidance.';
    return { answer };
  } catch (err) {
    console.warn('Gemini mentor call failed, using intelligent offline guide:', err);
    return getSmartOfflineMentorResponse(userQuery, context, codeSnippet);
  }
}

function getSmartOfflineMentorResponse(
  query: string,
  context?: string,
  code?: string
): { answer: string; codeSuggestion?: string } {
  const q = query.toLowerCase();

  if (q.includes('two sum') || q.includes('hashmap') || q.includes('complement')) {
    return {
      answer: `**DSA Guidance: Two Sum Strategy**\n\n1. **Brute Force (O(N²)):** Check every pair with nested loops.\n2. **Optimal Approach (O(N) time, O(N) space):**\n   - Iterate through the array once while maintaining a \`HashMap<Integer, Integer>\` mapping \`value -> index\`.\n   - At each element \`x\`, calculate \`complement = target - x\`.\n   - If the map contains \`complement\`, you immediately have your pair indices!\n   - Otherwise, store \`x\` with its index and continue.`,
      codeSuggestion: `// Java Two Sum Optimal Pattern\nMap<Integer, Integer> map = new HashMap<>();\nfor (int i = 0; i < nums.length; i++) {\n    int diff = target - nums[i];\n    if (map.containsKey(diff)) {\n        return new int[]{ map.get(diff), i };\n    }\n    map.put(nums[i], i);\n}`
    };
  }

  if (q.includes('streak') || q.includes('consistent') || q.includes('daily')) {
    return {
      answer: `**Maintaining Your Learning Streak:**\n\n- Consistency compounds faster than occasional cramming.\n- **Action Rule:** Solve at least 1 DSA problem or complete 1 roadmap task every day.\n- Link your LeetCode and HackerRank profiles in the **Practice & Platforms Hub** to track your solved problems.\n- Even 25 minutes of active problem solving maintains your daily streak and keeps momentum high.`
    };
  }

  if (q.includes('binary search') || q.includes('sorted')) {
    return {
      answer: `**Binary Search Key Invariants:**\n\n1. **Prerequisite:** Array must be sorted.\n2. **Pointers:** Initialize \`left = 0\`, \`right = nums.length - 1\`.\n3. **Loop Condition:** \`while (left <= right)\`.\n4. **Midpoint Overflow Guard:** Always use \`int mid = left + (right - left) / 2\` rather than \`(left + right) / 2\` to prevent integer overflow in Java!\n5. **Shrink Search Space:**\n   - If \`nums[mid] == target\`, return \`mid\`.\n   - If \`nums[mid] < target\`, set \`left = mid + 1\`.\n   - Else set \`right = mid - 1\`.`
    };
  }

  if (q.includes('spring') || q.includes('bean') || q.includes('injection')) {
    return {
      answer: `**Spring Boot Core Tip:**\n\n- Prefer **Constructor Injection** over \`@Autowired\` on fields. Constructor injection ensures beans are immutable (via \`final\` fields), prevents null pointers in unit tests, and allows clean testing without reflection.`
    };
  }

  return {
    answer: `**SkillBridge AI Mentor Response:**\n\nRegarding your question on "${query}":\n\n- **Key Principle:** Break down the problem into input constraints, expected output, and edge cases.\n- **Recommended Next Step:** Test your logic against edge cases like empty arrays, single elements, and negative values.\n- Use the **DSA Code Editor** to run test cases interactively, or check the suggested problems on LeetCode/NeetCode!`
  };
}

