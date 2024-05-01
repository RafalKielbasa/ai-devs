import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const rodoTaskToken = await taskToken('scraper')
const rodoTaskData = await taskData(rodoTaskToken)

console.log({ rodoTaskData })
