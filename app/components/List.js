import React, {Component, PropTypes as pt} from 'react'
import Spinner from './Spinner'
import classNames from 'classnames'

const propTypes = {
  pageCount: pt.number,
  renderItem: pt.func.isRequired,
  className: pt.string,
  items: pt.array.isRequired,
  isFetching: pt.bool,
  nextPageUrl: pt.string,
  onLoadMore: pt.func
}

export default class List extends Component {
  constructor(props) {
    super(props)
    this.scrollHandler = this.scrollHandler.bind(this)
  }

  componentDidMount() {
    if (this.props.onLoadMore)
      window.addEventListener('scroll', this.scrollHandler)
  }

  componentWillUnmount() {
    if (this.props.onLoadMore)
      window.removeEventListener('scroll', this.scrollHandler)
  }

  scrollHandler() {
    const {isFetching, nextPageUrl, pageCount, onLoadMore} = this.props
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight)
      !isFetching && pageCount > 0 && nextPageUrl && onLoadMore()
  }

  renderLoadMoreBtn() {
    const {isFetching, onLoadMore} = this.props
    return (
      <button className="panel-button" onClick={onLoadMore} disabled={isFetching}>
        {isFetching ? 'Loading...' : 'Load More'}
      </button>
    )
  }

  render() {
    const {isFetching, items, renderItem, className} = this.props

    return (
      <ol className={classNames('list', className)}>
        {items && items.map(renderItem)}
        <Spinner active={isFetching} />
        {/* pageCount > 0 && nextPageUrl && this.renderLoadMoreBtn() */}
      </ol>
    )
  }
}

List.propTypes = propTypes

List.defaultProps = {
  isFetching: true
}
