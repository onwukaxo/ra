# Rations Food – Server

Node/Express API server for the Rations Food web app.

## Tech stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- bcrypt for password hashing
- Helmet, CORS, Morgan

## Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Create `.env` in `server/` based on `.env.example`:

```bash
cp .env.example .env
```

Set at least:

- `MONGO_URI` – e.g. `mongodb://localhost:27017`
- `MONGO_DB_NAME` – e.g. `rations_food`
- `JWT_SECRET` – a strong secret
- `PORT` – optional, defaults to `5000`

3. Start MongoDB locally (or use a remote cluster).

4. Seed demo data (admin, user, menu, posts):

```bash
npm run seed
```

5. Run the dev server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`.

## Main endpoints

- `GET /api/health` – health check.

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Users (admin only)

- `GET /api/users`

### Menu

- `GET /api/menu`
- `GET /api/menu/:id`
- `POST /api/menu` (admin)
- `PUT /api/menu/:id` (admin)
- `DELETE /api/menu/:id` (admin)

### Orders

- `POST /api/orders` (user)
- `GET /api/orders` (user)
- `GET /api/orders/all` (admin)
- `PATCH /api/orders/:id/status` (admin)

### Community

- `GET /api/community`
- `GET /api/community/:id`
- `POST /api/community` (admin)
- `PUT /api/community/:id` (admin)
- `DELETE /api/community/:id` (admin)

### Admin overview

- `GET /api/admin/overview` (admin)