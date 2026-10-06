<div align="center">

# StayNest 🏡
### Full-Stack Vacation Rental Marketplace & Relational Database System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

**StayNest** is a short-term vacation rental booking platform engineered with **Express 5**, **PostgreSQL**, and **Prisma ORM**. Designed for both travelers and property hosts, StayNest delivers consumer-grade marketplace capabilities alongside enterprise relational database guarantees—including ACID transaction isolation, automated cached-aggregate triggers, dynamic relational views, and integrity constraints.

[Features](#-key-features) • [DBMS Concepts](#-dbms-concepts-demonstrated) • [Architecture](#-system-architecture) • [Demo Accounts](#-demo-accounts-for-evaluation) • [Quick Start](#-getting-started) • [API Routes](#-api-route-matrix)

</div>

---

## 🚀 Key Features

* **Authentication & Authorization**: Secure session-based auth via Passport.js and `bcryptjs`. Role-based access control protecting host listings and guest reviews.
* **Property Discovery & Search**: Live destination search, category filtering (villas, cabins, beachfront, lofts, etc.), and price range filters with instant responsive query building.
* **Listing Management**: Complete CRUD operations for property owners with multi-image cloud uploads powered by Cloudinary and Multer.
* **Interactive Reviews & Verified Ratings**: Star ratings and feedback with photos. Average listing ratings are maintained in real time via an automated database trigger.
* **Atomic Bookings & Concurrency Protection**: Date-overlap validation and dual-write transactions (`Booking` + `Payment`) executing under `SERIALIZABLE` isolation to guarantee zero double bookings.
* **Owner Analytics Dashboard**: Dynamic host analytics querying aggregated metrics (total earnings, confirmed bookings, average rating) on demand from a PostgreSQL view.
* **User Profiles**: Manage guest profiles, upload custom avatars, and review trip receipts under "My Bookings".

---

## 🗄️ DBMS Concepts Demonstrated

StayNest was designed specifically to fulfill and demonstrate core relational database management concepts:

### 1. Relational Modeling & Normalization
* **Entities**: `User`, `Listing`, `ListingImage`, `Review`, `ReviewImage`, `Booking`, and `Payment`.
* **Referential Integrity**: Foreign keys with `ON DELETE CASCADE` (deleting a listing cascades to its images, reviews, and bookings) and `ON DELETE RESTRICT` (preventing orphan user deletions).
* **Detailed ERD Document**: Complete Chen and Crow's Foot ER diagrams, normalization notes, and relational schemas are documented in [`docs/DATABASE_ERD.md`](docs/DATABASE_ERD.md).

### 2. ACID Transactions & Serializable Isolation
Booking a listing involves writing both a `Booking` record and a `Payment` record atomically within a single `prisma.$transaction`. Under `SERIALIZABLE` isolation, concurrent attempts to reserve overlapping dates trigger collision detection, ensuring absolute transactional consistency.

```sql
-- Conceptual reservation conflict validation:
SELECT id FROM "Booking"
WHERE "listingId" = $1 AND status = 'confirmed'
  AND "checkIn" < $3 AND "checkOut" > $2;
```

### 3. Database Triggers (Cached Aggregates)
Instead of executing costly table-scan `AVG(rating)` queries every time listings are rendered, PostgreSQL recomputes and stores the `averageRating` cache automatically:
* **Trigger**: `review_rating_trigger` on the `Review` table.
* **Execution**: Fires `AFTER INSERT OR UPDATE OF rating OR DELETE`.
* **Function**: `update_listing_average_rating()` updates `Listing.averageRating` in the same database transaction.

### 4. Dynamic Relational SQL Views
Host analytics are queried dynamically from the `listing_stats` SQL view, combining joins and conditional aggregates without duplicating stored state:
```sql
CREATE VIEW listing_stats AS
SELECT
  l.id AS listing_id,
  l.title,
  COUNT(DISTINCT r.id) AS review_count,
  COALESCE(AVG(r.rating), 0) AS average_rating,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') AS confirmed_bookings,
  COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'success'), 0) AS total_revenue
FROM "Listing" l
LEFT JOIN "Review" r ON r."listingId" = l.id
LEFT JOIN "Booking" b ON b."listingId" = l.id
LEFT JOIN "Payment" p ON p."bookingId" = b.id
GROUP BY l.id, l.title;
```

### 5. Stored Procedure (`book_and_pay`)
A server-side PL/pgSQL function encapsulating date verification, UUID generation, payment settlement, and return status codes inside the PostgreSQL engine as an alternative execution path.

### 6. Relational CHECK Constraints
* `review_rating_range`: `CHECK (rating >= 1 AND rating <= 5)`
* `listing_price_nonnegative`: `CHECK (price >= 0)`
* `booking_dates_valid`: `CHECK ("checkOut" > "checkIn")`
* `booking_amount_positive`: `CHECK (amount > 0)`

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Client[Browser / Client EJS Views] -->|HTTP / Cookies| App[Express.js Server]
    
    subgraph Express Application
        App --> MW[Middleware: Auth & Joi Validation]
        MW --> Routes[Express Routers]
        Routes --> Controllers[Controllers: MVC Logic]
    end
    
    Controllers -->|Media Upload| Cloudinary[(Cloudinary Storage)]
    Controllers -->|ORM Queries & Raw SQL| PrismaClient[Prisma ORM Client]
    
    subgraph PostgreSQL Database Engine
        PrismaClient -->|Connection Pool| Postgres[(PostgreSQL Database)]
        Postgres --> Views[SQL View: listing_stats]
        Postgres --> Triggers[Trigger: review_rating_trigger]
        Postgres --> SP[Stored Procedure: book_and_pay]
        Postgres --> Checks[CHECK Integrity Constraints]
    end
```

---

## 👤 Demo Accounts for Evaluation

The database seeding script pre-populates the following accounts for immediate testing:

| Role | Email / Username | Password | Features to Test |
| :--- | :--- | :--- | :--- |
| **Guest User** | `demo@gmail.com` | `1234` | Search stays, book dates, submit reviews, view "My Bookings" |
| **Host User** | `neha.kulkarni@gmail.com` | `1234` | Create listings, edit properties, view owner revenue analytics |
| **Admin / Host** | `host.rahul@gmail.com` | `1234` | Manage owned properties, review performance metrics |

> [!TIP]
> All 50 pre-seeded user accounts use the default password: **`1234`**.

---

## 📁 Project Structure

```text
StayNest/
├── config/
│   └── cloudConfig.js          # Cloudinary SDK & Multer storage configuration
├── controllers/
│   ├── bookings.js             # Atomic booking transactions & receipt logic
│   ├── listings.js             # Listing querying, filtering & host mutations
│   ├── pages.js                # Landing page data & featured stays aggregator
│   ├── review.js               # Review creation, deletion & photo handling
│   └── users.js                # Signup, login, logout & profile management
├── docs/
│   └── DATABASE_ERD.md         # Full DBMS documentation, ERD diagrams & schema
├── middleware/
│   ├── index.js                # Authentication, ownership & validation middleware
│   └── schema.js               # Joi request body validation schemas
├── prisma/
│   ├── client.js               # Prisma Client singleton with PostgreSQL adapter
│   ├── data.js                 # Curated sample dataset for database seeding
│   ├── schema.prisma           # Relational schema definition & enum mappings
│   └── seed.js                 # Database seeder (cleans & populates DB)
├── public/
│   ├── css/                    # Modular styles (tokens, components, landing, style)
│   └── js/                     # Client scripts (gallery slider, wishlist, animations)
├── routes/
│   ├── booking.js              # Booking endpoints (/listings/:id/bookings)
│   ├── listing.js              # Property listing endpoints (/listings)
│   ├── review.js               # Review endpoints (/listings/:id/reviews)
│   └── user.js                 # Auth and profile routes (/, /login, /profile)
├── utils/
│   ├── ExpressError.js         # Custom HTTP error class
│   └── wrapAsync.js            # Asynchronous error handling wrapper
├── views/                      # EJS templates structured by feature area
├── .env.example                # Template configuration variables
├── app.js                      # Main Express server setup & middleware stack
├── package.json                # Project dependencies & npm scripts
└── prisma.config.cjs           # Prisma configuration
```

---

## ⚙️ Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **PostgreSQL**: v14.0 or higher
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/StayNest.git
cd StayNest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env
```
Update `.env` with your PostgreSQL database credentials:
```env
PORT=8080
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/staynest"
SECRET="your_custom_session_secret"

# Cloudinary (Optional: required only for new image uploads)
CLOUD_NAME="your_cloud_name"
CLOUD_API_KEY="your_api_key"
CLOUD_API_SECRET="your_api_secret"
```

### 4. Database Setup & Seeding
Push the relational schema and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

Populate the database with sample users, listings, reviews, and bookings:
```bash
npm run seed
```

### 5. Start the Server
```bash
npm start
```
Visit **`http://localhost:8080`** in your browser.

---

## 📋 API Route Matrix

| Method | Endpoint | Description | Access Control |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Landing page featuring top-rated stays | Public |
| `GET` | `/listings` | Explore listings with destination and price filters | Public |
| `GET` | `/listings/new` | Render property creation form | Logged In |
| `POST` | `/listings` | Create property with image uploads | Logged In |
| `GET` | `/listings/:id` | View listing details, reviews, and host analytics | Public |
| `GET` | `/listings/:id/edit` | Render edit listing form | Listing Owner |
| `PUT` | `/listings/:id` | Update listing details and manage photos | Listing Owner |
| `DELETE`| `/listings/:id` | Delete listing and cascade related data | Listing Owner |
| `POST` | `/listings/:id/reviews` | Submit review and star rating | Logged In |
| `DELETE`| `/listings/:id/reviews/:reviewId` | Delete personal review | Review Author |
| `GET` | `/listings/:id/bookings/new`| Render date selection and reservation form | Logged In |
| `POST` | `/listings/:id/bookings` | Execute atomic booking and payment transaction | Logged In |
| `GET` | `/bookings` | View user's confirmed reservations ("My Bookings") | Logged In |
| `GET` | `/profile` | View user account profile | Logged In |
| `PUT` | `/profile` | Update profile information and avatar | Logged In |
| `GET` | `/signup` / `POST /signup` | Register new user account | Public |
| `GET` | `/login` / `POST /login` | Authenticate and create user session | Public |
| `GET` | `/logout` | Terminate session | Logged In |

---

## 🛡️ License

This project is licensed under the [ISC License](LICENSE). Built for academic and demonstration purposes.
