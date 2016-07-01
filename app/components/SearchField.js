import React, {Component, PropTypes as pt} from 'react'

class SearchField extends Component {
  static propTypes = {
    value: pt.string,
    onChange: pt.func,
    onReset: pt.func,
    onEscape: pt.func
  }

  constructor(props) {
    super(props)
    this.state = {focused: false}
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.searchField.blur()
      this.props.onEscape && this.props.onEscape()
    }
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }

  onFocus = () => {
    this.setState({focused: true})
  }

  onBlur = () => {
    this.setState({focused: false})
  }

  render() {
    return (
      <div style={{
        position: 'relative',
        width: '35%',
        alignSelf: 'center',
        marginRight: '1em'
      }}>
        <input type="text" className="panel-input"
          ref={ref => this.searchField = ref}
          value={this.props.value} onChange={this.handleChange}
          onFocus={this.onFocus} onBlur={this.onBlur}
          onKeyDown={this.handleKeyDown}
          placeholder="search" style={{
            paddingLeft: 28,
            paddingRight: 28,
            borderColor: this.state.focused ? '#5a9bc9' : '#b6b9b7'
          }} />

          <svg viewBox="0 0 46.553307 46.200966"
            width="16.553307" height="16.200966"
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              marginTop: -8,
              marginLeft: 8
            }}>
            <g transform="translate(-29.461,-26.738)">
              <path fill={this.state.focused ? '#5a9bc9' : '#a8a9a8'}
                d="m69.902 72.704-10.935-10.935c-2.997 1.961-6.579 3.111-10.444 3.111-10.539 0-19.062-8.542-19.062-19.081 0-10.519 8.522-19.061 19.062-19.061 10.521 0 19.06 8.542 19.06 19.061 0 3.679-1.036 7.107-2.828 10.011l11.013 11.011c0.583 0.567 0.094 1.981-1.076 3.148l-1.64 1.644c-1.17 1.167-2.584 1.656-3.15 1.091zm-8.653-26.905c0-7.033-5.695-12.727-12.727-12.727-7.033 0-12.745 5.694-12.745 12.727s5.712 12.745 12.745 12.745c7.032 0 12.727-5.711 12.727-12.745z"
              />
            </g>
          </svg>

          <svg viewBox="0 0 30 30" width="15" height="15"
            onClick={this.props.onReset}
            style={{
              display: this.props.value ? 'block' : 'none',
              position: 'absolute',
              right: 0,
              top: '50%',
              marginTop: -8,
              marginRight: 8,
              cursor: 'pointer'
            }}>
            <circle fill="#afb1af"
              cx="15" cy="15" r="14" />
            <path style={{
              stroke: '#fff',
              fill: 'transparent',
              strokeWidth: 4
            }} d="M 9,9 L 21,21 M 21,9 L 9,21" />
          </svg>
      </div>
    )
  }
}

export default SearchField
