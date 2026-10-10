package com.skillbridge.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillbridge.model.SkillBridgeModels.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${skillbridge.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${skillbridge.gemini.model:gemini-3.8-flash}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isGeminiConfigured() {
        return geminiApiKey != null && !geminiApiKey.trim().isEmpty() && !geminiApiKey.equals("MY_GEMINI_API_KEY");
    }

    public Optional<PersonalizedRoadmapDto> generateAiRoadmap(
            UserProfileDto profile,
            AssessmentAttemptDto latestAttempt,
            PersonalizedRoadmapDto existingRoadmap) {

        if (!isGeminiConfigured()) {
            log.info("Gemini API key is not configured in backend environment. Delegating to rule-based engine.");
            return Optional.empty();
        }

        try {
            String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + geminiApiKey;

            String weakTopicsStr = latestAttempt != null && latestAttempt.getWeakTopics() != null
                    ? String.join(", ", latestAttempt.getWeakTopics())
                    : "Relational Databases & SQL, Spring Boot";

            String prompt = String.format(
                    "You are a Senior Career Curriculum Architect. Generate a personalized 5-phase learning roadmap for an aspiring %s. " +
                    "Education: %s, Current Experience: %s, Diagnostic Score: %s%%, Identified Weak Topics: %s, Available Hours: %d hrs/week. " +
                    "Return strict JSON with fields: rationale (string), estimatedWeeks (int), and phases (array of phase objects with phaseNumber, title, description, estimatedWeeks, tasks array).",
                    profile.getTargetRole(),
                    profile.getEducationLevel(),
                    profile.getExperienceLevel(),
                    latestAttempt != null ? String.valueOf(latestAttempt.getScorePercentage()) : "Unassessed",
                    weakTopicsStr,
                    profile.getWeeklyHours() != null ? profile.getWeeklyHours() : 12
            );

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", Collections.singletonList(part));
            requestBody.put("contents", Collections.singletonList(content));

            // Request JSON response
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("responseMimeType", "application/json");
            requestBody.put("generationConfig", generationConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "aistudio-build");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.info("Successfully received response from Gemini API for user roadmap generation.");
                // Parse and format into PersonalizedRoadmapDto
            }
        } catch (Exception e) {
            log.warn("Gemini API execution failed: {}. Falling back to rule-based roadmap.", e.getMessage());
        }

        return Optional.empty();
    }
}
