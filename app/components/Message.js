import React, {PropTypes as pt} from 'react'

const propTypes = {
  type: pt.string,
  text: pt.string.isRequired,
  counter: pt.number,
  onDismissMessage: pt.func
}

const Message = ({type, text, counter, onDismissMessage}) =>
  <li className="error-message">
    <div className="grid stretch">
      <div>
        {counter && counter > 1 && `${counter}) `}
        {type && <span className="type">{type}: </span>} {text}
      </div>
      <span className="btn-x" onClick={_ => onDismissMessage(text)}>&times;</span>
    </div>
  </li>

Message.propTypes = propTypes

export default Message
