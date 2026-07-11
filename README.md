# Rel's Meat Co. E-Commerce Platform

A premium, high-end online butcher store and farmer-to-consumer marketplace. This workspace is architected as a decoupled system featuring a **Spring Boot REST API** backend and a **React + TypeScript (Vite)** frontend.

---

## Technology Stack & Architecture

### Frontend (Client-side)
- **Framework**: React 18, TypeScript, Vite.
- **Styling**: Modern Vanilla CSS tailored under a high-end **Gourmet Charcoal Dark Theme** (deep slate palettes, glassmorphism, concentric bezel layouts, and spring-physics hover animations).
- **Client Routing**: State-based view controller supporting guest, buyer, and seller interfaces.
- **REST Binding**: Fetches products, registers accounts, and updates listing catalogs asynchronously.

### Backend (Server-side)
- **Framework**: Spring Boot 3, Java 17, Maven.
- **Database**: H2 Database (In-Memory for developers, auto-created schemas).
- **Security**: Spring Security 6 with stateless filter chains, handling cross-origin preflight checks (`OPTIONS`) and parsing authorization headers.
- **Authentication**: Custom JWT-style session token filter validating roles (`BUYER`, `SELLER`).
- **Data Seeding**: Automatic `CommandLineRunner` seeder that populates the catalog with four premium starter cuts on launch.

---

## Getting Started

### Prerequisites
- **Java JDK**: Version 17 or higher.
- **Node.js**: Version 18 or higher (with `npm`).
- **Build tool**: Maven (wrapper `./mvnw` is included in backend directory).

---

### 1. Running the Spring Boot Backend

1. Navigate to the backend directory:
   ```bash
   cd meatshop
   ```
2. Build the project and run the server:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The server launches on port `8080` (endpoints base: `http://localhost:8080/api`).*

3. **Auto-Seeding**: On startup, the backend automatically seeds the H2 database with:
   - *Dry-Aged Ribeye Steak* (Beef, $28.50)
   - *Berkshire Thick Pork Chops* (Pork, $18.90)
   - *Pasture-Raised Chicken Breast* (Chicken, $12.50)
   - *Wagyu Ground Beef* (Beef, $22.00)

---

### 2. Running the React Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node package dependencies:
   ```bash
   npm install
   ```
3. Launch the hot-reloading development server:
   ```bash
   npm run dev
   ```
   *The development server opens on port `5173` (`http://localhost:5173`).*

---

## Role Gating & Permissions

This application enforces clean separation between customers (buyers) and managers (farmers/sellers):

1. **Guests (Anonymous Browsers)**:
   - Allowed to explore the landing page storytelling, sourcing values, and shipping parameters.
   - Hitting any checkout or catalog directories redirects anonymous guests to the registration and login page.

2. **Buyers (`BUYER`)**:
   - Access to the **Storefront Catalog** (`shop.tsx`) to filter meat cuts by category and view prices.
   - Authorized to view product listings via `GET /api/products/all`.

3. **Sellers (`SELLER`)**:
   - Excluded from customer channels. Hitting the login redirect routes them directly to the **Seller Console Dashboard** (`seller-dashboard.tsx`).
   - Equipped with product listing CRUD operations: publishing new cuts or removing active listings.
   - Employs a custom private header separate from the main public marketplace links.

---

## Key File Structure

```
meatshop/
├── .gitignore                      <-- Root Git exclusions (node_modules, target, archives)
├── README.md                       <-- Workspace main instructions (This file)
│
├── frontend/                       <-- React Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── header.tsx          <-- Translucent header with fallback initials avatar
│   │   │   └── footer.tsx          <-- Unified footer
│   │   ├── styles/
│   │   │   ├── landing-page.css
│   │   │   ├── shop.css            <-- Concentric outer/inner double-bezels
│   │   │   └── seller-dashboard.css
│   │   ├── landing-page.tsx
│   │   ├── shop.tsx                <-- Storefront catalog (fetching backend GET /all)
│   │   ├── login.tsx               <-- Auth form with role selections & login redirects
│   │   └── seller-dashboard.tsx    <-- Back-office CRUD console
│   └── package.json
│
└── meatshop/                       <-- Spring Boot REST API
    ├── src/main/java/com/example/meatshop/
    │   ├── configs/
    │   │   ├── SecurityConfig.java  <-- Security CORS bean and endpoint matchers
    │   │   └── DataSeeder.java      <-- H2 database startup seeder
    │   ├── controllers/
    │   │   ├── ProductController.java
    │   │   └── UserController.java
    │   └── models/
    │       ├── Product.java
    │       └── User.java
    └── pom.xml
```
