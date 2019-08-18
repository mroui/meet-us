import React from "react";
import format from "date-fns/format";
import "./Message.style.scss";

const MessageText = ({ children, variant = "" }) => {
  return (
    <span className={"message__text " + (variant && `message__text--${variant}`)}>{children}</span>
  );
};

const MessageImage = ({ children, variant = "" }) => {
  return (
    <img src={children} alt={children} className={"message__text " + (variant && `message__text--${variant}`) + " message__image"}/>
  );
};

const Message = ({ author, timestamp, toRight = "", children }) => {
  return (
    <div className={"message " + (toRight && "message--right")}>
      <div className="message__user">
        <span className={"message__username " + (toRight && "message__username--right")}>{author}</span>
        <span className="message__date">{format(timestamp, "hh:mm:ss")}</span>
      </div>
      {children}
    </div>
  );
};

export { Message, MessageImage, MessageText};