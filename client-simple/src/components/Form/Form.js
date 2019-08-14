import React from "react";
import "./Form.style.scss";

const FormInput = ({ label, id, type = "text", title, additionalClass = "", ...props }) => {
  return (
    <div className="form__group">
      {label ? <label htmlFor={id} className="form__label">{label}</label> : ""}

      <input
        type={type}
        id={id}
        className={"form__input " + additionalClass}
        {...props}/>
      <> {title}</>
    </div>
  );
};

const FormRadios = ({ label, title1, title2, additionalClass = "", ...props }) => {
  return (
    <>
      {label ? <label htmlFor={"radios"} className="form__label">{label}</label> : ""}
      <input
        type="radio"
        id="radios"
        name="activity"
        value="active"
        className={"form__input " + additionalClass}
        {...props}/>
      <div className="form__inputtitle">{title1}</div>

      <input
        type="radio"
        id="radios"
        value="inactive"
        name="activity"
        className={"form__input " + additionalClass}
        {...props}/>
      <div className="form__inputtitle">{title2}</div>
    </>
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
      {heading ? <h1 className="form__heading">{heading}</h1> : null}
      
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

export { Form, FormInput, FormFooterText, FormRadios };