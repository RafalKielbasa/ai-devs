import { taskToken, taskData, sendAnswer } from './utils.js'
import { openai } from './openAI.js'
import fs from 'fs'

const whisperTaskToken = await taskToken('whisper')

const whisperTaskData = await taskData(whisperTaskToken)

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream('./audio/mateusz.mp3'),
  model: 'whisper-1',
  response_format: 'text',
})

const outcome = await sendAnswer(whisperTaskToken, transcription)
