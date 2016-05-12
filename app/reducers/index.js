import * as t from '../constants'
import {combineReducers} from 'redux'
import merge from 'lodash/merge'
import {routerReducer} from 'react-router-redux'
import auth from './auth'
import errors from './errors'
import paginate from './paginate'

function entities(state = {questions: {}, answers: {}}, action) {
  if (action.response && action.response.entities)
    return merge({}, state, action.response.entities)

  return state
}

const pagination = combineReducers({
  questions: paginate({
    mapActionToKey: action => action.filter || 'all',
    types: [
      t.QUESTIONS_REQUEST, t.QUESTIONS_SUCCESS, t.QUESTIONS_FAILURE,
      t.QUESTION_SUBMIT_SUCCESS
    ]
  }),
  answers: paginate({
    mapActionToKey: _ => 'all',
    types: [
      t.ANSWERS_REQUEST, t.ANSWERS_SUCCESS, t.ANSWERS_FAILURE,
      t.ANSWER_SUBMIT_SUCCESS
    ]
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
    default:
      return state
  }
}

export default combineReducers({
  entities, pagination, auth, user, meta, errors, scrollPosition, routing: routerReducer
})

export const getQuestion = (state, id) => state.entities.questions[id]

export const getAnswers = (state, questionId) => {
  const question = getQuestion(state, questionId)
  const answers = state.entities.answers
  return question && question.answers &&
    question.answers.map(id => answers[id]) || []
}
