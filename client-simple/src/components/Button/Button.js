import React from "react";
import "./Button.style.scss";

const Button = ({ children, variant = "", additionalClass = "", isLink, ...props }) => {
  return (
    <>
      {isLink ? (
        <a {...props} className={"btn " + (variant && `btn--${variant} `) + additionalClass}>
          {children}
        </a>
      ) : (
        <button {...props} className={"btn " + (variant && `btn--${variant} `) + additionalClass}>
          {children}
        </button>
      )}
    </>
  );
};

export default Button;