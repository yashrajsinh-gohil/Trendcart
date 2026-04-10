
# TrendCart: Full-Stack E-Commerce Platform

TrendCart is a full-stack e-commerce project built for academic submission, with a React + Vite frontend and a Node.js + Express + MongoDB backend.

The project includes authentication, role-based access control, product/category management, and order workflows through REST APIs.

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Bootstrap
- Tailwind CSS
- ESLint

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- dotenv
- nodemon

## Features

### Authentication

- User registration and login
- JWT token generation and verification
- Protected profile route

### RBAC (Role-Based Access Control)

- User roles: `user`, `admin`
- Admin-only route and admin-protected APIs

### Products and Categories

- Product listing and product details
- Filter/search support on product APIs
- Admin CRUD for products and categories

### Orders

- Create order (authenticated user)
- View user orders
- Admin order listing
- Admin order status update
- Order cancellation support with stock restoration

## Installation and Setup

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB (local instance or MongoDB URI)

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd Trendcart
```

### Step 2: Configure Environment Variables

Create environment files from examples.

Root frontend env:

```bash
copy .env.example .env
```

Backend env:

```bash
copy backend\.env.example backend\.env
```

### Step 3: Install Dependencies

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
cd ..
```

### Step 4: Run Development Server

Run frontend + backend together:

```bash
npm run dev
```

Or run separately:

```bash
npm run dev:frontend
npm run dev:backend
```

Frontend default URL: http://localhost:5173

## Environment Variables

### Root (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/trendcart_auth_demo
JWT_SECRET=replace_with_a_strong_secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints Overview

Base URL (development): `http://localhost:5000/api`

### Auth

- POST `/register`
- POST `/login`
- GET `/profile` (protected)
- GET `/admin` (admin only)

### Users

- PUT `/users/profile` (protected)
- GET `/users` (admin only)
- GET `/users/:id` (admin only)
- DELETE `/users/:id` (admin only)

### Categories

- GET `/categories`
- GET `/categories/:id`
- POST `/categories` (admin only)
- PUT `/categories/:id` (admin only)
- DELETE `/categories/:id` (admin only)

### Products

- GET `/products`
- GET `/products/category/:categoryId`
- GET `/products/:id`
- POST `/products` (admin only)
- PUT `/products/:id` (admin only)
- DELETE `/products/:id` (admin only)

### Orders

- POST `/orders` (protected)
- GET `/orders/user/my-orders` (protected)
- GET `/orders/:id` (protected)
- DELETE `/orders/:id` (protected)
- GET `/orders` (admin only)
- PUT `/orders/:id/status` (admin only)

### Health

- GET `/health`

## Screenshots

Add screenshots before final submission.

- Home page screenshot: `docs/screenshots/home.png`
- Product listing screenshot: `docs/screenshots/products.png`
- Cart screenshot: `docs/screenshots/cart.png`
- Login/Register screenshot: `docs/screenshots/auth.png`
- Admin dashboard screenshot: `docs/screenshots/admin-dashboard.png`
- API/Postman screenshot: `docs/screenshots/api-testing.png`

## Deployment Links

Add final deployed links here.

- Frontend: `<frontend-deployment-link>`
- Backend API: `<backend-deployment-link>`
- API documentation / Postman collection (optional): `<docs-link>`

## Scripts

### Root

- `npm run dev` - run frontend and backend concurrently
- `npm run dev:frontend` - run Vite frontend only
- `npm run dev:backend` - run backend only
- `npm run build` - build frontend
- `npm run preview` - preview frontend build
- `npm run lint` - run ESLint

### Backend

- `npm run dev --prefix backend` - run backend with nodemon
- `npm run start --prefix backend` - run backend in start mode
- `npm run seed --prefix backend` - seed database data

## License

MIT
