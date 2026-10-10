package com.skillbridge.service;

import com.skillbridge.model.SkillBridgeModels.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final Map<String, AssessmentQuestionDto> questionBank = new ConcurrentHashMap<>();
    private final Map<String, List<AssessmentAttemptDto>> attemptsByUser = new ConcurrentHashMap<>();

    public AssessmentService() {
        initStarterQuestions();
    }

    private void initStarterQuestions() {
        addQuestion("q-java-01", "Java Fundamentals", "Beginner",
                "What is the key difference between primitive types and their corresponding wrapper classes in Java?",
                null,
                Arrays.asList(
                        "Wrapper classes are stored directly on the stack without object overhead",
                        "Wrapper classes are reference objects allocated on the heap and can be null",
                        "Primitive types support generics whereas wrapper classes do not",
                        "Primitive types implement Serializable by default"),
                1,
                "Primitive types store values directly on the stack; wrappers are full objects allocated on the heap and can be null.");

        addQuestion("q-java-02", "Java Fundamentals", "Intermediate",
                "What is the output of String s1 = \"SkillBridge\"; String s2 = new String(\"SkillBridge\"); System.out.println((s1 == s2) + \" \" + (s1.equals(s2)));",
                "String s1 = \"SkillBridge\";\nString s2 = new String(\"SkillBridge\");\nSystem.out.println((s1 == s2) + \" \" + (s1.equals(s2)));",
                Arrays.asList("true true", "false true", "true false", "false false"),
                1,
                "== checks reference identity (false because new String is a new heap instance), .equals compares content (true).");

        addQuestion("q-oop-01", "Object-Oriented Programming & Collections", "Beginner",
                "Which SOLID principle is violated if a subclass breaks caller preconditions when overriding a parent method?",
                null,
                Arrays.asList("Single Responsibility", "Liskov Substitution Principle (LSP)", "Interface Segregation",
                        "Open-Closed"),
                1,
                "LSP states objects of a superclass should be replaceable with objects of a subclass without altering correctness.");

        addQuestion("q-sql-01", "Relational Databases & SQL", "Intermediate",
                "What is the primary difference between WHERE and HAVING clauses in SQL?",
                null,
                Arrays.asList(
                        "WHERE filters rows after aggregation; HAVING filters before aggregation",
                        "WHERE filters individual rows before grouping; HAVING filters aggregated groups created by GROUP BY",
                        "HAVING can only be used with subqueries",
                        "WHERE is only valid in PostgreSQL"),
                1,
                "WHERE filters raw rows prior to aggregation; HAVING filters grouped aggregated result sets.");

        addQuestion("q-spring-01", "Spring Boot & Dependency Injection", "Intermediate",
                "Why is constructor injection strongly preferred over field injection in Spring Boot?",
                null,
                Arrays.asList(
                        "Constructor injection compiles to C++",
                        "Constructor injection guarantees immutability via final fields and facilitates easy unit testing without reflection",
                        "Field injection causes compiler errors in Java 17",
                        "Constructor injection disables post-processors"),
                1,
                "Constructor injection allows final fields, prevents half-constructed objects, and allows effortless unit testing with standard mocks.");
    }

    private void addQuestion(String id, String topic, String diff, String q, String snippet, List<String> opts,
            int correctIdx, String expl) {
        questionBank.put(id, AssessmentQuestionDto.builder()
                .id(id)
                .topic(topic)
                .difficulty(diff)
                .question(q)
                .codeSnippet(snippet)
                .options(opts)
                .correctOptionIndex(correctIdx)
                .explanation(expl)
                .isPublished(true)
                .build());
    }

    public List<AssessmentQuestionDto> getEligibleQuestions(int count) {
        List<AssessmentQuestionDto> published = questionBank.values().stream()
                .filter(AssessmentQuestionDto::getIsPublished)
                .collect(Collectors.toList());
        Collections.shuffle(published);
        return published.subList(0, Math.min(count, published.size()));
    }

    public AssessmentAttemptDto scoreAssessment(AssessmentSubmissionRequest request) {
        List<AssessmentAnswerRecordDto> answerRecords = new ArrayList<>();
        Map<String, int[]> topicTracker = new HashMap<>(); // topic -> [total, correct]

        int correctCount = 0;
        List<String> qIds = request.getQuestionIds();

        for (String qId : qIds) {
            AssessmentQuestionDto question = questionBank.get(qId);
            if (question == null)
                continue;

            int selected = request.getAnswers().getOrDefault(qId, -1);
            boolean isCorrect = (selected == question.getCorrectOptionIndex());
            if (isCorrect)
                correctCount++;

            answerRecords.add(AssessmentAnswerRecordDto.builder()
                    .questionId(qId)
                    .selectedOptionIndex(selected)
                    .isCorrect(isCorrect)
                    .build());

            topicTracker.putIfAbsent(question.getTopic(), new int[] { 0, 0 });
            int[] counts = topicTracker.get(question.getTopic());
            counts[0]++;
            if (isCorrect)
                counts[1]++;
        }

        int totalQuestions = qIds.size();
        int scorePercentage = totalQuestions > 0 ? (int) Math.round(((double) correctCount / totalQuestions) * 100) : 0;

        Map<String, TopicScoreDto> topicScores = new HashMap<>();
        List<String> weakTopics = new ArrayList<>();
        List<String> strongTopics = new ArrayList<>();

        for (Map.Entry<String, int[]> entry : topicTracker.entrySet()) {
            int total = entry.getValue()[0];
            int correct = entry.getValue()[1];
            int pct = total > 0 ? (int) Math.round(((double) correct / total) * 100) : 0;

            topicScores.put(entry.getKey(), TopicScoreDto.builder()
                    .total(total)
                    .correct(correct)
                    .percentage(pct)
                    .build());

            if (pct < 65) {
                weakTopics.add(entry.getKey());
            } else if (pct >= 80) {
                strongTopics.add(entry.getKey());
            }
        }

        AssessmentAttemptDto attempt = AssessmentAttemptDto.builder()
                .id("attempt-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 5))
                .userId(request.getUserId())
                .domain("Java Full Stack Developer")
                .totalQuestions(totalQuestions)
                .correctAnswersCount(correctCount)
                .scorePercentage(scorePercentage)
                .timeSpentSeconds(request.getTimeSpentSeconds())
                .maxTimeSeconds(request.getMaxTimeSeconds())
                .startedAt(Instant.now().minusSeconds(request.getTimeSpentSeconds()).toString())
                .completedAt(Instant.now().toString())
                .answers(answerRecords)
                .topicScores(topicScores)
                .weakTopics(weakTopics)
                .strongTopics(strongTopics)
                .build();

        attemptsByUser.computeIfAbsent(request.getUserId(), k -> new ArrayList<>()).add(0, attempt);
        return attempt;
    }

    public List<AssessmentAttemptDto> getUserAttempts(String userId) {
        return attemptsByUser.getOrDefault(userId, Collections.emptyList());
    }

    public Optional<AssessmentAttemptDto> getAttemptById(String attemptId) {
        for (List<AssessmentAttemptDto> userAttempts : attemptsByUser.values()) {
            for (AssessmentAttemptDto att : userAttempts) {
                if (att.getId().equals(attemptId))
                    return Optional.of(att);
            }
        }
        return Optional.empty();
    }

    public List<AssessmentQuestionDto> getAllQuestions() {
        return new ArrayList<>(questionBank.values());
    }

    public void saveQuestion(AssessmentQuestionDto q) {
        if (q.getId() == null || q.getId().isEmpty()) {
            q.setId("q-" + System.currentTimeMillis());
        }
        questionBank.put(q.getId(), q);
    }

    public void deleteQuestion(String id) {
        questionBank.remove(id);
    }
}
