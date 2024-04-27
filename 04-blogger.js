import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const bloggerTaskToken = await taskToken('blogger')

const bloggerTaskData = await taskData(bloggerTaskToken)

const prompt = `Create very short blog post i polish without polish signs about topisc from array: ${bloggerTaskData.blog} 
  Answer schema in JSON
  Example 
  ###
  ["tekst1","tekst2","tekst3","tekst4"]
  ###
  `

const chatCompletion = await openai.chat.completions
  .create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'gpt-4',
  })
  .then((data) => data.choices[0].message.content)

const outcome = await sendAnswer(bloggerTaskToken, JSON.parse(chatCompletion))

console.log(outcome)
