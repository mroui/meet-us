import React from "react";
import CloseSvg from "../../assets/svg/close.svg";
import "./Modal.style.scss";

const Modal = ({ children, id, heading, desc, modalFooter, modalOpen, closeModal }) => {
  const wrapperClass = modalOpen ? "modal__wrapper is-active" : "modal__wrapper";

  return (
    <div id={id} className={wrapperClass} role="dialog">
      <div className="modal">
        <button className="modal__close" onClick={closeModal}>
          <img src={CloseSvg} className="modal__icon" alt="Close Modal" />
        </button>
        
        <header className="modal__header">
          <h3 className="modal__heading">{heading}</h3>
          <p className="modal__desc">{desc}</p>
        </header>

        <div className="modal__content">
          {children}
        </div>
        
        {modalFooter && (
          <div className="modal__footer">
            {modalFooter()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;