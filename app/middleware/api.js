import {Schema, arrayOf, normalize} from 'normalizr'
import {getPageUrl} from '../utils'
import {handleError} from '../actions'

export const API_ROOT = process.env.API_ROOT
export const CALL_API = Symbol('Call API')
export const Canceller = {cancel(reason) {}}

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

function callApi({authenticated, endpoint, schema, method, body}) {
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

  return new Promise((resolve, reject) => {
    Canceller.cancel = reason => reject(reason)

    fetch(fullUrl, fetchConf)
      .then(response =>
        response.json().then(json => ({json, response}))
      )
      .then(({json, response}) => {
        if (!response.ok) reject(json)

        const nextPageUrl = getPageUrl('next', response)
        if (json.data) json.data.timestamp = Date.now()

        resolve({
          ...normalize(json.data, schema), meta: json.meta,
          nextPageUrl, fullUrl, location: response.headers.get('location')
        })
      })
      .catch(reject)
  })
}

export default store => next => action => {
  if (typeof action[CALL_API] === 'undefined')
    return next(action)

  const {types, done, ...payload} = action[CALL_API]
  const [REQUEST, SUCCESS, ERROR] = types

  next({type: REQUEST, ...payload})

  return callApi(action[CALL_API]).then(
    response => {
      next({type: SUCCESS, response, ...payload})
      done && done(store.dispatch, response)
    },
    error => {
      if (error === 'stale') {
        console.warn(REQUEST, 'cancelled')
      } else {
        next({type: ERROR, error, ...payload})
        handleError(store.dispatch)({
          type: ERROR,
          message: error.message || 'Something bad happened'
        })
      }
    })
}
