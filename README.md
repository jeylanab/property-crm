# Propy: Property Management CRM (UAE)

Next.js 15 + Supabase + Tailwind + Recharts.

## Run it

```bash
npm install
cp .env.example .env.local   # add your Supabase URL and anon key
npm run dev
```

Open http://localhost:3000

## How the folders work

- `src/app`: pages only. Keep them thin.
- `src/features/<module>`: everything for one module (components, actions, queries, types).
- `src/components`: shared UI used across modules (ui, layout, dashboard).
- `src/lib`: Supabase clients, helpers, constants.
- `supabase/migrations`: SQL tables as code. `seed.sql`: demo data.

## Add a new module (example: "documents")

1. Add a line in `src/lib/constants.ts` (NAV_ITEMS)
2. Create `src/app/(dashboard)/documents/page.tsx`
3. Create `src/features/documents/{components,actions,queries,types}`

## Design tokens

All colors, radii and fonts live in `tailwind.config.ts`.
