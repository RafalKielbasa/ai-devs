import { taskToken, taskData, sendAnswer } from './utils.js'

const apiAdress = 'https://bobikenobiai.bieda.it/'

const ownapiTaskToken = await taskToken('ownapi')
const ownapiTaskData = await taskData(ownapiTaskToken)

const outcome = await sendAnswer(ownapiTaskToken, apiAdress)

console.log(ownapiTaskToken, outcome)
