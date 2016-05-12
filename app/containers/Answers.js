import React, {Component, PropTypes as pt} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {loadAnswers, postAnswer} from '../actions'
import {idFromSlugId} from '../utils'
import List from '../components/List'
import Answer from '../components/Answer'
import Question from '../components/Question'
import NoMatch from '../components/NoMatch'
import {getAnswers, getQuestion} from '../reducers'

class Answers extends Component {

  static propTypes = {
    id: pt.string.isRequired,
    slugId: pt.string.isRequired,
    loadAnswers: pt.func.isRequired,
    postAnswer: pt.func.isRequired
  }

  componentWillMount() {
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
    this.props.postAnswer(this.props.question, {answer: this.refs.answer.value})
  }

  renderAnswer = answer => <Answer {...answer} key={answer.id} />

  render() {
    const {question, id, answers, pagination} = this.props
    if (!id) return <NoMatch />

    return (
      <div>
        {question && <Question {...question} />}
        <List items={answers} className="answers"
          renderItem={this.renderAnswer} {...pagination} />

        <form onSubmit={this.handleSubmit}>
          <textarea className="panel-input" rows="8" ref="answer" placeholder="Your answer" />
          <div>
            <button className="panel-button" type="submit">Post Your Answer</button>
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
    question: getQuestion(state, id),
    answers: getAnswers(state, id),
    pagination: state.pagination.answers.all
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({loadAnswers, postAnswer}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Answers)
