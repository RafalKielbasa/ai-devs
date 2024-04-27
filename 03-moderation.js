import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'

const moderationTaskToken = await taskToken('moderation')

const moderationTaskData = await taskData(moderationTaskToken)

const moderation = await openai.moderations.create({
  input: moderationTaskData?.input,
})

const moderationArray = moderation.results.map(({ flagged }) =>
  flagged ? 1 : 0
)

const outcome = await sendAnswer(moderationTaskToken, moderationArray)

console.log(outcome)
