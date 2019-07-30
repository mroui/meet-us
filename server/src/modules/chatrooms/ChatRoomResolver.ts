import {Resolver, Query, Arg, Mutation, Authorized, Ctx, ID, InputType, Field as GQLField} from "type-graphql";
import { ChatRoomService } from "./ChatRoomService";
import { ChatRoom } from "./ChatRoomEntity";
import { Context } from "../common/context";
import { User } from "../user/UserEntity";
import { Ref } from "typegoose";

@InputType()
class CreateChatRoomInput implements Partial<ChatRoom> {
  @GQLField(type => String)
  name: string;

  @GQLField({ nullable: true })
  description?: string;

  @GQLField(type => Number)
  latitude: Number;

  @GQLField(type => Number)
  longitude: Number;

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
    // DK: All should be all, app gives no way to verify an chatroom ATM
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
  async joinToChatroom(@Arg("chatroom") chatroom: string, @Ctx() ctx: Context) {
    return await this.service.joinToChatroom(chatroom, ctx.userId)
  }

  @Mutation(returns => ID, { description: "Creates and return new chatroom id" })
  @Authorized()
  async createNewChatroom(
      @Arg("chatroom", returns => CreateChatRoomInput) chatroom: CreateChatRoomInput,
      @Ctx() ctx: Context) {
      return await this.service.createNewChatroom(chatroom, ctx.userId)
  }

  @Mutation(returns => ChatRoom, { description: "Update and return new chatroom"})
  async updateActivityChatroom(
    @Arg("chatroom", returns => String) chatroom: string,
    @Arg("active") active: Boolean){
      return await this.service.updateActivityChatroom(chatroom, active)
  }
}
