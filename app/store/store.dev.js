import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import {routerMiddleware} from 'react-router-redux'
import reducer from '../reducers'
import api from '../middleware/api'
import logger from '../middleware/logger'

export default (initialState, history) => {
  const store = createStore(
    reducer, initialState,
    applyMiddleware(thunk, routerMiddleware(history), api, logger)
  )

  // if (module.hot) {
  //   module.hot.accept('../reducers', () => {
  //     const nextRootReducer = require('../reducers').default
  //     store.replaceReducer(nextRootReducer)
  //   })
  // }

  return store
}
