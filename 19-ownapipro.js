import { taskToken, taskData, sendAnswer } from './utils.js'

const apiAdress = 'https://bobikenobiai.bieda.it/'

const ownapiproTaskToken = await taskToken('ownapipro')
const ownapiproTaskData = await taskData(ownapiproTaskToken)

const outcome = await sendAnswer(ownapiproTaskToken, apiAdress)

console.log({ ownapiproTaskData, outcome })
