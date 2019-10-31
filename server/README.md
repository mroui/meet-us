# Server
[(Back to main documentation...)](../README.md)

## Table of contents
* [Structure](#structure)
* [Technologies](#technologies)
* [DatabaseSeed](#databaseseed)
* [Conventions](#conventions)

## Structure
Scheme declarations and creating models are located in the folder *./server/src/modules/{name}*, then files are divided into:
- {NameEntity} - schema declarations, their types, relationships and finally generating the Model
- {NameResolver} - resolvers - declarations of Query / Mutation operations that we define and type, GraphQL can automatically and predictably collect data which will be asked from the client
- {NameService} - helper functions that query the database directly and return the data to resolvers

**API**</br>
- Graphql server runs on port `4000` by default
- Endpoint socket.io is available at: http://localhost:{PORT}/socket.io
- Endpoint GraphQL and GraphQLi "playground" for testing is available at: http://localhost:{PORT}/graphql
- Visualizer with schemes and their relationships is available at: http://localhost:{PORT}/visualizer

**Socket.IO**</br>
The `socket.io` initialization function and event handlers are located in the *./server/src/socketIO* folder.

**Server startup**</br>
The server startup file is *./server/src/index.ts* (run by the ts-node module to execute typescript code execution in node.js).
It includes the implementation of apollo-server, connection to the database and calling socket.io initialization function and providing visualizer tool.

**Configuration**</br>
Configuration of the whole project is in *./server/config/index.js*

## Technologies
The language used in this project is [typescript](https://www.typescriptlang.org/) - an object-oriented typed language, that can be still create code in native JavaScript using the `.js` extensions for files. 
there are `GraphQL` and `Mongoose` equivalents:
- [type-graphql](https://typegraphql.ml/)
- [typegoose](https://github.com/szokodiakos/typegoose)

**Database**</br>
Project data is stored in a non-profitable [MongoDB database](https://www.mongodb.com/)

**Server**</br>
The server uses `apollo-server-express` - as the name implies, it is a combination of the [express.js](https://expressjs.com/) and `apollo-graphql`.
Thanks to `apollo`, apart from the apollo server which is responsible for providing data to the client, `socket.io` is also connected to the `express` which is responsible for sending messages in chatrooms.

**GraphQL**</br>
Modern approach to server API. In contrast to the REST definition of endpoints by different URL and HTTP method, GraphQL displays one endpoint that supports mutations and query.

**type-graphql**</br>
Framework on GraphQL that facilitates writing 'schemas' and 'resolvers' in typescript, extending the standard description of the GraphQL API with an object-oriented approach and a set of annotations.

**typegoose**</br>
Based on `mongoose` which provides data model support, can be define fields and object validations by creating a regular javascript object. It also provides full simplified API operations based on MongoDB with asynchronous support (promise).
Typegoose allows to define database models using classes, additional annotations to describe half validation and references to other models (tables).

**socket.io**</br>
Responsible for real-time communication with clients based on WebSocket, in the case of an app for the chat system (including division into channels and sending messages to users of these channels).

**accounts.js**</br>
High level wrapper logic for creating user accounts and their authentication, more: https://accounts-js.netlify.com/

## DatabaseSeed
**This operation will delete all previous data in the database!**
```
npm run seed:db
```
The tool for exporting the database with rigidly specified data is located in the folder *./server/src/tools/seed/index.ts*
It serves primarily to create start data and relationships between them. This data can be modified, respectively for each model, files are sorted by name in the folder ./server/src/tools/data:
- {ModelName}.seed.json - which data in the model key:value is to get
- {ModelName}.refs.json - which fields for THIS model should refer as references to other models, i.e. for Message.refs.json we specify that for their `from` field the reference will be the `User` model, and then in the `query` field, enter the query with the user who will be assigned in this place.
</br>
*Due to the usage of the @accounts library, seeding users with a script is not entirely possible*

## Conventions
The combination of `typegoose` and` type-graphql` provides definitions of both the database model (typegoose) and the definitions of the basic model query in a single file in a declarative way using annotations. An example would be [ChatRoomEntity.ts](server/src/modules/chatrooms/ChatRoomEntity.ts).

*The file has been translated from Polish*