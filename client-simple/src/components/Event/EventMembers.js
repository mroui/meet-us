import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import { SidebarArea, SidebarItem, SidebarMessage } from "../Sidebar/Sidebar";
import Loader from "../Loader/Loader";
import withSocket from "../../components/withSocket";
import _ from "lodash";
import withUserContext from "../withUserContext";

class EventMembers extends Component {
    state = {
      eventMembers: null
    };
    
    componentDidUpdate = async () => {
      await this.handleJoiningToChannelMutation();
    }

    handleJoiningToChannelMutation = () => {
      if (this.props.joinPerson || (this.props.chatroom.owner && (this.props.chatroom.owner._id === this.props.loggedUserId))) {

        const {eventMembers} = this.state;
        const {loggedUserId} = this.props;
        const isCurrentUserPresentInChannelUsersArray = !!_.find(eventMembers, (user) => user._id === loggedUserId);
    
        if (!isCurrentUserPresentInChannelUsersArray && loggedUserId) {
          return this.props.joinEvent()
            .then(({ data }) => {
              const {joinToEvent: mutationResponse} = data;
              this.setState({eventMembers: mutationResponse && mutationResponse.members || []});
              this.props.endJoinLeaveEvent();
            })
            .catch((e) => console.log(`e: `, e));
        }
        return null;
      } else if (this.props.leavePerson) {
        return this.props.leaveEvent()
          .then(({ data }) => {
            const {leaveEvent: mutationResponse} = data;
            this.setState({eventMembers: mutationResponse && mutationResponse.members || []});
            this.props.endJoinLeaveEvent();
          })
          .catch((e) => console.log(`e: `, e));
      }
    };

    membersList() {
      const {eventMembers: chatRoomUsersFromState} = this.state;
      const {members: chatRoomUsersFromProps} = this.props.chatroom;

      const _properChatroomUsersArr = chatRoomUsersFromState || chatRoomUsersFromProps;
      if (!_properChatroomUsersArr) return <Loader>Loading members...</Loader>;

      if (_properChatroomUsersArr && _properChatroomUsersArr.length) {
        return _properChatroomUsersArr.map(({_id, profile}) => <SidebarItem key={_id} title={`${profile.firstName + " " + profile.lastName}`}/>);
      } else {
        return <SidebarMessage>Seems like nobody's come?</SidebarMessage>;
      }
    }
    
    render() {
      return (
        <SidebarArea heading="Members of event">
          {this.membersList()}
        </SidebarArea>
      );
    }
}

const JOIN_TO_EVENT = gql`
  mutation ($chatroom: String!) {
    joinToEvent(chatroom: $chatroom){
      _id
      name
      members {
        _id
        profile {
          firstName
          lastName
        }
      }
    }
  }
`;

const LEAVE_EVENT = gql`
mutation($chatroom: String!) {
  leaveEvent(chatroom: $chatroom){
    _id
    members {
      _id
      profile {
        firstName
      }
    }
  }
}
`;

const withJoinToEvent = graphql(JOIN_TO_EVENT, {name: "joinEvent", options: (props) => ({ variables: { chatroom: props.match.params.chatId }})});
const withLeaveEvent = graphql(LEAVE_EVENT, {name: "leaveEvent", options: (props) => ({ variables: { chatroom: props.match.params.chatId }})});

export default compose(withJoinToEvent, withLeaveEvent)(withUserContext(withSocket(EventMembers)));
