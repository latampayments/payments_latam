# Banks — LATAM Payment Intelligence

## Domain Goal

Build a database of bank payment information per country to assist forex agents in real-time calls with clients. The system must explain how to pay via card on forex platforms for specific banks in specific countries.

## Data Model (current Prisma schema)

```
User → Country → Bank → Payment → Steps
               ↓
            Permission/Role (RBAC)
```

### Entities

| Model | Purpose |
|---|---|
| `Country` | Groups banks by country (BR, MX, CO, AR, CL, PE, etc.) |
| `Bank` | One bank per country entry, with logo |
| `Payment` | A payment method/type for a bank (e.g. Visa credit, PIX, etc.) |
| `Steps` | Step-by-step instructions for that payment (pics + text) |

### Known Issue

`Steps` uses flat columns (`st1_pic`, `st1_text`..`st6_text`) — max 6 steps hardcoded. Should be refactored to a proper `Step[]` relation for flexibility.

## Research Approach

### YouTube Research Pipeline
1. Search YouTube for `"[bank name] [country] forex pagamento cartão"` or in English
2. Download/read transcript (YouTube auto-captions or `yt-dlp --write-auto-subs`)
3. Extract key points with timestamps (minutes where relevant info appears)
4. Store metadata: video URL, title, channel, publish date, relevant timestamps
5. Tag by: country, bank name, payment type, card type (Visa/MC/Amex)

### Database Population per Bank
For each bank entry, collect:
- Available card types (Visa, Mastercard, Amex, Elo, Hipercard, etc.)
- Best PSP (payment processor) for that bank/country combination
- Transaction limits (daily, per transaction, international)
- 3DS behavior (does the bank require OTP? SMS? App approval?)
- Common decline reasons and how to resolve them
- Step-by-step deposit instructions (screenshots + text)

## LATAM Countries Priority

| Country | Currency | Key Banks |
|---|---|---|
| Brazil | BRL | Itaú, Bradesco, Santander BR, Nubank, C6, BB, Caixa, Inter |
| Mexico | MXN | BBVA MX, Santander MX, Banamex, Banorte, HSBC MX |
| Colombia | COP | Bancolombia, Davivienda, Banco de Bogotá, Nequi |
| Argentina | ARS | Galicia, Santander AR, BBVA AR, Mercado Pago |
| Chile | CLP | BancoChile, Santander CL, BCI, Falabella |
| Peru | PEN | BCP, Interbank, BBVA PE, Scotiabank PE |

## PSP Knowledge

A PSP (Payment Service Provider) is the intermediary that processes the transaction between the forex platform and the bank.

Key factors when choosing PSP per bank:
- **BIN routing**: PSP must have good routing for that bank's BINs
- **3DS support**: Must support 3DS2 for card-not-present
- **Local acquiring**: Local PSPs (e.g. PagSeguro, Cielo for BR) have higher approval rates
- **Fallback cascade**: Primary PSP + fallback PSP for retries

Common PSPs in LATAM:
- Brazil: Adyen, Stripe, PagSeguro, Getnet, Rede, Cielo
- Mexico: Conekta, OpenPay, Clip, Mercado Pago MX
- Pan-LATAM: dLocal, EBANX, Paymentez, Kushki

## Agent Assistant Rules

1. **Never hallucinate** — if info for a bank is not in the database, say "I don't have information for this bank yet"
2. **Always cite source** — video URL + timestamp, or data entry date
3. **Keep answers short** — agent is on a live call, needs quick answers
4. **Focus on actionable steps** — which card, which PSP, what limits, step by step

## Response Format (for agent queries)

```
Bank: [Name] | Country: [BR]
Card types: Visa ✓, MC ✓, Amex ✗, Elo ✓
Best PSP: dLocal (approval ~82%)
Limits: $500/day international | $200/transaction
3DS: SMS OTP required
Steps: [link to step-by-step]
Source: [YouTube URL @ 2:34]
```

## Future: AI Model Training

- Collect transcripts tagged by (country, bank, payment_type, card_type)
- Store as structured JSONL for fine-tuning
- Use RAG (retrieval-augmented generation) over the bank knowledge base
- Model must respond only from stored facts, never from training data alone
