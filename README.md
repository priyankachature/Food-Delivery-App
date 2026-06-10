# 🍜 FoodyPaws — Food Delivery App

A full-stack food delivery web app with cart management, order tracking, and an admin dashboard.

**Live Demo:** [foodypaws.onrender.com](https://your-frontend.onrender.com)

---

## Tech Stack

| | |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4, Axios, React Router v7 |
| **Backend** | Spring Boot 3.5, Spring Security 6 (JWT), Spring Data JPA |
| **Database** | PostgreSQL |
| **Deploy** | Docker, Render.com |

---

## Features

- Browse menu by category, add to cart (guest + authenticated)
- Checkout with saved delivery addresses
- Mock payment flow (Card / UPI / COD / Wallet)
- Live order status tracking (25s polling)
- Admin dashboard — manage orders, users, menu, and contact messages
- JWT auth with role-based route guards (`ROLE_USER` / `ROLE_ADMIN`)

---

## Local Setup

### Backend

```bash
cd "Food Delivery Backend"
```

Create `.env`:

```env
DB_URL=jdbc:postgresql://localhost:5432/food_delivery
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-at-least-32-characters
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

```bash
psql -U postgres -c "CREATE DATABASE food_delivery;"
mvn spring-boot:run
```

API runs at `http://localhost:8080`. Tables are auto-created; 32 menu items are seeded on first run.

### Frontend

```bash
cd my-app
npm install
npm run dev
```

App runs at `http://localhost:5173`. Set `VITE_API_URL=http://localhost:8080` in `.env.local` if needed.

---

## Key API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/api/auth/register` / `/api/auth/login` | ❌ |
| `GET` | `/api/menu` / `/api/menu/categories` | ❌ |
| `GET/POST/DELETE` | `/api/cart/**` | ✅ |
| `POST` | `/api/orders` | ✅ |
| `GET` | `/api/orders/my`, `/api/orders/{id}` | ✅ |
| `POST` | `/api/payments/initiate` / `confirm` / `place` | ✅ |
| `GET/POST/PUT/DELETE` | `/api/user/addresses` | ✅ |
| `POST` | `/api/contact` | ❌ |
| `*` | `/api/admin/**` | 👑 Admin |

---

## Deployment (Render)

**Backend** — Connect repo, select Docker environment, add all `.env` variables.  
**Database** — Create a PostgreSQL service, use the Internal URL as `DB_URL`.  
**Frontend** — Static site, build command: `npm install && npm run build`, publish dir: `dist`, set `VITE_API_URL`.

---

## Project Structure

```
├── Food Delivery Backend/   # Spring Boot API
│   ├── src/main/java/       # controllers, services, entities, security
│   ├── static/images/       # food images served at /images/**
│   └── Dockerfile
└── my-app/                  # React SPA
    ├── src/components/      # Navbar, FoodItem, OrderSummary, …
    ├── src/pages/           # Home, Menu, Cart, PlaceOrder, Payment, …
    └── src/Context/         # StoreContext (global state)
```
