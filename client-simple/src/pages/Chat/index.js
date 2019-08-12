import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { message } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatMessages from "../../components/Chat/ChatMessages";
import EventMembers from "../../components/Event/EventMembers";
import Button from "../../components/Button/Button";
import withSocket from "../../components/withSocket";
import "./Chat.style.scss";
import _ from "lodash";
import withUserContext from "../../components/withUserContext";
import TogglerActiveChatroom from "../../components/TogglerActiveChatroom/TogglerActiveChatroom";
import question from "../../assets/images/question.png";
import ModalEditChatroom from "../../components/ModalEditChatroom/ModalEditChatroom";
import ModalHelpCommand from "../../components/ModalHelpCommand/ModalHelpCommand";
import ModalDeleteChatroom from "../../components/ModalDeleteChatroom/ModalDeleteChatroom";
import ModalJoinEvent from "../../components/ModalJoinEvent/ModalJoinEvent";
import "../../../node_modules/emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart/dist-modern/index";


class Chat extends Component {
  state = {
    inputMessageText: "",
    guestId: localStorage.getItem("guest_ID") || null,
    guestName: localStorage.getItem("guest_Username") || null,
    modalOpen: false,
    modalHelpOpen: false,
    modalDeleteOpen: false,
    modalJoinOpen: false,
    chatroom: null,
    tempTitle: "",
    tempDesc: "",
    tempDate: "",
    tempTime: "",
    tempPrice: "",
    tempContact: "",
    joinPerson: false,
    leavePerson: false,
    jokes: [
      "What is red and smell like blue paint?\n...\nRED PAINT! :)",
      "What do you call bears with no ears?\n...\nB! :)",
      "What is orange and sounds like a carrot?\n...\nPARROT! :)",
      "What is an astronaut's favourite part on a computer?\n...\nTHE SPACE BAR! :)",
      "Where does Batman go to the bathroom\n...\nTHE BATHROOM! :)"],
    commandsDescription: "/help - list of all comands\n/desc - description of event\n" +
      "/date - date of event\n/time - time of event\n/price - price of event\n/contact - contact like email or phone number"
  };

  loggedUserId = () => _.get(this.props, ["context", "userState", "user", "id"], null);
  loggedUserName = () => _.get(this.props, ["context", "userState", "user", "profile", "firstName"], null);

  componentDidMount = async () => {
    const { socket } = this.props;
    const { chatId } = this.props.match.params;

    socket.on("connection", this.emitJoinSocketRoomRequest(chatId));
    socket.on("chatroomUpdate", chatroom => this.handleUpdateChatroom(chatroom));
    socket.on("chatroomDelete", this.backToHome); 
  };

  componentWillUpdate = () => {
    if (!this.props.chatroom.loading && !this.props.chatroom.name) this.backToHome();
  }

  componentDidUpdate() {
    this.props.chatroom.refetch();
  }

  backToHome = () => {
    message.error("Event is deleted or not exists!");
    this.props.history.push("/");
  }

