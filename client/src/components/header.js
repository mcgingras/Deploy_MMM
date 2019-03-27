import React from 'react';
import logo from '../img/logo.png';
import plus from '../img/plus.svg';

const Header = (props) => {
  return (
    <div className="header">
      <div className="header--item">
        <img src={logo} className="logo" />
        {props.isAuth &&
          <p>Connected to {sessionStorage.getItem("publicAddress")}</p>
       }
      </div>

      <div className="header--item">
        <p>All Strategies</p>
        <button
          className="button--add"
          onClick={() => props.onAddStrategy()}>
          <img src={plus} />
          New Strategy
        </button>
      </div>
    </div>
  )
}

export default Header;
