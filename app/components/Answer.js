import React, {PropTypes as pt} from 'react'
import {Link} from 'react-router'

const propTypes = {
  user: pt.shape({
    id: pt.string.isRequired,
    avatar: pt.string.isRequired,
    name: pt.string
  }).isRequired,

  answer: pt.string.isRequired,
  createdAt: pt.string,
  created: pt.string
}

const Answer = ({user, answer, createdAt, created}) =>
  <li>
    <div className="grid usermeta">
      <Link className="avatar" to={`/users/${user.id}`}>
        <img src={user.avatar} alt={user.id} width="34" height="34" />
      </Link>
      <div>
        <Link className="uname" to={`/users/${user.id}`}>{user.name}</Link>
        <time dateTime={createdAt}>{created}</time>
      </div>
    </div>
    <div className="answer">
      {answer}
    </div>
  </li>

Answer.propTypes = propTypes

export default Answer
