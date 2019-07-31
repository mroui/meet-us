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
import { FormInput } from "../../components/Form/Form";

class Chat extends Component {
  state = {
    inputMessageText: "",
    guestId: localStorage.getItem("guest_ID") || null,
    guestName: localStorage.getItem("guest_Username") || null,
    isActive: false,
    modalOpen: false,
    chatroomName: null
  };

  loggedUserId = () => _.get(this.props, ["context", "userState", "user", "id"], null);
  loggedUserName = () => _.get(this.props, ["context", "userState", "user", "profile", "firstName"], null);

  componentDidMount = async () => {
    const { socket } = this.props;
    const { chatId } = this.props.match.params;

    socket.on("connection", this.emitJoinSocketRoomRequest(chatId));
  };

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


  handleFormSubmit = e => {
    e.preventDefault();

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
    const active = !this.props.chatroom.active;
    const chatroom = this.props.chatroom.variables._id;

    this.setState({isActive: !this.state.isActive});
    return this.props.updateActivityChatroom({
      variables: { chatroom: chatroom, active: active },
      refetchQueries: () => [{
        query: GET_CURRENT_CHATROOM,
        variables: {
          _id: chatroom
        }
      }]
    });
  }


  componentWillReceiveProps(newProps) {
    this.setState({
      isActive: newProps.chatroom.active,
      chatroomName: newProps.chatroom.name
    });
  }

  toggleModal = () => {
    this.setState({modalOpen: !this.state.modalOpen});
  }

  renderModal() {
    const modalOpen = this.state.modalOpen;
    const modalHeading = "Edit \"" + this.state.chatroomName + "\"";
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
    const { match, chatroom } = this.props;

    return (
      
      <div className="page">
        <Sidebar>
          <ChatUsers loggedUserId={this.loggedUserId()} match={match} chatroom={chatroom} />
        </Sidebar>

        <section className="page__content">
          <div className="chat__wrapper">
            <header className="page__header">
              <h2 className="page__heading">{chatroom && chatroom.name}</h2>
              <Button href="/" additionalClass="chat__back" isLink>To Events List</Button>
              {(chatroom.owner && chatroom.owner._id === this.loggedUserId()) 
                ? <span style={{display: "flex"}}><TogglerActiveChatroom isChecked={chatroom.active} toggleActive={this.toggleActiveChatroom} />
                  <Button additionalClass="chat__back" onClick={() => this.toggleModal()}>Edit event</Button></span>
                : null}
            </header>

            <div className="chat__content">
              <ChatMessages match={match} />
            </div>

            <div className="chat__footer">
              <form className="form chat__form" onSubmit={this.handleFormSubmit}>
                <textarea
                  value={inputMessageText}
                  name="message"
                  id="message"
                  className="chat__textarea"
                  placeholder={chatroom.active ? "Enter your message here..." : "Sorry, chatroom is disabled!"}
                  onKeyPress={this.onEnterPress}
                  onChange={e => this.setState({inputMessageText: e.target.value})}
                  disabled={!chatroom.active}
                />
                <Button variant="primary"
                  additionalClass="chat__btn"
                  disabled={!chatroom.active}
                >Send</Button>
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
            users {
                _id
                profile {
                    firstName
                }
            }
            owner {
              _id 
            }
            active
        }
    }
`;

const UPDATE_CHATROOM_ACTIVITY = gql`
  mutation ($chatroom: String!, $active: Boolean!) {
    updateActivityChatroom(chatroom: $chatroom, active: $active) {
      name
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