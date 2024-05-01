import { taskToken, sendAnswer } from './utils.js'

const functionsTaskToken = await taskToken('functions')

const functionObject = {
  name: 'addUser',
  description: 'add user based on properties',
  parameters: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'provide name of the user',
      },
      surname: {
        type: 'string',
        description: 'provide surname of the user',
      },
      year: {
        type: 'integer',
        description: 'provide user year of bith',
      },
    },
  },
}

const outcome = await sendAnswer(functionsTaskToken, functionObject)

console.log(outcome)
