package com.skillbridge;

import com.skillbridge.model.SkillBridgeModels.*;
import com.skillbridge.service.GeminiService;
import com.skillbridge.service.RoadmapService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class RoadmapServiceTest {

    private RoadmapService roadmapService;

    @BeforeEach
    void setUp() {
        GeminiService geminiService = new GeminiService();
        roadmapService = new RoadmapService(geminiService);
    }

    @Test
    @DisplayName("Verify roadmap generation includes sequential phases and tasks")
    void testRoadmapGeneration() {
        UserProfileDto profile = UserProfileDto.builder()
                .id("student-123")
                .targetRole("Java Full Stack Developer")
                .weeklyHours(15)
                .build();

        PersonalizedRoadmapDto roadmap = roadmapService.generateRoadmap(profile, null, false);

        assertNotNull(roadmap);
        assertEquals("rule-engine-fallback", roadmap.getGeneratedBy());
        assertFalse(roadmap.getPhases().isEmpty());
        assertTrue(roadmap.getTotalTasks() > 0);
        assertEquals(0, roadmap.getCompletedTasks());
        assertEquals(0, roadmap.getCompletionPercentage());
    }

    @Test
    @DisplayName("Verify progress preservation when updating task and recalculating completion")
    void testTaskProgressPreservation() {
        UserProfileDto profile = UserProfileDto.builder()
                .id("student-456")
                .targetRole("Java Full Stack Developer")
                .weeklyHours(12)
                .build();

        PersonalizedRoadmapDto roadmap = roadmapService.generateRoadmap(profile, null, false);
        String firstTaskId = roadmap.getPhases().get(0).getTasks().get(0).getId();

        roadmapService.updateTaskProgress("student-456", firstTaskId, "completed", 3);

        PersonalizedRoadmapDto updated = roadmapService.getUserRoadmap("student-456").orElseThrow();
        assertEquals(1, updated.getCompletedTasks());
        assertTrue(updated.getCompletionPercentage() > 0);

        // Regenerate roadmap and verify completion was preserved
        PersonalizedRoadmapDto regenerated = roadmapService.generateRoadmap(profile, null, false);
        assertEquals(1, regenerated.getCompletedTasks());
        assertEquals(updated.getCompletionPercentage(), regenerated.getCompletionPercentage());
    }
}
