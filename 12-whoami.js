import fs from 'fs'
import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'
import axios from 'axios'
import { create } from 'domain'

const systemMessage = `
Take a deep breath and work on this problem step-by-step. 
Based on the information provided, you need to guess who the person in question is.

Rules:
- return only valid JSON object
- if you are 100% sure, the object should look like this: {"iKnow": "TAK", "person": "John Lennon"}
- if you are not 100% sure, you should return: {"iKnow": "NIE"}

Example
{"iKnow": "TAK", "person": "John Lennon"}
`

// Path to your file
const filePath = './files/whoamiContext.txt'
let requests = 0

const createAnswer = async () => {
  const whoamiTaskToken = await taskToken('whoami')
  const whoamiTaskData = await taskData(whoamiTaskToken)
  requests++

  fs.appendFile(filePath, `${whoamiTaskData.hint}\n`, (err) => {
    if (err) throw err
  })

  fs.readFile(filePath, 'utf8', async (err, contextData) => {
    if (err) {
      console.error('Error reading the file:', err)
      return
    }

    const answer = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        { role: 'user', content: JSON.stringify(contextData) },
      ],
      model: 'gpt-3.5-turbo-0125',
      response_format: { type: 'json_object' },
    })

    const dataObject = JSON.parse(answer.choices[0].message.content)

    const iKnow = dataObject.iKnow

    if (iKnow === 'NIE') {
      if (requests % 4 === 0) return setTimeout(() => createAnswer(), 4000)
      return createAnswer()
    }

    sendAnswer(whoamiTaskToken, dataObject.person)
  })
}

createAnswer()
