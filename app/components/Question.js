import React, {PropTypes as pt} from 'react'
import {Link} from 'react-router'
import {pluralize as plr} from '../utils'

const propTypes = {
  user: pt.shape({
    id: pt.string.isRequired,
    avatar: pt.string.isRequired,
    name: pt.string
  }).isRequired,

  condensed: pt.bool,
  link: pt.string.isRequired,
  title: pt.string,
  text: pt.string,
  created: pt.string,
  createdAt: pt.string,
  ansCount: pt.number
}

const Question = ({user, link, title, ansCount, createdAt, created, text, condensed}) =>
  condensed
    ? <li className="grid">
        <div className="question">
          <h3>
            <Link to={link}>{title}</Link>
          </h3>
          <time dateTime={createdAt}><b className="ans">{ansCount} ans.</b> {created}</time>
        </div>
        <div className="usermeta">
          <Link className="avatar" to={`/users/${user.id}`}>
            <img src={user.avatar} alt={user.id} width="34" height="34" />
          </Link>
          <Link className="uname"
            to={`/users/${user.id}`} title={user.name}>{user.name}</Link>
        </div>
      </li>

    : <div>
        <h2>{title}</h2>
        <div className="question-body">{text}</div>
        <div className="grid align-right">
          <Link className="avatar" to={`/users/${user.id}`}>
            <img src={user.avatar} alt={user.id} width="34" height="34" />
          </Link>
          <div>
            <Link className="uname" to={`/users/${user.id}`}>{user.name}</Link>
            <time dateTime={createdAt}>{created}</time>
          </div>
        </div>
        {ansCount > 0 && <h3 className="q-count">{`${ansCount} ${plr(ansCount, 'answer')}`}</h3>}
      </div>

Question.propTypes = propTypes

export default Question
