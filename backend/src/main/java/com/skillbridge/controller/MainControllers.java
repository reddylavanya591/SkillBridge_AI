package com.skillbridge.controller;

import com.skillbridge.model.SkillBridgeModels.*;
import com.skillbridge.service.AssessmentService;
import com.skillbridge.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping
public class MainControllers {

    // --- Profile Controller ---
    @RestController
    @RequestMapping("/profile")
    public static class ProfileController {
        private final Map<String, UserProfileDto> profiles = new ConcurrentHashMap<>();

        public ProfileController() {
            // Seed
            profiles.put("student@skillbridge.io", UserProfileDto.builder()
                    .id("user-student-default")
                    .email("student@skillbridge.io")
                    .name("Alex Rivera")
                    .role("student")
                    .targetRole("Java Full Stack Developer")
                    .educationLevel("Undergraduate")
                    .course("Computer Science")
                    .experienceLevel("Intermediate")
                    .weeklyHours(12)
                    .isProfileComplete(true)
                    .build());
        }

        @GetMapping
        public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal String uid) {
            UserProfileDto profile = profiles.get(uid);
            if (profile == null) {
                profile = UserProfileDto.builder()
                        .id(uid)
                        .targetRole("Java Full Stack Developer")
                        .role("student")
                        .weeklyHours(12)
                        .build();
            }
            return ResponseEntity.ok(profile);
        }

        @PutMapping
        public ResponseEntity<UserProfileDto> updateProfile(
                @RequestBody UserProfileDto updated,
                @AuthenticationPrincipal String uid) {
            updated.setId(uid);
            updated.setIsProfileComplete(true);
            profiles.put(uid, updated);
            return ResponseEntity.ok(updated);
        }
    }

    // --- Skill Analysis Controller ---
    @RestController
    @RequestMapping("/skills")
    public static class SkillAnalysisController {
        private final AssessmentService assessmentService;

        public SkillAnalysisController(AssessmentService assessmentService) {
            this.assessmentService = assessmentService;
        }

        @GetMapping("/gaps")
        public ResponseEntity<List<SkillGapDto>> getSkillGaps(@AuthenticationPrincipal String uid) {
            List<AssessmentAttemptDto> attempts = assessmentService.getUserAttempts(uid);
            AssessmentAttemptDto latest = attempts.isEmpty() ? null : attempts.get(0);

            List<String> categories = Arrays.asList(
                    "Java Fundamentals",
                    "Object-Oriented Programming & Collections",
                    "Relational Databases & SQL",
                    "Web Fundamentals & HTTP",
                    "REST APIs & Architecture",
                    "Spring Boot & Dependency Injection",
                    "Problem-Solving & Data Structures"
            );

            List<SkillGapDto> gaps = new ArrayList<>();
            for (String cat : categories) {
                TopicScoreDto score = latest != null && latest.getTopicScores() != null ? latest.getTopicScores().get(cat) : null;
                Integer pct = score != null && score.getTotal() > 0 ? score.getPercentage() : null;

                String currentStatus = "Not Assessed";
                String priority = "Medium";
                if (pct != null) {
                    if (pct >= 80) { currentStatus = "Strong"; priority = "Achieved"; }
                    else if (pct >= 70) { currentStatus = "Proficient"; priority = "Low"; }
                    else if (pct >= 50) { currentStatus = "Developing"; priority = "Medium"; }
                    else { currentStatus = "Needs Improvement"; priority = "High"; }
                }

                gaps.add(SkillGapDto.builder()
                        .skillName(cat)
                        .demonstratedScore(pct)
                        .currentStatus(currentStatus)
                        .targetStatus("Proficient")
                        .evidence(pct != null ? score.getCorrect() + "/" + score.getTotal() + " questions answered correctly (" + pct + "%)." : "No assessment data available.")
                        .priorityLevel(priority)
                        .recommendedAction(priority.equals("High") ? "Priority Phase tasks in roadmap." : "Continue practice.")
                        .build());
            }

            return ResponseEntity.ok(gaps);
        }
    }

    // --- Dashboard Controller ---
    @RestController
    @RequestMapping("/dashboard")
    public static class DashboardController {
        private final AssessmentService assessmentService;
        private final RoadmapService roadmapService;

        public DashboardController(AssessmentService assessmentService, RoadmapService roadmapService) {
            this.assessmentService = assessmentService;
            this.roadmapService = roadmapService;
        }

        @GetMapping
        public ResponseEntity<DashboardMetricsDto> getDashboard(@AuthenticationPrincipal String uid) {
            List<AssessmentAttemptDto> attempts = assessmentService.getUserAttempts(uid);
            PersonalizedRoadmapDto roadmap = roadmapService.getUserRoadmap(uid).orElse(null);

            Integer latestScore = attempts.isEmpty() ? null : attempts.get(0).getScorePercentage();
            Integer prevScore = attempts.size() > 1 ? attempts.get(1).getScorePercentage() : null;

            DashboardMetricsDto metrics = DashboardMetricsDto.builder()
                    .targetCareer("Java Full Stack Developer")
                    .latestAssessmentScore(latestScore)
                    .previousAssessmentScore(prevScore)
                    .totalAssessmentsTaken(attempts.size())
                    .skillsAssessedCount(latestScore != null ? 5 : 0)
                    .totalSkillsCount(7)
                    .roadmapCompletionPercentage(roadmap != null ? roadmap.getCompletionPercentage() : 0)
                    .totalRoadmapTasks(roadmap != null ? roadmap.getTotalTasks() : 0)
                    .completedRoadmapTasks(roadmap != null ? roadmap.getCompletedTasks() : 0)
                    .currentStreakDays(1)
                    .totalHoursLearned(3.5)
                    .weeklyHoursLogged(2.5)
                    .weakestSkillAreas(attempts.isEmpty() ? Collections.emptyList() : attempts.get(0).getWeakTopics())
                    .recentAttempts(attempts.subList(0, Math.min(5, attempts.size())))
                    .build();

            return ResponseEntity.ok(metrics);
        }
    }

    // --- Admin Controller ---
    @RestController
    @RequestMapping("/admin")
    public static class AdminController {
        private final AssessmentService assessmentService;

        public AdminController(AssessmentService assessmentService) {
            this.assessmentService = assessmentService;
        }

        @GetMapping("/questions")
        public ResponseEntity<List<AssessmentQuestionDto>> getAllQuestions() {
            return ResponseEntity.ok(assessmentService.getAllQuestions());
        }

        @PostMapping("/questions")
        public ResponseEntity<AssessmentQuestionDto> createQuestion(@RequestBody AssessmentQuestionDto question) {
            assessmentService.saveQuestion(question);
            return ResponseEntity.ok(question);
        }

        @PutMapping("/questions/{id}")
        public ResponseEntity<AssessmentQuestionDto> updateQuestion(@PathVariable String id, @RequestBody AssessmentQuestionDto question) {
            question.setId(id);
            assessmentService.saveQuestion(question);
            return ResponseEntity.ok(question);
        }

        @DeleteMapping("/questions/{id}")
        public ResponseEntity<Void> deleteQuestion(@PathVariable String id) {
            assessmentService.deleteQuestion(id);
            return ResponseEntity.noContent().build();
        }

        @GetMapping("/stats")
        public ResponseEntity<Map<String, Object>> getPlatformStats() {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStudents", 48);
            stats.put("totalQuestions", assessmentService.getAllQuestions().size());
            stats.put("publishedQuestions", assessmentService.getEligibleQuestions(100).size());
            stats.put("averagePlatformScore", 74);
            return ResponseEntity.ok(stats);
        }
    }
}
