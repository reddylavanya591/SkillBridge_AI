package com.skillbridge.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${skillbridge.firebase.service-account-path:config/firebase-service-account.json}")
    private String serviceAccountPath;

    @PostConstruct
    public void initFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        try {
            InputStream serviceAccount = null;
            File file = new File(serviceAccountPath);
            if (file.exists()) {
                serviceAccount = new FileInputStream(file);
            } else {
                serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");
            }

            if (serviceAccount != null) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                log.info("Firebase Admin SDK successfully initialized from service account credentials.");
            } else {
                log.info("Firebase service account credentials not found at {}. Using dev fallback tokens for local development.", serviceAccountPath);
            }
        } catch (Exception e) {
            log.warn("Could not initialize Firebase Admin SDK: {}. Dev fallback mode will be active.", e.getMessage());
        }
    }
}
