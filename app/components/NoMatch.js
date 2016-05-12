import React from 'react'
import {Link} from 'react-router'

const NoMatch = _ =>
  <div>
    <h2>There's nothing interesting here</h2>
    <Link to="/">Questions</Link>
  </div>

export default NoMatch
