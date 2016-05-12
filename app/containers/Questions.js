import React, {Component} from 'react'
import {connect} from 'react-redux'
import {loadQuestions, updateScrollPos} from '../actions'
import Question from '../components/Question'
import List from '../components/List'

class Questions extends Component {
  componentWillMount() {
    const {params} = this.props
    this.props.loadQuestions(params.filter)
  }

  componentDidMount() {
    window.scrollTo(0, this.props.scrollPosition)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.filter !== this.props.params.filter)
      !this.props.isFetching && this.props.loadQuestions(nextProps.params.filter)
  }

  componentWillUnmount() {
    this.props.updateScrollPos(window.pageYOffset)
  }

  handleLoadMore = () =>
    this.props.loadQuestions(this.props.params.filter, true)

  renderQuestion = question =>
    <Question condensed {...question} key={question.id} />

  render() {
    const {questions, pagination} = this.props

    return <List items={questions}
                 className="questions"
                 renderItem={this.renderQuestion}
                 onLoadMore={this.handleLoadMore}
                 {...pagination} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const {filter = 'all'} = ownProps.params
  const {
    entities: {questions},
    pagination
  } = state

  return {
    questions: pagination.questions[filter] &&
      pagination.questions[filter].ids.map(id => questions[id]) || [],
    pagination: pagination.questions[filter],
    scrollPosition: state.scrollPosition
  }
}

export default connect(mapStateToProps, {loadQuestions, updateScrollPos})(Questions)
