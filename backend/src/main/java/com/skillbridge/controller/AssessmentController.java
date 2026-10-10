package com.skillbridge.controller;

import com.skillbridge.model.SkillBridgeModels.*;
import com.skillbridge.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public ResponseEntity<List<AssessmentQuestionDto>> getEligibleQuestions(
            @RequestParam(defaultValue = "10") int count) {
        return ResponseEntity.ok(assessmentService.getEligibleQuestions(count));
    }

    @PostMapping("/attempts/submit")
    public ResponseEntity<AssessmentAttemptDto> submitAssessment(
            @RequestBody AssessmentSubmissionRequest request,
            @AuthenticationPrincipal String principalUid) {

        if (principalUid != null && !principalUid.isEmpty()) {
            request.setUserId(principalUid);
        }
        AssessmentAttemptDto attempt = assessmentService.scoreAssessment(request);
        return ResponseEntity.ok(attempt);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AssessmentAttemptDto>> getAssessmentHistory(
            @AuthenticationPrincipal String principalUid) {
        return ResponseEntity.ok(assessmentService.getUserAttempts(principalUid));
    }

    @GetMapping("/attempts/{attemptId}")
    public ResponseEntity<AssessmentAttemptDto> getAttemptById(@PathVariable String attemptId) {
        return assessmentService.getAttemptById(attemptId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
