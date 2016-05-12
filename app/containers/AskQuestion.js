import React, {Component, PropTypes as pt} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {postQuestion} from '../actions'

export class AskForm extends Component {

  static propTypes = {
    isAuthenticated: pt.bool,
    postQuestion: pt.func.isRequired,
    location: pt.object
  }

  componentWillReceiveProps() {
    this.redirect()
  }

  redirect() {
    const {location, isAuthenticated} = this.props
    const {router} = this.context
    if (isAuthenticated)
      router.replace(location.state && location.state.nextPathname || '/')
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.postQuestion({
      title: this.refs.title.value,
      text: this.refs.text.value
    })
  }

  render() {
    return (
      <div className="form">
        <h2>Ask your question and get answers from people with unique insights</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" className="panel-input"
            ref="title" placeholder="What's your question?" />

          <br /><br />
          <textarea className="panel-input" rows="10"
            ref="text" placeholder="Your question details" />

          <br />
          <button className="panel-button" type="submit">Ask Question</button>
        </form>
      </div>
    )
  }
}

AskForm.contextTypes = {
  router: pt.object.isRequired
}

const mapDispatchToProps = dispatch => bindActionCreators({
  postQuestion
}, dispatch)

export default connect(null, mapDispatchToProps)(AskForm)
