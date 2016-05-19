import React, {Component, PropTypes as pt} from 'react'
import {connect} from 'react-redux'
import {DISMISS_MESSAGE} from '../constants'
import Message from '../components/Message'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

export class ErrorMessages extends Component {
  static propTypes = {
    errors: pt.object.isRequired,
    dispatch: pt.func.isRequired
  }

  componentDidMount() {
    const {errors, dispatch} = this.props
    Object.keys(errors).map(message =>
      setTimeout(_ => dispatch({type: DISMISS_MESSAGE, message}), 5000))
  }

  handleDismissMsg = message => {
    this.props.dispatch({type: DISMISS_MESSAGE, message})
  }

  render() {
    const {errors} = this.props
    return (
      <ReactCSSTransitionGroup className="error-messages"
        component="ul" transitionName="message"
        transitionAppear transitionAppearTimeout={180}
        transitionEnterTimeout={180} transitionLeaveTimeout={200}>
        {Object.keys(errors)
          .sort((a, b) => errors[b].timestamp - errors[a].timestamp)
          .map(err =>
            <Message text={err}
              type={errors[err].type}
              counter={errors[err].count}
              onDismissMessage={this.handleDismissMsg}
              key={errors[err].timestamp} />
          )
        }
      </ReactCSSTransitionGroup>
    )
  }
}

export default connect(state => ({
  errors: state.errors
}))(ErrorMessages)
