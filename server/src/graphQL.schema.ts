import { buildSchema } from "type-graphql";
import { TypegooseMiddleware } from "./middleware/typegoose";
import { authChecker } from "./modules/user/authChecker";

import UserResolver from "./modules/user/UserResolver";
import MessageResolver from "./modules/messages/MessageResolver";
import ChatRoomsResolver from "./modules/chatrooms/ChatRoomResolver";

const getAPIGraphQLSchema = async () => await buildSchema({
  resolvers: [UserResolver, MessageResolver, ChatRoomsResolver],
  globalMiddlewares: [TypegooseMiddleware],
  // scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  validate: false,
  emitSchemaFile: true,
  authChecker,
});

export default getAPIGraphQLSchema;
