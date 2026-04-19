/**
 * Bridge script — imports Whisper transcripts produced by the sibling `llm/`
 * project into the `payments_latam` RAG database.
 *
 * Reads *.json files from llm/data/transcripts/, chunks + embeds them with a
 * multilingual model (pt/es/en), writes Transcript + Chunk rows with vectors
 * into Postgres (pgvector).
 *
 * Idempotent: skips videoIds already in DB.
 *
 * Usage:
 *   npm run rag:import-llm -- \
 *     --country=BR \
 *     --bank=Itau \
 *     --llm-data-dir=../llm/data/transcripts \
 *     [--card-type=visa] \
 *     [--dry-run]
 *
 * Requirements (install in payments_latam):
 *   npm i @xenova/transformers gpt-tokenizer
 *   npm i -D tsx
 *
 * Prisma: run `npx prisma migrate dev` after adding the Transcript/Chunk models
 * (see .claude/rag/SKILL.md for schema).
 *
 * pgvector: run once in Supabase SQL editor:
 *   CREATE EXTENSION IF NOT EXISTS vector;
 *   ALTER TABLE "Chunk" ADD COLUMN IF NOT EXISTS embedding vector(384);
 *   CREATE INDEX IF NOT EXISTS chunk_embedding_idx
 *     ON "Chunk" USING hnsw (embedding vector_cosine_ops);
 */

import { PrismaClient } from '@prisma/client'
import { pipeline, env } from '@xenova/transformers'
import { encode, decode } from 'gpt-tokenizer'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, basename, extname } from 'node:path'

// Use local model cache to avoid re-downloading on every run.
env.cacheDir = './.cache/transformers'

const prisma = new PrismaClient()

// ──────────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────────

const CHUNK_TOKENS = 200
const CHUNK_OVERLAP = 40
const EMBED_MODEL = 'Xenova/multilingual-e5-small' // 384 dims, pt/es/en/…
const EMBED_DIMS = 384
const MIN_CHUNK_CHARS = 40 // skip tiny chunks (junk)

// ──────────────────────────────────────────────────────────────────────────────
// CLI args
// ──────────────────────────────────────────────────────────────────────────────

type Args = {
  country: string
  bank: string
  llmDataDir: string
  cardType?: string
  dryRun: boolean
}

function parseArgs(): Args {
  const raw = process.argv.slice(2)
  const get = (flag: string): string | undefined => {
    const hit = raw.find(a => a.startsWith(`--${flag}=`))
    return hit ? hit.slice(flag.length + 3) : undefined
  }
  const country = get('country')
  const bank = get('bank')
  const llmDataDir = get('llm-data-dir') ?? '../llm/data/transcripts'
  const cardType = get('card-type')
  const dryRun = raw.includes('--dry-run')

  if (!country || !bank) {
    console.error('Missing required flags. Usage:')
    console.error('  npm run rag:import-llm -- --country=BR --bank=Itau [--llm-data-dir=PATH] [--card-type=visa] [--dry-run]')
    process.exit(1)
  }
  return { country, bank, llmDataDir, cardType, dryRun }
}

// ──────────────────────────────────────────────────────────────────────────────
// Transcript JSON shape (from `llm/` Whisper output)
// ──────────────────────────────────────────────────────────────────────────────

type WhisperSegment = { start: number; end: number; text: string }
type WhisperOutput = {
  text?: string
  segments?: WhisperSegment[]
  language?: string
}

type TranscriptMeta = {
  videoId: string
  url: string
  title: string
  channel: string
  publishedAt?: string
  durationSec?: number
  language?: string
}

