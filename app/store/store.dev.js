import {applyMiddleware, createStore} from 'redux'
import {routerMiddleware} from 'react-router-redux'
import {browserHistory} from 'react-router'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import api from '../middleware/api'
import logger from '../middleware/logger'

const store = createStore(
  reducer,
  applyMiddleware(
    thunk, routerMiddleware(browserHistory), api, logger
  )
)

export default store
