import React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'
import {renderToString} from 'react-dom/server'

function wrap(Component, props) {
  return class ComponentWrapper extends React.Component {
    render() {
      return <Component {...props} />
    }
  }
}

export function intoDoc(Component, props) {
  const node = document.createElement('div')
  render(
    <Router history={browserHistory}>
      <Route path="blank" component={wrap(Component, props)} />
    </Router>,
    node
  )
  return node
}

export function intoHTML(Component, props) {
  return renderToString(<Component {...props} />)
}