/** Best-effort metadata extraction. */
function readTranscript(filePath: string): { whisper: WhisperOutput; meta: TranscriptMeta } | null {
  const raw = JSON.parse(readFileSync(filePath, 'utf8'))
  const fileBase = basename(filePath, extname(filePath))

  // Whisper CLI dumps this shape; llm/ may wrap it — handle both.
  const whisper: WhisperOutput =
    raw.segments ? raw
    : raw.transcript ? raw.transcript
    : raw.whisper ?? raw

  if (!whisper.segments || !Array.isArray(whisper.segments)) {
    console.warn(`  ⚠ ${fileBase}: no segments[] — skipping`)
    return null
  }

  // Try to find metadata from sibling .meta.json, or infer from filename.
  const metaPath = filePath.replace(/\.json$/, '.meta.json')
  const sidecar = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {}

  // YouTube IDs are 11 chars — extract from filename if present.
  const idMatch = fileBase.match(/([A-Za-z0-9_-]{11})/)
  const videoId: string = raw.videoId ?? raw.video_id ?? sidecar.videoId ?? idMatch?.[1] ?? fileBase

  const meta: TranscriptMeta = {
    videoId,
    url: raw.url ?? sidecar.url ?? `https://youtube.com/watch?v=${videoId}`,
    title: raw.title ?? sidecar.title ?? fileBase,
    channel: raw.channel ?? sidecar.channel ?? 'unknown',
    publishedAt: raw.publishedAt ?? sidecar.publishedAt,
    durationSec: Math.round(whisper.segments[whisper.segments.length - 1]?.end ?? 0),
    language: whisper.language ?? raw.language ?? sidecar.language ?? 'pt',
  }

  return { whisper, meta }
}

// ──────────────────────────────────────────────────────────────────────────────
// Chunking — token-based with overlap, preserves timestamps
// ──────────────────────────────────────────────────────────────────────────────

type BuiltChunk = {
  idx: number
  text: string
  tokenCount: number
  startSec: number
  endSec: number
}

function buildChunks(segments: WhisperSegment[]): BuiltChunk[] {
  // Flatten to token stream, remembering each token's source segment index.
  const tokens: number[] = []
  const tokenSegIdx: number[] = []
  segments.forEach((seg, segIdx) => {
    const segTokens = encode(seg.text.trim() + ' ')
    segTokens.forEach(t => {
      tokens.push(t)
      tokenSegIdx.push(segIdx)
    })
  })

  const chunks: BuiltChunk[] = []
  let idx = 0
  for (let i = 0; i < tokens.length; i += CHUNK_TOKENS - CHUNK_OVERLAP) {
    const sliceTokens = tokens.slice(i, i + CHUNK_TOKENS)
    const sliceSegIdx = tokenSegIdx.slice(i, i + CHUNK_TOKENS)
    const text = decode(sliceTokens).trim()
    if (text.length < MIN_CHUNK_CHARS) continue

    const firstSeg = segments[sliceSegIdx[0]]
    const lastSeg = segments[sliceSegIdx[sliceSegIdx.length - 1]]
    chunks.push({
      idx: idx++,
      text,
      tokenCount: sliceTokens.length,
      startSec: Math.floor(firstSeg?.start ?? 0),
      endSec: Math.ceil(lastSeg?.end ?? firstSeg?.end ?? 0),
    })
    if (i + CHUNK_TOKENS >= tokens.length) break
  }
  return chunks
}

// ──────────────────────────────────────────────────────────────────────────────
// Local embedding — multilingual-e5-small via transformers.js
// ──────────────────────────────────────────────────────────────────────────────

let _embedder: any = null
async function getEmbedder() {
  if (_embedder) return _embedder
  console.log(`  loading embedding model (${EMBED_MODEL})... (first run downloads ~100MB)`)
  _embedder = await pipeline('feature-extraction', EMBED_MODEL)
  return _embedder
}

async function embed(text: string, kind: 'passage' | 'query' = 'passage'): Promise<number[]> {
  // e5 convention: prefix text to tell the model what it is.
  const prefixed = `${kind}: ${text}`
  const embedder = await getEmbedder()
  const output = await embedder(prefixed, { pooling: 'mean', normalize: true })
  const vec = Array.from(output.data as Float32Array)
  if (vec.length !== EMBED_DIMS) {
    throw new Error(`Embedding dim mismatch: got ${vec.length}, expected ${EMBED_DIMS}`)
  }
  return vec
}

