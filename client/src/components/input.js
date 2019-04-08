import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import questionImg from '../img/question.svg';

const Input = (props) => {
  return (
    <div>
      <label>{props.label}
      <Tooltip disableFocusListener disableTouchListener placement="right" title={props.tooltip}>
        <img src={questionImg} alt="tooltip"/>
      </Tooltip>
      </label>

      <input
        type="text"
        name={props.name}
        onChange={props.onInputChange}
        value={props.value}
      />

      <p className="error">{props.error}</p>
    </div>
  )
}

export default Input;
