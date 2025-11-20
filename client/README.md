# Rations Food – Client

This is the React frontend for the Rations Food web app.

## Tech stack

- React (Vite)
- React Router
- Tailwind CSS
- Axios

## Scripts

```bash
cd client
npm install
npm run dev
npm run build
npm run preview
```

## Structure

- `src/components` – Reusable UI components (Navbar, Footer, Button, cards, protected routes).
- `src/pages` – Page-level components (Home, Menu, Cart/Order, Orders, Community, Auth, Admin pages).
- `src/context` – `AuthContext` and `CartContext` for auth and cart state.
- `src/api/api.js` – Axios instance pointing at `/api`.

The app expects the API server to run on `http://localhost:5000` and is configured via Vite dev server proxy.