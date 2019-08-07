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
    
      componentDidUpdate = async () => await this.handleJoiningToChannelMutation();
    
      handleJoiningToChannelMutation = () => {
        if (this.props.joinNewPerson) {

          const {eventMembers} = this.state;
          const {mutate, loggedUserId} = this.props;
          const isCurrentUserPresentInChannelUsersArray = !!_.find(eventMembers, (user) => user._id === loggedUserId);
      
          if (!isCurrentUserPresentInChannelUsersArray && loggedUserId) {
            return mutate()
              .then(({ data }) => {
                const {joinToEvent: mutationResponse} = data;
                this.setState({eventMembers: mutationResponse && mutationResponse.members || []});
                this.props.endJoiningNewPerson();
              })
              .catch((e) => console.log(`e: `, e));
          }
          return null;
        }
      };
    
      membersList() {
        const {eventMembers: chatRoomUsersFromState} = this.state;
        const {members: chatRoomUsersFromProps} = this.props.chatroom;
    
        const _properChatroomUsersArr = chatRoomUsersFromState || chatRoomUsersFromProps;
        if (!_properChatroomUsersArr) return <Loader>Loading members...</Loader>;
    
        if (_properChatroomUsersArr && _properChatroomUsersArr.length) {
          return _properChatroomUsersArr.map(({_id, profile}) => <SidebarItem key={_id} title={`${profile.firstName}`}/>);
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
        }
      }
    }
  }
`;

const withJoinToChannel = graphql(JOIN_TO_EVENT, {options: (props) => ({ variables: { chatroom: props.match.params.chatId }})});

export default compose(withJoinToChannel)(withUserContext(withSocket(EventMembers)));
