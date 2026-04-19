# Payments LATAM

A real-time assistant for forex agents to help clients make card payments on forex platforms across Latin America.

## Goal

Forex agents on live calls with clients need fast, accurate answers about how to deposit using a specific bank card in a specific country. This tool provides that — no guessing, no hallucination.

If a bank is not in the database, the system says so explicitly.

## What It Does

- **Bank database by country**: for each bank, stores available card types, best PSP, transaction limits, 3DS behavior, and step-by-step deposit instructions
- **Payment intelligence**: knows which PSP (payment processor) handles each bank's BINs best, and what the common failure points are
- **YouTube research pipeline**: finds video tutorials per bank/country, extracts transcripts, stores key timestamps as the source of truth
- **Agent UI**: simple interface for the agent to query during a live call — gets an answer in seconds

## Stack

| Layer | Technology |
|---|---|
| Framework | Remix (Epic Stack) — migrating from Next.js 13 |
| Database | PostgreSQL via Prisma |
| Auth | Session-based (Epic Stack pattern) |
| Styling | Tailwind CSS + shadcn/ui |
| Payments | PayPal (for donations/subscriptions) |

## Data Model

```
Country → Bank → Payment → Steps
```

- **Country**: BR, MX, CO, AR, CL, PE, etc.
- **Bank**: e.g. Itaú, Bradesco, BBVA, Bancolombia
- **Payment**: card type + PSP + limits + relevant info
- **Steps**: step-by-step deposit instructions (text + screenshots)

## LATAM Priority

| Country | Currency | Key Banks |
|---|---|---|
| Brazil | BRL | Itaú, Bradesco, Santander, Nubank, C6 |
| Mexico | MXN | BBVA MX, Santander MX, Banamex |
| Colombia | COP | Bancolombia, Davivienda, Nequi |
| Argentina | ARS | Galicia, Santander AR, Mercado Pago |
| Chile | CLP | BancoChile, Santander CL, BCI |
| Peru | PEN | BCP, Interbank, BBVA PE |

## Research Pipeline

1. Search YouTube for `[bank] [country] forex deposit card`
2. Extract transcript + key timestamps
3. Store as structured data: country, bank, card type, PSP, limits, steps
4. Agent queries the database — never the raw model

## Rules

- **Never hallucinate** — no data = tell the agent there's no data
- **Always cite source** — YouTube URL + timestamp or manual entry date
- **Keep responses short** — agent is on a live call

## Setup

```bash
npm install
cp .env.example .env   # set DATABASE_URL and auth secrets
npx prisma migrate dev
npx prisma db seed
npm run dev
```
