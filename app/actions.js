import {API_ROOT, CALL_API, Schemas, Canceller} from './middleware/api'
import * as t from './constants'
import fetch from 'isomorphic-fetch'
import {push} from 'react-router-redux'
import {setCookie} from './utils'
import qs from 'query-string'

export const fetchQuestions = (filter = 'all', nextPageUrl, isNextPage = false) => ({
  [CALL_API]: {
    types: [t.QUESTIONS_REQUEST, t.QUESTIONS_SUCCESS, t.QUESTIONS_FAILURE],
    filter,
    isNextPage,
    endpoint: nextPageUrl,
    schema: Schemas.QUESTION_ARRAY
  }
})

export const postQuestion = (question) => ({
  [CALL_API]: {
    types: [t.QUESTION_SUBMIT_REQUEST, t.QUESTION_SUBMIT_SUCCESS, t.QUESTION_SUBMIT_FAILURE],
    authenticated: true,
    endpoint: 'questions',
    method: 'POST',
    body: JSON.stringify(question),
    schema: Schemas.QUESTION,
    done: dispatch => dispatch(push('/'))
  }
})

export const fetchAnswers = (endpoint) => ({
  [CALL_API]: {
    types: [t.ANSWERS_REQUEST, t.ANSWERS_SUCCESS, t.ANSWERS_FAILURE],
    endpoint,
    schema: Schemas.QUESTION
  }
})

export const fetchUser = (username) => ({
  [CALL_API]: {
    types: [t.USER_REQUEST, t.USER_SUCCESS, t.USER_FAILURE],
    endpoint: `users/${username}`,
    schema: Schemas.USER
  }
})

export const postAnswer = (question, answer) => ({
  [CALL_API]: {
    types: [t.ANSWER_SUBMIT_REQUEST, t.ANSWER_SUBMIT_SUCCESS, t.ANSWER_SUBMIT_FAILURE],
    authenticated: true,
    endpoint: question.link,
    method: 'POST',
    body: JSON.stringify(answer),
    schema: Schemas.ANSWER_ARRAY,
    done: dispatch => dispatch(fetchAnswers(question.link))
  }
})

export const updateSearchQuery = (q) => ({type: t.SEARCH, q})

export const purgeQuestions = (filter) => ({type: t.QUESTIONS_PURGE, filter})

export const resetSearchBox = () => (dispatch, getState) => {
  if (getState().q) dispatch(updateSearchQuery(''))
}
export const updateScrollPos = (scrollPosition) => ({
  type: 'UPDATE_SCROLLPOS', scrollPosition
})

const questionsFilterEP = (filter) =>
  filter === 'answered' ? 'questions?answered=1' :
  filter === 'unanswered' ? 'questions?answered=0' : 'questions'

const questionsSearchEP = (q) => q ? `questions?q=${q}` : 'questions'

export const loadQuestions = ({filter = 'all', q}, isNextPage) => {
  Canceller.cancel('stale')
  return (dispatch, getState) => {
    const endpoint = q ? questionsSearchEP(q) : questionsFilterEP(filter)

    let {nextPageUrl = endpoint, pageCount = 0} = getState().listing.questions[filter] || {}

    if (q && nextPageUrl && qs.parse(qs.extract(nextPageUrl)).q !== q)
      nextPageUrl = endpoint

    if (!q && pageCount > 0 && !isNextPage) return null

    return dispatch(fetchQuestions(filter, nextPageUrl || endpoint, isNextPage))
  }
}

export const loadAnswers = (slugId, id) => {
  return (dispatch, getState) => {
    const {timestamp} = getState().entities.questions[id] || {}
    // use cache for 1 min
    if (Date.now() - timestamp < 60000) return null

    return dispatch(fetchAnswers(`questions/${slugId}`))
  }
}

// ✄ ----------------------------------- err --------------------------------------
const timeouts = {}

export const showMessage = (message, errType) => ({type: t.SHOW_MESSAGE, message, errType})

export const dismissMessage = (message) => ({type: t.DISMISS_MESSAGE, message})

export const dismissMessages = () => ({type: t.DISMISS_MESSAGES})

export const handleError = dispatch => err => {
  dispatch(showMessage(err.message, err.type))
  clearTimeout(timeouts[err.message])
  timeouts[err.message] =
    setTimeout(_ => dispatch(dismissMessage(err.message)), 5000)
}

// ✄ ----------------------------------- auth -------------------------------------
const requestLogin = () =>
  ({type: t.LOGIN_REQUEST, isFetching: true, isLoggedIn: false})

const receiveLogin = (usertoken, username) =>
  ({type: t.LOGIN_SUCCESS, isFetching: false, isLoggedIn: true, usertoken, username})

const loginError = () =>
  ({type: t.LOGIN_FAILURE, isFetching: false, isLoggedIn: false})

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
        const {usertoken, username, exp} = json
        localStorage.setItem('usertoken', usertoken)
        setCookie('username', username, {path: '/', expires: new Date(exp * 1000)})
        return dispatch(receiveLogin(usertoken, username))
      })
      .catch(handleError(dispatch))
  }
}

export function logoutUser() {
  return dispatch => {
    dispatch({type: t.LOGOUT_REQUEST})
    localStorage.removeItem('usertoken')
    setCookie('username', '', {path: '/', expires: -1})
    dispatch({type: t.LOGOUT_SUCCESS})
  }
}
