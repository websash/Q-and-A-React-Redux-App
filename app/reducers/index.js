import * as t from '../constants'
import {combineReducers} from 'redux'
// import {routerReducer as routing} from 'react-router-redux'
import merge from 'lodash/merge'
import auth from './auth'
import errors from './errors'
import list from './listing'

function entities(state = {questions: {}, answers: {}}, action) {
  if (action.response && action.response.entities)
    return merge({}, state, action.response.entities)

  return state
}

const listing = combineReducers({
  questions: list({
    mapActionToKey: action => action.filter || 'all',
    types: {
      REQUEST: t.QUESTIONS_REQUEST,
      SUCCESS: t.QUESTIONS_SUCCESS,
      ERROR: t.QUESTIONS_FAILURE,
      PREPEND: t.QUESTION_SUBMIT_SUCCESS,
      PURGE: t.QUESTIONS_PURGE
    }
  }),
  answers: list({
    mapActionToKey: _ => 'all',
    types: {
      REQUEST: t.ANSWERS_REQUEST,
      SUCCESS: t.ANSWERS_SUCCESS,
      ERROR: t.ANSWERS_FAILURE,
      PREPEND: t.ANSWER_SUBMIT_SUCCESS
    }
  })
})

function scrollPosition(state = 0, action) {
  switch (action.type) {
    case t.UPDATE_SCROLLPOS:
      return action.scrollPosition
    default:
      return state
  }
}

function user(state = {}, action) {
  switch (action.type) {
    case t.USER_SUCCESS:
      return action.response
    default:
      return state
  }
}

function meta(state = {}, action) {
  switch (action.type) {
    case t.QUESTIONS_SUCCESS:
    case t.QUESTION_SUBMIT_SUCCESS:
      return {...state, [action.filter || 'all']: action.response.meta}
    case t.QUESTIONS_PURGE:
      return {...state, [action.filter || 'all']: null}
    default:
      return state
  }
}

function q(state = '', action) {
  return action.type === t.SEARCH ? action.q : state
}

export default combineReducers({
  entities, listing, q, auth, user, meta, errors, scrollPosition//, routing
})

export const getQuestionById = state => id =>
  state.entities.questions[id]

// const matchedQuestion = state => question =>
//   new RegExp(state.search, 'i').test(question.title)

export const getQuestions = state => filter => {
  const {listing: {questions}} = state
  return questions[filter] && questions[filter].ids
    .map(getQuestionById(state))/* .filter(matchedQuestion(state)) */ || []
}

export const getAnswers = state => questionId => {
  const question = getQuestionById(state)(questionId)
  const answers = state.entities.answers
  return question && question.answers &&
    question.answers.map(id => answers[id]) || []
}
