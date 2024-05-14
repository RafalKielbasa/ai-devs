import axios from 'axios'
import { Document } from 'langchain/document'
import { v4 as uuidv4 } from 'uuid'

import { taskToken, taskData, sendAnswer } from './utils.js'
import { qdrant, embeddings } from './openAI.js'

const COLLECTION_NAME = 'articles'

// const news = await axios('https://unknow.news/archiwum_aidevs.json')

// const { data } = news || {}

const searchTaskToken = await taskToken('search')
const searchTaskData = await taskData(searchTaskToken)

console.log(searchTaskData)

const { question } = searchTaskData || {}
const queryEmbedding = await embeddings.embedQuery(question)
const result = await qdrant.getCollections()

const indexed = result.collections.find(
  (collection) => collection.name === COLLECTION_NAME
)
// Create collection if not exists
if (!indexed) {
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: 1536, distance: 'Cosine', on_disk: true },
  })
}

const collectionInfo = await qdrant.getCollection(COLLECTION_NAME)
// if (!collectionInfo.points_count) {
//   const documents = data.map(
//     ({ title, url, info }) =>
//       new Document({
//         pageContent: info,
//         metadata: {
//           content: info,
//           title,
//           url,
//           uuid: uuidv4(),
//           source: COLLECTION_NAME,
//         },
//       })
//   )

//   const points = []
//   for (const document of documents) {
//     const [embedding] = await embeddings.embedDocuments([document.pageContent])
//     points.push({
//       id: document.metadata.uuid,
//       payload: document.metadata,
//       vector: embedding,
//     })
//   }

//   await qdrant.upsert(COLLECTION_NAME, {
//     wait: true,
//     batch: {
//       ids: points.map((point) => point.id),
//       vectors: points.map((point) => point.vector),
//       payloads: points.map((point) => point.payload),
//     },
//   })
// }
const search = await qdrant.search(COLLECTION_NAME, {
  vector: queryEmbedding,
  limit: 1,
  filter: {
    must: [
      {
        key: 'source',
        match: {
          value: COLLECTION_NAME,
        },
      },
    ],
  },
})

const answer = search[0].payload.url

const outcome = sendAnswer(searchTaskToken, answer)

console.log(outcome)
