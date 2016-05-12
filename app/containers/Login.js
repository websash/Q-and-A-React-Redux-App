import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import LoginForm from '../components/LoginForm'
import {loginUser} from '../actions'

export class Login extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  }

  componentWillMount() {
    this.redirect()
  }

  componentDidUpdate() {
    this.redirect()
  }

  handleLogin = creds =>
    this.props.dispatch(loginUser(creds))

  redirect() {
    const {router, location, isAuthenticated} = this.props
    if (isAuthenticated)
      router.replace(location.state && location.state.nextPathname || '/')
  }

  render() {
    const {isAuthenticated} = this.props

    return (
      <div>
        {!isAuthenticated && <LoginForm onSubmit={this.handleLogin} />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  prevPath: state.auth.prevPath
})

export default withRouter(connect(mapStateToProps)(Login))
