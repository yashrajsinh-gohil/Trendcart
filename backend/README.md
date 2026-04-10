# Node.js + Express + MongoDB Auth Backend

Simple, beginner-friendly backend project for:
- JWT authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Environment variables with dotenv

## Features Implemented

1. JWT Authentication
- Register and login APIs
- JWT token generated on login
- Protected routes verify JWT
- Clear errors for missing/invalid token

2. Password Hashing
- Passwords are hashed using bcryptjs in User model pre-save hook
- Plain text password is never stored

3. Role-Based Access Control (RBAC)
- User role field: `user` or `admin`
- Admin-only route: `GET /admin`
- Normal users get `403 Access denied`

4. Environment Variables
- Uses dotenv
- Variables: `PORT`, `MONGO_URI`, `JWT_SECRET`

5. MongoDB User Model
- `name`, `email`, `password`, `role`

## Required Project Structure

```text
src/
|-- config/
|   `-- database.js
|-- controllers/
|   |-- authController.js
|   `-- ...
|-- middleware/
|   |-- auth.js
|   |-- role.js
|   `-- errorHandler.js
|-- models/
|   `-- User.js
|-- routes/
|   |-- authRoutes.js
|   `-- ...
|-- scripts/
|   `-- seed.js
`-- server.js
```

## API Routes

Main routes (for Postman):
- `POST /api/register`
- `POST /api/login`
- `GET /api/profile` (protected)
- `GET /api/admin` (admin only)

Also available directly:
- `POST /register`
- `POST /login`
- `GET /profile`
- `GET /admin`

## Setup and Run

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create env (already present) or copy `.env.example` values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/trendcart_auth_demo
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

3. Start MongoDB locally.

4. Run server:

```bash
npm run dev
```

5. Seed sample users:

```bash
npm run seed
```

## Sample Data for Testing

After `npm run seed`:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

## Postman Example Requests

### 1) Register
`POST /api/register`

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "john123"
}
```

### 2) Login (JWT token generation)
`POST /api/login`

Body:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response includes token:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "data": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 3) Profile (Protected success)
`GET /api/profile`

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

### 4) Profile (Protected failure - missing/invalid token)
`GET /api/profile`

No Authorization header, or bad token.

Expected errors:
- `401 Access denied. Token is missing.`
- `401 Access denied. Invalid or expired token.`

### 5) Admin Route (RBAC)
`GET /api/admin`

Header:

```text
Authorization: Bearer <JWT_TOKEN>
```

Expected:
- Admin token -> `200` success
- User token -> `403 Access denied. Admin role required.`

## Verify Password is Hashed in MongoDB

Open MongoDB and inspect the `users` collection.
The `password` field will look like bcrypt hash values (example):

```text
$2a$10$...
```

You should never see plain text passwords like `admin123`.

## Helpful Screenshot Checklist

- Login response showing generated JWT token
- `GET /api/profile` success with valid token
- `GET /api/profile` failure without token
- `GET /api/admin` failure with normal user token
- `users` collection showing hashed password values
- `.env` file showing `PORT`, `MONGO_URI`, `JWT_SECRET`
