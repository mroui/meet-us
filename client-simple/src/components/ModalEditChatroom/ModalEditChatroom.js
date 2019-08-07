import React from "react";
import Modal from "../../components/Modal/Modal";
import { FormInput } from "../../components/Form/Form";
import Button from "../../components/Button/Button";

const ModalEditChatroom = ({ state, chatroom, toggleEditModal, 
  onChangeTitleHandler, onChangeDescHandler, onChangeDateHandler,
  onChangeTimeHandler, onChangePriceHandler, onChangeContactHandler,
  handleFormEditEvent, getTodayDate }) => {

  const modalOpen = state.modalOpen;
  const modalHeading = "Edit \"" + chatroom.name + "\"";
  const modalDesc = "Fill fields which you want to change";
  const { tempTitle, tempDesc, tempDate, tempTime, tempPrice, tempContact } = state;

  return (
    <Modal
      id="edit_channel"
      heading={modalHeading}
      desc={modalDesc}
      modalOpen={modalOpen}
      closeModal={toggleEditModal}>
      <FormInput
        label="Title"
        id="title"
        placeholder="Name your event"
        minLength="3"
        value={tempTitle}
        onChange={onChangeTitleHandler}
      />
      <FormInput
        label="Description"
        id="description"
        placeholder="Cool things about your event..."
        value={tempDesc}
        onChange={onChangeDescHandler}
      />
      <FormInput
        label="Date"
        id="date"
        type="date"
        min={getTodayDate}
        value={tempDate}
        onChange={onChangeDateHandler}
      />
      <FormInput
        label="Time"
        id="time"
        type="time"
        value={tempTime}
        onChange={onChangeTimeHandler}
      />
      <FormInput
        label="Price [$]"
        id="price"
        type="number"
        min="0"
        max="10000"
        value={tempPrice}
        onChange={onChangePriceHandler}
      />
      <FormInput
        label="Contact"
        id="contact"
        placeholder="Telephone number, e-mail address..."
        minLength="3"
        value={tempContact}
        onChange={onChangeContactHandler}
      />
      <Button 
        variant="primary" 
        type="submit" 
        additionalClass="modal__btn" 
        onClick={handleFormEditEvent}>Accept changes</Button>
    </Modal>
  );
};

export default ModalEditChatroom;