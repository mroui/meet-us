import {Resolver, Query, Arg, Mutation, Authorized, Ctx, ID, InputType, Field as GQLField} from "type-graphql";
import { ChatRoomService } from "./ChatRoomService";
import { ChatRoom } from "./ChatRoomEntity";
import { Context } from "../common/context";
import { User } from '../user/UserEntity'
import { Ref } from "typegoose";
import socketIO from '../../socketIO';

@InputType()
class CreateChatRoomInput implements Partial<ChatRoom> {

  @GQLField()
  name: string;

  @GQLField(type => String, { nullable: true })
  description?: string;

  @GQLField()
  latitude: Number;

  @GQLField()
  longitude: Number;

  @GQLField()
  locationName: String;

  @GQLField()
  active: Boolean;

  @GQLField()
  date: String;

  @GQLField()
  time: String;

  @GQLField()
  price: Number;

  @GQLField()
  contact: String;

  @GQLField()
  createdAt: Date;

}


@Resolver(ChatRoom)
export default class ChatRoomResolver {
  private readonly service: ChatRoomService;

  constructor() {
    this.service = new ChatRoomService();
  }

  @Query(returns => ChatRoom, { description: "Get ChatRoom by id" })
  async chatroom(@Arg("_id") passedId: string) {
    if (passedId) {
      return await this.service.findOneById(passedId);
    }
  }

  @Query(returns => [ChatRoom], { description: "Get list of all chatrooms" })
  async chatrooms() {
    return await this.service.find();
  }

  @Query(returns => [ChatRoom], { description: "Get list of all user chatrooms" })
  @Authorized()
  async myChatrooms(@Ctx() ctx: Context) {
    if (ctx.userId) {
      return await this.service.find({ owner: ctx.userId });
    }
  }

  @Mutation(returns => ChatRoom, { description: "Adds user to existing chatroom" })
  @Authorized()
  async joinToEvent(@Arg("chatroom") chatroom: string, @Ctx() ctx: Context) {
    return await this.service.joinToEvent(chatroom, ctx.userId)
  }

  @Mutation(returns => ChatRoom, { description: "Remove user from existing chatroom" })
  @Authorized()
  async leaveEvent(@Arg("chatroom") chatroom: string, @Ctx() ctx: Context) {
    return await this.service.leaveEvent(chatroom, ctx.userId)
  }

  @Mutation(returns => ID, { description: "Creates and return new chatroom id" })
  @Authorized()
  async createNewChatroom(
      @Arg("chatroom", returns => CreateChatRoomInput) chatroom: CreateChatRoomInput,
      @Ctx() ctx: Context) {
      return await this.service.createNewChatroom(chatroom, ctx.userId)
  }

  @Mutation(returns => ChatRoom, { description: "Update and return new chatroom"})
  async updateChatroom(
    @Arg("chatroom", returns => CreateChatRoomInput) chatroom: CreateChatRoomInput,
    @Arg("chatroomId", returns => String) chatroomId: String){

      const {socket} = await socketIO();
      return await this.service.updateChatroom(chatroom, chatroomId)
          .then((chatroom) => { 
            socket.to(chatroomId).emit("chatroomUpdate", chatroom);
              return chatroom
          })
          .catch((e) => console.log('e: ', e));
  }

  @Mutation(returns => Boolean, {description: "Delete chatroom by ID"})
  async deleteChatroom(@Arg("chatroomId", returns => String) chatroomId: String){

    const {socket} = await socketIO();
    return await this.service.deleteChatroom(chatroomId)
          .then(() => {socket.to(chatroomId).emit("chatroomDelete"); return true;})
          .catch((e) => console.log('e: ', e));
  }
}
