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
import question from "../../assets/images/question.png";


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
    tempContact: "",
    modalHelpOpen: false,
    modalDeleteOpen: false,
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
    socket.on("chatroomDelete", this.handleDeleteChatroom); 
  };


  handleDeleteChatroom = () => {
    this.props.history.push("/");
  }


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
      case "desc":
        message += "Description of the event is:\n" + chatroom.description;
        break;
      case "date":
        message += "Date of the event is: " + chatroom.date;
        break;
      case "time":
        message += "Time of the event is: " + chatroom.time;
        break;
      case "price":
        message += "Price of the event is: " + chatroom.price + "$";
        break;
      case "contact":
        message += "Contact:\n" + chatroom.contact;
        break;
      case "help":
        message += "List of commands you can use:\n" + this.state.commandsDescription; 
        break;
      default:
        message += "There's no command like that";
        break;
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
    const stateChatroom = this.state.chatroom;

    const active = stateChatroom ? !stateChatroom.active : !this.props.chatroom.active;
    const { name, description, latitude, longitude, locationName, date, time, price, contact } = stateChatroom ? stateChatroom : this.props.chatroom;
    const id = stateChatroom ? stateChatroom._id : this.props.chatroom.variables._id;

    const chatroom = {name, description, latitude, longitude, locationName, active, date, time, price: parseInt(price), contact };

    const msg = active ? "/INFO:\nChatroom is enabled by the owner" :  "/INFO:\nChatroom is disabled by the owner";
    
    return (
      this.props.updateChatroom({
        variables: { chatroom, chatroomId: id }
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

      const stateChatroom = this.state.chatroom;
      const id = stateChatroom ? stateChatroom._id : this.props.chatroom.variables._id;

      const { tempTitle, tempDesc, tempDate, tempTime, tempPrice, tempContact } = this.state;

      if(chatroom.name===tempTitle && chatroom.description===tempDesc &&
        chatroom.date===tempDate && chatroom.time===tempTime &&
        chatroom.price===tempPrice && chatroom.contact===tempContact) {
        this.toggleEditModal();
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

      this.toggleEditModal();
      
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


  renderEditModal() {
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
        closeModal={this.toggleEditModal}>
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


  toggleHelpModal = () => {
    this.setState({modalHelpOpen: !this.state.modalHelpOpen});
  }   


  renderHelpModal = () => {
    const modalOpen = this.state.modalHelpOpen;
    const modalHeading = "Commands";
    const modalDesc = "Commands which you can type in a message to HelpBot:";

    return (
      <Modal
        id="help_commands_modal"
        heading={modalHeading}
        desc={modalDesc}
        modalOpen={modalOpen}
        closeModal={this.toggleHelpModal}>
        <div className="modal__textarea">
          {this.state.commandsDescription}
        </div>
        <Button 
          variant="primary" 
          type="submit" 
          additionalClass="modal__btn" 
          onClick={this.toggleHelpModal}>I understand</Button>
      </Modal>
    );
  }


  toggleDeleteModal = () => {
    this.setState({modalDeleteOpen: !this.state.modalDeleteOpen});
  };


  deleteEvent = () => {
    const id = this.state.chatroom ? this.state.chatroom._id : this.props.chatroom.variables._id;

    this.props.deleteChatroom({
      variables: { chatroomId: id }
    });
  }


  renderDeleteModal = () => {
    const modalOpen = this.state.modalDeleteOpen;
    const chatroom = this.state.chatroom ? this.state.chatroom : this.props.chatroom;
    const modalHeading = "Delete \"" + chatroom.name + "\"?";
    const modalDesc = "Do you want to delete this event? All messages will be lost!";

    return (
      <Modal
        id="delete_commands_modal"
        heading={modalHeading}
        desc={modalDesc}
        modalOpen={modalOpen}
        closeModal={this.toggleDeleteModal}>
        <Button 
          variant="primary" 
          type="submit" 
          additionalClass="modal__btn" 
          onClick={this.deleteEvent}>Yes, I know what I'm doing!</Button>
        <Button 
          variant="primary" 
          type="submit" 
          additionalClass="modal__btn" 
          onClick={this.toggleDeleteModal}>No, take me away from here!</Button>
      </Modal>
    );
  }


  checkEventExists = () => {
    this.props.history.push("/");
    message.error("Event is deleted or not exists!");
  }


  render() {
    const { inputMessageText } = this.state;
    let { match, chatroom } = this.props;

    if (this.state.chatroom)
      chatroom = this.state.chatroom;

    console.log(chatroom.name)

    //this.checkEventExists(chatroom);  //--------------------------------------------------TODO: check if event exists - if chatroom.name is set or sth like that 

    return (
      <div className="page">
        {/* {chatroom && chatroom.name ? 
        <> */}
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
                  <Button additionalClass="chat__back" onClick={() => this.toggleEditModal()}>Edit Event</Button>
                  <Button additionalClass="chat__back" onClick={() => this.toggleDeleteModal()}>Delete Event</Button></span>
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
                <img src={ question } className="chat__img" alt="" onClick={() => this.toggleHelpModal()} />
                <Button variant="primary" additionalClass="chat__btn">Send</Button>
              </form>
            </div>
          </div>
        </section>
        {this.renderEditModal()}
        {this.renderHelpModal()}
        {this.renderDeleteModal()}
        {/* </>
          : this.checkEventExists()} */}
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

const withDeleteChatroom = graphql(DELETE_CHATROOM, { name: "deleteChatroom"});

export default compose(withCurrentChatroom, withAddMessage, withUpdateChatroom, withDeleteChatroom)(withSocket(withUserContext(Chat)));