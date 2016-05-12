import * as t from '../constants'

export default function auth(state = {
  isFetching: false,
  // need a util to check if the token is expired
  isAuthenticated: !!localStorage.getItem('usertoken'),
  username: localStorage.getItem('username') || null
}, action) {
  switch (action.type) {
    case t.LOGIN_REQUEST:
      return {...state, isFetching: true, isAuthenticated: false}

    case t.LOGIN_SUCCESS:
      return {...state, isFetching: false, isAuthenticated: true,
        username: action.username}

    case t.LOGIN_FAILURE:
      return {...state, isFetching: false, isAuthenticated: false}

    case t.LOGOUT_REQUEST:
      return {...state, isFetching: true, isAuthenticated: false}

    case t.LOGOUT_SUCCESS:
      return {...state, isFetching: false, isAuthenticated: false}

    default:
      return state
  }
}
