# Quincy MA Permit Portal (Permit Management System)

A full-stack rebuild of the City of Quincy, Massachusetts online permitting portal: **React (Vite)** frontend and **Java (Spring Boot)** backend. This repo is the **consolidated** codebase (quincy-permit-portal merged in with higher priority).

## Features

- **19 permit types** (Building Permit, Electrical, Plumbing, Quincy Builders License, etc.)
- **Apply online**: dynamic forms per permit type, save draft or submit
- **My Applications**: list and view application status (Draft, Submitted, Under review, Approved, Rejected)
- **Staff**: list all applications and update status/notes (log in as staff)
- **Document Center**: browse documents by category, search by name
- **Property Records Search**: search by address or parcel ID
- **Auth**: register, log in (JWT); applicant and staff roles

## Tech stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Java 21, Spring Boot 3, Spring Data JPA, Spring Security, JWT (jjwt)
- **Database**: H2 (file-based) by default; PostgreSQL supported via config

## Quick start

### Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on http://localhost:8080. H2 console: http://localhost:8082 (if enabled). Data is seeded on first run (19 permit types, sample property records, staff user `staff@quincyma.gov` / `staff123`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173 and proxies `/api` to the backend.

### Using the app

1. Open http://localhost:5173
2. Register or log in
3. Go to **Permits** → pick a permit type → fill and submit (or save draft)
4. **My Applications** shows your applications; open one to submit a draft or view status
5. Staff: log in as `staff@quincyma.gov` / `staff123` and use **Staff – All Applications** to review and update status

## Project structure

```
permit-management-system/
├── backend/          # Spring Boot
│   └── src/main/java/gov/quincy/ma/permit/
│       ├── config/    # Security, JWT, DataSeeder
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── repository/
│       ├── security/  # JWT filter, JwtService
│       └── service/
├── frontend/         # Vite + React
│   └── src/
│       ├── api/       # client.js
│       ├── components/ # Layout
│       ├── context/   # AuthContext
│       ├── pages/
│       └── App.jsx
└── README.md
```

## API (overview)

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/permit-types`, `GET /api/permit-types/:id`, `GET /api/permit-types/by-slug/:slug`
- `POST /api/applications`, `GET /api/applications`, `GET /api/applications/staff`, `GET /api/applications/:id`, `PATCH /api/applications/:id`
- `GET /api/documents?category=&search=`, `GET /api/documents/categories`, `GET /api/documents/:id/file`
- `GET /api/property-records/search?q=`

## Configuration

- **Backend**: `backend/src/main/resources/application.yml` — datasource, JWT secret, upload dir. For PostgreSQL, set `spring.datasource.*` and use `spring.jpa.database-platform: org.hibernate.dialect.PostgreSQLDialect` (and switch JSON columns to `jsonb` if desired).
- **Frontend**: API is proxied to `http://localhost:8080` in `vite.config.js`; change proxy target if needed.
