import React, {Component, PropTypes as pt} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {updateSearchQuery, purgeQuestions, loadQuestions} from '../actions'
import {debounce} from 'lodash'
import SearchField from '../components/SearchField'

class QuestionsSearch extends Component {
  static propTypes = {
    q: pt.string.isRequired,
    updateSearchQuery: pt.func.isRequired,
    purgeQuestions: pt.func.isRequired,
    loadQuestions: pt.func.isRequired,
    location: pt.object.isRequired,
    router: pt.object.isRequired
  }

  constructor(props) {
    super(props)
    this.handleSubmit = debounce(this.handleSubmit, 290)
  }

  componentDidMount() {
    const {loadQuestions, location, router} = this.props
    if (location.pathname === '/search') {
      if (location.query.q) {
        if (window.__APP_STATE__ /* i.e. SSR */) return
        loadQuestions({filter: 'search', q: location.query.q})
      } else {
        router.replace({pathname: '/'})
      }
    }
  }

  handleChange = (value) => {
    const {updateSearchQuery, purgeQuestions, location, router} = this.props
    updateSearchQuery(value)

    if (value) {
      if (location.pathname !== '/search') {
        purgeQuestions('search')
        router.push({
          pathname: '/search',
          query: {q: value},
          state: {nextPathName: location.pathname}
        })
      }
      this.handleSubmit()
    } else {
      router.replace({
        pathname: '/',
        query: null,
        state: {nextPathName: location.state.nextPathName}
      })
      purgeQuestions('search')
    }
  }

  handleReset = () => {
    const {location, router} = this.props
    if (location.state && location.state.nextPathName)
      router.push({pathname: location.state.nextPathName})
    else
      router.push({pathname: '/'})
  }

  handleSubmit = () => {
    const {loadQuestions, location, router} = this.props
    router.replace({
      pathname: this.props.q ? '/search' : '/',
      query: this.props.q ? {q: this.props.q} : null,
      state: {nextPathName: location.state.nextPathName}
    })
    if (this.props.q)
      loadQuestions({filter: 'search', q: this.props.q})
  }

  render() {
    return <SearchField value={this.props.q}
      onChange={this.handleChange}
      onReset={this.handleReset}
      onEscape={this.handleReset} />
  }
}

export default withRouter(connect(state => ({q: state.q}),
  {updateSearchQuery, purgeQuestions, loadQuestions})(QuestionsSearch))
