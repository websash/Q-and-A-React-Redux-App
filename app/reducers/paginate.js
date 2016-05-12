import union from 'lodash/union'

export default function paginate({types, mapActionToKey}) {
  if (!types.every(t => typeof t === 'string'))
    throw new Error('Expected types to be strings.')

  if (typeof mapActionToKey !== 'function')
    throw new Error('Expected mapActionToKey to be a function.')

  const [requestType, successType, failureType, successPrependType] = types

  function updatePagination(state =
    {isFetching: false, nextPageUrl: undefined, pageCount: 0, ids: []}, action) {
    switch (action.type) {
      case requestType:
        return {
          ...state,
          isFetching: true
        }
      case successType:
        return {
          ...state,
          isFetching: false,
          ids: union(state.ids, action.response.result),
          nextPageUrl: action.response.nextPageUrl,
          pageCount: state.pageCount + 1
        }
      case failureType:
        return {
          ...state,
          isFetching: false
        }
      case successPrependType:
        return {
          ...state,
          isFetching: false,
          ids: union([action.response.result], state.ids)
        }
      default:
        return state
    }
  }

  return function updatePaginationByKey(state = {}, action) {
    switch (action.type) {
      case requestType:
      case successType:
      case successPrependType:
      case failureType: {
        const key = mapActionToKey(action)
        if (typeof key !== 'string')
          throw new Error('Expected key to be a string.')

        return {
          ...state,
          [key]: updatePagination(state[key], action)
        }
      }
      default:
        return state
    }
  }
}
