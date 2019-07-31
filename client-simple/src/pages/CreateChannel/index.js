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
  state = { validTitle: false }

  valueValid() {
    const { validTitle } = this.state;

    if (!validTitle) {
      message.error(`Channel title is too short`);
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

  render() {
    const { canGoNext, title, description, onDescriptionChange, nextStep } = this.props;
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
          value={title}
          onChange={e => this.validChannelTitle(e)} />

        <FormInput
          label="Describe your event (optional)"
          id="description"
          placeholder="Cool things about your event..."
          value={description}
          onChange={onDescriptionChange} />

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
    if (onLocationChange) onLocationChange(marker.position);
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
    isValid: true
  }

  canSubmitForm  = () => {
    const { channelTitle, channelLocation } = this.state;
    return (channelTitle && channelLocation);
  }

  handleFormSubmit = async e => {
    const {mutate: createChannel} = this.props;
    e.preventDefault();

    if (this.canSubmitForm()) {
      const { channelTitle, channelDescription, channelLocation} = this.state;
      const chatroom = {name: channelTitle, description: channelDescription, ...channelLocation};

      if (createChannel) {
        const {data: {createNewChatroom: newChatroomId}} = await createChannel({variables: {chatroom}});

        if (newChatroomId) {
          this.props.history.push(`/chat/${newChatroomId}`);
        }
      }
    }
  }

  canProceedToStep2 = () => {
    const { isValid, channelTitle } = this.state;
    return isValid && channelTitle.length;
  }

  handleTitleChange = evt => {
    this.setState({channelTitle: evt.target.value});
  }

  handleDescriptionChange = evt => {
    this.setState({channelDescription: evt.target.value});
  }

  handleLocationChange = ({ lat, lng }) => {
    this.setState({channelLocation: {latitude: lat(), longitude: lng()}});
  }

  nextStep = () => {
    const currentStep = this.state.currentStep + 1;
    this.setState({currentStep: currentStep});
  }

  renderCurrentStep = currentStep => {
    const { channelTitle, channelDescription, channelAddress } = this.state;

    switch (currentStep) {
    case 1:
      return (
        <Step1
          currentStep={currentStep}
          title={channelTitle}
          onTitleChange={this.handleTitleChange}
          description={channelDescription}
          onDescriptionChange={this.handleDescriptionChange}
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