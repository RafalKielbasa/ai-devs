import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const systemMessage = `
Take a deep breath and focus.
Your task is to analyze the provided image.

Rules ###
If there is a character wearing a hat in the image, return the color of the hat in POLISH.
If there is no character wearing a hat in the image, return the string "error."
Stick to the given rules.
Respond concisely with one word.
###

Example###
In the image, there is a character with a red hat:
czerwony
In the image, there is no character with a hat:
error
###
`

const gnomeTaskToken = await taskToken('gnome')
const toolsTaskData = await taskData(gnomeTaskToken)

const { msg, url } = toolsTaskData || {}

const answer = await openai.chat.completions
  .create({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'What’s in this image?' },
          {
            type: 'image_url',
            image_url: {
              url,
            },
          },
        ],
      },
      {
        role: 'system',
        content: systemMessage,
      },
    ],
    model: 'gpt-4o',
  })
  .then((data) => data.choices[0].message.content)

const outcome = sendAnswer(gnomeTaskToken, answer)

console.log({ toolsTaskData, answer, outcome })
