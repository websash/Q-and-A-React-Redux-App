import union from 'lodash/union'

export default function listing({types, mapActionToKey}) {

  const {REQUEST, SUCCESS, ERROR, PREPEND, PURGE} = types

  function updateListing(state =
    {isFetching: false, nextPageUrl: undefined, pageCount: 0, ids: []}, action) {
    switch (action.type) {
      case REQUEST:
        return {
          ...state,
          isFetching: true
        }
      case SUCCESS:
        const {response} = action
        return {
          ...state,
          isFetching: false,
          ids: action.isNextPage ? union(state.ids, response.result) : response.result,
          nextPageUrl: response.nextPageUrl,
          pageCount: action.isNextPage ? state.pageCount + 1 : 1
        }
      case ERROR:
        return {
          ...state,
          isFetching: false
        }
      case PREPEND:
        return {
          ...state,
          isFetching: false,
          ids: union([action.response.result], state.ids)
        }
      case PURGE:
        return {isFetching: false, nextPageUrl: undefined, pageCount: 0, ids: []}
      default:
        return state
    }
  }

  return function updateListingByKey(state = {}, action) {
    switch (action.type) {
      case REQUEST:
      case SUCCESS:
      case PREPEND:
      case ERROR:
      case PURGE: {
        const key = mapActionToKey(action)
        if (typeof key !== 'string')
          throw new Error('Expected key must be of type string.')

        return {
          ...state, [key]: updateListing(state[key], action)
        }
      }
      default:
        return state
    }
  }
}
