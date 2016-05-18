import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import {routerMiddleware} from 'react-router-redux'
import reducer from '../reducers'
import api from '../middleware/api'

export default (initialState, history) =>
  createStore(
    reducer, initialState,
    applyMiddleware(thunk, routerMiddleware(history), api)
  )
