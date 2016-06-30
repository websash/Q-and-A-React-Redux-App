import React, {Component, PropTypes as pt} from 'react'
import {connect} from 'react-redux'
import {loadQuestions, updateScrollPos} from '../actions'
import Question from '../components/Question'
import List from '../components/List'
import {pluralize as plur, getFilter} from '../utils'
import {getQuestions} from '../reducers'

class Questions extends Component {
  static propTypes = {
    count: pt.number,
    q: pt.string,
    filter: pt.string.isRequired,
    questions: pt.array.isRequired,
    loadQuestions: pt.func.isRequired,
    listing: pt.object,
    scrollPosition: pt.number,
    updateScrollPos: pt.func
  }

  static requestData({location}) {
    return loadQuestions({filter: getFilter(location.pathname), q: location.query.q})
  }

  componentDidMount() {
    window.scrollTo(0, this.props.scrollPosition)
    const {loadQuestions, filter, q} = this.props
    if (!q) loadQuestions({filter, q})
  }

  componentDidUpdate(prevProps) {
    const {filter, q, loadQuestions} = this.props
    if (!q && filter !== prevProps.filter) loadQuestions({filter, q})
  }

  componentWillUnmount() {
    this.props.updateScrollPos(window.pageYOffset)
  }

  handleLoadMore = () =>
    this.props.loadQuestions({filter: this.props.filter, q: this.props.q}, true)

  renderQuestion = question =>
    <Question condensed {...question} key={question.id} />

  render() {
    const {count, questions, listing} = this.props

    return <div>
      <h2>
        {count > 0 ? `Found ${count} ${plur(count, 'question')}` :
          listing && listing.isFetching ? '\u00a0' :
          count === 0 ? 'No questions found' : '\u00a0'}
      </h2>
      <List items={questions}
        className="questions"
        renderItem={this.renderQuestion}
        onLoadMore={this.handleLoadMore}
        {...listing} />
    </div>
  }
}

const mapStateToProps = (state, ownProps) => {
  const {listing, q} = state
  const filter = getFilter(ownProps.location.pathname)

  return {
    filter, q,
    questions: getQuestions(state)(filter),
    listing: listing.questions[filter],
    count: state.meta[filter] && state.meta[filter].count,
    scrollPosition: state.scrollPosition
  }
}

export default connect(mapStateToProps, {loadQuestions, updateScrollPos})(Questions)
