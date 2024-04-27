import { taskToken, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const input = 'Hawaiian pizza'

const answer = await openai.embeddings.create({
  model: 'text-embedding-ada-002',
  input,
})

const inpromptTaskToken = await taskToken('embedding')

const outcome = await sendAnswer(inpromptTaskToken, answer.data[0].embedding)

console.log(outcome)
