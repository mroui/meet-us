import React, { Component } from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import { message } from "antd";
import { FormInput, FormFooterText } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import MapLocationPicker from "../../components/GoogleMaps/MapLocationPicker/MapLocationPicker";
import "./CreateChannel.style.scss";

class Step1 extends Component {
  state = { 
    validTitle: false,
    validDate: false,
    validTime: false,
    validPrice: true,
    validContact: false
  }

  valueValid() {
    const { validTitle, validDate, validTime, validPrice, validContact } = this.state;

    if (!validTitle) {
      message.error(`Event title is too short`);
      return false;
    }
    if (!validDate) {
      message.error(`Event date format is incorrect`);
      return false;
    }
    if (!validTime) {
      message.error(`Event time format is incorrect`);
      return false;
    }
    if (!validPrice) {
      message.error(`Event price is too big`);
      return false;
    }
    if (!validContact) {
      message.error(`Contact details are too short`);
      return false;
    }
    return true;
  }

  validChannelTitle(e) {
    const { onTitleChange } = this.props;
    onTitleChange(e);

    if (e.target.value.length > 3) {
      this.setState({validTitle: true});
    } else {
      this.setState({validTitle: false});
    }
  }

  validChannelDate(e) {
    const { onDateChange } = this.props;
    onDateChange(e);

    if (e.target.value!=null) {
      this.setState({validDate: true});
    } else {
      this.setState({validTitle: false});
    }
  }

  validChannelTime(e) { 
    const { onTimeChange } = this.props;
    onTimeChange(e);

    if (e.target.value!=null) {
      this.setState({validTime: true});
    } else {
      this.setState({validTime: false});
    }
  }

  validChannelPrice(e) {
    const { onPriceChange } = this.props;
    onPriceChange(e);

    if (e.target.value<10000) {
      this.setState({validPrice: true});
    } else {
      this.setState({validPrice: false});
    }
  }

  validChannelContact(e) {
    const { onContactChange } = this.props;
    onContactChange(e);

    if (e.target.value.length > 3) {
      this.setState({validContact: true});
    } else {
      this.setState({validContact: false});
    }
  }

  getTodayDate = () => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if(dd<10) dd="0"+dd;
    if(mm<10) mm="0"+mm;
    return (yyyy+"-"+mm+"-"+dd);
  }

  render() {
    const { canGoNext, title, description, onDescriptionChange, nextStep, 
      date, time, price, contact } = this.props;

    const { validTitle } = this.state;
    const isStepValid = canGoNext();
    const nextStepBtnClasses = (validTitle && isStepValid) ? "form__btn" : "form__btn is-disabled";

    return (
      <div className="page__wrapper page__wrapper--absolute steps__wrapper">
        <h1 className="form__heading">Create Event</h1>

        <FormInput
          label="Event Title"
          id="title"
          placeholder="Name your event"
          minLength="3"
          value={title}
          onChange={e => this.validChannelTitle(e)} />

        <FormInput
          label="Describe your event (optional)"
          id="description"
          placeholder="Cool things about your event..."
          value={description}
          onChange={onDescriptionChange} />

        <FormInput
          label="Date"
          id="date"
          type="date"
          min={this.getTodayDate()}
          value={date}
          onChange={e => this.validChannelDate(e)} />

        <FormInput
          label="Time"
          id="time"
          type="time"
          value={time}
          onChange= {e => this.validChannelTime(e)}/>

        <FormInput
          label="Price [$]"
          id="price"
          type="number"
          min="0"
          max="10000"
          value={price}
          onChange={e => this.validChannelPrice(e)} />

        <FormInput
          label="Contact"
          id="contact"
          placeholder="Telephone number, e-mail address..."
          minLength="3"
          value={contact}
          onChange={e => this.validChannelContact(e)} />

        <Button variant="primary" additionalClass={nextStepBtnClasses}
          onClick={(e) => this.valueValid() && canGoNext() && nextStep(e)}>Next Step</Button>

        <div className="form__footer">
          <FormFooterText><a href="/" className="form__link">Go back</a> to the Homepage</FormFooterText>
        </div>
      </div>
    );
  }
}

class Step2 extends Component {
  state = { location: {name: ""} };

  onLocationPick = marker => {
    const { onLocationChange } = this.props;
    this.setState({ location: marker });
    if (onLocationChange) onLocationChange(marker);
  };
  
  getSubmitClasses = loc => (loc.name) ? "form__btn maps__btn" : "form__btn maps__btn is-disabled";

