import React, {Component, PropTypes as pt} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadAnswers, postAnswer} from '../actions'
import {idFromSlugId} from '../utils'
import List from '../components/List'
import Answer from '../components/Answer'
import Question from '../components/Question'
import NoMatch from '../components/NoMatch'
import {withRouter} from 'react-router'
import {getAnswers, getQuestionById} from '../reducers'

class Answers extends Component {
  static propTypes = {
    isLoggedIn: pt.bool.isRequired,
    id: pt.string.isRequired,
    slugId: pt.string.isRequired,
    loadAnswers: pt.func.isRequired,
    postAnswer: pt.func.isRequired,
    router: pt.object.isRequired,
    location: pt.object.isRequired
  }

  static requestData(props) {
    const {params: {slugId}} = props
    return loadAnswers(slugId, idFromSlugId(slugId))
  }

  componentDidMount() {
    const {id, slugId} = this.props
    id && this.props.loadAnswers(slugId, id)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.slugId !== this.props.slugId)
      nextProps.id && this.props.loadAnswers(nextProps.slugId, nextProps.id)
  }

  componentWillUpdate(nextProps, nextState) {
    this.refs.answer.value = ''
  }

  handleSubmit = e => {
    e.preventDefault()
    const {isLoggedIn, postAnswer, router, location} = this.props
    if (isLoggedIn)
      postAnswer(this.props.question, {answer: this.refs.answer.value})
    else
      router.push({pathname: '/login', state: {nextPathname: location.pathname}})
  }

  renderAnswer = answer => <Answer {...answer} key={answer.id} />

  render() {
    const {question, id, answers, listing, isLoggedIn} = this.props
    if (!id) return <NoMatch />

    return (
      <div>
        {question && <Question {...question} />}
        <List items={answers} className="answers"
          renderItem={this.renderAnswer} {...listing} />

          <form onSubmit={this.handleSubmit}>
            <textarea className="panel-input" rows="8" ref="answer"
              placeholder="Your answer" disabled={!isLoggedIn} />
            <div style={{marginBottom: '1.5em'}}>
              <button className="panel-button" type="submit">
                {isLoggedIn ? 'Post Your Answer' : 'Log in to Answer'}
              </button>
            </div>
          </form>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const slugId = ownProps.params.slugId
  const id = idFromSlugId(slugId)

  return {
    id, slugId,
    question: getQuestionById(state)(id),
    answers: getAnswers(state)(id),
    listing: state.listing.answers.all,
    isLoggedIn: state.auth.isLoggedIn
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({loadAnswers, postAnswer}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Answers))
