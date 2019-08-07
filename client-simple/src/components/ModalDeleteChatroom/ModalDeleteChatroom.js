import React from "react";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";

const ModalDeleteChatroom = ({ state, chatroom, toggleDeleteModal, deleteEvent }) => {
  const modalOpen = state.modalDeleteOpen;
  const modalHeading = "Delete \"" + chatroom.name + "\"?";
  const modalDesc = "Do you want to delete this event? All messages will be lost!";

  return (
    <Modal
      id="delete_commands_modal"
      heading={modalHeading}
      desc={modalDesc}
      modalOpen={modalOpen}
      closeModal={toggleDeleteModal}>
      <Button 
        variant="primary" 
        type="submit" 
        additionalClass="modal__btn" 
        onClick={deleteEvent}>Yes, I know what I'm doing!</Button>
      <Button 
        variant="primary" 
        type="submit" 
        additionalClass="modal__btn" 
        onClick={toggleDeleteModal}>No, take me away from here!</Button>
    </Modal>
  );
};

export default ModalDeleteChatroom;