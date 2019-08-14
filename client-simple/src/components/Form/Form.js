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

const FormRadios = ({ label, val1, val2, title1, title2, additionalClass = "", ...props }) => {
  return (
    <>
      {label ? <label htmlFor={"radios"} className="form__label">{label}</label> : ""}
      <input
        type="radio"
        id="radios"
        name="radios"
        value={val1}
        className={"form__input " + additionalClass}
        {...props}/>
      <div className="form__inputtitle">{title1}</div>

      <input
        type="radio"
        id="radios"
        name="radios"
        value={val2}
        className={"form__input " + additionalClass}
        {...props}/>
      <div className="form__inputtitle">{title2}</div>
    </>
  );
};

const FormInputSelect = ({ label, additionalClass, options, ...props}) => {
  return (
    <div className="form__group">
      {label ? <label htmlFor={"select"} className="form__label">{label}</label> : ""}
      <select
        id="select"
        className={"form__input " + additionalClass}
        {...props}>
        <option value="">--Choose an option--</option>
        {options.map((option, key) => <option key={key} value={option}>{option + "km"}</option>)}
      </select>
    </div>
  );
};

const FormInputBetween = ({ label, id, val1, val2, onChangeFrom, onChangeTo, type = "text", additionalClass, ...props }) => {
  return (
    <div className="form__group">

      {label ? <label htmlFor={id} className="form__label">{label}</label> : ""}

      <div className="form__group center">
        <input
          type={type}
          id={id}
          value={val1}
          className={"form__input form__between " + additionalClass}
          onChange={onChangeFrom}
          {...props}/>
        <label> to </label>
        <input
          type={type}
          id={id}
          value={val2}
          min={val1}
          className={"form__input form__between " + additionalClass}
          onChange={onChangeTo}
          {...props}/>
      </div>

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

export { Form, FormInput, FormFooterText, FormRadios, FormInputSelect, FormInputBetween };