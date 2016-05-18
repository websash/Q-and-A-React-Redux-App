import * as t from '../constants'
import {getCookie} from '../utils'

export default function auth(state = {
  isFetching: false, username: getCookie('username'), isLoggedIn: !!getCookie('username')
}, action) {
  switch (action.type) {
    case t.LOGIN_REQUEST:
      return {...state, isFetching: true, isLoggedIn: false}

    case t.LOGIN_SUCCESS:
      return {...state, isFetching: false, isLoggedIn: true,
        username: action.username}

    case t.LOGIN_FAILURE:
      return {...state, isFetching: false, isLoggedIn: false}

    case t.LOGOUT_REQUEST:
      return {...state, isFetching: true, isLoggedIn: false}

    case t.LOGOUT_SUCCESS:
      return {...state, isFetching: false, isLoggedIn: false}

    default:
      return state
  }
}
