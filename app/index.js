if (process.env.NODE_ENV !== 'production') require('./styles/main.css')
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {Provider} from 'react-redux'
import App from './containers/App'
import Login from './containers/Login'
import Questions from './containers/Questions'
import Answers from './containers/Answers'
import AskQuestion from './containers/AskQuestion'
import User from './containers/User'
import NoMatch from './components/NoMatch'
import store from './store'

const history = syncHistoryWithStore(browserHistory, store)

function requireAuth(nextState, replace) {
  if (!store.getState().auth.isAuthenticated) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Questions} />
        <Route path="/login" component={Login} />
        <Route path="/questions/ask" onEnter={requireAuth} component={AskQuestion} />
        <Route path="/questions/:slugId" component={Answers} />
        <Route path="/questions/show/:filter" component={Questions} />
        <Route path="/users/:username" component={User} />
        <Route path="*" component={NoMatch} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'))
