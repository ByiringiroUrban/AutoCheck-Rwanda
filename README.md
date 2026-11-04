# AutoCheck Rwanda

**AutoCheck Rwanda** is an end-to-end vehicle history and verification platform tailored for the Rwandan and East African automotive market. It provides trusted vehicle data, inspection records, mileage tracking, ownership verification, and AI-assisted damage checks to create trust and transparency between car buyers, sellers, garages, and dealerships.

---

## 🚀 How the Project Works (Step-by-Step)

The platform connects car buyers, car owners, automotive service centers, dealerships, and administrators into an integrated workflow:

```
[ Car Buyer / Owner ] ──( Search Plate / VIN )──> [ AutoCheck Platform ]
                                                          │
   ┌───────────────────────┬──────────────────────────────┼──────────────────────────────┐
   ▼                       ▼                              ▼                              ▼
1. Search & Query     2. Verification & History      3. Inspections & AI Check     4. Reports & Disputes
• VIN or Rwanda Plate  • Timeline of ownership        • Garage physical inspection   • Instant verifiable PDF/web
• Instant validation   • Mileage consistency checks   • AI photo damage assessment   • Dispute inaccuracies
```

### 1. Search & Identification
- **Input:** Users enter either a **VIN (17 characters)** or a **Rwanda License Plate Number** (e.g., `RAC 123A`) directly on the homepage.
- **Validation:** Client- and server-side validators format and check the validity of plate/VIN inputs.
- **Lookup:** Queries the backend registry database to locate the vehicle's unique profile.

### 2. History & Registry Verification
- **Ownership Timeline:** Tracks historical title changes, dates, and ownership records.
- **Mileage Trajectory:** Aggregates mileage entries across service visits to detect odometer rollback or inconsistencies.
- **Vehicle Specifications:** Displays make, model, year, body type, fuel type, transmission, and color.

### 3. Inspection & Servicing
- **Certified Garage Network:** Partner garages log routine service records (oil changes, repairs, brake checks) and formal vehicle inspections.
- **AI-Powered Damage & Assessment:** Garages and inspectors upload photos of vehicle sides/angles; AI models analyze exterior damage, scratches, dents, and body condition.
- **Itemized Checklist:** Standard inspection items (engine, transmission, brakes, suspension, electrical) are graded by severity.

### 4. Report Generation & Dispute Handling
- **Instant Vehicle History Report:** Users generate an official AutoCheck report providing an overall score, risk factors, mileage chart, and full chronological timeline.
- **Dispute Resolution:** Vehicle owners can lodge claims with supporting evidence if an inaccurate service record or mileage is listed; platform admins review and resolve disputes.

---

## 🔑 Demo & Presentation Testing Data

Use these seeded accounts and sample vehicles when demonstrating or testing the platform.

### Seeded User Accounts
> **Default Password for all accounts:** `Password123!`

| Persona / Role | Role Enum | Email | Password | What to Showcase |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | `ADMIN` | `admin@autocheck.rw` | `Password123!` | Audit logs, platform metrics, dispute resolution, garage approval. |
| **Garage Manager** | `GARAGE_MANAGER` | `garage@kigaligarage.rw` | `Password123!` | Garage staff roster, inventory, service logs. |
| **Mechanic / Inspector** | `GARAGE_STAFF` | `mechanic@kigaligarage.rw` | `Password123!` | Conducting multi-point checklists, logging service records. |
| **Car Dealership** | `DEALER` | `dealer@kigalicarhub.rw` | `Password123!` | Dealership inventory, sharing reports with potential buyers. |
| **Car Owner / Buyer** | `OWNER` | `owner@gmail.com` | `Password123!` | Searching vehicles, viewing claimed cars, lodging disputes. |

---

### Demo Vehicles to Search

Search using either the **Rwanda Plate Number** or the **VIN** on the homepage search bar:

#### 1. 🟢 The Clean Showcase Car (High Trust Score ~90+)
* **Rwanda Plate:** `RAC 123A`
* **VIN:** `JT3HP10V277019284`
* **Vehicle:** 2020 Toyota RAV4 Limited 4WD (Silver Metallic)
* **What it demonstrates:**
  * Clean title and verified ownership history.
  * Consistently serviced at *Kigali Premier Auto Service*.
  * Upward verified mileage curve (32,000 km → 45,000 km → 52,100 km).
  * Completed 150-point inspection with passing condition on engine, brakes, and electrical.

