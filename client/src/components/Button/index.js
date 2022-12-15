import React from 'react'
import './styles.scss'

const Button = ({
  text,
  type = 'primary',
  onClick,
  includeSideMargins = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`button-container ${type} ${
        includeSideMargins ? 'margined-sides' : ''
      }`}
    >
      <p>{text}</p>
    </button>
  )
}

export default Button
