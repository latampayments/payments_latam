# RAG Pipeline — Bank Payment Chatbot

## Purpose

Build a retrieval-augmented chatbot that answers "how do I pay with [bank] card on forex" using YouTube transcripts + manual bank data, **without hallucinating** and **without burning tokens**.

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  YouTube    │──┬──▶│  Transcripts │────▶│    Chunks   │
│  yt-dlp     │  │   │  (Postgres)  │      │  + vectors  │
└─────────────┘  │   └──────────────┘      │  (pgvector) │
                 │                          └──────┬──────┘
┌─────────────┐  │                                 │
│ Manual      │──┘                                 │
│ bank data   │                                    │
└─────────────┘                                    │
                                                   ▼
                            ┌──────────────────────────────┐
User question ─────embed───▶│ Top-K search (cosine sim)    │
                            └──────────┬───────────────────┘
                                       │
                     ┌─────────────────▼─────────────────┐
                     │  Classifier (Haiku, cached)       │
                     │  → route: simple | complex | none │
                     └─────────────────┬─────────────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              ▼                        ▼                        ▼
     Simple (Haiku)          Complex (Sonnet)           None (static msg)
     3 chunks + 50 tok       5 chunks + 200 tok         "No data for X"
     ~$0.0002/query          ~$0.003/query              $0
```

## Prisma schema additions

Add to `prisma/schema.prisma`:

```prisma
// Enable pgvector in Supabase: CREATE EXTENSION vector;

model Transcript {
  id          String   @id @default(cuid())
  videoId     String   @unique           // YouTube video ID
  url         String
  title       String
  channel     String
  publishedAt DateTime
  language    String                      // 'pt', 'es', 'en'
  rawText     String   @db.Text
  durationSec Int

  // Tagging for retrieval
  country     String
  bankName    String
  cardType    String?                     // 'visa' | 'mastercard' | 'amex' | null
  paymentType String?                     // 'deposit' | 'withdraw' | 'general'

  createdAt   DateTime @default(now())
  chunks      Chunk[]

  @@index([country, bankName])
}

model Chunk {
  id           String   @id @default(cuid())
  transcript   Transcript @relation(fields: [transcriptId], references: [id], onDelete: Cascade)
  transcriptId String

  idx          Int                        // order within transcript
  text         String   @db.Text
  startSec     Int                        // for "see video at 2:34"
  endSec       Int
  tokenCount   Int

  // pgvector column — 384 dims for multilingual-e5-small
  // Add manually in migration: ALTER TABLE "Chunk" ADD COLUMN embedding vector(384);
  // Then index: CREATE INDEX ON "Chunk" USING hnsw (embedding vector_cosine_ops);

  @@index([transcriptId, idx])
}

model QueryCache {
  id         String   @id @default(cuid())
  queryHash  String   @unique             // sha256(lowercased query)
  query      String
  answer     String   @db.Text
  chunkIds   String[]                     // provenance
  model      String                       // 'haiku' | 'sonnet'
  tokensIn   Int
  tokensOut  Int
  costUsd    Float
  hits       Int      @default(1)
  createdAt  DateTime @default(now())
}

model CostLedger {
  id        String   @id @default(cuid())
  date      DateTime @default(now())
  model     String
  tokensIn  Int
  tokensOut Int
  costUsd   Float
  queryType String                        // 'classify' | 'simple' | 'complex' | 'embed'

  @@index([date])
}
```

After editing schema run:
```bash
npx prisma migrate dev --name add_rag_tables
```

Then apply the pgvector bits manually in a `migration.sql`:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE "Chunk" ADD COLUMN embedding vector(384);
CREATE INDEX chunk_embedding_idx ON "Chunk" USING hnsw (embedding vector_cosine_ops);
```

## Folder structure

```
scripts/
  rag/
    ingest.ts          # YouTube URL → Transcript row
    chunk.ts           # Transcript → Chunk rows
    embed.ts           # Chunk.text → Chunk.embedding (local, free)
    retrieve.ts        # query → top-K chunks
    answer.ts          # chunks + query → LLM response
    pipeline.ts        # full flow orchestrator
  cli/
    add-video.ts       # npm run rag:add -- <youtubeUrl> <country> <bank>
    rebuild.ts         # re-embed everything if model changes
```

## Step 1 — Ingest YouTube transcript

Install:
```bash
npm i youtube-transcript
# or use yt-dlp binary for better captions:
# brew install yt-dlp  (mac) / choco install yt-dlp (win)
```

