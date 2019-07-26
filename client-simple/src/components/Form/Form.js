import React from "react";
import "./Form.style.scss";

const FormInput = ({ label, id, type = "text", additionalClass = "", ...props }) => {
  return (
    <div className="form__group">
      {label ? <label htmlFor={id} className="form__label">{label}</label> : ""}

      <input
        type={type}
        id={id}
        className={"form__input " + additionalClass}
        {...props}
      />
    </div>
  );
};

const FormFooterText = ({ children }) => {
  return (
    <span className="form__text">
      {children}
    </span>
  );
};

const Form = ({ children, heading, formFooter, ...props }) => {
  return (
    <>
      <h1 className="form__heading">{heading}</h1>
      
      <form className="form" {...props}>
        {children}
      </form>

      {formFooter && (
        <div className="form__footer">
          {formFooter()}
        </div>
      )}
    </>
  );
};

export { Form, FormInput, FormFooterText };