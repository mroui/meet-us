import React from "react";
import UserSmallSvg from "../../assets/svg/user-small.svg";
import ActiveSvg from "../../assets/svg/active.svg";
import NotActiveSvg from "../../assets/svg/not-active.svg";
import Button from "../Button/Button";
import "./ChannelItem.style.scss";

const ChannelItem = ({ id, title, url, members, active, date, locationName, isLogged, toggleModal }) => {

  const newDate = new Date(date);
  const nicerDateFormat = newDate.getDate() + " " + newDate.toLocaleString("en-us", { month: "short" }) + " " + newDate.getFullYear();

  return (
    <div className="channel">
      <h3 className="channel__title">{title}</h3>
        
      <span className="channel__location">{locationName}</span>

      <div className="actions">
        
        <span className="actions__separator"></span>

        <span className="actions__item">
          <span className="actions__value">{nicerDateFormat}</span>
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
          <span className="actions__value">{members}</span>
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