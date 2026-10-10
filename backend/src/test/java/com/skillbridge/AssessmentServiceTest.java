package com.skillbridge;

import com.skillbridge.model.SkillBridgeModels.*;
import com.skillbridge.service.AssessmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class AssessmentServiceTest {

    private AssessmentService assessmentService;

    @BeforeEach
    void setUp() {
        assessmentService = new AssessmentService();
    }

    @Test
    @DisplayName("Verify deterministic scoring: 100% when all answers match correctOptionIndex")
    void testPerfectScoreDeterministicScoring() {
        List<AssessmentQuestionDto> questions = assessmentService.getEligibleQuestions(5);
        assertFalse(questions.isEmpty());

        Map<String, Integer> answers = new HashMap<>();
        List<String> qIds = new ArrayList<>();

        for (AssessmentQuestionDto q : questions) {
            qIds.add(q.getId());
            answers.put(q.getId(), q.getCorrectOptionIndex()); // All correct
        }

        AssessmentSubmissionRequest request = new AssessmentSubmissionRequest(
                "user-test-1",
                qIds,
                answers,
                180,
                900
        );

        AssessmentAttemptDto attempt = assessmentService.scoreAssessment(request);

        assertNotNull(attempt);
        assertEquals(100, attempt.getScorePercentage());
        assertEquals(qIds.size(), attempt.getCorrectAnswersCount());
        assertTrue(attempt.getWeakTopics().isEmpty());
    }

    @Test
    @DisplayName("Verify zero score and weak topics assignment when all answers incorrect")
    void testZeroScoreIdentification() {
        List<AssessmentQuestionDto> questions = assessmentService.getEligibleQuestions(3);
        Map<String, Integer> answers = new HashMap<>();
        List<String> qIds = new ArrayList<>();

        for (AssessmentQuestionDto q : questions) {
            qIds.add(q.getId());
            // Intentionally pick wrong answer
            int wrong = (q.getCorrectOptionIndex() + 1) % q.getOptions().size();
            answers.put(q.getId(), wrong);
        }

        AssessmentSubmissionRequest request = new AssessmentSubmissionRequest(
                "user-test-2",
                qIds,
                answers,
                200,
                900
        );

        AssessmentAttemptDto attempt = assessmentService.scoreAssessment(request);

        assertEquals(0, attempt.getScorePercentage());
        assertEquals(0, attempt.getCorrectAnswersCount());
        assertFalse(attempt.getWeakTopics().isEmpty());
    }

    @Test
    @DisplayName("Verify attempt history immutability and user isolation")
    void testAttemptHistoryIsolation() {
        List<AssessmentQuestionDto> questions = assessmentService.getEligibleQuestions(2);
        List<String> qIds = Arrays.asList(questions.get(0).getId(), questions.get(1).getId());
        Map<String, Integer> answers = new HashMap<>();
        answers.put(qIds.get(0), 1);
        answers.put(qIds.get(1), 1);

        assessmentService.scoreAssessment(new AssessmentSubmissionRequest("user-a", qIds, answers, 100, 900));
        assessmentService.scoreAssessment(new AssessmentSubmissionRequest("user-b", qIds, answers, 120, 900));

        List<AssessmentAttemptDto> userAAttempts = assessmentService.getUserAttempts("user-a");
        List<AssessmentAttemptDto> userBAttempts = assessmentService.getUserAttempts("user-b");

        assertEquals(1, userAAttempts.size());
        assertEquals(1, userBAttempts.size());
        assertEquals("user-a", userAAttempts.get(0).getUserId());
        assertEquals("user-b", userBAttempts.get(0).getUserId());
    }
}