  //owner & members are not changable so there're not in chatroom variable
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
      members: this.props.chatroom.members}});
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

  addBotMessage = (msg) => {
    const guestName = "HELPBOT";
    const { chatId: chatroom } = this.props.match.params;

    return {
      guestId: "0",
      guestName,
      msg,
      chatroom,
      nickname: guestName
    };
  }

  checkCommand = (input) => {
    const chatroom = this.state.chatroom ? this.state.chatroom : this.props.chatroom;

    if (input.startsWith("/")) {
      const preCommand = input.split(" ")[0];
      const command = preCommand.substring(1);
      let message = "You have used: " + preCommand + ".\n";

      switch(command) {
      case "desc": message += "Description of the event is:\n" + chatroom.description; break;
      case "date": message += "Date of the event is: " + chatroom.date; break;
      case "time": message += "Time of the event is: " + chatroom.time; break;
      case "price": message += "Price of the event is: " + chatroom.price + "$"; break;
      case "contact": message += "Contact:\n" + chatroom.contact; break;
      case "help": message += "List of commands you can use:\n" + this.state.commandsDescription; break;
      default: message += "There's no command like that"; break;
      }
      if(command!=="help") message += ".\n\nEnter /help for more commands";

      //EASTEREGG :D
      const rand = Math.floor(Math.random() * 5); // 0 - 4
      if (command==="joke") message = this.state.jokes[rand];

      return this.props.addMessage({variables: this.addBotMessage(message)});
    }
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
        return (
          this.props.addMessage({variables: this.prepareDataForMutation()}),
          this.checkCommand(inputMessageText)
        );
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
    const chatroom = this.state.chatroom ? this.state.chatroom : this.props.chatroom;
    const { name, description, latitude, longitude, locationName, date, time, price, contact } = chatroom;
    const id = this.state.chatroom ? this.state.chatroom._id : this.props.chatroom.variables._id;
    const newChatroom = {name, description, latitude, longitude, locationName, active: !chatroom.active, date, time, price: parseInt(price), contact };

    const msg = !chatroom.active ? "/INFO:\nChatroom is enabled by the owner" :  "/INFO:\nChatroom is disabled by the owner";
    
    return (
      this.props.updateChatroom({
        variables: { chatroom: newChatroom, chatroomId: id }
      }),
      this.props.addMessage({
        variables: this.addBotMessage(msg)
      })
    );
  }

  toggleEditModal = () => {
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
    if (this.valueValid()) {
      const chatroom =  this.state.chatroom ? this.state.chatroom : this.props.chatroom;
      const { latitude, longitude, locationName } = chatroom;
      const id = this.state.chatroom ? this.state.chatroom._id : this.props.chatroom.variables._id;
      const { tempTitle, tempDesc, tempDate, tempTime, tempPrice, tempContact } = this.state;

      this.toggleEditModal();

      if(chatroom.name===tempTitle && chatroom.description===tempDesc &&
        chatroom.date===tempDate && chatroom.time===tempTime &&
        chatroom.price===tempPrice && chatroom.contact===tempContact) {
        return false;
      }

      const newChatroom = {
        name: tempTitle,
        description: tempDesc,
        latitude,
        longitude,
        locationName,
        active: true,
        date: tempDate,
        time: tempTime,
        price: parseInt(tempPrice),
        contact: tempContact
      };
      
      return (
        this.props.updateChatroom({
          variables: { chatroom: newChatroom, chatroomId: id }
        }),
        this.props.addMessage({
          variables: this.addBotMessage("/INFO:\nEvent is edited by the owner")
        })
      );
    }
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

  deleteEvent = () => {
    const id = this.state.chatroom ? this.state.chatroom._id : this.props.chatroom.variables._id;
    this.props.deleteChatroom({
      variables: { chatroomId: id }
    });
  }

  joinLeaveEvent = (isCurrentUserInMembers) => {
    if (isCurrentUserInMembers) this.setState({leavePerson: true});
    else this.setState({joinPerson: true});
  }

  endJoinLeaveEvent = () => {
    this.setState({
      joinPerson: false,
      leavePerson: false,
      modalJoinOpen: false
    });
  }

  render() {
    const { inputMessageText, joinPerson, leavePerson } = this.state;
    let { match, chatroom } = this.props;

    if (this.state.chatroom) chatroom = this.state.chatroom;

    const isCurrentUserInMembers = chatroom.members ? chatroom.members.find((user) => {return user._id === this.loggedUserId();}) : false;
    const joinEventTitle = !isCurrentUserInMembers  ? "Join Event" : "Leave Event";

    return (
      <div className="page">
        <Sidebar>
          <EventMembers 
            loggedUserId={this.loggedUserId()}
            loggedUserName={this.loggedUserName()}
            match={match}
            chatroom={chatroom}
            joinPerson={joinPerson}
            leavePerson={leavePerson}
            endJoinLeaveEvent={this.endJoinLeaveEvent}/>
        </Sidebar>

        <section className="page__content">
          <div className="chat__wrapper">
            <header className="page__header">
              <h2 className="page__heading">{chatroom && chatroom.name}</h2>
              <Button href="/" additionalClass="chat__back" isLink>To Event List</Button>
              {(chatroom.owner && chatroom.owner._id === this.loggedUserId()) 
                ? <span style={{display: "flex"}}><TogglerActiveChatroom isChecked={chatroom.active} toggleActive={this.toggleActiveChatroom} />
                  <Button additionalClass="chat__back" onClick={() => this.toggleEditModal()}>Edit Event</Button>
                  <Button additionalClass="chat__back" onClick={() => this.setState({modalDeleteOpen: !this.state.modalDeleteOpen})}>Delete Event</Button></span>
                : (this.loggedUserId() ? <Button additionalClass="chat__back" onClick={() => this.setState({modalJoinOpen: !this.state.modalJoinOpen})}>{joinEventTitle}</Button> : null)}
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
                {/* <Picker/> //TODO--------------------------------------------------------------------------------------------*/}
                <p style={{display: "flex", margin: "0px"}}>
                  <p className="chat__img">{String.fromCodePoint(0x1f60a)}</p>
                  <img src={ question } className="chat__img" alt="" onClick={() => this.setState({modalHelpOpen: !this.state.modalHelpOpen})} />
                </p>
                <Button variant="primary" additionalClass="chat__btn">Send</Button>
              </form>
            </div>
          </div>
        </section>
        
        <ModalEditChatroom
          state={this.state}
          chatroom={chatroom}
          toggleEditModal={this.toggleEditModal}
          onChangeTitleHandler={e => this.setState({tempTitle: e.target.value})}
          onChangeDescHandler={e => this.setState({tempDesc: e.target.value})}
          onChangeDateHandler={e => this.setState({tempDate: e.target.value})}
          onChangeTimeHandler={e => this.setState({tempTime: e.target.value})}
          onChangePriceHandler={e => this.setState({tempPrice: e.target.value})}
          onChangeContactHandler={e => this.setState({tempContact: e.target.value})}
          handleFormEditEvent={this.handleFormEditEvent}
          getTodayDate={this.getTodayDate()}/>

        <ModalHelpCommand
          modalOpen={this.state.modalHelpOpen}
          toggleHelpModal={() => this.setState({modalHelpOpen: !this.state.modalHelpOpen})}
          commandsDescription={this.state.commandsDescription}/>

        <ModalDeleteChatroom
          state={this.state}
          chatroom={chatroom}
          toggleDeleteModal={() => this.setState({modalDeleteOpen: !this.state.modalDeleteOpen})}
          deleteEvent={this.deleteEvent}/>

        <ModalJoinEvent
          modalOpen={this.state.modalJoinOpen}
          toggleJoinModal={() => this.setState({modalJoinOpen: !this.state.modalJoinOpen})}
          title={chatroom.name}
          joinLeaveEvent={() => this.joinLeaveEvent(isCurrentUserInMembers)}
          isCurrentUserInMembers={isCurrentUserInMembers}/>
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
            members {
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

const UPDATE_CHATROOM = gql`
  mutation ($chatroom: CreateChatRoomInput!, $chatroomId: String!) {
    updateChatroom(chatroom: $chatroom,  chatroomId: $chatroomId) {
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

const DELETE_CHATROOM = gql`
  mutation ($chatroomId: String!) {
    deleteChatroom(chatroomId: $chatroomId) 
  }
`;

const withCurrentChatroom = graphql(GET_CURRENT_CHATROOM, {
  options: (props) => ({ variables: { _id: props.match.params.chatId }}),
  props: ({data: {chatroom, ...others}}) => ({chatroom: {...others, ...chatroom}})
});

const withAddMessage = graphql(ADD_MESSAGE, { name: "addMessage"});

const withUpdateChatroom = graphql(UPDATE_CHATROOM, { name: "updateChatroom"});

const withDeleteChatroom = graphql(DELETE_CHATROOM, {name: "deleteChatroom"});

export default compose(withCurrentChatroom, withAddMessage, withUpdateChatroom, withDeleteChatroom)(withSocket(withUserContext(Chat)));