`scripts/rag/ingest.ts`:
```typescript
import { YoutubeTranscript } from 'youtube-transcript'
import { prisma } from '@/lib/db'

export async function ingestVideo(params: {
  url: string
  country: string
  bankName: string
  cardType?: string
}) {
  const videoId = extractVideoId(params.url)
  const segments = await YoutubeTranscript.fetchTranscript(videoId)
  const rawText = segments.map(s => s.text).join(' ')
  const meta = await fetchYouTubeMetadata(videoId)  // title, channel, publishedAt via oEmbed

  return prisma.transcript.upsert({
    where: { videoId },
    update: {},
    create: {
      videoId,
      url: params.url,
      title: meta.title,
      channel: meta.channel,
      publishedAt: meta.publishedAt,
      language: detectLang(rawText),
      rawText,
      durationSec: segments[segments.length - 1].offset / 1000,
      country: params.country,
      bankName: params.bankName,
      cardType: params.cardType,
    },
  })
}
```

## Step 2 — Chunk (200 tokens with 40 overlap)

Install:
```bash
npm i gpt-tokenizer
```

`scripts/rag/chunk.ts`:
```typescript
import { encode, decode } from 'gpt-tokenizer'

const CHUNK_SIZE = 200
const OVERLAP = 40

export function chunkText(text: string): Array<{text: string, tokenCount: number}> {
  const tokens = encode(text)
  const chunks = []
  for (let i = 0; i < tokens.length; i += CHUNK_SIZE - OVERLAP) {
    const slice = tokens.slice(i, i + CHUNK_SIZE)
    chunks.push({ text: decode(slice), tokenCount: slice.length })
    if (i + CHUNK_SIZE >= tokens.length) break
  }
  return chunks
}
```

Attach timestamps by walking the original transcript segments — each chunk gets `startSec` of the first segment it contains.

## Step 3 — Embed locally (free, no API)

Install:
```bash
npm i @xenova/transformers
```

`scripts/rag/embed.ts`:
```typescript
import { pipeline } from '@xenova/transformers'

let embedder: any
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small')
  }
  return embedder
}

export async function embed(text: string): Promise<number[]> {
  const model = await getEmbedder()
  const output = await model(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)  // 384 floats
}
```

Write to pgvector via raw SQL:
```typescript
await prisma.$executeRaw`
  UPDATE "Chunk" SET embedding = ${vector}::vector WHERE id = ${chunkId}
`
```

## Step 4 — Retrieve top-K

`scripts/rag/retrieve.ts`:
```typescript
export async function retrieveChunks(params: {
  query: string
  country?: string
  bankName?: string
  k?: number
}) {
  const queryVec = await embed(params.query)
  const k = params.k ?? 5

  // Pre-filter by country/bank, then vector search
  const chunks = await prisma.$queryRaw<Array<{
    id: string
    text: string
    startSec: number
    videoId: string
    title: string
    similarity: number
  }>>`
    SELECT c.id, c.text, c."startSec", t."videoId", t.title,
           1 - (c.embedding <=> ${queryVec}::vector) AS similarity
    FROM "Chunk" c
    JOIN "Transcript" t ON t.id = c."transcriptId"
    WHERE (${params.country}::text IS NULL OR t.country = ${params.country})
      AND (${params.bankName}::text IS NULL OR t."bankName" = ${params.bankName})
    ORDER BY c.embedding <=> ${queryVec}::vector
    LIMIT ${k}
  `

  // Reject if best similarity is too low → "no data"
  if (chunks[0]?.similarity < 0.55) return []
  return chunks
}
```

## Step 5 — Answer with Claude (cached system prompt)

Install:
```bash
npm i @anthropic-ai/sdk
```

`scripts/rag/answer.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

const SYSTEM_PROMPT = `You are a forex agent assistant. You help agents explain card payments.

RULES — NEVER BREAK:
1. Answer ONLY from the provided chunks. Never use general knowledge.
2. If chunks don't contain the answer, reply exactly: "I don't have data for that — check manually."
3. Keep answers under 50 words. Agents are on live calls.
4. Always cite: [source: video title @ MM:SS].
5. Never invent limits, PSPs, or step numbers.`

export async function answer(params: {
  query: string
  chunks: Array<{text: string, startSec: number, title: string}>
  complex?: boolean
}) {
  if (params.chunks.length === 0) {
    return { text: "I don't have data for that bank yet.", cached: false }
  }

  const context = params.chunks
    .map((c, i) => `[${i+1}] (${c.title} @ ${fmtTime(c.startSec)})\n${c.text}`)
    .join('\n\n')

  const model = params.complex ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'

  const response = await anthropic.messages.create({
    model,
    max_tokens: params.complex ? 300 : 120,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },  // 90% cheaper on repeat
      },
    ],
    messages: [
      { role: 'user', content: `Chunks:\n${context}\n\nQuestion: ${params.query}` },
    ],
  })

  // Log to CostLedger
  await logCost({
    model,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
    queryType: params.complex ? 'complex' : 'simple',
  })

  return { text: response.content[0].text, cached: response.usage.cache_read_input_tokens > 0 }
}
```

