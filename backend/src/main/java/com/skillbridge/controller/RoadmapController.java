package com.skillbridge.controller;

import com.skillbridge.model.SkillBridgeModels.*;
import com.skillbridge.service.AssessmentService;
import com.skillbridge.service.RoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final AssessmentService assessmentService;

    public RoadmapController(RoadmapService roadmapService, AssessmentService assessmentService) {
        this.roadmapService = roadmapService;
        this.assessmentService = assessmentService;
    }

    @GetMapping("/current")
    public ResponseEntity<PersonalizedRoadmapDto> getCurrentRoadmap(@AuthenticationPrincipal String principalUid) {
        return roadmapService.getUserRoadmap(principalUid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<PersonalizedRoadmapDto> generateRoadmap(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal String principalUid) {

        boolean preferAI = body.get("preferAI") == null || Boolean.TRUE.equals(body.get("preferAI"));
        String userId = principalUid != null ? principalUid : (String) body.get("userId");

        UserProfileDto profile = UserProfileDto.builder()
                .id(userId)
                .targetRole("Java Full Stack Developer")
                .weeklyHours(12)
                .experienceLevel("Intermediate")
                .educationLevel("Undergraduate")
                .build();

        List<AssessmentAttemptDto> attempts = assessmentService.getUserAttempts(userId);
        AssessmentAttemptDto latestAttempt = attempts.isEmpty() ? null : attempts.get(0);

        PersonalizedRoadmapDto roadmap = roadmapService.generateRoadmap(profile, latestAttempt, preferAI);
        return ResponseEntity.ok(roadmap);
    }

    @PatchMapping("/tasks/{taskId}/progress")
    public ResponseEntity<PersonalizedRoadmapDto> updateTaskProgress(
            @PathVariable String taskId,
            @RequestBody TaskProgressRequest request,
            @AuthenticationPrincipal String principalUid) {

        return roadmapService.updateTaskProgress(principalUid, taskId, request.getStatus(), request.getHoursSpent())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
