import React from 'react'
import {Route, IndexRoute} from 'react-router'
import App from './containers/App'
import Login from './containers/Login'
import Questions from './containers/Questions'
import Answers from './containers/Answers'
import AskQuestion from './containers/AskQuestion'
import User from './containers/User'
import NoMatch from './components/NoMatch'

const requireAuth = store => (nextState, replace) => {
  if (!store.getState().auth.isLoggedIn) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

export default (store) =>
  <Route path="/" component={App}>
    <IndexRoute component={Questions} />
    <Route path="/login" component={Login} />
    <Route path="/questions/ask" component={AskQuestion}
      onEnter={requireAuth(store)} />
    <Route path="/questions/:slugId" component={Answers} />
    <Route path="/answered" component={Questions} />
    <Route path="/unanswered" component={Questions} />
    <Route path="/users/:username" component={User} />
    <Route path="*" component={NoMatch} />
  </Route>
