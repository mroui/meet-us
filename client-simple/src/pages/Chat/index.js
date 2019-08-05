import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { message } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatMessages from "../../components/Chat/ChatMessages";
import ChatUsers from "../../components/Chat/ChatUsers";
import Button from "../../components/Button/Button";
import withSocket from "../../components/withSocket";
import "./Chat.style.scss";
import _ from "lodash";
import withUserContext from "../../components/withUserContext";
import TogglerActiveChatroom from "../../components/TogglerActiveChatroom/TogglerActiveChatroom";
import Modal from "../../components/Modal/Modal";
import { Form, FormInput } from "../../components/Form/Form";


class Chat extends Component {
  state = {
    inputMessageText: "",
    guestId: localStorage.getItem("guest_ID") || null,
    guestName: localStorage.getItem("guest_Username") || null,
    modalOpen: false,
    chatroom: null,
    tempTitle: "",
    tempDesc: "",
    tempDate: "",
    tempTime: "",
    tempPrice: "",
    tempContact: ""
  };


  loggedUserId = () => _.get(this.props, ["context", "userState", "user", "id"], null);
  loggedUserName = () => _.get(this.props, ["context", "userState", "user", "profile", "firstName"], null);


  componentDidMount = async () => {
    const { socket } = this.props;
    const { chatId } = this.props.match.params;

    socket.on("connection", this.emitJoinSocketRoomRequest(chatId));
    socket.on("chatroomUpdate", chatroom => this.handleUpdateChatroom(chatroom));
  };


  //owner & users are not changable so there're not in chatroom variable
  handleUpdateChatroom = chatroom => {
    this.setState({chatroom: { 
      _id: chatroom._id, 
      description: chatroom.description, 
      latitude: chatroom.latitude, 
      longitude: chatroom.longitude, 
      name: chatroom.name, 
      date: chatroom.date, 
      time: chatroom.time, 
      price: chatroom.price,
      contact: chatroom.contact, 
      locationName: chatroom.locationName,
      active: chatroom.active,
      owner: this.props.chatroom.owner,
      users: this.props.chatroom.users}});
  }


  isValidUserOrGuest = () => {
    const { guestName, guestId } = this.state;

    if (!(guestName && guestId) && !(this.loggedUserName() && this.loggedUserId())) {
      message.error(`Please either login or use guest account`);
      return false;
    }
    return true;
  };


  emitJoinSocketRoomRequest = chatId => {
    const { socket } = this.props;
    socket.emit("join", chatId);
  };


  prepareDataForMutation = () => {
    const { inputMessageText: msg, guestId, guestName } = this.state;
    const { chatId: chatroom } = this.props.match.params;
    const loggedUserId = this.loggedUserId();

    return {
      ...((loggedUserId) ? {from: loggedUserId} : {guestId, guestName}),
      msg,
      chatroom,
      nickname: this.loggedUserName() || guestName || "Unknown User"
    };
  };


  addBotMessage = () => {
    const guestName = "HELPBOT";
    const chatActive = this.state.chatroom ? this.state.chatroom.active : this.props.chatroom.active;
    const msg = chatActive ? "/INFO: Chatroom is disabled!" : "/INFO: Chatroom is enabled!";
    const { chatId: chatroom } = this.props.match.params;

    return {
      guestId: "0",
      guestName,
      msg,
      chatroom,
      nickname: guestName
    };
  }


  handleFormSubmit = e => {
    e.preventDefault();

    const chatroom = this.state.chatroom ? this.state.chatroom : this.props.chatroom;
    if (!chatroom.active){
      this.setState({inputMessageText: ""});
      message.error("Sorry, chatroom is disabled!");
      return;
    }

    if (this.isValidUserOrGuest()) {
      const { inputMessageText } = this.state;

      if (inputMessageText.length > 0) {
        this.setState({inputMessageText: ""});
        return this.props.addMessage({variables: this.prepareDataForMutation()});
      } else {
        message.error("Message is empty");
      }
    }
  }


  onEnterPress = e => {
    if (e.which === 13 && e.shiftKey === false) {
      this.handleFormSubmit(e);
    }
  };


  toggleActiveChatroom = e => {
    const stateChatroom = this.state.chatroom;

    const active = stateChatroom ? !stateChatroom.active : !this.props.chatroom.active;
    const { name, description, latitude, longitude, locationName, date, time, price, contact } = stateChatroom ? stateChatroom : this.props.chatroom;
    const id = stateChatroom ? stateChatroom._id : this.props.chatroom.variables._id;

    const chatroom = {name, description, latitude, longitude, locationName, active, date, time, price: parseInt(price), contact };
    
    return (
      this.props.updateActivityChatroom({
        variables: { chatroom, chatroomId: id }
      }),
      this.props.addMessage({
        variables: this.addBotMessage()
      })
    );
  }


  toggleModal = () => {
    this.setState({modalOpen: !this.state.modalOpen});

    const chatroom = this.state.chatroom ? this.state.chatroom : this.props.chatroom;
    this.setTempChatroom(chatroom);
  }


  setTempChatroom = (chatroom) => {
    this.setState({
      tempTitle: chatroom.name,
      tempDesc: chatroom.description,
      tempDate: chatroom.date,
      tempTime: chatroom.time,
      tempPrice: chatroom.price,
      tempContact: chatroom.contact
    });
  }


  handleFormEditEvent = () => {
    if (this.valueValid()) console.log("editing")
  }


