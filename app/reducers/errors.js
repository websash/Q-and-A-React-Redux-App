import * as t from '../constants'

export default function errors(state = {}, action) {
  switch (action.type) {
    case t.SHOW_MESSAGE:
      return {
        ...state,
        [action.message]:
          state[action.message] === undefined
            ? {count: 1, type: action.errType, timestamp: Date.now()}
            : {count: state[action.message].count + 1, type: action.errType, timestamp: Date.now()}
      }

    case t.DISMISS_MESSAGE:
      return Object.keys(state).reduce((newstate, key, i, arr) => {
        if (key !== action.message)
          newstate[key] = state[arr[i]]

        return newstate
      }, {})

    case t.DISMISS_MESSAGES:
      return {}

    default:
      return state
  }
}
