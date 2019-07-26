import {
    Resolver,
    Query,
    Arg,
    Mutation,
    ID,
    Ctx,
    InputType,
    Field as GQLField,
    FieldResolver as GQLFieldResolver,
    Root,
    Info
} from "type-graphql";
import { MessageService } from "./MessageService";
import { Message } from "./MessageEntity";
import {ChatRoom} from '../chatrooms/ChatRoomEntity';
import {Ref} from "typegoose";
import {Context} from "../common/context";
import socketIO from '../../socketIO';
import UserModel, {User} from "../user/UserEntity";
import {GraphQLResolveInfo} from "graphql";

@InputType()
class MessageInput implements Partial<Message> {
    @GQLField(type => String, {nullable: true})
    guestId: String

    @GQLField(type => String, {nullable: true})
    guestName: String

    @GQLField(type => String)
    msg: String

    @GQLField(type => ID)
    chatroom: Ref<ChatRoom>

    @GQLField(type => String)
    nickname: String
}

function TODO__EXTRACTTOUTILS__IsDBLookupNeeded({fieldNodes: [node]}) {
    const {selectionSet: {selections}} = node;
    const requiredPaths = selections.map(sel => sel.name.value);
    return !!requiredPaths.filter(path => path !== "_id").length;
}
@Resolver(of => Message)
export default class MessageResolver {
  private readonly service: MessageService;

  constructor() {
    this.service = new MessageService();
  }

    @GQLFieldResolver()
    async from(@Root() msg: Message, @Ctx() ctx: Context, @Info() info: GraphQLResolveInfo) {
        // @ts-ignore
        const doDBLookup = TODO__EXTRACTTOUTILS__IsDBLookupNeeded(info);
        const value = (doDBLookup)
            ? UserModel.findById(msg.from).exec()
            : Promise.resolve({_id: msg.from});
        console.log(`UseDB: ${doDBLookup}`, await value);
        return value;
    }
  //TODO: remove ts-ignore
  @Query(returns => [Message], {description: "Get all messages for specified chatroom by chatroomId", nullable: true})
  async messages(@Arg('chatroom') chatroom: String, ) {
    if (chatroom) {
      // @ts-ignore
        return await this.service.find({ chatroom });
    }
    return null
  }

  @Mutation(returns => ID, { description: "Adds new message to chatroom", nullable: true })
  async addMessage(@Arg('message') message: MessageInput, @Ctx() ctx: Context) {
    const {msg, chatroom, guestId, guestName} = message;
    const {userId = null, user} = ctx;

      const {socket} = await socketIO();
      return await this.service.addMessage(userId, msg, chatroom, guestId, guestName)
          .then(({_id: messageId, msg, chatroom, guestId, guestName, createdAt}) => {
              const nickname = guestName || user.profile.firstName;
              const _userId = guestId || userId;
              socket.to(chatroom).emit("message", {_id: messageId, from: {_id: _userId, nickname}, msg, createdAt});
              return messageId
          })
          .catch((e) => console.log('e: ', e));
  }
}
