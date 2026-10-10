import { AssessmentQuestion } from '../types';

export const STARTER_QUESTION_BANK: AssessmentQuestion[] = [
  // 1. Java Fundamentals
  {
    id: 'q-java-01',
    topic: 'Java Fundamentals',
    difficulty: 'Beginner',
    question: 'What is the key difference between primitive types and their corresponding wrapper classes in Java?',
    options: [
      'Wrapper classes are stored directly on the stack without object overhead',
      'Wrapper classes are reference objects allocated on the heap and can be null',
      'Primitive types support generics whereas wrapper classes do not',
      'Primitive types implement Serializable by default'
    ],
    correctOptionIndex: 1,
    explanation: 'Primitive types (e.g., int, boolean) store values directly on the stack with minimal memory footprint and cannot be null. Wrapper classes (Integer, Boolean) are full objects allocated on the heap, can hold null, and allow primitives to participate in Java Collections and Generics.',
    isPublished: true
  },
  {
    id: 'q-java-02',
    topic: 'Java Fundamentals',
    difficulty: 'Intermediate',
    question: 'What is the output or behavior of the following code snippet regarding String interning?',
    codeSnippet: 'String s1 = "SkillBridge";\nString s2 = new String("SkillBridge");\nSystem.out.println((s1 == s2) + " " + (s1.equals(s2)));',
    options: [
      'true true',
      'false true',
      'true false',
      'false false'
    ],
    correctOptionIndex: 1,
    explanation: 'The `==` operator checks reference identity (memory address), which is false because `new String()` allocates a new object on the heap outside the String Pool. The `.equals()` method compares the character sequences, which returns true.',
    isPublished: true
  },
  {
    id: 'q-java-03',
    topic: 'Java Fundamentals',
    difficulty: 'Intermediate',
    question: 'In modern Java (Java 17+), how does a Record class differ from a standard POJO?',
    options: [
      'Records are mutable data carriers that generate getters, setters, and a no-arg constructor automatically',
      'Records are immutable, implicitly final transparent data carriers that automatically generate canonical constructors, accessors, equals(), hashCode(), and toString()',
      'Records can extend any abstract class and cannot implement interfaces',
      'Records cannot declare custom instance or static methods'
    ],
    correctOptionIndex: 1,
    explanation: 'Java Records are concise immutable data carriers. They cannot extend other classes (they extend java.lang.Record) and cannot declare non-static instance fields other than the record components. They auto-generate accessors matching component names.',
    isPublished: true
  },
  {
    id: 'q-java-04',
    topic: 'Java Fundamentals',
    difficulty: 'Advanced',
    question: 'What is the primary benefit of Java 21 Virtual Threads (Project Loom) compared to platform threads?',
    options: [
      'Virtual threads execute CPU-bound cryptographic operations twice as fast as platform threads',
      'Virtual threads bypass the Java Garbage Collector entirely',
      'Virtual threads are lightweight, user-mode threads managed by the JVM that unmount from carrier threads during blocking I/O, allowing high-throughput concurrent workloads with minimal OS thread overhead',
      'Virtual threads share mutable thread-local storage across all threads automatically'
    ],
    correctOptionIndex: 2,
    explanation: 'Virtual threads solve the one-thread-per-request scaling bottleneck in I/O bound applications. When a virtual thread performs a blocking socket or database read, the JVM unmounts it from the underlying carrier OS thread, allowing millions of concurrent tasks with low memory consumption.',
    isPublished: true
  },

  // 2. OOP & Collections
  {
    id: 'q-oop-01',
    topic: 'Object-Oriented Programming & Collections',
    difficulty: 'Beginner',
    question: 'Which core object-oriented principle is violated if a subclass overrides a method from a parent class in a way that breaks caller expectations and preconditions?',
    options: [
      'Single Responsibility Principle (SRP)',
      'Liskov Substitution Principle (LSP)',
      'Interface Segregation Principle (ISP)',
      'Open-Closed Principle (OCP)'
    ],
    correctOptionIndex: 1,
    explanation: 'The Liskov Substitution Principle (LSP) mandates that objects of a superclass should be replaceable with objects of a subclass without altering the correctness or preconditions of the program.',
    isPublished: true
  },
  {
    id: 'q-oop-02',
    topic: 'Object-Oriented Programming & Collections',
    difficulty: 'Intermediate',
    question: 'What contract requirement must be honored when overriding the equals() method in a Java class?',
    options: [
      'If two objects are unequal by equals(), their hashCode() values must also be different',
      'If two objects are equal according to equals(), their hashCode() method MUST produce the exact same integer value',
      'hashCode() must return the System.identityHashCode() under all circumstances',
      'equals() must accept only instances of the exact runtime class and never call super.equals()'
    ],
    correctOptionIndex: 1,
    explanation: 'The general contract for Object states: If two objects are equal according to the equals(Object) method, calling the hashCode method on each of the two objects must produce the same integer result. Failure to follow this breaks HashMap and HashSet lookups.',
    isPublished: true
  },
  {
    id: 'q-oop-03',
    topic: 'Object-Oriented Programming & Collections',
    difficulty: 'Intermediate',
    question: 'When should a developer choose ArrayList over LinkedList in modern Java?',
    options: [
      'LinkedList is always faster for all operations because it avoids array resizing',
      'ArrayList provides O(1) random access and superior CPU cache locality due to contiguous memory allocation, making it the preferred default list in almost all cases',
      'LinkedList consumes significantly less memory per element than ArrayList',
      'ArrayList is synchronized and thread-safe by default'
    ],
    correctOptionIndex: 1,
    explanation: 'ArrayList is backed by a contiguous array, offering O(1) indexed lookup and high CPU cache locality. LinkedList allocates Node objects for every entry with pointer overhead, degrading cache line performance.',
    isPublished: true
  },
  {
    id: 'q-oop-04',
    topic: 'Object-Oriented Programming & Collections',
    difficulty: 'Advanced',
    question: 'How does ConcurrentHashMap achieve thread-safe concurrent read and write operations without locking the entire table?',
    options: [
      'It synchronizes every method using a single global reentrant lock',
      'It uses lock-free reads via volatile variables and fine-grained node-level locking (CAS + synchronized on bin heads) during writes',
      'It copies the entire internal array on every insertion like CopyOnWriteArrayList',
      'It delegates all write requests to a dedicated background single-threaded executor'
    ],
    correctOptionIndex: 1,
    explanation: 'In Java 8+, ConcurrentHashMap avoids table-wide locking. Reads are lock-free due to volatile field reads, and writes lock only the specific head node of the bucket bin using CAS (Compare-And-Swap) and synchronized blocks.',
    isPublished: true
  },

  // 3. Relational Databases & SQL
  {
    id: 'q-sql-01',
    topic: 'Relational Databases & SQL',
    difficulty: 'Beginner',
    question: 'What is the purpose of a FOREIGN KEY constraint in a relational database?',
    options: [
      'It automatically accelerates full-text search indexing on all string columns',
      'It enforces referential integrity between two tables by ensuring that a value in the child table matches a valid primary key in the parent table',
      'It encrypts sensitive column values on disk',
      'It prevents NULL values from ever existing in any column of the table'
    ],
    correctOptionIndex: 1,
    explanation: 'A Foreign Key establishes a relationship between two tables and maintains referential integrity, preventing orphaned rows in the child table when parent rows are updated or deleted.',
    isPublished: true
  },
  {
    id: 'q-sql-02',
    topic: 'Relational Databases & SQL',
    difficulty: 'Intermediate',
    question: 'What is the primary difference between WHERE and HAVING clauses in SQL?',
    options: [
      'WHERE filters rows after aggregation, whereas HAVING filters rows before aggregation',
      'WHERE filters individual rows before grouping and aggregation, whereas HAVING filters aggregated groups created by GROUP BY',
      'HAVING can only be used with subqueries and never with aggregate functions like COUNT()',
      'WHERE is only valid in PostgreSQL and HAVING is only valid in MySQL'
    ],
    correctOptionIndex: 1,
    explanation: 'The WHERE clause filters individual rows before any GROUP BY aggregation occurs. The HAVING clause filters the grouped result sets based on aggregate functions such as `HAVING COUNT(*) > 5`.',
    isPublished: true
  },
  {
    id: 'q-sql-03',
    topic: 'Relational Databases & SQL',
    difficulty: 'Intermediate',
    question: 'How does an ACID transaction guarantee Atomicity and Isolation in a relational database?',
    options: [
      'Atomicity ensures that all operations succeed or all roll back completely; Isolation prevents concurrent transactions from seeing each other\'s uncommitted intermediate states according to the isolation level',
      'Atomicity guarantees immediate data replication across geographic regions; Isolation guarantees no network latency',
      'Atomicity prevents duplicate primary keys; Isolation guarantees tables are normalized to 3NF',
      'Atomicity disables table locking during batch imports; Isolation automatically runs queries in parallel'
    ],
    correctOptionIndex: 0,
    explanation: 'Atomicity is the "all-or-nothing" rule: if any part of the transaction fails, the entire transaction is rolled back. Isolation ensures that concurrent transaction executions do not interfere or expose dirty reads depending on isolation settings.',
    isPublished: true
  },
  {
    id: 'q-sql-04',
    topic: 'Relational Databases & SQL',
    difficulty: 'Advanced',
    question: 'What is the classic "N+1 query problem" in JPA/Hibernate and what is the standard fix?',
    options: [
      'Hibernate inserts N records in N separate transactions; the fix is setting spring.jpa.show-sql=false',
      'Hibernate executes 1 query for the parent entity and then N additional individual queries to fetch related child entities; the fix is using JOIN FETCH, entity graphs, or batch fetching',
      'Hibernate fails when primary keys exceed N digits; the fix is using UUID identifiers',
      'Hibernate creates N database connections per HTTP thread; the fix is disabling connection pooling'
    ],
    correctOptionIndex: 1,
    explanation: 'When navigating a lazy or default relation across N parent entities, Hibernate can issue 1 initial query followed by N subsequent queries to fetch children. Using a `JOIN FETCH` JPQL query or `@EntityGraph` allows the database to retrieve all required relations in a single join query.',
    isPublished: true
  },

  // 4. Web Fundamentals & HTTP
  {
    id: 'q-web-01',
    topic: 'Web Fundamentals & HTTP',
    difficulty: 'Beginner',
    question: 'Which HTTP status code category represents client-side errors, and which status code represents Unauthorized authentication?',
    options: [
      '5xx series; 503 Service Unavailable',
      '4xx series; 401 Unauthorized',
      '3xx series; 301 Moved Permanently',
      '2xx series; 204 No Content'
    ],
    correctOptionIndex: 1,
    explanation: 'The 4xx status code family denotes client errors. Specifically, 401 Unauthorized indicates that the request lacks valid authentication credentials, while 403 Forbidden indicates the caller is authenticated but lacks required permissions.',
    isPublished: true
  },
  {
    id: 'q-web-02',
    topic: 'Web Fundamentals & HTTP',
    difficulty: 'Intermediate',
    question: 'What does "Idempotency" mean in the context of HTTP methods?',
    options: [
      'An idempotent request cannot be cached by HTTP proxies or browsers',
      'Making multiple identical requests has the same intended effect on the server state as a single request',
      'The request must complete in under 100 milliseconds',
      'The server generates a new resource identifier on every invocation'
    ],
    correctOptionIndex: 1,
    explanation: 'An HTTP method is idempotent if executing it multiple times produces the exact same resource state as executing it once. GET, PUT, and DELETE are idempotent; POST is typically non-idempotent because multiple calls create multiple resources.',
    isPublished: true
  },
  {
    id: 'q-web-03',
    topic: 'Web Fundamentals & HTTP',
    difficulty: 'Intermediate',
    question: 'Why does a browser trigger a CORS Preflight (OPTIONS) request before sending certain HTTP requests to a backend API?',
    options: [
      'Because CORS requires browsers to verify DNS propagation before every TLS handshake',
      'To check whether the target cross-origin server permits the HTTP method and custom headers (such as Authorization) before sending potentially state-mutating requests',
      'To compress the JSON body before transmission over HTTPS',
      'To automatically convert the request from HTTP/1.1 to HTTP/2'
    ],
    correctOptionIndex: 1,
    explanation: 'For non-simple cross-origin requests (e.g. methods other than GET/POST or requests containing headers like Authorization or application/json), the browser sends an OPTIONS preflight request to confirm Access-Control-Allow-Origin, Methods, and Headers before making the actual request.',
    isPublished: true
  },

  // 5. REST APIs & Architecture
  {
    id: 'q-rest-01',
    topic: 'REST APIs & Architecture',
    difficulty: 'Beginner',
    question: 'Following RESTful URL design conventions, which URI and HTTP method combination best represents creating a new comment under a specific post?',
    options: [
      'GET /api/v1/posts/addComment?postId=42',
      'POST /api/v1/posts/42/comments',
      'PUT /api/v1/create-new-comment-for-post-42',
      'POST /api/v1/all-comments-insert'
    ],
    correctOptionIndex: 1,
    explanation: 'REST resources use hierarchical nouns rather than verbs. `POST /api/v1/posts/{postId}/comments` clearly identifies the parent resource collection and conveys the creation of a sub-resource.',
    isPublished: true
  },
  {
    id: 'q-rest-02',
    topic: 'REST APIs & Architecture',
    difficulty: 'Intermediate',
    question: 'In RESTful API design, what is the semantic difference between PUT and PATCH methods?',
    options: [
      'PUT is used for partial updates while PATCH replaces the entire resource representation',
      'PUT replaces the complete resource state with the supplied representation; PATCH applies a partial update modifying only the specified fields',
      'PUT is non-idempotent while PATCH is always idempotent',
      'PUT is exclusively reserved for binary file uploads'
    ],
    correctOptionIndex: 1,
    explanation: 'PUT semantics require replacing the entire existing resource representation. PATCH (RFC 5789) is designed for partial modifications, updating only the fields provided in the request payload without affecting other attributes.',
    isPublished: true
  },
  {
    id: 'q-rest-03',
    topic: 'REST APIs & Architecture',
    difficulty: 'Advanced',
    question: 'How should stateless JWT (JSON Web Token) authentication be verified on a Spring Boot REST API for every request?',
    options: [
      'Store all JWT strings in the server HTTP Session and compare them against a database on every request',
      'Use a custom OncePerRequestFilter that extracts the Bearer token from the Authorization header, validates the signature and expiration cryptographic claims, and sets an Authentication token in the SecurityContextHolder',
      'Decrypt the JWT payload using the client\'s private key on the frontend',
      'Disable Spring Security csrf and allow all requests without inspection'
    ],
    correctOptionIndex: 1,
    explanation: 'Stateless REST authentication avoids server sessions. A security filter extending OncePerRequestFilter extracts the token from the Authorization header, verifies its digital signature, decodes claims, and populates the SecurityContextHolder for Spring Security to enforce endpoint authorization.',
    isPublished: true
  },

  // 6. Spring Boot & Dependency Injection
  {
    id: 'q-spring-01',
    topic: 'Spring Boot & Dependency Injection',
    difficulty: 'Beginner',
    question: 'What is Inversion of Control (IoC) and Dependency Injection (DI) in Spring Boot?',
    options: [
      'A pattern where objects instantiate all their own collaborators using the `new` keyword',
      'A design pattern where the Spring IoC container manages the lifecycle and wiring of bean dependencies, injecting them at runtime rather than having classes instantiate them directly',
      'A database migration tool used to invert SQL schemas',
      'A compiler flag that transforms Java bytecode into native machine code'
    ],
    correctOptionIndex: 1,
    explanation: 'IoC transfers control of object instantiation and dependency management to the framework. Through Dependency Injection, Spring supplies required dependencies (via constructors, setters, or fields) to components.',
    isPublished: true
  },
  {
    id: 'q-spring-02',
    topic: 'Spring Boot & Dependency Injection',
    difficulty: 'Intermediate',
    question: 'Why is constructor injection strongly preferred over field injection (@Autowired on private fields) in Spring Boot?',
    options: [
      'Constructor injection runs faster in production because Spring compiles it to C++',
      'Constructor injection ensures immutability (via final fields), guarantees objects cannot be created in an incomplete state, and facilitates easy unit testing with mocks without needing a Spring container',
      'Field injection is deprecated and causes compilation errors in Java 17',
      'Constructor injection bypasses Spring bean lifecycle post-processors'
    ],
    correctOptionIndex: 1,
    explanation: 'Constructor injection allows dependencies to be declared `final`, guarantees that an instance is never constructed without its required collaborators, and makes unit testing effortless by simply passing mocks to the constructor without ReflectionTestUtils.',
    isPublished: true
  },
  {
    id: 'q-spring-03',
    topic: 'Spring Boot & Dependency Injection',
    difficulty: 'Intermediate',
    question: 'What is the role of @RestControllerAdvice combined with @ExceptionHandler in a Spring Boot application?',
    options: [
      'It intercepts and logs all outgoing database queries automatically',
      'It provides centralized, cross-cutting exception handling across all controllers, converting uncaught exceptions into clean, standardized API response bodies and HTTP status codes',
      'It automatically retries failed HTTP requests to external microservices',
      'It disables security checks on public endpoints'
    ],
    correctOptionIndex: 1,
    explanation: '`@RestControllerAdvice` allows developers to define centralized error-handling logic for the entire REST application. When a controller throws an exception, the matching `@ExceptionHandler` formats a consistent JSON error response (e.g., RFC 7807 Problem Details).',
    isPublished: true
  },
  {
    id: 'q-spring-04',
    topic: 'Spring Boot & Dependency Injection',
    difficulty: 'Advanced',
    question: 'What does @Transactional(readOnly = true) do when applied to a Spring service method with JPA/Hibernate?',
    options: [
      'It prevents the method from reading any database tables that have active write locks',
      'It optimizes database reads by allowing Hibernate to disable dirty-checking flush cycles and hints the JDBC driver to route queries to read replicas if supported',
      'It throws a runtime exception if any query returns more than one row',
      'It disables all transaction management and runs queries outside any connection context'
    ],
    correctOptionIndex: 1,
    explanation: 'Marking a transaction as read-only signals Hibernate to avoid tracking entity snapshot modifications (skipping dirty checking on flush) and allows underlying JDBC drivers and connection pools to route queries to read-replicas for improved performance.',
    isPublished: true
  },

  // 7. Problem-Solving & Data Structures
  {
    id: 'q-algo-01',
    topic: 'Problem-Solving & Data Structures',
    difficulty: 'Beginner',
    question: 'What is the average time complexity of lookups in a well-distributed Java HashMap compared to a TreeMap?',
    options: [
      'HashMap is O(N); TreeMap is O(1)',
      'HashMap is O(1); TreeMap is O(log N)',
      'Both are strictly O(1) in the worst case',
      'HashMap is O(log N); TreeMap is O(N log N)'
    ],
    correctOptionIndex: 1,
    explanation: 'HashMap uses hash-bucket indexing achieving amortized O(1) time complexity for get() and put(). TreeMap is backed by a Red-Black self-balancing binary search tree, providing guaranteed O(log N) operations ordered by keys.',
    isPublished: true
  },
  {
    id: 'q-algo-02',
    topic: 'Problem-Solving & Data Structures',
    difficulty: 'Intermediate',
    question: 'Which algorithmic technique is most appropriate for finding the shortest path in an unweighted directed graph?',
    options: [
      'Depth-First Search (DFS)',
      'Breadth-First Search (BFS)',
      'Kruskal\'s Minimum Spanning Tree Algorithm',
      'Kadane\'s Maximum Subarray Algorithm'
    ],
    correctOptionIndex: 1,
    explanation: 'Breadth-First Search (BFS) explores vertices level by level using a queue, guaranteeing that the first time a target vertex is reached in an unweighted graph, the shortest path (minimum edge hops) has been discovered.',
    isPublished: true
  },
  {
    id: 'q-algo-03',
    topic: 'Problem-Solving & Data Structures',
    difficulty: 'Advanced',
    question: 'What technique prevents StackOverflowError when processing deeply recursive algorithms in Java, and what is its space complexity?',
    options: [
      'Switching to an iterative approach using an explicit heap-allocated Stack data structure, shifting memory usage from the thread call stack to heap memory with O(N) auxiliary space',
      'Declaring all recursive methods with the volatile keyword to double the thread stack size',
      'Wrapping the recursion inside an asynchronous CompletableFuture to reset the stack depth',
      'Using the transient keyword on local parameters'
    ],
    correctOptionIndex: 0,
    explanation: 'The JVM thread stack has a fixed size (typically 1MB). Deep recursion can exhaust this call stack. Converting the algorithm into an iterative loop with an explicit Deque/Stack on the heap eliminates the risk of call-stack exhaustion.',
    isPublished: true
  }
];
