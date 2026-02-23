# Quincy Permit Portal – Backend

Java 21 + Spring Boot 3 backend for the Quincy MA Inspectional Services permit portal replica.

## Requirements

- **Java 21**
- Gradle (optional; use `./gradlew` which uses the wrapper) or Maven

## Build and run

```bash
# Gradle
./gradlew build
./gradlew bootRun

# Or Maven
mvn spring-boot:run
```

Server runs at **http://localhost:8080**. API base is **http://localhost:8080/api**.

## Profiles

- **default**: H2 in-memory database, 19 permit types seeded.
- **postgres**: Set DB_* env vars and `--spring.profiles.active=postgres`.

## API

- POST/GET `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- GET `/api/permit-types`, `/api/permit-types/{id}`, `/api/permit-types/by-slug/{slug}`
- POST/GET/PATCH `/api/applications`, GET `/api/applications/staff`
- GET `/api/documents`, `/api/documents/categories`, `/api/documents/{id}/file`
- GET `/api/property-records/search?q=`

Send JWT: `Authorization: Bearer <token>`
