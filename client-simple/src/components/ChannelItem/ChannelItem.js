import React from "react";
import UserSmallSvg from "../../assets/svg/user-small.svg";
import VerifiedSvg from "../../assets/svg/verified.svg";
import NotVerifiedSvg from "../../assets/svg/not-verified.svg";
import Button from "../Button/Button";
import "./ChannelItem.style.scss";

const ChannelItem = ({ id, title, url, users, verified, isLogged, toggleModal }) => {
  return (
    <div className="channel">
      <h3 className="channel__title">{title}</h3>
        
      <div className="actions">
        <span className="actions__item">
          {isLogged ? (
            <Button variant="primary" href={url} isLink>Join</Button>
          ) : (
            <Button variant="primary" onClick={() => toggleModal(id)} isLink>Join</Button>
          )}
        </span>

        <span className="actions__separator"></span>

        <span className="actions__item">
          <span className="actions__value">{users}</span>
          <img src={UserSmallSvg} className="actions__img" alt="" />
        </span>

        <span className="actions__separator"></span>

        <span className="actions__item">
          <img src={verified ? VerifiedSvg : NotVerifiedSvg} className="actions__img" alt="" />
        </span>
      </div>
    </div>
  );
};

export default ChannelItem;