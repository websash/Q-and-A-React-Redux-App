import React, {PropTypes as pt} from 'react'
import classNames from 'classnames'

const propTypes = {
  active: pt.bool
}

const Spinner = ({active = false}) =>
  <div className={classNames('spinner', {active})}>
    <div className="timer"></div>
  </div>

Spinner.propTypes = propTypes

export default Spinner
