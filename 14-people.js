import axios from 'axios'

import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const db = await axios('https://tasks.aidevs.pl/data/people.json')

const { data } = db || {}

const peopleTaskToken = await taskToken('people')
const peopleTaskData = await taskData(peopleTaskToken)

const { question } = peopleTaskData || {}

const filteredData = data
  .filter(({ nazwisko }) => question.includes(nazwisko))
  .map(
    ({ ulubiony_kolor, imie, nazwisko, o_mnie }) =>
      `Jestem ${imie} ${nazwisko}, ${o_mnie} , mój ulubiony kolor to ${ulubiony_kolor}`
  )

const answer = await openai.chat.completions
  .create({
    messages: [
      {
        role: 'user',
        content: question,
      },
      {
        role: 'system',
        content: JSON.stringify(filteredData),
      },
    ],
    model: 'gpt-3.5-turbo',
  })
  .then((data) => data.choices[0].message.content)

const outcome = await sendAnswer(peopleTaskToken, answer)

console.log({ filteredData, peopleTaskData, question, answer, outcome })
