import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'
import axios from 'axios'

const scraperTaskToken = await taskToken('scraper')
const scraperTaskData = await taskData(scraperTaskToken)

const fetchArticle = async () =>
  await axios
    .get(scraperTaskData.input, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      },
    })
    .then(async ({ data }) => {
      const answer = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `${scraperTaskData.msg} article ### ${data} ###`,
          },
          { role: 'user', content: scraperTaskData.question },
        ],
        model: 'gpt-3.5-turbo',
      })

      return answer.choices[0].message
    })
    .catch(function (error) {
      // handle error
      console.log({ error })
      fetchArticle()
    })

const gptAnswer = await fetchArticle()

const taskAnswer = gptAnswer?.content

const output = await sendAnswer(scraperTaskToken, taskAnswer)

console.log(output)
