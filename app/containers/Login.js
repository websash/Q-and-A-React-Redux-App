import React, {Component, PropTypes as pt} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import LoginForm from '../components/LoginForm'
import {loginUser} from '../actions'
import {getCookie} from '../utils'

export class Login extends Component {
  static propTypes = {
    isLoggedIn: pt.bool.isRequired,
    router: pt.object.isRequired,
    location: pt.object.isRequired,
    dispatch: pt.func.isRequired
  }

  componentDidMount() {
    this.redirect()
  }

  componentDidUpdate() {
    this.redirect()
  }

  handleLogin = creds =>
    this.props.dispatch(loginUser(creds))

  redirect() {
    const {router, location, isLoggedIn} = this.props
    if (isLoggedIn) {
      router.replace(location.state && location.state.nextPathname ||
        getCookie('nextPathname') || '/')
    }
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <div>
        {!isLoggedIn && <LoginForm onSubmit={this.handleLogin} />}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn
})

export default withRouter(connect(mapStateToProps)(Login))
