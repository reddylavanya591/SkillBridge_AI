package com.skillbridge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class SkillBridgeModels {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileDto {
        private String id;
        private String email;
        private String name;
        private String role;
        private String educationLevel;
        private String course;
        private String targetRole;
        private String experienceLevel;
        private Integer weeklyHours;
        private String preferredLearningFormat;
        private List<String> currentSkills;
        private String learningGoals;
        private Boolean isProfileComplete;
        private String createdAt;
        private String updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssessmentQuestionDto {
        private String id;
        private String topic;
        private String difficulty;
        private String question;
        private String codeSnippet;
        private List<String> options;
        private Integer correctOptionIndex;
        private String explanation;
        private Boolean isPublished;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssessmentSubmissionRequest {
        private String userId;
        private List<String> questionIds;
        private Map<String, Integer> answers; // questionId -> selectedOptionIndex
        private Integer timeSpentSeconds;
        private Integer maxTimeSeconds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicScoreDto {
        private int total;
        private int correct;
        private int percentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssessmentAnswerRecordDto {
        private String questionId;
        private int selectedOptionIndex;
        private boolean isCorrect;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssessmentAttemptDto {
        private String id;
        private String userId;
        private String domain;
        private int totalQuestions;
        private int correctAnswersCount;
        private int scorePercentage;
        private int timeSpentSeconds;
        private int maxTimeSeconds;
        private String startedAt;
        private String completedAt;
        private List<AssessmentAnswerRecordDto> answers;
        private Map<String, TopicScoreDto> topicScores;
        private List<String> weakTopics;
        private List<String> strongTopics;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapDto {
        private String skillName;
        private Integer demonstratedScore;
        private String currentStatus;
        private String targetStatus;
        private String evidence;
        private String priorityLevel;
        private String recommendedAction;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResourceUrlDto {
        private String title;
        private String url;
        private String type;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapTaskDto {
        private String id;
        private String phaseId;
        private String title;
        private String description;
        private String skillCategory;
        private int estimatedHours;
        private Integer actualHoursSpent;
        private String status; // not_started, in_progress, completed
        private String practiceExercise;
        private String completionCriteria;
        private List<ResourceUrlDto> resourceUrls;
        private String completedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapPhaseDto {
        private String id;
        private int phaseNumber;
        private String title;
        private String description;
        private int estimatedWeeks;
        private List<RoadmapTaskDto> tasks;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonalizedRoadmapDto {
        private String id;
        private String userId;
        private String careerRole;
        private String createdAt;
        private String updatedAt;
        private String generatedBy; // gemini-ai or rule-engine-fallback
        private int totalTasks;
        private int completedTasks;
        private int completionPercentage;
        private int estimatedWeeks;
        private int weeklyHoursCommitted;
        private List<RoadmapPhaseDto> phases;
        private String rationale;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskProgressRequest {
        private String status;
        private Integer hoursSpent;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningResourceDto {
        private String id;
        private String title;
        private String topic;
        private String resourceType;
        private String difficulty;
        private String url;
        private String authorOrProvider;
        private String estimatedDuration;
        private Boolean isPublished;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MilestoneDto {
        private String id;
        private String title;
        private String description;
        private boolean isCompleted;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PracticalProjectDto {
        private String id;
        private String title;
        private String difficulty;
        private String problemStatement;
        private String targetRole;
        private List<String> requiredSkills;
        private List<String> suggestedTechStack;
        private List<MilestoneDto> milestones;
        private List<String> completionChecklist;
        private String userStatus;
        private int progressPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardMetricsDto {
        private String targetCareer;
        private Integer latestAssessmentScore;
        private Integer previousAssessmentScore;
        private int totalAssessmentsTaken;
        private int skillsAssessedCount;
        private int totalSkillsCount;
        private int roadmapCompletionPercentage;
        private int totalRoadmapTasks;
        private int completedRoadmapTasks;
        private int currentStreakDays;
        private double totalHoursLearned;
        private double weeklyHoursLogged;
        private List<String> weakestSkillAreas;
        private RoadmapTaskDto recommendedNextTask;
        private List<AssessmentAttemptDto> recentAttempts;
    }
}