// ──────────────────────────────────────────────────────────────────────────────
// Postgres write — uses pgvector
// ──────────────────────────────────────────────────────────────────────────────

function toPgVectorLiteral(vec: number[]): string {
  // pgvector accepts the string form: "[0.1,0.2,...]"
  return '[' + vec.join(',') + ']'
}

async function upsertTranscriptAndChunks(params: {
  meta: TranscriptMeta
  chunks: BuiltChunk[]
  embeddings: number[][]
  country: string
  bank: string
  cardType?: string
}) {
  const { meta, chunks, embeddings, country, bank, cardType } = params

  const transcript = await prisma.transcript.upsert({
    where: { videoId: meta.videoId },
    update: {},
    create: {
      videoId: meta.videoId,
      url: meta.url,
      title: meta.title,
      channel: meta.channel,
      publishedAt: meta.publishedAt ? new Date(meta.publishedAt) : new Date(),
      language: meta.language ?? 'pt',
      rawText: chunks.map(c => c.text).join(' '),
      durationSec: meta.durationSec ?? 0,
      country,
      bankName: bank,
      cardType: cardType ?? null,
    },
  })

  // Insert chunks one by one so we can attach the pgvector column via raw SQL.
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]
    const vec = toPgVectorLiteral(embeddings[i])

    await prisma.$executeRawUnsafe(
      `INSERT INTO "Chunk" (id, "transcriptId", idx, text, "startSec", "endSec", "tokenCount", embedding)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7::vector)
       ON CONFLICT DO NOTHING`,
      transcript.id,
      c.idx,
      c.text,
      c.startSec,
      c.endSec,
      c.tokenCount,
      vec
    )
  }

  return { transcriptId: transcript.id, chunksInserted: chunks.length }
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs()
  console.log(`\n📥 RAG import: ${args.bank} / ${args.country}`)
  console.log(`   source: ${args.llmDataDir}`)
  if (args.dryRun) console.log('   DRY RUN — no DB writes')

  if (!existsSync(args.llmDataDir)) {
    console.error(`\n❌ Transcript dir not found: ${args.llmDataDir}`)
    console.error(`   Make sure llm/ has produced transcripts first.`)
    process.exit(1)
  }

  const files = readdirSync(args.llmDataDir)
    .filter(f => f.endsWith('.json') && !f.endsWith('.meta.json'))
    .map(f => join(args.llmDataDir, f))

  console.log(`   found ${files.length} transcript file(s)\n`)
  if (files.length === 0) return

  let imported = 0
  let skipped = 0
  let totalChunks = 0

  for (const file of files) {
    const name = basename(file)
    process.stdout.write(`→ ${name} ... `)

    const parsed = readTranscript(file)
    if (!parsed) {
      skipped++
      continue
    }
    const { whisper, meta } = parsed

    // Skip if already ingested (idempotent).
    const existing = await prisma.transcript.findUnique({
      where: { videoId: meta.videoId },
      select: { id: true },
    })
    if (existing) {
      console.log(`already ingested (skip)`)
      skipped++
      continue
    }

    const chunks = buildChunks(whisper.segments!)
    if (chunks.length === 0) {
      console.log(`no valid chunks (skip)`)
      skipped++
      continue
    }

    if (args.dryRun) {
      console.log(`would embed ${chunks.length} chunks (dry run)`)
      imported++
      totalChunks += chunks.length
      continue
    }

    // Embed sequentially — e5-small is fast on CPU, batching adds complexity.
    const embeddings: number[][] = []
    for (const c of chunks) {
      embeddings.push(await embed(c.text, 'passage'))
    }

    const result = await upsertTranscriptAndChunks({
      meta,
      chunks,
      embeddings,
      country: args.country,
      bank: args.bank,
      cardType: args.cardType,
    })

    console.log(`✓ ${result.chunksInserted} chunks`)
    imported++
    totalChunks += result.chunksInserted
  }

  console.log(`\n✅ Done. imported=${imported}  skipped=${skipped}  chunks=${totalChunks}`)
}

main()
  .catch(e => {
    console.error('\n❌ Import failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
