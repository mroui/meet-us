import React from "react";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";

const ModalHelpCommand = ({ modalOpen, toggleHelpModal, commandsDescription }) => {
  const modalHeading = "Commands";
  const modalDesc = "Commands which you can type in a message to HelpBot:";

  return (
    <Modal
      id="help_commands_modal"
      heading={modalHeading}
      desc={modalDesc}
      modalOpen={modalOpen}
      closeModal={toggleHelpModal}>
      <div className="modal__textarea">
        {commandsDescription}
      </div>
      <Button 
        variant="primary" 
        type="submit" 
        additionalClass="modal__btn" 
        onClick={toggleHelpModal}>I understand</Button>
    </Modal>
  );
};

export default ModalHelpCommand;