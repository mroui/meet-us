import React, { Component } from "react";
import "./SortBar.style.scss";


class SortBar extends Component {
  
  state = {
    sortOptions: [
      "Added date: the oldest",
      "Added date: the newest",
      "Date: the latest",
      "Date: the earliest",
      "Location: the nearest",
      "Location: the farthest",
      "Price: the cheapest",
      "Price: the expensive ones",
      "Popular: the most",
      "Popular: the least"
    ]
  }

  sortDateLatest = (a, b) => {
    return a.date > b.date ? -1 : a.date < b.date ? 1 : a.time <= b.time ? 1 : -1;
  }

  sortDateEarliest = (a, b) => {
    return a.date < b.date ? -1 : a.date > b.date ? 1 : a.time >= b.time ? 1 : -1;
  }

  sortPriceCheapest = (a, b) => {
    return a.price >= b.price ? 1 : -1;
  }

  sortPriceExpensive = (a, b) => {
    return a.price < b.price ? 1 : -1;
  }

  sortLocationNearest = (a, b, coords) => {
    const first = this.getDistanceFromLatLonInKm(a.latitude, a.longitude, coords.latitude, coords.longitude);
    const second = this.getDistanceFromLatLonInKm(b.latitude, b.longitude, coords.latitude, coords.longitude);
    return first >= second ? 1 : -1;
  }

  sortLocationFarthest = (a, b, coords) => {
    const first = this.getDistanceFromLatLonInKm(a.latitude, a.longitude, coords.latitude, coords.longitude);
    const second = this.getDistanceFromLatLonInKm(b.latitude, b.longitude, coords.latitude, coords.longitude);
    return first <= second ? 1 : -1;
  }

  sortPopularMost = (a, b) => {
    return a.members.length <= b.members.length ? 1 : -1;
  }

  sortPopularLeast = (a, b) => { 
    return a.members.length >= b.members.length ? 1 : -1;

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

  sortList = (event) => {
    let chatrooms = this.props.chatrooms;
    let newChatrooms = [];
    var keys = Object.keys(chatrooms);
    keys.forEach(function(key){
      newChatrooms.push(chatrooms[key]);
    });

    switch(event.target.value) {
    case this.state.sortOptions[0]: {
      break;
    }
    case this.state.sortOptions[1]: {
      newChatrooms = newChatrooms.reverse();
      break;
    }
    case this.state.sortOptions[2]: {
      newChatrooms = newChatrooms.sort(this.sortDateLatest);
      break;
    }
    case this.state.sortOptions[3]: {
      newChatrooms = newChatrooms.sort(this.sortDateEarliest);
      break;
    }
    case this.state.sortOptions[4]: {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          newChatrooms = newChatrooms.sort((a,b) => this.sortLocationNearest(a, b, position.coords));
          this.props.setSortedChatrooms(newChatrooms);
        });
      }
      break;
    }
    case this.state.sortOptions[5]: {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          newChatrooms = newChatrooms.sort((a,b) => this.sortLocationFarthest(a, b, position.coords));
          this.props.setSortedChatrooms(newChatrooms);
        });
      }
      break;
    }
    case this.state.sortOptions[6]: {
      newChatrooms = newChatrooms.sort(this.sortPriceCheapest);
      break;
    }
    case this.state.sortOptions[7]: {
      newChatrooms = newChatrooms.sort(this.sortPriceExpensive);
      break;
    }
    case this.state.sortOptions[8]: {
      newChatrooms = newChatrooms.sort(this.sortPopularMost);
      break;
    }
    case this.state.sortOptions[9]: {
      newChatrooms = newChatrooms.sort(this.sortPopularLeast);
      break;
    }
    }
    this.props.setSortedChatrooms(newChatrooms);
  }


  render() {
    return (
      <div className="bar">
        <h3>Sort by:</h3>
        <select className="bar__select" onChange={this.sortList}>
          {this.state.sortOptions.map( (title, index) => {
            return <option key={index} value={title}>{title}</option>;
          })}
        </select>
      </div>
    );
  }
}

export default SortBar;
