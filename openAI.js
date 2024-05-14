import OpenAI from 'openai'
import dotenv from 'dotenv'
import { QdrantClient } from '@qdrant/js-client-rest'
import { OpenAIEmbeddings } from '@langchain/openai'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL })

const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 })

export { openai, qdrant, embeddings }
