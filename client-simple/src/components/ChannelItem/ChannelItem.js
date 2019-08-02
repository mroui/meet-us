import React from "react";
import UserSmallSvg from "../../assets/svg/user-small.svg";
import ActiveSvg from "../../assets/svg/active.svg";
import NotActiveSvg from "../../assets/svg/not-active.svg";
import Button from "../Button/Button";
import "./ChannelItem.style.scss";

const ChannelItem = ({ id, title, url, users, active, date, locationName, isLogged, toggleModal }) => {

  const newDate = date.substring(0,10);
  const year = newDate.substring(0,4);
  const dateFormat = new Date(newDate).toDateString().substring(4,10) + " " + year;

  return (
    <div className="channel">
      <h3 className="channel__title">{title}</h3>
        
      <span className="channel__location">{locationName}</span>

      <div className="actions">
        
        <span className="actions__separator"></span>

        <span className="actions__item">
          <span className="actions__value">{dateFormat}</span>
        </span>
        
        <span className="actions__separator"></span>

        <span className="actions__item">
          {isLogged ? (
            <Button variant="primary" href={url} isLink>Show</Button>
          ) : (
            <Button variant="primary" onClick={() => toggleModal(id)} isLink>Show</Button>
          )}
        </span>

        <span className="actions__separator"></span>

        <span className="actions__item">
          <span className="actions__value">{users}</span>
          <img src={UserSmallSvg} className="actions__img" alt="" />
        </span>

        <span className="actions__separator"></span>

        <span className="actions__item">
          <img src={active ? ActiveSvg : NotActiveSvg} className="actions__img" alt="" />
        </span>
      </div>
    </div>
  );
};

export default ChannelItem;