  render() {
    const { location } = this.state;
    const { channelTitle } = this.props;

    return (
      <>
        <MapLocationPicker onLocationPick={this.onLocationPick}/>
        <span className="maps__location">#{channelTitle}</span>

        <div className="maps__wrapper">
          <h1 className="form__heading is-hidden">Choose Location</h1>
          <FormInput
            id="address"
            placeholder="Selected Location"
            additionalClass="maps__input"
            disabled={true}
            value={location.name} />
          <Button variant="primary" type="submit" additionalClass={this.getSubmitClasses(location)}>Create Event</Button>
        </div>
      </>
    );
  }
}

class CreateChannel extends Component {
  state = {
    currentStep: 1,
    channelTitle: "",
    channelDescription: "",
    channelLocation: "",
    channelLocationDesc: "",
    channelDate: "",
    channelTime: "",
    channelPrice: 0,
    channelContact: "",
    isValid: true
  }

  canSubmitForm  = () => {
    const { channelTitle, channelLocation, channelLocationDesc, channelDate, channelTime, channelContact } = this.state;
    return (channelTitle && channelLocation && channelLocationDesc && channelDate && channelTime && channelContact);
  }

  handleFormSubmit = async e => {
    const {mutate: createChannel} = this.props;
    e.preventDefault();

    if (this.canSubmitForm()) {
      const { channelTitle, channelDescription, channelLocation, channelLocationDesc, channelDate, channelTime, channelPrice, channelContact } = this.state;
      const chatroom = {name: channelTitle, description: channelDescription, locationName: channelLocationDesc, active: true, date: channelDate, time: channelTime, price: parseInt(channelPrice), contact: channelContact, createdAt: Date.now(), ...channelLocation, };
      if (createChannel) {
        const {data: {createNewChatroom: newChatroomId}} = await createChannel({variables: {chatroom}});

        if (newChatroomId) {
          this.props.history.push(`/chat/${newChatroomId}`);
        }
      }
    }
  }

  canProceedToStep2 = () => {
    const { isValid, channelTitle, channelDate, channelTime, channelContact } = this.state;
    return isValid && channelTitle.length && channelDate && channelTime && channelContact;
  }

  handleTitleChange = evt => {
    this.setState({channelTitle: evt.target.value});
  }

  handleDescriptionChange = evt => {
    this.setState({channelDescription: evt.target.value});
  }

  handleLocationChange = ( marker ) => {
    this.setState({channelLocation: {latitude: marker.position.lat(), longitude: marker.position.lng()}, channelLocationDesc: marker.description});
  }

  handleDateChange = evt => {
    this.setState({channelDate: evt.target.value});
  }

  handleTimeChange = evt => {
    this.setState({channelTime: evt.target.value});
  }

  handlePriceChange = evt => {
    this.setState({channelPrice: evt.target.value});
  }

  handleContactChange = evt => {
    this.setState({channelContact: evt.target.value});
  }

  nextStep = () => {
    const currentStep = this.state.currentStep + 1;
    this.setState({currentStep: currentStep});
  }

  renderCurrentStep = currentStep => {
    const { channelTitle, channelDescription, channelAddress, 
      channelDate, channelTime, channelPrice, channelContact } = this.state;

    switch (currentStep) {
    case 1:
      return (
        <Step1
          currentStep={currentStep}
          title={channelTitle}
          onTitleChange={this.handleTitleChange}
          description={channelDescription}
          onDescriptionChange={this.handleDescriptionChange}
          date={channelDate}
          onDateChange={this.handleDateChange}
          time={channelTime}
          onTimeChange={this.handleTimeChange}
          price={channelPrice}
          onPriceChange={this.handlePriceChange}
          contact={channelContact}
          onContactChange={this.handleContactChange}
          canGoNext={this.canProceedToStep2}
          nextStep={this.nextStep}
        />
      );
    case 2:
      return (
        <Step2
          currentStep={currentStep}
          value={channelAddress}
          onLocationChange={this.handleLocationChange}
          channelTitle={channelTitle}
          onCreateChannel={this.handleCreateChannel}
        />
      );
    }
  }

  render() {
    const { currentStep } = this.state;

    return (
      <div className="page">
        <div className="page__wrapper">
          <form className="form" onSubmit={this.handleFormSubmit}>
            {this.renderCurrentStep(currentStep)}
          </form>
        </div>
      </div>
    );
  }
}

const CREATE_CHANNEL = gql`
  mutation ($chatroom: CreateChatRoomInput!) {
    createNewChatroom(chatroom: $chatroom)
  }
`;

export default graphql(CREATE_CHANNEL)(withRouter(CreateChannel));