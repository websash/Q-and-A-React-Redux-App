import {applyMiddleware, createStore} from 'redux'
import {routerMiddleware} from 'react-router-redux'
import {browserHistory} from 'react-router'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import api from '../middleware/api'

const store = createStore(
  reducer,
  applyMiddleware(thunk, routerMiddleware(browserHistory), api)
)

export default store
