# ShopNext

A full-stack e-commerce application with a NestJS backend and Next.js frontend.

---

## Features

---

## Deployed URLs

- **Frontend:** [https://shop-next-ashen-nine.vercel.app/products](https://shop-next-ashen-nine.vercel.app/products)
- **Backend:** [https://shopnext-production.up.railway.app/products](https://shopnext-production.up.railway.app/products)
- User registration and login (JWT, NextAuth, Google OAuth)
- Admin dashboard for product management
- Product catalog, cart, and checkout
- Orders management
- End-to-end testing with Playwright
- CI/CD with Railway (backend) and Vercel (frontend)
- PostgreSQL database
- Dockerized for local development

---

## Tech Stack

- **Backend:** NestJS, TypeORM, PostgreSQL, JWT
- **Frontend:** Next.js, NextAuth.js, React, Tailwind CSS
- **Testing:** Playwright (e2e)
- **CI/CD:** GitHub Actions, Railway, Vercel

---

## Backend (NestJS)

### Main Endpoints

| Method | Endpoint              | Description                        | Auth Required | Admin Only |
|--------|----------------------|------------------------------------|--------------|------------|
| POST   | /auth/register       | Register new user                  | No           | No         |
| POST   | /auth/login          | Login with email/password          | No           | No         |
| POST   | /auth/google         | Google OAuth login (backend JWT)   | No           | No         |
| GET    | /products            | List all products                  | No           | No         |
| GET    | /products/:id        | Get product by ID                  | No           | No         |
| POST   | /products            | Create product                     | Yes          | Yes        |
| PATCH  | /products/:id        | Update product                     | Yes          | Yes        |
| DELETE | /products/:id        | Delete product                     | Yes          | Yes        |
| GET    | /orders              | List user orders                   | Yes          | No         |
| POST   | /orders              | Create order (checkout)            | Yes          | No         |

### Admin Identification
- Admin users have `role: 'admin'` in their user record.
- Default admin credentials (created by seed script):
  - **Email:** admin@shopnext.com
  - **Password:** admin123

---

## Frontend (Next.js)

- User pages: Register, Login, Products, Cart, Checkout, Orders
- Admin pages: `/admin/products` (add/edit/delete products)
- Uses `NEXT_PUBLIC_API_URL` to connect to backend

---

## Environment Variables

### Backend
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT signing secret
- `FRONTEND_URL` — Allowed CORS origin (Vercel frontend URL)

### Frontend
- `NEXT_PUBLIC_API_URL` — Backend API base URL
- `AUTH_SECRET` — NextAuth secret

---

## Running Locally

1. Clone the repo
2. Start Postgres (or use Docker Compose)
3. In `/backend`:
   - `yarn install`
   - `yarn build`
   - `yarn seed` (optional, runs automatically on start)
   - `yarn start`
4. In `/frontend`:
   - `yarn install`
   - `yarn dev`

---

## Test Cases

### Backend
- User registration/login returns JWT
- Admin can create, update, delete products
- Non-admin cannot access admin endpoints
- Orders can be created and listed by users
- CORS allows only frontend domain

### Frontend
- Register/login flow works
- Admin can add/edit/delete products in `/admin/products`
- Cart and checkout flow works
- Orders page lists user orders

---

## CI/CD
- Backend: Deploys to Railway on push to main
- Frontend: Deploys to Vercel on push to main

---

## Authors
- Your Name (replace with your info)

---

## License
MIT
