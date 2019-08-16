import React, { Component } from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { message } from "antd";
import * as short from "short-uuid";
import _ from "lodash";
import Sidebar, {SidebarArea, SidebarItem, SidebarMessage} from "../../components/Sidebar/Sidebar";
import ChannelItem from "../../components/ChannelItem/ChannelItem";
import Modal from "../../components/Modal/Modal";
import { FormInput, FormRadios, FormInputSelect, FormInputBetween } from "../../components/Form/Form";
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
    sortedChatrooms: [],
    openFilterModal: false,

    filterTags: "",
    filterActivity: "",
    filterDistance: "",
    filterDateFrom: "",
    filterDateTo: "",
    filterTimeFrom: "",
    filterTimeTo: "",
    filterPriceFrom: "",
    filterPriceTo: ""
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

  toggleFilterModal = () => {
    this.setState({openFilterModal: !this.state.openFilterModal});
  }

  handleFilterActivity = (e) => {
    if (this.state.filterActivity === e.target.value) {
      this.setState({filterActivity: ""});
      document.getElementsByName("activity").forEach(radio => { radio.checked = false; });
    } else {
      this.setState({filterActivity: e.target.value});
    }
  }

  handleFilterTags = (e) => {
    this.setState({filterTags: e.target.value});
  }

  handleFilterDistance = (e) => {
    this.setState({filterDistance: e.target.value});
  }

  handleFilterDateFrom = (e) => {
    this.setState({filterDateFrom: e.target.value});
  }

  handleFilterDateTo = (e) => {
    this.setState({filterDateTo: e.target.value});
  }

  handleFilterTimeFrom = (e) => {
    this.setState({filterTimeFrom: e.target.value});
  }

  handleFilterTimeTo = (e) => {
    this.setState({filterTimeTo: e.target.value});
  }

  handleFilterPriceFrom = (e) => {
    this.setState({filterPriceFrom: e.target.value});
  }

  handleFilterPriceTo = (e) => {
    this.setState({filterPriceTo: e.target.value});
  }

  getDistanceFromLatLonInKm = ( lat1, lon1, lat2, lon2) => {
    const R = 6371; //radius of the earth in km
    const dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad = (deg) => {
    return deg * (Math.PI/180);
  }

  handleFiltering = () => {

    let { chatrooms } = this.props.data;
    let newChatrooms = [];
    var keys = Object.keys(chatrooms);
    keys.forEach(function(key){
      newChatrooms.push(chatrooms[key]);
    });

    const { filterActivity, filterTags, filterDistance, filterDateFrom, filterDateTo, filterTimeFrom, filterTimeTo, filterPriceFrom, filterPriceTo } = this.state;

    const active = filterActivity==="Active" ? true : false;
    const tags = filterTags.replace(/ /g, "").split(",");

    if (filterActivity) {
      newChatrooms = newChatrooms.filter(chatroom => {return chatroom.active === active;});
    }
    if (filterTags) {
      let filtered = [];
      newChatrooms.map(chatroom => {
        tags.map(tag => {
          if (chatroom.name.toLowerCase().includes(tag.toString().toLowerCase()) || chatroom.description.toLowerCase().includes(tag.toString().toLowerCase())) 
            return filtered.push(chatroom);
        });
      });
      newChatrooms = filtered;
    }
    if (filterDistance && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        newChatrooms = newChatrooms.filter(chatroom => {
          const distance = this.getDistanceFromLatLonInKm(chatroom.latitude, chatroom.longitude, position.coords.latitude, position.coords.longitude);
          return distance <= filterDistance;
        });
        this.setSortedChatrooms(newChatrooms);
      });
    }
    if (filterDateFrom) {
      newChatrooms = newChatrooms.filter(chatroom => {return chatroom.date >= filterDateFrom;});
    }
    if (filterDateTo) {
      newChatrooms = newChatrooms.filter(chatroom => {return chatroom.date <= filterDateTo;});
    }
    if (filterTimeFrom) {
      newChatrooms = newChatrooms.filter(chatroom => {return chatroom.time >= filterTimeFrom;});
    }
    if (filterTimeTo) {
      newChatrooms = newChatrooms.filter(chatroom => {return chatroom.time <= filterTimeTo;});
    }
    if (filterPriceFrom) {
      newChatrooms = newChatrooms.filter(chatroom => {return chatroom.price >= filterPriceFrom;});
    }
    if (filterPriceTo) {
      newChatrooms = newChatrooms.filter(chatroom => {return chatroom.price <= filterPriceTo;});
    }

    this.setSortedChatrooms(newChatrooms);
    this.setState({openFilterModal: !this.state.openFilterModal});
  }

  renderFilterModal = () => { 
    const modalOpen = this.state.openFilterModal;
    const { filterTags, filterDistance, filterDateFrom, filterDateTo, filterTimeFrom, filterTimeTo, filterPriceFrom, filterPriceTo } = this.state;
    const options = [2, 5, 10, 25, 50, 100, 250, 500, 1000];

    return (
      <Modal
        heading="Filter events by:"
        desc="Set properties of event which you want to filter."
        modalOpen={modalOpen}
        closeModal={this.toggleFilterModal}>
        <div className="form">
          <FormRadios
            label="Chatroom activity"
            id="radios"
            val1="Active"
            val2="Inactive"
            title1="Active"
            title2="Inactive"
            onClick={this.handleFilterActivity}/>
          <FormInput
            label="Key words, tags"
            placeholder="After the commas like: cats, dogs, foxes..."
            value={filterTags}
            onChange={this.handleFilterTags}
          />
          <FormInputSelect
            label="Max distance"
            value={filterDistance}
            options={options}
            onChange={this.handleFilterDistance}
          />
          <FormInputBetween
            label="Date"
            id="filterDate"
            type="date"
            val1={filterDateFrom}
            val2={filterDateTo}
            onChangeFrom={this.handleFilterDateFrom}
            onChangeTo={this.handleFilterDateTo}
          />
          <FormInputBetween
            label="Time"
            id="filterTime"
            type="time"
            val1={filterTimeFrom}
            val2={filterTimeTo}
            onChangeFrom={this.handleFilterTimeFrom}
            onChangeTo={this.handleFilterTimeTo}
          />
          <FormInputBetween
            label="Price"
            id="filterPrice"
            type="number"
            val1={filterPriceFrom}
            val2={filterPriceTo}
            min1="0"
            max="10000"
            onChangeFrom={this.handleFilterPriceFrom}
            onChangeTo={this.handleFilterPriceTo}
          />
          <Button variant="primary" additionalClass="modal__btn" onClick={this.handleFiltering}>Filter with my options</Button>
        </div>
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
      //not really optimal :v but how?
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
            {!mapVisible && <Button additionalClass="page__button" type="submit" onClick={this.toggleFilterModal}>Filter Events</Button> }
          </header>
          {!mapVisible && <Legend/>}

          <div className={mapVisible ? "page__wrapper chatrooms-map__wrapper" : "page__wrapper"}>
            {this.renderAllChatrooms()}
          </div>
        </section>

        {this.renderModal()}
        {this.state.openFilterModal && this.renderFilterModal()}
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