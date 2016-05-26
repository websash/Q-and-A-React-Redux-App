import {Schema, arrayOf, normalize} from 'normalizr'
import {getPageUrl} from '../utils'
import {handleError} from '../actions'

export const API_ROOT = process.env.API_ROOT
export const CALL_API = Symbol('Call API')


const question = new Schema('questions')
const answer = new Schema('answers')
const user = new Schema('users')

question.define({
  answers: arrayOf(answer)
})

export const Schemas = {
  QUESTION: question,
  QUESTION_ARRAY: arrayOf(question),
  ANSWER: answer,
  ANSWER_ARRAY: arrayOf(answer),
  USER: user
}


function callApi(endpoint, schema, authenticated, method, body) {
  const fullUrl =
    (endpoint.indexOf(API_ROOT) === -1)
      ? API_ROOT + (endpoint.substr(0, 1) === '/' ? endpoint.substr(1) : endpoint)
      : endpoint

  let token
  let fetchConf = {}

  try {
    token = localStorage.getItem('usertoken') || null
  } catch (err) {}

  if (authenticated) {
    if (!token)
      return Promise.reject({message: 'You must be logged in to do this'})

    fetchConf = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      method,
      body
    }
  }

  return fetch(fullUrl, fetchConf)
    .then(response =>
      response.json().then(json => ({json, response}))
    )
    .then(({json, response}) => {
      if (!response.ok) return Promise.reject(json)

      const nextPageUrl = getPageUrl('next', response)
      if (json.data) json.data.timestamp = Date.now()

      // console.log('fetch', json.data)
      return {
        ...normalize(json.data, schema), meta: json.meta,
        nextPageUrl, fullUrl, location: response.headers.get('location')
      }
    })
}

export default store => next => action => {
  const callAPI = action[CALL_API]

  // skip mw if the action is not an API call
  if (typeof callAPI === 'undefined') return next(action)

  const {endpoint, schema, types, authenticated, method, body, filter, afterAction} = callAPI
  const [requestType, successType, errorType] = types

  next({type: requestType, filter})
  // console.log('callApi endpoint', endpoint)
  return callApi(endpoint, schema, authenticated, method, body).then(
    response => {
    // setTimeout(_ => { // network delay test
      next({response, authenticated, type: successType, filter})
      afterAction && afterAction(store.dispatch, response)
    // }, 3000) // network delay test
    },
    error => {
      const err = {
        type: errorType,
        message: error.message || 'Something bad happened'
      }
      next(err)
      handleError(store.dispatch)(err)
    })
}