## Step 6 — Query cache (avoid re-asking)

`scripts/rag/pipeline.ts`:
```typescript
import crypto from 'crypto'

export async function askBot(query: string, country?: string, bankName?: string) {
  // 1. Cache lookup
  const hash = crypto.createHash('sha256')
    .update(`${query.toLowerCase()}|${country}|${bankName}`)
    .digest('hex')

  const cached = await prisma.queryCache.findUnique({ where: { queryHash: hash } })
  if (cached) {
    await prisma.queryCache.update({ where: { id: cached.id }, data: { hits: { increment: 1 } } })
    return { text: cached.answer, source: 'cache', costUsd: 0 }
  }

  // 2. Retrieve
  const chunks = await retrieveChunks({ query, country, bankName, k: 5 })

  // 3. Classify complexity (cheap — 1 Haiku call, cached system)
  const complex = await classifyComplexity(query)  // boolean

  // 4. Answer
  const { text } = await answer({ query, chunks, complex })

  // 5. Cache it
  await prisma.queryCache.create({
    data: { queryHash: hash, query, answer: text, chunkIds: chunks.map(c => c.id), model: complex ? 'sonnet' : 'haiku', tokensIn: 0, tokensOut: 0, costUsd: 0 },
  })

  return { text, source: complex ? 'sonnet' : 'haiku', chunks }
}
```

## Cost budget

Target: **under $10/month for 10k queries**.

| Query type | Share | Model | Cost/query |
|---|---|---|---|
| Cache hit | 60% | none | $0 |
| Classify + answer (simple) | 35% | Haiku 4.5 cached | ~$0.0003 |
| Complex | 5% | Sonnet 4.6 cached | ~$0.003 |

10k queries → **~$2.55/month**. Plus $0 for embeddings (local).

Log every call to `CostLedger`. Dashboard query:
```sql
SELECT date_trunc('day', date) AS day, SUM(costUsd), COUNT(*)
FROM "CostLedger"
GROUP BY 1 ORDER BY 1 DESC;
```

## Dev loop — never use Claude for dev

Install [Ollama](https://ollama.com) and run:
```bash
ollama pull llama3.1:8b
ollama pull nomic-embed-text
```

Swap Claude for Ollama via a single env flag:
```typescript
const llm = process.env.LLM_PROVIDER === 'ollama'
  ? ollamaClient
  : anthropicClient
```

All local testing = $0. Only hit Claude from staging/prod.

## CLI commands (add to package.json)

```json
"scripts": {
  "rag:add": "ts-node scripts/cli/add-video.ts",
  "rag:embed": "ts-node scripts/cli/rebuild.ts",
  "rag:ask": "ts-node scripts/cli/ask.ts"
}
```

Usage:
```bash
npm run rag:add -- "https://youtube.com/watch?v=XYZ" --country=BR --bank=Itau
npm run rag:ask -- "What's the daily limit for Itau Visa on forex?"
```

## MVP checklist — 1 bank, 1 country

- [ ] Enable pgvector in Supabase
- [ ] Run Prisma migration for `Transcript`, `Chunk`, `QueryCache`, `CostLedger`
- [ ] Ingest 10 YouTube videos about Itaú + forex deposits (Brazil)
- [ ] Chunk + embed all transcripts (local, free)
- [ ] Build 20 test questions with expected answers
- [ ] Wire `askBot()` to Haiku with cached system prompt
- [ ] Measure: answer quality (manual), cost per query, cache hit rate
- [ ] Only expand to bank #2 when #1 scores ≥ 85% on test set

## Key links

- **pgvector**: https://github.com/pgvector/pgvector
- **Supabase + pgvector guide**: https://supabase.com/docs/guides/ai
- **Transformers.js (local embeddings)**: https://huggingface.co/docs/transformers.js
- **multilingual-e5-small model card**: https://huggingface.co/intfloat/multilingual-e5-small (pt/es/en, 384 dims)
- **Claude prompt caching**: https://docs.claude.com/en/docs/build-with-claude/prompt-caching
- **Claude pricing**: https://www.anthropic.com/pricing
- **youtube-transcript (npm)**: https://www.npmjs.com/package/youtube-transcript
- **Ollama**: https://ollama.com/
- **Vercel AI SDK** (easy model swap): https://sdk.vercel.ai/docs

## Things NOT to do

- ❌ Fine-tune a model — RAG handles this better and cheaper
- ❌ Send full transcripts to Claude — always chunk
- ❌ Use OpenAI embeddings when local bge-small is free and equal quality
- ❌ Skip the query cache — 60% of agent questions repeat
- ❌ Use Sonnet by default — Haiku handles most queries well
- ❌ Forget prompt caching — it's 90% savings for basically free
- ❌ Scale to 50 banks before 1 bank works well
