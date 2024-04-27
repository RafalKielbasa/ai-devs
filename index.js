require('dotenv').config()
const axios = require('axios')
const apikey = process.env.API_KEY
const basicURL = process.env.BASIC_URL

let token = ''

const helloApi = () => {
  axios
    .post(`${basicURL}/token/helloapi`, { apikey })
    .then(function ({ data }) {
      token = data?.token
      return axios.get(`${basicURL}/task/${token}`)
    })
    .then(function ({ data }) {
      return axios.post(`${basicURL}/answer/${token}`, { answer: data?.cookie })
    })
    .then(function ({ data }) {
      console.log(data)
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })
}

helloApi()
