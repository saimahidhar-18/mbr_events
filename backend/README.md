# Backend — MBR Events

Run locally:

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure `.env` from `../.env.example`

3. Initialize Prisma and run migrations

```bash
npx prisma generate
# then create migration when ready
npx prisma migrate dev --name init
```

4. Start server

```bash
npm run dev
```
