import axios from 'axios'

import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const currencyDb = await axios('http://api.nbp.pl/api/exchangerates/tables/A')
const countriesDb = await axios('https://restcountries.com/v3.1/all')

const systemMessage = `
Take a deep breath and focus
Pay attention to the topic the question is about.
Assign one of the following topics
###
 exchange rate, current population, general knowledge
###
Return only the topic
Example: exchange rate
`

const { data: currencyData } = currencyDb || {}
const { data: coutriesData } = countriesDb || {}

const countriesFilteredData = coutriesData.map(({ name, population }) => ({
  name: name.common,
  population,
}))

const { rates } = currencyData[0] || {}

const knowledgeTaskToken = await taskToken('knowledge')
const knowledgeTaskData = await taskData(knowledgeTaskToken)

const { question } = knowledgeTaskData || {}

const topic = await openai.chat.completions
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
    model: 'gpt-4',
  })
  .then((data) => data.choices[0].message.content)

let answer = ''

if (topic === 'general knowledge') {
  answer = await openai.chat.completions
    .create({
      messages: [
        {
          role: 'user',
          content: question,
        },
      ],
      model: 'gpt-3.5-turbo',
    })
    .then((data) => data.choices[0].message.content)
}

if (topic === 'exchange rate') {
  answer = await openai.chat.completions
    .create({
      messages: [
        {
          role: 'user',
          content: question,
        },
        {
          role: 'system',
          content: JSON.stringify(rates),
        },
      ],
      model: 'gpt-3.5-turbo',
    })
    .then((data) => data.choices[0].message.content)
}

if (topic === 'current population') {
  answer = await openai.chat.completions
    .create({
      messages: [
        {
          role: 'user',
          content: question,
        },
        {
          role: 'system',
          content: JSON.stringify(countriesFilteredData),
        },
      ],
      model: 'gpt-3.5-turbo',
    })
    .then((data) => data.choices[0].message.content)
}

const outcome = await sendAnswer(knowledgeTaskToken, answer)

console.log({ topic, question, answer, outcome })