  valueValid() {
    const { tempTitle, tempDate, tempTime, tempPrice, tempContact } = this.state;

    if (tempTitle.length <= 3) {
      message.error(`Event title is too short`);
      return false;
    }
    if (tempDate==null) {
      message.error(`Event date format is incorrect`);
      return false;
    }
    if (tempTime==null) {
      message.error(`Event time format is incorrect`);
      return false;
    }
    if (tempPrice >= 10000) {
      message.error(`Event price is too big`);
      return false;
    }
    if (tempPrice < 0) {
      message.error(`Event price is too small`);
      return false;
    }
    if (tempContact.length <= 3) {
      message.error(`Contact details are too short`);
      return false;
    }

    return true;
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


  renderModal() {
    const modalOpen = this.state.modalOpen;
    const chatroom = this.state.chatroom ? this.state.chatroom : this.props.chatroom;
    const modalHeading = "Edit \"" + chatroom.name + "\"";
    const modalDesc = "Fill fields which you want to change";

    const { tempTitle, tempDesc, tempDate, tempTime, tempPrice, tempContact } = this.state;

    return (
      <Modal
        id="edit_channel"
        heading={modalHeading}
        desc={modalDesc}
        modalOpen={modalOpen}
        closeModal={this.toggleModal}>
        <FormInput
          label="Title"
          id="title"
          placeholder="Name your event"
          minLength="3"
          value={tempTitle}
          onChange={e => this.setState({tempTitle: e.target.value})}
        />
        <FormInput
          label="Description"
          id="description"
          placeholder="Cool things about your event..."
          value={tempDesc}
          onChange={e => this.setState({tempDesc: e.target.value})}
        />
        <FormInput
          label="Date"
          id="date"
          type="date"
          min={this.getTodayDate()}
          value={tempDate}
          onChange={e => this.setState({tempDate: e.target.value})}
        />
        <FormInput
          label="Time"
          id="time"
          type="time"
          value={tempTime}
          onChange={e => this.setState({tempTime: e.target.value})}
        />
        <FormInput
          label="Price [$]"
          id="price"
          type="number"
          min="0"
          max="10000"
          value={tempPrice}
          onChange={e => this.setState({tempPrice: e.target.value})}
        />
        <FormInput
          label="Contact"
          id="contact"
          placeholder="Telephone number, e-mail address..."
          minLength="3"
          value={tempContact}
          onChange={e => this.setState({tempContact: e.target.value})}
        />
        <Button 
          variant="primary" 
          type="submit" 
          additionalClass="modal__btn" 
          onClick={this.handleFormEditEvent}>Accept changes</Button>
      </Modal>
    );
  }


  render() {
    const { inputMessageText } = this.state;
    let { match, chatroom } = this.props;
    if (this.state.chatroom)
      chatroom = this.state.chatroom;

    return (
      <div className="page">
        <Sidebar>
          <ChatUsers loggedUserId={this.loggedUserId()} match={match} chatroom={chatroom} />
        </Sidebar>

        <section className="page__content">
          <div className="chat__wrapper">
            <header className="page__header">
              <h2 className="page__heading">{chatroom && chatroom.name}</h2>
              <Button href="/" additionalClass="chat__back" isLink>To Event List</Button>
              {(chatroom.owner && chatroom.owner._id === this.loggedUserId()) 
                ? <span style={{display: "flex"}}><TogglerActiveChatroom isChecked={chatroom.active} toggleActive={this.toggleActiveChatroom} />
                  <Button additionalClass="chat__back" onClick={() => this.toggleModal()}>Edit Event</Button></span>
                : null}
            </header>

            <div className="chat__content">
              <ChatMessages match={match} />
            </div>

            <div className="chat__footer">
              <form className="form chat__form" onSubmit={this.handleFormSubmit}>
                <textarea
                  value={chatroom.active ? inputMessageText : ""}
                  name="message"
                  id="message"
                  className="chat__textarea"
                  placeholder={chatroom.active ? "Enter your message here..." : "Sorry, chatroom is disabled!"}
                  onKeyPress={this.onEnterPress}
                  onChange={e => this.setState({inputMessageText: e.target.value})}
                  disabled={!chatroom.active}
                />
                <Button variant="primary" additionalClass="chat__btn">Send</Button>
              </form>
            </div>
          </div>
        </section>
        {this.renderModal()}
      </div>
    );
  }
}

const GET_CURRENT_CHATROOM = gql`
    query($_id: String!) {
        chatroom(_id: $_id) {
            name
            description
            latitude
            longitude
            locationName
            active
            date
            time
            price
            contact
            users {
                _id
                profile {
                    firstName
                }
            }
            owner {
              _id 
            }
        }
    }
`;

const UPDATE_CHATROOM_ACTIVITY = gql`
  mutation ($chatroom: CreateChatRoomInput!, $chatroomId: String!) {
    updateActivityChatroom(chatroom: $chatroom,  chatroomId: $chatroomId) {
      name
      description
      date
      time
      price
      active
      contact
    }
  }
`;

const ADD_MESSAGE = gql`
  mutation ($guestId: String, $guestName: String, $msg: String!, $chatroom: ID!, $nickname: String!) {
    addMessage(message: {guestId: $guestId, guestName: $guestName, msg: $msg, chatroom: $chatroom, nickname: $nickname})
  }
`;

const withCurrentChatroom = graphql(GET_CURRENT_CHATROOM, {
  options: (props) => ({ variables: { _id: props.match.params.chatId }}),
  props: ({data: {chatroom, ...others}}) => ({chatroom: {...others, ...chatroom}})
});

const withAddMessage = graphql(ADD_MESSAGE, { name: "addMessage"});

const withUpdateActivityChatroom = graphql(UPDATE_CHATROOM_ACTIVITY, { name: "updateActivityChatroom"});

export default compose(withCurrentChatroom, withAddMessage, withUpdateActivityChatroom)(withSocket(withUserContext(Chat)));