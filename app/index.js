if (process.env.NODE_ENV !== 'production')
  require('./styles/main.css')

import React from 'react'
import {render} from 'react-dom'
import {Router, browserHistory} from 'react-router'
// import {syncHistoryWithStore} from 'react-router-redux'
import {Provider} from 'react-redux'
import configureStore from './store'
import configureRoutes from './routes'
// import Perf from 'react-addons-perf'

let appState
try {
  appState = JSON.parse(unescape(window.__APP_STATE__))
} catch (_) {}

if (process.env.NODE_ENV !== 'production')
  console.info('__APP_STATE__', appState)

const store = configureStore(appState, browserHistory)
const routes = configureRoutes(store)

render(
  <Provider store={store}>
    {/* syncHistoryWithStore(browserHistory, store) not sure I need this */}
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('app')
)

// if (process.env.NODE_ENV !== 'production') window.Perf = Perf
