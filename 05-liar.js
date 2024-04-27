import dotenv from 'dotenv'
import { taskToken, sendAnswer, sendTaskData } from './utils.js'

dotenv.config()

const liarTaskToken = await taskToken('liar')

const formData = new FormData()
formData.append('question', 'What is the capital of Poland?')

const liarAnswer = await sendTaskData(liarTaskToken, formData)

const isProperAnswer = liarAnswer.answer.includes('Warsaw') ? 'YES' : 'NO'

const outcome = await sendAnswer(liarTaskToken, isProperAnswer)

console.log({ liarAnswer, isProperAnswer, outcome })
