# SkillBridge AI — Full-Stack Setup & Deployment Guide

> **Assess Skills. Find Gaps. Build the Right Roadmap.**
> A production-grade AI career readiness platform with Java 21 Spring Boot 3.x, React, TypeScript, Cloud Firestore, and Google Gemini.

---

## 1. System Requirements

- **Java**: Java 21 LTS (OpenJDK, Eclipse Temurin, or Oracle JDK)
- **Build Tool**: Apache Maven 3.9+
- **Frontend Runtime**: Node.js 18+ (Node 20+ recommended) & npm
- **Database**: Google Cloud Firestore (or local in-memory persistence)
- **AI Engine**: Google Gemini API key (via `GEMINI_API_KEY`)

---

## 2. Directory Structure

```
skillbridge-ai/
├── backend/                     # Complete Java 21 Spring Boot 3.x Project
│   ├── pom.xml                  # Maven build configuration
│   ├── src/main/java/com/skillbridge/
│   │   ├── SkillBridgeApplication.java
│   │   ├── config/              # SecurityConfig, FirebaseConfig
│   │   ├── controller/          # REST Controllers (/api/v1/...)
│   │   ├── model/               # Data Transfer Objects (DTOs)
│   │   ├── security/            # FirebaseAuthenticationFilter
│   │   └── service/             # AssessmentService, RoadmapService, GeminiService
│   ├── src/main/resources/
│   │   └── application.yml      # Port 8080 configuration
│   └── src/test/java/           # JUnit 5 integration & scoring tests
├── src/                         # React 19 + TypeScript SPA
│   ├── components/pages/        # Dashboard, Assessment, SkillGap, Roadmap, Admin
│   ├── context/AuthContext.tsx  # Persistent session and RBAC management
│   ├── data/                    # Curated starter question bank and frameworks
│   └── services/api.ts          # Unified REST API client (dual backend connector)
├── firestore.rules              # Zero-trust ABAC Firestore security rules
├── firebase-blueprint.json      # Intermediate schema definition
└── package.json                 # Frontend dependencies
```

---

## 3. Running in Development

### A. Running the React Frontend (Port 3000)

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev
```

The frontend will be accessible at `http://localhost:3000`.

### B. Running the Java Spring Boot Backend (Port 8080)

```bash
# Navigate to the backend directory
cd backend

# Compile and start with Maven
mvn clean spring-boot:run
```

The REST API will be accessible at `http://localhost:8080/api/v1`.

Verify backend health:
```bash
curl http://localhost:8080/api/v1/actuator/health
```

---

## 4. Environment Variables

### Backend Configuration (`backend/src/main/resources/application.yml` or OS Environment):

| Variable | Description | Default |
|---|---|---|
| `SERVER_PORT` | HTTP port for REST server | `8080` |
| `GEMINI_API_KEY` | Google Gemini API key for roadmap synthesis | Injected automatically in AI Studio |
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase Admin service account JSON | `config/firebase-service-account.json` |
| `SKILLBRIDGE_CORS_ALLOWED_ORIGINS` | Permitted client origins | `http://localhost:3000` |

### Frontend Configuration (`.env`):

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for Spring Boot backend | `http://localhost:8080/api/v1` |

---

## 5. Dual-Backend Architecture & Graceful Fallback

SkillBridge AI features **Dual-Backend Connector Architecture**:
1. When the Java Spring Boot backend is running on `http://localhost:8080`, all frontend requests seamlessly hit the live Spring Boot REST endpoints.
2. In browser environments (such as preview runtimes where Java is not installed), the application operates in **Standalone Browser Persistent Mode** executing the exact same REST schemas and deterministic scoring equations locally with persistent storage.
3. If the Gemini API key is absent, the system cleanly triggers its deterministic **Rule-Engine Fallback**, explicitly labeling roadmaps as rule-based rather than hallucinating AI execution.

---

## 6. REST API Endpoint Specification

### Public & Student Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/actuator/health` | Service health status |
| `GET` | `/api/v1/profile` | Retrieve student profile |
| `PUT` | `/api/v1/profile` | Update student profile |
| `GET` | `/api/v1/assessments?count=10` | Retrieve eligible assessment questions |
| `POST` | `/api/v1/assessments/attempts/submit` | Deterministically score and persist attempt |
| `GET` | `/api/v1/assessments/history` | Retrieve student attempt history |
| `GET` | `/api/v1/skills/gaps` | Calculate skill-gap analysis matrix |
| `GET` | `/api/v1/roadmaps/current` | Retrieve current student roadmap |
| `POST` | `/api/v1/roadmaps/generate` | Generate personalized roadmap (Gemini or Rule) |
| `PATCH` | `/api/v1/roadmaps/tasks/{taskId}/progress` | Update task status and hours |
| `GET` | `/api/v1/resources` | Fetch curated learning resources |
| `GET` | `/api/v1/projects` | Fetch practical projects and milestones |
| `GET` | `/api/v1/dashboard` | Fetch aggregated dashboard metrics |

### Protected Administrative Endpoints (`ROLE_ADMIN`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/questions` | List all questions including drafts |
| `POST` | `/api/v1/admin/questions` | Create new question |
| `PUT` | `/api/v1/admin/questions/{id}` | Update question, options, or explanation |
| `DELETE` | `/api/v1/admin/questions/{id}` | Delete question |
| `GET` | `/api/v1/admin/stats` | Platform aggregate performance metrics |

---

## 7. Sample API cURL Commands

### Health Check
```bash
curl -X GET http://localhost:8080/api/v1/actuator/health
```

### Submit Diagnostic Assessment
```bash
curl -X POST http://localhost:8080/api/v1/assessments/attempts/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer student@skillbridge.io" \
  -d '{
    "userId": "student@skillbridge.io",
    "questionIds": ["q-java-01", "q-oop-01", "q-sql-01"],
    "answers": {
      "q-java-01": 1,
      "q-oop-01": 1,
      "q-sql-01": 1
    },
    "timeSpentSeconds": 180,
    "maxTimeSeconds": 900
  }'
```

---

## 8. Windows & VS Code Instructions

1. **Install Java 21**: Download [Eclipse Temurin 21](https://adoptium.net/) installer for Windows. Ensure "Set JAVA_HOME variable" is selected.
2. **Install Maven**: Download Apache Maven binary zip, extract to `C:\Program Files\Maven`, and add `C:\Program Files\Maven\bin` to your System `PATH`.
3. **Open in VS Code**:
   - Install the **Extension Pack for Java** (Microsoft).
   - Install **Spring Boot Extension Pack** (VMware).
   - Open root folder in VS Code.
4. **Run Backend**: Right-click `SkillBridgeApplication.java` -> **Run Java**.
5. **Run Frontend**: Open integrated terminal (`Ctrl + ~`) and run `npm run dev`.
