import React from 'react'
import {Route, IndexRoute} from 'react-router'
import App from './containers/App'
import Login from './containers/Login'
import Questions from './containers/Questions'
import Answers from './containers/Answers'
import AskQuestion from './containers/AskQuestion'
import User from './containers/User'
import NoMatch from './components/NoMatch'
import {
  resetSearchBox as resetSBox,
  updateSearchQuery as updateSQuery
} from './actions'

const requireAuth = (store) => (nextState, replace) => {
  if (!store.getState().auth.isLoggedIn) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

const resetSearchBox = (store) => (prevState, nextState) => {
  if (!nextState.location.search) store.dispatch(resetSBox())
}

const updateSearchBox = (store) => (nextState, replace) => {
  if (nextState.location.query.q)
    store.dispatch(updateSQuery(nextState.location.query.q))
}

const configureRoutes = (store) =>
  <Route path="/" component={App} onChange={resetSearchBox(store)}>
    <IndexRoute component={Questions} />
    <Route path="/login" component={Login} />
    <Route path="/questions/ask" component={AskQuestion} onEnter={requireAuth(store)} />
    <Route path="/questions/:slugId" component={Answers} />
    <Route path="/search" component={Questions} onEnter={updateSearchBox(store)} />
    <Route path="/answered" component={Questions} />
    <Route path="/unanswered" component={Questions} />
    <Route path="/users/:username" component={User} />
    <Route path="*" component={NoMatch} />
  </Route>

export default configureRoutes
