import React, { Component } from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { message } from "antd";
import * as short from "short-uuid";
import _ from "lodash";
import Sidebar, {SidebarArea, SidebarItem, SidebarMessage} from "../../components/Sidebar/Sidebar";
import ChannelItem from "../../components/ChannelItem/ChannelItem";
import Modal from "../../components/Modal/Modal";
import { FormInput } from "../../components/Form/Form";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import Legend from "../../components/Legend/Legend";
import Toggler from "../../components/Toggler/Toggler";
import MapChatrooms from "../../components/GoogleMaps/MapChatrooms/MapChatrooms";
import withUserContext from "../../components/withUserContext";
import "./Home.style.scss";
import SortBar from "../../components/SortBar/SortBar";
import SearchBar from "../../components/SearchBar/SearchBar";

class Home extends Component {
  state = {
    username: "",
    modalOpen: false,
    channelID: null,
    mapVisible: false,
    isUserLogged: false,
    sortDate: false,
    sortDistance: false,
    sortPrice: false,
    sortDateAdded: false,
    sortedChatrooms: []
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // DK: Maybe make it less deeper in withUserContext (props.userState) and then skip whole method
    if (!this.state.isUserLogged && _.get(nextProps, ["context", "userState", "user", "id"], false)) {
      this.setState({isUserLogged: true});
    }
    this.props.data.refetch();
  }

  componentDidMount () {
    this.props.data.refetch();
  }

  renderModal() {
    const { username, modalOpen } = this.state;
    const guestID = localStorage.getItem("guest_ID");
    const guestUsername = localStorage.getItem("guest_Username");
    const modalDesc = (guestID && guestUsername) ? "Welcome back. Your login is set to:" : "Please enter your username before showing the event";

    return (
      <Modal
        id="join_channel"
        heading="Hi Guest!"
        desc={modalDesc}
        modalOpen={modalOpen}
        closeModal={() => this.toggleModal(null)}>
        <form className="form" onSubmit={this.setGuestData}>
          {(guestID && guestUsername) ? (
            <span className="modal__login">{guestUsername}</span>
          ) : (
            <FormInput
              label="Your username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={e => this.setState({username: e.target.value})}
            />
          )}
          <Button variant="primary" type="submit" additionalClass="modal__btn">Show event</Button>
        </form>
      </Modal>
    );
  }
  

  setGuestData = e => {
    e.preventDefault();
    const { username, channelID } = this.state;
    const shortUUID = short.generate();
    const guestID = localStorage.getItem("guest_ID");
    const guestUsername = localStorage.getItem("guest_Username");

    if (!guestID || !guestUsername) {
      if (!username.length) {
        return message.error("You must enter username before showing the event");
      }

      if (username.length < 4) {
        return message.error("Your username is too short");
      }

      localStorage.setItem("guest_ID", shortUUID);
      localStorage.setItem("guest_Username", username);
    }

    // Go to the channel
    this.props.history.push(`/chat/${channelID}`);
  }

  toggleMapView = () => { 
    this.setState({ mapVisible: !this.state.mapVisible });
  }

  toggleModal = channelID => {
    this.setState({
      username: "",
      modalOpen: !this.state.modalOpen,
      channelID: channelID
    });
  }

  renderLoggedUserEvents = (whichEvents) => {
    const { isUserLogged } = this.state;
    const { chatrooms, loading, error } = this.props.data;
    const { user } = this.props.context.userState;

    if (loading && isUserLogged) return <Loader>Loading events...</Loader>;
    if (error || !isUserLogged) return null;

    switch(whichEvents) {
    case "yours": {
      const loggedUserEvents = chatrooms.filter(chatroom => chatroom.owner._id === user.id);
      if (loggedUserEvents.length > 0) {
        return loggedUserEvents.map(({ _id, name }) => <SidebarItem key={_id} title={name} url={`/chat/${_id}`} exitUrl="/"/>);
      } else return <SidebarMessage>You don't have any events yet</SidebarMessage>;
    }
    case "joined": {
      let userJoinedEvents = [];
      const notOwnerEvents = chatrooms.filter(chatroom => chatroom.owner._id !== user.id);
      //not really optimal :v
      notOwnerEvents.map((chatroom) => {
        chatroom.members.map(member => {
          if (member._id === user.id) return userJoinedEvents.push(chatroom);
        });
      });
      
      if (userJoinedEvents.length > 0) {
        return userJoinedEvents.map(({ _id, name }) => <SidebarItem key={_id} title={name} url={`/chat/${_id}`} exitUrl="/"/>);
      } else return <SidebarMessage>You don't join any events yet</SidebarMessage>;
    }
    }
  };

  renderAllChatrooms = () => {
    const { mapVisible } = this.state;
    const { userState } = this.props.context;
    let { chatrooms, loading, error } = this.props.data;
    if (this.state.sortedChatrooms.length) chatrooms = this.state.sortedChatrooms;

    if (loading) return <Loader isDark>Loading events...</Loader>;
    if (error) return null;

    if (chatrooms && chatrooms.length) {
      return mapVisible ? (
        // Show map
        <MapChatrooms chatrooms={chatrooms} />
      ) : (
        // Show chatrooms
        <div className="chatrooms">
          {chatrooms.map(({ _id, name, members, active, date, locationName }) => (
            <ChannelItem 
              key={_id} id={_id} 
              title={name} 
              url={`/chat/${_id}`} 
              members={(members && members.length) || 0} 
              active={active} 
              toggleModal={this.toggleModal}
              date={date}
              locationName={locationName}
              isLogged={!!userState.user} 
            />
          ))}
        </div>
      );
    }
    return <div>There are no events at the moment</div>;
  };

  setSortedChatrooms = (sortedChatrooms) => {
    this.setState({sortedChatrooms: sortedChatrooms});
  }

  render() {
    const { mapVisible } = this.state;
    const { userState } = this.props.context;
    const { chatrooms } = this.props.data;

    return (
      <div className="page">
        <Sidebar userName={null}>
          {userState.user && (
            <>
              <SidebarArea heading="Your Events">
                {this.renderLoggedUserEvents("yours")}
              </SidebarArea>
              <div className="page__separator"/>
              <SidebarArea heading="Joined Events">
                {this.renderLoggedUserEvents("joined")}
              </SidebarArea>
            </>
          )}
        </Sidebar>

        <section className={mapVisible ? "page__content chatrooms-map__content" : "page__content"}>
          <header className="page__header">
            <h2 className="page__heading">Event List</h2>
            <Toggler isChecked={mapVisible} toggleMap={this.toggleMapView} />
            {!mapVisible && <SortBar chatrooms={chatrooms} setSortedChatrooms={this.setSortedChatrooms}/> }
            {!mapVisible && <SearchBar chatrooms={chatrooms} setSortedChatrooms={this.setSortedChatrooms}/> }
          </header>
          {!mapVisible && <Legend/>}

          <div className={mapVisible ? "page__wrapper chatrooms-map__wrapper" : "page__wrapper"}>
            {this.renderAllChatrooms()}
          </div>
        </section>

        {this.renderModal()}
      </div>
    );
  }
}

const GET_CHATROOMS = gql`
  query {
    chatrooms {
      _id
      name
      description
      members {
        _id
      }
      owner {
        _id
      }
      date
      time
      latitude
      longitude
      locationName
      active
      price
    }
  }
`;

const withAllChatrooms = graphql(GET_CHATROOMS);

export default compose(withAllChatrooms)(withUserContext(Home));