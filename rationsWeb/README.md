# rationsweb (Customer-Facing Website)

Independent web app for customers: browsing menu, cart, checkout, community, and public auth. Communicates with the Platform API via environment-configured base URL.

## Run
```bash
npm install
npm run dev
```

## Environment
- Copy `.env.example` to `.env`
- `VITE_PLATFORM_API_URL` points to the Platform server (e.g., `http://localhost:6000/api`)

## API Boundary
- All data requests go through `src/services/platformApi.ts` (re-export of `src/api.ts`)
- No direct imports from `/platform` or server-side code

