# Remix Run — Epic Stack Migration & Patterns

## Context

This project was originally built with Next.js 13 but the Prisma schema already follows Epic Stack conventions (`Connection`, `Verification`, `Role`, `Permission` models). The goal is to migrate to Remix with the Epic Stack as the foundation.

## Current Stack (to migrate FROM)

| Config file | Current | Target |
|---|---|---|
| Framework | Next.js 13.4.12 | Remix 2.x |
| Auth | next-auth 4.x | remix-auth + built-in session |
| Routing | App Router (`src/app/`) | File-based routes (`app/routes/`) |
| Data fetching | SWR | Remix loaders/actions |
| CSS | Tailwind 3.3.3 | Tailwind 3.x (keep) |
| ORM | Prisma 5.2.0 | Prisma 5.x (keep, upgrade) |
| DB adapter | @next-auth/prisma-adapter | Direct Prisma in loaders |
| Form handling | react-hook-form + zod | conform + zod |

## Epic Stack Reference

- Repo: `epicweb-dev/epic-stack`
- Auth: session-based with cookie, not JWT
- Error boundaries at route level
- Progressive enhancement (works without JS)
- Singleton Prisma client in `app/utils/db.server.ts`
- `invariantResponse` for HTTP errors
- `getOptionalUser` / `requireUserId` auth helpers

## Key Remix Patterns

### Loader (read data)
```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request)
  const banks = await prisma.bank.findMany({ where: { country: { userId } } })
  return json({ banks })
}
```

### Action (write data)
```typescript
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: BankSchema })
  if (submission.status !== 'success') return json(submission.reply(), { status: 400 })
  await prisma.bank.create({ data: submission.value })
  return redirect('/banks')
}
```

### Route file structure
```
app/
  routes/
    _index.tsx              # /
    bank.$bankId.tsx        # /bank/:bankId
    country.$countryId.tsx  # /country/:countryId
    _auth+/
      sign-in.tsx
      sign-up.tsx
  utils/
    db.server.ts            # Prisma singleton
    auth.server.ts          # Session helpers
    user.server.ts          # User queries
```

## Migration Checklist

- [ ] Scaffold new Remix app: `npx create-remix@latest --template epicweb-dev/epic-stack`
- [ ] Copy and adapt `prisma/schema.prisma` (already Epic Stack compatible)
- [ ] Migrate env vars (DATABASE_URL, SESSION_SECRET, etc.)
- [ ] Replace `next-auth` with `remix-auth` or Epic Stack session cookies
- [ ] Move `src/app/` routes to `app/routes/` Remix convention
- [ ] Replace SWR with Remix loaders
- [ ] Replace react-hook-form with `conform` + zod
- [ ] Remove `next.config.js` — image domains go in `vite.config.ts` if needed
- [ ] Update `tsconfig.json` target to `ES2022` and `moduleResolution: bundler`
- [ ] Replace `@next-auth/prisma-adapter` with direct Prisma in loaders

## Key Dependencies (Remix target)

```json
{
  "@remix-run/node": "^2.x",
  "@remix-run/react": "^2.x",
  "@remix-run/serve": "^2.x",
  "@conform-to/react": "^1.x",
  "@conform-to/zod": "^1.x",
  "remix-auth": "^3.x",
  "isbot": "^4.x"
}
```

## Image Handling

In `next.config.js` there are remote image patterns (bank logos from various CDNs). In Remix, images are handled normally — no config needed unless using `<Image>` optimization. Consider using `unpic` or just `<img>` tags with explicit `width`/`height`.

## Notes

- Keep Prisma schema intact — it already models `Country → Bank → Payment → Steps` correctly.
- The `Steps` model needs refactoring: replace `st1_pic`/`st1_text`...`st6_text` with a proper `Step[]` relation.
- `Verification` and `Connection` models are used for OTP and OAuth — keep them.
