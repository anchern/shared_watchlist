# Shared Watchlist

Minimal collaborative watchlist MVP built with Next.js 14, Prisma and NextAuth.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or run `docker-compose` if you create one)
- OMDb API key from https://www.omdbapi.com/apikey.aspx

### Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations and seed:
   ```bash
   npm run prisma:migrate
   npm run seed
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

### Tests
`npm test` runs the Vitest suite. A simple test exercises the IMDb provider.

## Notes
This is a simplified MVP: it includes user auth, watchlist CRUD, item adding and a minimal search API using the OMDb service.
