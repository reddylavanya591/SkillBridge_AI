package com.skillbridge.service;

import com.skillbridge.model.SkillBridgeModels.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoadmapService {

    private final GeminiService geminiService;
    private final Map<String, PersonalizedRoadmapDto> roadmapByUser = new ConcurrentHashMap<>();

    public RoadmapService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public PersonalizedRoadmapDto generateRoadmap(UserProfileDto profile, AssessmentAttemptDto latestAttempt, boolean preferAI) {
        PersonalizedRoadmapDto existing = roadmapByUser.get(profile.getId());

        if (preferAI) {
            Optional<PersonalizedRoadmapDto> aiRoadmap = geminiService.generateAiRoadmap(profile, latestAttempt, existing);
            if (aiRoadmap.isPresent()) {
                roadmapByUser.put(profile.getId(), aiRoadmap.get());
                return aiRoadmap.get();
            }
        }

        // Deterministic rule-based fallback
        PersonalizedRoadmapDto ruleRoadmap = generateRuleBasedRoadmap(profile, latestAttempt, existing);
        roadmapByUser.put(profile.getId(), ruleRoadmap);
        return ruleRoadmap;
    }

    public PersonalizedRoadmapDto generateRuleBasedRoadmap(UserProfileDto profile, AssessmentAttemptDto latestAttempt, PersonalizedRoadmapDto existing) {
        List<String> weakTopics = latestAttempt != null && latestAttempt.getWeakTopics() != null
                ? latestAttempt.getWeakTopics()
                : Arrays.asList("Relational Databases & SQL", "Spring Boot & Dependency Injection");

        int weeklyHours = profile.getWeeklyHours() != null ? profile.getWeeklyHours() : 12;

        List<RoadmapPhaseDto> phases = new ArrayList<>();

        // Phase 1
        phases.add(RoadmapPhaseDto.builder()
                .id("phase-1")
                .phaseNumber(1)
                .title("Phase 1: Core Java Foundations & Memory Architecture")
                .description("Master Java 21 primitive vs heap types, immutability, Records, and Virtual Threads.")
                .estimatedWeeks(3)
                .tasks(Arrays.asList(
                        RoadmapTaskDto.builder()
                                .id("task-1-1")
                                .phaseId("phase-1")
                                .title("Java Memory Model & Stack vs Heap")
                                .description("Analyze allocation mechanics, autoboxing overhead, and garbage collection roots.")
                                .skillCategory("Java Fundamentals")
                                .estimatedHours(6)
                                .status("not_started")
                                .practiceExercise("Write a memory benchmark comparing primitive int array vs Integer ArrayList.")
                                .completionCriteria("Pass test verifying equals vs == semantics.")
                                .resourceUrls(Collections.singletonList(new ResourceUrlDto("Oracle Java 21 Docs", "https://docs.oracle.com/en/java/javase/21/", "Documentation")))
                                .build(),
                        RoadmapTaskDto.builder()
                                .id("task-1-2")
                                .phaseId("phase-1")
                                .title("Java 21 Records & Pattern Matching")
                                .description("Refactor legacy POJOs to immutable records and exhaustive switch pattern matching.")
                                .skillCategory("Java Fundamentals")
                                .estimatedHours(5)
                                .status("not_started")
                                .practiceExercise("Create an immutable StudentRecord with compact constructor validation.")
                                .completionCriteria("Confirm immutability and record accessors.")
                                .resourceUrls(Collections.singletonList(new ResourceUrlDto("Roadmap.sh Java", "https://roadmap.sh/java", "Reference Guide")))
                                .build()
                ))
                .build());

        // Phase 2
        phases.add(RoadmapPhaseDto.builder()
                .id("phase-2")
                .phaseNumber(2)
                .title("Phase 2: Object-Oriented Design & Collections Framework")
                .description("Deep understanding of equals/hashCode contract, List/Map tradeoffs, and ConcurrentHashMap.")
                .estimatedWeeks(3)
                .tasks(Arrays.asList(
                        RoadmapTaskDto.builder()
                                .id("task-2-1")
                                .phaseId("phase-2")
                                .title("Enforce equals() and hashCode() Contract")
                                .description("Maintain mathematical symmetry and transitivity for hashed lookup integrity.")
                                .skillCategory("Object-Oriented Programming & Collections")
                                .estimatedHours(5)
                                .status("not_started")
                                .practiceExercise("Implement equals/hashCode on a StudentId entity used as a key in HashMap.")
                                .completionCriteria("All hash lookups return correct values without collision loss.")
                                .resourceUrls(Collections.singletonList(new ResourceUrlDto("Baeldung Collections", "https://www.baeldung.com/java-collections", "Reference Guide")))
                                .build()
                ))
                .build());

        // Phase 3
        phases.add(RoadmapPhaseDto.builder()
                .id("phase-3")
                .phaseNumber(3)
                .title("Phase 3: Relational SQL & Spring Data JPA")
                .description("Advanced multi-table JOINs, indexing, transactions, and mitigating Hibernate N+1 query bugs.")
                .estimatedWeeks(4)
                .tasks(Arrays.asList(
                        RoadmapTaskDto.builder()
                                .id("task-3-1")
                                .phaseId("phase-3")
                                .title("Mitigate N+1 JPA Queries with JOIN FETCH")
                                .description("Inspect Hibernate SQL logs and replace lazy cascade roundtrips with JOIN FETCH JPQL.")
                                .skillCategory("Relational Databases & SQL")
                                .estimatedHours(8)
                                .status("not_started")
                                .practiceExercise("Eliminate N+1 queries in an Order and OrderItem repository.")
                                .completionCriteria("Query count drops to exactly 1 query in console log.")
                                .resourceUrls(Collections.singletonList(new ResourceUrlDto("PostgreSQL Tutorial", "https://www.postgresqltutorial.com/", "Tutorial")))
                                .build()
                ))
                .build());

        // Phase 4
        phases.add(RoadmapPhaseDto.builder()
                .id("phase-4")
                .phaseNumber(4)
                .title("Phase 4: Spring Boot 3 Enterprise Microservices & Security")
                .description("Constructor injection, OncePerRequestFilter stateless JWT authentication, and @RestControllerAdvice.")
                .estimatedWeeks(4)
                .tasks(Arrays.asList(
                        RoadmapTaskDto.builder()
                                .id("task-4-1")
                                .phaseId("phase-4")
                                .title("Implement Stateless JWT Filter with Spring Security 6")
                                .description("Wire SecurityFilterChain, validate Bearer tokens, and set SecurityContextHolder.")
                                .skillCategory("Spring Boot & Dependency Injection")
                                .estimatedHours(9)
                                .status("not_started")
                                .practiceExercise("Protect /admin/** endpoints while keeping /auth/** public.")
                                .completionCriteria("Unauthorized calls return 401; valid tokens proceed.")
                                .resourceUrls(Collections.singletonList(new ResourceUrlDto("Spring Security Guide", "https://spring.io/guides", "Documentation")))
                                .build()
                ))
                .build());

        // Preserve completed status if previously completed
        if (existing != null && existing.getPhases() != null) {
            Set<String> completedIds = new HashSet<>();
            existing.getPhases().forEach(p -> p.getTasks().forEach(t -> {
                if ("completed".equalsIgnoreCase(t.getStatus())) completedIds.add(t.getId());
            }));

            phases.forEach(p -> p.getTasks().forEach(t -> {
                if (completedIds.contains(t.getId())) {
                    t.setStatus("completed");
                }
            }));
        }

        int total = 0;
        int completed = 0;
        for (RoadmapPhaseDto p : phases) {
            for (RoadmapTaskDto t : p.getTasks()) {
                total++;
                if ("completed".equalsIgnoreCase(t.getStatus())) completed++;
            }
        }
        int pct = total > 0 ? (int) Math.round(((double) completed / total) * 100) : 0;

        String rationale = latestAttempt != null
                ? String.format("Rule-Based Roadmap synthesized from diagnostic assessment (Score: %d%%). Identified %d focus areas: %s.",
                latestAttempt.getScorePercentage(), weakTopics.size(), String.join(", ", weakTopics))
                : "Standard baseline roadmap initialized for Java Full Stack Developer. Complete an assessment to unlock customized pacing.";

        return PersonalizedRoadmapDto.builder()
                .id(existing != null ? existing.getId() : "roadmap-" + System.currentTimeMillis())
                .userId(profile.getId())
                .careerRole(profile.getTargetRole() != null ? profile.getTargetRole() : "Java Full Stack Developer")
                .createdAt(existing != null ? existing.getCreatedAt() : Instant.now().toString())
                .updatedAt(Instant.now().toString())
                .generatedBy("rule-engine-fallback")
                .totalTasks(total)
                .completedTasks(completed)
                .completionPercentage(pct)
                .estimatedWeeks(14)
                .weeklyHoursCommitted(weeklyHours)
                .phases(phases)
                .rationale(rationale)
                .build();
    }

    public Optional<PersonalizedRoadmapDto> getUserRoadmap(String userId) {
        return Optional.ofNullable(roadmapByUser.get(userId));
    }

    public Optional<PersonalizedRoadmapDto> updateTaskProgress(String userId, String taskId, String newStatus, Integer hoursSpent) {
        PersonalizedRoadmapDto roadmap = roadmapByUser.get(userId);
        if (roadmap == null) return Optional.empty();

        int total = 0;
        int completed = 0;

        for (RoadmapPhaseDto p : roadmap.getPhases()) {
            for (RoadmapTaskDto t : p.getTasks()) {
                total++;
                if (t.getId().equals(taskId)) {
                    t.setStatus(newStatus);
                    if ("completed".equalsIgnoreCase(newStatus)) {
                        t.setCompletedAt(Instant.now().toString());
                    }
                    if (hoursSpent != null) {
                        t.setActualHoursSpent((t.getActualHoursSpent() != null ? t.getActualHoursSpent() : 0) + hoursSpent);
                    }
                }
                if ("completed".equalsIgnoreCase(t.getStatus())) {
                    completed++;
                }
            }
        }

        roadmap.setTotalTasks(total);
        roadmap.setCompletedTasks(completed);
        roadmap.setCompletionPercentage(total > 0 ? (int) Math.round(((double) completed / total) * 100) : 0);
        roadmap.setUpdatedAt(Instant.now().toString());

        return Optional.of(roadmap);
    }
}
