import { LearningResource, PracticalProject } from '../types';

export const CURATED_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'res-java-docs',
    title: 'Oracle Official Java 21 Documentation & Tutorials',
    topic: 'Java Fundamentals',
    resourceType: 'Documentation',
    difficulty: 'Beginner',
    url: 'https://docs.oracle.com/en/java/javase/21/docs/api/index.html',
    authorOrProvider: 'Oracle Developer Network',
    estimatedDuration: '8 hours',
    isPublished: true,
    description: 'Comprehensive official API documentation, language specifications, and tutorials covering Java 21 standard libraries, pattern matching, and record patterns.'
  },
  {
    id: 'res-java-virtual-threads',
    title: 'JEP 444: Virtual Threads Deep Dive',
    topic: 'Java Fundamentals',
    resourceType: 'Article',
    difficulty: 'Advanced',
    url: 'https://openjdk.org/jeps/444',
    authorOrProvider: 'OpenJDK Project Loom',
    estimatedDuration: '3 hours',
    isPublished: true,
    description: 'The architectural specification for Java Virtual Threads, explaining carrier thread scheduling, unmounting mechanics on blocking I/O, and high-throughput concurrency.'
  },
  {
    id: 'res-baeldung-collections',
    title: 'The Comprehensive Java Collections Guide',
    topic: 'Object-Oriented Programming & Collections',
    resourceType: 'Reference Guide',
    difficulty: 'Intermediate',
    url: 'https://www.baeldung.com/java-collections',
    authorOrProvider: 'Baeldung',
    estimatedDuration: '6 hours',
    isPublished: true,
    description: 'Detailed analysis of List, Set, Map, and Queue implementations with Big-O time complexity charts, internal array growth, and concurrency trade-offs.'
  },
  {
    id: 'res-postgres-tutorial',
    title: 'PostgreSQL Relational Database & SQL Tutorial',
    topic: 'Relational Databases & SQL',
    resourceType: 'Interactive Tutorial',
    difficulty: 'Intermediate',
    url: 'https://www.postgresqltutorial.com/',
    authorOrProvider: 'PostgreSQL Tutorial Team',
    estimatedDuration: '10 hours',
    isPublished: true,
    description: 'Hands-on queries covering multi-table JOINs, subqueries, GROUP BY with aggregate functions, window functions, and B-tree indexing strategies.'
  },
  {
    id: 'res-mdn-http',
    title: 'MDN Web Docs: An Overview of HTTP & CORS',
    topic: 'Web Fundamentals & HTTP',
    resourceType: 'Documentation',
    difficulty: 'Beginner',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
    authorOrProvider: 'Mozilla Developer Network',
    estimatedDuration: '4 hours',
    isPublished: true,
    description: 'Authoritative guide to HTTP message flow, methods, headers, status codes, CORS preflight negotiations, and HTTPS TLS handshakes.'
  },
  {
    id: 'res-rest-guidelines',
    title: 'Microsoft REST API Guidelines & Best Practices',
    topic: 'REST APIs & Architecture',
    resourceType: 'Reference Guide',
    difficulty: 'Intermediate',
    url: 'https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md',
    authorOrProvider: 'Microsoft Architecture Board',
    estimatedDuration: '5 hours',
    isPublished: true,
    description: 'Industry-standard guidelines on clean resource URI modeling, idempotency, versioning, pagination with cursor links, and error status formatting.'
  },
  {
    id: 'res-spring-guides',
    title: 'Building a RESTful Web Service with Spring Boot 3',
    topic: 'Spring Boot & Dependency Injection',
    resourceType: 'Interactive Tutorial',
    difficulty: 'Intermediate',
    url: 'https://spring.io/guides/gs/rest-service',
    authorOrProvider: 'Spring by VMware Tanzu',
    estimatedDuration: '4 hours',
    isPublished: true,
    description: 'Official step-by-step tutorial building a production-ready REST service from scratch using Spring Boot 3, dependency injection, and Jackson serialization.'
  },
  {
    id: 'res-spring-security-baeldung',
    title: 'Spring Security 6 Architecture & JWT Authentication',
    topic: 'Spring Boot & Dependency Injection',
    resourceType: 'Article',
    difficulty: 'Advanced',
    url: 'https://www.baeldung.com/spring-security-registration-verification',
    authorOrProvider: 'Baeldung Enterprise Java',
    estimatedDuration: '7 hours',
    isPublished: true,
    description: 'Master Spring Security filter chains, SecurityFilterChain bean declaration, OncePerRequestFilter token verification, and method-level @PreAuthorize.'
  },
  {
    id: 'res-roadmap-java',
    title: 'Roadmap.sh — Java Full Stack Developer Visual Roadmap',
    topic: 'Java Fundamentals',
    resourceType: 'Reference Guide',
    difficulty: 'Intermediate',
    url: 'https://roadmap.sh/java',
    authorOrProvider: 'Roadmap.sh Community',
    estimatedDuration: '3 hours',
    isPublished: true,
    description: 'Visual competency tree and community-vetted progression paths for enterprise Java engineers from core syntax to cloud deployment.'
  }
];

