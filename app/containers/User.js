import React, {Component, PropTypes as pt} from 'react'
import {connect} from 'react-redux'
import {fetchUser} from '../actions'

class User extends Component {
  static propTypes = {
    user: pt.shape({
      id: pt.string.isRequired,
      avatar: pt.string.isRequired,
      name: pt.string
    }),
    fetchUser: pt.func.isRequired,
    params: pt.object.isRequired
  }

  static requestData({params}) {
    return fetchUser(params.username)
  }

  componentDidMount() {
    const {params} = this.props
    this.props.fetchUser(params.username)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.username !== this.props.params.username)
      !this.props.isFetching && this.props.fetchUser(nextProps.params.username)
  }

  render() {
    const {user} = this.props
    return <div>
      {user && <h2>{user.name}</h2>}
      {
        user && <div className="avatar">
          <img src={user.avatar} alt={user.id} width="128" height="128" />
        </div>
      }
    </div>
  }
}

const mapStateToProps = (state, ownProps) => ({
  user: state.entities.users && state.entities.users[ownProps.params.username]
})

export default connect(mapStateToProps, {fetchUser})(User)
