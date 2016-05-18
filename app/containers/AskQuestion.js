import React, {Component, PropTypes as pt} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {postQuestion} from '../actions'

export class AskForm extends Component {
  static propTypes = {
    isLoggedIn: pt.bool.isRequired,
    postQuestion: pt.func.isRequired,
    router: pt.object,
    location: pt.object
  }

  componentWillReceiveProps() {
    this.redirect()
  }

  redirect() {
    const {router, location, isLoggedIn} = this.props
    if (isLoggedIn)
      router.replace(location.state && location.state.nextPathname || '/')
    else
      router.replace('/')
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
          <textarea className="panel-input" rows="8"
            ref="text" placeholder="Your question details" />

          <br />
          <button className="panel-button" type="submit">Ask Question</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn
})

const mapDispatchToProps = dispatch => bindActionCreators({
  postQuestion
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AskForm))
