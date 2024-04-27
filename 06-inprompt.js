import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const inpromptTaskToken = await taskToken('inprompt')

const inpromptTaskData = await taskData(inpromptTaskToken)

// Regular expression to find words starting with a capital letter
const regex = /[A-ZŁ][a-zł]+/g

const name = inpromptTaskData.question.match(regex)[0]

const filteredData = inpromptTaskData.input.filter((sentence) =>
  sentence.includes(name)
)

const systemPrompt = `Answer the question based solely on the provided context.
The answer should be in Polish.

Context
###
${filteredData[0]}
###
`

const answer = await openai.chat.completions
  .create({
    messages: [
      {
        role: 'user',
        content: inpromptTaskData.question,
      },
      {
        role: 'system',
        content: systemPrompt,
      },
    ],
    model: 'gpt-4',
  })
  .then((data) => data.choices[0].message.content)

const outcome = await sendAnswer(inpromptTaskToken, JSON.stringify({ answer }))

console.log(outcome)
