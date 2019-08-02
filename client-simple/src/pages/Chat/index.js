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


class Chat extends Component {
  state = {
    inputMessageText: "",
    guestId: localStorage.getItem("guest_ID") || null,
    guestName: localStorage.getItem("guest_Username") || null,
    modalOpen: false,
    chatroom: null
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
  }


  renderModal() {
    const modalOpen = this.state.modalOpen;
    const chatroom = this.state.chatroom ? this.state.chatroom : this.props.chatroom
    const modalHeading = "Edit \"" + chatroom + "\"";
    const modalDesc = "Fill fields which you want to change";

    return (
      <Modal
        id="edit_channel"
        heading={modalHeading}
        desc={modalDesc}
        modalOpen={modalOpen}
        closeModal={() => this.toggleModal()}>
        <form className="form">
          {//-----------------------------------------------------------------------------TODO: add form for edit changes of event
            /* <FormInput
            label="Your username"
            id="username"
            placeholder="Username"
          /> */}
          <Button variant="primary" type="submit" additionalClass="modal__btn">Accept changes</Button>
        </form>
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