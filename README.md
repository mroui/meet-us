<p align="center">
  <img src="./client-simple/src/assets/svg/logo.svg" width="200px" alt="MeetUs logo"/>
</p>

> Web application, event organizer with chat feature pointed in every possible place in the world. Growing community and archive of events from the whole world.

## Table of contents
* [Introduction](#introduction)
* [Features](#features)
* [Technologies](#technologies)
* [Documentation](#documentation)
* [Presentation](#presentation)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Credits](#credits)
* [License](#license)

## Introduction
**MeetUs** is an web application which is kind of a **events calendar** with a chat messenger function. 
</br></br>
Each user can **create his own account**, **add event, meetup** and **browse those added by the others** with **chat option**, which is assigned to each created event. Every chat is **placed in specific area by pin on a map**.
</br></br>
**Events** in the meaning those greater like concerts, presentations or those smaller, more private like running together, looking for people for a trip etc.
</br></br>
**The chat** is so useful that it allows to **create a community** with people with **common interests**, **meet new people**, **ask questions** and **discuss**. What is more, all of this creates an **archive** - events can be reactivated and **all photos, all discussions will be waiting for old and the new one participants**.
</br></br>
Every event can be **searched by set filters** (and then **sorted** by basic values) or by **searching on a real map**.
</br></br>
A user without an account has **limited functions** reduced to viewing events and participating in chats. Access to all of the features has person with **created account**. More options related to **event management** is available when user set up his own event.
</br></br>
To help users obtain informations about events, there is available a **help bot that responds to special commands**.
</br></br>
**Community is created by members**, their **messages** and also **photos** which they can share by send url. It is also available to use **emoji** to express users' emotions more clearly. :blush: :heart:
</br></br>
Project includes client side *(React + ES6)* and also server side *(Node.js (Typescript) + GraphQL)* communicating with each other by *Apollo GraphQL*.
</br></br>
An application was tested with *node.js 10* and corresponding *npm 6*.
</br></br>
For the proper operation of an application, **internet connection is required** and **access location permission**.
</br></br>
*Project was made as a part of an internship education in [TDSoft](https://tdsoft.pl). Developers from company have created a basic chat application with geolocation and basic database. My task was to expand the whole project with my own idea.*


///////////////////////////////////////////////////////
# Local-Chat App

Projekt zawiera zarówno kod aplikacji klienta (React + ES6) jak i serwera (Node.js (Typescript) + GraphQL) komunikujące się za pomocą Apollo GraphQL. 
Ten folder to dobre miejsce by uruchomić komendę `npm run install:all`, ale wiecej nt. projektu można poczytać w readme poszczególnych stron komunikacji.

## Dokumentacja dla Backendu i Frontendu
- [Serwer](/server/README.md)
- [Klient](/client-simple/README.md)

### Informacje nt. środowiska
Projekt był sprawdzany dla node.js w wersji 10 (i odpowiadającemu mu npm w wersji 6)
