import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const systemMessage = `
Take a deep breath and analyze the problem step by step.
Your task will be to assign the appropriate task based on the content of the message.
Rules###
You have two tools to choose from: "ToDo" and "Calendar".
Return only the correct JSON object.
For calendar tasks, return the date in the format YYYY-MM-DD.
###
Facts###
today is 2024-05-15
###
Examples###
Przypomnij mi, że mam kupić mleko
{"tool":"ToDo","desc":"Kup mleko" }
Jutro mam spotkanie z Marianem
{"tool":"Calendar","desc":"Spotkanie z Marianem","date":"2024-05-16"}
`

const toolsTaskToken = await taskToken('tools')
const toolsTaskData = await taskData(toolsTaskToken)

const { question } = toolsTaskData || {}

const answer = await openai.chat.completions
  .create({
    messages: [
      {
        role: 'user',
        content: question,
      },
      {
        role: 'system',
        content: systemMessage,
      },
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  })
  .then((data) => data.choices[0].message.content)

const output = await sendAnswer(toolsTaskToken, JSON.parse(answer))

console.log({ answer, output })
