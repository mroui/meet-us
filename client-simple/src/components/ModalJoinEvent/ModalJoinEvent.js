import React from "react";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";

const ModalJoinEvent = ({ title, isCurrentUserInMembers, modalOpen, toggleJoinModal, joinLeaveEvent }) => {
  const modalHeading = (!isCurrentUserInMembers ? "Joining " : "Leaving ") + "\"" + title + "\"";
  const modalDesc = !isCurrentUserInMembers ? "Do you really want to join to this event?" : "Do you really want to leave this event?";
  return (
    <Modal
      id="join_event_modal"
      heading={modalHeading}
      desc={modalDesc}
      modalOpen={modalOpen}
      closeModal={toggleJoinModal}>
      <Button 
        variant="primary" 
        type="submit" 
        additionalClass="modal__btn" 
        onClick={joinLeaveEvent}>Yes, I want.</Button>
      <Button 
        variant="primary" 
        type="submit" 
        additionalClass="modal__btn" 
        onClick={toggleJoinModal}>No, forget it.</Button>
    </Modal>
  );
};

export default ModalJoinEvent;