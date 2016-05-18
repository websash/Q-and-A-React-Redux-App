import React, {Component, PropTypes as pt} from 'react'
import {connect} from 'react-redux'
import {loadQuestions, updateScrollPos} from '../actions'
import Question from '../components/Question'
import List from '../components/List'
import {getFilter} from '../utils'

class Questions extends Component {
  static propTypes = {
    filter: pt.string.isRequired,
    loadQuestions: pt.func.isRequired
  }

  static requestData({location}) {
    return loadQuestions(getFilter(location.pathname))
  }

  componentDidMount() {
    window.scrollTo(0, this.props.scrollPosition)
    const {loadQuestions, filter} = this.props
    loadQuestions(filter)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filter !== this.props.filter)
      !this.props.isFetching && this.props.loadQuestions(nextProps.filter)
  }

  componentWillUnmount() {
    this.props.updateScrollPos(window.pageYOffset)
  }

  handleLoadMore = () =>
    this.props.loadQuestions(this.props.filter, true)

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
  const filter = getFilter(ownProps.location.pathname)
  const {entities: {questions}, pagination} = state

  return {
    filter,
    questions: pagination.questions[filter] &&
      pagination.questions[filter].ids.map(id => questions[id]) || [],
    pagination: pagination.questions[filter],
    scrollPosition: state.scrollPosition
  }
}

export default connect(mapStateToProps, {loadQuestions, updateScrollPos})(Questions)
