import {API_ROOT, CALL_API, Schemas} from './middleware/api'
import * as t from './constants'
import fetch from 'isomorphic-fetch'
import {push} from 'react-router-redux'

export function fetchQuestions(filter, nextPageUrl) {
  return {
    [CALL_API]: {
      types: [t.QUESTIONS_REQUEST, t.QUESTIONS_SUCCESS, t.QUESTIONS_FAILURE],
      endpoint: nextPageUrl,
      filter,
      schema: Schemas.QUESTION_ARRAY
    }
  }
}

export function loadQuestions(filter = 'all', nextPage) {
  return (dispatch, getState) => {
    const endpoint =
      filter === 'answered' ? 'questions?answered=1' :
      filter === 'unanswered' ? 'questions?answered=0' : 'questions'

    const {nextPageUrl = endpoint, pageCount = 0} =
      getState().pagination.questions[filter] || {}

    if (pageCount > 0 && !nextPage) return null // use cache

    return dispatch(fetchQuestions(filter, nextPageUrl))
  }
}

export function postQuestion(question) {
  return {
    [CALL_API]: {
      authenticated: true,
      types: [t.QUESTION_SUBMIT_REQUEST, t.QUESTION_SUBMIT_SUCCESS, t.QUESTION_SUBMIT_FAILURE],
      endpoint: 'questions',
      method: 'POST',
      body: JSON.stringify(question),
      schema: Schemas.QUESTION,
      afterAction: dispatch => dispatch(push('/'))
    }
  }
}

export function fetchAnswers(endpoint) {
  return {
    [CALL_API]: {
      types: [t.ANSWERS_REQUEST, t.ANSWERS_SUCCESS, t.ANSWERS_FAILURE],
      endpoint,
      schema: Schemas.QUESTION
    }
  }
}

export function loadAnswers(slugId, id) {
  return (dispatch, getState) => {
    const {timestamp} = getState().entities.questions[id] || {}
    // use cache for 1 min
    if (Date.now() - timestamp < 60000) return null

    return dispatch(fetchAnswers(`questions/${slugId}`))
  }
}

export function postAnswer(question, answer) {
  return {
    [CALL_API]: {
      authenticated: true,
      types: [t.ANSWER_SUBMIT_REQUEST, t.ANSWER_SUBMIT_SUCCESS, t.ANSWER_SUBMIT_FAILURE],
      endpoint: question.link,
      method: 'POST',
      body: JSON.stringify(answer),
      schema: Schemas.ANSWER_ARRAY,
      afterAction: dispatch => dispatch(fetchAnswers(question.link))
    }
  }
}

export function fetchUser(username) {
  return {
    [CALL_API]: {
      types: [t.USER_REQUEST, t.USER_SUCCESS, t.USER_FAILURE],
      endpoint: `users/${username}`,
      schema: Schemas.USER
    }
  }
}

export function updateScrollPos(scrollPosition) {
  return {type: 'UPDATE_SCROLLPOS', scrollPosition}
}

// ==================================== err ======================================
const timeouts = {}

export function showMessage(message, errType) {
  return {type: t.SHOW_MESSAGE, message, errType}
}

export function dismissMessage(message) {
  return {type: t.DISMISS_MESSAGE, message}
}

export function dismissMessages() {
  return {type: t.DISMISS_MESSAGES}
}

export const handleError = dispatch => err => {
  dispatch(showMessage(err.message, err.type))
  clearTimeout(timeouts[err.message])
  timeouts[err.message] =
    setTimeout(_ => dispatch(dismissMessage(err.message)), 5000)
}

// ==================================== auth =====================================

function requestLogin() {
  return {type: t.LOGIN_REQUEST, isFetching: true, isAuthenticated: false}
}

function receiveLogin(usertoken, username) {
  return {type: t.LOGIN_SUCCESS, isFetching: false, isAuthenticated: true,
    usertoken, username}
}

function loginError() {
  return {type: t.LOGIN_FAILURE, isFetching: false, isAuthenticated: false}
}

export function loginUser(creds) {
  const config = {
    method: 'POST',
    body: JSON.stringify(creds)
  }

  return dispatch => {
    dispatch(requestLogin())

    return fetch(`${API_ROOT}auth`, config)
      .then(response =>
        response.json().then(json => ({json, response}))
      )
      .then(({json, response}) => {
        if (!response.ok) {
          dispatch(loginError(response.status))
          return Promise.reject(json)
        }
        localStorage.setItem('usertoken', json.usertoken)
        localStorage.setItem('username', json.username)
        return dispatch(receiveLogin(json.usertoken, json.username))
      })
      .catch(handleError(dispatch))
  }
}

export function logoutUser() {
  return dispatch => {
    dispatch({type: t.LOGOUT_REQUEST})
    localStorage.removeItem('usertoken')
    localStorage.removeItem('username')
    dispatch({type: t.LOGOUT_SUCCESS})
  }
}