export const PRACTICAL_PROJECTS: PracticalProject[] = [
  {
    id: 'proj-ecommerce-api',
    title: 'Enterprise E-Commerce REST API with Spring Boot 3',
    difficulty: 'Intermediate',
    problemStatement: 'Design and implement a robust e-commerce backend service that handles product inventory, customer carts, and checkout orders with strict ACID transactional guarantees, input validation, and role-based JWT security.',
    targetRole: 'Java Full Stack Developer',
    requiredSkills: [
      'Java Fundamentals',
      'Relational Databases & SQL',
      'REST APIs & Architecture',
      'Spring Boot & Dependency Injection'
    ],
    suggestedTechStack: [
      'Java 21',
      'Spring Boot 3.3',
      'Spring Data JPA',
      'PostgreSQL',
      'Spring Security with JWT',
      'Maven',
      'Docker Compose'
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Domain Model & Database Schema',
        description: 'Design User, Product, Category, Order, and OrderItem JPA entities with appropriate relations, foreign key constraints, and Flyway migration scripts.',
        isCompleted: false
      },
      {
        id: 'm2',
        title: 'CRUD Repositories & N+1 Prevention',
        description: 'Create Spring Data JPA repositories with custom @Query join fetches and entity graphs to prevent N+1 queries during order lookups.',
        isCompleted: false
      },
      {
        id: 'm3',
        title: 'Business Service Layer & Transactions',
        description: 'Implement OrderService with @Transactional semantics to atomically deduct inventory, calculate totals, and record order state.',
        isCompleted: false
      },
      {
        id: 'm4',
        title: 'REST Endpoints & Validation',
        description: 'Expose versioned REST endpoints with Jakarta Bean Validation (@NotNull, @Positive), pagination, and @RestControllerAdvice exception handling.',
        isCompleted: false
      },
      {
        id: 'm5',
        title: 'Security & Token Authorization',
        description: 'Configure SecurityFilterChain with JWT Bearer token authentication and role-based restrictions (Customer vs Admin).',
        isCompleted: false
      }
    ],
    completionChecklist: [
      'Database tables normalized with proper foreign keys and index on product sku',
      'All endpoints respond with appropriate HTTP status codes (201, 200, 400, 401, 404)',
      'Global exception handler returns clean ProblemDetail JSON',
      'Integration tests with MockMvc verifying order placement'
    ],
    userStatus: 'not_started',
    progressPercentage: 0
  },
  {
    id: 'proj-task-management',
    title: 'Collaborative Agile Task & Project Management System',
    difficulty: 'Advanced',
    problemStatement: 'Build a full-stack project tracking application with workspace workspaces, boards, sprint tasks, and real-time activity audit trails. The system demonstrates asynchronous event publishing, caching, and clean hexagonal architecture.',
    targetRole: 'Java Full Stack Developer',
    requiredSkills: [
      'Object-Oriented Programming & Collections',
      'Relational Databases & SQL',
      'Spring Boot & Dependency Injection',
      'Problem-Solving & Data Structures'
    ],
    suggestedTechStack: [
      'Java 21',
      'Spring Boot 3',
      'Spring Cache (Redis)',
      'React + TypeScript',
      'PostgreSQL',
      'JUnit 5 & Testcontainers'
    ],
    milestones: [
      {
        id: 'm1',
        title: 'Multi-Tenant Workspace & Member Access',
        description: 'Model organization workspaces with role-based member assignment (Owner, Member, Viewer).',
        isCompleted: false
      },
      {
        id: 'm2',
        title: 'Task Lifecycle & State Machine',
        description: 'Implement an immutable state-transition engine governing tasks moving from Backlog -> In Progress -> Code Review -> Done.',
        isCompleted: false
      },
      {
        id: 'm3',
        title: 'High-Throughput Filtering & Sorting',
        description: 'Write dynamic JPA Specifications to support multi-faceted filtering by assignee, priority, label, and due dates.',
        isCompleted: false
      },
      {
        id: 'm4',
        title: 'Audit Logging & Event Listeners',
        description: 'Use Spring ApplicationEventPublisher to asynchronously record task update audit records without blocking the main HTTP thread.',
        isCompleted: false
      }
    ],
    completionChecklist: [
      'Workspace data strictly isolated between different tenants',
      'Zero deadlocks under concurrent task assignment updates',
      '90%+ unit test coverage on state transition logic'
    ],
    userStatus: 'not_started',
    progressPercentage: 0
  }
];
