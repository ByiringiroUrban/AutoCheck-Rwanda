# AutoCheck Rwanda - Backend API

> **Centralized Vehicle History, AI-Assisted Damage Inspection, and Multi-Point Garage Verification Engine for Rwanda**

Built with **Python 3.12+**, **FastAPI**, **PostgreSQL (Neon)**, and **Prisma ORM**.

---

## 🛠 Technology Stack

- **Framework:** FastAPI (Python 3.12+)
- **Database:** PostgreSQL (Hosted on Neon)
- **ORM / Data Client:** Prisma Client Python (`prisma-client-py`)
- **Validation & Serialization:** Pydantic v2 & `pydantic-settings`
- **Security:** Argon2 / Bcrypt Password Hashing, JWT Bearer (Access & Refresh tokens), Granular Role-Based Access Control (RBAC)
- **AI Damage Engine:** Multi-class exterior vision pipeline (Scratches, Dents, Rust, Broken Lights, Panel Deformations with bounding box localizations)
- **Testing:** Pytest, HTTPX AsyncClient, Pytest-Asyncio, Pytest-Cov

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.12+
- Node.js & npx (for Prisma CLI)

### 2. Environment Setup
Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
```

Install backend dependencies:
```bash
pip install -r requirements.txt
```

### 3. Database Configuration (.env)
Copy `.env.example` to `.env` and fill in your **Neon PostgreSQL** connection string:
```bash
cp .env.example .env
```

Example `.env`:
```env
PROJECT_NAME="AutoCheck Rwanda Backend API"
VERSION="1.0.0"
API_V1_STR="/api/v1"
ENVIRONMENT="development"
DEBUG=True

# Neon PostgreSQL Database URL
DATABASE_URL="postgresql://[user]:[password]@[neon-host]/[dbname]?sslmode=require"

# JWT Security
SECRET_KEY="your-secure-jwt-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Frontend URLs
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","https://autocheckrwanda.vercel.app"]

# Storage & AI
UPLOAD_DIR="uploads"
MAX_UPLOAD_SIZE_MB=10
AI_MODEL_VERSION="autocheck-vision-v1.0"
AI_CONFIDENCE_THRESHOLD=0.60
```

### 4. Prisma Database Push & Client Generation
Push schema to your Neon database and generate the Python client:
```bash
# Push schema to Neon
prisma db push --schema=prisma/schema.prisma

# Generate Prisma Client Python
prisma generate --schema=prisma/schema.prisma
```

### 5. Start the API Server
```bash
uvicorn app.main:app --reload --port 8000
```
Open interactive Swagger documentation at: **[http://localhost:8000/docs](http://localhost:8000/docs)**  
Alternative ReDoc documentation at: **[http://localhost:8000/redoc](http://localhost:8000/redoc)**

---

## 🧪 Running Automated Tests

Run the full automated test suite with coverage:
```bash
pytest -v
```

---

## 🏛 System Architecture & Endpoint Blueprint

### 1. Authentication & RBAC (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Create customer/owner account
- `POST /api/v1/auth/login` - Authenticate and issue JWT access & refresh tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Invalidate session
- `POST /api/v1/auth/forgot-password` - Start password reset flow
- `POST /api/v1/auth/reset-password` - Complete password reset
- `GET  /api/v1/auth/me` - Get profile & role permissions

### 2. Vehicles, Search & Plates (`/api/v1/vehicles`)
- `GET  /api/v1/vehicles/search?vin=&plate=` - Fast search by VIN or Rwanda plate (`RAA 123 A`)
- `POST /api/v1/vehicles` - Register canonical vehicle identity
- `GET  /api/v1/vehicles/{id}` - Vehicle master details
- `PATCH /api/v1/vehicles/{id}` - Update controlled vehicle fields
- `GET  /api/v1/vehicles/{id}/timeline` - Unified chronological event timeline
- `GET  /api/v1/vehicles/{id}/mileage` - Chronological odometer history & rollback warning
- `POST /api/v1/vehicles/{id}/plates` - Assign/transition Rwanda plates

### 3. Ownership Claims (`/api/v1/ownership`)
- `POST /api/v1/ownership/claims` - Submit vehicle ownership claim with evidence
- `GET  /api/v1/ownership/my-vehicles` - List claimed/verified vehicles
- `GET  /api/v1/ownership/claims/{id}` - Claim review status
- `POST /api/v1/admin/ownership/claims/{id}/approve` - Admin claim approval
- `POST /api/v1/admin/ownership/claims/{id}/reject` - Admin claim rejection

### 4. Garages & Organizations (`/api/v1/garages`)
- `POST /api/v1/garages/applications` - Onboarding application for garages/dealers
- `GET  /api/v1/garages/me` - Profile for authenticated garage member
- `GET  /api/v1/garages/staff` - List garage staff
- `POST /api/v1/garages/staff` - Invite garage mechanic/manager
- `PATCH /api/v1/garages/staff/{id}` - Update staff role/status
- `GET  /api/v1/garages/pending` - Admin approval queue
- `PATCH /api/v1/garages/{id}/status` - Admin approve/reject garage

### 5. Service & Maintenance (`/api/v1/service-records`)
- `POST /api/v1/service-records` - Record maintenance/repair event (auto-records mileage)
- `GET  /api/v1/vehicles/{id}/service-records` - Chronological repair history
- `GET  /api/v1/service-records/{id}` - Service record details and source provenance

### 6. Inspections & Checklists (`/api/v1/inspections`)
- `POST /api/v1/inspections` - Create multi-point inspection (Draft)
- `POST /api/v1/inspections/{id}/items` - Add checklist items (Engine, Brakes, Suspension, Electrical, etc.)
- `POST /api/v1/inspections/{id}/complete` - Finalize inspection
- `GET  /api/v1/vehicles/{id}/inspections` - Vehicle inspection history
- `GET  /api/v1/inspections/{id}` - Inspection findings breakdown

### 7. AI Visual Damage Analysis (`/api/v1/ai-inspections`)
- `POST /api/v1/vehicles/{id}/images` - Upload vehicle inspection photo
- `POST /api/v1/ai-inspections` - Run AI exterior damage detection pipeline
- `GET  /api/v1/ai-inspections/{id}` - Findings with confidence scores and bounding boxes
- `GET  /api/v1/vehicles/{id}/ai-inspections` - Historical damage scans
- `POST /api/v1/ai-inspections/{id}/retry` - Retry analysis

### 8. Vehicle History Reports & Scoring (`/api/v1/reports`)
- `POST /api/v1/reports` - Generate immutable vehicle history snapshot
- `GET  /api/v1/reports/{id}` - Fetch report snapshot by ID
- `GET  /api/v1/reports/my` - User report history

### 9. Disputes & Audit Logs (`/api/v1/disputes`, `/api/v1/admin`)
- `POST /api/v1/disputes` - Submit record dispute
- `GET  /api/v1/disputes/my` - User dispute history
- `GET  /api/v1/admin/disputes` - Admin dispute queue
- `PATCH /api/v1/admin/disputes/{id}` - Resolve/reject dispute
- `GET  /api/v1/admin/audit-logs` - System-wide audit log trail
- `GET  /api/v1/admin/stats` - System overview metrics
