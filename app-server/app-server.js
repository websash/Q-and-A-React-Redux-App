import Express from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import slashes from 'connect-slashes'
import noop from 'express-noop'
import path from 'path'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'
import {createMemoryHistory, RouterContext, match} from 'react-router'
import configureRoutes from '../app/routes'
import configureStore from '../app/store'
import webpack from 'webpack'
import webpackConfig from '../webpack.config'

global.__DEV__ = process.env.NODE_ENV !== 'production'
global.__SSR__ = true

const server = new Express()
const PORT = process.env.PORT || 8080
const HOSTNAME = process.env.HOSTNAME || 'localhost'
const appStyle = __DEV__ ? null : require('../build/assets.json').appStyle
const appScripts = __DEV__ ? ['/main.js'] : require('../build/assets.json').appScripts
const compiler = webpack(webpackConfig)

server.set('views', path.join(__dirname, '../app'))
.use(Express.static(path.join(__dirname, '../app/static')))
.use(__DEV__ ?
  require('webpack-dev-middleware')(compiler, {
    stats: 'errors-only', publicPath: webpackConfig.output.publicPath
  }) : Express.static(path.join(__dirname, '../build'))
)
.use(__DEV__ ?
  require('webpack-hot-middleware')(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }) : noop()
)
.use(slashes(false))
.use(cookieParser())
.use(compression())

.get('*', (req, res, next) => {
  if (__SSR__ === false) {
    res.render('index.ejs', {appHtml: '', appState: null, appScripts, appStyle})
    return
  }
  const username = req.cookies.username
  const auth = {username, isLoggedIn: !!username}
  const memoryHistory = createMemoryHistory(req.url)
  const store = configureStore({auth}, memoryHistory)
  const routes = configureRoutes(store)

  const render = props => _ => {
    const appState = escape(JSON.stringify(store.getState()))
    const appHtml = renderToString(
      <Provider store={store}>
        <RouterContext {...props} />
      </Provider>
    )
    res.render('index.ejs', {appHtml, appState, appScripts, appStyle})
  }

  match({routes, location: req.url}, (error, redirectLocation, props) => {
    if (error) {
      res.status(500).send(error.message)

    } else if (redirectLocation) {
      const {state, pathname, search} = redirectLocation
      res.cookie('nextPathname', state.nextPathname, {httpOnly: false})
      res.redirect(302, pathname + search)

    } else if (props) {
      let requestData
      try {
        const {components} = props
        const component = components[components.length - 1].WrappedComponent
        requestData = component.requestData(props)
      } catch (_) {}

      if (!requestData) render(props)()

      store.dispatch(requestData).then(render(props)).catch(next)

    } else {
      res.status(404).send('Not found')
    }
  })
})

.listen(PORT, () => {
  console.log(`👀  Application ${__DEV__ ?
    'development' : 'production'} server running at ${HOSTNAME}:${PORT}`)
})
