import React, {Component, PropTypes as pt} from 'react'
import {Link} from 'react-router'

const propTypes = {
  onSubmit: pt.func.isRequired
}

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const creds = {
      username: this.refs.username.value.trim(),
      password: this.refs.password.value.trim()
    }
    this.props.onSubmit(creds)
  }

  render() {
    return (
      <div style={{maxWidth: '300px', margin: '0 auto'}}>
        <h2>Log in below or <Link to="/#todo-signup">sign up</Link></h2>

        <form onSubmit={this.handleSubmit}>
          <input type="text" ref="username"
            className="panel-input" placeholder="Username" />

          <br /><br />
          <input type="password" ref="password"
            className="panel-input" placeholder="Password" />

          <br /><br />
          test users<br />
          1) user: jackjohns, pasw: johnson<br />
          2) user: sandy-brooks, pasw: brooks

          <br />
          <button className="panel-button" type="submit">Login</button>
        </form>
      </div>
    )
  }
}

Login.propTypes = propTypes
