<p align="center">
  <img src="./client-simple/src/assets/images/only-logo.png" width="100px" alt="MeetUs logo"/>
</p>
<h1 align="center">
	MeetUs
</h1>

> Web application, event calendar with chat feature pointed in every possible place in the world. Growing community and archive of events from the whole world.

*Project was made as a part of an internship education in [TDSoft](https://tdsoft.pl). Developers from company have created a basic chat application with geolocation and basic database. My task was to expand the whole project with my own idea.*

## Table of contents
* [Introduction](#introduction)
* [Presentation](#presentation)
* [Aims](#aims)
* [Technologies](#technologies)
* [Database](#database)
* [Features](#features)
* [Development](#development)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Documentation](#documentation)
* [Credits](#credits)
* [License](#license)

## Introduction
**MeetUs** is an web application which is kind of an **events calendar** with a chat messenger function. 
</br>
Each user can **create his own account**, **add event, meetup** and **browse those added by the others** with **chat option**, which is assigned to each created event. Every chat is **placed in specific area by pin on a map**.
</br>
**Events**, in the meaning those **greater** like concerts, presentations or those **smaller, more private** like running together, looking for people for a trip etc. It can be any kind or category - *anything for what you need to gather people*.
</br>
**The chat** is so useful, that it allows to **create a community** with people with **common interests**, **meet new people**, **ask questions** and **discuss**. What is more, all of this creates an **archive** - events can be reactivated and **all photos, all discussions will be waiting for old and the new one participants**.
</br>
Every event can be **searched by set filters** (and then **sorted** by basic values) or by **searching on a real map**.
</br>
A user without an account has **limited functions** reduced to viewing events and participating in chats. Access to all of the features has person with **created account**. More options related to **event management** is available when user set up his own event.
</br>
To help users obtain informations about events, there is available a **helpbot that responds to special commands**.
</br>
**Community is created by members**, their **messages** and also **photos** which they can share by send url. It is also available to use **emoji** to express users' emotions more clearly. :blush: :heart:
</br>
Project includes **client** side *(React + ES6)* and also **server** side *(Node.js (Typescript) + GraphQL)* communicating with each other by *Apollo GraphQL*.
</br>
An application was tested with *node.js 10* and corresponding *npm 6*.
</br>
For the proper operation of an application, **internet connection is required** and **access location permission**.
</br>

## Presentation
[Full presentation in PDF](/presentation/meetus-presentation.pdf)

## Aims
* Primarily, development of a working web application that meets the project idea.
* Development and analysis of functionalities that should be included in this type of application, what possibilities should be preserved, which could be added as additional, facilitating navigation on the site, etc.
* The database, and more precisely the orientation of the supplied application database by mentors on internship for the main idea.
* User Experience and User Interface, and more precisely the creation of an intuitive interface with the necessary additional functionalities at which potential users would stay for longer and to which they would gladly return. This kind of application does not necessarily need to "hold" the user - they can only use such an event app to join to events and my goal is to keep them for longer.
* Creation a kind of community. Users have at their disposal a chat, where they can meet new people or discuss. The chat itself leads to the creation of a "story", an archive of events with participants and their messages. It is also possible to add pictures' urls e.g. pictures from the event. In addition, if an event is periodic, an owner can simply deactivate the chat and reactivate it after a certain period of time. All history, archive and community are available all the time.
* Evolution, or more specifically to create a product that can be further expanded, developed with new functionalities. In addiction, I want to make money on this product.

## Technologies
The enormity of technologies selected in terms of popularity and functionality, providing the best solutions based on this project.
* Node.js 10.15.3
* Javascript (ES6)
* Typescript 3.5.1
* React 16.8.6
* MongoDB 4.0.11
* Mongoose 5.5.12
* Typegoose 5.6.0
* GraphQL 14.4.0
* TypeGraphQL 0.17.4
* Apollo Server Express 2.7.0
* Socket.io 2.2.0
* Account.js 0.13.0
* EsLint 5.12.0
* antd 3.20.3
* Webpack 4.28.3
* React Google Maps 9.4.5
* React Router Dom 5.0.1
* Emoji Mart 2.11.1

## Database
The database mainly consists of three main models: user, event and messages.
* User - Everyone has their unique ID, profile, which consists of first name and last, has an array of email addresses in case of, for example, their changes and we have two fields informing about the date of account creation and the date of possible updating.
* Event - more extensive model with a unique id, title or name and description. There is also the list of members, participants, owner, event activity, latitude and longitude which can be get after setting the place on a map, and the name of the location e.g. street, city, country.
Next, there is date, time and price fields and a contact -  i.e. some form of contact if interested persons want to personally ask for something, e.g. email address, phone number. And the last there is a date field that the event was created.
* Message - it is about the message in the event chat. Here we have following fields: ID, message content, event to which it is assigned, from whom the message is sent, possible guest id in the case of a user without an account, by analogy the name of the guest and of course date of creation and possible update fields.

## Features
* Creating an account with intuitive validation
* Two types of users:
  * without created account - guest - access to limited functions like:
    * browsing events
    * searching, sorting, filtering
    * using map
    * taking part in chats
  * with created account - registered - access to all guest functions and addictionally:
    * creating, editing, deleting, deactivating own events
    * joining to events
    * creating lists with own events and those joined
* Guest is identified by set nickname, user with account by name
* Sorting events by: added date, event date, location, price, popularity
* Quick search by title
* Filtering events by: chatroom activity, key words, tags, max distance, scopes of: dates, times, prices
* Browsing the map with placed events by pin on the whole world, what additionally allows to view the statistics about the most popular places
* Creating own event: title, event name, optional description, date, time, price (which can be also equal to 0), contact details (e.g. email address or phone number) and event location, which is set pin on a map
* Access to event details and all functions on chatroom, like:
  * Chat field, messages, photos, urls
  * Members list
  * Emoji
  * Commands to get to know about event's informations
  * Access to *secret command* `/joke` 
  * Helpbot assistance
  * Sending photos by url
* Creating communities and archives on each chat
* Joining to events and becoming one of the members
* Leaving event and list of members
* As event's owner, additionally there is possibility to:
  * Activating/Deactivating event
  * Removing event forever!

## Development
An application is created to have opportunity to develop it with new functionalities - aimed in events and organizations or more in chat, communicator and help.
A few functionalities that can develop application:
* **Event categories** - something that can be easier way to find what interests people and it is kind of event organization
* **Users' profiles** - something what can deepen the communities that are created here, interest and could keep users for longer
* **Notifications** - e.g. reminds that event starting soon, notification about edited informations or someone added message to chat
* **Paid promotion, subscription** - the fee for event advertisement to be more higher on search list, which results in a wider availability of reception and popularity
...And more. The project is quite universal, there are a lot of possibilities and ideas that can be implemented to develop an application.

## Screenshots
##### ...IN PROGRESS...

## Setup
* [Install Node.js](https://nodejs.org/en/download/)
* Clone repository
```
git clone https://github.com/mroui/meet-us.git
```
* Enter the main folder `meet-us`
```
cd meet-us
```
* Update npm, just in case (Node Package Manager, it comes with node.js installation)
```
npm install -g npm
```
* Run command to install all needed packages
```
npm run install:all
```

##### ...IN PROGRESS...

## Documentation
More about communication sites in those README files:
- [Serwer](/server/README.md)
- [Client](/client-simple/README.md)

## Credits
##### ...IN PROGRESS...

## License
##### ...IN PROGRESS...