#### 2. 🔴 The Warning / Tampered Car (Protects Buyer from Fraud)
* **Rwanda Plate:** `RAD 456B`
* **VIN:** `AHTFR22G908123456`
* **Vehicle:** 2018 Toyota Hilux Double Cab D-4D (White)
* **What it demonstrates:**
  * **Odometer Rollback Warning:** Prior record shows 140,000 km, followed by a manipulated drop to 85,000 km.
  * **Accident Record:** Reported collision damage at Nyabugogo intersection with insurance/police report.
  * AutoCheck caution score (~50-60/100) protecting buyers from overpaying.

#### 3. 🔵 The Freshly Inspected Car
* **Rwanda Plate:** `RAE 789C`
* **VIN:** `KM8J33A48LU112233`
* **Vehicle:** 2021 Hyundai Tucson GL (Dark Gray)
* **What it demonstrates:**
  * Verified current plate registration with active ownership.
  * Ideal for showing routine ownership checks and clean inspection status.

---

### How to Seed or Reset Demo Data
Run the seed script from the `backend/` directory whenever you need fresh test data:
```bash
cd backend
python seed.py
```

---

## 🎯 Target Users & Pitch Personas

Use these key customer personas and use cases when pitching AutoCheck Rwanda to investors, partners, and clients:

### 1. The Used Car Buyer (Primary B2C)
* **Who they are:** Individuals looking to buy a pre-owned vehicle in Kigali or across Rwanda through marketplaces, peer-to-peer sales, or roadside dealers.
* **Pain Point:** Fear of buying flood-damaged, accident-concealed cars or vehicles with rolled-back odometers.
* **Pitch Angle:** *"Don't risk millions of RWF on hidden problems. Search the Rwanda plate or VIN to get instant, verified accident, ownership, and mileage history before paying a single franc."*

### 2. Certified Garages & Service Centers (B2B Partner)
* **Who they are:** Auto repair shops, authorized mechanics, and vehicle inspection centers.
* **Pain Point:** Lack of digital record-keeping and lack of client retention tools.
* **Pitch Angle:** *"Digitize your repair orders and inspections. Joining the AutoCheck network validates your inspection stamp, builds customer trust, and drives repeat service clients to your garage."*

### 3. Car Dealerships & Importers (B2B Commercial)
* **Who they are:** Independent car dealerships, second-hand car lots, and vehicle importers bringing cars from Japan, Europe, or Dubai.
* **Pain Point:** High skepticism from buyers; long sales cycles due to trust deficits.
* **Pitch Angle:** *"Accelerate inventory turnover. Provide AutoCheck reports upfront to verify clean histories, justify your price points, and close deals faster with certified vehicle transparency."*

### 4. Banks, Auto Lenders & Insurers (Institutional / Enterprise)
* **Who they are:** Financial institutions issuing car loans and insurance firms writing comprehensive auto policies.
* **Pain Point:** Valuation fraud, phantom assets, underwriting high-risk uninspected vehicles, and fraudulent claims.
* **Pitch Angle:** *"Underwrite auto financing and insurance policies with real data. Mitigate collateral risk with verifiable ownership, authentic mileage logs, and certified inspection reports."*

### 5. Fleet Operators & Ride-Hailing Companies (B2B Fleet)
* **Who they are:** Taxi associations, ride-hailing services (e.g., Yego, Move), logistics operators, and car rental agencies.
* **Pain Point:** Tracking vehicle condition, routine maintenance history, and resale value across multi-vehicle fleets.
* **Pitch Angle:** *"Centralize your entire vehicle lifecycle. Maintain certified records for maintenance compliance and maximize fleet resale value when it's time to upgrade."*

---

## 🛠️ Tech Stack & Getting Started

### Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** FastAPI (Python 3.12+), PostgreSQL (Neon), Prisma ORM
- **Security:** JWT Auth, Argon2/Bcrypt, Role-Based Access Control (RBAC)
- **AI & Storage:** Vision defect detection, Cloudinary image hosting

### Running the Frontend

```bash
# Install dependencies
npm install

# Run frontend development server
npm run dev
```

### Running the Backend

```bash
cd backend

# Activate virtual environment
.\venv\Scripts\activate   # Windows

# Seed testing data
python seed.py

# Run backend API
python -m uvicorn app.main:app --reload --port 8000
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
