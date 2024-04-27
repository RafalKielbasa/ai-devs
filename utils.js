import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const apikey = process.env.API_KEY
const basicURL = process.env.BASIC_URL

export const taskToken = (taskName) =>
  axios
    .post(`${basicURL}/token/${taskName}`, { apikey })
    .then(({ data }) => {
      return data?.token
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })

export const taskData = (token) =>
  axios
    .get(`${basicURL}/task/${token}`)
    .then(({ data }) => {
      return data
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })

export const sendTaskData = (token, postData) =>
  axios
    .post(`${basicURL}/task/${token}`, postData)
    .then(({ data }) => data)
    .catch(function (error) {
      // handle error
      console.log(error)
    })

export const sendAnswer = (token, answer) =>
  axios
    .post(`${basicURL}/answer/${token}`, { answer })
    .then(({ data }) => data)
    .catch(function (error) {
      // handle error
      console.log(error)
    })
